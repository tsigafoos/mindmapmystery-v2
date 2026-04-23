/**
 * Game Header Component
 * Displays title and game status
 */

import React from 'react';
import '../../styles/theme.css';

interface GameHeaderProps {
  isGameOver: boolean;
  isWinner: boolean;
  guessCount: number;
  revealedCount: number;
  totalNodes: number;
  onNewGame: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  isGameOver,
  isWinner,
  guessCount,
  revealedCount,
  totalNodes,
  onNewGame,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Title Card */}
      <div
        style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--ui-border)',
          borderRadius: '12px',
          padding: '16px 24px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 'var(--font-title)',
            fontWeight: 700,
            background: 'linear-gradient(90deg, var(--node-cyan), var(--node-magenta))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.5px',
          }}
        >
          Mind Map Mystery
        </h1>
        <p
          style={{
            margin: '4px 0 0 0',
            fontSize: 'var(--font-sm)',
            color: 'var(--text-secondary)',
          }}
        >
          Discover the hidden word by exploring the connections
        </p>
      </div>

      {/* Status / Results */}
      {isGameOver && (
        <div
          className="fade-in"
          style={{
            background: isWinner
              ? 'rgba(100, 244, 160, 0.15)'
              : 'rgba(244, 100, 100, 0.15)',
            border: `1px solid ${
              isWinner ? 'var(--status-success)' : 'var(--status-error)'
            }`,
            borderRadius: '12px',
            padding: '16px 24px',
            backdropFilter: 'blur(10px)',
            boxShadow: `0 0 30px ${
              isWinner
                ? 'rgba(100, 244, 160, 0.3)'
                : 'rgba(244, 100, 100, 0.3)'
            }`,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 'var(--font-xl)',
              color: isWinner ? 'var(--status-success)' : 'var(--status-error)',
              textShadow: `0 0 20px ${
                isWinner
                  ? 'rgba(100, 244, 160, 0.5)'
                  : 'rgba(244, 100, 100, 0.5)'
              }`,
            }}
          >
            {isWinner ? '🎉 You Won!' : '💔 Game Over'}
          </h2>
          <p
            style={{
              margin: '8px 0 0 0',
              fontSize: 'var(--font-sm)',
              color: 'var(--text-secondary)',
            }}
          >
            {isWinner
              ? `Solved in ${guessCount} guesses! Revealed ${revealedCount} of ${totalNodes} clues.`
              : `You revealed ${revealedCount} of ${totalNodes} clues and made ${guessCount} guesses.`}
          </p>
          <button
            onClick={onNewGame}
            style={{
              marginTop: '12px',
              background: isWinner
                ? 'rgba(100, 244, 160, 0.2)'
                : 'rgba(244, 100, 100, 0.2)',
              border: `1px solid ${
                isWinner ? 'var(--status-success)' : 'var(--status-error)'
              }`,
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: 'var(--font-sm)',
              fontWeight: 600,
              color: isWinner
                ? 'var(--status-success)'
                : 'var(--status-error)',
              cursor: 'pointer',
              transition: 'all var(--hover-transition)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isWinner
                ? 'rgba(100, 244, 160, 0.3)'
                : 'rgba(244, 100, 100, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isWinner
                ? 'rgba(100, 244, 160, 0.2)'
                : 'rgba(244, 100, 100, 0.2)';
            }}
          >
            Play Again
          </button>
        </div>
      )}

      {/* Progress Stats (when game is active) */}
      {!isGameOver && (
        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--ui-border)',
            borderRadius: '8px',
            padding: '10px 16px',
            display: 'flex',
            gap: '16px',
            fontSize: 'var(--font-sm)',
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>
            Revealed:{' '}
            <span style={{ color: 'var(--node-cyan)', fontWeight: 600 }}>
              {revealedCount}/{totalNodes}
            </span>
          </span>
          <span style={{ color: 'var(--text-muted)' }}>
            Guesses:{' '}
            <span style={{ color: 'var(--node-magenta)', fontWeight: 600 }}>
              {guessCount}
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

export default GameHeader;
