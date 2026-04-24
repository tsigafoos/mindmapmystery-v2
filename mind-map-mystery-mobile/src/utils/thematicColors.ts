import type { WordCategory } from '../types/game';

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

// Base colors for each of the 8 thematic categories (soft neon)
export const CATEGORY_BASE_COLORS: Record<WordCategory, { r: number; g: number; b: number }> = {
  biology:      { r: 100, g: 200, b: 100 },  // Soft grass green
  technology:   { r: 100, g: 244, b: 244 },  // Electric cyan
  sports:       { r: 150, g: 255, b: 100 },  // Bright lime
  food:         { r: 255, g: 150, b: 120 },  // Warm coral
  arts:         { r: 244, g: 100, b: 244 },  // Soft magenta
  business:     { r: 255, g: 215, b: 100 },  // Soft gold
  science:      { r: 180, g: 100, b: 244 },  // Soft violet
  abstract:     { r: 180, g: 120, b: 220 },  // Gentle purple
  uncategorized: { r: 240, g: 240, b: 255 }, // Soft white with cyan hint
};

// Center node color (soft white with cyan aura)
export const CENTER_NODE_COLOR = { r: 245, g: 250, b: 255 };

// Revealed node color (muted gray)
export const REVEALED_NODE_COLOR = { r: 100, g: 100, b: 100 };

/**
 * Generate a color for a node based on its category and relationship strength.
 * - Closer to center (higher strength) = brighter version
 * - Farther from center = softer/muted version
 * - Small random variation so no two nodes are identical
 */
export function getNodeColor(
  category: WordCategory,
  strength: number,
  isRevealed: boolean,
  isCenter: boolean,
  seed?: number
): { r: number; g: number; b: number } {
  // Revealed nodes turn muted gray with almost no glow
  if (isRevealed && !isCenter) {
    return REVEALED_NODE_COLOR;
  }

  // Center node uses special color
  if (isCenter) {
    return CENTER_NODE_COLOR;
  }

  // Get base color for category
  const baseColor = CATEGORY_BASE_COLORS[category];

  // Calculate brightness multiplier based on strength
  // Higher strength (closer to center) = brighter
  // Range: 0.6 (far/weak) to 1.2 (close/strong)
  const brightnessMultiplier = 0.6 + (strength * 0.6);

  // Generate small random variation (±10 RGB values)
  // Use seed if provided for consistency, otherwise random
  const randomOffset = (n: number) => {
    if (seed !== undefined) {
      // Pseudo-random based on seed
      const pseudoRandom = Math.sin(seed * n * 12.9898) * 43758.5453;
      return (pseudoRandom - Math.floor(pseudoRandom)) * 20 - 10;
    }
    return Math.random() * 20 - 10;
  };

  // Apply brightness and variation
  const r = Math.min(255, Math.max(0, Math.round(
    baseColor.r * brightnessMultiplier + randomOffset(1)
  )));
  const g = Math.min(255, Math.max(0, Math.round(
    baseColor.g * brightnessMultiplier + randomOffset(2)
  )));
  const b = Math.min(255, Math.max(0, Math.round(
    baseColor.b * brightnessMultiplier + randomOffset(3)
  )));

  return { r, g, b };
}

/**
 * Convert RGB object to hex string for Three.js
 */
export function rgbToHex(color: { r: number; g: number; b: number }): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

/**
 * Get CSS-friendly RGB string
 */
export function rgbToString(color: { r: number; g: number; b: number }): string {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

/**
 * Word categorization helper
 * Returns the category for a given word
 */
export function categorizeWord(word: string): WordCategory {
  const lowerWord = word.toLowerCase();

  // Biology / Nature keywords
  const biologyWords = [
    'plant', 'leaf', 'chlorophyll', 'photosynthesis', 'cell', 'organism',
    'nature', 'tree', 'flower', 'root', 'stem', 'seed', 'growth', 'green',
    'organic', 'life', 'living', 'biology', 'ecosystem', 'forest'
  ];

  // Technology keywords
  const techWords = [
    'computer', 'digital', 'software', 'hardware', 'code', 'program',
    'internet', 'network', 'data', 'cyber', 'tech', 'electric', 'electronic',
    'robot', 'ai', 'machine', 'system', 'device', 'screen', 'keyboard'
  ];

  // Sports / Movement keywords
  const sportsWords = [
    'run', 'jump', 'sport', 'game', 'play', 'athlete', 'team', 'ball',
    'exercise', 'fitness', 'movement', 'action', 'speed', 'fast', 'energy',
    'active', 'motion', 'dance', 'race', 'competition'
  ];

  // Food / Cooking keywords
  const foodWords = [
    'food', 'cook', 'eat', 'meal', 'kitchen', 'recipe', 'flavor', 'taste',
    'delicious', 'chef', 'restaurant', 'dish', 'ingredient', 'spice', 'sweet',
    'savory', 'bake', 'grill', 'boil', 'mix'
  ];

  // Arts / Culture keywords
  const artsWords = [
    'art', 'music', 'paint', 'draw', 'dance', 'song', 'culture', 'creative',
    'design', 'color', 'beautiful', 'elegant', 'style', 'fashion', 'poetry',
    'theater', 'film', 'movie', 'book', 'literature'
  ];

  // Business / Strategy keywords
  const businessWords = [
    'business', 'money', 'profit', 'strategy', 'plan', 'goal', 'success',
    'market', 'trade', 'sell', 'buy', 'company', 'corporate', 'finance',
    'invest', 'economy', 'growth', 'leader', 'manager', 'deal'
  ];

  // Science / Physics keywords
  const scienceWords = [
    'science', 'physics', 'chemistry', 'atom', 'molecule', 'electron', 'proton',
    'energy', 'force', 'gravity', 'light', 'wave', 'particle', 'quantum',
    'experiment', 'lab', 'research', 'theory', 'discovery', 'carbon', 'oxygen',
    'glucose', 'co2', 'water', 'stomata', 'sunlight', 'mitochondria', 'atp'
  ];

  // Abstract / Emotions keywords
  const abstractWords = [
    'love', 'happy', 'sad', 'anger', 'fear', 'joy', 'hope', 'dream',
    'imagine', 'think', 'feel', 'emotion', 'spirit', 'soul', 'mind',
    'memory', 'time', 'space', 'infinity', 'eternity', 'peace'
  ];

  if (biologyWords.some(w => lowerWord.includes(w))) return 'biology';
  if (techWords.some(w => lowerWord.includes(w))) return 'technology';
  if (sportsWords.some(w => lowerWord.includes(w))) return 'sports';
  if (foodWords.some(w => lowerWord.includes(w))) return 'food';
  if (artsWords.some(w => lowerWord.includes(w))) return 'arts';
  if (businessWords.some(w => lowerWord.includes(w))) return 'business';
  if (scienceWords.some(w => lowerWord.includes(w))) return 'science';
  if (abstractWords.some(w => lowerWord.includes(w))) return 'abstract';

  return 'uncategorized';
}

/**
 * Get category label for display
 */
export function getCategoryLabel(category: WordCategory): string {
  const labels: Record<WordCategory, string> = {
    biology: 'Biology / Nature',
    technology: 'Technology',
    sports: 'Sports / Movement',
    food: 'Food / Cooking',
    arts: 'Arts / Culture',
    business: 'Business / Strategy',
    science: 'Science / Physics',
    abstract: 'Abstract / Emotions',
    uncategorized: 'General',
  };
  return labels[category];
}
