import { useEffect, useCallback } from 'react';
import { useTimer, UseTimerReturn } from './useTimer';

export interface PersistedTimerData {
  type: 'feeding' | 'sleep';
  childId: string;
  startTime: number; // Unix timestamp
  isRunning: boolean;
  elapsedSeconds: number;
  pausedAt: number | null;
}

const STORAGE_KEY_PREFIX = 'timer-';

/**
 * useTimerPersistence - Timer hook with localStorage persistence
 *
 * This hook extends useTimer with automatic persistence to localStorage,
 * allowing timers to survive page refreshes and app restarts.
 *
 * Use cases:
 * - Feeding timer: Parents can close the app and timer keeps running
 * - Sleep timer: Track sleep duration across multiple sessions
 *
 * @param type - Timer type ('feeding' or 'sleep')
 * @param childId - Child ID for multi-child support
 * @returns Timer controls with auto-save functionality
 */
export function useTimerPersistence(
  type: 'feeding' | 'sleep',
  childId: string | null
): UseTimerReturn & {
  hasPersistedTimer: boolean;
  clearPersistedTimer: () => void;
} {
  const storageKey = childId ? `${STORAGE_KEY_PREFIX}${type}-${childId}` : null;

  /**
   * Load persisted timer from localStorage
   */
  const loadPersistedTimer = useCallback((): PersistedTimerData | null => {
    if (!storageKey) return null;

    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return null;

      const data: PersistedTimerData = JSON.parse(stored);

      // Validate data structure
      if (
        !data.type ||
        !data.childId ||
        typeof data.startTime !== 'number' ||
        typeof data.isRunning !== 'boolean'
      ) {
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to load persisted timer:', error);
      return null;
    }
  }, [storageKey]);

  /**
   * Calculate initial elapsed time from persisted data
   */
  const calculateInitialElapsed = useCallback((data: PersistedTimerData | null): number => {
    if (!data) return 0;

    if (data.pausedAt) {
      // Timer was paused - use elapsed at pause time
      return Math.floor((data.pausedAt - data.startTime) / 1000);
    }

    if (data.isRunning) {
      // Timer was running - calculate elapsed time from start to now
      return Math.floor((Date.now() - data.startTime) / 1000);
    }

    // Timer was stopped
    return data.elapsedSeconds || 0;
  }, []);

  // Load persisted timer on mount
  const persistedData = loadPersistedTimer();
  const initialElapsed = calculateInitialElapsed(persistedData);

  // Create timer with initial elapsed time
  const timer = useTimer(initialElapsed);

  /**
   * Auto-resume timer if it was running when persisted
   */
  useEffect(() => {
    if (persistedData && persistedData.isRunning && !timer.isRunning) {
      timer.resume();
    }
  }, []); // Only run on mount

  /**
   * Save timer state to localStorage whenever it changes
   */
  useEffect(() => {
    if (!storageKey || !childId) return;

    if (timer.isRunning || timer.elapsedSeconds > 0) {
      const now = Date.now();
      const startTime = timer.isRunning
        ? now - timer.elapsedSeconds * 1000
        : now;

      const data: PersistedTimerData = {
        type,
        childId,
        startTime,
        isRunning: timer.isRunning,
        elapsedSeconds: timer.elapsedSeconds,
        pausedAt: !timer.isRunning && timer.elapsedSeconds > 0 ? now : null,
      };

      localStorage.setItem(storageKey, JSON.stringify(data));
    } else {
      // Timer is stopped/reset - remove from storage
      localStorage.removeItem(storageKey);
    }
  }, [timer.isRunning, timer.elapsedSeconds, storageKey, type, childId]);

  /**
   * Clear persisted timer from localStorage
   */
  const clearPersistedTimer = useCallback(() => {
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  return {
    ...timer,
    hasPersistedTimer: !!persistedData,
    clearPersistedTimer,
  };
}

/**
 * Get all active timers for a specific child
 * Useful for checking if there are any running timers
 */
export function getActiveTimers(childId: string): {
  feeding: PersistedTimerData | null;
  sleep: PersistedTimerData | null;
} {
  const feedingKey = `${STORAGE_KEY_PREFIX}feeding-${childId}`;
  const sleepKey = `${STORAGE_KEY_PREFIX}sleep-${childId}`;

  const loadTimer = (key: string): PersistedTimerData | null => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  return {
    feeding: loadTimer(feedingKey),
    sleep: loadTimer(sleepKey),
  };
}

/**
 * Clear all timers for a specific child
 */
export function clearAllTimers(childId: string): void {
  const feedingKey = `${STORAGE_KEY_PREFIX}feeding-${childId}`;
  const sleepKey = `${STORAGE_KEY_PREFIX}sleep-${childId}`;

  localStorage.removeItem(feedingKey);
  localStorage.removeItem(sleepKey);
}
