import { UserId } from "./types";
import { ValidationError } from "./errors";

export type Theme = "light" | "dark" | "system";
export type Locale = "en" | "es" | "fr" | "de" | "ja" | "pt";
export type NotificationChannel = "email" | "push" | "sms";

export interface UserPreferences {
  userId: UserId;
  theme: Theme;
  locale: Locale;
  notifications: {
    channels: NotificationChannel[];
    digest: boolean;
    quietHoursStart?: string;
    quietHoursEnd?: string;
  };
  timezone: string;
}

const VALID_THEMES: Theme[] = ["light", "dark", "system"];
const VALID_LOCALES: Locale[] = ["en", "es", "fr", "de", "ja", "pt"];
const VALID_CHANNELS: NotificationChannel[] = ["email", "push", "sms"];
const TIME_PATTERN = /^\d{2}:\d{2}$/;

const store = new Map<UserId, UserPreferences>();

export function getDefaultPreferences(userId: UserId): UserPreferences {
  return {
    userId,
    theme: "system",
    locale: "en",
    notifications: { channels: ["email"], digest: false },
    timezone: "UTC",
  };
}

export function getPreferences(userId: UserId): UserPreferences {
  return store.get(userId) ?? getDefaultPreferences(userId);
}

export function updatePreferences(
  userId: UserId,
  patch: Partial<Omit<UserPreferences, "userId">>
): UserPreferences {
  const current = getPreferences(userId);

  if (patch.theme !== undefined) {
    if (!VALID_THEMES.includes(patch.theme)) {
      throw new ValidationError("theme", `Must be one of: ${VALID_THEMES.join(", ")}`, "INVALID_ENUM");
    }
    current.theme = patch.theme;
  }

  if (patch.locale !== undefined) {
    if (!VALID_LOCALES.includes(patch.locale)) {
      throw new ValidationError("locale", `Must be one of: ${VALID_LOCALES.join(", ")}`, "INVALID_ENUM");
    }
    current.locale = patch.locale;
  }

  if (patch.notifications !== undefined) {
    const n = patch.notifications;
    if (n.channels) {
      for (const ch of n.channels) {
        if (!VALID_CHANNELS.includes(ch)) {
          throw new ValidationError("notifications.channels", `Invalid channel: ${ch}`, "INVALID_ENUM");
        }
      }
      current.notifications.channels = n.channels;
    }
    if (n.digest !== undefined) current.notifications.digest = n.digest;
    if (n.quietHoursStart !== undefined) {
      if (!TIME_PATTERN.test(n.quietHoursStart)) {
        throw new ValidationError("quietHoursStart", "Must be HH:MM format", "FORMAT");
      }
      current.notifications.quietHoursStart = n.quietHoursStart;
    }
    if (n.quietHoursEnd !== undefined) {
      if (!TIME_PATTERN.test(n.quietHoursEnd)) {
        throw new ValidationError("quietHoursEnd", "Must be HH:MM format", "FORMAT");
      }
      current.notifications.quietHoursEnd = n.quietHoursEnd;
    }
  }

  if (patch.timezone !== undefined) {
    current.timezone = patch.timezone;
  }

  store.set(userId, current);
  return current;
}

export function clearPreferencesStore(): void {
  store.clear();
}
