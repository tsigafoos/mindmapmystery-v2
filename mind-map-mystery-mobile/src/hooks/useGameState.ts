import { useCallback, useReducer, useEffect } from 'react';
import type { GameState, GameConfig, GameAction, WordNode, RevealedClue, GraphData } from '../types/game';
import { categorizeWord, SCORING } from '../utils/thematicColors';

function createInitialState(config: GameConfig): GameState {
  const nodes: WordNode[] = config.relatedWords.map((word, index) => ({
    id: `node-${index}`,
    word: word.word,
    relationshipStrength: word.strength,
    isRevealed: false,
    category: word.category || categorizeWord(word.word),
    tier: word.tier || 3,
  }));

  return {
    centerWord: config.centerWord,
    nodes,
    revealedClues: [],
    timeRemaining: config.totalTime,
    isGameOver: false,
    isWinner: false,
    guessCount: 0,
    score: 0, // Running score starts at 0 (additive)
    startTime: null, // Game hasn't started yet
    endTime: null,
    hintsUsed: 0,
    isPaused: false,
  };
}

// Calculate global score based on solve time
function calculateGlobalScore(startTime: number, endTime: number): number {
  const solveTimeSeconds = Math.floor((endTime - startTime) / 1000);
  const score = SCORING.BASE_SCORE - (solveTimeSeconds * SCORING.TIME_PENALTY_PER_SECOND);
  return Math.max(score, SCORING.MIN_SCORE);
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      if (state.startTime !== null) return state; // Already started
      return {
        ...state,
        startTime: Date.now(),
      };
    }

    case 'REVEAL_NODE': {
      if (state.isGameOver) return state;

      const nodeIndex = state.nodes.findIndex((n) => n.id === action.nodeId);
      if (nodeIndex === -1 || state.nodes[nodeIndex].isRevealed) return state;

      const updatedNodes = [...state.nodes];
      updatedNodes[nodeIndex] = { ...updatedNodes[nodeIndex], isRevealed: true };

      const revealedNode = updatedNodes[nodeIndex];
      const newClue: RevealedClue = {
        word: revealedNode.word,
        relationshipStrength: revealedNode.relationshipStrength,
        revealedAt: Date.now(),
        tier: revealedNode.tier,
      };

      // Add tiered bonus for revealed node
      const tierBonus = revealedNode.tier === 1 
        ? SCORING.TIER_1_BONUS 
        : revealedNode.tier === 2 
          ? SCORING.TIER_2_BONUS 
          : SCORING.TIER_3_BONUS;

      return {
        ...state,
        nodes: updatedNodes,
        revealedClues: [...state.revealedClues, newClue],
        score: state.score + tierBonus,
      };
    }

    case 'USE_HINT': {
      if (state.isGameOver) return state;
      return {
        ...state,
        hintsUsed: state.hintsUsed + 1,
        score: state.score - SCORING.HINT_PENALTY,
      };
    }

    case 'MAKE_GUESS': {
      if (state.isGameOver) return state;

      const isCorrect = action.guess.toLowerCase().trim() === state.centerWord.toLowerCase().trim();
      const newGuessCount = state.guessCount + 1;

      if (isCorrect) {
        const endTime = Date.now();
        // Calculate final score: additive score + global time-based score
        const globalScore = state.startTime 
          ? calculateGlobalScore(state.startTime, endTime)
          : SCORING.MIN_SCORE;
        const finalScore = state.score + SCORING.CORRECT_GUESS + globalScore;

        return { 
          ...state, 
          isGameOver: true, 
          isWinner: true, 
          guessCount: newGuessCount,
          endTime,
          score: finalScore,
        };
      }

      return { ...state, guessCount: newGuessCount };
    }

    case 'TICK_TIMER': {
      if (state.isGameOver || state.isPaused) return state;

      const newTime = state.timeRemaining - 1;
      if (newTime <= 0) {
        return { ...state, timeRemaining: 0, isGameOver: true, isWinner: false, endTime: Date.now() };
      }

      return { ...state, timeRemaining: newTime };
    }

    case 'PAUSE_GAME': {
      if (state.isGameOver || !state.startTime) return state;
      return { ...state, isPaused: true };
    }

    case 'RESUME_GAME': {
      return { ...state, isPaused: false };
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
  resetGame: (newConfig?: GameConfig) => void;
  startGame: () => void;
  useHint: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  revealedCount: number;
  totalNodes: number;
}

export function useGameState(options: UseGameStateOptions): UseGameStateReturn {
  const { config, onGameOver, onWin } = options;

  const [state, dispatch] = useReducer(gameReducer, config, createInitialState);

  const graphData: GraphData = {
    nodes: [
      { id: 'center', word: state.centerWord, relationshipStrength: 1, isRevealed: false, category: 'uncategorized' },
      ...state.nodes,
    ],
    links: state.nodes.map(node => ({
      source: 'center',
      target: node.id,
      strength: node.relationshipStrength,
    })),
  };

  useEffect(() => {
    if (state.isGameOver) {
      state.isWinner ? onWin?.(state) : onGameOver?.(state);
    }
  }, [state.isGameOver, state.isWinner, state, onGameOver, onWin]);

  useEffect(() => {
    if (state.isGameOver || state.startTime === null) return;
    const timer = setInterval(() => {
      dispatch({ type: 'TICK_TIMER' });
    }, 1000);
    return () => clearInterval(timer);
  }, [state.isGameOver, state.startTime]);

  const revealNode = useCallback((nodeId: string) => {
    dispatch({ type: 'REVEAL_NODE', nodeId });
  }, []);

  const makeGuess = useCallback((guess: string): boolean => {
    const isCorrect = guess.toLowerCase().trim() === state.centerWord.toLowerCase().trim();
    dispatch({ type: 'MAKE_GUESS', guess });
    return isCorrect;
  }, [state.centerWord]);

  const resetGame = useCallback((newConfig?: GameConfig) => {
    const configToUse = newConfig || config;
    dispatch({ type: 'RESET_GAME', config: configToUse });
  }, [config]);

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  const useHint = useCallback(() => {
    dispatch({ type: 'USE_HINT' });
  }, []);

  const pauseGame = useCallback(() => {
    dispatch({ type: 'PAUSE_GAME' });
  }, []);

  const resumeGame = useCallback(() => {
    dispatch({ type: 'RESUME_GAME' });
  }, []);

  const revealedCount = state.nodes.filter((n) => n.isRevealed).length;
  const totalNodes = state.nodes.length;

  return { state, graphData, revealNode, makeGuess, resetGame, startGame, useHint, pauseGame, resumeGame, revealedCount, totalNodes };
}
