import { useState, useCallback } from 'react';
import type { GameConfig, WordNode, RelatedWord } from '../../types/game';
import { useGameState } from '../../hooks/useGameState';
import { categorizeWord, CATEGORY_BASE_COLORS } from '../../utils/thematicColors';
import type { WordCategory } from '../../types/game';
import GameGraph from './GameGraph';
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

interface UsedHint {
  id: number;
  text: string;
  result: string;
  type: 'letter' | 'node' | 'length';
}

export default function Game() {
  const [config] = useState<GameConfig>(DEFAULT_CONFIG);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; message: string } | null>(null);
  const [usedHints, setUsedHints] = useState<UsedHint[]>([]);
  const [showColorKey, setShowColorKey] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<WordNode | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const {
    state,
    graphData,
    revealNode,
    makeGuess,
    revealedCount,
    totalNodes,
  } = useGameState({
    config,
    onGameOver: () => {},
    onWin: () => {},
  });

  // Handle node click
  const handleNodeClick = useCallback((node: WordNode) => {
    if (state.isGameOver) return;
    if (!node.isRevealed && node.id !== 'center') {
      revealNode(node.id);
    }
  }, [revealNode, state.isGameOver]);

  // Handle node hover
  const handleNodeHover = useCallback((node: WordNode | null, x?: number, y?: number) => {
    setHoveredNode(node);
    if (x !== undefined && y !== undefined) {
      setMousePos({ x, y });
    }
  }, []);

  // Handle using a hint - adds a hint card to the sidebar
  const useHint = useCallback((hintId: number) => {
    const hints = [
      { id: 1, text: 'First Letter', getValue: () => `"${state.centerWord.charAt(0).toUpperCase()}"` },
      { id: 2, text: 'Random Word', getValue: () => {
        const unrevealedWords = state.nodes.filter(n => !n.isRevealed && n.id !== 'center');
        if (unrevealedWords.length > 0) {
          const randomIndex = Math.floor(Math.random() * unrevealedWords.length);
          return unrevealedWords[randomIndex].word;
        }
        return state.nodes.find(n => n.id !== 'center')?.word || '?';
      }},
      { id: 3, text: 'Word Length', getValue: () => `${state.centerWord.length} letters` },
    ];

    const hint = hints.find(h => h.id === hintId);
    if (!hint || usedHints.some(uh => uh.id === hintId)) return;

    const result = hint.getValue();

    setUsedHints(prev => [...prev, {
      id: hint.id,
      text: hint.text,
      result: result,
      type: hint.id === 1 ? 'letter' : hint.id === 2 ? 'node' : 'length',
    }]);
  }, [state.centerWord, usedHints, state.nodes]);

  const isHintUsed = (hintId: number) => usedHints.some(h => h.id === hintId);

  // Handle guess submission
  const handleGuessSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim() || state.isGameOver) return;

    const isCorrect = makeGuess(guess.trim());

    if (isCorrect) {
      setFeedback({ type: 'success', message: '🎉 Correct! You solved it!' });
    } else {
      setFeedback({ type: 'error', message: '❌ Not quite. Keep exploring!' });
      setTimeout(() => setFeedback(null), 2000);
    }

    setGuess('');
  }, [guess, makeGuess, state.isGameOver]);

  // Get revealed node IDs
  const revealedNodeIds = state.nodes
    .filter(n => n.isRevealed)
    .map(n => n.id);

  // Get category color for legend
  const getCategoryColor = (category: WordCategory): string => {
    const color = CATEGORY_BASE_COLORS[category];
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  };

  return (
    <div className="game-container">
      {/* Animated Starry Background */}
      <div className="stars-container">
        <div className="stars" />
        <div className="stars" />
        <div className="stars" />
        <div className="nebula" />
      </div>

      {/* Header - Centered Title */}
      <header className="game-header">
        <div className="game-title">
          <span className="game-title-icon">🧠</span>
          <span>Mind Map Mystery</span>
        </div>

        <button 
          className="color-key-btn"
          onClick={() => setShowColorKey(true)}
          title="Color Key"
        >
          🎨
        </button>
      </header>

      {/* Hints Bar - Below header */}
      <div className="hints-bar-container">
        <span className="hints-label">Hints:</span>
        <div className="hints-chips">
          {[
            { id: 1, text: 'First letter', icon: 'A' },
            { id: 2, text: 'Random word', icon: '?' },
            { id: 3, text: 'Word length', icon: '#' },
          ].map(hint => {
            const used = isHintUsed(hint.id);
            return (
              <button
                key={hint.id}
                className={`hint-chip ${used ? 'used' : ''}`}
                onClick={() => !used && useHint(hint.id)}
                disabled={used}
                title={hint.text}
              >
                <span className="hint-chip-icon">{hint.icon}</span>
                <span className="hint-chip-text">{hint.text}</span>
                {used && <span className="hint-chip-check">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Game Area */}
      <div className="game-layout">
        {/* Left Side - Vertical Scrollable Hint Cards */}
        {(state.revealedClues.length > 0 || usedHints.length > 0) && (
          <div className="hint-cards-sidebar">
            <div className="hint-cards-sidebar-header">
              <span>Hints</span>
              <span className="hint-count">{state.revealedClues.length + usedHints.length}</span>
            </div>
            <div className="hint-cards-vertical">
              {/* Hint Result Cards - from clicking hint buttons */}
              {usedHints.map((hint, index) => (
                <div
                  key={`hint-${hint.id}`}
                  className="hint-card-vertical hint-card-flipped"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="hint-card-hint-label">{hint.text}</div>
                  <div className="hint-card-hint-value">{hint.result}</div>
                </div>
              ))}
              {/* Revealed Clue Cards - from clicking nodes */}
              {[...state.revealedClues]
                .sort((a, b) => b.relationshipStrength - a.relationshipStrength)
                .map((clue, index) => {
                  const category = categorizeWord(clue.word);
                  return (
                    <div
                      key={`clue-${index}`}
                      className="hint-card-vertical"
                      style={{ animationDelay: `${(usedHints.length + index) * 0.05}s` }}
                    >
                      <div className="hint-card-word">{clue.word}</div>
                      <div
                        className="hint-card-category"
                        style={{ color: getCategoryColor(category) }}
                      >
                        {category}
                      </div>
                      <div className="hint-card-strength">
                        {Math.round(clue.relationshipStrength * 100)}%
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Center - 3D Graph */}
        <div className="graph-area">
          <GameGraph
            graphData={graphData}
            onNodeClick={handleNodeClick}
            onNodeHover={handleNodeHover}
            revealedNodes={revealedNodeIds}
          />

          {/* Hover Tooltip */}
          {hoveredNode && hoveredNode.id !== 'center' && (
            <div 
              className="node-tooltip"
              style={{
                left: mousePos.x,
                top: mousePos.y - 40,
              }}
            >
              {hoveredNode.isRevealed ? hoveredNode.word : '???'}
            </div>
          )}

          {/* Feedback Toast */}
          {feedback && (
            <div className={`feedback-toast ${feedback.type}`}>
              {feedback.message}
            </div>
          )}
        </div>

        {/* Bottom Guess Input - Centered */}
        <div className="bottom-guess-container">
          <div className="guess-form-container">
            <div className="guess-label-row">
              <div className="guess-timer">{formatTime(state.timeRemaining)}</div>
              <div className="guess-stat">
                <span className="guess-stat-label">Guesses</span>
                <span className="guess-stat-value">{state.guessCount}</span>
              </div>
              <div className="guess-stat">
                <span className="guess-stat-label">Clues</span>
                <span className="guess-stat-value">{revealedCount}/{totalNodes}</span>
              </div>
            </div>
            <form onSubmit={handleGuessSubmit} className="guess-form-row">
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="What's the mystery word?"
                className="guess-input-bottom"
                disabled={state.isGameOver}
                maxLength={20}
              />
              <button
                type="submit"
                className="guess-submit-btn"
                disabled={!guess.trim() || state.isGameOver}
              >
                Guess
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Color Key Modal */}
      {showColorKey && (
        <div className="modal-overlay" onClick={() => setShowColorKey(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Thematic Colors</h3>
            <div className="color-key-list">
              {[
                { category: 'biology', label: 'Biology / Nature' },
                { category: 'science', label: 'Science / Physics' },
                { category: 'technology', label: 'Technology' },
                { category: 'sports', label: 'Sports / Movement' },
                { category: 'food', label: 'Food / Cooking' },
                { category: 'arts', label: 'Arts / Culture' },
                { category: 'business', label: 'Business / Strategy' },
                { category: 'abstract', label: 'Abstract / Emotions' },
                { category: 'uncategorized', label: 'General' },
              ].map(({ category, label }) => (
                <div key={category} className="color-key-item">
                  <span 
                    className="color-key-dot" 
                    style={{ backgroundColor: getCategoryColor(category as WordCategory) }}
                  />
                  <span className="color-key-label">{label}</span>
                </div>
              ))}
            </div>
            <button className="modal-close-btn" onClick={() => setShowColorKey(false)}>
              Close
            </button>
          </div>
        </div>
      )}

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
