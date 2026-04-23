import { useState, useCallback } from 'react';

export interface UsedHint {
  id: number;
  text: string;
  result: string;
}

interface GuessPanelProps {
  guess: string;
  setGuess: (guess: string) => void;
  onSubmit: (guess: string) => void;
  isGameOver: boolean;
  revealedCount: number;
  centerWord: string;
  onRevealRandomNode: () => void;
  usedHints: UsedHint[];
  onUseHint: (hint: UsedHint) => void;
}

export default function GuessPanel({
  guess,
  setGuess,
  onSubmit,
  isGameOver,
  revealedCount,
  centerWord,
  onRevealRandomNode,
  usedHints,
  onUseHint,
}: GuessPanelProps) {
  const [hints] = useState([
    { id: 1, text: 'Get first letter', getValue: () => `First letter: "${centerWord.charAt(0).toUpperCase()}"` },
    { id: 2, text: 'Reveal random node', getValue: () => 'Revealed a random node!' },
    { id: 3, text: 'Show word length', getValue: () => `Word length: ${centerWord.length} letters` },
  ]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim() && !isGameOver) {
      onSubmit(guess.trim().toLowerCase());
      setGuess('');
    }
  }, [guess, isGameOver, onSubmit, setGuess]);

  const useHint = useCallback((hintId: number) => {
    const hint = hints.find(h => h.id === hintId);
    if (!hint || usedHints.some(uh => uh.id === hintId)) return;

    let result = hint.getValue();

    // Execute hint action
    if (hintId === 2) {
      onRevealRandomNode();
    }

    onUseHint({
      id: hint.id,
      text: hint.text,
      result: result,
    });
  }, [hints, usedHints, onRevealRandomNode, onUseHint]);

  const isHintUsed = (hintId: number) => usedHints.some(h => h.id === hintId);
  const canUseHints = revealedCount >= 2;

  return (
    <div className="guess-panel">
      <h3 className="panel-title">Make Your Guess</h3>
      
      {/* Guess Form - Always visible */}
      <form onSubmit={handleSubmit} className="guess-form">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="What's the mystery word?"
          className="guess-input"
          disabled={isGameOver}
          maxLength={20}
        />
        <button
          type="submit"
          className="guess-button"
          disabled={!guess.trim() || isGameOver}
        >
          Guess
        </button>
      </form>

      {/* Used Hints List */}
      {usedHints.length > 0 && (
        <div className="used-hints-section">
          <h4 className="used-hints-title">Used Hints</h4>
          <div className="used-hints-list">
            {usedHints.map((hint) => (
              <div key={hint.id} className="used-hint-item">
                <span className="used-hint-icon">✓</span>
                <span className="used-hint-result">{hint.result}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Hints */}
      <div className="hint-section">
        <h4 className="hint-title">Need Help?</h4>
        <div className="hint-list">
          {hints.map(hint => {
            const used = isHintUsed(hint.id);
            const locked = !canUseHints && !used;
            
            return (
              <button
                key={hint.id}
                className={`hint-button ${used ? 'used' : ''} ${locked ? 'locked' : ''}`}
                onClick={() => !used && canUseHints && useHint(hint.id)}
                disabled={used || locked}
              >
                <span className="hint-icon">💡</span>
                <span className="hint-text">{hint.text}</span>
                {used && <span className="hint-used">Used</span>}
                {locked && <span className="hint-locked">🔒</span>}
              </button>
            );
          })}
        </div>
        {!canUseHints && (
          <p className="hint-lock-message">
            Reveal 2 clues to unlock hints
          </p>
        )}
      </div>

      <div className="instructions">
        <h4 className="instructions-title">How to Play</h4>
        <ul className="instructions-list">
          <li>Click nodes to reveal related words</li>
          <li>Use the revealed clues to guess</li>
          <li>Thematic colors = category of relationship</li>
          <li>Brighter = stronger connection</li>
        </ul>
      </div>
    </div>
  );
}
