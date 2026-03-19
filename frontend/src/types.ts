export type Reward = {
  id: number;
  name: string;
  redeemed: boolean;
};

export type TimeUnit = "min" | "hour(s)" | "day(s)";

export type AppConfig = {
  version: number;
  userName: string;
  activity: string;
  duration: number;
  timeUnit: TimeUnit;
  rewards: Reward[];
  onboardingCompleted: boolean;
};