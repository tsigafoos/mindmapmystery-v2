/**
 * Word Relationship Utilities
 * Manages word connections and game data generation
 */

import type { GameConfig, RelatedWord, NodeColor } from '../types/game';

// Sample word database for demo/testing
const WORD_DATABASE: Record<string, RelatedWord[]> = {
  'ocean': [
    { word: 'wave', strength: 0.95, color: 'cyan' },
    { word: 'blue', strength: 0.9, color: 'cyan' },
    { word: 'fish', strength: 0.85, color: 'teal' },
    { word: 'water', strength: 0.9, color: 'cyan' },
    { word: 'beach', strength: 0.75, color: 'teal' },
    { word: 'tide', strength: 0.8, color: 'cyan' },
    { word: 'coral', strength: 0.7, color: 'violet' },
    { word: 'sail', strength: 0.65, color: 'magenta' },
    { word: 'deep', strength: 0.8, color: 'violet' },
    { word: 'salt', strength: 0.7, color: 'cyan' },
    { word: 'marine', strength: 0.75, color: 'teal' },
    { word: 'ship', strength: 0.6, color: 'magenta' },
  ],
  'forest': [
    { word: 'tree', strength: 0.95, color: 'teal' },
    { word: 'green', strength: 0.9, color: 'teal' },
    { word: 'leaf', strength: 0.85, color: 'teal' },
    { word: 'wood', strength: 0.8, color: 'violet' },
    { word: 'path', strength: 0.65, color: 'magenta' },
    { word: 'wildlife', strength: 0.7, color: 'cyan' },
    { word: 'nature', strength: 0.85, color: 'teal' },
    { word: 'moss', strength: 0.75, color: 'teal' },
    { word: 'shadow', strength: 0.6, color: 'violet' },
    { word: 'bark', strength: 0.7, color: 'violet' },
    { word: 'canopy', strength: 0.65, color: 'teal' },
    { word: 'roots', strength: 0.75, color: 'violet' },
  ],
  'music': [
    { word: 'song', strength: 0.95, color: 'magenta' },
    { word: 'melody', strength: 0.9, color: 'magenta' },
    { word: 'rhythm', strength: 0.85, color: 'cyan' },
    { word: 'sound', strength: 0.8, color: 'violet' },
    { word: 'instrument', strength: 0.75, color: 'teal' },
    { word: 'harmony', strength: 0.8, color: 'magenta' },
    { word: 'beat', strength: 0.85, color: 'cyan' },
    { word: 'note', strength: 0.9, color: 'magenta' },
    { word: 'concert', strength: 0.6, color: 'violet' },
    { word: 'lyrics', strength: 0.7, color: 'teal' },
    { word: 'band', strength: 0.65, color: 'cyan' },
    { word: 'listen', strength: 0.75, color: 'violet' },
  ],
  'fire': [
    { word: 'flame', strength: 0.95, color: 'magenta' },
    { word: 'heat', strength: 0.9, color: 'magenta' },
    { word: 'burn', strength: 0.85, color: 'violet' },
    { word: 'light', strength: 0.8, color: 'cyan' },
    { word: 'spark', strength: 0.85, color: 'magenta' },
    { word: 'smoke', strength: 0.75, color: 'teal' },
    { word: 'warm', strength: 0.7, color: 'magenta' },
    { word: 'ember', strength: 0.8, color: 'violet' },
    { word: 'match', strength: 0.65, color: 'cyan' },
    { word: 'ignite', strength: 0.75, color: 'magenta' },
    { word: 'candle', strength: 0.7, color: 'cyan' },
    { word: 'ash', strength: 0.6, color: 'teal' },
  ],
  'time': [
    { word: 'clock', strength: 0.95, color: 'cyan' },
    { word: 'hour', strength: 0.9, color: 'cyan' },
    { word: 'minute', strength: 0.85, color: 'cyan' },
    { word: 'past', strength: 0.75, color: 'violet' },
    { word: 'future', strength: 0.75, color: 'violet' },
    { word: 'watch', strength: 0.8, color: 'teal' },
    { word: 'moment', strength: 0.8, color: 'magenta' },
    { word: 'second', strength: 0.85, color: 'cyan' },
    { word: 'date', strength: 0.7, color: 'teal' },
    { word: 'calendar', strength: 0.65, color: 'teal' },
    { word: 'schedule', strength: 0.6, color: 'magenta' },
    { word: 'age', strength: 0.7, color: 'violet' },
  ],
};

const COLORS: NodeColor[] = ['cyan', 'magenta', 'violet', 'teal'];

/**
 * Get a random word from the database
 */
export function getRandomCenterWord(): string {
  const words = Object.keys(WORD_DATABASE);
  return words[Math.floor(Math.random() * words.length)];
}

/**
 * Get related words for a center word
 */
export function getRelatedWords(centerWord: string): RelatedWord[] {
  const lowerWord = centerWord.toLowerCase();
  return WORD_DATABASE[lowerWord] || generateGenericRelatedWords(centerWord);
}

/**
 * Generate generic related words if center word not in database
 * Uses simple heuristics for demo purposes
 */
function generateGenericRelatedWords(centerWord: string): RelatedWord[] {
  // This is a fallback for words not in our database
  // In production, this would call an API or use word embeddings
  const genericWords = [
    'thing', 'object', 'concept', 'idea', 'item', 'element',
    'part', 'piece', 'type', 'kind', 'form', 'shape',
    'big', 'small', 'new', 'old', 'good', 'bad',
    'make', 'use', 'get', 'see', 'know', 'take'
  ];

  return genericWords.slice(0, 12).map((word, index) => ({
    word,
    strength: 0.5 - (index * 0.02),
    color: COLORS[index % COLORS.length],
  }));
}

/**
 * Create a game configuration
 */
export function createGameConfig(centerWord?: string, maxGuesses: number = 3): GameConfig {
  const word = centerWord || getRandomCenterWord();
  const relatedWords = getRelatedWords(word);

  return {
    totalTime: 180, // 3 minutes
    maxGuesses,
    centerWord: word,
    relatedWords,
  };
}

/**
 * Check if a guess is correct (case-insensitive)
 */
export function checkGuess(guess: string, centerWord: string): boolean {
  return guess.toLowerCase().trim() === centerWord.toLowerCase().trim();
}

/**
 * Calculate distance from center based on relationship strength
 * Stronger relationship = closer to center
 */
export function calculateNodeDistance(strength: number): number {
  // Strength 0.95-1.0 -> Distance 30-50 (very close)
  // Strength 0.7-0.95 -> Distance 50-100 (close)
  // Strength 0.5-0.7 -> Distance 100-150 (medium)
  // Strength < 0.5 -> Distance 150-200 (far)

  if (strength >= 0.95) {
    return 30 + Math.random() * 20;
  } else if (strength >= 0.7) {
    return 50 + (1 - strength) * 200;
  } else if (strength >= 0.5) {
    return 100 + (1 - strength) * 100;
  } else {
    return 150 + Math.random() * 50;
  }
}

/**
 * Format a revealed clue for display
 */
export function formatClue(word: string, strength: number): string {
  const strengthLabel = strength > 0.8 ? '★★★' : strength > 0.6 ? '★★' : '★';
  return `${word} ${strengthLabel}`;
}

/**
 * Get hint based on number of revealed nodes
 */
export function getProgressHint(revealedCount: number, totalCount: number): string {
  const ratio = revealedCount / totalCount;

  if (ratio === 0) {
    return "Tap glowing orbs to reveal clues about the hidden word...";
  } else if (ratio < 0.25) {
    return "You're just getting started. Keep exploring!";
  } else if (ratio < 0.5) {
    return "The connections are forming. Can you see the pattern?";
  } else if (ratio < 0.75) {
    return "You're getting close! The central concept is emerging...";
  } else {
    return "Almost there! Put the pieces together...";
  }
}

/**
 * Validate a word (basic validation for input)
 */
export function isValidWord(word: string): boolean {
  return /^[a-zA-Z]{2,20}$/.test(word.trim());
}

/**
 * Get all available center words (for testing/debugging)
 */
export function getAvailableWords(): string[] {
  return Object.keys(WORD_DATABASE);
}
