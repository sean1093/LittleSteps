import { useMemo } from 'react';
import type { ChildProfile, DailyLog, FeedingData, SleepData, DiaperData } from '../../types';
import { useGrowthTracking } from './useGrowthTracking';
import { getRecentLogs, calculateSleepDuration } from '../utils/logHelpers';
import { calculateAgeDisplay, calculateVaccineSummary } from '../../common/utils/summaryCalculator';
import { vaccineSchedules } from '../data/vaccines';
import { careTaskTemplates } from '../../littleexplorer/data/careTasks';
import { prenatalCheckupSchedule } from '../../littlebloom/data/prenatalCheckups';
import { buildHealthTimeline, type HealthEvent } from '../../common/health/healthTimeline';
import {
  formatDate,
  formatDuration,
  formatTime,
  toLocalDateKey,
} from '../../common/utils/dateHelpers';

export interface ClinicSummaryData {
  // Basic info
  childName: string;
  birthday: string;
  gender?: string;
  ageDisplay: string;

  /**
   * 產檢、疫苗、成長、兒童健檢併成的一條時間軸。
   *
   * 這份摘要原本只涵蓋四種形狀裡的兩種（成長與疫苗），缺產檢與兒童健檢——
   * 而它是要拿去給醫師看的東西，斷在出生那一刻。
   */
  healthTimeline: HealthEvent[];

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
    /**
     * 每個平均各有自己的分母：有記那一項的天數。
     *
     * 共用一個「有任何記錄的天數」會稀釋掉記得比較少的那一項——每天記餵奶、
     * 一週只記兩次睡眠的家長，睡眠平均會被除以七天，變成三分之一，然後這份
     * 文件被拿去給小兒科醫師看。分母不同就不能共用。
     */
    feedingDays: number;
    sleepDays: number;
    diaperDays: number;
    /** 有任何一項記錄的天數，用來說明整段摘要的樣本大小 */
    loggedDays: number;
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
    currentChild ?? undefined,
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

    // Firebase 不存空物件，所以剛建立、還沒勾過任何一劑的孩子讀回來
    // 根本沒有 vaccineProgress 這個欄位——型別說必填，線上資料說沒有。
    const vaccineProgress = currentChild.vaccineProgress ?? {};

    vaccineSchedules.forEach((vaccine) => {
      const progress = vaccineProgress[vaccine.id];
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

    const vaccineSummary = calculateVaccineSummary(vaccineProgress);
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
      {
        feedingCount: number;
        feedingAmount: number;
        sleepMinutes: number;
        poopCount: number;
        hasFeeding: boolean;
        hasSleep: boolean;
        hasDiaper: boolean;
      }
    >();

    let longestSleep = 0;
    let lastPoopTime: string | undefined;

    recentLogs.forEach((log) => {
      const dateKey = toLocalDateKey(log.timestamp);
      if (!dayMap.has(dateKey)) {
        dayMap.set(dateKey, {
          feedingCount: 0,
          feedingAmount: 0,
          sleepMinutes: 0,
          poopCount: 0,
          hasFeeding: false,
          hasSleep: false,
          hasDiaper: false,
        });
      }
      const day = dayMap.get(dateKey)!;

      switch (log.type) {
        case 'feeding': {
          day.hasFeeding = true;
          day.feedingCount++;
          const fd = log.data as FeedingData;
          day.feedingAmount += fd.amount || 0;
          break;
        }
        case 'sleep': {
          day.hasSleep = true;
          const sd = log.data as SleepData;
          const dur = sd.duration || calculateSleepDuration(sd) || 0;
          day.sleepMinutes += dur;
          if (dur > longestSleep) longestSleep = dur;
          break;
        }
        case 'diaper': {
          day.hasDiaper = true;
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

    let feedingDays = 0;
    let sleepDays = 0;
    let diaperDays = 0;
    let totalFeedingCount = 0;
    let totalFeedingAmount = 0;
    let totalSleepMinutes = 0;
    let totalPoopCount = 0;

    dayMap.forEach((day) => {
      if (day.hasFeeding) {
        feedingDays += 1;
        totalFeedingCount += day.feedingCount;
        totalFeedingAmount += day.feedingAmount;
      }
      if (day.hasSleep) {
        sleepDays += 1;
        totalSleepMinutes += day.sleepMinutes;
      }
      // 只記了小便的一天也是觀察：那天確實沒有大便，分母要算它。
      if (day.hasDiaper) {
        diaperDays += 1;
        totalPoopCount += day.poopCount;
      }
    });

    const weekSummary: ClinicSummaryData['weekSummary'] = {
      avgFeedingCount:
        feedingDays > 0 ? Math.round((totalFeedingCount / feedingDays) * 10) / 10 : 0,
      avgFeedingAmount: feedingDays > 0 ? Math.round(totalFeedingAmount / feedingDays) : 0,
      avgSleepHours:
        sleepDays > 0 ? Math.round((totalSleepMinutes / sleepDays / 60) * 10) / 10 : 0,
      longestSleep,
      avgPoopCount: diaperDays > 0 ? Math.round((totalPoopCount / diaperDays) * 10) / 10 : 0,
      lastPoopTime,
      feedingDays,
      sleepDays,
      diaperDays,
      loggedDays: dayMap.size,
    };

    return {
      healthTimeline: buildHealthTimeline({
        child: currentChild,
        growthRecords,
        vaccineSchedules,
        careTaskTemplates,
        prenatalTemplates: prenatalCheckupSchedule,
      }),
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

export function genderText(gender?: string): string {
  if (gender === 'male') return '男';
  if (gender === 'female') return '女';
  return '未設定';
}

/** 沒有性別就算不出百分位，所以這個括號常常是空的 */
function percentileText(value?: number): string {
  return value === undefined ? '' : `（P${Math.round(value)}）`;
}

/**
 * 把整份摘要攤成純文字，好經由系統分享面板或剪貼簿交出去。
 *
 * 這一頁號稱「一鍵產生看診資料」，但在此之前沒有任何帶得走的出口：家長只能
 * 把手機拿給醫師看，或是自己重打一遍。`notes` 是「特殊事項」欄裡當下打的字，
 * 沒有存進資料庫，所以只有這裡能把它帶出去。
 */
export function buildClinicSummaryText(data: ClinicSummaryData, notes: string): string {
  const lines: string[] = [
    `【看診摘要】${data.childName}`,
    `產生時間：${formatDate(data.generatedAt)} ${formatTime(data.generatedAt)}`,
    '',
    '■ 基本資料',
    `性別：${genderText(data.gender)}`,
    `生日：${formatDate(data.birthday)}`,
    `年齡：${data.ageDisplay}`,
  ];

  if (data.latestGrowth) {
    const { date, weight, height, headCircumference, percentile } = data.latestGrowth;
    lines.push('', `■ 最新測量（${formatDate(date)}）`);
    if (weight !== undefined) lines.push(`體重：${weight} kg${percentileText(percentile?.weight)}`);
    if (height !== undefined) lines.push(`身高：${height} cm${percentileText(percentile?.height)}`);
    if (headCircumference !== undefined) {
      lines.push(`頭圍：${headCircumference} cm${percentileText(percentile?.headCircumference)}`);
    }
  }

  lines.push('', '■ 疫苗紀錄');
  if (data.administeredVaccines.length === 0) {
    lines.push('尚無接種紀錄');
  } else {
    data.administeredVaccines.forEach((vaccine) => {
      lines.push(
        `${vaccine.name} 第 ${vaccine.dose} 劑：${vaccine.date ? formatDate(vaccine.date) : '日期未記錄'}`
      );
    });
  }
  if (data.nextVaccine) {
    lines.push(
      `下一劑：${data.nextVaccine.name}（第 ${data.nextVaccine.doseNumber} 劑），建議時間：${data.nextVaccine.timing}`
    );
  }

  // 每一行都自己帶分母。醫師讀到的是「三天記錄算出來的平均」還是「七天」，
  // 差別很大，而這份文字會被貼到診間外的通訊軟體裡，沒有畫面上的說明可看。
  const week = data.weekSummary;
  lines.push(
    '',
    `■ 近 7 天日常摘要（${week.loggedDays} 天有記錄）`,
    week.feedingDays > 0
      ? `每日平均餵奶：${week.avgFeedingCount} 次、${week.avgFeedingAmount} ml（${week.feedingDays} 天有記錄）`
      : '每日平均餵奶：無記錄',
    week.sleepDays > 0
      ? `每日平均睡眠：${week.avgSleepHours} 小時（${week.sleepDays} 天有記錄）`
      : '每日平均睡眠：無記錄',
    `最長連續睡眠：${week.longestSleep > 0 ? formatDuration(week.longestSleep) : '無紀錄'}`,
    week.diaperDays > 0
      ? `每日平均便便次數：${week.avgPoopCount} 次（${week.diaperDays} 天有記錄）`
      : '每日平均便便次數：無記錄',
    `最後一次便便：${week.lastPoopTime ? `${formatDate(week.lastPoopTime)} ${formatTime(week.lastPoopTime)}` : '無紀錄'}`
  );

  if (data.healthTimeline.length > 0) {
    lines.push('', '■ 完整健康紀錄');
    data.healthTimeline.forEach((event) => {
      const where = event.location ? `（${event.location}）` : '';
      lines.push(`${event.date || '未記日期'} ${event.title}${where}`);
    });
  }

  const trimmedNotes = notes.trim();
  if (trimmedNotes) {
    lines.push('', '■ 特殊事項', trimmedNotes);
  }

  return lines.join('\n');
}
