import { useState, useCallback } from "react";
import { Theme, Locale, NotificationChannel, UserPreferences } from "../../src/preferences";

interface Props {
  preferences: UserPreferences;
  onSave: (prefs: Partial<Omit<UserPreferences, "userId">>) => void;
}

export function PreferencesPanel({ preferences, onSave }: Props) {
  const [theme, setTheme] = useState<Theme>(preferences.theme);
  const [locale, setLocale] = useState<Locale>(preferences.locale);
  const [channels, setChannels] = useState<NotificationChannel[]>(
    preferences.notifications.channels
  );
  const [digest, setDigest] = useState(preferences.notifications.digest);

  const handleSave = useCallback(() => {
    onSave({
      theme,
      locale,
      notifications: { channels, digest },
    });
  }, [theme, locale, channels, digest, onSave]);

  const toggleChannel = (ch: NotificationChannel) => {
    setChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  return {
    theme,
    locale,
    channels,
    digest,
    setTheme,
    setLocale,
    toggleChannel,
    setDigest,
    handleSave,
  };
}
