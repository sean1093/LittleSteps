import { describe, it, expect, vi, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGrowthTracking } from './useGrowthTracking';
import type { GrowthRecord } from '../../types';

const CHILD_ID = 'child-1';
const STORAGE_KEY = `growth-records-${CHILD_ID}`;
const BIRTHDAY = '2026-01-01';
// 6 months after BIRTHDAY -> WHO male standards at 6m: weight M=7.9341, height
// M=67.6236, headCircumference M=43.3306.
const AT_6_MONTHS = '2026-07-01';

/**
 * The percentile math parses 'YYYY-MM-DD' (UTC midnight) but reads *local*
 * calendar fields, so the derived age in months — and therefore every expected
 * percentile below — depends on the runner's timezone. Pin it for this file and
 * restore it afterwards so sibling test files keep the ambient zone.
 */
const originalTZ = process.env.TZ;
beforeAll(() => {
  process.env.TZ = 'UTC';
});
afterAll(() => {
  if (originalTZ === undefined) delete process.env.TZ;
  else process.env.TZ = originalTZ;
});

const readStorage = (): GrowthRecord[] =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as GrowthRecord[];

const input = (
  overrides: Partial<Omit<GrowthRecord, 'id'>> = {}
): Omit<GrowthRecord, 'id'> => ({
  childId: CHILD_ID,
  date: AT_6_MONTHS,
  percentile: {},
  ...overrides,
});

describe('useGrowthTracking (guest / LocalStorage mode)', () => {
  beforeEach(() => {
    localStorage.clear();
    // Record ids are derived from Date.now(); make it strictly increasing so
    // successive adds inside one test cannot collide (real usage is minutes apart).
    let tick = 0;
    vi.spyOn(Date, 'now').mockImplementation(() => 1_700_000_000_000 + tick++);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('hydration', () => {
    it('reports an empty, settled state when no child is selected', () => {
      const { result } = renderHook(() => useGrowthTracking(null, null));

      expect(result.current.records).toEqual([]);
      expect(result.current.loading).toBe(false);
    });

    it('hydrates persisted records newest-first', () => {
      const seeded: GrowthRecord[] = [
        { id: 'r-old', childId: CHILD_ID, date: '2026-03-01', weight: 6, percentile: {} },
        { id: 'r-new', childId: CHILD_ID, date: '2026-07-01', weight: 8, percentile: {} },
        { id: 'r-mid', childId: CHILD_ID, date: '2026-05-01', weight: 7, percentile: {} },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));

      const { result } = renderHook(() => useGrowthTracking(CHILD_ID, null));

      expect(result.current.records.map((r) => r.id)).toEqual(['r-new', 'r-mid', 'r-old']);
      expect(result.current.loading).toBe(false);
    });

    it('survives a corrupt persisted payload instead of throwing', () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem(STORAGE_KEY, '{ not json');

      const { result } = renderHook(() => useGrowthTracking(CHILD_ID, null));

      expect(result.current.records).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(errorSpy).toHaveBeenCalled();
    });
  });

  describe('addRecord', () => {
    it('persists the record and exposes it with a generated id', async () => {
      const { result } = renderHook(() => useGrowthTracking(CHILD_ID, null));

      await act(async () => {
        await result.current.addRecord(input({ weight: 8.1, notes: '滿六個月健檢' }));
      });

      expect(result.current.records).toHaveLength(1);
      const [record] = result.current.records;
      expect(record.id).toMatch(/^growth_\d+_[a-z0-9]+$/);
      expect(record.childId).toBe(CHILD_ID);
      expect(record.date).toBe(AT_6_MONTHS);
      expect(record.weight).toBe(8.1);
      expect(record.notes).toBe('滿六個月健檢');
      // LocalStorage is the source of truth, not just the in-memory copy.
      expect(readStorage()).toEqual(result.current.records);
    });

    it('derives a WHO percentile for every supplied measurement', async () => {
      const { result } = renderHook(() =>
        useGrowthTracking(CHILD_ID, null, 'male', BIRTHDAY)
      );

      await act(async () => {
        await result.current.addRecord(
          input({ weight: 9, height: 70, headCircumference: 44 })
        );
      });

      const { percentile } = result.current.records[0];
      expect(percentile.weight).toBeCloseTo(87.6875, 4);
      expect(percentile.height).toBeCloseTo(86.6569, 4);
      expect(percentile.headCircumference).toBeCloseTo(69.9442, 4);
      expect(readStorage()[0].percentile.weight).toBeCloseTo(87.6875, 4);
    });

    it('only derives percentiles for measurements that were recorded', async () => {
      const { result } = renderHook(() =>
        useGrowthTracking(CHILD_ID, null, 'male', BIRTHDAY)
      );

      // Exactly the WHO male 6-month median weight -> z = 0 -> 50th percentile.
      await act(async () => {
        await result.current.addRecord(input({ weight: 7.9341 }));
      });

      const { percentile } = result.current.records[0];
      expect(Object.keys(percentile)).toEqual(['weight']);
      expect(percentile.weight).toBeCloseTo(50, 5);
    });

    it('clamps percentiles into the 0.1–99.9 band at the measurement extremes', async () => {
      const { result } = renderHook(() =>
        useGrowthTracking(CHILD_ID, null, 'male', BIRTHDAY)
      );

      // 50kg / 150cm / 70cm are the largest values validation still accepts.
      await act(async () => {
        await result.current.addRecord(
          input({ date: AT_6_MONTHS, weight: 50, height: 150, headCircumference: 70 })
        );
      });
      await act(async () => {
        await result.current.addRecord(input({ date: '2026-06-01', weight: 0 }));
      });

      const [highest, lowest] = result.current.records; // 07-01 sorts before 06-01
      expect(highest.percentile).toEqual({
        weight: 99.9,
        height: 99.9,
        headCircumference: 99.9,
      });
      expect(lowest.percentile.weight).toBe(0.1);
    });

    it('leaves percentiles empty when the child gender/birthday are unknown', async () => {
      const { result } = renderHook(() => useGrowthTracking(CHILD_ID, null));

      await act(async () => {
        await result.current.addRecord(input({ weight: 9, height: 70 }));
      });

      expect(result.current.records[0].percentile).toEqual({});
    });

    it('keeps caller-supplied percentiles instead of recomputing them', async () => {
      const { result } = renderHook(() =>
        useGrowthTracking(CHILD_ID, null, 'male', BIRTHDAY)
      );

      await act(async () => {
        await result.current.addRecord(input({ weight: 9, percentile: { weight: 12.5 } }));
      });

      expect(result.current.records[0].percentile).toEqual({ weight: 12.5 });
    });

    it('still persists the record when the age is outside the WHO 0–24 month range', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const { result } = renderHook(() =>
        useGrowthTracking(CHILD_ID, null, 'male', '2023-01-01')
      );

      await act(async () => {
        await result.current.addRecord(input({ weight: 14 }));
      });

      expect(result.current.records).toHaveLength(1);
      expect(result.current.records[0].weight).toBe(14);
      expect(result.current.records[0].percentile).toEqual({});
      expect(warnSpy).toHaveBeenCalled();
    });

    it('keeps the list sorted newest-first as records arrive out of order', async () => {
      const { result } = renderHook(() => useGrowthTracking(CHILD_ID, null));

      await act(async () => {
        await result.current.addRecord(input({ date: '2026-04-01', weight: 6.5 }));
      });
      await act(async () => {
        await result.current.addRecord(input({ date: '2026-09-01', weight: 8.8 }));
      });
      await act(async () => {
        await result.current.addRecord(input({ date: '2026-06-01', weight: 7.7 }));
      });

      expect(result.current.records.map((r) => r.date)).toEqual([
        '2026-09-01',
        '2026-06-01',
        '2026-04-01',
      ]);
      expect(readStorage()).toHaveLength(3);
    });

    it('reloads persisted records after the hook is remounted', async () => {
      const first = renderHook(() => useGrowthTracking(CHILD_ID, null));
      await act(async () => {
        await first.result.current.addRecord(input({ weight: 8.2 }));
      });
      const persistedId = first.result.current.records[0].id;
      first.unmount();

      const { result } = renderHook(() => useGrowthTracking(CHILD_ID, null));

      expect(result.current.records).toHaveLength(1);
      expect(result.current.records[0].id).toBe(persistedId);
      expect(result.current.records[0].weight).toBe(8.2);
    });

    it('rejects when no child is selected', async () => {
      const { result } = renderHook(() => useGrowthTracking(null, null));

      await expect(result.current.addRecord(input({ weight: 8 }))).rejects.toThrow(
        'No child selected'
      );
    });

    const invalidCases: Array<[string, Partial<Omit<GrowthRecord, 'id'>>, string]> = [
      ['a malformed date', { date: '2026/07/01' }, 'Invalid date format: must be YYYY-MM-DD'],
      ['a negative weight', { weight: -0.1 }, 'Invalid measurement: weight cannot be negative'],
      ['weight above 50kg', { weight: 50.1 }, 'Unrealistic measurement: weight over 50kg for infant'],
      ['a negative height', { height: -1 }, 'Invalid measurement: height cannot be negative'],
      ['height above 150cm', { height: 150.1 }, 'Unrealistic measurement: height over 150cm for infant'],
      [
        'a negative head circumference',
        { headCircumference: -2 },
        'Invalid measurement: head circumference cannot be negative',
      ],
      [
        'head circumference above 70cm',
        { headCircumference: 70.1 },
        'Unrealistic measurement: head circumference over 70cm',
      ],
    ];

    it.each(invalidCases)('rejects %s and writes nothing', async (_label, patch, message) => {
      const { result } = renderHook(() =>
        useGrowthTracking(CHILD_ID, null, 'male', BIRTHDAY)
      );

      await expect(result.current.addRecord(input(patch))).rejects.toThrow(message);
      expect(result.current.records).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });

  describe('updateRecord', () => {
    it('merges the updates into the stored record and keeps its id', async () => {
      const { result } = renderHook(() => useGrowthTracking(CHILD_ID, null));
      await act(async () => {
        await result.current.addRecord(input({ weight: 8, notes: '初測' }));
      });
      const { id } = result.current.records[0];

      await act(async () => {
        await result.current.updateRecord(id, { weight: 8.4, height: 68 });
      });

      const [record] = result.current.records;
      expect(record.id).toBe(id);
      expect(record.weight).toBe(8.4);
      expect(record.height).toBe(68);
      expect(record.notes).toBe('初測');
      expect(record.childId).toBe(CHILD_ID);
      expect(readStorage()).toEqual(result.current.records);
    });

    it('recomputes percentiles only when the caller clears them', async () => {
      const { result } = renderHook(() =>
        useGrowthTracking(CHILD_ID, null, 'male', BIRTHDAY)
      );
      await act(async () => {
        await result.current.addRecord(input({ weight: 7.9341 }));
      });
      const { id } = result.current.records[0];
      expect(result.current.records[0].percentile.weight).toBeCloseTo(50, 5);

      // An already-populated percentile map short-circuits the recalculation.
      await act(async () => {
        await result.current.updateRecord(id, { weight: 9 });
      });
      expect(result.current.records[0].weight).toBe(9);
      expect(result.current.records[0].percentile.weight).toBeCloseTo(50, 5);

      // Clearing the map opts back into the WHO calculation.
      await act(async () => {
        await result.current.updateRecord(id, { percentile: {} });
      });
      expect(result.current.records[0].percentile.weight).toBeCloseTo(87.6875, 4);
    });

    it('re-sorts the list when a record date moves', async () => {
      const { result } = renderHook(() => useGrowthTracking(CHILD_ID, null));
      await act(async () => {
        await result.current.addRecord(input({ date: '2026-03-01', weight: 6 }));
      });
      await act(async () => {
        await result.current.addRecord(input({ date: '2026-07-01', weight: 8 }));
      });
      const marchId = result.current.records[1].id;

      await act(async () => {
        await result.current.updateRecord(marchId, { date: '2026-09-01' });
      });

      expect(result.current.records.map((r) => r.id)).toEqual([
        marchId,
        result.current.records[1].id,
      ]);
      expect(result.current.records.map((r) => r.date)).toEqual([
        '2026-09-01',
        '2026-07-01',
      ]);
    });

    it('re-validates the merged record and leaves the stored copy untouched', async () => {
      const { result } = renderHook(() => useGrowthTracking(CHILD_ID, null));
      await act(async () => {
        await result.current.addRecord(input({ weight: 8 }));
      });
      const { id } = result.current.records[0];
      const persisted = localStorage.getItem(STORAGE_KEY);

      await expect(result.current.updateRecord(id, { weight: 60 })).rejects.toThrow(
        'Unrealistic measurement: weight over 50kg for infant'
      );

      expect(result.current.records[0].weight).toBe(8);
      expect(localStorage.getItem(STORAGE_KEY)).toBe(persisted);
    });

    it('rejects an unknown record id', async () => {
      const { result } = renderHook(() => useGrowthTracking(CHILD_ID, null));

      await expect(result.current.updateRecord('missing', { weight: 8 })).rejects.toThrow(
        'Record not found'
      );
    });

    it('rejects when no child is selected', async () => {
      const { result } = renderHook(() => useGrowthTracking(null, null));

      await expect(result.current.updateRecord('any', { weight: 8 })).rejects.toThrow(
        'No child selected'
      );
    });
  });

  describe('deleteRecord', () => {
    it('drops the record from state and from LocalStorage', async () => {
      const { result } = renderHook(() => useGrowthTracking(CHILD_ID, null));
      await act(async () => {
        await result.current.addRecord(input({ date: '2026-04-01', weight: 6.9 }));
      });
      await act(async () => {
        await result.current.addRecord(input({ date: '2026-07-01', weight: 8 }));
      });
      const [newest, oldest] = result.current.records;

      await act(async () => {
        await result.current.deleteRecord(newest.id);
      });

      expect(result.current.records.map((r) => r.id)).toEqual([oldest.id]);
      expect(readStorage().map((r) => r.id)).toEqual([oldest.id]);
    });

    it('leaves the list intact for an unknown record id', async () => {
      const { result } = renderHook(() => useGrowthTracking(CHILD_ID, null));
      await act(async () => {
        await result.current.addRecord(input({ weight: 8 }));
      });
      const before = result.current.records;

      await act(async () => {
        await result.current.deleteRecord('missing');
      });

      expect(result.current.records).toEqual(before);
      expect(readStorage()).toEqual(before);
    });

    it('rejects when no child is selected', async () => {
      const { result } = renderHook(() => useGrowthTracking(null, null));

      await expect(result.current.deleteRecord('any')).rejects.toThrow('No child selected');
    });
  });
});
