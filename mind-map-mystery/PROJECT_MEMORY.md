# Mind Map Mystery — Project Memory

**Last Updated:** 2026-04-22 09:45 UTC

## Game Overview

**Name:** Mind Map Mystery  
**Core Purpose:** A word-guessing game where players explore a 3D graph of word relationships to identify a hidden central word.

**Visual Style:**
- Background: Deep dark space (near-black with subtle purple/navy gradient)
- Node colors: Soft neon (cyan, magenta, violet, teal)
- Center orb: White core with shifting cyan-purple aura
- Unrevealed nodes: Soft glowing with gentle pulsing
- Revealed nodes: Muted gray with minimal glow

---

## Setup Progress

- [x] Project initialized with Vite + React + TypeScript
- [x] Dependencies installed (3d-force-graph, three, @types/three)
- [x] Folder structure created
  - [x] src/components/Graph/
  - [x] src/components/UI/
  - [x] src/components/shared/
  - [x] src/hooks/
  - [x] src/types/
  - [x] src/styles/
  - [x] src/utils/
- [x] Core types defined (game.ts)
- [x] Theme/CSS variables set up (theme.css)
- [x] Basic ForceGraph visualization working (App.tsx)
- [x] Dev server running at http://localhost:5173/
- [ ] ForceGraph component (modular)
- [ ] UI components (CluePanel, GuessInput, Timer)
- [ ] Game state management hooks
- [ ] Word relationship data

---

## Current State

**Status:** Development environment ready, basic 3D visualization working

**Working:** 
- Project scaffolded with Vite + React + TypeScript
- Dependencies installed (3d-force-graph, three)
- Core types defined (`src/types/game.ts`)
- Theme CSS created with dark space aesthetic (`src/styles/theme.css`)
- Basic 3D force graph rendering in App.tsx
- Dev server running at http://localhost:5173/
- Sample data loaded (center node + 12 related words)
- Click interaction on nodes (logs to console)

**Visuals Active:**
- Deep space gradient background
- White center node ("?????")
- Colored orbiting nodes (cyan, magenta, violet, teal)
- Orbit/rotate with mouse drag
- Click nodes to "reveal" (turns gray)

**Next Phase:** Build out UI components and game logic

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| 3d-force-graph as base | Handles physics simulation, camera controls, and interaction out of the box |
| Vite over CRA | Faster HMR, modern build tooling, better Three.js support |
| CSS variables for colors | Easy theming, runtime customization, consistent palette |
| Modular component structure | Separation of concerns: Graph, UI, shared components |
| Custom hooks for state | Reusable game logic, easier testing |

---

## File Inventory

| File | Purpose | Status |
|------|---------|--------|
| `PROJECT_MEMORY.md` | This file — project tracking | ✅ Created |
| `src/types/game.ts` | Core TypeScript interfaces | ✅ Created |
| `src/styles/theme.css` | Color palette & glow effects | ✅ Created |
| `src/components/Graph/ForceGraph.tsx` | Main 3D visualization | ⏳ Pending |
| `src/components/Graph/NodeSprite.tsx` | Individual node styling | ⏳ Pending |
| `src/components/Graph/GraphControls.tsx` | Camera controls wrapper | ⏳ Pending |
| `src/components/UI/CluePanel.tsx` | Right-side revealed clues | ⏳ Pending |
| `src/components/UI/GuessInput.tsx` | Bottom text input | ⏳ Pending |
| `src/components/UI/Timer.tsx` | Top corner timer | ⏳ Pending |
| `src/components/UI/GameHeader.tsx` | Title and status | ⏳ Pending |
| `src/components/shared/GlowEffects.tsx` | Aura/glow materials | ⏳ Pending |
| `src/hooks/useGameState.ts` | Game logic state | ⏳ Pending |
| `src/hooks/useGraphData.ts` | Node/link data generation | ⏳ Pending |
| `src/hooks/useTimer.ts` | Timer logic | ⏳ Pending |
| `src/utils/wordRelationships.ts` | Word connection algorithms | ⏳ Pending |
| `src/utils/graphLayout.ts` | Force graph configuration | ⏳ Pending |
| `App.tsx` | Basic 3D graph visualization | ✅ Working |

---

## Dependencies Installed

```
3d-force-graph@latest
three@latest
@types/three@latest
```

Plus all standard Vite React TypeScript dependencies.

---

## Notes

- Project initialized at `/home/tim/Documents/mindmaptesting/mind-map-mystery/`
- Standard Vite React TS template used as base
- Next step: Build out UI components and game state management
- Consider using a simple word dataset to start (can expand later)
- Dev server running at http://localhost:5173/
