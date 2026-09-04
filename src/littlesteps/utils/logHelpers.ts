import { DailyLog, DailySummary, FeedingData, SleepData, DiaperData } from '../../types';
import { toLocalDateKey } from '../../common/utils/dateHelpers';

/**
 * 按時間倒序排序日誌（最新的在前）
 */
export function sortLogsByTime(logs: DailyLog[]): DailyLog[] {
  return [...logs].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

/**
 * 篩選指定日期的日誌
 */
export function filterLogsByDate(logs: DailyLog[], date: string): DailyLog[] {
  return logs.filter(log => {
    const logDate = toLocalDateKey(log.timestamp);
    return logDate === date;
  });
}

/**
 * 獲取今日的日誌
 */
export function getTodayLogs(logs: DailyLog[]): DailyLog[] {
  const today = toLocalDateKey();
  return filterLogsByDate(logs, today);
}

/**
 * 獲取最近 N 天的日誌
 */
export function getRecentLogs(logs: DailyLog[], days: number): DailyLog[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const cutoffTime = cutoffDate.getTime();

  return logs.filter(log =>
    new Date(log.timestamp).getTime() >= cutoffTime
  );
}

/**
 * 計算睡眠時長（分鐘）
 */
export function calculateSleepDuration(sleepData: SleepData): number | undefined {
  if (!sleepData.endTime) {
    return undefined; // Still sleeping
  }

  const startTime = new Date(sleepData.startTime).getTime();
  const endTime = new Date(sleepData.endTime).getTime();
  return Math.round((endTime - startTime) / (1000 * 60)); // Convert to minutes
}

/**
 * 睡眠沒有結束時間就是「還在睡」。超過這個時數幾乎一定是忘了按「醒了」，
 * 不是真的睡了十幾個小時——這種紀錄不能算進任何統計：它會讓那一天看起來
 * 「有記睡眠」卻只有 0 分鐘，把平均往下拉，而畫面上完全看不出原因。
 */
export const STALE_OPEN_SLEEP_MINUTES = 14 * 60;

/** 還沒填結束時間的睡眠。 */
export function isOpenSleep(log: DailyLog): boolean {
  return log.type === 'sleep' && !(log.data as SleepData).endTime;
}

/** 從入睡到現在經過幾分鐘。時間壞掉或落在未來時回 0，不回負數。 */
export function openSleepElapsedMinutes(sleepData: SleepData, now: Date = new Date()): number {
  const startTime = new Date(sleepData.startTime).getTime();
  if (Number.isNaN(startTime)) return 0;
  return Math.max(0, Math.floor((now.getTime() - startTime) / (1000 * 60)));
}

/** 開著超過 STALE_OPEN_SLEEP_MINUTES 的睡眠：需要補結束時間，不列入統計。 */
export function isStaleOpenSleep(log: DailyLog, now: Date = new Date()): boolean {
  return (
    isOpenSleep(log) &&
    openSleepElapsedMinutes(log.data as SleepData, now) > STALE_OPEN_SLEEP_MINUTES
  );
}

/**
 * 這個孩子目前還沒結束的那一段睡眠。
 *
 * 同時只該有一段，取最新的一筆：舊資料若留下兩筆沒關的睡眠，家長要能先關掉
 * 剛剛那一段，而不是被卡在一筆三天前忘記按的紀錄上。
 */
export function findOpenSleep(logs: DailyLog[]): DailyLog | null {
  let open: DailyLog | null = null;
  for (const log of logs) {
    if (!isOpenSleep(log)) continue;
    if (!open || new Date(log.timestamp).getTime() > new Date(open.timestamp).getTime()) {
      open = log;
    }
  }
  return open;
}

/**
 * 計算指定日期的每日摘要統計
 */
export function calculateDailySummary(
  logs: DailyLog[],
  date?: string,
  now: Date = new Date(),
): DailySummary {
  const targetDate = date || toLocalDateKey();
  const dailyLogs = filterLogsByDate(logs, targetDate);

  const summary: DailySummary = {
    date: targetDate,
    feedingCount: 0,
    totalFeedingAmount: 0,
    sleepCount: 0,
    totalSleepDuration: 0,
    diaperCount: 0,
    poopCount: 0,
    peeCount: 0,
  };

  dailyLogs.forEach(log => {
    switch (log.type) {
      case 'feeding': {
        summary.feedingCount++;
        const feedingData = log.data as FeedingData;
        summary.totalFeedingAmount += feedingData.amount || 0;
        break;
      }

      case 'sleep': {
        // 忘了按「醒了」的紀錄不是一段睡眠，是一個待補的欄位。
        if (isStaleOpenSleep(log, now)) break;
        summary.sleepCount++;
        const sleepData = log.data as SleepData;
        const duration = sleepData.duration || calculateSleepDuration(sleepData) || 0;
        summary.totalSleepDuration += duration;
        break;
      }

      case 'diaper': {
        summary.diaperCount++;
        const diaperData = log.data as DiaperData;
        if (diaperData.type === 'poop' || diaperData.type === 'both') {
          summary.poopCount++;
        }
        if (diaperData.type === 'pee' || diaperData.type === 'both') {
          summary.peeCount++;
        }
        break;
      }
    }
  });

  return summary;
}

/**
 * 格式化時間顯示（HH:MM）
 */
export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

/**
 * 格式化日期顯示（2026年6月15日）與時長顯示。
 * Single canonical implementations live in dateHelpers; re-exported here so the
 * whole app formats dates and durations consistently.
 */
export { formatDate, formatDuration } from '../../common/utils/dateHelpers';

/**
 * 獲取餵奶類型的中文顯示名稱
 */
export function getFeedingTypeLabel(type: FeedingData['feedingType']): string {
  const labels: Record<FeedingData['feedingType'], string> = {
    breast_left: '母乳（左）',
    breast_right: '母乳（右）',
    breast_both: '母乳（兩邊）',
    formula: '配方奶',
    solid: '副食品',
  };
  return labels[type];
}

/**
 * 獲取尿布類型的中文顯示名稱
 */
export function getDiaperTypeLabel(type: DiaperData['type']): string {
  const labels: Record<DiaperData['type'], string> = {
    pee: '小便',
    poop: '大便',
    both: '大小便',
  };
  return labels[type];
}

/**
 * 獲取大便性狀的中文顯示名稱
 */
export function getConsistencyLabel(consistency?: DiaperData['consistency']): string {
  if (!consistency) return '';
  const labels: Record<NonNullable<DiaperData['consistency']>, string> = {
    normal: '正常',
    soft: '稀',
    hard: '硬',
  };
  return labels[consistency];
}
