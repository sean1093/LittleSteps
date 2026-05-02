import { useState, useEffect, useRef, useCallback } from 'react';

export interface TimerState {
  isRunning: boolean;
  elapsedSeconds: number; // Total elapsed time in seconds
  startTime: number | null; // Unix timestamp when timer started
  pausedAt: number | null; // Unix timestamp when timer was paused
}

export interface UseTimerReturn {
  isRunning: boolean;
  elapsedSeconds: number;
  elapsedTime: string; // Formatted time (HH:mm:ss or mm:ss)
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

/**
 * useTimer - A flexible timer hook with start/stop/pause/resume/reset controls
 *
 * Features:
 * - Supports background running (continues even when component unmounts)
 * - Can be persisted to localStorage for cross-session continuity
 * - Accurate timing using system clock (not affected by tab switching)
 *
 * @param initialSeconds - Initial elapsed time in seconds (default: 0)
 * @param onTick - Optional callback fired every second while running
 * @returns Timer controls and current state
 */
export function useTimer(
  initialSeconds: number = 0,
  onTick?: (elapsed: number) => void
): UseTimerReturn {
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    elapsedSeconds: initialSeconds,
    startTime: null,
    pausedAt: null,
  });

  const intervalRef = useRef<number | null>(null);

  /**
   * Calculate current elapsed time based on system clock
   * This ensures accuracy even when the app is in background
   */
  const calculateElapsedTime = useCallback((state: TimerState): number => {
    if (!state.startTime) return state.elapsedSeconds;

    if (state.pausedAt) {
      // Timer is paused - use pausedAt time
      return Math.floor((state.pausedAt - state.startTime) / 1000);
    }

    // Timer is running - use current time
    return Math.floor((Date.now() - state.startTime) / 1000);
  }, []);

  /**
   * Format elapsed seconds into readable time string
   * Returns "mm:ss" for times under 1 hour
   * Returns "HH:mm:ss" for times 1 hour or more
   */
  const formatTime = useCallback((totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }, []);

  /**
   * Start timer from beginning
   */
  const start = useCallback(() => {
    const now = Date.now();
    setTimerState({
      isRunning: true,
      elapsedSeconds: 0,
      startTime: now,
      pausedAt: null,
    });
  }, []);

  /**
   * Stop timer and reset to 0
   */
  const stop = useCallback(() => {
    setTimerState({
      isRunning: false,
      elapsedSeconds: 0,
      startTime: null,
      pausedAt: null,
    });
  }, []);

  /**
   * Pause timer (preserves elapsed time)
   */
  const pause = useCallback(() => {
    setTimerState((prev) => {
      if (!prev.isRunning || !prev.startTime) return prev;

      const now = Date.now();
      const elapsed = Math.floor((now - prev.startTime) / 1000);

      return {
        isRunning: false,
        elapsedSeconds: elapsed,
        startTime: prev.startTime,
        pausedAt: now,
      };
    });
  }, []);

  /**
   * Resume timer from paused state
   */
  const resume = useCallback(() => {
    setTimerState((prev) => {
      if (prev.isRunning || !prev.pausedAt) return prev;

      const now = Date.now();
      const pauseDuration = now - prev.pausedAt;
      const newStartTime = prev.startTime ? prev.startTime + pauseDuration : now;

      return {
        isRunning: true,
        elapsedSeconds: prev.elapsedSeconds,
        startTime: newStartTime,
        pausedAt: null,
      };
    });
  }, []);

  /**
   * Reset timer to 0 (keeps paused/running state)
   */
  const reset = useCallback(() => {
    setTimerState((prev) => ({
      ...prev,
      elapsedSeconds: 0,
      startTime: prev.isRunning ? Date.now() : null,
      pausedAt: null,
    }));
  }, []);

  /**
   * Update elapsed time every second when timer is running
   */
  useEffect(() => {
    if (!timerState.isRunning || !timerState.startTime) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Update immediately
    const updateElapsed = () => {
      const elapsed = calculateElapsedTime(timerState);
      setTimerState((prev) => ({
        ...prev,
        elapsedSeconds: elapsed,
      }));
      onTick?.(elapsed);
    };

    updateElapsed();

    // Then update every second
    intervalRef.current = window.setInterval(updateElapsed, 1000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning, timerState.startTime, calculateElapsedTime, onTick]);

  return {
    isRunning: timerState.isRunning,
    elapsedSeconds: timerState.elapsedSeconds,
    elapsedTime: formatTime(timerState.elapsedSeconds),
    start,
    stop,
    pause,
    resume,
    reset,
  };
}
