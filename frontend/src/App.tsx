import { useEffect, useState } from "react";
import "./App.css";
import Onboarding from "./Onboarding";
import RewardBoard from "./RewardBoard";
import ThemeToggle from "./ThemeToggle";
import type { AppConfig } from "./types";
import { getTheme, loadConfig, saveConfig, saveTheme, type Theme } from "./utils/storage";

function App() {
  const [config, setConfig] = useState<AppConfig | null>(() => loadConfig());
  const [theme, setTheme] = useState<Theme>(() => getTheme());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

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
    setConfig((previousConfig) => {
      if (!previousConfig) return null;
      return { ...previousConfig, onboardingCompleted: false };
    });
  }

  function handleThemeToggle(): void {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    saveTheme(nextTheme);
  }

  if (!config || !config.onboardingCompleted) {
    return (
      <>
        <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
        <Onboarding initialConfig={config ?? undefined} onComplete={handleOnboardingComplete} />
      </>
    );
  }

  return (
    <>
      <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
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
    </>
  );
}

export default App;
