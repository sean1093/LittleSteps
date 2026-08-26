import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDualModeCollection } from './useDualModeCollection';

// firebase/database and lib/firebase are mocked globally in src/test/setup.ts.
// These tests exercise the guest (LocalStorage) branch, which never touches Firebase.

const options = (childId: string | null) => ({
  firebasePath: `children/${childId}/dailyLogs`,
  storageKey: `daily-logs-${childId}`,
  empty: [] as number[],
  fromFirebase: (data: unknown) => (data ? (Object.values(data as object) as number[]) : []),
});

describe('useDualModeCollection (guest / LocalStorage mode)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('reads existing LocalStorage data for a child', async () => {
    localStorage.setItem('daily-logs-c1', JSON.stringify([1, 2, 3]));
    const { result } = renderHook(() => useDualModeCollection<number[]>('c1', null, options('c1')));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual([1, 2, 3]);
  });

  it('returns the empty value when nothing is stored', async () => {
    const { result } = renderHook(() => useDualModeCollection<number[]>('c1', null, options('c1')));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual([]);
  });

  it('returns the empty value and stops loading when childId is null', async () => {
    localStorage.setItem('daily-logs-c1', JSON.stringify([1]));
    const { result } = renderHook(() => useDualModeCollection<number[]>(null, null, options(null)));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual([]);
  });

  it('falls back to empty on corrupt stored JSON', async () => {
    localStorage.setItem('daily-logs-c1', '{not valid json');
    const { result } = renderHook(() => useDualModeCollection<number[]>('c1', null, options('c1')));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual([]);
  });
});
