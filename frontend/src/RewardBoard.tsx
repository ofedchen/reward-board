import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
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
  const [isEditing, setIsEditing] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  function handleCardClick(id: number) {
    if (!isEditing) {
      onRewardRedeem(id);
    }
  }

  return (
    <main>
      <h1>yo {userName}, choose your reward 🎉</h1>
      <p>
        Have you been {activity} for {duration} {timeUnit}? Well done! You&apos;re killing it -
        now get your reward!
      </p>
      <p className="redeem-hint">{isEditing ? "edit your rewards below" : "click a card to redeem it"}</p>
      <section className={`container${isEditing ? " editing" : ""}`}>
        {rewards.map((r) => {
          return (
            <div key={r.id} onClick={() => handleCardClick(r.id)} className="fullcard">
              <div className="starId">
                <p>{r.id}</p>
              </div>
              <div className="lowercard">
                <div className={`uppercard${r.redeemed ? " redeemed" : ""}`}>
                  {isEditing ? (
                    <div className="edit-wrapper">
                      <textarea
                        value={r.name}
                        maxLength={60}
                        onChange={(e) => onRewardChange(r.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            (e.target as HTMLTextAreaElement).blur();
                          }
                        }}
                      />
                      <span className={`char-count${r.name.length >= 55 ? " near-limit" : ""}`}>
                        {r.name.length}/60
                      </span>
                    </div>
                  ) : (
                    <span className="reward-text">{r.name}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>
      <div className="reward-actions">
        <button onClick={onRefreshAll}>Refresh all</button>
        <button
          className={isEditing ? "edit-button editing" : "edit-button"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Done" : "Edit Rewards"}
        </button>
        <button className="reconfigure-button" onClick={() => setShowResetModal(true)}>
          Reconfigure
        </button>
      </div>
      {showResetModal && (
        <ConfirmModal
          message="Are you sure? This will return you to setup."
          onConfirm={() => {
            setShowResetModal(false);
            onReset();
          }}
          onCancel={() => setShowResetModal(false)}
        />
      )}
    </main>
  );
}

export default RewardBoard;