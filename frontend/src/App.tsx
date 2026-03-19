import { useEffect, useState } from "react";
import "./App.css";
import Onboarding from "./Onboarding";
import RewardBoard from "./RewardBoard";
import type { AppConfig } from "./types";
import { clearConfig, loadConfig, saveConfig } from "./utils/storage";

function App() {
  const [config, setConfig] = useState<AppConfig | null>(() => loadConfig());

  useEffect(() => {
    if (config && config.onboardingCompleted) {
      saveConfig(config);
    }
  }, [config]);

  function handleOnboardingComplete(nextConfig: AppConfig): void {
    saveConfig(nextConfig);
    setConfig(nextConfig);
  }

  function handleRewardRedeem(id: number): void {
    setConfig((previousConfig) => {
      if (!previousConfig || !previousConfig.onboardingCompleted) {
        return previousConfig;
      }

      return {
        ...previousConfig,
        rewards: previousConfig.rewards.map((reward) => {
          if (reward.id === id) {
            return { ...reward, redeemed: !reward.redeemed };
          }
          return reward;
        }),
      };
    });
  }

  function handleRewardChange(id: number, text: string): void {
    setConfig((previousConfig) => {
      if (!previousConfig || !previousConfig.onboardingCompleted) {
        return previousConfig;
      }

      return {
        ...previousConfig,
        rewards: previousConfig.rewards.map((reward) => {
          if (reward.id === id) {
            return { ...reward, name: text };
          }
          return reward;
        }),
      };
    });
  }

  function handleRefreshAllRewards(): void {
    setConfig((previousConfig) => {
      if (!previousConfig || !previousConfig.onboardingCompleted) {
        return previousConfig;
      }

      return {
        ...previousConfig,
        rewards: previousConfig.rewards.map((reward) => ({ ...reward, redeemed: false })),
      };
    });
  }

  function handleReset(): void {
    clearConfig();
    setConfig(null);
  }

  if (!config || !config.onboardingCompleted) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <RewardBoard
      userName={config.userName}
      activity={config.activity}
      duration={config.duration}
      timeUnit={config.timeUnit}
      rewards={config.rewards}
      onRewardRedeem={handleRewardRedeem}
      onRewardChange={handleRewardChange}
      onRefreshAll={handleRefreshAllRewards}
      onReset={handleReset}
    />
  );
}

export default App;
