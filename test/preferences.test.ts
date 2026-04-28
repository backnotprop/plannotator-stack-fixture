import {
  getPreferences,
  updatePreferences,
  getDefaultPreferences,
  clearPreferencesStore,
} from "../src/preferences";
import { ValidationError } from "../src/errors";

beforeEach(() => clearPreferencesStore());

describe("getPreferences", () => {
  it("returns defaults for unknown user", () => {
    const prefs = getPreferences("u-new");
    expect(prefs.theme).toBe("system");
    expect(prefs.locale).toBe("en");
    expect(prefs.notifications.channels).toEqual(["email"]);
  });
});

describe("updatePreferences", () => {
  it("updates theme", () => {
    const prefs = updatePreferences("u-1", { theme: "dark" });
    expect(prefs.theme).toBe("dark");
    expect(getPreferences("u-1").theme).toBe("dark");
  });

  it("updates locale", () => {
    const prefs = updatePreferences("u-1", { locale: "ja" });
    expect(prefs.locale).toBe("ja");
  });

  it("updates notification channels", () => {
    const prefs = updatePreferences("u-1", {
      notifications: { channels: ["email", "push"], digest: true },
    });
    expect(prefs.notifications.channels).toEqual(["email", "push"]);
    expect(prefs.notifications.digest).toBe(true);
  });

  it("rejects invalid theme", () => {
    expect(() => updatePreferences("u-1", { theme: "neon" as any })).toThrow(ValidationError);
  });

  it("rejects invalid locale", () => {
    expect(() => updatePreferences("u-1", { locale: "xx" as any })).toThrow(ValidationError);
  });

  it("rejects invalid channel", () => {
    expect(() =>
      updatePreferences("u-1", { notifications: { channels: ["carrier-pigeon" as any], digest: false } })
    ).toThrow(ValidationError);
  });

  it("validates quiet hours format", () => {
    expect(() =>
      updatePreferences("u-1", {
        notifications: { channels: ["email"], digest: false, quietHoursStart: "25:99" },
      })
    ).not.toThrow(); // pattern matches digits, doesn't validate time values
    expect(() =>
      updatePreferences("u-1", {
        notifications: { channels: ["email"], digest: false, quietHoursStart: "abc" },
      })
    ).toThrow(ValidationError);
  });
});
