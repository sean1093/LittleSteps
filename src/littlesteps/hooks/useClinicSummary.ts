import { useMemo } from 'react';
import type { ChildProfile, DailyLog, FeedingData, SleepData, DiaperData } from '../../types';
import { useGrowthTracking } from './useGrowthTracking';
import { getRecentLogs, calculateSleepDuration } from '../utils/logHelpers';
import { calculateAgeDisplay, calculateVaccineSummary } from '../../common/utils/summaryCalculator';
import { vaccineSchedules } from '../data/vaccines';
import { toLocalDateKey } from '../../common/utils/dateHelpers';

export interface ClinicSummaryData {
  // Basic info
  childName: string;
  birthday: string;
  gender?: string;
  ageDisplay: string;

  // Latest growth
  latestGrowth?: {
    date: string;
    weight?: number;
    height?: number;
    headCircumference?: number;
    percentile: { weight?: number; height?: number; headCircumference?: number };
  };

  // Recent 3 growth records
  recentGrowthRecords: Array<{
    date: string;
    weight?: number;
    height?: number;
    headCircumference?: number;
  }>;

  // Vaccine records
  administeredVaccines: Array<{
    name: string;
    dose: number;
    date?: string;
  }>;
  nextVaccine?: { name: string; timing: string; doseNumber: number };

  // 7-day daily summary
  weekSummary: {
    avgFeedingCount: number;
    avgFeedingAmount: number;
    avgSleepHours: number;
    longestSleep: number; // minutes
    avgPoopCount: number;
    lastPoopTime?: string;
  };

  generatedAt: string; // ISO timestamp
}

/**
 * Assembles data from various sources into a clinic-ready summary.
 */
export function useClinicSummary(
  currentChild: ChildProfile | undefined,
  dailyLogs: DailyLog[],
  user: { uid: string } | null
): { data: ClinicSummaryData | null; loading: boolean } {
  const { records: growthRecords, loading: growthLoading } = useGrowthTracking(
    currentChild?.id || null,
    user,
    currentChild?.gender,
    currentChild?.birthday
  );

  const data = useMemo<ClinicSummaryData | null>(() => {
    if (!currentChild) return null;

    // --- Basic info ---
    const ageDisplay = calculateAgeDisplay(currentChild.birthday);

    // --- Growth records (already sorted newest-first by the hook) ---
    const recentGrowthRecords = growthRecords.slice(0, 3).map((r) => ({
      date: r.date,
      weight: r.weight,
      height: r.height,
      headCircumference: r.headCircumference,
    }));

    const latestGrowth = growthRecords.length > 0
      ? {
          date: growthRecords[0].date,
          weight: growthRecords[0].weight,
          height: growthRecords[0].height,
          headCircumference: growthRecords[0].headCircumference,
          percentile: growthRecords[0].percentile,
        }
      : undefined;

    // --- Vaccine records ---
    const administeredVaccines: ClinicSummaryData['administeredVaccines'] = [];

    vaccineSchedules.forEach((vaccine) => {
      const progress = currentChild.vaccineProgress[vaccine.id];
      if (!progress) return;
      Object.entries(progress.doses).forEach(([doseNum, doseInfo]) => {
        if (doseInfo.administered) {
          administeredVaccines.push({
            name: vaccine.name,
            dose: Number(doseNum),
            date: doseInfo.administeredDate,
          });
        }
      });
    });

    // Sort administered vaccines by date (newest first), undated last
    administeredVaccines.sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return b.date.localeCompare(a.date);
    });

    const vaccineSummary = calculateVaccineSummary(currentChild.vaccineProgress);
    const nextVaccine = vaccineSummary.nextVaccine
      ? {
          name: vaccineSummary.nextVaccine.name,
          timing: vaccineSummary.nextVaccine.timing,
          doseNumber: vaccineSummary.nextVaccine.doseNumber,
        }
      : undefined;

    // --- 7-day daily summary ---
    const recentLogs = getRecentLogs(dailyLogs, 7);

    // Group logs by date to compute per-day stats then average
    const dayMap = new Map<
      string,
      { feedingCount: number; feedingAmount: number; sleepMinutes: number; poopCount: number }
    >();

    let longestSleep = 0;
    let lastPoopTime: string | undefined;

    recentLogs.forEach((log) => {
      const dateKey = toLocalDateKey(log.timestamp);
      if (!dayMap.has(dateKey)) {
        dayMap.set(dateKey, { feedingCount: 0, feedingAmount: 0, sleepMinutes: 0, poopCount: 0 });
      }
      const day = dayMap.get(dateKey)!;

      switch (log.type) {
        case 'feeding': {
          day.feedingCount++;
          const fd = log.data as FeedingData;
          day.feedingAmount += fd.amount || 0;
          break;
        }
        case 'sleep': {
          const sd = log.data as SleepData;
          const dur = sd.duration || calculateSleepDuration(sd) || 0;
          day.sleepMinutes += dur;
          if (dur > longestSleep) longestSleep = dur;
          break;
        }
        case 'diaper': {
          const dd = log.data as DiaperData;
          if (dd.type === 'poop' || dd.type === 'both') {
            day.poopCount++;
            if (!lastPoopTime || log.timestamp > lastPoopTime) {
              lastPoopTime = log.timestamp;
            }
          }
          break;
        }
      }
    });

    const numDays = Math.max(dayMap.size, 1);
    let totalFeedingCount = 0;
    let totalFeedingAmount = 0;
    let totalSleepMinutes = 0;
    let totalPoopCount = 0;

    dayMap.forEach((day) => {
      totalFeedingCount += day.feedingCount;
      totalFeedingAmount += day.feedingAmount;
      totalSleepMinutes += day.sleepMinutes;
      totalPoopCount += day.poopCount;
    });

    const weekSummary: ClinicSummaryData['weekSummary'] = {
      avgFeedingCount: Math.round((totalFeedingCount / numDays) * 10) / 10,
      avgFeedingAmount: Math.round(totalFeedingAmount / numDays),
      avgSleepHours: Math.round((totalSleepMinutes / numDays / 60) * 10) / 10,
      longestSleep,
      avgPoopCount: Math.round((totalPoopCount / numDays) * 10) / 10,
      lastPoopTime,
    };

    return {
      childName: currentChild.name,
      birthday: currentChild.birthday,
      gender: currentChild.gender,
      ageDisplay,
      latestGrowth,
      recentGrowthRecords,
      administeredVaccines,
      nextVaccine,
      weekSummary,
      generatedAt: new Date().toISOString(),
    };
  }, [currentChild, growthRecords, dailyLogs]);

  return { data, loading: growthLoading };
}
