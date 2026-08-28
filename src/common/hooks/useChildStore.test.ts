import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { User } from 'firebase/auth';
import type { ChildProfile } from '../../types';
import { useChildStore } from './useChildStore';

// Login is mandatory, so the store is Firebase-only. Mock the Firebase-backed
// hooks it composes and assert it delegates to them correctly.
const h = vi.hoisted(() => ({
  userChildren: { children: [] as ChildProfile[], currentChildId: null as string | null, loading: false },
  firebaseChildren: {
    addChild: vi.fn().mockResolvedValue(undefined),
    joinChild: vi.fn().mockResolvedValue(undefined),
    updateChild: vi.fn().mockResolvedValue(undefined),
    deleteChild: vi.fn().mockResolvedValue(undefined),
    setCurrentChild: vi.fn().mockResolvedValue(undefined),
    updateMilestoneProgress: vi.fn().mockResolvedValue(undefined),
    updateVaccineProgress: vi.fn().mockResolvedValue(undefined),
    updateDevelopmentProgress: vi.fn().mockResolvedValue(undefined),
    updateToothProgress: vi.fn().mockResolvedValue(undefined),
    upsertPrenatalRecord: vi.fn().mockResolvedValue(undefined),
    clearPrenatalRecord: vi.fn().mockResolvedValue(undefined),
    upsertCareTaskRecord: vi.fn().mockResolvedValue(undefined),
    addDiaryEntry: vi.fn().mockResolvedValue('diary_1'),
    updateDiaryEntry: vi.fn().mockResolvedValue(undefined),
    deleteDiaryEntry: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('./useUserChildren', () => ({ useUserChildren: () => h.userChildren }));
vi.mock('./useFirebaseChildren', () => ({ useFirebaseChildren: () => h.firebaseChildren }));
vi.mock('../../lib/firebase', () => ({
  database: {},
  logMilestoneToggle: vi.fn(),
  logVaccineToggle: vi.fn(),
  logChildProfileAction: vi.fn(),
}));

const user = { uid: 'u1' } as User;

const child = (overrides: Partial<ChildProfile> = {}): ChildProfile => ({
  id: 'c1',
  name: '小明',
  birthday: '2026-01-01',
  milestoneProgress: {},
  vaccineProgress: {},
  createdAt: '2026-01-01T00:00:00.000Z',
  createdBy: 'u1',
  ...overrides,
});

describe('useChildStore (Firebase mode)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    h.userChildren = { children: [], currentChildId: null, loading: false };
    vi.stubGlobal('alert', vi.fn());
  });

  it('exposes children and the resolved current child from useUserChildren', () => {
    h.userChildren = { children: [child()], currentChildId: 'c1', loading: false };
    const { result } = renderHook(() => useChildStore(user));

    expect(result.current.childProfiles).toHaveLength(1);
    expect(result.current.currentChild?.name).toBe('小明');
    expect(result.current.currentChildId).toBe('c1');
  });

  it('delegates addChild to Firebase with the current child count', async () => {
    h.userChildren = { children: [child()], currentChildId: 'c1', loading: false };
    const { result } = renderHook(() => useChildStore(user));

    await act(async () => {
      await result.current.addChild('小華', '2026-02-02', 'female');
    });

    expect(h.firebaseChildren.addChild).toHaveBeenCalledWith('小華', '2026-02-02', 1, 'female', undefined);
  });

  it('enforces the 2-child free-tier limit without calling Firebase', async () => {
    h.userChildren = { children: [child(), child({ id: 'c2' })], currentChildId: 'c1', loading: false };
    const alertSpy = vi.fn();
    vi.stubGlobal('alert', alertSpy);
    const { result } = renderHook(() => useChildStore(user));

    await act(async () => {
      await result.current.addChild('第三個', '2026-03-03');
    });

    expect(h.firebaseChildren.addChild).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalled();
  });

  // 這是 LittleBloom 一直是空殼的根因：dueDate 從 AddChildModal 一路傳來，
  // 但中途兩層都只宣告 3 個參數，於是被靜默丟棄，pregnancyData 永遠寫不進去。
  it('forwards the due date so a pregnancy profile can actually be created', async () => {
    h.userChildren = { children: [], currentChildId: null, loading: false };
    const { result } = renderHook(() => useChildStore(user));

    await act(async () => {
      await result.current.addChild('小花', '2026-12-01', undefined, '2026-12-01');
    });

    expect(h.firebaseChildren.addChild).toHaveBeenCalledWith(
      '小花',
      '2026-12-01',
      0,
      undefined,
      '2026-12-01',
    );
  });

  it('omits the due date for a normal child profile', async () => {
    h.userChildren = { children: [], currentChildId: null, loading: false };
    const { result } = renderHook(() => useChildStore(user));

    await act(async () => {
      await result.current.addChild('小樹', '2024-08-27', 'male');
    });

    expect(h.firebaseChildren.addChild).toHaveBeenCalledWith(
      '小樹',
      '2024-08-27',
      0,
      'male',
      undefined,
    );
  });

  it('產檢紀錄寫向孕期檔案，即使現在選的是另一個寶寶', async () => {
    // 回報的情境：已經有寶寶檔案的家長新增孕期檔案，currentChildId 仍然
    // 指著寶寶。若寫入跟著 currentChild 走，產檢紀錄會落在寶寶的檔案上。
    const bump = child({
      id: 'p1',
      name: '寶寶',
      isPregnancy: true,
      pregnancyData: {
        childId: 'p1',
        dueDate: '2026-11-20',
        lastPeriodDate: '2026-02-13',
        status: 'active',
      },
    });
    h.userChildren = { children: [child(), bump], currentChildId: 'c1', loading: false };
    const { result } = renderHook(() => useChildStore(user));

    expect(result.current.pregnancyChild?.id).toBe('p1');

    await act(async () => {
      await result.current.upsertPrenatalRecord('visit-1', { completedDate: '2026-03-01' });
      await result.current.clearPrenatalRecord('visit-1');
    });

    expect(h.firebaseChildren.upsertPrenatalRecord).toHaveBeenCalledWith('p1', 'visit-1', {
      completedDate: '2026-03-01',
    });
    expect(h.firebaseChildren.clearPrenatalRecord).toHaveBeenCalledWith('p1', 'visit-1');
  });

  it('改孕期檔案的日期時，pregnancyData 跟著改', async () => {
    // birthday 對孕期檔案來說就是預產期，但週數與 14 次產檢時程算的是
    // lastPeriodDate。只改 birthday 的話，照超音波修正預產期之後，
    // LittleBloom 會永遠停在舊的末次月經上。
    const bump = child({
      id: 'p1',
      isPregnancy: true,
      pregnancyData: {
        childId: 'p1',
        dueDate: '2026-11-20',
        lastPeriodDate: '2026-02-13',
        status: 'active',
      },
    });
    h.userChildren = { children: [bump], currentChildId: 'p1', loading: false };
    const { result } = renderHook(() => useChildStore(user));

    await act(async () => {
      await result.current.updateChild('p1', '寶寶', '2026-12-01');
    });

    expect(h.firebaseChildren.updateChild).toHaveBeenCalledWith(
      'p1',
      '寶寶',
      '2026-12-01',
      undefined,
      true,
    );
  });

  it('一般寶寶檔案不會被當成孕期檔案改寫', async () => {
    h.userChildren = { children: [child()], currentChildId: 'c1', loading: false };
    const { result } = renderHook(() => useChildStore(user));

    await act(async () => {
      await result.current.updateChild('c1', '小明', '2026-02-02');
    });

    expect(h.firebaseChildren.updateChild).toHaveBeenCalledWith(
      'c1',
      '小明',
      '2026-02-02',
      undefined,
      false,
    );
  });

  it('刪除當下選取的孩子時，把選取交給還在的那一個', async () => {
    // 少了這一步，currentChildId 會繼續指著已刪除的 id，明明還有另一個
    // 孩子，每一頁卻都顯示「還沒有寶寶資料，請新增」。
    h.userChildren = {
      children: [child(), child({ id: 'c2', name: '小樹' })],
      currentChildId: 'c1',
      loading: false,
    };
    const { result } = renderHook(() => useChildStore(user));

    await act(async () => {
      await result.current.deleteChild('c1');
    });

    expect(h.firebaseChildren.deleteChild).toHaveBeenCalledWith('c1', ['c1', 'c2']);
  });

  it('toggles a milestone, deriving the new achieved state', async () => {
    h.userChildren = {
      children: [child({ milestoneProgress: { m1: { achieved: false } } })],
      currentChildId: 'c1',
      loading: false,
    };
    const { result } = renderHook(() => useChildStore(user));

    await act(async () => {
      await result.current.toggleMilestone('m1');
    });

    expect(h.firebaseChildren.updateMilestoneProgress).toHaveBeenCalledWith('c1', 'm1', true);
  });

  it('toggles a vaccine dose administered state', async () => {
    h.userChildren = { children: [child()], currentChildId: 'c1', loading: false };
    const { result } = renderHook(() => useChildStore(user));

    await act(async () => {
      await result.current.toggleVaccineDose('bcg', 1, '2026-05-01');
    });

    expect(h.firebaseChildren.updateVaccineProgress).toHaveBeenCalledWith('c1', 'bcg', 1, true, '2026-05-01');
  });

  it('delegates delete and switch to Firebase', async () => {
    h.userChildren = { children: [child()], currentChildId: 'c1', loading: false };
    const { result } = renderHook(() => useChildStore(user));

    await act(async () => {
      await result.current.setCurrentChild('c1');
      await result.current.deleteChild('c1');
    });

    expect(h.firebaseChildren.setCurrentChild).toHaveBeenCalledWith('c1');
    // 第二個參數是刪除當下還存在的 id 清單，資料層據此把 currentChildId
    // 交給還在的孩子。
    expect(h.firebaseChildren.deleteChild).toHaveBeenCalledWith('c1', ['c1']);
  });

  it('toggles a development check, deriving the new achieved state', async () => {
    h.userChildren = {
      children: [child({ developmentProgress: { 'check-12-15-language': { achieved: true } } })],
      currentChildId: 'c1',
      loading: false,
    };
    const { result } = renderHook(() => useChildStore(user));

    await act(async () => {
      await result.current.toggleDevelopmentCheck('check-12-15-language');
    });

    expect(h.firebaseChildren.updateDevelopmentProgress).toHaveBeenCalledWith(
      'c1',
      'check-12-15-language',
      false,
    );
  });

  it('treats an unseen development check as not yet achieved', async () => {
    h.userChildren = { children: [child()], currentChildId: 'c1', loading: false };
    const { result } = renderHook(() => useChildStore(user));

    await act(async () => {
      await result.current.toggleDevelopmentCheck('check-30-36-social');
    });

    expect(h.firebaseChildren.updateDevelopmentProgress).toHaveBeenCalledWith(
      'c1',
      'check-30-36-social',
      true,
    );
  });

  it('stamps diary entries with the current child id and a creation time', async () => {
    h.userChildren = { children: [child()], currentChildId: 'c1', loading: false };
    const { result } = renderHook(() => useChildStore(user));

    await act(async () => {
      await result.current.addDiaryEntry({ date: '2026-08-27', content: '今天自己穿鞋' });
    });

    const [childId, entry] = h.firebaseChildren.addDiaryEntry.mock.calls[0];
    expect(childId).toBe('c1');
    expect(entry.childId).toBe('c1');
    expect(entry.content).toBe('今天自己穿鞋');
    expect(Date.parse(entry.createdAt)).not.toBeNaN();
  });

  it('delegates care-task, diary update and diary delete to Firebase', async () => {
    h.userChildren = { children: [child()], currentChildId: 'c1', loading: false };
    const { result } = renderHook(() => useChildStore(user));
    const record = { taskId: 'fluoride-18m', completedDate: '2026-08-27' };

    await act(async () => {
      await result.current.upsertCareTaskRecord(record);
      await result.current.updateDiaryEntry('diary_1', { content: '改過的內容' });
      await result.current.deleteDiaryEntry('diary_1');
    });

    expect(h.firebaseChildren.upsertCareTaskRecord).toHaveBeenCalledWith('c1', record);
    expect(h.firebaseChildren.updateDiaryEntry).toHaveBeenCalledWith('c1', 'diary_1', {
      content: '改過的內容',
    });
    expect(h.firebaseChildren.deleteDiaryEntry).toHaveBeenCalledWith('c1', 'diary_1');
  });

  it('no-ops LittleExplorer mutators when no child is selected', async () => {
    h.userChildren = { children: [], currentChildId: null, loading: false };
    const { result } = renderHook(() => useChildStore(user));

    await act(async () => {
      await result.current.toggleDevelopmentCheck('check-12-15-language');
      await result.current.addDiaryEntry({ date: '2026-08-27', content: 'x' });
    });

    expect(h.firebaseChildren.updateDevelopmentProgress).not.toHaveBeenCalled();
    expect(h.firebaseChildren.addDiaryEntry).not.toHaveBeenCalled();
  });

  it('is a no-op for every mutator when there is no user', async () => {
    const { result } = renderHook(() => useChildStore(null));

    await act(async () => {
      await result.current.addChild('X', '2026-01-01');
      await result.current.setCurrentChild('c1');
    });

    expect(h.firebaseChildren.addChild).not.toHaveBeenCalled();
    expect(h.firebaseChildren.setCurrentChild).not.toHaveBeenCalled();
  });
});
