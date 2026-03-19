# Reward Board 🎉

A minimalistic motivation app that helps you stay focused and reward yourself along the way. Set a goal, work towards it in timed blocks, and unlock fun rewards when you show up for yourself.

## What It Does

1. **Set up your board** — Enter your name, what you're working on, and how long you'll focus
2. **Customize rewards** — Pick 9 rewards that motivate you (watch an episode, eat something sweet, take a break…)
3. **Get to work** — Focus on your task for the time you set
4. **Redeem rewards** — Click a card to mark it redeemed when you've earned it
5. **Refresh & repeat** — Reset your board and go again

All progress and rewards are saved in your browser automatically.

## Tech Stack

- **React 19** + **TypeScript** (strict mode)
- **Vite 7** for dev server & builds
- **localStorage** for persistence (no backend needed)

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check + production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build locally |

## Project Structure

```
frontend/src/
├── App.tsx              # Orchestrator — routes between Onboarding ↔ RewardBoard
├── Onboarding.tsx       # Starting page — set name, activity, duration, rewards
├── Onboarding.css
├── RewardBoard.tsx      # Main board — redeem, edit, refresh rewards
├── RewardBoard.css
├── types.ts             # Shared types (Reward, TimeUnit, AppConfig)
├── utils/
│   └── storage.ts       # localStorage persistence, validation, migration
├── index.css            # Global styles
├── App.css
└── main.tsx             # Entry point
```
