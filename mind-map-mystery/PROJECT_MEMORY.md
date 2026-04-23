# Mind Map Mystery — Project Memory

**Last Updated:** 2026-04-22 21:05 UTC

## Game Overview

**Name:** Mind Map Mystery  
**Core Purpose:** A word-guessing game where players explore a 3D graph of word relationships to identify a hidden central word.

**Visual Style:**
- Background: Animated starry nebula with cyan/purple twinkling stars and pulsing nebula clouds
- Node colors: Soft neon (cyan, magenta, violet, teal) based on word categories
- Center orb: Large cyan/purple glowing sphere
- Unrevealed nodes: Small glowing spheres with category colors
- Revealed nodes: Standard glow, hint cards appear in sidebar
- Links: Curved connections with flowing particle effects
- 3D Graph: Auto-rotating with mouse drag/zoom controls

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
- [x] GitHub repository created and code pushed
  - [x] Remote configured: `https://github.com/tsigafoos/mindmapmystery-v2.git`
  - [x] Initial commit pushed to origin/main
- [x] ForceGraph component (modular) - GameGraph.tsx created
- [x] UI components - Game component with header, hints bar, sidebar, guess input
- [x] Game state management hooks - useGameState hook implemented
- [x] Word relationship data - thematic categorization with colors

---

## Current State

**Status:** Development environment ready, code published to GitHub, basic 3D visualization working

**Repository:** https://github.com/tsigafoos/mindmapmystery-v2

**What's Working:** 
- ✅ Project scaffolded with Vite + React + TypeScript
- ✅ Dependencies installed (3d-force-graph, three)
- ✅ Core types defined (`src/types/game.ts`)
- ✅ Game component with full UI layout (Game.tsx, Game.css, GameGraph.tsx)
- ✅ Dev server running at http://localhost:5173/
- ✅ Sample data loaded (center node + 15 related words)
- ✅ Click nodes to reveal words in sidebar
- ✅ 3D graph with auto-rotation and mouse controls
- ✅ GitHub repository created and initial commit pushed
- ✅ Animated starry nebula background
- ✅ Hint system with "flip cards" showing hint results
- ✅ Timer, guesses, and clues display in bottom bar
- ✅ Curved links with random curvature
- ✅ Thematic word categorization with color coding

**Visuals Active:**
- Animated starry nebula with twinkling cyan/purple stars
- Semi-transparent 3D graph showing stars through background
- White center node ("photosynthesis")
- Colored orbiting nodes by category (science=blue, biology=green)
- Auto-rotation with mouse drag to look around
- Click nodes to reveal - adds hint cards to sidebar
- Three hint buttons (first letter, random word, word length)
- Flipped hint cards with gradient backgrounds in sidebar

**Next Phase:** Polish, bug fixes, additional word datasets

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
| `src/components/Game/index.tsx` | Main game component with UI layout | ✅ Created |
| `src/components/Game/Game.css` | Game styles, starry background, animations | ✅ Created |
| `src/components/Game/GameGraph.tsx` | 3D force graph visualization | ✅ Created |
| `src/hooks/useGameState.ts` | Game logic state management | ✅ Created |
| `src/utils/thematicColors.ts` | Word categorization and color mapping | ✅ Created |
| `App.tsx` | Main app entry point | ✅ Working |
| `src/assets/background.jpg` | Background image asset | ✅ Available |

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

---

## Deployment History

| Date | Action | Status |
|------|--------|--------|
| 2026-04-22 | Project initialized locally | ✅ Complete |
| 2026-04-22 | GitHub repo `tsigafoos/mindmapmystery-v2` created | ✅ Complete |
| 2026-04-22 | Initial commit pushed to GitHub | ✅ Complete |
