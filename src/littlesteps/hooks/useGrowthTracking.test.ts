import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGrowthTracking } from './useGrowthTracking';

/**
 * 成長紀錄是掛在孩子身上的測量值，換孩子時沒清掉的話，新孩子的快照抵達之前，
 * 畫面上的體重、身高與百分位都是上一個孩子的——而標題已經換成新名字了。
 *
 * 另一半：讀取被拒或斷線時原本連 cancel callback 都沒有，loading 永遠停在
 * true；補上之後也不能把失敗解析成一份空紀錄，否則畫面會說「還沒量過」。
 */

type Next = (snapshot: { val: () => unknown }) => void;
type Cancel = (error: Error) => void;

const subscriptions = new Map<string, { next: Next; cancel: Cancel }>();

vi.mock('firebase/database', () => ({
  ref: (_db: unknown, path: string) => path,
  onValue: (path: string, next: Next, cancel: Cancel) => {
    subscriptions.set(path, { next, cancel });
    return () => subscriptions.delete(path);
  },
  set: () => Promise.resolve(),
  remove: () => Promise.resolve(),
}));

vi.mock('../../lib/firebase', () => ({ database: {} }));

const user = { uid: 'u1' };

const subscription = (childId: string) => {
  const entry = subscriptions.get(`children/${childId}/growthRecords`);
  if (!entry) throw new Error(`沒有訂閱 ${childId}`);
  return entry;
};

const weight = (id: string, kg: number) => ({
  [id]: { id, childId: 'c1', date: '2026-08-01', weight: kg },
});

beforeEach(() => {
  subscriptions.clear();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useGrowthTracking', () => {
  it('換孩子時先清空紀錄，不會把上一個孩子的測量掛在新孩子名下', () => {
    const { result, rerender } = renderHook(
      ({ childId }: { childId: string }) => useGrowthTracking(childId, user),
      { initialProps: { childId: 'A' } },
    );

    act(() => subscription('A').next({ val: () => weight('g1', 7.4) }));
    expect(result.current.records).toHaveLength(1);

    rerender({ childId: 'B' });

    expect(result.current.records).toEqual([]);
    expect(result.current.loading).toBe(true);

    act(() => subscription('B').next({ val: () => weight('g2', 9.1) }));
    expect(result.current.records.map((record) => record.weight)).toEqual([9.1]);
  });

  it('讀取失敗時回報 error，而不是一份「還沒量過」的空紀錄', () => {
    const { result } = renderHook(() => useGrowthTracking('A', user));

    act(() => subscription('A').cancel(new Error('permission_denied')));

    expect(result.current.error).toBe(true);
    expect(result.current.loading).toBe(false);
  });

  it('已經讀到的紀錄不會因為後來的失敗被抹掉', () => {
    const { result } = renderHook(() => useGrowthTracking('A', user));

    act(() => subscription('A').next({ val: () => weight('g1', 7.4) }));
    expect(result.current.error).toBe(false);

    act(() => subscription('A').cancel(new Error('permission_denied')));

    expect(result.current.error).toBe(true);
    expect(result.current.records).toHaveLength(1);
  });

  it('沒有登入時不訂閱，也不停在載入中', () => {
    const { result } = renderHook(() => useGrowthTracking('A', null));

    expect(subscriptions.size).toBe(0);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(false);
    expect(result.current.records).toEqual([]);
  });
});
