import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { DailyLog, GrowthRecord, DiaperData } from '../types';
import type { WeeklyReport } from './reportGenerator';
import {
  calculateScores,
  generateSummaryText,
  generateWeeklyReport,
  generateMonthlyReport,
} from './reportGenerator';

/**
 * The generator derives its window from `new Date()`, so the clock is frozen.
 * 12:00:00Z is chosen deliberately: `getDateNDaysAgo` shifts the *local* date but
 * formats with `toISOString()`, and a midday-UTC anchor keeps both interpretations
 * on the same calendar day for every real timezone offset (-12h..+14h).
 */
const FROZEN_NOW = new Date('2026-06-15T12:00:00Z');

// Oldest -> newest, i.e. getDateNDaysAgo(6) .. getDateNDaysAgo(0)
const WEEK_DATES = [
  '2026-06-09',
  '2026-06-10',
  '2026-06-11',
  '2026-06-12',
  '2026-06-13',
  '2026-06-14',
  '2026-06-15',
];

describe('reportGenerator', () => {
  let logSeq = 0;

  beforeEach(() => {
    logSeq = 0;
    vi.useFakeTimers();
    vi.setSystemTime(FROZEN_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const feedingLog = (date: string, time: string, amount: number): DailyLog => {
    const timestamp = `${date}T${time}Z`;
    return {
      id: `log_${++logSeq}`,
      childId: 'child-1',
      type: 'feeding',
      timestamp,
      data: { feedingType: 'formula', amount },
      createdAt: timestamp,
    };
  };

  const sleepLog = (date: string, durationMinutes: number, nightWakings?: number): DailyLog => {
    const start = new Date(`${date}T20:00:00Z`);
    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
    return {
      id: `log_${++logSeq}`,
      childId: 'child-1',
      type: 'sleep',
      timestamp: start.toISOString(),
      data: {
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        duration: durationMinutes,
        nightWakings,
      },
      createdAt: start.toISOString(),
    };
  };

  const diaperLog = (
    date: string,
    type: DiaperData['type'],
    consistency?: DiaperData['consistency']
  ): DailyLog => {
    const timestamp = `${date}T09:00:00Z`;
    return {
      id: `log_${++logSeq}`,
      childId: 'child-1',
      type: 'diaper',
      timestamp,
      data: { type, consistency },
      createdAt: timestamp,
    };
  };

  const growthRecord = (
    date: string,
    weight: number,
    height: number,
    percentile: GrowthRecord['percentile'] = {}
  ): GrowthRecord => ({
    id: `growth_${date}`,
    childId: 'child-1',
    date,
    weight,
    height,
    percentile,
  });

  /**
   * Perfectly regular week: 2 x 120ml feeds, one 12h sleep with 1 night waking,
   * and one normal poop, on every one of the 7 in-window days.
   */
  const buildRegularWeek = (): DailyLog[] =>
    WEEK_DATES.flatMap(date => [
      feedingLog(date, '06:00:00', 120),
      feedingLog(date, '18:00:00', 120),
      sleepLog(date, 720, 1),
      diaperLog(date, 'poop', 'normal'),
    ]);

  describe('generateWeeklyReport - no data', () => {
    it('reports a 7-day window with zeroed sections and the no-data summary', () => {
      const report = generateWeeklyReport([], [], 4);

      expect(report.period).toEqual({ start: '2026-06-09', end: '2026-06-15' });

      expect(report.feeding.dailyAmounts).toEqual([0, 0, 0, 0, 0, 0, 0]);
      expect(report.feeding.avgDailyCount).toBe(0);
      expect(report.feeding.avgDailyAmount).toBe(0);
      // With no data every day ties at 0, so the first day scanned (the oldest) wins both.
      expect(report.feeding.maxDay).toEqual({ date: '2026-06-09', amount: 0 });
      expect(report.feeding.minDay).toEqual({ date: '2026-06-09', amount: 0 });

      expect(report.sleep.dailyDurations).toEqual([0, 0, 0, 0, 0, 0, 0]);
      expect(report.sleep.avgDailyHours).toBe(0);
      expect(report.sleep.longestContinuous).toBe(0);
      expect(report.sleep.nightWakingsTrend).toBe('stable');
      expect(report.sleep.recommendedHours).toBe(13); // 4 months -> "13-15 小時"

      expect(report.poop.dailyCounts).toEqual([0, 0, 0, 0, 0, 0, 0]);
      expect(report.poop.avgDailyCount).toBe(0);
      expect(report.poop.longestGap).toBe(0);
      expect(report.poop.consistencyDistribution).toEqual({});

      expect(report.growth).toBeUndefined();
      expect(report.summaryText).toBe('尚無足夠資料產生摘要，請持續記錄寶寶的日常。');
    });

    it('scores an empty week as vacuously regular feeding, partial sleep, and zero poop', () => {
      const { scores } = generateWeeklyReport([], [], 4);

      // No variance at all -> CV 0 -> full regularity credit.
      expect(scores.feeding).toEqual({ score: 100, label: '很棒！' });
      // meetingRatio 0 * 60 + consistency 100/100 * 40 = 40
      expect(scores.sleep).toEqual({ score: 40, label: '尚可' });
      // hasPoops = 0 zeroes the whole poop score
      expect(scores.poop).toEqual({ score: 0, label: '需注意' });
    });
  });

  describe('generateWeeklyReport - regular week', () => {
    it('aggregates per-day counts, amounts, durations and consistencies', () => {
      const report = generateWeeklyReport(buildRegularWeek(), [], 4);

      expect(report.feeding.dailyAmounts).toEqual([240, 240, 240, 240, 240, 240, 240]);
      expect(report.feeding.avgDailyCount).toBe(2);
      expect(report.feeding.avgDailyAmount).toBe(240);

      expect(report.sleep.dailyDurations).toEqual([12, 12, 12, 12, 12, 12, 12]);
      expect(report.sleep.avgDailyHours).toBe(12);
      expect(report.sleep.longestContinuous).toBe(720); // minutes, not hours
      expect(report.sleep.nightWakingsTrend).toBe('stable');

      expect(report.poop.dailyCounts).toEqual([1, 1, 1, 1, 1, 1, 1]);
      expect(report.poop.avgDailyCount).toBe(1);
      expect(report.poop.longestGap).toBe(24); // one poop per day at the same hour
      expect(report.poop.consistencyDistribution).toEqual({ normal: 7 });
    });

    it('scores a regular week highly and pro-rates sleep against the age recommendation', () => {
      const { scores } = generateWeeklyReport(buildRegularWeek(), [], 4);

      expect(scores.feeding).toEqual({ score: 100, label: '很棒！' });
      // min(12/13, 1) * 60 + 40 = 95.38 -> 95
      expect(scores.sleep).toEqual({ score: 95, label: '很棒！' });
      // 100 * 0.7 + 30 = 100
      expect(scores.poop).toEqual({ score: 100, label: '很棒！' });
    });

    it('summarises a regular week, flagging sleep just under the recommendation', () => {
      const report = generateWeeklyReport(buildRegularWeek(), [], 4);

      expect(report.summaryText).toBe(
        '餵奶量平均每日 240ml。睡眠時數平均 12 小時，略低於建議值，建議觀察作息。排便規律正常。'
      );
    });

    it('ignores logs outside the 7-day window but includes them over 30 days', () => {
      const stale = feedingLog('2026-06-05', '06:00:00', 999); // 10 days ago
      const logs = [...buildRegularWeek(), stale];

      const weekly = generateWeeklyReport(logs, [], 4);
      expect(weekly.feeding.dailyAmounts).toEqual([240, 240, 240, 240, 240, 240, 240]);
      expect(weekly.feeding.avgDailyAmount).toBe(240);
      expect(weekly.feeding.maxDay).toEqual({ date: '2026-06-09', amount: 240 });

      const monthly = generateMonthlyReport(logs, [], 4);
      // 2026-06-05 is 10 days ago -> index 29 - 10 = 19 in the oldest-first array
      expect(monthly.feeding.dailyAmounts[19]).toBe(999);
      // (7 * 240 + 999) / 30 = 89.3 -> 89
      expect(monthly.feeding.avgDailyAmount).toBe(89);
    });
  });

  describe('generateWeeklyReport - irregular week', () => {
    // Amounts ramp 200 -> 320 across the week, night wakings fall 4 -> 1,
    // and poops land only on days 1, 4 and 7.
    const buildIrregularWeek = (): DailyLog[] => {
      const amounts = [200, 220, 240, 260, 280, 300, 320];
      const wakings = [4, 4, 4, 1, 1, 1, 1];
      const logs: DailyLog[] = [];

      WEEK_DATES.forEach((date, i) => {
        logs.push(feedingLog(date, '06:00:00', amounts[i] / 2));
        logs.push(feedingLog(date, '18:00:00', amounts[i] / 2));
        logs.push(sleepLog(date, 780, wakings[i]));
      });

      logs.push(diaperLog('2026-06-09', 'poop', 'normal'));
      logs.push(diaperLog('2026-06-12', 'both', 'soft'));
      logs.push(diaperLog('2026-06-15', 'poop', 'hard'));

      return logs;
    };

    it('identifies the heaviest and lightest feeding days', () => {
      const report = generateWeeklyReport(buildIrregularWeek(), [], 4);

      expect(report.feeding.dailyAmounts).toEqual([200, 220, 240, 260, 280, 300, 320]);
      expect(report.feeding.avgDailyAmount).toBe(260);
      expect(report.feeding.avgDailyCount).toBe(2);
      expect(report.feeding.maxDay).toEqual({ date: '2026-06-15', amount: 320 });
      expect(report.feeding.minDay).toEqual({ date: '2026-06-09', amount: 200 });
    });

    it('detects a falling night-waking trend and the longest poop gap', () => {
      const report = generateWeeklyReport(buildIrregularWeek(), [], 4);

      expect(report.sleep.nightWakingsTrend).toBe('decreasing'); // 4 -> 1 is a 75% drop
      expect(report.poop.dailyCounts).toEqual([1, 0, 0, 1, 0, 0, 1]);
      expect(report.poop.avgDailyCount).toBe(0.4); // 3 / 7 = 0.428... -> 0.4
      expect(report.poop.longestGap).toBe(72); // three days between poops
      // 'both' counts as a poop and contributes its consistency
      expect(report.poop.consistencyDistribution).toEqual({ normal: 1, soft: 1, hard: 1 });
    });

    it('penalises feeding variance and sparse, irregular poops', () => {
      const { scores } = generateWeeklyReport(buildIrregularWeek(), [], 4);

      // amount CV = 40/260 = 0.1538, count CV = 0 -> avg 0.0769 -> 100 - 7.69 = 92.31
      expect(scores.feeding).toEqual({ score: 92, label: '很棒！' });
      // 13h/day exactly meets the 13h recommendation, with zero variance
      expect(scores.sleep).toEqual({ score: 100, label: '很棒！' });
      // poop CV = sqrt(23/7)... > 1 -> regularity clamps to 0, leaving the flat 30
      expect(scores.poop).toEqual({ score: 30, label: '需注意' });
    });

    it('summarises the long poop gap and on-target sleep', () => {
      const report = generateWeeklyReport(buildIrregularWeek(), [], 4);

      expect(report.summaryText).toBe(
        '餵奶量平均每日 260ml。睡眠時數平均 13 小時，符合建議範圍。排便間隔最長達 72 小時，需留意。'
      );
    });
  });

  describe('generateMonthlyReport', () => {
    it('spans 30 days and dilutes a single active week across the window', () => {
      const report = generateMonthlyReport(buildRegularWeek(), [], 4);

      expect(report.period).toEqual({ start: '2026-05-17', end: '2026-06-15' });
      expect(report.feeding.dailyAmounts).toHaveLength(30);
      expect(report.feeding.dailyAmounts.slice(0, 23)).toEqual(Array(23).fill(0));
      expect(report.feeding.dailyAmounts.slice(23)).toEqual(Array(7).fill(240));
      expect(report.feeding.avgDailyAmount).toBe(56); // 1680 / 30
      expect(report.feeding.avgDailyCount).toBe(0.5); // 14 / 30 = 0.466... -> 0.5
      // The first day scanned holds the 0 minimum; the max moves to the first active day.
      expect(report.feeding.maxDay).toEqual({ date: '2026-06-09', amount: 240 });
      expect(report.feeding.minDay).toEqual({ date: '2026-05-17', amount: 0 });

      expect(report.sleep.dailyDurations).toHaveLength(30);
      expect(report.sleep.avgDailyHours).toBe(2.8); // 84 / 30
      expect(report.sleep.longestContinuous).toBe(720);
      // Empty first half vs. a populated second half reads as rising wakings.
      expect(report.sleep.nightWakingsTrend).toBe('increasing');

      expect(report.poop.avgDailyCount).toBe(0.2); // 7 / 30 = 0.233... -> 0.2
      expect(report.poop.longestGap).toBe(24);
      expect(report.poop.consistencyDistribution).toEqual({ normal: 7 });
    });

    it('scores a mostly empty month poorly', () => {
      const { scores } = generateMonthlyReport(buildRegularWeek(), [], 4);

      // CV of a 7-of-30 indicator is sqrt(23/7) = 1.81 -> 100 - 181 clamps to 0
      expect(scores.feeding).toEqual({ score: 0, label: '需注意' });
      // min(2.8/13, 1) * 60 + 0 = 12.92 -> 13
      expect(scores.sleep).toEqual({ score: 13, label: '需注意' });
      expect(scores.poop).toEqual({ score: 30, label: '需注意' });
    });
  });

  describe('growth section', () => {
    it('omits growth when there are fewer than two records', () => {
      const report = generateWeeklyReport([], [growthRecord('2026-06-12', 6.2, 62.5)], 4);
      expect(report.growth).toBeUndefined();
    });

    it('omits growth when fewer than two records fall inside the window', () => {
      const records = [
        growthRecord('2026-05-20', 5.4, 58.0),
        growthRecord('2026-06-14', 6.55, 63.2),
      ];
      expect(generateWeeklyReport([], records, 4).growth).toBeUndefined();
      // The same pair is enough once the window widens to 30 days.
      expect(generateMonthlyReport([], records, 4).growth).toBeDefined();
    });

    it('reports rounded weight/height deltas and the latest percentiles', () => {
      const records = [
        growthRecord('2026-06-10', 6.2, 62.5, { weight: 45, height: 50 }),
        growthRecord('2026-06-14', 6.55, 63.2, { weight: 48, height: 52, headCircumference: 60 }),
      ];

      const report = generateWeeklyReport([], records, 4);

      expect(report.growth).toEqual({
        weightChange: 0.35, // 6.55 - 6.2, 2dp
        heightChange: 0.7, // 63.2 - 62.5, 1dp
        latestPercentiles: { weight: 48, height: 52, headCircumference: 60 },
      });
    });

    it('includes records exactly on the cutoff date and drops earlier ones', () => {
      const records = [
        growthRecord('2026-06-07', 1, 1, { weight: 1 }), // one day before the cutoff
        growthRecord('2026-06-08', 6.0, 61.0, { weight: 40 }), // cutoff = today - 7 days
        growthRecord('2026-06-14', 6.5, 62.0, { weight: 44 }),
      ];

      const report = generateWeeklyReport([], records, 4);

      expect(report.growth).toEqual({
        weightChange: 0.5,
        heightChange: 1,
        latestPercentiles: { weight: 44 },
      });
    });

    it('reports a zero delta when a bound is missing the measurement', () => {
      const partial: GrowthRecord = {
        id: 'growth-partial',
        childId: 'child-1',
        date: '2026-06-10',
        weight: 6.2,
        percentile: {},
      };
      const records = [partial, growthRecord('2026-06-14', 6.55, 63.2, { weight: 48 })];

      const report = generateWeeklyReport([], records, 4);

      expect(report.growth).toEqual({
        weightChange: 0.35,
        heightChange: 0, // first record has no height
        latestPercentiles: { weight: 48 },
      });
    });
  });

  describe('calculateScores', () => {
    const sleepEveryDay = (durationMinutes: number): DailyLog[] =>
      WEEK_DATES.map(date => sleepLog(date, durationMinutes));

    it('awards full sleep credit once the age recommendation is met', () => {
      // 24 months -> "12-13 小時" -> min 12; 12h/day meets it exactly.
      const scores = calculateScores(sleepEveryDay(720), 7, 24);
      expect(scores.sleep).toEqual({ score: 100, label: '很棒！' });
    });

    it('scales sleep down proportionally when short of the recommendation', () => {
      // 8h vs. the 13h recommendation: 8/13 * 60 + 40 = 76.92 -> 77
      const scores = calculateScores(sleepEveryDay(480), 7, 4);
      expect(scores.sleep).toEqual({ score: 77, label: '不錯' });
    });

    it('uses the newborn recommendation for infants under a month', () => {
      // 0 months -> "16-17 小時" -> min 16; 12h/day -> 12/16 * 60 + 40 = 85
      const scores = calculateScores(sleepEveryDay(720), 7, 0);
      expect(scores.sleep).toEqual({ score: 85, label: '很棒！' });
    });

    it('does not reward poop regularity when nothing was logged', () => {
      const scores = calculateScores(sleepEveryDay(720), 7, 4);
      expect(scores.poop).toEqual({ score: 0, label: '需注意' });
    });

    it('rewards a daily poop rhythm regardless of consistency labels', () => {
      const logs = WEEK_DATES.map(date => diaperLog(date, 'poop'));
      const scores = calculateScores(logs, 7, 4);
      expect(scores.poop).toEqual({ score: 100, label: '很棒！' });
    });

    it('ignores pee-only diaper logs when scoring poop', () => {
      const logs = WEEK_DATES.map(date => diaperLog(date, 'pee'));
      const scores = calculateScores(logs, 7, 4);
      expect(scores.poop).toEqual({ score: 0, label: '需注意' });
    });

    it('derives sleep duration from start/end when duration is absent', () => {
      // No precomputed `duration`, so calculateSleepDuration has to run.
      const logs: DailyLog[] = WEEK_DATES.map(date => {
        const start = new Date(`${date}T20:00:00Z`);
        const end = new Date(start.getTime() + 720 * 60 * 1000);
        return {
          id: `log_nodur_${date}`,
          childId: 'child-1',
          type: 'sleep',
          timestamp: start.toISOString(),
          data: { startTime: start.toISOString(), endTime: end.toISOString() },
          createdAt: start.toISOString(),
        };
      });

      const scores = calculateScores(logs, 7, 4);
      expect(scores.sleep).toEqual({ score: 95, label: '很棒！' });
    });
  });

  describe('generateSummaryText', () => {
    const baseReport = (overrides: Partial<WeeklyReport> = {}): WeeklyReport => ({
      period: { start: '2026-06-09', end: '2026-06-15' },
      scores: {
        feeding: { score: 0, label: '需注意' },
        sleep: { score: 0, label: '需注意' },
        poop: { score: 0, label: '需注意' },
      },
      feeding: {
        dailyAmounts: [],
        avgDailyCount: 0,
        avgDailyAmount: 0,
        maxDay: { date: '', amount: 0 },
        minDay: { date: '', amount: 0 },
      },
      sleep: {
        dailyDurations: [],
        avgDailyHours: 0,
        longestContinuous: 0,
        nightWakingsTrend: 'stable',
        recommendedHours: 13,
      },
      poop: {
        dailyCounts: [],
        avgDailyCount: 0,
        longestGap: 0,
        consistencyDistribution: {},
      },
      summaryText: '',
      ...overrides,
    });

    it('falls back to a prompt when nothing was recorded', () => {
      expect(generateSummaryText(baseReport())).toBe(
        '尚無足夠資料產生摘要，請持續記錄寶寶的日常。'
      );
    });

    it('falls back to feed count when no amount was recorded (breastfeeding)', () => {
      const report = baseReport({
        feeding: {
          ...baseReport().feeding,
          avgDailyCount: 6.5,
          avgDailyAmount: 0,
        },
      });

      expect(generateSummaryText(report)).toBe('平均每日餵奶 6.5 次。');
    });

    it('prefers amount over count when both are present', () => {
      const report = baseReport({
        feeding: {
          ...baseReport().feeding,
          avgDailyCount: 6.5,
          avgDailyAmount: 780,
        },
      });

      const text = generateSummaryText(report);
      expect(text).toBe('餵奶量平均每日 780ml。');
      expect(text).not.toContain('次');
    });

    it('rounds and flags poop gaps beyond 48 hours', () => {
      const report = baseReport({
        poop: { ...baseReport().poop, avgDailyCount: 0.3, longestGap: 72.6 },
      });

      expect(generateSummaryText(report)).toBe('排便間隔最長達 73 小時，需留意。');
    });

    it('treats a 48-hour gap as still regular', () => {
      const report = baseReport({
        poop: { ...baseReport().poop, avgDailyCount: 0.5, longestGap: 48 },
      });

      expect(generateSummaryText(report)).toBe('排便規律正常。');
    });

    it('joins every available section in order', () => {
      const report = baseReport({
        feeding: { ...baseReport().feeding, avgDailyCount: 5, avgDailyAmount: 600 },
        sleep: { ...baseReport().sleep, avgDailyHours: 14, recommendedHours: 13 },
        poop: { ...baseReport().poop, avgDailyCount: 2, longestGap: 12 },
      });

      expect(generateSummaryText(report)).toBe(
        '餵奶量平均每日 600ml。睡眠時數平均 14 小時，符合建議範圍。排便規律正常。'
      );
    });
  });
});
