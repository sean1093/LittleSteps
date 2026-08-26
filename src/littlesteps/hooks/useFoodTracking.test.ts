import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { MockInstance } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { User } from 'firebase/auth';
import type { FoodTrackingProgress, FoodTrialRecord } from '../../types';
import { useFoodTracking } from './useFoodTracking';

// firebase/database and lib/firebase are mocked globally in src/test/setup.ts, so
// the authenticated branch renders without touching a real backend. Every write
// assertion below targets the guest (LocalStorage) branch.

const STORAGE_KEY = 'food-tracking-child1';

type NewFood = Omit<FoodTrialRecord, 'id' | 'createdAt'>;

const food = (overrides: Partial<NewFood> = {}): NewFood => ({
  foodName: '胡蘿蔔',
  category: '蔬菜',
  firstTriedDate: '2026-05-10',
  trialDates: ['2026-05-10'],
  hasAllergy: false,
  ...overrides,
});

const stored = (key = STORAGE_KEY): FoodTrackingProgress | null => {
  const raw = localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as FoodTrackingProgress) : null;
};

/** YYYY-MM-DD of the UTC day `n` days before now, using the real clock. */
const utcDaysAgo = (n: number): string =>
  new Date(new Date().getTime() - n * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

describe('useFoodTracking (guest / LocalStorage mode)', () => {
  let nowSpy: MockInstance<() => number>;

  beforeEach(() => {
    localStorage.clear();
    // Food ids are derived from Date.now(); make it strictly increasing so rapid
    // successive adds in a test get distinct ids (real usage is days apart).
    let tick = 0;
    nowSpy = vi.spyOn(Date, 'now').mockImplementation(() => 1_700_000_000_000 + tick++);
  });

  afterEach(() => {
    nowSpy.mockRestore();
  });

  it('hydrates from the child-scoped storage key', () => {
    const seed: FoodTrackingProgress = {
      food_seed: { ...food(), id: 'food_seed', createdAt: '2026-05-10T00:00:00.000Z' },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));

    const { result } = renderHook(() => useFoodTracking('child1', null));

    expect(result.current.loading).toBe(false);
    expect(result.current.foodProgress).toEqual(seed);
    expect(result.current.foodTrials.map(f => f.id)).toEqual(['food_seed']);
  });

  it('addFoodTrial keys the record by its returned id and persists it', async () => {
    const { result } = renderHook(() => useFoodTracking('child1', null));

    let id = '';
    await act(async () => {
      id = await result.current.addFoodTrial(food());
    });

    expect(id).toMatch(/^food_\d+$/);
    expect(Object.keys(result.current.foodProgress)).toEqual([id]);
    const record = result.current.foodProgress[id];
    expect(record).toMatchObject({ id, foodName: '胡蘿蔔', hasAllergy: false });
    expect(record.createdAt).toMatch(ISO);
    expect(record.updatedAt).toBeUndefined();
    expect(stored()).toEqual(result.current.foodProgress);
  });

  it('exposes foodTrials sorted by firstTriedDate, newest first', async () => {
    const { result } = renderHook(() => useFoodTracking('child1', null));

    // One mutation per act(): the mutations close over the rendered progress map,
    // so batching them into a single act() would make later calls clobber earlier ones.
    await act(async () => {
      await result.current.addFoodTrial(food({ foodName: '南瓜', firstTriedDate: '2026-05-12' }));
    });
    await act(async () => {
      await result.current.addFoodTrial(food({ foodName: '蘋果', firstTriedDate: '2026-06-01' }));
    });
    await act(async () => {
      await result.current.addFoodTrial(food({ foodName: '米糊', firstTriedDate: '2026-04-20' }));
    });

    expect(result.current.foodTrials.map(f => f.foodName)).toEqual(['蘋果', '南瓜', '米糊']);
  });

  it('derives allergy and preference stats from the trials', async () => {
    const { result } = renderHook(() => useFoodTracking('child1', null));

    await act(async () => {
      await result.current.addFoodTrial(food({ foodName: '蛋黃', hasAllergy: true, preference: 'refuse' }));
    });
    await act(async () => {
      await result.current.addFoodTrial(food({ foodName: '蘋果', preference: 'love' }));
    });
    await act(async () => {
      await result.current.addFoodTrial(food({ foodName: '南瓜', preference: 'like' }));
    });
    await act(async () => {
      await result.current.addFoodTrial(food({ foodName: '花椰菜', preference: 'neutral' }));
    });

    expect(result.current.stats).toEqual({
      total: 4,
      withAllergy: 1,
      noAllergy: 3,
      loved: 2, // love + like
      disliked: 1, // refuse (neutral counts for neither)
    });
  });

  it('updateFoodTrial merges the patch, stamps updatedAt and leaves siblings alone', async () => {
    const { result } = renderHook(() => useFoodTracking('child1', null));

    let target = '';
    await act(async () => {
      target = await result.current.addFoodTrial(food({ foodName: '蛋黃' }));
    });
    let other = '';
    await act(async () => {
      other = await result.current.addFoodTrial(food({ foodName: '蘋果' }));
    });

    await act(async () => {
      await result.current.updateFoodTrial(target, {
        hasAllergy: true,
        preference: 'refuse',
        allergyReactions: [{ type: 'rash', severity: 'mild', date: '2026-05-11' }],
      });
    });

    const updated = result.current.foodProgress[target];
    expect(updated).toMatchObject({
      id: target,
      foodName: '蛋黃',
      category: '蔬菜',
      hasAllergy: true,
      preference: 'refuse',
    });
    expect(updated.allergyReactions).toHaveLength(1);
    expect(updated.updatedAt).toMatch(ISO);
    expect(result.current.foodProgress[other].updatedAt).toBeUndefined();
    expect(stored()).toEqual(result.current.foodProgress);
  });

  it('updateFoodTrial rejects an unknown food id', async () => {
    const { result } = renderHook(() => useFoodTracking('child1', null));

    await expect(result.current.updateFoodTrial('food_missing', { hasAllergy: true })).rejects.toThrow(
      'Food trial not found',
    );
    expect(result.current.foodProgress).toEqual({});
  });

  it('deleteFoodTrial drops only the target record', async () => {
    const { result } = renderHook(() => useFoodTracking('child1', null));

    let keep = '';
    await act(async () => {
      keep = await result.current.addFoodTrial(food({ foodName: '蘋果' }));
    });
    let drop = '';
    await act(async () => {
      drop = await result.current.addFoodTrial(food({ foodName: '蛋黃' }));
    });

    await act(async () => {
      await result.current.deleteFoodTrial(drop);
    });

    expect(Object.keys(result.current.foodProgress)).toEqual([keep]);
    expect(Object.keys(stored()!)).toEqual([keep]);

    // Deleting something that is not there leaves the map intact.
    await act(async () => {
      await result.current.deleteFoodTrial('food_missing');
    });
    expect(Object.keys(result.current.foodProgress)).toEqual([keep]);
  });

  it('addTrialDate appends dates in order and ignores duplicates', async () => {
    const { result } = renderHook(() => useFoodTracking('child1', null));

    let id = '';
    await act(async () => {
      id = await result.current.addFoodTrial(food({ trialDates: ['2026-05-10'] }));
    });

    await act(async () => {
      await result.current.addTrialDate(id, '2026-05-16');
    });
    await act(async () => {
      await result.current.addTrialDate(id, '2026-05-13');
    });
    expect(result.current.foodProgress[id].trialDates).toEqual([
      '2026-05-10',
      '2026-05-13',
      '2026-05-16',
    ]);

    await act(async () => {
      await result.current.addTrialDate(id, '2026-05-13');
    });
    expect(result.current.foodProgress[id].trialDates).toEqual([
      '2026-05-10',
      '2026-05-13',
      '2026-05-16',
    ]);
    expect(stored()![id].trialDates).toEqual(['2026-05-10', '2026-05-13', '2026-05-16']);
  });

  it('addTrialDate rejects an unknown food id', async () => {
    const { result } = renderHook(() => useFoodTracking('child1', null));

    await expect(result.current.addTrialDate('food_missing', '2026-05-13')).rejects.toThrow(
      'Food trial not found',
    );
  });

  it('canTryNewFood gates a re-try on a 3-day gap since the last trial', async () => {
    const { result } = renderHook(() => useFoodTracking('child1', null));

    let untried = '';
    await act(async () => {
      untried = await result.current.addFoodTrial(food({ trialDates: [] }));
    });
    let recent = '';
    await act(async () => {
      recent = await result.current.addFoodTrial(food({ trialDates: [utcDaysAgo(2)] }));
    });
    let ready = '';
    await act(async () => {
      ready = await result.current.addFoodTrial(food({ trialDates: [utcDaysAgo(3)] }));
    });

    expect(result.current.canTryNewFood('food_missing')).toBe(true); // unknown food: nothing to wait for
    expect(result.current.canTryNewFood(untried)).toBe(true); // never tried yet
    expect(result.current.canTryNewFood(recent)).toBe(false); // 2 days < 3
    expect(result.current.canTryNewFood(ready)).toBe(true); // exactly 3 days
  });

  it('getNextTrialDate returns the last trial date plus three days', async () => {
    const { result } = renderHook(() => useFoodTracking('child1', null));

    let id = '';
    await act(async () => {
      id = await result.current.addFoodTrial(food({ trialDates: ['2026-05-07', '2026-05-10'] }));
    });
    let untried = '';
    await act(async () => {
      untried = await result.current.addFoodTrial(food({ trialDates: [] }));
    });

    expect(result.current.getNextTrialDate(id)).toBe('2026-05-13');
    expect(result.current.getNextTrialDate(untried)).toBeNull();
    expect(result.current.getNextTrialDate('food_missing')).toBeNull();
  });

  it('rejects every mutation with "No child selected" when there is no child', async () => {
    const { result } = renderHook(() => useFoodTracking(null, null));

    await expect(result.current.addFoodTrial(food())).rejects.toThrow('No child selected');
    await expect(result.current.updateFoodTrial('food_1', {})).rejects.toThrow('No child selected');
    await expect(result.current.deleteFoodTrial('food_1')).rejects.toThrow('No child selected');
    await expect(result.current.addTrialDate('food_1', '2026-05-13')).rejects.toThrow(
      'No child selected',
    );
    expect(localStorage.length).toBe(0);
  });

  it('routes writes away from LocalStorage in Firebase mode', async () => {
    const user = { uid: 'u1' } as unknown as User;
    const { result } = renderHook(() => useFoodTracking('child1', user));

    await expect(result.current.addFoodTrial(food())).rejects.toThrow(
      'Use firebaseChildren.addFoodTrial for Firebase mode',
    );
    await expect(result.current.updateFoodTrial('food_1', {})).rejects.toThrow(
      'Use firebaseChildren.updateFoodTrial for Firebase mode',
    );
    await expect(result.current.deleteFoodTrial('food_1')).rejects.toThrow(
      'Use firebaseChildren.deleteFoodTrial for Firebase mode',
    );
    expect(stored()).toBeNull();
  });
});
