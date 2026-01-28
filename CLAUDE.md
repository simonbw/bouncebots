# BounceBots - Project Context

## What This Is

BounceBots is a browser-based puzzle game inspired by "Ricochet Robots." Players manipulate 4 colored robots (red, blue, green, yellow) on a 16x16 grid to reach target positions. Robots slide in cardinal directions until hitting walls or other robots. The game supports solo optimization play or competitive multiplayer with a bidding/timer system.

**Live Demo**: The game can generate shareable puzzle links via URL parameters (`?seed=X&goal=Y`)

## Technology Stack

- **React 18** + **TypeScript** - Modern type-safe UI
- **Tailwind CSS** - Utility-first styling with custom animations
- **esbuild** - Fast bundling and development server
- **SVG-based rendering** - All game graphics are scalable vectors

## Quick Start

```bash
npm install
npm start          # Starts dev server with hot reload
npm run build      # Production build to /dist
```

The dev server runs two watchers in parallel:
- TypeScript/React bundling with esbuild
- Tailwind CSS compilation

## Architecture Overview

### Core Design Principles

1. **Immutable Game State**: All game logic uses pure functions that return new state objects
2. **Separation of Concerns**: Clear boundaries between game logic (`/game`), UI (`/components`), and utilities
3. **React Context for State**: Global game state managed via `useGame()` hook
4. **Type Safety**: Comprehensive TypeScript types throughout

### Directory Structure

```
/src
├── components/       # React UI components
│   ├── GameRenderer.tsx    # Main game layout orchestrator
│   ├── Grid.tsx            # SVG game board (walls, cells, goals)
│   ├── RobotToken.tsx      # Robot rendering with movement arrows
│   ├── MoveList.tsx        # Move history with undo/reset
│   ├── Hourglass.tsx       # Timer with animated sand effect
│   ├── HowToPlay.tsx       # Instructions modal
│   └── useGame.tsx         # Game state context provider
├── game/             # Pure game logic (no React)
│   ├── game-model.ts       # Core types: Game, Move, Position, Grid
│   ├── game-actions.ts     # State mutations: addMove, undoMove, etc.
│   ├── game-helpers.ts     # Queries: getCurrentPositions, canAddMove, etc.
│   ├── grid.ts             # Grid structure and ASCII parsing
│   ├── grid1.ts            # Default 16x16 board definition
│   └── solver.ts           # BFS puzzle solver (currently disabled)
├── utility/          # Helper functions
│   ├── Random.ts           # Seeded RNG for reproducible puzzles
│   ├── MathUtil.ts         # Math helpers (lerp, clamp, etc.)
│   └── memoize.ts          # Performance optimization utilities
└── styles/
    └── index.css           # Tailwind imports + custom styles
```

### Key Data Flow

1. **Initialization**: `GameProvider` creates game via `makeGame()` → places robots randomly → selects goal
2. **User Input**: Keyboard/click → `canAddMove()` validates → `addMove()` updates state
3. **Rendering**: React context triggers re-render → `Grid` + `RobotToken` components draw SVG
4. **Move Validation**: Robots slide until collision with wall/robot/boundary

## Important Files

- **src/game/game-model.ts** - Core types and data structures
- **src/game/game-actions.ts** - All state mutations (pure functions)
- **src/game/grid1.ts** - Game board layout as ASCII art
- **src/components/useGame.tsx** - Global state management
- **src/components/GameRenderer.tsx** - Main UI entry point
- **tailwind.config.js** - Custom animations and styling extensions

## Common Development Tasks

### Adding a New Feature
1. If it's UI, add a component in `/src/components`
2. If it's game logic, add pure functions in `/src/game`
3. Update types in `game-model.ts` if needed
4. Access game state via `useGame()` hook

### Modifying the Game Board
- Edit `grid1.ts` - uses ASCII art format where `|` and `-` represent walls
- Center 2x2 area is always blocked
- Goal positions defined in `makeGoals()` function

### Adding Keyboard Shortcuts
- Edit `src/components/useKeyboardShortcuts.tsx`
- Current shortcuts: Arrow keys (move), Escape (deselect), Ctrl+Z (undo), R (reset)

### Styling Changes
- Most styles use Tailwind utility classes
- Custom animations defined in `tailwind.config.js`
- Global styles in `src/styles/index.css`

## Known Issues & Notes

### Solver Performance
The puzzle solver (`src/game/solver.ts`) is currently **disabled** in production (GameRenderer.tsx:65) due to performance issues. The BFS algorithm can be slow on complex puzzles.

**If you want to re-enable it:**
- Uncomment `<SolutionPanel />` in GameRenderer.tsx
- Consider adding web workers or incremental solving

### URL State Management
Puzzles are shareable via URL params but don't sync bidirectionally - changing the puzzle doesn't update the URL automatically. This is intentional to avoid cluttering history.

### Robot Collision Detection
Movement validation happens in discrete steps (src/game/game-helpers.ts:80-100). The algorithm checks for walls BEFORE taking each step, which is crucial for correct behavior.

## Code Patterns to Follow

### Pure Functions for Game Logic
```typescript
// Good: Returns new state
export function addMove(game: Game, move: Move): Game {
  return { ...game, moves: [...game.moves, move] };
}

// Bad: Mutates existing state
export function addMove(game: Game, move: Move): Game {
  game.moves.push(move);
  return game;
}
```

### Component Structure
```typescript
// Access game state via hook
const { game, setGame } = useGame();

// Perform actions via pure functions
const handleMove = () => {
  if (canAddMove(game, move)) {
    setGame(addMove(game, move));
  }
};
```

### Memoization for Performance
The codebase uses memoization heavily for expensive calculations (e.g., getCurrentPositions). Follow this pattern for any repeated computations.

## Testing Puzzles

To test specific puzzle configurations:
1. Add `?seed=123&goal=0` to URL for reproducible puzzles
2. `seed` controls robot placement
3. `goal` selects which goal square to target (0-based index)

## Deployment

The project is configured for Vercel deployment:
- Build output goes to `/dist`
- Static hosting - no backend needed
- No environment variables required

## Future Enhancement Ideas

Based on the codebase exploration, here are logical next steps:
- Fix solver performance (web workers, A* algorithm, iterative deepening)
- Add multiplayer synchronization (currently UI only)
- Persist high scores or best solutions
- Add more grid layouts (currently only grid1)
- Implement solution replay/visualization
- Add difficulty ratings for puzzles

## Getting Help

- Recent commits show active development on UI features (hourglass, modals, usability)
- The game logic is stable and well-tested through use
- Most complexity is in movement validation and solver algorithms
