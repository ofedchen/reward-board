# reward-board Development Guidelines

## Code Style

**Language & Formatting**: TypeScript + React (ES modules)
- Use strict TypeScript (`tsconfig` configured with strict mode)
- All `.tsx` files must export React components with proper type annotations
- Define types explicitly; avoid `any` unless absolutely necessary
- Use const assertions and type narrowing for better DX

**Example pattern** (see [src/App.tsx](../frontend/src/App.tsx)):
```typescript
type Reward = {
  id: number;
  name: string;
  redeemed: boolean;
};

function App() {
  const [rewards, setRewards] = useState<Reward[]>(() => {
    // Initialize state safely
  });
  // ...
}
```

**Formatting & Linting**: ESLint with TypeScript support (v9.39.1)
- Run `npm run lint` before committing
- Configure extends recommended TypeScript rules (currently `recommended` level)
- React Hook rules are active (`eslint-plugin-react-hooks`)
- All lint warnings must be addressed (errors block build)

## Architecture

**Frontend Structure** (`frontend/src/`)
- Entry point: `main.tsx` → renders `App.tsx`
- Components are `tsx` files in `src/`
- Styles co-located: CSS files alongside components
- State management: React hooks + `localStorage` for persistence

**Build Tool**: Vite
- Configuration: [frontend/vite.config.ts](../frontend/vite.config.ts)
- React plugin enabled for Fast Refresh (HMR)
- Output: `dist/` directory

## Build and Test

**Development**:
```bash
cd frontend
npm run dev        # Start Vite dev server (HMR enabled)
```

**Build**:
```bash
cd frontend
npm run build      # Type check + Vite build; blocks on errors
```

**Code Quality**:
```bash
cd frontend
npm run lint       # ESLint check on all files
npm run preview    # Preview production build locally
```

**Testing**: Not currently configured. When adding tests, place specs next to components or in `src/tests/`.

## Conventions

**React Hooks**
- Use `useState` for local state
- Use `useEffect` for side effects
- Keep localStorage sync in `useEffect` with `localStorage.getItem/setItem`
- Hooks must be called at the top level (not in conditionals)

**State Persistence**
- Pattern: Initialize `useState` with a function that reads from `localStorage`
- Always wrap `JSON.parse` in try-catch to handle corrupt data gracefully
- Log invalid data to console for debugging

**TypeScript**
- Define types at function/component top; export reusable types from constants/types files
- Use union types for variant states instead of optional booleans
- Leverage `as const` for string literals and exhaustive checks

**Imports**
- ES module syntax (`import`/`export`)
- Relative paths for local modules, absolute for node_modules
- Group: node_modules → local files → styles

**Component Props**
- Type props explicitly; avoid spreading `...props` without `React.PropsWithChildren` context
- Keep prop lists short (<5 props); pass objects for complex data

## Key Files

| File | Purpose |
|------|---------|
| [frontend/package.json](../frontend/package.json) | Scripts, dependencies (React 19.2, Vite 7.2) |
| [frontend/vite.config.ts](../frontend/vite.config.ts) | Build configuration |
| [frontend/eslint.config.js](../frontend/eslint.config.js) | Linting rules |
| [frontend/tsconfig.json](../frontend/tsconfig.json) | TypeScript configuration (references app/node tsconfigs) |
| [frontend/src/App.tsx](../frontend/src/App.tsx) | Root component with state + localStorage example |

## Common Automation

When creating new files or components:
- Always include proper TypeScript types
- Run `npm run lint` after changes to catch issues early
- Use `npm run build` to validate the full pipeline (type checking + bundling)
