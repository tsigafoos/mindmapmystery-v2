/**
 * Timer Hook
 * Manages countdown timer for the game
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerOptions {
  initialTime: number; // in seconds
  onExpire?: () => void;
  onTick?: (remaining: number) => void;
}

interface UseTimerReturn {
  timeRemaining: number;
  isRunning: boolean;
  isExpired: boolean;
  start: () => void;
  pause: () => void;
  reset: (newTime?: number) => void;
  addTime: (seconds: number) => void;
  formattedTime: string;
  progress: number; // 0-1 percentage
}

export function useTimer(options: UseTimerOptions): UseTimerReturn {
  const { initialTime, onExpire, onTick } = options;

  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onExpireRef = useRef(onExpire);
  const onTickRef = useRef(onTick);

  // Keep callbacks fresh in refs
  useEffect(() => {
    onExpireRef.current = onExpire;
    onTickRef.current = onTick;
  }, [onExpire, onTick]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (isExpired || isRunning) return;

    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;

        // Call tick callback
        onTickRef.current?.(newTime);

        if (newTime <= 0) {
          clearTimer();
          setIsExpired(true);
          setIsRunning(false);
          onExpireRef.current?.();
          return 0;
        }

        return newTime;
      });
    }, 1000);
  }, [isExpired, isRunning, clearTimer]);

  const pause = useCallback(() => {
    clearTimer();
    setIsRunning(false);
  }, [clearTimer]);

  const reset = useCallback((newTime?: number) => {
    clearTimer();
    setIsRunning(false);
    setIsExpired(false);
    setTimeRemaining(newTime ?? initialTime);
  }, [clearTimer, initialTime]);

  const addTime = useCallback((seconds: number) => {
    setTimeRemaining((prev) => {
      const newTime = prev + seconds;
      // Cap at 2x initial time to prevent abuse
      return Math.min(newTime, initialTime * 2);
    });
  }, [initialTime]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  // Format time as MM:SS
  const formattedTime = useCallback(() => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [timeRemaining])();

  // Calculate progress percentage (1 = full, 0 = empty)
  const progress = timeRemaining / initialTime;

  return {
    timeRemaining,
    isRunning,
    isExpired,
    start,
    pause,
    reset,
    addTime,
    formattedTime,
    progress,
  };
}

/**
 * Format seconds to MM:SS string
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format seconds to human readable string
 */
export function formatTimeHuman(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (secs === 0) {
    return `${mins}m`;
  }
  return `${mins}m ${secs}s`;
}
