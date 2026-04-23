/**
 * Guess Input Component
 * Text input at bottom for word guesses
 */

import React, { useState, useCallback, type FormEvent } from 'react';
import '../../styles/theme.css';

interface GuessInputProps {
  onGuess: (guess: string) => void;
  isDisabled: boolean;
  guessCount: number;
  placeholder?: string;
}

export const GuessInput: React.FC<GuessInputProps> = ({
  onGuess,
  isDisabled,
  guessCount,
  placeholder = 'Enter your guess...',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      if (!inputValue.trim() || isDisabled) return;

      const trimmedGuess = inputValue.trim().toLowerCase();

      // Basic validation
      if (trimmedGuess.length < 2) {
        setShake(true);
        setTimeout(() => setShake(false), 300);
        return;
      }

      onGuess(trimmedGuess);
      setInputValue('');
    },
    [inputValue, isDisabled, onGuess]
  );

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: `translateX(-50%) ${shake ? 'translateX(5px)' : ''}`,
        zIndex: 100,
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        transition: 'transform 0.1s ease',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          display: 'flex',
          gap: '12px',
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          disabled={isDisabled}
          maxLength={20}
          style={{
            flex: 1,
            background: 'var(--ui-input-bg)',
            border: `1px solid ${isDisabled ? 'var(--text-muted)' : 'var(--ui-border)'}`,
            borderRadius: '12px',
            padding: '16px 20px',
            fontSize: 'var(--font-md)',
            color: 'var(--text-primary)',
            outline: 'none',
            transition: 'all var(--hover-transition)',
            boxShadow: isDisabled
              ? 'none'
              : `0 0 20px rgba(100, 244, 244, 0.1), inset 0 0 20px rgba(100, 244, 244, 0.05)`,
          }}
          onFocus={(e) => {
            if (!isDisabled) {
              e.currentTarget.style.borderColor = 'var(--ui-border-hover)';
              e.currentTarget.style.boxShadow =
                '0 0 25px rgba(100, 244, 244, 0.2), inset 0 0 25px rgba(100, 244, 244, 0.1)';
            }
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = isDisabled
              ? 'var(--text-muted)'
              : 'var(--ui-border)';
            e.currentTarget.style.boxShadow = isDisabled
              ? 'none'
              : '0 0 20px rgba(100, 244, 244, 0.1), inset 0 0 20px rgba(100, 244, 244, 0.05)';
          }}
        />
        <button
          type="submit"
          disabled={isDisabled || !inputValue.trim()}
          style={{
            background: isDisabled
              ? 'var(--node-revealed)'
              : 'var(--ui-button-bg)',
            border: `1px solid ${
              isDisabled ? 'var(--text-muted)' : 'var(--node-cyan)'
            }`,
            borderRadius: '12px',
            padding: '16px 24px',
            fontSize: 'var(--font-md)',
            fontWeight: 600,
            color: isDisabled ? 'var(--text-muted)' : 'var(--node-cyan)',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            transition: 'all var(--hover-transition)',
            boxShadow: isDisabled
              ? 'none'
              : '0 0 20px rgba(100, 244, 244, 0.2)',
          }}
          onMouseEnter={(e) => {
            if (!isDisabled) {
              e.currentTarget.style.background = 'var(--ui-button-hover)';
              e.currentTarget.style.boxShadow =
                '0 0 30px rgba(100, 244, 244, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isDisabled
              ? 'var(--node-revealed)'
              : 'var(--ui-button-bg)';
            e.currentTarget.style.boxShadow = isDisabled
              ? 'none'
              : '0 0 20px rgba(100, 244, 244, 0.2)';
          }}
        >
          Guess
        </button>
      </form>

      <div
        style={{
          fontSize: 'var(--font-sm)',
          color: 'var(--text-muted)',
        }}
      >
        {isDisabled ? (
          <span>Game Over</span>
        ) : (
          <span>
            Guess #{guessCount + 1} • Type a word and press Enter or click Guess
          </span>
        )}
      </div>
    </div>
  );
};

export default GuessInput;
