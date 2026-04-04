import { DailyLog, DailySummary, FeedingData, SleepData, DiaperData } from '../types';

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
    const logDate = new Date(log.timestamp).toISOString().split('T')[0];
    return logDate === date;
  });
}

/**
 * 獲取今日的日誌
 */
export function getTodayLogs(logs: DailyLog[]): DailyLog[] {
  const today = new Date().toISOString().split('T')[0];
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
 * 計算指定日期的每日摘要統計
 */
export function calculateDailySummary(logs: DailyLog[], date?: string): DailySummary {
  const targetDate = date || new Date().toISOString().split('T')[0];
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
      case 'feeding':
        summary.feedingCount++;
        const feedingData = log.data as FeedingData;
        summary.totalFeedingAmount += feedingData.amount || 0;
        break;

      case 'sleep':
        summary.sleepCount++;
        const sleepData = log.data as SleepData;
        const duration = sleepData.duration || calculateSleepDuration(sleepData) || 0;
        summary.totalSleepDuration += duration;
        break;

      case 'diaper':
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
 * 格式化日期顯示（YYYY/MM/DD）
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * 格式化時長顯示（例如: "1.5小時", "30分鐘"）
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}分鐘`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}小時`;
  }

  return `${hours}.${Math.round((remainingMinutes / 60) * 10)}小時`;
}

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
