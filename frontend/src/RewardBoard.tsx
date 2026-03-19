import type { Reward, TimeUnit } from "./types";
import "./RewardBoard.css";

type RewardBoardProps = {
  userName: string;
  activity: string;
  duration: number;
  timeUnit: TimeUnit;
  rewards: Reward[];
  onRewardRedeem: (id: number) => void;
  onRewardChange: (id: number, text: string) => void;
  onRefreshAll: () => void;
  onReset: () => void;
};

function RewardBoard({
  userName,
  activity,
  duration,
  timeUnit,
  rewards,
  onRewardRedeem,
  onRewardChange,
  onRefreshAll,
  onReset,
}: RewardBoardProps) {
  function handleReset() {
    if (window.confirm("Are you sure? This will clear your progress and return to setup.")) {
      onReset();
    }
  }

  return (
    <main>
      <h1>yo {userName}, choose your reward 🎉</h1>
      <p>
        Have you been {activity} for {duration} {timeUnit}? Well done! You&apos;re killing it -
        now get your reward!
      </p>
      <section className="container">
        {rewards.map((r) => {
          return (
            <div key={r.id} onClick={() => onRewardRedeem(r.id)} className="fullcard">
              <div className="starId">
                <p>{r.id}</p>
              </div>
              <div className="lowercard">
                <div className={`uppercard${r.redeemed ? " redeemed" : ""}`}>
                  <textarea
                    value={r.name}
                    onChange={(e) => onRewardChange(r.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        (e.target as HTMLTextAreaElement).blur();
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </section>
      <div className="reward-actions">
        <button onClick={onRefreshAll}>Refresh all</button>
        <button className="reconfigure-button" onClick={handleReset}>
          Reconfigure
        </button>
      </div>
    </main>
  );
}

export default RewardBoard;