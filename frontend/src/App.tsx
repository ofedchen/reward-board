import { useState } from "react";
import "./App.css";

type Reward = {
  id: number;
  name: string;
  redeemed: boolean;
};

function App() {
  const [rewards, setRewards] = useState<Reward[]>([
    { id: 1, name: "1 EPISODE OF MR. ROBOT", redeemed: false },
    { id: 2, name: "SECRET ABOUT RICHARD", redeemed: false },
    { id: 3, name: "question / secret / dare", redeemed: false },
    { id: 4, name: "i give you a small present", redeemed: false },
    { id: 5, name: "SURPRISE VIDEO", redeemed: false },
    { id: 6, name: "i play carcassonne with you", redeemed: false },
    { id: 7, name: "bring you something from portugal", redeemed: false },
    { id: 8, name: "eat something sweet", redeemed: false },
    { id: 9, name: "you give me another challenge", redeemed: false },
  ]);

  function redeemReward(id: number) {
    setRewards(
      rewards.map((r) => {
        if (r.id === id) return { ...r, redeemed: !r.redeemed };
        else return r;
      })
    );
  }

  function changeReward(id: number, text: string) {
    setRewards(
      rewards.map((r) => {
        if (r.id === id) return { ...r, name: text };
        else return r;
      })
    );
  }

  function refreshRewards() {
    setRewards(
      rewards.map((r) => {
        return { ...r, redeemed: false };
      })
    );
  }

  return (
    <main>
      <h1>yo Hampus, choose your reward 🎉</h1>
      <p>
        Have you edited the video for 50 min? Well done, man! You're killing it,
        now get your reward!
      </p>
      <section className="container">
        {rewards.map((r) => {
          return (
            <div onClick={() => redeemReward(r.id)} className="fullcard">
              <div className="starId">
                <p>{r.id}</p>
              </div>
              <div className="lowercard">
                <div className={`uppercard${r.redeemed ? " redeemed" : ""}`}>
                  <textarea
                    value={r.name}
                    onChange={(e) => changeReward(r.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </section>
      <button onClick={refreshRewards}>Refresh all</button>
    </main>
  );
}

export default App;
