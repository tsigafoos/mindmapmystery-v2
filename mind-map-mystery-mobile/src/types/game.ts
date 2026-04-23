/**
 * Core TypeScript types for Mind Map Mystery
 */

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
}

export interface RevealedClue {
  word: string;
  relationshipStrength: number;
  revealedAt: number; // timestamp
}

export interface GameConfig {
  totalTime: number; // seconds
  maxGuesses: number;
  centerWord: string;
  relatedWords: RelatedWord[];
}

export interface RelatedWord {
  word: string;
  strength: number; // 0-1
  category: WordCategory;
}

export type GameAction =
  | { type: 'REVEAL_NODE'; nodeId: string }
  | { type: 'MAKE_GUESS'; guess: string }
  | { type: 'TICK_TIMER' }
  | { type: 'RESET_GAME'; config: GameConfig };

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
}
