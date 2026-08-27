import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { DailyLog, DiaperData, FeedingData, SleepData } from '../types';
import {
  sortLogsByTime,
  filterLogsByDate,
  getTodayLogs,
  getRecentLogs,
  calculateSleepDuration,
  calculateDailySummary,
  formatTime,
  formatDate,
  formatDuration,
  getFeedingTypeLabel,
  getDiaperTypeLabel,
  getConsistencyLabel,
} from './logHelpers';

/** Frozen "now" used by every clock-dependent assertion. */
const NOW = '2026-06-15T08:00:00.000Z';
const MINUTE = 60 * 1000;
const DAY_MINUTES = 24 * 60;

/** ISO timestamp offset from NOW by `minutes` (negative = in the past). */
const at = (minutes: number): string =>
  new Date(Date.parse(NOW) + minutes * MINUTE).toISOString();

const makeLog = (
  id: string,
  type: DailyLog['type'],
  timestamp: string,
  data: DailyLog['data']
): DailyLog => ({
  id,
  childId: 'child-1',
  type,
  timestamp,
  data,
  createdAt: timestamp,
});

const feedingLog = (
  id: string,
  timestamp: string,
  data: Partial<FeedingData> = {}
): DailyLog =>
  makeLog(id, 'feeding', timestamp, { feedingType: 'formula', ...data } as FeedingData);

const sleepLog = (
  id: string,
  timestamp: string,
  data: Partial<SleepData> = {}
): DailyLog =>
  makeLog(id, 'sleep', timestamp, { startTime: timestamp, ...data } as SleepData);

const diaperLog = (
  id: string,
  timestamp: string,
  type: DiaperData['type'],
  consistency?: DiaperData['consistency']
): DailyLog => makeLog(id, 'diaper', timestamp, { type, consistency } as DiaperData);

describe('logHelpers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(NOW));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('sortLogsByTime', () => {
    it('orders logs newest first', () => {
      const logs = [
        feedingLog('a', '2026-06-15T03:00:00.000Z'),
        feedingLog('b', '2026-06-15T09:00:00.000Z'),
        feedingLog('c', '2026-06-15T06:00:00.000Z'),
      ];

      expect(sortLogsByTime(logs).map(l => l.id)).toEqual(['b', 'c', 'a']);
    });

    it('returns a new array and leaves the input untouched', () => {
      const logs = [
        feedingLog('old', '2026-06-14T00:00:00.000Z'),
        feedingLog('new', '2026-06-15T00:00:00.000Z'),
      ];

      const sorted = sortLogsByTime(logs);

      expect(sorted).not.toBe(logs);
      expect(logs.map(l => l.id)).toEqual(['old', 'new']);
      expect(sorted.map(l => l.id)).toEqual(['new', 'old']);
    });

    it('keeps the original relative order of identical timestamps', () => {
      const sameMoment = '2026-06-15T05:00:00.000Z';
      const logs = [
        feedingLog('first', sameMoment),
        feedingLog('second', sameMoment),
        feedingLog('third', sameMoment),
      ];

      expect(sortLogsByTime(logs).map(l => l.id)).toEqual(['first', 'second', 'third']);
    });

    it('handles an empty list', () => {
      expect(sortLogsByTime([])).toEqual([]);
    });
  });

  describe('filterLogsByDate', () => {
    it('keeps only logs whose timestamp falls on the requested date', () => {
      // 時間戳一律以台灣本地時間書寫（+08:00），因為分桶依的是本地日曆日。
      const logs = [
        feedingLog('yesterday', '2026-06-14T23:00:00.000+08:00'),
        feedingLog('target-early', '2026-06-15T00:00:00.000+08:00'),
        feedingLog('target-late', '2026-06-15T22:15:00.000+08:00'),
        feedingLog('tomorrow', '2026-06-16T01:00:00.000+08:00'),
      ];

      expect(filterLogsByDate(logs, '2026-06-15').map(l => l.id)).toEqual([
        'target-early',
        'target-late',
      ]);
    });

    it('buckets by local calendar day, so the day boundary is exactly 00:00+08:00', () => {
      // 這兩個瞬間只差 1 毫秒，卻分屬不同的本地日期。兩者的 UTC 日期都是
      // 06-15（15:59:59.999Z 與 16:00:00.000Z），所以舊的 UTC 分桶會把它們
      // 併成同一天——這正是本測試要擋住的迴歸。
      const logs = [
        feedingLog('last-ms-of-day', '2026-06-15T23:59:59.999+08:00'),
        feedingLog('first-ms-of-next-day', '2026-06-16T00:00:00.000+08:00'),
      ];

      expect(filterLogsByDate(logs, '2026-06-15').map(l => l.id)).toEqual([
        'last-ms-of-day',
      ]);
      expect(filterLogsByDate(logs, '2026-06-16').map(l => l.id)).toEqual([
        'first-ms-of-next-day',
      ]);
    });

    it('returns an empty list when no log matches', () => {
      const logs = [feedingLog('a', '2026-06-15T10:00:00.000Z')];

      expect(filterLogsByDate(logs, '2026-01-01')).toEqual([]);
    });
  });

  describe('getTodayLogs', () => {
    it('returns only logs from the current local calendar day', () => {
      // 凍結的 NOW 是 2026-06-15T08:00Z，在台灣是 06-15 16:00，
      // 所以「今天」是本地 06-15 00:00 起、06-16 00:00 止（不含）。
      const logs = [
        feedingLog('today', at(-60)),
        feedingLog('two-days-ago', at(-2 * DAY_MINUTES)),
        sleepLog('also-today', at(-30)),
        // 邊界：本地日的最後一毫秒與次日的第一毫秒。
        feedingLog('last-ms-of-today', '2026-06-15T23:59:59.999+08:00'),
        feedingLog('first-ms-of-tomorrow', '2026-06-16T00:00:00.000+08:00'),
        // 半夜餵奶：UTC 日期是 06-14，但對台灣使用者就是今天。
        feedingLog('small-hours-of-today', '2026-06-15T03:00:00.000+08:00'),
      ];

      expect(getTodayLogs(logs).map(l => l.id)).toEqual([
        'today',
        'also-today',
        'last-ms-of-today',
        'small-hours-of-today',
      ]);
    });
  });

  describe('getRecentLogs', () => {
    it('keeps logs at or after the cutoff and drops older ones', () => {
      const logs = [
        feedingLog('now', at(0)),
        feedingLog('one-day-ago', at(-DAY_MINUTES)),
        feedingLog('exactly-on-cutoff', at(-7 * DAY_MINUTES)),
        feedingLog('one-minute-before-cutoff', at(-7 * DAY_MINUTES - 1)),
        feedingLog('a-month-ago', at(-30 * DAY_MINUTES)),
      ];

      expect(getRecentLogs(logs, 7).map(l => l.id)).toEqual([
        'now',
        'one-day-ago',
        'exactly-on-cutoff',
      ]);
    });

    it('has no upper bound, so future logs are always kept', () => {
      const logs = [
        feedingLog('future', at(5 * DAY_MINUTES)),
        feedingLog('ancient', at(-90 * DAY_MINUTES)),
      ];

      expect(getRecentLogs(logs, 7).map(l => l.id)).toEqual(['future']);
    });

    it('with days = 0 keeps only logs at or after the current instant', () => {
      const logs = [
        feedingLog('one-minute-ago', at(-1)),
        feedingLog('now', at(0)),
        feedingLog('in-one-minute', at(1)),
      ];

      expect(getRecentLogs(logs, 0).map(l => l.id)).toEqual(['now', 'in-one-minute']);
    });

    it('preserves the incoming order rather than sorting', () => {
      const logs = [
        feedingLog('older', at(-2 * DAY_MINUTES)),
        feedingLog('newer', at(-10)),
      ];

      expect(getRecentLogs(logs, 7).map(l => l.id)).toEqual(['older', 'newer']);
    });
  });

  describe('calculateSleepDuration', () => {
    it('returns the elapsed minutes between startTime and endTime', () => {
      const duration = calculateSleepDuration({
        startTime: '2026-06-15T22:00:00.000Z',
        endTime: '2026-06-15T23:30:00.000Z',
      });

      expect(duration).toBe(90);
    });

    it('returns undefined while the baby is still sleeping (no endTime)', () => {
      expect(
        calculateSleepDuration({ startTime: '2026-06-15T22:00:00.000Z' })
      ).toBeUndefined();
    });

    it('rounds partial minutes to the nearest whole minute', () => {
      // 100 seconds => 1.667 minutes => 2
      expect(
        calculateSleepDuration({
          startTime: '2026-06-15T22:00:00.000Z',
          endTime: '2026-06-15T22:01:40.000Z',
        })
      ).toBe(2);
    });

    it('returns 0 (not undefined) for a zero-length session', () => {
      expect(
        calculateSleepDuration({
          startTime: '2026-06-15T22:00:00.000Z',
          endTime: '2026-06-15T22:00:00.000Z',
        })
      ).toBe(0);
    });

    it('does not clamp an endTime that precedes startTime', () => {
      expect(
        calculateSleepDuration({
          startTime: '2026-06-15T22:00:00.000Z',
          endTime: '2026-06-15T21:30:00.000Z',
        })
      ).toBe(-30);
    });
  });

  describe('calculateDailySummary', () => {
    it('aggregates feeding, sleep and diaper logs for the requested date', () => {
      const logs = [
        // Feeding: 3 logs on target date, 120 + (no amount) + 90 = 210ml
        feedingLog('f1', '2026-06-15T01:00:00.000Z', { amount: 120 }),
        feedingLog('f2', '2026-06-15T04:00:00.000Z', { feedingType: 'breast_left' }),
        feedingLog('f3', '2026-06-15T07:00:00.000Z', { amount: 90 }),
        // Sleep: explicit duration 45 + derived 90 + ongoing 0 = 135 minutes
        sleepLog('s1', '2026-06-15T02:00:00.000Z', { duration: 45 }),
        sleepLog('s2', '2026-06-15T05:00:00.000Z', {
          startTime: '2026-06-15T05:00:00.000Z',
          endTime: '2026-06-15T06:30:00.000Z',
        }),
        sleepLog('s3', '2026-06-15T09:00:00.000Z'),
        // Diaper: 3 logs => pee 2 (pee + both), poop 2 (poop + both)
        diaperLog('d1', '2026-06-15T03:00:00.000Z', 'pee'),
        diaperLog('d2', '2026-06-15T08:00:00.000Z', 'poop', 'soft'),
        diaperLog('d3', '2026-06-15T10:00:00.000Z', 'both'),
        // Different day => ignored entirely
        feedingLog('other-day', '2026-06-14T12:00:00.000Z', { amount: 500 }),
        diaperLog('other-day-diaper', '2026-06-16T00:30:00.000Z', 'both'),
      ];

      expect(calculateDailySummary(logs, '2026-06-15')).toEqual({
        date: '2026-06-15',
        feedingCount: 3,
        totalFeedingAmount: 210,
        sleepCount: 3,
        totalSleepDuration: 135,
        diaperCount: 3,
        poopCount: 2,
        peeCount: 2,
      });
    });

    it('derives the sleep duration when the stored duration is 0', () => {
      const logs = [
        sleepLog('s1', '2026-06-15T05:00:00.000Z', {
          duration: 0,
          startTime: '2026-06-15T05:00:00.000Z',
          endTime: '2026-06-15T05:30:00.000Z',
        }),
      ];

      const summary = calculateDailySummary(logs, '2026-06-15');

      expect(summary.sleepCount).toBe(1);
      expect(summary.totalSleepDuration).toBe(30);
    });

    it('counts an ongoing sleep session but adds no duration', () => {
      const logs = [sleepLog('s1', '2026-06-15T05:00:00.000Z')];

      const summary = calculateDailySummary(logs, '2026-06-15');

      expect(summary.sleepCount).toBe(1);
      expect(summary.totalSleepDuration).toBe(0);
    });

    it('returns an all-zero summary for a date with no logs', () => {
      expect(calculateDailySummary([], '2026-03-01')).toEqual({
        date: '2026-03-01',
        feedingCount: 0,
        totalFeedingAmount: 0,
        sleepCount: 0,
        totalSleepDuration: 0,
        diaperCount: 0,
        poopCount: 0,
        peeCount: 0,
      });
    });

    it("defaults to today's local calendar date when no date is given", () => {
      const logs = [
        feedingLog('today', at(-60), { amount: 150 }),
        feedingLog('last-week', at(-7 * DAY_MINUTES), { amount: 999 }),
        // 半夜 03:00 的餵奶：UTC 日期是 06-14，本地日期是 06-15。舊的 UTC
        // 預設值會把它漏掉，早上起來看到的當日總量就少一餐。
        feedingLog('small-hours', '2026-06-15T03:00:00.000+08:00', { amount: 90 }),
      ];

      const summary = calculateDailySummary(logs);

      expect(summary.date).toBe('2026-06-15');
      expect(summary.feedingCount).toBe(2);
      expect(summary.totalFeedingAmount).toBe(240);
    });
  });

  describe('formatDuration', () => {
    it('renders sub-hour durations in minutes', () => {
      expect(formatDuration(0)).toBe('0分鐘');
      expect(formatDuration(30)).toBe('30分鐘');
      expect(formatDuration(59)).toBe('59分鐘');
    });

    it('renders whole hours without a decimal part', () => {
      expect(formatDuration(60)).toBe('1小時');
      expect(formatDuration(120)).toBe('2小時');
      expect(formatDuration(600)).toBe('10小時');
    });

    it('renders a partial hour as hours and minutes', () => {
      expect(formatDuration(90)).toBe('1小時30分鐘');
      expect(formatDuration(75)).toBe('1小時15分鐘');
      expect(formatDuration(65)).toBe('1小時5分鐘');
      expect(formatDuration(210)).toBe('3小時30分鐘');
    });
  });

  describe('formatTime', () => {
    it('formats an instant as zero-padded 24-hour HH:MM', () => {
      expect(formatTime('2026-06-15T12:34:00.000Z')).toMatch(/^\d{2}:\d{2}$/);
      expect(formatTime('2026-06-15T00:05:00.000Z')).toMatch(/^\d{2}:\d{2}$/);
    });

    it('is stable for the same instant and differs for different instants', () => {
      const instant = '2026-06-15T12:34:00.000Z';

      expect(formatTime(instant)).toBe(formatTime(instant));
      expect(formatTime(instant)).not.toBe(formatTime('2026-06-15T13:34:00.000Z'));
    });
  });

  describe('formatDate', () => {
    it('formats an instant as a slash-separated numeric date', () => {
      const formatted = formatDate('2026-06-15T12:00:00.000Z');

      expect(formatted).toMatch(/^\d{2,4}\/\d{2}\/\d{2,4}$/);
      expect(formatted).toContain('2026');
    });

    it('produces different output for instants a day apart', () => {
      expect(formatDate('2026-06-15T12:00:00.000Z')).not.toBe(
        formatDate('2026-06-16T12:00:00.000Z')
      );
    });
  });

  describe('getFeedingTypeLabel', () => {
    it('maps every feeding type to its Chinese label', () => {
      expect(getFeedingTypeLabel('breast_left')).toBe('母乳（左）');
      expect(getFeedingTypeLabel('breast_right')).toBe('母乳（右）');
      expect(getFeedingTypeLabel('breast_both')).toBe('母乳（兩邊）');
      expect(getFeedingTypeLabel('formula')).toBe('配方奶');
      expect(getFeedingTypeLabel('solid')).toBe('副食品');
    });

    it('has no fallback for an unknown type', () => {
      expect(
        getFeedingTypeLabel('bottle' as FeedingData['feedingType'])
      ).toBeUndefined();
    });
  });

  describe('getDiaperTypeLabel', () => {
    it('maps every diaper type to its Chinese label', () => {
      expect(getDiaperTypeLabel('pee')).toBe('小便');
      expect(getDiaperTypeLabel('poop')).toBe('大便');
      expect(getDiaperTypeLabel('both')).toBe('大小便');
    });

    it('has no fallback for an unknown type', () => {
      expect(getDiaperTypeLabel('dry' as DiaperData['type'])).toBeUndefined();
    });
  });

  describe('getConsistencyLabel', () => {
    it('maps every consistency to its Chinese label', () => {
      expect(getConsistencyLabel('normal')).toBe('正常');
      expect(getConsistencyLabel('soft')).toBe('稀');
      expect(getConsistencyLabel('hard')).toBe('硬');
    });

    it('returns an empty string when consistency is absent', () => {
      expect(getConsistencyLabel(undefined)).toBe('');
      expect(getConsistencyLabel()).toBe('');
    });
  });
});
