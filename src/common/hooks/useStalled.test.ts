import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { STALL_AFTER_MS, useStalled } from './useStalled';

const online = (value: boolean) =>
  vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(value);

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('useStalled', () => {
  it('stays quiet while a wait is still short, and speaks up once it is not', () => {
    online(true);
    const { result } = renderHook(() => useStalled(true));

    act(() => {
      vi.advanceTimersByTime(STALL_AFTER_MS - 1);
    });
    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe(true);
  });

  it('does not wait when the device already knows it is offline', () => {
    online(false);
    const { result } = renderHook(() => useStalled(true));

    expect(result.current).toBe(true);
  });

  it('speaks up at once when the connection drops during the wait', () => {
    online(true);
    const { result } = renderHook(() => useStalled(true));
    expect(result.current).toBe(false);

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    expect(result.current).toBe(true);
  });

  it('never reports a stall for something that is not pending', () => {
    online(false);
    const { result } = renderHook(() => useStalled(false));

    act(() => {
      vi.advanceTimersByTime(STALL_AFTER_MS * 2);
    });
    expect(result.current).toBe(false);
  });

  it('takes the message back in the same render the wait ends, and starts over next time', () => {
    online(true);
    const seen: boolean[] = [];
    const { rerender } = renderHook(
      ({ pending }: { pending: boolean }) => {
        const stalled = useStalled(pending);
        seen.push(stalled);
        return stalled;
      },
      { initialProps: { pending: true } },
    );
    act(() => {
      vi.advanceTimersByTime(STALL_AFTER_MS);
    });
    expect(seen[seen.length - 1]).toBe(true);

    seen.length = 0;
    rerender({ pending: false });
    // Every render after the wait ended, the first one included.
    expect(seen.length).toBeGreaterThan(0);
    expect(seen.every((stalled) => !stalled)).toBe(true);

    // A new wait gets its own full allowance; the old flag does not leak in.
    seen.length = 0;
    rerender({ pending: true });
    expect(seen.every((stalled) => !stalled)).toBe(true);
    act(() => {
      vi.advanceTimersByTime(STALL_AFTER_MS);
    });
    expect(seen[seen.length - 1]).toBe(true);
  });

  it('gives a wait that ended early no credit towards the next one', () => {
    online(true);
    const { result, rerender } = renderHook(
      ({ pending }: { pending: boolean }) => useStalled(pending),
      { initialProps: { pending: true } },
    );
    act(() => {
      vi.advanceTimersByTime(STALL_AFTER_MS / 2);
    });
    rerender({ pending: false });
    rerender({ pending: true });

    // The first wait's timer would fire here if it had been left running.
    act(() => {
      vi.advanceTimersByTime(STALL_AFTER_MS / 2);
    });
    expect(result.current).toBe(false);
  });

  it('ignores a connection drop that happened between two waits', () => {
    online(true);
    const { result, rerender } = renderHook(
      ({ pending }: { pending: boolean }) => useStalled(pending),
      { initialProps: { pending: true } },
    );
    rerender({ pending: false });
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    rerender({ pending: true });

    expect(result.current).toBe(false);
  });

  it('takes the message back when the connection returns, and starts the allowance again', () => {
    online(true);
    const { result } = renderHook(() => useStalled(true));
    act(() => {
      vi.advanceTimersByTime(STALL_AFTER_MS - 1);
      window.dispatchEvent(new Event('offline'));
    });
    expect(result.current).toBe(true);

    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    expect(result.current).toBe(false);

    // The original timer had 1 ms left; a fresh allowance means it is not due.
    act(() => {
      vi.advanceTimersByTime(STALL_AFTER_MS - 1);
    });
    expect(result.current).toBe(false);
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe(true);
  });

  it('takes the message back for a wait that began offline, too', () => {
    online(false);
    const { result } = renderHook(() => useStalled(true));
    expect(result.current).toBe(true);

    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(STALL_AFTER_MS);
    });
    expect(result.current).toBe(true);
  });
});
