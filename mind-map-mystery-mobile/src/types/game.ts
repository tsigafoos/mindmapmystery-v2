/**
 * Core TypeScript types for Mind Map Mystery
 */

// Render theme options for materials
export type RenderTheme = 'standard' | 'phong' | 'toon' | 'basic';

// 8 thematic categories with soft neon base colors
export type WordCategory =
  | 'biology'      // Soft grass green
  | 'technology'   // Electric cyan
  | 'sports'       // Bright lime
  | 'food'         // Warm coral
  | 'arts'         // Soft magenta
  | 'business'     // Soft gold
  | 'science'      // Soft violet
  | 'abstract'     // Gentle purple
  | 'uncategorized'; // Mimics center (soft white with cyan aura)

export interface WordNode {
  id: string;
  word: string;
  relationshipStrength: number; // 0-1, closer = stronger clue
  isRevealed: boolean;
  category: WordCategory;
  tier?: number; // 1, 2, or 3 for tiered scoring
}

export interface GraphLink {
  source: string;
  target: string;
  strength: number; // 0-1, affects link distance
}

export interface GraphData {
  nodes: WordNode[];
  links: GraphLink[];
}

export interface GameState {
  centerWord: string;
  nodes: WordNode[];
  revealedClues: RevealedClue[];
  timeRemaining: number; // in seconds
  isGameOver: boolean;
  isWinner: boolean;
  guessCount: number;
  score: number; // Running score
  startTime: number | null; // Timestamp when game started
  endTime: number | null; // Timestamp when game ended
  hintsUsed: number; // Count of hints used
  isPaused: boolean; // Timer pause state
}

export interface RevealedClue {
  word: string;
  relationshipStrength: number;
  revealedAt: number; // timestamp
  tier?: number;
}

// Game template passed as JSON
export interface GameTemplate {
  centerWord: string;
  startingHint: string; // Riddle-style sentence shown at start
  renderTheme: RenderTheme;
  nodes: GameTemplateNode[];
  totalTime?: number; // Optional, defaults to 300
  maxGuesses?: number; // Optional, defaults to 10
}

export interface GameTemplateNode {
  word: string;
  strength: number; // 0-1
  category: WordCategory;
  tier: 1 | 2 | 3; // Tier for additive scoring
}

export interface GameConfig {
  totalTime: number; // seconds
  maxGuesses: number;
  centerWord: string;
  relatedWords: RelatedWord[];
  startingHint: string;
  renderTheme: RenderTheme;
}

export interface RelatedWord {
  word: string;
  strength: number; // 0-1
  category: WordCategory;
  tier: 1 | 2 | 3;
}

export type GameAction =
  | { type: 'REVEAL_NODE'; nodeId: string; tier?: number }
  | { type: 'MAKE_GUESS'; guess: string }
  | { type: 'TICK_TIMER' }
  | { type: 'START_GAME' }
  | { type: 'USE_HINT' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'RESET_GAME'; config: GameConfig };

// Scoring constants
export const SCORING = {
  BASE_SCORE: 10000,
  TIME_PENALTY_PER_SECOND: 100,
  MIN_SCORE: 100,
  CORRECT_GUESS: 5000,
  TIER_1_BONUS: 400,
  TIER_2_BONUS: 200,
  TIER_3_BONUS: 100,
  HINT_PENALTY: 300,
} as const;

export interface GraphNodeObject extends WordNode {
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
}

export interface ThreeNodeObject {
  id: string;
  word: string;
  isRevealed: boolean;
  category: WordCategory;
  relationshipStrength: number;
  tier?: number;
}
