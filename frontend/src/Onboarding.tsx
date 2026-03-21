import { useState } from "react";
import type { AppConfig, Reward, TimeUnit } from "./types";
import { getDefaultRewards } from "./utils/storage";
import "./Onboarding.css";

type OnboardingProps = {
  onComplete: (config: AppConfig) => void;
  initialConfig?: AppConfig;
};

type FormErrors = {
  userName?: string;
  activity?: string;
};

function Onboarding({ onComplete, initialConfig }: OnboardingProps) {
  const [userName, setUserName] = useState<string>(initialConfig?.userName ?? "");
  const [activity, setActivity] = useState<string>(initialConfig?.activity ?? "");
  const [duration, setDuration] = useState<number>(initialConfig?.duration ?? 60);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>(initialConfig?.timeUnit ?? "min");
  const [rewards, setRewards] = useState<Reward[]>(() => initialConfig?.rewards ?? getDefaultRewards());
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  function handleRewardChange(id: number, name: string): void {
    setRewards((previousRewards) => {
      return previousRewards.map((reward) => {
        if (reward.id === id) {
          return { ...reward, name };
        }
        return reward;
      });
    });
  }

  function validateForm(): FormErrors {
    const errors: FormErrors = {};

    if (userName.trim().length === 0) {
      errors.userName = "Please enter your name to continue.";
    }

    if (activity.trim().length === 0) {
      errors.activity = "Tell us what you are working on.";
    }

    return errors;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const config: AppConfig = {
      version: 1,
      userName: userName.trim(),
      activity: activity.trim(),
      duration: duration < 1 ? 1 : duration,
      timeUnit,
      rewards,
      onboardingCompleted: true,
    };

    onComplete(config);
  }

  return (
    <main className="onboarding-root">
      <section className="onboarding-card" aria-labelledby="onboarding-title">
        <header className="onboarding-header">
          <h1 id="onboarding-title">Welcome to your Reward Board</h1>
          <p>
            Build momentum with tiny wins. Set a clear goal, stay focused for a time block,
            and unlock rewards when you show up for yourself.
          </p>
          <p>Set your goal, work towards it, and reward yourself along the way!</p>
        </header>

        <form className="onboarding-form" onSubmit={handleSubmit} noValidate>
          <div className="onboarding-field">
            <label htmlFor="user-name">Your Name</label>
            <input
              id="user-name"
              type="text"
              placeholder="e.g., Hampus"
              value={userName}
              maxLength={50}
              required
              onChange={(event) => {
                const nextName = event.target.value;
                setUserName(nextName);

                if (formErrors.userName) {
                  setFormErrors((previousErrors) => ({ ...previousErrors, userName: undefined }));
                }
              }}
              aria-invalid={Boolean(formErrors.userName)}
              aria-describedby={formErrors.userName ? "user-name-error" : undefined}
            />
            {formErrors.userName ? (
              <p id="user-name-error" className="onboarding-error" role="alert">
                {formErrors.userName}
              </p>
            ) : null}
          </div>

          <div className="onboarding-field">
            <label htmlFor="activity">What are you working on?</label>
            <input
              id="activity"
              type="text"
              placeholder="e.g., editing the video"
              value={activity}
              maxLength={100}
              required
              onChange={(event) => {
                const nextActivity = event.target.value;
                setActivity(nextActivity);

                if (formErrors.activity) {
                  setFormErrors((previousErrors) => ({ ...previousErrors, activity: undefined }));
                }
              }}
              aria-invalid={Boolean(formErrors.activity)}
              aria-describedby={formErrors.activity ? "activity-error" : undefined}
            />
            {formErrors.activity ? (
              <p id="activity-error" className="onboarding-error" role="alert">
                {formErrors.activity}
              </p>
            ) : null}
          </div>

          <div className="onboarding-field">
            <label htmlFor="duration">For how long?</label>
            <div className="onboarding-duration-row">
              <input
                id="duration"
                type="number"
                min={1}
                value={duration}
                onChange={(event) => {
                  const nextDuration = Number(event.target.value);
                  if (!Number.isFinite(nextDuration) || nextDuration < 1) {
                    setDuration(1);
                    return;
                  }
                  setDuration(nextDuration);
                }}
              />
              <select
                aria-label="Time unit"
                value={timeUnit}
                onChange={(event) => {
                  setTimeUnit(event.target.value as TimeUnit);
                }}
              >
                <option value="min">min</option>
                <option value="hour(s)">hour(s)</option>
                <option value="day(s)">day(s)</option>
              </select>
            </div>
          </div>

          <section className="onboarding-rewards" aria-labelledby="onboarding-rewards-title">
            <h2 id="onboarding-rewards-title">Customize Your Rewards</h2>
            <p>Edit these rewards or create your own!</p>

            <div className="onboarding-rewards-list">
              {rewards.map((reward) => (
                <label key={reward.id} className="onboarding-reward-item">
                  <span className="onboarding-reward-badge">{reward.id}</span>
                  <div className="onboarding-reward-input-wrapper">
                    <input
                      type="text"
                      value={reward.name}
                      maxLength={60}
                      onChange={(event) => {
                        handleRewardChange(reward.id, event.target.value);
                      }}
                      aria-label={`Reward ${reward.id}`}
                    />
                    <span className={`onboarding-char-count${reward.name.length >= 55 ? " near-limit" : ""}`}>
                      {reward.name.length}/60
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </section>

          <button className="onboarding-submit" type="submit">
            Let's Go!
          </button>
        </form>
      </section>
    </main>
  );
}

export default Onboarding;