import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimer } from './useTimer';

// The hook derives elapsed time from the system clock (Date.now()) and refreshes
// it on a 1s window.setInterval, so every test drives a fake clock instead of
// waiting on the real one. vi.useFakeTimers() fakes both Date and setInterval,
// meaning advanceTimersByTime moves the wall clock *and* fires the interval.
const FAKE_NOW = new Date('2026-06-15T08:00:00Z');

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FAKE_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('starts stopped at zero', () => {
      const { result } = renderHook(() => useTimer());

      expect(result.current.isRunning).toBe(false);
      expect(result.current.elapsedSeconds).toBe(0);
      expect(result.current.elapsedTime).toBe('00:00');
    });

    it('seeds elapsed time from initialSeconds without running', () => {
      const { result } = renderHook(() => useTimer(3725));

      expect(result.current.isRunning).toBe(false);
      expect(result.current.elapsedSeconds).toBe(3725);
      expect(result.current.elapsedTime).toBe('01:02:05');
    });

    it('does not tick while stopped', () => {
      const { result } = renderHook(() => useTimer(120));

      act(() => {
        vi.advanceTimersByTime(10_000);
      });

      expect(result.current.elapsedSeconds).toBe(120);
      expect(result.current.isRunning).toBe(false);
    });
  });

  describe('elapsedTime formatting', () => {
    // mm:ss below one hour, HH:mm:ss from one hour up; every field zero-padded.
    it.each([
      [0, '00:00'],
      [9, '00:09'],
      [59, '00:59'],
      [60, '01:00'],
      [3599, '59:59'],
      [3600, '01:00:00'],
      [3661, '01:01:01'],
      [36_000, '10:00:00'],
    ])('formats %i seconds as %s', (seconds, formatted) => {
      const { result } = renderHook(() => useTimer(seconds));

      expect(result.current.elapsedTime).toBe(formatted);
    });
  });

  describe('start', () => {
    it('marks the timer running and discards any seeded elapsed time', () => {
      const { result } = renderHook(() => useTimer(120));

      act(() => {
        result.current.start();
      });

      expect(result.current.isRunning).toBe(true);
      expect(result.current.elapsedSeconds).toBe(0);
      expect(result.current.elapsedTime).toBe('00:00');
    });

    it('accumulates whole seconds as the clock advances', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(5_000);
      });
      expect(result.current.elapsedSeconds).toBe(5);
      expect(result.current.elapsedTime).toBe('00:05');

      act(() => {
        vi.advanceTimersByTime(60_000);
      });
      expect(result.current.elapsedSeconds).toBe(65);
      expect(result.current.elapsedTime).toBe('01:05');
    });

    it('restarts from zero when called again mid-run', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });
      act(() => {
        vi.advanceTimersByTime(30_000);
      });
      expect(result.current.elapsedSeconds).toBe(30);

      act(() => {
        result.current.start();
      });
      expect(result.current.elapsedSeconds).toBe(0);

      act(() => {
        vi.advanceTimersByTime(2_000);
      });
      expect(result.current.elapsedSeconds).toBe(2);
    });
  });

  describe('pause', () => {
    it('freezes elapsed time and stops ticking', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });
      act(() => {
        vi.advanceTimersByTime(10_000);
      });

      act(() => {
        result.current.pause();
      });
      expect(result.current.isRunning).toBe(false);
      expect(result.current.elapsedSeconds).toBe(10);

      act(() => {
        vi.advanceTimersByTime(30_000);
      });
      expect(result.current.elapsedSeconds).toBe(10);
      expect(result.current.elapsedTime).toBe('00:10');
    });

    it('is a no-op when the timer was never started', () => {
      const { result } = renderHook(() => useTimer(42));

      act(() => {
        result.current.pause();
      });

      expect(result.current.isRunning).toBe(false);
      expect(result.current.elapsedSeconds).toBe(42);
    });
  });

  describe('resume', () => {
    it('continues from the paused elapsed time, excluding the paused gap', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });
      act(() => {
        vi.advanceTimersByTime(10_000);
      });
      act(() => {
        result.current.pause();
      });

      // 30s of wall clock passes while paused and must not be counted.
      act(() => {
        vi.advanceTimersByTime(30_000);
      });

      act(() => {
        result.current.resume();
      });
      expect(result.current.isRunning).toBe(true);
      expect(result.current.elapsedSeconds).toBe(10);

      act(() => {
        vi.advanceTimersByTime(5_000);
      });
      expect(result.current.elapsedSeconds).toBe(15);
      expect(result.current.elapsedTime).toBe('00:15');
    });

    it('survives repeated pause/resume cycles without drift', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });

      for (let cycle = 0; cycle < 3; cycle += 1) {
        act(() => {
          vi.advanceTimersByTime(4_000);
        });
        act(() => {
          result.current.pause();
        });
        act(() => {
          vi.advanceTimersByTime(20_000);
        });
        act(() => {
          result.current.resume();
        });
      }

      // Only the three 4s running windows count; the 60s paused does not.
      expect(result.current.elapsedSeconds).toBe(12);
    });

    it('is a no-op when the timer is already running', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });
      act(() => {
        vi.advanceTimersByTime(3_000);
      });

      act(() => {
        result.current.resume();
      });
      expect(result.current.isRunning).toBe(true);
      expect(result.current.elapsedSeconds).toBe(3);

      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(result.current.elapsedSeconds).toBe(4);
    });

    it('is a no-op when the timer was never paused', () => {
      const { result } = renderHook(() => useTimer(15));

      act(() => {
        result.current.resume();
      });

      expect(result.current.isRunning).toBe(false);
      expect(result.current.elapsedSeconds).toBe(15);
    });
  });

  describe('stop', () => {
    it('zeroes the timer and stops ticking', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });
      act(() => {
        vi.advanceTimersByTime(7_000);
      });

      act(() => {
        result.current.stop();
      });
      expect(result.current.isRunning).toBe(false);
      expect(result.current.elapsedSeconds).toBe(0);
      expect(result.current.elapsedTime).toBe('00:00');

      act(() => {
        vi.advanceTimersByTime(5_000);
      });
      expect(result.current.elapsedSeconds).toBe(0);
    });

    it('clears the paused state so it cannot be resumed', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });
      act(() => {
        vi.advanceTimersByTime(6_000);
      });
      act(() => {
        result.current.pause();
      });
      act(() => {
        result.current.stop();
      });

      act(() => {
        result.current.resume();
      });
      expect(result.current.isRunning).toBe(false);
      expect(result.current.elapsedSeconds).toBe(0);
    });
  });

  describe('reset', () => {
    it('zeroes elapsed time but keeps a running timer running', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });
      act(() => {
        vi.advanceTimersByTime(8_000);
      });

      act(() => {
        result.current.reset();
      });
      expect(result.current.isRunning).toBe(true);
      expect(result.current.elapsedSeconds).toBe(0);

      // Re-anchored to "now": counting continues from zero, not from 8s.
      act(() => {
        vi.advanceTimersByTime(2_000);
      });
      expect(result.current.elapsedSeconds).toBe(2);
    });

    it('zeroes a paused timer and drops the paused anchor', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });
      act(() => {
        vi.advanceTimersByTime(9_000);
      });
      act(() => {
        result.current.pause();
      });

      act(() => {
        result.current.reset();
      });
      expect(result.current.isRunning).toBe(false);
      expect(result.current.elapsedSeconds).toBe(0);

      act(() => {
        result.current.resume();
      });
      expect(result.current.isRunning).toBe(false);
      expect(result.current.elapsedSeconds).toBe(0);
    });

    it('clears seeded elapsed time on a never-started timer', () => {
      const { result } = renderHook(() => useTimer(500));

      act(() => {
        result.current.reset();
      });

      expect(result.current.isRunning).toBe(false);
      expect(result.current.elapsedSeconds).toBe(0);
      expect(result.current.elapsedTime).toBe('00:00');
    });
  });

  describe('onTick callback', () => {
    it('reports each elapsed second while running', () => {
      const onTick = vi.fn();
      const { result } = renderHook(() => useTimer(0, onTick));

      act(() => {
        result.current.start();
      });
      act(() => {
        vi.advanceTimersByTime(3_000);
      });

      expect(onTick.mock.calls.map(([elapsed]) => elapsed)).toEqual([0, 1, 2, 3]);
    });

    it('stops reporting once paused and resumes afterwards', () => {
      const onTick = vi.fn();
      const { result } = renderHook(() => useTimer(0, onTick));

      act(() => {
        result.current.start();
      });
      act(() => {
        vi.advanceTimersByTime(2_000);
      });
      act(() => {
        result.current.pause();
      });

      onTick.mockClear();
      act(() => {
        vi.advanceTimersByTime(5_000);
      });
      expect(onTick).not.toHaveBeenCalled();

      act(() => {
        result.current.resume();
      });
      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(onTick.mock.calls.map(([elapsed]) => elapsed)).toEqual([2, 3]);
    });

    it('is never called after unmount', () => {
      const onTick = vi.fn();
      const { result, unmount } = renderHook(() => useTimer(0, onTick));

      act(() => {
        result.current.start();
      });
      onTick.mockClear();

      unmount();
      act(() => {
        vi.advanceTimersByTime(5_000);
      });

      expect(onTick).not.toHaveBeenCalled();
    });
  });
});
