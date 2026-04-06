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
  const [step, setStep] = useState<"landing" | "setup">("landing");
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

  if (step === "landing") {
    return (
      <main className="onboarding-root fade-in">
        <div className="landing-container">
          <nav className="landing-nav">
            <div className="landing-logo">Reward Board</div>
          </nav>
          
          <section className="landing-hero">
            <div className="landing-content">
              <h1 className="landing-title">
                Build momentum with <span className="text-secondary-highlight">tiny wins.</span>
              </h1>
              <p className="landing-subtitle">
                Focus for a block of time, and treat yourself when you show up. Productivity that feels like a celebration.
              </p>
              <div className="landing-actions">
                <button className="base-button landing-button" onClick={() => setStep("setup")}>
                  Start Your Board
                </button>
              </div>
            </div>

            <div className="hero-visual">
              <div className="task-card-wrapper slide-in" style={{ animationDelay: "0.2s" }}>
                <div className="task-card-bg"></div>
                <div className="task-card">
                  <div className="task-card-top">
                    <span className="task-tag">DRAFTING</span>
                    <h3 className="task-title">Finish Garden Sketches</h3>
                  </div>
                  <div className="task-card-divider"></div>
                  <div className="task-reward">
                    <div className="reward-icon-wrapper">
                      <span className="reward-emoji" aria-hidden="true">🎁</span>
                    </div>
                    <div className="reward-details">
                      <span className="reward-label">THE TREAT</span>
                      <span className="reward-name">30m Pottery Class</span>
                    </div>
                  </div>
                </div>
                <div className="earned-badge">
                  <span className="checkbox-icon" aria-hidden="true">✅</span>
                  <span>EARNED!</span>
                </div>
              </div>
            </div>
          </section>

          <section className="landing-steps">
            <div className="steps-container">
              <div className="step-card slide-in" style={{ animationDelay: "0.3s" }}>
                <div className="step-number">1</div>
                <h4 className="step-title">Set Focus</h4>
                <p className="step-desc">Pick one tiny task that matters today. No big lists.</p>
              </div>
              <div className="step-card slide-in" style={{ animationDelay: "0.4s" }}>
                <div className="step-number">2</div>
                <h4 className="step-title">Pick Treat</h4>
                <p className="step-desc">Connect it to a small joy. A coffee, a walk, or a nap.</p>
              </div>
              <div className="step-card slide-in" style={{ animationDelay: "0.5s" }}>
                <div className="step-number">3</div>
                <h4 className="step-title">Earn & Enjoy</h4>
                <p className="step-desc">Cross it off and unlock your treat immediately.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="onboarding-root">
      <section className="setup-view slide-in" aria-labelledby="onboarding-title">
        <header className="setup-header">
          <h2 id="onboarding-title">Let's set you up</h2>
          <p>Define your goal and the rewards you'll earn along the way.</p>
        </header>

        <form className="setup-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <div className="setup-field">
              <label htmlFor="user-name">What's your name?</label>
              <input
                id="user-name"
                type="text"
                placeholder="e.g. Jenny"
                value={userName}
                maxLength={50}
                required
                onChange={(event) => {
                  setUserName(event.target.value);
                  if (formErrors.userName) {
                    setFormErrors((prev) => ({ ...prev, userName: undefined }));
                  }
                }}
                aria-invalid={Boolean(formErrors.userName)}
              />
              {formErrors.userName && <span className="setup-error">{formErrors.userName}</span>}
            </div>

            <div className="setup-field">
              <label htmlFor="activity">What are you focusing on?</label>
              <input
                id="activity"
                type="text"
                placeholder="e.g. studying, coding, writing"
                value={activity}
                maxLength={100}
                required
                onChange={(event) => {
                  setActivity(event.target.value);
                  if (formErrors.activity) {
                    setFormErrors((prev) => ({ ...prev, activity: undefined }));
                  }
                }}
                aria-invalid={Boolean(formErrors.activity)}
              />
              {formErrors.activity && <span className="setup-error">{formErrors.activity}</span>}
            </div>

            <div className="setup-field duration-field">
              <label htmlFor="duration">For how long?</label>
              <div className="duration-inputs">
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
          </div>

          <div className="setup-rewards" aria-labelledby="onboarding-rewards-title">
            <h3 id="onboarding-rewards-title">Your Rewards</h3>
            <p className="rewards-hint">Customize what you get for completing your session.</p>
            
            <div className="rewards-grid">
              {rewards.map((reward, i) => (
                <div key={reward.id} className="reward-input-box">
                  <span className="reward-number">{i + 1}</span>
                  <input
                    type="text"
                    value={reward.name}
                    maxLength={60}
                    onChange={(event) => handleRewardChange(reward.id, event.target.value)}
                    aria-label={`Reward ${reward.id}`}
                  />
                  {reward.name.length >= 55 && (
                    <span className="reward-char-count">{reward.name.length}/60</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="setup-actions">
            <button type="button" className="text-button" onClick={() => setStep("landing")}>
              Back
            </button>
            <button type="submit" className="base-button setup-submit">
              Start Board
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Onboarding;
