/**
 * Game State Hook
 * Manages the complete game state and logic
 */

import { useCallback, useReducer, useEffect } from 'react';
import type {
  GameState,
  GameConfig,
  GameAction,
  WordNode,
  RevealedClue,
  GraphData,
} from '../types/game';
import { categorizeWord } from '../utils/thematicColors';

// Initial state factory
function createInitialState(config: GameConfig): GameState {
  const nodes: WordNode[] = config.relatedWords.map((word, index) => ({
    id: `node-${index}`,
    word: word.word,
    relationshipStrength: word.strength,
    isRevealed: false,
    category: word.category || categorizeWord(word.word),
  }));

  return {
    centerWord: config.centerWord,
    nodes,
    revealedClues: [],
    timeRemaining: config.totalTime,
    isGameOver: false,
    isWinner: false,
    guessCount: 0,
  };
}

// Game reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'REVEAL_NODE': {
      if (state.isGameOver) return state;

      const nodeIndex = state.nodes.findIndex((n) => n.id === action.nodeId);
      if (nodeIndex === -1 || state.nodes[nodeIndex].isRevealed) return state;

      const updatedNodes = [...state.nodes];
      updatedNodes[nodeIndex] = {
        ...updatedNodes[nodeIndex],
        isRevealed: true,
      };

      const revealedNode = updatedNodes[nodeIndex];
      const newClue: RevealedClue = {
        word: revealedNode.word,
        relationshipStrength: revealedNode.relationshipStrength,
        revealedAt: Date.now(),
      };

      return {
        ...state,
        nodes: updatedNodes,
        revealedClues: [...state.revealedClues, newClue],
      };
    }

    case 'MAKE_GUESS': {
      if (state.isGameOver) return state;

      const isCorrect = checkGuess(action.guess, state.centerWord);
      const newGuessCount = state.guessCount + 1;

      if (isCorrect) {
        return {
          ...state,
          isGameOver: true,
          isWinner: true,
          guessCount: newGuessCount,
        };
      }

      // Check if out of guesses
      // For now, unlimited guesses until time runs out
      // Could add max guess limit later
      return {
        ...state,
        guessCount: newGuessCount,
      };
    }

    case 'TICK_TIMER': {
      if (state.isGameOver) return state;

      const newTime = state.timeRemaining - 1;
      if (newTime <= 0) {
        return {
          ...state,
          timeRemaining: 0,
          isGameOver: true,
          isWinner: false,
        };
      }

      return {
        ...state,
        timeRemaining: newTime,
      };
    }

    case 'RESET_GAME': {
      return createInitialState(action.config);
    }

    default:
      return state;
  }
}

interface UseGameStateOptions {
  config: GameConfig;
  onGameOver?: (state: GameState) => void;
  onWin?: (state: GameState) => void;
}

interface UseGameStateReturn {
  state: GameState;
  graphData: GraphData;
  revealNode: (nodeId: string) => void;
  makeGuess: (guess: string) => boolean;
  tickTimer: () => void;
  resetGame: (newConfig?: GameConfig) => void;
  getHint: () => string;
  revealedCount: number;
  totalNodes: number;
}

export function useGameState(options: UseGameStateOptions): UseGameStateReturn {
  const { config, onGameOver, onWin } = options;

  const [state, dispatch] = useReducer(gameReducer, config, createInitialState);

  // Create graph data - include center node + child nodes
  const graphData: GraphData = {
    nodes: [
      {
        id: 'center',
        word: state.centerWord,
        relationshipStrength: 1,
        isRevealed: false,
        category: 'uncategorized',
      },
      ...state.nodes,
    ],
    links: state.nodes.map(node => ({
      source: 'center',
      target: node.id,
      strength: node.relationshipStrength,
    })),
  };

  // Watch for game over conditions
  useEffect(() => {
    if (state.isGameOver) {
      if (state.isWinner) {
        onWin?.(state);
      } else {
        onGameOver?.(state);
      }
    }
  }, [state.isGameOver, state.isWinner, state, onGameOver, onWin]);

  // Timer effect
  useEffect(() => {
    if (state.isGameOver) return;

    const timer = setInterval(() => {
      dispatch({ type: 'TICK_TIMER' });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.isGameOver]);

  // Actions
  const revealNode = useCallback((nodeId: string) => {
    dispatch({ type: 'REVEAL_NODE', nodeId });
  }, []);

  const makeGuess = useCallback((guess: string): boolean => {
    const isCorrect = checkGuess(guess, state.centerWord);
    dispatch({ type: 'MAKE_GUESS', guess });
    return isCorrect;
  }, [state.centerWord]);

  const tickTimer = useCallback(() => {
    dispatch({ type: 'TICK_TIMER' });
  }, []);

  const resetGame = useCallback((newConfig?: GameConfig) => {
    const configToUse = newConfig || config;
    dispatch({ type: 'RESET_GAME', config: configToUse });
  }, [config]);

  const getHint = useCallback((): string => {
    return getProgressHint(state.revealedClues.length, state.nodes.length);
  }, [state.revealedClues.length, state.nodes.length]);

  const revealedCount = state.nodes.filter((n) => n.isRevealed).length;
  const totalNodes = state.nodes.length;

  return {
    state,
    graphData,
    revealNode,
    makeGuess,
    tickTimer,
    resetGame,
    getHint,
    revealedCount,
    totalNodes,
  };
}

// Check if a guess matches the target word
function checkGuess(guess: string, target: string): boolean {
  return guess.toLowerCase().trim() === target.toLowerCase().trim();
}

// Get hint based on progress
function getProgressHint(revealedCount: number, totalCount: number): string {
  const progress = revealedCount / totalCount;

  if (progress === 0) {
    return 'Start by clicking on any glowing node to reveal a clue!';
  } else if (progress < 0.3) {
    return 'Keep exploring! Look for thematic connections between the revealed words.';
  } else if (progress < 0.6) {
    return 'You\'re making progress! Try to see the bigger picture connecting these concepts.';
  } else {
    return 'You have most of the clues! Can you guess the central concept now?';
  }
}

/**
 * Check if a guess is close (levenshtein distance)
 * Could be used for "warm/cold" hints
 */
export function isCloseGuess(guess: string, target: string): boolean {
  const g = guess.toLowerCase().trim();
  const t = target.toLowerCase().trim();

  // Exact match
  if (g === t) return true;

  // Contains target
  if (g.includes(t) || t.includes(g)) return true;

  // Simple length check for now
  const lenDiff = Math.abs(g.length - t.length);
  if (lenDiff <= 1 && g.length >= 3) {
    // Could add levenshtein here for fuzzy matching
    return true;
  }

  return false;
}
