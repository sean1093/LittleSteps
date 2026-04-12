import { DailyLog, SleepData } from '../types';
import { sleepRequirements, SleepRequirement } from '../data/sleep';

// 睡眠統計介面
export interface SleepStats {
  totalDuration: number; // 總睡眠時長（分鐘）
  dailyAverage: number; // 每日平均睡眠時長（分鐘）
  sleepCount: number; // 睡眠次數
  averageDuration: number; // 平均每次睡眠時長（分鐘）
  nightSleep: number; // 夜間睡眠時長（分鐘）
  daytimeNaps: number; // 白天小睡時長（分鐘）
  nightSleepCount: number; // 夜間睡眠次數
  napCount: number; // 白天小睡次數
  daysInPeriod: number; // 時段內的天數
}

// 睡眠規律性介面
export interface SleepRegularity {
  bedtimeRegularity: number; // 0-100 分數，越高越規律
  wakeTimeRegularity: number; // 0-100 分數，越高越規律
  averageBedtime: string; // "21:30" 格式
  averageWakeTime: string; // "07:30" 格式
}

// 睡眠建議介面
export interface SleepAdvice {
  category: 'good' | 'attention' | 'improve';
  title: string;
  description: string;
  suggestions: string[];
}

/**
 * 計算寶寶月齡
 */
export function calculateAge(birthday: string): number {
  const birth = new Date(birthday);
  const now = new Date();
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  return Math.max(0, months);
}

/**
 * 判斷是否為夜間睡眠（18:00-06:00 之間開始）
 */
export function isNightSleep(startTime: string): boolean {
  const hour = new Date(startTime).getHours();
  return hour >= 18 || hour < 6;
}

/**
 * 解析小時範圍字串（如 "13-15 小時" -> {min: 13, max: 15}）
 */
export function parseHourRange(hourString: string): { min: number; max: number } {
  const match = hourString.match(/(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)/);
  if (match) {
    return {
      min: parseFloat(match[1]),
      max: parseFloat(match[2]),
    };
  }
  // 如果是單一數字（如 "11 小時"）
  const singleMatch = hourString.match(/(\d+(?:\.\d+)?)/);
  if (singleMatch) {
    const value = parseFloat(singleMatch[1]);
    return { min: value, max: value };
  }
  return { min: 0, max: 0 };
}

/**
 * 篩選指定時段的日誌
 */
function filterLogsByPeriod(logs: DailyLog[], period: 'today' | 'week' | 'month'): DailyLog[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return logs.filter((log) => {
    const logDate = new Date(log.timestamp);

    switch (period) {
      case 'today':
        return logDate >= today;
      case 'week': {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return logDate >= weekAgo;
      }
      case 'month': {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return logDate >= monthAgo;
      }
      default:
        return true;
    }
  });
}

/**
 * 計算睡眠統計
 */
export function calculateSleepStats(
  logs: DailyLog[],
  period: 'today' | 'week' | 'month'
): SleepStats {
  const sleepLogs = filterLogsByPeriod(
    logs.filter((log) => log.type === 'sleep'),
    period
  );

  // 只計算已完成的睡眠（有 endTime 和 duration）
  const completedSleeps = sleepLogs.filter((log) => {
    const data = log.data as SleepData;
    return data.endTime && data.duration;
  });

  // 計算時段內的天數
  let daysInPeriod = 1;
  if (period === 'week') {
    daysInPeriod = 7;
  } else if (period === 'month') {
    daysInPeriod = 30;
  }

  let totalDuration = 0;
  let nightSleep = 0;
  let daytimeNaps = 0;
  let nightSleepCount = 0;
  let napCount = 0;

  completedSleeps.forEach((log) => {
    const data = log.data as SleepData;
    const duration = data.duration || 0;
    totalDuration += duration;

    if (isNightSleep(data.startTime)) {
      nightSleep += duration;
      nightSleepCount++;
    } else {
      daytimeNaps += duration;
      napCount++;
    }
  });

  const sleepCount = completedSleeps.length;
  const averageDuration = sleepCount > 0 ? totalDuration / sleepCount : 0;
  const dailyAverage = totalDuration / daysInPeriod;

  return {
    totalDuration,
    dailyAverage,
    sleepCount,
    averageDuration,
    nightSleep,
    daytimeNaps,
    nightSleepCount,
    napCount,
    daysInPeriod,
  };
}

/**
 * 計算時間的平均值與標準差（用於規律性評分）
 */
function calculateTimeStats(times: number[]): { mean: number; stdDev: number; score: number } {
  if (times.length === 0) {
    return { mean: 0, stdDev: 0, score: 0 };
  }

  const mean = times.reduce((a, b) => a + b, 0) / times.length;
  const variance = times.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) / times.length;
  const stdDev = Math.sqrt(variance);

  // 標準差轉換為 0-100 分數
  // 標準差 < 0.5 小時 = 100分，> 2 小時 = 0分
  const score = Math.max(0, Math.min(100, 100 - (stdDev / 2) * 100));

  return { mean, stdDev, score: Math.round(score) };
}

/**
 * 將小時數轉換為 "HH:MM" 格式
 */
function hoursToTimeString(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * 計算睡眠規律性
 */
export function calculateSleepRegularity(logs: DailyLog[]): SleepRegularity {
  const sleepLogs = logs.filter((log) => log.type === 'sleep');

  // 只取最近 7 天的記錄
  const weekLogs = filterLogsByPeriod(sleepLogs, 'week');
  const completedSleeps = weekLogs.filter((log) => {
    const data = log.data as SleepData;
    return data.endTime && data.duration;
  });

  // 提取入睡時間（小時數，含小數）
  const bedtimes: number[] = [];
  const wakeTimes: number[] = [];

  completedSleeps.forEach((log) => {
    const data = log.data as SleepData;

    const startDate = new Date(data.startTime);
    const endDate = new Date(data.endTime!);

    const bedtimeHours = startDate.getHours() + startDate.getMinutes() / 60;
    const wakeTimeHours = endDate.getHours() + endDate.getMinutes() / 60;

    bedtimes.push(bedtimeHours);
    wakeTimes.push(wakeTimeHours);
  });

  const bedtimeStats = calculateTimeStats(bedtimes);
  const wakeTimeStats = calculateTimeStats(wakeTimes);

  return {
    bedtimeRegularity: bedtimeStats.score,
    wakeTimeRegularity: wakeTimeStats.score,
    averageBedtime: hoursToTimeString(bedtimeStats.mean),
    averageWakeTime: hoursToTimeString(wakeTimeStats.mean),
  };
}

/**
 * 根據月齡取得睡眠建議
 */
export function getSleepRecommendation(ageInMonths: number): SleepRequirement {
  // 根據月齡找到對應的建議
  if (ageInMonths < 1) {
    return sleepRequirements[0]; // 0-1 個月
  } else if (ageInMonths < 3) {
    return sleepRequirements[1]; // 1-3 個月
  } else if (ageInMonths < 6) {
    return sleepRequirements[2]; // 3-6 個月
  } else if (ageInMonths < 12) {
    return sleepRequirements[3]; // 6-12 個月
  } else if (ageInMonths < 18) {
    return sleepRequirements[4]; // 12-18 個月
  } else {
    return sleepRequirements[5]; // 18-24 個月及以上
  }
}

/**
 * 生成睡眠建議
 */
export function generateSleepAdvice(stats: SleepStats, ageInMonths: number): SleepAdvice[] {
  const advice: SleepAdvice[] = [];
  const recommendation = getSleepRecommendation(ageInMonths);

  const { min: minHours, max: maxHours } = parseHourRange(recommendation.totalHours);
  const actualHours = stats.dailyAverage / 60; // 使用每日平均

  // 1. 每日平均睡眠時長評估
  if (actualHours >= minHours && actualHours <= maxHours) {
    advice.push({
      category: 'good',
      title: '✅ 睡眠時長充足',
      description: `寶寶每天平均睡 ${actualHours.toFixed(1)} 小時，符合 ${ageInMonths} 個月大寶寶的建議範圍（${minHours}-${maxHours} 小時）。`,
      suggestions: ['繼續維持目前的作息安排'],
    });
  } else if (actualHours < minHours) {
    const deficit = minHours - actualHours;
    advice.push({
      category: 'improve',
      title: '🔧 睡眠時間不足',
      description: `寶寶每天平均睡 ${actualHours.toFixed(1)} 小時，少於建議的 ${minHours}-${maxHours} 小時（不足約 ${deficit.toFixed(1)} 小時）。`,
      suggestions: [
        '提早 30 分鐘開始睡前儀式',
        '確保睡眠環境安靜、黑暗、舒適',
        '觀察寶寶的睏倦訊號（揉眼睛、打哈欠），及時安撫入睡',
        '檢查是否有干擾睡眠的因素（噪音、光線、溫度）',
      ],
    });
  } else {
    const excess = actualHours - maxHours;
    advice.push({
      category: 'attention',
      title: '⚠️ 睡眠時間較多',
      description: `寶寶每天平均睡 ${actualHours.toFixed(1)} 小時，超過建議的 ${maxHours} 小時（多約 ${excess.toFixed(1)} 小時）。`,
      suggestions: [
        '如果寶寶清醒時精神良好，無需過度擔心',
        '注意是否有生病或發育高峰期',
        '若持續過度嗜睡，建議諮詢醫師',
      ],
    });
  }

  // 2. 夜間 vs 白天比例評估
  if (stats.totalDuration > 0) {
    const nightRatio = stats.nightSleep / stats.totalDuration;
    if (ageInMonths >= 3 && nightRatio < 0.65) {
      advice.push({
        category: 'attention',
        title: '⚠️ 夜間睡眠比例偏低',
        description: `目前夜間睡眠佔 ${(nightRatio * 100).toFixed(0)}%，建議 3 個月以上的寶寶夜間睡眠應佔總睡眠時間的 65-75%。`,
        suggestions: [
          '白天小睡不宜過長，避免影響夜間睡眠',
          '下午 4 點後避免小睡',
          '建立固定的睡前儀式，幫助寶寶區分晝夜',
          '白天增加活動量與光照，強化晝夜節律',
        ],
      });
    }
  }

  // 3. 睡眠次數評估（計算每日平均次數）
  const dailySleepCount = stats.sleepCount / stats.daysInPeriod;
  if (ageInMonths >= 6 && dailySleepCount > 5) {
    advice.push({
      category: 'attention',
      title: '⚠️ 睡眠次數較多',
      description: `平均每天睡 ${dailySleepCount.toFixed(1)} 次。6 個月以上的寶寶通常一天睡 3-4 次（夜間長睡 + 2-3 次小睡）。`,
      suggestions: [
        '嘗試延長每次睡眠時長，減少睡醒頻率',
        '白天小睡時間可稍微拉長間隔',
        '夜間睡眠盡量不打斷，培養連續睡眠能力',
        '檢查是否有頻繁醒來的原因（飢餓、不適、環境）',
      ],
    });
  }

  // 4. 平均睡眠時長評估
  if (stats.averageDuration > 0 && stats.averageDuration < 60) {
    advice.push({
      category: 'attention',
      title: '⚠️ 單次睡眠時間較短',
      description: `平均每次睡眠僅 ${Math.round(stats.averageDuration)} 分鐘，建議延長單次睡眠時長。`,
      suggestions: [
        '確保睡眠環境舒適，減少干擾',
        '觀察是否有淺眠易醒的問題',
        '建立穩定的睡眠儀式，幫助深度睡眠',
      ],
    });
  }

  return advice;
}
