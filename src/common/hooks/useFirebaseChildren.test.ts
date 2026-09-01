import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { DailyLog } from '../../types';
import { useFirebaseChildren } from './useFirebaseChildren';

/**
 * 兩個會靜靜吃掉資料的寫入方式：
 *
 * 1. 建檔曾經是三筆循序 set。第二筆（users/{uid}/childrenIds）沒落地，就沒有
 *    任何人是成員，database.rules.json 從此拒絕這個 childId 的每一次讀與寫——
 *    那份健康紀錄再也讀不到、也刪不掉。
 * 2. 新紀錄的 key 曾經是 Date.now()。共享的孩子有兩個家長，同一毫秒各寫一筆，
 *    後到的那筆直接蓋掉對方的。
 */

interface FakeRef {
  path: string;
}

const writes: { path: string; value: unknown }[] = [];
const updates: { path: string; value: Record<string, unknown> }[] = [];
let pushSeq = 0;

vi.mock('firebase/database', () => ({
  ref: (_db: unknown, path = '') => ({ path }),
  // push() 的 key 由客戶端產生，含隨機位元；序號足以模擬「同一毫秒也不撞」。
  push: (parent: FakeRef) => {
    const key = `-Push${++pushSeq}`;
    return { path: `${parent.path}/${key}`, key };
  },
  set: (target: FakeRef, value: unknown) => {
    writes.push({ path: target.path, value });
    return Promise.resolve();
  },
  update: (target: FakeRef, value: Record<string, unknown>) => {
    updates.push({ path: target.path, value });
    return Promise.resolve();
  },
  remove: () => Promise.resolve(),
  get: () => Promise.resolve({ exists: () => false, val: () => null }),
}));

vi.mock('../../lib/firebase', () => ({ database: {} }));

const feeding = (): Omit<DailyLog, 'id'> => ({
  childId: 'c1',
  type: 'feeding',
  timestamp: '2026-01-01T08:00:00.000Z',
  data: { feedingType: 'formula', amount: 120 },
  createdAt: '2026-01-01T08:00:00.000Z',
});

const riceTrial = () => ({
  foodName: '米糊',
  firstTriedDate: '2026-01-01',
  trialDates: ['2026-01-01'],
  hasAllergy: false,
});

beforeEach(() => {
  writes.length = 0;
  updates.length = 0;
  pushSeq = 0;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('addChild', () => {
  it('孩子本體與成員資格是同一筆原子寫入', async () => {
    const { result } = renderHook(() => useFirebaseChildren('u1'));

    const childId = await result.current.addChild('小豆', '2025-01-01', 0);

    expect(updates).toHaveLength(1);
    expect(updates[0].path).toBe('');
    expect(Object.keys(updates[0].value).sort()).toEqual(
      [`children/${childId}`, `users/u1/childrenIds/${childId}`, 'users/u1/currentChildId'].sort(),
    );
    expect(updates[0].value[`users/u1/childrenIds/${childId}`]).toBe(true);
    expect(updates[0].value['users/u1/currentChildId']).toBe(childId);
  });

  it('孩子本體不再單獨 set；只有公開索引排在授權之後', async () => {
    const { result } = renderHook(() => useFirebaseChildren('u1'));

    const childId = await result.current.addChild('小豆', '2025-01-01', 0);

    expect(writes.map((write) => write.path)).toEqual([`childIndex/${childId}`]);
  });

  it('第二個孩子不會被搶去當前選取', async () => {
    const { result } = renderHook(() => useFirebaseChildren('u1'));

    await result.current.addChild('小樹', '2026-01-01', 1);

    expect(Object.keys(updates[0].value)).not.toContain('users/u1/currentChildId');
  });

  it('超過上限就不寫任何東西', async () => {
    const { result } = renderHook(() => useFirebaseChildren('u1'));

    await expect(result.current.addChild('小三', '2026-01-01', 2)).rejects.toThrow(/最多/);
    expect(updates).toHaveLength(0);
    expect(writes).toHaveLength(0);
  });

  it('寶寶代碼是不可猜的 UUID', async () => {
    const { result } = renderHook(() => useFirebaseChildren('u1'));

    const first = await result.current.addChild('小豆', '2025-01-01', 0);
    const second = await result.current.addChild('小樹', '2026-01-01', 1);

    expect(first).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(second).not.toBe(first);
  });
});

describe('新紀錄的 key', () => {
  beforeEach(() => {
    // 兩個家長在同一毫秒各按一次「記錄」。
    vi.spyOn(Date, 'now').mockReturnValue(1_767_225_600_000);
  });

  it('同一毫秒的兩筆日誌各自存起來，不會互相覆蓋', async () => {
    const { result } = renderHook(() => useFirebaseChildren('u1'));

    const first = await result.current.addDailyLog('c1', feeding());
    const second = await result.current.addDailyLog('c1', feeding());

    expect(first).not.toBe(second);
    expect(writes.map((write) => write.path)).toEqual([
      `children/c1/dailyLogs/${first}`,
      `children/c1/dailyLogs/${second}`,
    ]);
  });

  it('紀錄裡的 id 就是它的 key，之後才改得動、刪得掉', async () => {
    const { result } = renderHook(() => useFirebaseChildren('u1'));

    const logId = await result.current.addDailyLog('c1', feeding());

    expect((writes[0].value as DailyLog).id).toBe(logId);
    expect(writes[0].path).toBe(`children/c1/dailyLogs/${logId}`);
  });

  it('日記與食物嘗試同樣不會撞 key', async () => {
    const { result } = renderHook(() => useFirebaseChildren('u1'));

    const entries = [
      await result.current.addDiaryEntry('c1', {
        childId: 'c1',
        date: '2026-01-01',
        content: '第一次翻身',
        createdAt: '2026-01-01T08:00:00.000Z',
      }),
      await result.current.addDiaryEntry('c1', {
        childId: 'c1',
        date: '2026-01-01',
        content: '第一次笑',
        createdAt: '2026-01-01T08:00:00.000Z',
      }),
    ];
    const foods = [
      await result.current.addFoodTrial('c1', riceTrial()),
      await result.current.addFoodTrial('c1', riceTrial()),
    ];

    expect(new Set([...entries, ...foods]).size).toBe(4);
  });
});
