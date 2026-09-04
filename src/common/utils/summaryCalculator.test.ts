import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import type { MilestoneProgress, VaccineProgress, VaccineSchedule } from '../../types';
import { milestones } from '../../littlesteps/data/milestones';
import { vaccineSchedules } from '../../littlesteps/data/vaccines';
import {
  calculateMilestoneSummary,
  calculateVaccineSummary,
  calculateAgeDisplay
} from './summaryCalculator';

type DoseProgress = VaccineProgress[string]['doses'];

describe('summaryCalculator', () => {
  describe('calculateMilestoneSummary', () => {
    // Expectations are derived from the real milestone catalogue so the suite
    // survives the data set growing.
    const TOTAL = milestones.length;

    /** Marks the first `count` catalogue milestones as achieved, without dates. */
    const achieveFirst = (count: number): MilestoneProgress => {
      const progress: MilestoneProgress = {};
      for (const milestone of milestones.slice(0, count)) {
        progress[milestone.id] = { achieved: true };
      }
      return progress;
    };

    /**
     * First achieved-count in 1..TOTAL-1 whose exact percentage has a
     * fractional part matching `predicate`, together with that percentage.
     */
    const fractionalCase = (predicate: (fraction: number) => boolean) => {
      for (let count = 1; count < TOTAL; count++) {
        const exact = (count / TOTAL) * 100;
        if (predicate(exact - Math.floor(exact))) return { count, exact };
      }
      throw new Error('milestone catalogue cannot produce such a fractional rate');
    };

    it('exposes the size of the milestone catalogue', () => {
      expect(TOTAL).toBeGreaterThan(0);
      expect(calculateMilestoneSummary({}).totalMilestones).toBe(TOTAL);
    });

    it('returns a zeroed summary for empty progress', () => {
      expect(calculateMilestoneSummary({})).toEqual({
        totalMilestones: TOTAL,
        achievedCount: 0,
        achievementRate: 0,
        recentAchievements: []
      });
    });

    it('counts only entries flagged as achieved', () => {
      const progress: MilestoneProgress = {
        [milestones[0].id]: { achieved: true },
        [milestones[1].id]: { achieved: false, achievedDate: '2026-01-01' },
        [milestones[2].id]: { achieved: true },
        [milestones[3].id]: { achieved: false }
      };

      const summary = calculateMilestoneSummary(progress);
      expect(summary.achievedCount).toBe(2);
      // A date on an un-achieved milestone must never leak into the highlights.
      expect(summary.recentAchievements).toEqual([]);
    });

    it('reports 100% once every catalogue milestone is achieved', () => {
      const summary = calculateMilestoneSummary(achieveFirst(TOTAL));
      expect(summary.achievedCount).toBe(TOTAL);
      expect(summary.achievementRate).toBe(100);
    });

    it('rounds the rate up when the exact percentage sits above the half point', () => {
      const { count, exact } = fractionalCase(fraction => fraction > 0.5);

      expect(calculateMilestoneSummary(achieveFirst(count)).achievementRate).toBe(
        Math.floor(exact) + 1
      );
    });

    it('rounds the rate down when the exact percentage sits below the half point', () => {
      const { count, exact } = fractionalCase(
        fraction => fraction > 0 && fraction < 0.5
      );

      expect(calculateMilestoneSummary(achieveFirst(count)).achievementRate).toBe(
        Math.floor(exact)
      );
    });

    it('always yields an integer rate between 0 and 100', () => {
      for (const count of [0, 1, Math.floor(TOTAL / 2), TOTAL]) {
        const { achievementRate } = calculateMilestoneSummary(achieveFirst(count));
        expect(Number.isInteger(achievementRate)).toBe(true);
        expect(achievementRate).toBeGreaterThanOrEqual(0);
        expect(achievementRate).toBeLessThanOrEqual(100);
      }
    });

    it('lists the three most recent achievements, newest first', () => {
      const [a, b, c, d, e] = milestones;
      const progress: MilestoneProgress = {
        [a.id]: { achieved: true, achievedDate: '2026-01-05' },
        [b.id]: { achieved: true, achievedDate: '2026-03-20' },
        [c.id]: { achieved: true, achievedDate: '2026-02-11' },
        [d.id]: { achieved: true, achievedDate: '2026-05-01' },
        [e.id]: { achieved: true, achievedDate: '2026-04-17' }
      };

      const summary = calculateMilestoneSummary(progress);

      expect(summary.achievedCount).toBe(5);
      expect(summary.recentAchievements).toEqual([
        { id: d.id, title: d.title, achievedDate: '2026-05-01' },
        { id: e.id, title: e.title, achievedDate: '2026-04-17' },
        { id: b.id, title: b.title, achievedDate: '2026-03-20' }
      ]);
    });

    it('skips achieved milestones that have no date while still counting them', () => {
      const [a, b, c, d] = milestones;
      const progress: MilestoneProgress = {
        [a.id]: { achieved: true },
        [b.id]: { achieved: true, achievedDate: '2026-02-02' },
        [c.id]: { achieved: true },
        [d.id]: { achieved: true, achievedDate: '2026-02-09' }
      };

      const summary = calculateMilestoneSummary(progress);

      expect(summary.achievedCount).toBe(4);
      expect(summary.recentAchievements.map(entry => entry.id)).toEqual([d.id, b.id]);
    });

    it('resolves titles from the catalogue', () => {
      const [first, second] = milestones;
      const progress: MilestoneProgress = {
        [first.id]: { achieved: true, achievedDate: '2026-02-01' },
        [second.id]: { achieved: true, achievedDate: '2026-03-01' }
      };

      const summary = calculateMilestoneSummary(progress);

      expect(first.title.length).toBeGreaterThan(0);
      expect(summary.recentAchievements).toEqual([
        { id: second.id, title: second.title, achievedDate: '2026-03-01' },
        { id: first.id, title: first.title, achievedDate: '2026-02-01' }
      ]);
    });

    it('ignores progress entries whose milestone no longer exists', () => {
      const progress: MilestoneProgress = {
        ...achieveFirst(TOTAL),
        'removed-milestone-1': { achieved: true, achievedDate: '2026-01-01' },
        'removed-milestone-2': { achieved: true },
      };

      const summary = calculateMilestoneSummary(progress);

      expect(summary.achievedCount).toBe(TOTAL);
      expect(summary.achievementRate).toBe(100);
    });

    it('never reports an achievement rate above 100 percent', () => {
      const progress: MilestoneProgress = { ...achieveFirst(TOTAL) };
      for (let i = 0; i < 10; i++) {
        progress[`ghost-${i}`] = { achieved: true };
      }

      expect(calculateMilestoneSummary(progress).achievementRate).toBe(100);
    });

    it('omits orphaned entries from recentAchievements', () => {
      const progress: MilestoneProgress = {
        // 日期刻意設為最新，確保未被過濾時一定會排進前三名。
        'removed-milestone-1': { achieved: true, achievedDate: '2099-01-01' },
        [milestones[0].id]: { achieved: true, achievedDate: '2026-01-01' },
      };

      const summary = calculateMilestoneSummary(progress);

      expect(summary.recentAchievements.map((a) => a.id)).toEqual([
        milestones[0].id,
      ]);
    });
  });

  describe('calculateVaccineSummary', () => {
    // 時程表的每一筆記錄就是「一劑」：`doses` 是整個系列的總劑數，同系列的每筆
    // 記錄都重複帶著同一個值（五合一四筆全寫 doses: 4），所以分母是記錄數，
    // 把 `doses` 加總會把 4 劑膨脹成 16 劑。
    const TOTAL_DOSES = vaccineSchedules.length;

    const byId = (id: string): VaccineSchedule => {
      const vaccine = vaccineSchedules.find(candidate => candidate.id === id);
      if (!vaccine) {
        throw new Error(`vaccine schedule no longer contains ${id}`);
      }
      return vaccine;
    };

    const HEPB_BIRTH = byId('hepb-birth');
    const RSV_MONTHLY_BIRTH = byId('rsv-monthly-birth');
    const RSV_BIRTH = byId('rsv-birth');
    const HEPB_1M = byId('hepb-1m');
    const PENTAVALENT_18M = byId('pentavalent-18m');

    /** 該筆記錄所代表的劑次，與接種頁寫入進度時使用的鍵一致。 */
    const doseOf = (vaccine: VaccineSchedule): number => vaccine.currentDose ?? 1;

    /** 將某筆記錄代表的那一劑標記為已接種。 */
    const administer = (
      vaccine: VaccineSchedule,
      administeredDate = '2026-01-01'
    ): VaccineProgress[string] => ({
      doses: { [doseOf(vaccine)]: { administered: true, administeredDate } }
    });

    /** 整份時程表都完成接種的進度。 */
    const administerAll = (): VaccineProgress =>
      Object.fromEntries(vaccineSchedules.map(vaccine => [vaccine.id, administer(vaccine)]));

    it('derives the denominator from the number of scheduled doses', () => {
      expect(TOTAL_DOSES).toBeGreaterThan(0);
      expect(calculateVaccineSummary({}).totalDoses).toBe(vaccineSchedules.length);
    });

    it('does not inflate the denominator with the series length of every record', () => {
      const summedSeriesLengths = vaccineSchedules.reduce((sum, vaccine) => sum + vaccine.doses, 0);
      // 資料集真的含多劑疫苗，否則這個測試不具鑑別力。
      expect(summedSeriesLengths).toBeGreaterThan(vaccineSchedules.length);
      expect(calculateVaccineSummary({}).totalDoses).not.toBe(summedSeriesLengths);
    });

    it('reports nothing administered for empty progress', () => {
      const summary = calculateVaccineSummary({});
      expect(summary.totalDoses).toBe(TOTAL_DOSES);
      expect(summary.administeredCount).toBe(0);
      expect(summary.administrationRate).toBe(0);
    });

    it('aggregates administered doses across records and ignores pending ones', () => {
      const progress: VaccineProgress = {
        [HEPB_BIRTH.id]: administer(HEPB_BIRTH, '2026-01-02'),
        [HEPB_1M.id]: administer(HEPB_1M, '2026-02-02'),
        [RSV_BIRTH.id]: { doses: { [doseOf(RSV_BIRTH)]: { administered: false } } }
      };

      const summary = calculateVaccineSummary(progress);

      expect(summary.administeredCount).toBe(2);
      expect(summary.totalDoses).toBe(TOTAL_DOSES);
      expect(summary.administrationRate).toBe(Math.round((2 / TOTAL_DOSES) * 100));
    });

    it('ignores dose numbers that belong to another record of the same series', () => {
      // hepb-1m 只承載第 2 劑，第 1 劑記在 hepb-birth。
      expect(doseOf(HEPB_1M)).toBe(2);
      const strayDoses: DoseProgress = { 1: { administered: true, administeredDate: '2026-02-02' } };

      const summary = calculateVaccineSummary({ [HEPB_1M.id]: { doses: strayDoses } });

      expect(summary.administeredCount).toBe(0);
      expect(summary.administrationRate).toBe(0);
    });

    it('ignores progress recorded against vaccines outside the schedule', () => {
      const progress: VaccineProgress = {
        'legacy-vaccine': {
          doses: {
            1: { administered: true, administeredDate: '2026-01-01' },
            2: { administered: true, administeredDate: '2026-02-01' }
          }
        }
      };

      const summary = calculateVaccineSummary(progress);
      expect(summary.administeredCount).toBe(0);
      expect(summary.administrationRate).toBe(0);
    });

    it('reaches 100% with no next vaccine once every scheduled dose is done', () => {
      const summary = calculateVaccineSummary(administerAll());

      expect(summary.administeredCount).toBe(TOTAL_DOSES);
      expect(summary.administrationRate).toBe(100);
      expect(summary.nextVaccine).toBeUndefined();
    });

    it('caps a record at one dose even when the whole series is logged under it', () => {
      const progress = administerAll();
      const seriesUnderOneRecord: DoseProgress = {};
      for (let doseNumber = 1; doseNumber <= HEPB_BIRTH.doses + 2; doseNumber++) {
        seriesUnderOneRecord[doseNumber] = { administered: true, administeredDate: '2026-01-01' };
      }
      progress[HEPB_BIRTH.id] = { doses: seriesUnderOneRecord };

      const summary = calculateVaccineSummary(progress);

      expect(summary.administeredCount).toBe(TOTAL_DOSES);
      expect(summary.administrationRate).toBe(100);
    });

    it('always yields an integer rate between 0 and 100', () => {
      for (let count = 0; count <= vaccineSchedules.length; count++) {
        const progress: VaccineProgress = Object.fromEntries(
          vaccineSchedules.slice(0, count).map(vaccine => [vaccine.id, administer(vaccine)])
        );

        const { administrationRate } = calculateVaccineSummary(progress);

        expect(Number.isInteger(administrationRate)).toBe(true);
        expect(administrationRate).toBeGreaterThanOrEqual(0);
        expect(administrationRate).toBeLessThanOrEqual(100);
      }
    });

    it('suggests the earliest first dose when nothing has been given', () => {
      // The birth dose really is the earliest slot in the schedule.
      expect(HEPB_BIRTH.ageInMonths).toBe(
        Math.min(...vaccineSchedules.map(vaccine => vaccine.ageInMonths ?? 999))
      );
      expect(calculateVaccineSummary({}).nextVaccine).toEqual({
        id: HEPB_BIRTH.id,
        name: HEPB_BIRTH.name,
        timing: HEPB_BIRTH.timing,
        doseNumber: 1
      });
    });

    it('moves on to the following record once the current dose is administered', () => {
      const progress: VaccineProgress = {
        [HEPB_BIRTH.id]: administer(HEPB_BIRTH)
      };

      expect(calculateVaccineSummary(progress).nextVaccine).toEqual({
        id: RSV_MONTHLY_BIRTH.id,
        name: RSV_MONTHLY_BIRTH.name,
        timing: RSV_MONTHLY_BIRTH.timing,
        doseNumber: 1
      });
    });

    it('continues a multi-dose series in the record that carries the next dose', () => {
      const progress: VaccineProgress = {
        [HEPB_BIRTH.id]: administer(HEPB_BIRTH),
        [RSV_MONTHLY_BIRTH.id]: administer(RSV_MONTHLY_BIRTH),
        [RSV_BIRTH.id]: administer(RSV_BIRTH)
      };

      expect(calculateVaccineSummary(progress).nextVaccine).toEqual({
        id: HEPB_1M.id,
        name: HEPB_1M.name,
        timing: HEPB_1M.timing,
        doseNumber: 2
      });
    });

    it('reports the dose number the pending record stands for, not dose 1', () => {
      expect(doseOf(PENTAVALENT_18M)).toBeGreaterThan(1);
      const progress: VaccineProgress = Object.fromEntries(
        vaccineSchedules
          .filter(vaccine => vaccine.id !== PENTAVALENT_18M.id)
          .map(vaccine => [vaccine.id, administer(vaccine)])
      );

      expect(calculateVaccineSummary(progress).nextVaccine).toEqual({
        id: PENTAVALENT_18M.id,
        name: PENTAVALENT_18M.name,
        timing: PENTAVALENT_18M.timing,
        doseNumber: doseOf(PENTAVALENT_18M)
      });
    });

    it('treats a recorded-but-not-administered dose as still pending', () => {
      const progress: VaccineProgress = {
        [HEPB_BIRTH.id]: { doses: { 1: { administered: false } } }
      };

      expect(calculateVaccineSummary(progress).nextVaccine).toMatchObject({
        id: HEPB_BIRTH.id,
        doseNumber: 1
      });
    });
  });

  describe('calculateAgeDisplay', () => {
    // The helper parses 'YYYY-MM-DD' birthdays as UTC but reads them back with
    // local getters, so the timezone is pinned to keep the calendar maths exact.
    const originalTz = process.env.TZ;

    beforeAll(() => {
      process.env.TZ = 'UTC';
    });

    afterAll(() => {
      if (originalTz === undefined) delete process.env.TZ;
      else process.env.TZ = originalTz;
    });

    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-06-15T08:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('shows days only during the first month', () => {
      expect(calculateAgeDisplay('2026-06-01')).toBe('14天');
    });

    it('shows zero days on the day of birth', () => {
      expect(calculateAgeDisplay('2026-06-15')).toBe('0天');
    });

    it('reports an unborn baby for a future birthday', () => {
      expect(calculateAgeDisplay('2026-06-20')).toBe('尚未出生');
    });

    it('omits the day part on an exact month boundary', () => {
      expect(calculateAgeDisplay('2026-03-15')).toBe('3個月');
    });

    it('appends the leftover days below one year', () => {
      expect(calculateAgeDisplay('2026-03-10')).toBe('3個月又5天');
    });

    it('borrows days from the previous month when the day of month is not reached', () => {
      // 15 - 20 = -5 days, so a month is given back and May's 31 days added.
      expect(calculateAgeDisplay('2026-03-20')).toBe('2個月又26天');
    });

    it('keeps counting in months right up to the twelfth', () => {
      expect(calculateAgeDisplay('2025-07-15')).toBe('11個月');
      expect(calculateAgeDisplay('2025-06-20')).toBe('11個月又26天');
    });

    it('switches to years at 12 months and drops the day remainder', () => {
      expect(calculateAgeDisplay('2025-06-15')).toBe('1歲');
      expect(calculateAgeDisplay('2025-06-10')).toBe('1歲');
    });

    it('shows years and months for toddlers', () => {
      expect(calculateAgeDisplay('2025-01-15')).toBe('1歲5個月');
      expect(calculateAgeDisplay('2024-03-15')).toBe('2歲3個月');
    });

    it('follows the mocked clock rather than the real one', () => {
      const before = calculateAgeDisplay('2026-03-15');
      vi.setSystemTime(new Date('2026-07-15T08:00:00Z'));

      expect(before).toBe('3個月');
      expect(calculateAgeDisplay('2026-03-15')).toBe('4個月');
    });
  });
});
