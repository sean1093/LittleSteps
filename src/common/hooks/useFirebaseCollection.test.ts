import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { User } from 'firebase/auth';
import { useFirebaseCollection } from './useFirebaseCollection';

/**
 * 兩件會被家長看見的事：
 *
 * 1. 換孩子時只設 loading、不清 data，新孩子的快照抵達之前，畫面上是上一個
 *    孩子的餵奶、尿布與睡眠，標題卻已經換成新孩子的名字。
 * 2. 讀取被拒或斷線時把錯誤解析成空集合，畫面就說「今天還沒有記錄」——把
 *    一次失敗講成一個事實。
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
}));

vi.mock('../../lib/database', () => ({ database: {} }));

const user = { uid: 'u1' } as User;

const logsOf = (childId: string | null) => ({
  firebasePath: `childRecords/${childId}/dailyLogs`,
  empty: [] as string[],
  fromFirebase: (data: unknown) => (data ? (Object.values(data as object) as string[]) : []),
});

const subscription = (childId: string) => {
  const entry = subscriptions.get(`childRecords/${childId}/dailyLogs`);
  if (!entry) throw new Error(`沒有訂閱 ${childId}`);
  return entry;
};

beforeEach(() => {
  subscriptions.clear();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useFirebaseCollection', () => {
  it('換孩子時先清空 data，不會把上一個孩子的紀錄掛在新孩子名下', () => {
    const { result, rerender } = renderHook(
      ({ childId }: { childId: string }) => useFirebaseCollection(childId, user, logsOf(childId)),
      { initialProps: { childId: 'A' } },
    );

    act(() => subscription('A').next({ val: () => ({ k1: '小豆的餵奶' }) }));
    expect(result.current.data).toEqual(['小豆的餵奶']);

    rerender({ childId: 'B' });

    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBe(true);

    act(() => subscription('B').next({ val: () => ({ k1: '小樹的餵奶' }) }));
    expect(result.current.data).toEqual(['小樹的餵奶']);
  });

  it('讀取失敗時回報 error，不會把失敗當成空集合', () => {
    const { result } = renderHook(() => useFirebaseCollection('A', user, logsOf('A')));

    act(() => subscription('A').cancel(new Error('permission_denied')));

    expect(result.current.error).toBe(true);
    expect(result.current.loading).toBe(false);
  });

  it('已經讀到的紀錄不會因為後來的失敗被抹掉', () => {
    const { result } = renderHook(() => useFirebaseCollection('A', user, logsOf('A')));

    act(() => subscription('A').next({ val: () => ({ k1: '一筆記錄' }) }));
    expect(result.current.error).toBe(false);

    act(() => subscription('A').cancel(new Error('permission_denied')));

    expect(result.current.error).toBe(true);
    expect(result.current.data).toEqual(['一筆記錄']);
  });

  it('沒有孩子時不訂閱，也不停在載入中', () => {
    const { result } = renderHook(() => useFirebaseCollection(null, user, logsOf(null)));

    expect(subscriptions.size).toBe(0);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(false);
    expect(result.current.data).toEqual([]);
  });

  it('從沒有孩子變成有孩子的那一次 render 就是載入中，不會先說「沒有紀錄」', () => {
    // App 只在會讀紀錄的服務裡才傳 childId，所以 null → 孩子 每次走進服務
    // 都會發生。記下每一次 render 的 loading：只要有一次是 false 而 data 還是
    // 空的，頁面就會拿空陣列去畫。
    const seen: { childId: string | null; loading: boolean }[] = [];
    const { rerender } = renderHook(
      ({ childId }: { childId: string | null }) => {
        const state = useFirebaseCollection(childId, user, logsOf(childId));
        seen.push({ childId, loading: state.loading });
        return state;
      },
      { initialProps: { childId: null as string | null } },
    );

    rerender({ childId: 'A' });
    const beforeSnapshot = seen.filter((render) => render.childId === 'A');
    expect(beforeSnapshot.length).toBeGreaterThan(0);
    expect(beforeSnapshot.every((render) => render.loading)).toBe(true);

    act(() => subscription('A').next({ val: () => null }));
    expect(seen[seen.length - 1]).toEqual({ childId: 'A', loading: false });
  });

  it('換孩子時不會把上一個孩子的讀取失敗算在新孩子頭上', () => {
    // error 若只在 effect 裡清，換孩子的那一次 render 還帶著上一個孩子的
    // 失敗——畫面會替一個還沒開始讀的孩子說「讀不到紀錄」。
    const seen: { childId: string; error: boolean }[] = [];
    const { rerender } = renderHook(
      ({ childId }: { childId: string }) => {
        const state = useFirebaseCollection(childId, user, logsOf(childId));
        seen.push({ childId, error: state.error });
        return state;
      },
      { initialProps: { childId: 'A' } },
    );
    act(() => subscription('A').cancel(new Error('PERMISSION_DENIED')));
    expect(seen[seen.length - 1]).toEqual({ childId: 'A', error: true });

    rerender({ childId: 'B' });
    const forB = seen.filter((render) => render.childId === 'B');
    expect(forB.length).toBeGreaterThan(0);
    expect(forB.every((render) => !render.error)).toBe(true);
  });
});
