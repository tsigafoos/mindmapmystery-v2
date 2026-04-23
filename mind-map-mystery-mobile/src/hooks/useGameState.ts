import { useCallback, useReducer, useEffect } from 'react';
import type { GameState, GameConfig, GameAction, WordNode, RevealedClue, GraphData } from '../types/game';
import { categorizeWord } from '../utils/thematicColors';

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

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
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
      };

      return {
        ...state,
        nodes: updatedNodes,
        revealedClues: [...state.revealedClues, newClue],
      };
    }

    case 'MAKE_GUESS': {
      if (state.isGameOver) return state;

      const isCorrect = action.guess.toLowerCase().trim() === state.centerWord.toLowerCase().trim();
      const newGuessCount = state.guessCount + 1;

      if (isCorrect) {
        return { ...state, isGameOver: true, isWinner: true, guessCount: newGuessCount };
      }

      return { ...state, guessCount: newGuessCount };
    }

    case 'TICK_TIMER': {
      if (state.isGameOver) return state;

      const newTime = state.timeRemaining - 1;
      if (newTime <= 0) {
        return { ...state, timeRemaining: 0, isGameOver: true, isWinner: false };
      }

      return { ...state, timeRemaining: newTime };
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
    if (state.isGameOver) return;
    const timer = setInterval(() => {
      dispatch({ type: 'TICK_TIMER' });
    }, 1000);
    return () => clearInterval(timer);
  }, [state.isGameOver]);

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

  const revealedCount = state.nodes.filter((n) => n.isRevealed).length;
  const totalNodes = state.nodes.length;

  return { state, graphData, revealNode, makeGuess, resetGame, revealedCount, totalNodes };
}
