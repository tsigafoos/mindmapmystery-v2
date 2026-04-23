/**
 * Timer Component
 * Displays countdown timer in top corner
 */

import React from 'react';
import { formatTime } from '../../hooks/useTimer';
import '../../styles/theme.css';

interface TimerProps {
  timeRemaining: number;
  initialTime: number;
  isRunning: boolean;
  isExpired: boolean;
}

export const Timer: React.FC<TimerProps> = ({
  timeRemaining,
  initialTime,
  isRunning,
  isExpired,
}) => {
  const progress = timeRemaining / initialTime;
  const formattedTime = formatTime(timeRemaining);

  // Determine color based on time remaining
  const getTimeColor = () => {
    if (isExpired) return 'var(--status-error)';
    if (progress < 0.2) return 'var(--status-warning)'; // Last 20%
    if (progress < 0.5) return 'var(--node-magenta)'; // Last 50%
    return 'var(--node-cyan)';
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {/* Time display */}
      <div
        style={{
          background: 'var(--bg-panel)',
          border: `1px solid ${getTimeColor()}`,
          borderRadius: '12px',
          padding: '12px 20px',
          boxShadow: `0 0 20px ${getTimeColor()}40`,
          backdropFilter: 'blur(10px)',
        }}
      >
        <span
          style={{
            fontSize: 'var(--font-xl)',
            fontWeight: 'bold',
            color: getTimeColor(),
            fontFamily: 'monospace',
            letterSpacing: '2px',
            textShadow: `0 0 10px ${getTimeColor()}80`,
          }}
        >
          {formattedTime}
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: '100%',
          height: '4px',
          background: 'var(--bg-deep-space)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            background: getTimeColor(),
            borderRadius: '2px',
            transition: 'width 1s linear',
            boxShadow: `0 0 8px ${getTimeColor()}`,
          }}
        />
      </div>

      {/* Status indicator */}
      <span
        style={{
          fontSize: 'var(--font-xs)',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
      >
        {isExpired ? 'Time\'s Up!' : isRunning ? 'Time Remaining' : 'Paused'}
      </span>
    </div>
  );
};

export default Timer;
