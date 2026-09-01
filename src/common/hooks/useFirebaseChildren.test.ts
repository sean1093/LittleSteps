import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { User } from 'firebase/auth';
import type { DailyLog } from '../../types';
import { useFirebaseChildren } from './useFirebaseChildren';
// 讀與寫必須指向同一個子樹，所以那兩個 listener 一起在這裡驗。
import { useDailyLogs } from '../../littlesteps/hooks/useDailyLogs';
import { useDiary } from '../../littleexplorer/hooks/useDiary';

/**
 * 三種會靜靜吃掉資料的寫入方式：
 *
 * 1. 建檔曾經是三筆循序 set。孩子本體與自己的名單索引沒有一起落地，就會留下
 *    一份讀得到卻沒有任何入口指得到的檔案——名單、切換器上都沒有它。
 * 2. 新紀錄的 key 曾經是 Date.now()。共享的孩子有兩個家長，同一毫秒各寫一筆，
 *    後到的那筆直接蓋掉對方的。
 * 3. 刪除曾經是一連串 remove。規則裡的 root 是寫入前的資料庫，而
 *    childRecords/{childId} 的授權要去 children/{childId}/members 查成員，
 *    所以先刪本體的話後面幾筆會被拒——一份沒有人讀得到也刪不掉的健康紀錄。
 */

interface FakeRef {
  path: string;
}

const writes: { path: string; value: unknown }[] = [];
const updates: { path: string; value: Record<string, unknown> }[] = [];
const removals: string[] = [];
/** listener 訂閱過的路徑。 */
const subscriptions: string[] = [];
/** get() 讀得到什麼由每個測試自己擺；沒擺的路徑就是不存在。 */
const stored = new Map<string, unknown>();
/** 被規則拒絕的寫入路徑，用來模擬「對方沒有開放加入」。 */
const denied = new Set<string>();
/** 讀不到的路徑：成員資格被收回之後，讀本體就是這個樣子。 */
const unreadable = new Set<string>();
let pushSeq = 0;

vi.mock('firebase/database', () => ({
  ref: (_db: unknown, path = '') => ({ path }),
  // push() 的 key 由客戶端產生，含隨機位元；序號足以模擬「同一毫秒也不撞」。
  push: (parent: FakeRef) => {
    const key = `-Push${++pushSeq}`;
    return { path: `${parent.path}/${key}`, key };
  },
  onValue: (target: FakeRef) => {
    subscriptions.push(target.path);
    return () => {};
  },
  set: (target: FakeRef, value: unknown) => {
    if (denied.has(target.path)) return Promise.reject(new Error('PERMISSION_DENIED'));
    writes.push({ path: target.path, value });
    return Promise.resolve();
  },
  update: (target: FakeRef, value: Record<string, unknown>) => {
    updates.push({ path: target.path, value });
    return Promise.resolve();
  },
  remove: (target: FakeRef) => {
    removals.push(target.path);
    return Promise.resolve();
  },
  get: (target: FakeRef) => {
    if (unreadable.has(target.path)) return Promise.reject(new Error('PERMISSION_DENIED'));
    const value = stored.get(target.path);
    return Promise.resolve({ exists: () => value !== undefined, val: () => value ?? null });
  },
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

/** 資料庫裡的一份孩子檔案，只放這組測試在意的欄位。 */
const storeChild = (members: string[], createdBy = 'u1') =>
  stored.set('children/c1', {
    id: 'c1',
    name: '小豆',
    createdBy,
    members: Object.fromEntries(members.map((uid) => [uid, true])),
    joinOpen: true,
  });

const rootUpdate = () => {
  const root = updates.find((entry) => entry.path === '');
  if (!root) throw new Error('沒有 root fan-out');
  return root.value;
};

beforeEach(() => {
  writes.length = 0;
  updates.length = 0;
  removals.length = 0;
  subscriptions.length = 0;
  stored.clear();
  denied.clear();
  unreadable.clear();
  pushSeq = 0;
  vi.spyOn(console, 'error').mockImplementation(() => {});
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

  it('建立者在同一筆裡就是成員，否則連他自己都讀不回這個孩子', async () => {
    const { result } = renderHook(() => useFirebaseChildren('u1'));

    const childId = await result.current.addChild('小豆', '2025-01-01', 0);

    const profile = updates[0].value[`children/${childId}`] as Record<string, unknown>;
    expect(profile.members).toEqual({ u1: true });
    expect(profile.createdBy).toBe('u1');
  });

  it('joinOpen 一律寫成 false，不是留空', async () => {
    // 規則驗的是 isBoolean；欄位缺著的話分享視窗讀到 undefined，
    // 切換開關時會以為自己在改一個本來就存在的設定。
    const { result } = renderHook(() => useFirebaseChildren('u1'));

    const childId = await result.current.addChild('小豆', '2025-01-01', 0);

    const profile = updates[0].value[`children/${childId}`] as Record<string, unknown>;
    expect(profile.joinOpen).toBe(false);
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

describe('joinChild', () => {
  beforeEach(() => {
    stored.set('childIndex/c1', true);
  });

  it('成員資格先落地，才寫自己的名單', async () => {
    // 反過來的話，第二筆掉了就是在名單上留一個永遠讀不到的 id；這個順序
    // 至少還剩一位成員，另一端的 listener 補得回索引。
    const { result } = renderHook(() => useFirebaseChildren('u2'));

    await result.current.joinChild('c1', 0);

    expect(writes.map((write) => write.path)).toEqual([
      'children/c1/members/u2',
      'users/u2/childrenIds/c1',
    ]);
    expect(writes[0].value).toBe(true);
  });

  it('成員資格被拒時說的是「未開放加入」，不是「找不到代碼」', async () => {
    // 兩件事講成同一句話，家長會一直去核對一組沒有錯的代碼，
    // 而真正該做的是請對方把共享打開。
    denied.add('children/c1/members/u2');
    const { result } = renderHook(() => useFirebaseChildren('u2'));

    await expect(result.current.joinChild('c1', 0)).rejects.toThrow(/未開放加入/);
  });

  it('成員資格被拒就不會在自己的名單上留下這個 id', async () => {
    denied.add('children/c1/members/u2');
    const { result } = renderHook(() => useFirebaseChildren('u2'));

    await expect(result.current.joinChild('c1', 0)).rejects.toThrow();

    expect(writes).toHaveLength(0);
    expect(updates).toHaveLength(0);
  });

  it('代碼不存在時什麼都不寫', async () => {
    stored.delete('childIndex/c1');
    const { result } = renderHook(() => useFirebaseChildren('u2'));

    await expect(result.current.joinChild('c1', 0)).rejects.toThrow(/找不到此寶寶代碼/);
    expect(writes).toHaveLength(0);
  });

  it('已經加入過就不再寫一次成員資格', async () => {
    stored.set('users/u2/childrenIds/c1', true);
    const { result } = renderHook(() => useFirebaseChildren('u2'));

    await expect(result.current.joinChild('c1', 0)).rejects.toThrow(/已經加入/);
    expect(writes).toHaveLength(0);
  });
});

describe('deleteChild', () => {
  it('建立者刪除：本體、紀錄、索引、名單都在同一筆 fan-out 裡', async () => {
    // 規則裡的 root 是寫入前的資料庫。分成幾筆循序 remove 的話，本體一沒了
    // 就沒有人是成員，childRecords 與 childIndex 那兩筆會被拒——紀錄留在
    // 資料庫裡，而且再也沒有任何人讀得到或刪得掉。
    storeChild(['u1', 'u2']);
    const { result } = renderHook(() => useFirebaseChildren('u1'));

    await result.current.deleteChild('c1', ['c1', 'c2']);

    expect(updates).toHaveLength(1);
    expect(updates[0].path).toBe('');
    expect(rootUpdate()).toEqual({
      'children/c1': null,
      'childRecords/c1': null,
      'childIndex/c1': null,
      'users/u1/childrenIds/c1': null,
      'users/u1/currentChildId': 'c2',
    });
    expect(removals).toEqual([]);
  });

  it('其他成員刪除：交回成員資格，不動孩子本體', async () => {
    // 只清掉自己的 childrenIds 的話，那只是從自己的名單上藏起來，
    // 讀寫這份健康紀錄的權限還在。
    storeChild(['u1', 'u2']);
    const { result } = renderHook(() => useFirebaseChildren('u2'));

    await result.current.deleteChild('c1', ['c1']);

    expect(rootUpdate()).toEqual({
      'children/c1/members/u2': null,
      'users/u2/childrenIds/c1': null,
      'users/u2/currentChildId': null,
    });
  });

  it('讀不到本體時仍然清得掉自己的名單', async () => {
    // 成員資格被別人收回之後就讀不到本體了。這時候還不能清名單的話，
    // 那位家長會永遠卡著一個讀不到、又刪不掉的項目。
    unreadable.add('children/c1');
    const { result } = renderHook(() => useFirebaseChildren('u2'));

    await result.current.deleteChild('c1', ['c1', 'c3']);

    expect(rootUpdate()).toEqual({
      'users/u2/childrenIds/c1': null,
      'users/u2/currentChildId': 'c3',
    });
  });
});

describe('revokeOtherMembers', () => {
  it('移除其他成員並關掉加入，自己留著', async () => {
    // 代碼已經在對方手上，所以收回不是換代碼而是刪成員；joinOpen 沒有一起關掉，
    // 對方下一秒就用手上的同一組代碼加回來。
    storeChild(['u1', 'u2', 'u3']);
    const { result } = renderHook(() => useFirebaseChildren('u1'));

    await result.current.revokeOtherMembers('c1');

    expect(updates).toHaveLength(1);
    expect(updates[0].path).toBe('children/c1');
    expect(updates[0].value).toEqual({
      joinOpen: false,
      'members/u2': null,
      'members/u3': null,
    });
  });

  it('建立者的成員資格留著，否則整筆會被規則擋掉', async () => {
    // 規則上建立者的成員資格刪不掉（不然孩子本體會沒有人碰得到）。混進同一筆
    // 的話，共同照顧者按下收回時整筆被拒，畫面上什麼都不會發生。
    storeChild(['u1', 'u2', 'u3']);
    const { result } = renderHook(() => useFirebaseChildren('u2'));

    await result.current.revokeOtherMembers('c1');

    expect(updates[0].value).toEqual({ joinOpen: false, 'members/u3': null });
  });

  it('孩子已經不在了就說得出原因，而不是靜靜成功', async () => {
    const { result } = renderHook(() => useFirebaseChildren('u1'));

    await expect(result.current.revokeOtherMembers('c1')).rejects.toThrow(/找不到這個寶寶/);
    expect(updates).toHaveLength(0);
  });
});

describe('setJoinOpen', () => {
  it('只寫 joinOpen 這一個欄位', async () => {
    const { result } = renderHook(() => useFirebaseChildren('u1'));

    await result.current.setJoinOpen('c1', true);

    expect(writes).toEqual([{ path: 'children/c1/joinOpen', value: true }]);
  });
});

describe('只增不減的三份紀錄住在 childRecords 底下', () => {
  it('日誌的新增、修改、刪除都走 childRecords', async () => {
    // 留在孩子本體裡的話，每一次換尿布都會把整段歷史重新推送給每一位家長。
    const { result } = renderHook(() => useFirebaseChildren('u1'));

    const logId = await result.current.addDailyLog('c1', feeding());
    await result.current.updateDailyLog('c1', logId, { timestamp: '2026-01-01T09:00:00.000Z' });
    await result.current.deleteDailyLog('c1', logId);

    expect(writes[0].path).toBe(`childRecords/c1/dailyLogs/${logId}`);
    expect(updates[0].path).toBe(`childRecords/c1/dailyLogs/${logId}`);
    expect(removals).toEqual([`childRecords/c1/dailyLogs/${logId}`]);
  });

  it('日記的新增、修改、刪除都走 childRecords', async () => {
    const { result } = renderHook(() => useFirebaseChildren('u1'));

    const entryId = await result.current.addDiaryEntry('c1', {
      childId: 'c1',
      date: '2026-01-01',
      content: '第一次翻身',
      createdAt: '2026-01-01T08:00:00.000Z',
    });
    await result.current.updateDiaryEntry('c1', entryId, { content: '改過的內容' });
    await result.current.deleteDiaryEntry('c1', entryId);

    expect(writes[0].path).toBe(`childRecords/c1/diaryEntries/${entryId}`);
    expect(updates[0].path).toBe(`childRecords/c1/diaryEntries/${entryId}`);
    expect(removals).toEqual([`childRecords/c1/diaryEntries/${entryId}`]);
  });

  it('食物嘗試留在孩子本體裡：那份有固定的食物清單當上限', async () => {
    const { result } = renderHook(() => useFirebaseChildren('u1'));

    const foodId = await result.current.addFoodTrial('c1', riceTrial());

    expect(writes[0].path).toBe(`children/c1/foodTrackingProgress/${foodId}`);
  });

  it('日誌與日記的 listener 讀的就是寫進去的那條路徑', async () => {
    // 一邊搬了、另一邊沒搬的話，家長按下記錄之後畫面上什麼都沒有出現，
    // 而那筆資料其實好好地存在另一個地方——最難看出來的一種資料遺失。
    const user = { uid: 'u1' } as User;
    const { result } = renderHook(() => useFirebaseChildren('u1'));

    const logId = await result.current.addDailyLog('c1', feeding());
    const entryId = await result.current.addDiaryEntry('c1', {
      childId: 'c1',
      date: '2026-01-01',
      content: '第一次翻身',
      createdAt: '2026-01-01T08:00:00.000Z',
    });
    renderHook(() => useDailyLogs('c1', user));
    renderHook(() => useDiary('c1', user));

    expect(subscriptions).toEqual(['childRecords/c1/dailyLogs', 'childRecords/c1/diaryEntries']);
    expect(writes.map((write) => write.path)).toEqual([
      `childRecords/c1/dailyLogs/${logId}`,
      `childRecords/c1/diaryEntries/${entryId}`,
    ]);
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
      `childRecords/c1/dailyLogs/${first}`,
      `childRecords/c1/dailyLogs/${second}`,
    ]);
  });

  it('紀錄裡的 id 就是它的 key，之後才改得動、刪得掉', async () => {
    const { result } = renderHook(() => useFirebaseChildren('u1'));

    const logId = await result.current.addDailyLog('c1', feeding());

    expect((writes[0].value as DailyLog).id).toBe(logId);
    expect(writes[0].path).toBe(`childRecords/c1/dailyLogs/${logId}`);
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
