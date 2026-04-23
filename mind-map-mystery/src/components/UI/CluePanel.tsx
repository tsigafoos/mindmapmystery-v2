/**
 * Clue Panel Component
 * Displays revealed clues in a list on the right side
 */

import React from 'react';
import type { RevealedClue } from '../../types/game';
import '../../styles/theme.css';

interface CluePanelProps {
  clues: RevealedClue[];
  totalNodes: number;
  hint: string;
}

export const CluePanel: React.FC<CluePanelProps> = ({
  clues,
  totalNodes,
  hint,
}) => {
  // Sort clues by relationship strength (strongest first)
  const sortedClues = [...clues].sort(
    (a, b) => b.relationshipStrength - a.relationshipStrength
  );

  const getStrengthStars = (strength: number): string => {
    if (strength > 0.8) return '★★★';
    if (strength > 0.6) return '★★';
    return '★';
  };

  const getStrengthLabel = (strength: number): string => {
    if (strength > 0.8) return 'Strong';
    if (strength > 0.6) return 'Medium';
    return 'Weak';
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        right: '20px',
        transform: 'translateY(-50%)',
        zIndex: 100,
        width: '220px',
        maxHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--ui-border)',
          borderRadius: '12px',
          padding: '16px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 'var(--font-lg)',
            color: 'var(--node-cyan)',
            textShadow: '0 0 10px var(--node-cyan)',
          }}
        >
          Revealed Clues
        </h3>
        <p
          style={{
            margin: '8px 0 0 0',
            fontSize: 'var(--font-sm)',
            color: 'var(--text-secondary)',
          }}
        >
          {clues.length} of {totalNodes} discovered
        </p>
      </div>

      {/* Hint */}
      {hint && (
        <div
          style={{
            background: 'rgba(164, 100, 244, 0.15)',
            border: '1px solid var(--node-violet)',
            borderRadius: '8px',
            padding: '12px',
            fontSize: 'var(--font-sm)',
            color: 'var(--node-violet)',
            fontStyle: 'italic',
          }}
        >
          {hint}
        </div>
      )}

      {/* Clue list */}
      <div
        style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--ui-border)',
          borderRadius: '12px',
          padding: '12px',
          backdropFilter: 'blur(10px)',
          overflowY: 'auto',
          flex: 1,
        }}
      >
        {sortedClues.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: 'var(--font-sm)',
              padding: '20px 0',
            }}
          >
            Tap glowing orbs
to reveal clues
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sortedClues.map((clue, index) => (
              <div
                key={`${clue.word}-${index}`}
                className="fade-in"
                style={{
                  background: 'rgba(100, 244, 244, 0.08)',
                  border: '1px solid var(--ui-border)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all var(--hover-transition)',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--font-md)',
                    color: 'var(--text-primary)',
                    fontWeight: 500,
                  }}
                >
                  {clue.word}
                </span>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '2px',
                  }}
                >
                  <span
                    style={{
                      fontSize: 'var(--font-xs)',
                      color:
                        clue.relationshipStrength > 0.8
                          ? 'var(--node-cyan)'
                          : clue.relationshipStrength > 0.6
                          ? 'var(--node-teal)'
                          : 'var(--node-violet)',
                      letterSpacing: '2px',
                    }}
                    title={getStrengthLabel(clue.relationshipStrength)}
                  >
                    {getStrengthStars(clue.relationshipStrength)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CluePanel;
