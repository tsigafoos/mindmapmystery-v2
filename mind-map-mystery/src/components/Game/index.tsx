import { useState, useCallback, useEffect } from 'react';
import type { GameConfig, WordNode, RelatedWord } from '../../types/game';
import { useGameState } from '../../hooks/useGameState';
import { categorizeWord } from '../../utils/thematicColors';
import GameGraph from './GameGraph';
import ProgressPanel from './ProgressPanel';
import GuessPanel, { type UsedHint } from './GuessPanel';
import './Game.css';

// Default game configuration with categorized words
const DEFAULT_WORDS: RelatedWord[] = [
  { word: 'chlorophyll', strength: 0.95, category: 'biology' },
  { word: 'sunlight', strength: 0.9, category: 'science' },
  { word: 'carbon', strength: 0.85, category: 'science' },
  { word: 'oxygen', strength: 0.8, category: 'science' },
  { word: 'glucose', strength: 0.75, category: 'science' },
  { word: 'plant', strength: 0.7, category: 'biology' },
  { word: 'leaf', strength: 0.65, category: 'biology' },
  { word: 'green', strength: 0.6, category: 'biology' },
  { word: 'stomata', strength: 0.5, category: 'biology' },
  { word: 'energy', strength: 0.45, category: 'science' },
  { word: 'CO2', strength: 0.4, category: 'science' },
  { word: 'water', strength: 0.35, category: 'science' },
  { word: 'mitochondria', strength: 0.3, category: 'biology' },
  { word: 'ATP', strength: 0.25, category: 'science' },
  { word: 'cell', strength: 0.2, category: 'biology' },
];

const DEFAULT_CONFIG: GameConfig = {
  totalTime: 300,
  maxGuesses: 10,
  centerWord: 'photosynthesis',
  relatedWords: DEFAULT_WORDS,
};

// Game phases
type GamePhase = 'intro' | 'start' | 'playing' | 'ended';

export default function Game() {
  const [config] = useState<GameConfig>(DEFAULT_CONFIG);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; message: string } | null>(null);
  const [gamePhase, setGamePhase] = useState<GamePhase>('intro');
  const [introProgress, setIntroProgress] = useState(0);
  const [usedHints, setUsedHints] = useState<UsedHint[]>([]);

  const {
    state,
    graphData,
    revealNode,
    makeGuess,
    revealedCount,
    totalNodes,
    startGame,
  } = useGameState({
    config,
    onGameOver: () => {
      setGamePhase('ended');
    },
    onWin: () => {
      setGamePhase('ended');
    },
  });

  // Intro animation effect
  useEffect(() => {
    if (gamePhase !== 'intro') return;

    // Simulate intro animation progress
    const interval = setInterval(() => {
      setIntroProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setGamePhase('start');
          return 100;
        }
        return prev + 2; // 2% per tick, completes in ~3 seconds
      });
    }, 50);

    return () => clearInterval(interval);
  }, [gamePhase]);

  const handleStart = useCallback(() => {
    setGamePhase('playing');
    startGame();
  }, [startGame]);

  // Handle node click - works in all phases except ended
  const handleNodeClick = useCallback((node: WordNode) => {
    console.log('Node clicked:', node.word, 'Phase:', gamePhase, 'Already revealed:', node.isRevealed);
    if (gamePhase === 'ended' || state.isGameOver) return;
    if (!node.isRevealed) {
      revealNode(node.id);
    }
  }, [revealNode, state.isGameOver, gamePhase]);

  // Reveal a random unrevealed node (for hints)
  const handleRevealRandomNode = useCallback(() => {
    if (gamePhase !== 'playing') return;
    
    const unrevealedNodes = state.nodes.filter(n => !n.isRevealed);
    if (unrevealedNodes.length > 0) {
      const randomIndex = Math.floor(Math.random() * unrevealedNodes.length);
      revealNode(unrevealedNodes[randomIndex].id);
    }
  }, [revealNode, state.nodes, gamePhase]);

  // Handle using a hint
  const handleUseHint = useCallback((hint: UsedHint) => {
    setUsedHints(prev => [...prev, hint]);
  }, []);

  // Handle guess submission
  const handleGuessSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim() || state.isGameOver || gamePhase !== 'playing') return;

    const isCorrect = makeGuess(guess.trim());

    if (isCorrect) {
      setFeedback({ type: 'success', message: '🎉 Correct! You solved it!' });
    } else {
      setFeedback({ type: 'error', message: '❌ Not quite. Keep exploring!' });
      setTimeout(() => setFeedback(null), 2000);
    }

    setGuess('');
  }, [guess, makeGuess, state.isGameOver, gamePhase]);

  // Get revealed node IDs
  const revealedNodeIds = state.nodes
    .filter(n => n.isRevealed)
    .map(n => n.id);

  // Determine if graph should be interactive
  const isGraphInteractive = gamePhase === 'playing';
  const freezePhysics = gamePhase === 'start' || gamePhase === 'playing' || gamePhase === 'ended';

  return (
    <div className="game-container">
      {/* Header - hidden during intro */}
      {gamePhase !== 'intro' && (
        <header className="game-header">
          <div className="game-title">
            <span className="game-title-icon">🧠</span>
            <span>Mind Map Mystery</span>
          </div>
          <div className="game-stats">
            <div className="stat">
              <span className="stat-label">Time</span>
              <span className="stat-value">{formatTime(state.timeRemaining)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Guesses</span>
              <span className="stat-value">{state.guessCount}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Clues</span>
              <span className="stat-value">{revealedCount}/{totalNodes}</span>
            </div>
          </div>
          <a href="/test-bench" className="dev-link">
            Test Bench
          </a>
        </header>
      )}

      {/* Main Game Area */}
      <div className="game-layout">
        {/* Left Panel - hidden during intro, visible during start/playing/ended */}
        {(gamePhase === 'start' || gamePhase === 'playing' || gamePhase === 'ended') && (
          <div className="left-panel">
            <ProgressPanel
              revealedClues={state.revealedClues}
              revealedCount={revealedCount}
              totalNodes={totalNodes}
              isGameOver={state.isGameOver}
              isWinner={state.isWinner}
            />
          </div>
        )}

        {/* Right Panel - Guess/Hints - always visible */}
        <div className="right-panel">
          <GuessPanel
            guess={guess}
            setGuess={setGuess}
            onSubmit={(g) => {
              const isCorrect = makeGuess(g);
              if (isCorrect) {
                setFeedback({ type: 'success', message: '🎉 Correct! You solved it!' });
              } else {
                setFeedback({ type: 'error', message: '❌ Not quite. Keep exploring!' });
                setTimeout(() => setFeedback(null), 2000);
              }
              setGuess('');
            }}
            isGameOver={state.isGameOver}
            revealedCount={revealedCount}
            centerWord={state.centerWord}
            onRevealRandomNode={handleRevealRandomNode}
            usedHints={usedHints}
            onUseHint={handleUseHint}
          />
        </div>

        {/* Center - 3D Graph */}
        <div className="graph-area">
          <GameGraph
            graphData={graphData}
            onNodeClick={handleNodeClick}
            revealedNodes={revealedNodeIds}
            gamePhase={gamePhase}
            freezePhysics={freezePhysics}
          />

          {/* Intro Overlay */}
          {gamePhase === 'intro' && (
            <div className="intro-overlay">
              <div className="intro-content">
                <h1 className="intro-title">Mind Map Mystery</h1>
                <p className="intro-subtitle">Exploring the unknown...</p>
                <div className="intro-progress-bar">
                  <div 
                    className="intro-progress-fill"
                    style={{ width: `${introProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Start Button Overlay */}
          {gamePhase === 'start' && (
            <div className="start-overlay">
              <div className="start-content">
                <h2 className="start-title">Ready to Play?</h2>
                <p className="start-instructions">
                  Click on glowing nodes to reveal clues.<br />
                  Use the clues to guess the mystery word.
                </p>
                <button className="start-button" onClick={handleStart}>
                  Start Game
                </button>
              </div>
            </div>
          )}

          {/* Feedback Toast */}
          {feedback && (
            <div className={`feedback-toast ${feedback.type}`}>
              {feedback.message}
            </div>
          )}
        </div>
      </div>

      {/* Game Over Overlay */}
      {state.isGameOver && (
        <div className="game-over-overlay">
          <div className="game-over-modal">
            <h2>{state.isWinner ? '🎉 You Won!' : '⏰ Time\'s Up!'}</h2>
            <p>
              {state.isWinner
                ? `You guessed "${state.centerWord}" in ${state.guessCount} tries!`
                : `The word was "${state.centerWord}"`
              }
            </p>
            <p className="game-over-stats">
              Revealed {revealedCount} of {totalNodes} clues
            </p>
            <button
              className="play-again-btn"
              onClick={() => window.location.reload()}
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
