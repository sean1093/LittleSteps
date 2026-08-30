import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { User } from 'firebase/auth';
import { useUserChildren } from './useUserChildren';

/**
 * 這個 hook 用兩層 onValue：先聽 users/{uid} 拿到 childrenIds，再對每個孩子
 * 各開一個 onValue。
 *
 * 陷阱是內層的訂閱原本寫在外層 callback 裡 return 一個清理函式——但 onValue
 * 的 callback 回傳值 Firebase 不看，那個清理永遠不會被呼叫。每次 users/{uid}
 * 有任何變動（換孩子、新增、刪除都會寫這個節點）就再疊一整組 listener 上去，
 * 舊的那組還活著，而且各自握著自己那份過期的 loadedChildren。
 *
 * 後果不只是洩漏：舊 closure 被觸發時會用它自己那份舊名單去 setChildren，
 * 於是剛新增的孩子可能從畫面上消失，或剛刪掉的又跑回來。
 */

type Listener = (snapshot: { exists: () => boolean; val: () => unknown }) => void;

const listeners = new Map<string, Set<Listener>>();
/** Firebase 訂閱時會立刻用目前的值回呼一次，mock 必須照做，否則測不到
    「先拿到 childrenIds、再訂閱每個孩子」這個真實順序。 */
const values = new Map<string, unknown>();

const snapshot = (value: unknown) => ({
  exists: () => value !== null && value !== undefined,
  val: () => value,
});

/** 觸發某個路徑上所有還活著的 listener，就像 Firebase 那樣。 */
const emit = (path: string, value: unknown) => {
  values.set(path, value);
  for (const listener of listeners.get(path) ?? []) listener(snapshot(value));
};

const listenerCount = (path: string) => listeners.get(path)?.size ?? 0;

vi.mock('firebase/database', () => ({
  ref: (_db: unknown, path: string) => path,
  onValue: (path: string, listener: Listener) => {
    if (!listeners.has(path)) listeners.set(path, new Set());
    listeners.get(path)!.add(listener);
    if (values.has(path)) listener(snapshot(values.get(path)));
    return () => listeners.get(path)!.delete(listener);
  },
  remove: vi.fn().mockResolvedValue(undefined),
  // 補 childIndex 用的；缺這一個，listener 一跑就整組炸掉。
  set: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../lib/firebase', () => ({ database: {} }));

const user = { uid: 'u1' } as User;
const child = (id: string, name: string) => ({ id, name, birthday: '2025-01-01' });

beforeEach(() => {
  listeners.clear();
  values.clear();
});

describe('useUserChildren', () => {
  it('users 節點再次變動時，不會把每個孩子的 listener 疊第二層', () => {
    renderHook(() => useUserChildren(user));

    act(() => {
      emit('users/u1', { childrenIds: { A: true }, currentChildId: 'A' });
      emit('children/A', child('A', '小豆'));
    });
    expect(listenerCount('children/A')).toBe(1);

    // 換一個當前孩子、或新增一個孩子，都會再寫一次 users/u1。
    act(() => {
      emit('users/u1', { childrenIds: { A: true, B: true }, currentChildId: 'B' });
    });

    // A 只應該有一個 listener。原本的寫法會變成兩個，而且舊的那個握著
    // 只有 A 的名單，之後任何對 A 的寫入都會把 B 從畫面上抹掉。
    expect(listenerCount('children/A')).toBe(1);
  });

  it('新增第二個孩子之後，對第一個孩子的寫入不會讓第二個消失', () => {
    const { result } = renderHook(() => useUserChildren(user));

    act(() => {
      emit('users/u1', { childrenIds: { A: true }, currentChildId: 'A' });
      emit('children/A', child('A', '小豆'));
    });
    expect(result.current.children).toHaveLength(1);

    act(() => {
      emit('users/u1', { childrenIds: { A: true, B: true }, currentChildId: 'A' });
      emit('children/A', child('A', '小豆'));
      emit('children/B', child('B', '小樹'));
    });
    expect(result.current.children).toHaveLength(2);

    // 勾一個里程碑就會寫 children/A。
    act(() => {
      emit('children/A', child('A', '小豆'));
    });

    expect(result.current.children.map((c) => c.id).sort()).toEqual(['A', 'B']);
  });

  it('孩子被移除後就從名單消失，不會因為舊 listener 又冒出來', () => {
    const { result } = renderHook(() => useUserChildren(user));

    act(() => {
      emit('users/u1', { childrenIds: { A: true, B: true }, currentChildId: 'A' });
      emit('children/A', child('A', '小豆'));
      emit('children/B', child('B', '小樹'));
    });
    expect(result.current.children).toHaveLength(2);

    act(() => {
      emit('users/u1', { childrenIds: { A: true }, currentChildId: 'A' });
      emit('children/A', child('A', '小豆'));
    });

    expect(result.current.children.map((c) => c.id)).toEqual(['A']);
  });
});
