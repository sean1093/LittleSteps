import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { MockInstance } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { User } from 'firebase/auth';
import type { DailyLog, FeedingData } from '../../types';
import { useDailyLogs } from './useDailyLogs';

// firebase/database and lib/firebase are mocked globally in src/test/setup.ts, so
// the authenticated branch renders without touching a real backend. Every write
// assertion below targets the guest (LocalStorage) branch.

const STORAGE_KEY = 'daily-logs-child1';

const feedingLog = (overrides: Partial<Omit<DailyLog, 'id'>> = {}): Omit<DailyLog, 'id'> => ({
  childId: 'child1',
  type: 'feeding',
  timestamp: '2026-06-15T08:00:00.000Z',
  data: { feedingType: 'formula', amount: 120 } as FeedingData,
  createdAt: '2026-06-15T08:00:00.000Z',
  ...overrides,
});

const stored = (key = STORAGE_KEY): DailyLog[] | null => {
  const raw = localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as DailyLog[]) : null;
};

const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

describe('useDailyLogs (guest / LocalStorage mode)', () => {
  let nowSpy: MockInstance<() => number>;

  beforeEach(() => {
    localStorage.clear();
    // Log ids are derived from Date.now(); make it strictly increasing so rapid
    // successive adds in a test get distinct ids (real usage is minutes apart).
    let tick = 0;
    nowSpy = vi.spyOn(Date, 'now').mockImplementation(() => 1_700_000_000_000 + tick++);
  });

  afterEach(() => {
    nowSpy.mockRestore();
  });

  it('hydrates from the child-scoped storage key', () => {
    const existing: DailyLog[] = [{ ...feedingLog(), id: 'log_seed' }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

    const { result } = renderHook(() => useDailyLogs('child1', null));

    expect(result.current.loading).toBe(false);
    expect(result.current.logs).toEqual(existing);
  });

  it('re-reads when the child changes', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ ...feedingLog(), id: 'log_a' }]));
    localStorage.setItem(
      'daily-logs-child2',
      JSON.stringify([{ ...feedingLog({ childId: 'child2' }), id: 'log_b' }]),
    );

    const { result, rerender } = renderHook(({ id }) => useDailyLogs(id, null), {
      initialProps: { id: 'child1' as string | null },
    });
    expect(result.current.logs.map(l => l.id)).toEqual(['log_a']);

    rerender({ id: 'child2' });
    expect(result.current.logs.map(l => l.id)).toEqual(['log_b']);

    rerender({ id: null });
    expect(result.current.logs).toEqual([]);
  });

  it('addLog returns a log id and appends the record to state and storage', async () => {
    const { result } = renderHook(() => useDailyLogs('child1', null));

    let id = '';
    await act(async () => {
      id = await result.current.addLog(feedingLog());
    });

    expect(id).toMatch(/^log_\d+$/);
    expect(result.current.logs).toHaveLength(1);
    expect(result.current.logs[0]).toMatchObject({
      id,
      childId: 'child1',
      type: 'feeding',
      data: { feedingType: 'formula', amount: 120 },
    });
    expect(stored()).toEqual(result.current.logs);
  });

  it('addLog stamps the hook childId onto the record, overriding the payload', async () => {
    const { result } = renderHook(() => useDailyLogs('child1', null));

    await act(async () => {
      await result.current.addLog(feedingLog({ childId: 'someone-else' }));
    });

    expect(result.current.logs[0].childId).toBe('child1');
    expect(stored()![0].childId).toBe('child1');
  });

  it('addLog appends in insertion order with distinct ids', async () => {
    const { result } = renderHook(() => useDailyLogs('child1', null));

    // One mutation per act(): addLog closes over the rendered `logs`, so batching
    // two calls into a single act() would make the second clobber the first.
    let first = '';
    let second = '';
    await act(async () => {
      first = await result.current.addLog(feedingLog({ timestamp: '2026-06-15T08:00:00.000Z' }));
    });
    await act(async () => {
      second = await result.current.addLog(feedingLog({ timestamp: '2026-06-15T11:30:00.000Z' }));
    });

    expect(first).not.toBe(second);
    expect(result.current.logs.map(l => l.id)).toEqual([first, second]);
    expect(stored()!.map(l => l.timestamp)).toEqual([
      '2026-06-15T08:00:00.000Z',
      '2026-06-15T11:30:00.000Z',
    ]);
  });

  it('updateLog merges the patch, stamps updatedAt and leaves siblings alone', async () => {
    const { result } = renderHook(() => useDailyLogs('child1', null));

    let target = '';
    await act(async () => {
      target = await result.current.addLog(feedingLog());
    });
    await act(async () => {
      await result.current.addLog(feedingLog({ type: 'diaper', data: { type: 'pee' } }));
    });
    expect(result.current.logs[0].updatedAt).toBeUndefined();

    await act(async () => {
      await result.current.updateLog(target, {
        data: { feedingType: 'breast_both', duration: 20 } as FeedingData,
      });
    });

    const [updated, untouched] = result.current.logs;
    expect(updated.id).toBe(target);
    // The merge is shallow: `data` is replaced wholesale, not deep-merged.
    expect(updated.data).toEqual({ feedingType: 'breast_both', duration: 20 });
    expect(updated.type).toBe('feeding');
    expect(updated.timestamp).toBe('2026-06-15T08:00:00.000Z');
    expect(updated.updatedAt).toMatch(ISO);
    expect(untouched.updatedAt).toBeUndefined();
    expect(stored()).toEqual(result.current.logs);
  });

  it('updateLog ignores an unknown log id', async () => {
    const { result } = renderHook(() => useDailyLogs('child1', null));

    await act(async () => {
      await result.current.addLog(feedingLog());
    });
    const before = result.current.logs;

    await act(async () => {
      await result.current.updateLog('log_missing', { timestamp: '2026-01-01T00:00:00.000Z' });
    });

    expect(result.current.logs).toEqual(before);
    expect(result.current.logs.every(l => l.updatedAt === undefined)).toBe(true);
  });

  it('deleteLog removes only the target log', async () => {
    const { result } = renderHook(() => useDailyLogs('child1', null));

    let keep = '';
    let drop = '';
    await act(async () => {
      keep = await result.current.addLog(feedingLog());
    });
    await act(async () => {
      drop = await result.current.addLog(feedingLog({ type: 'diaper', data: { type: 'poop' } }));
    });

    await act(async () => {
      await result.current.deleteLog(drop);
    });

    expect(result.current.logs.map(l => l.id)).toEqual([keep]);
    expect(stored()!.map(l => l.id)).toEqual([keep]);
  });

  it('rejects every mutation with "No child selected" when there is no child', async () => {
    const { result } = renderHook(() => useDailyLogs(null, null));

    await expect(result.current.addLog(feedingLog())).rejects.toThrow('No child selected');
    await expect(result.current.updateLog('log_1', {})).rejects.toThrow('No child selected');
    await expect(result.current.deleteLog('log_1')).rejects.toThrow('No child selected');
    expect(localStorage.length).toBe(0);
  });

  it('routes writes away from LocalStorage in Firebase mode', async () => {
    const user = { uid: 'u1' } as unknown as User;
    const { result } = renderHook(() => useDailyLogs('child1', user));

    await expect(result.current.addLog(feedingLog())).rejects.toThrow(
      'Use firebaseChildren.addDailyLog for Firebase mode',
    );
    await expect(result.current.updateLog('log_1', {})).rejects.toThrow(
      'Use firebaseChildren.updateDailyLog for Firebase mode',
    );
    await expect(result.current.deleteLog('log_1')).rejects.toThrow(
      'Use firebaseChildren.deleteDailyLog for Firebase mode',
    );
    expect(stored()).toBeNull();
  });
});
