import type { AppConfig, Reward, TimeUnit } from "../types";

const CONFIG_KEY = "rewardBoardConfig";
const OLD_REWARDS_KEY = "rewards";
const THEME_KEY = "rewardBoardTheme";

const VALID_TIME_UNITS: ReadonlySet<TimeUnit> = new Set(["min", "hour(s)", "day(s)"]);

export type Theme = "light" | "dark";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidReward(value: unknown): value is Reward {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "number" &&
    Number.isFinite(value.id) &&
    typeof value.name === "string" &&
    typeof value.redeemed === "boolean"
  );
}

function isValidConfig(value: unknown): value is AppConfig {
  if (!isRecord(value)) {
    return false;
  }

  if (typeof value.version !== "number" || !Number.isFinite(value.version)) {
    return false;
  }

  if (typeof value.userName !== "string") {
    return false;
  }

  if (typeof value.activity !== "string") {
    return false;
  }

  if (typeof value.duration !== "number" || !Number.isFinite(value.duration)) {
    return false;
  }

  if (typeof value.timeUnit !== "string" || !VALID_TIME_UNITS.has(value.timeUnit as TimeUnit)) {
    return false;
  }

  if (!Array.isArray(value.rewards) || !value.rewards.every(isValidReward)) {
    return false;
  }

  if (typeof value.onboardingCompleted !== "boolean") {
    return false;
  }

  return true;
}

export function getDefaultRewards(): Reward[] {
  return [
    { id: 1, name: "1 EPISODE OF MR. ROBOT", redeemed: false },
    { id: 2, name: "listen to Daft Punk", redeemed: false },
    { id: 3, name: "watch a cute alpaca video", redeemed: false },
    { id: 4, name: "get coffee from Alkemisten", redeemed: false },
    { id: 5, name: "FUNNY VIDEO", redeemed: false },
    { id: 6, name: "play carcassonne for 30 min", redeemed: false },
    { id: 7, name: "walk in the park with Svante", redeemed: false },
    { id: 8, name: "eat something sweet", redeemed: false },
    { id: 9, name: "cool activity with a friend", redeemed: false },
  ];
}

export function saveConfig(config: AppConfig): void {
  try {
    const serialized = JSON.stringify(config);
    localStorage.setItem(CONFIG_KEY, serialized);
  } catch (error) {
    console.error("Failed to save app config to localStorage", error);
  }
}

export function migrateOldRewards(): AppConfig | null {
  let oldRewardsRaw: string | null;

  try {
    oldRewardsRaw = localStorage.getItem(OLD_REWARDS_KEY);
  } catch (error) {
    console.error("Failed to read legacy rewards from localStorage", error);
    return null;
  }

  if (!oldRewardsRaw) {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(oldRewardsRaw) as unknown;
  } catch (error) {
    console.error("Failed to parse legacy rewards JSON", error);
    return null;
  }

  if (!Array.isArray(parsed) || !parsed.every(isValidReward)) {
    console.error("Legacy rewards data is invalid and cannot be migrated");
    return null;
  }

  const migratedConfig: AppConfig = {
    version: 1,
    userName: "",
    activity: "",
    duration: 60,
    timeUnit: "min",
    rewards: parsed,
    onboardingCompleted: false,
  };

  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(migratedConfig));
    localStorage.removeItem(OLD_REWARDS_KEY);
    return migratedConfig;
  } catch (error) {
    console.error("Failed to persist migrated rewards to new schema", error);
    return null;
  }
}

export function loadConfig(): AppConfig | null {
  let rawConfig: string | null;

  try {
    rawConfig = localStorage.getItem(CONFIG_KEY);
  } catch (error) {
    console.error("Failed to read app config from localStorage", error);
    return null;
  }

  if (!rawConfig) {
    return migrateOldRewards();
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawConfig) as unknown;
  } catch (error) {
    console.error("Failed to parse app config JSON", error);
    return migrateOldRewards();
  }

  if (!isValidConfig(parsed)) {
    console.error("Stored app config has invalid shape");
    return migrateOldRewards();
  }

  return parsed;
}

export function clearConfig(): void {
  try {
    localStorage.removeItem(CONFIG_KEY);
  } catch (error) {
    console.error("Failed to clear app config from localStorage", error);
  }
}

export function getTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored && (stored === "light" || stored === "dark")) {
      return stored;
    }
  } catch (error) {
    console.error("Failed to read theme from localStorage", error);
  }
  return "dark"; // default theme
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error("Failed to save theme to localStorage", error);
  }
}