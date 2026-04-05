import type { DailyLog, SleepData, SleepAnalytics, SleepRecommendation, SleepPattern } from '../types';

/**
 * Filter sleep logs from daily logs
 */
export function filterSleepLogs(logs: DailyLog[]): DailyLog[] {
  return logs.filter(log => log.type === 'sleep');
}

/**
 * Get sleep logs from the last N days
 */
export function getSleepLogsInRange(logs: DailyLog[], days: number = 1): DailyLog[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  cutoffDate.setHours(0, 0, 0, 0);

  return filterSleepLogs(logs).filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate;
  });
}

/**
 * Calculate total sleep duration from logs
 */
export function calculateTotalSleepDuration(logs: DailyLog[]): number {
  return filterSleepLogs(logs).reduce((total, log) => {
    const sleepData = log.data as SleepData;
    return total + (sleepData.duration || 0);
  }, 0);
}

/**
 * Find the longest sleep session
 */
export function findLongestSleepSession(logs: DailyLog[]): number {
  const sleepLogs = filterSleepLogs(logs);
  if (sleepLogs.length === 0) return 0;

  return Math.max(...sleepLogs.map(log => {
    const sleepData = log.data as SleepData;
    return sleepData.duration || 0;
  }));
}

/**
 * Calculate average sleep duration per session
 */
export function calculateAverageSleepDuration(logs: DailyLog[]): number {
  const sleepLogs = filterSleepLogs(logs);
  if (sleepLogs.length === 0) return 0;

  const total = calculateTotalSleepDuration(sleepLogs);
  return Math.round(total / sleepLogs.length);
}

/**
 * Calculate total night wakings
 */
export function calculateTotalNightWakings(logs: DailyLog[]): number {
  return filterSleepLogs(logs).reduce((total, log) => {
    const sleepData = log.data as SleepData;
    return total + (sleepData.nightWakings || 0);
  }, 0);
}

/**
 * Detect if baby is sleeping through the night (>= 6 hours continuous)
 */
export function detectSleepingThroughNight(logs: DailyLog[]): boolean {
  const longestSleep = findLongestSleepSession(logs);
  return longestSleep >= 360; // 6 hours = 360 minutes
}

/**
 * Calculate sleep quality score (0-100)
 * Based on: duration, night wakings, and quality field
 */
export function calculateSleepQualityScore(logs: DailyLog[]): number {
  const sleepLogs = filterSleepLogs(logs);
  if (sleepLogs.length === 0) return 0;

  let totalScore = 0;

  sleepLogs.forEach(log => {
    const sleepData = log.data as SleepData;
    let sessionScore = 0;

    // Duration score (0-40 points)
    // Optimal: 2-3 hours per nap for babies
    const duration = sleepData.duration || 0;
    if (duration >= 120 && duration <= 180) {
      sessionScore += 40;
    } else if (duration >= 60) {
      sessionScore += 30;
    } else if (duration >= 30) {
      sessionScore += 20;
    } else {
      sessionScore += 10;
    }

    // Night wakings score (0-30 points)
    const wakings = sleepData.nightWakings || 0;
    if (wakings === 0) {
      sessionScore += 30;
    } else if (wakings === 1) {
      sessionScore += 20;
    } else if (wakings === 2) {
      sessionScore += 10;
    }

    // Quality field score (0-30 points)
    if (sleepData.quality === 'good') {
      sessionScore += 30;
    } else if (sleepData.quality === 'fair') {
      sessionScore += 20;
    } else if (sleepData.quality === 'poor') {
      sessionScore += 10;
    } else {
      // If no quality specified, give neutral score
      sessionScore += 20;
    }

    totalScore += sessionScore;
  });

  return Math.round(totalScore / sleepLogs.length);
}

/**
 * Calculate routine score (0-100)
 * Measures consistency of sleep start times
 */
export function calculateRoutineScore(logs: DailyLog[], days: number = 7): number {
  const sleepLogs = getSleepLogsInRange(logs, days);
  if (sleepLogs.length < 3) return 0; // Need at least 3 data points

  // Group by date and find first sleep of each day
  const dailyFirstSleeps: { [date: string]: Date } = {};

  sleepLogs.forEach(log => {
    const sleepData = log.data as SleepData;
    const startTime = new Date(sleepData.startTime);
    const dateKey = startTime.toISOString().split('T')[0];

    if (!dailyFirstSleeps[dateKey] || startTime < dailyFirstSleeps[dateKey]) {
      dailyFirstSleeps[dateKey] = startTime;
    }
  });

  const firstSleeps = Object.values(dailyFirstSleeps);
  if (firstSleeps.length < 2) return 0;

  // Calculate variance in sleep start times (in minutes from midnight)
  const minutesFromMidnight = firstSleeps.map(date => {
    return date.getHours() * 60 + date.getMinutes();
  });

  const avg = minutesFromMidnight.reduce((a, b) => a + b, 0) / minutesFromMidnight.length;
  const variance = minutesFromMidnight.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / minutesFromMidnight.length;
  const stdDev = Math.sqrt(variance);

  // Convert standard deviation to score
  // Low std dev (< 30 min) = high score
  // High std dev (> 120 min) = low score
  let score = 100;
  if (stdDev > 30) {
    score = Math.max(0, 100 - ((stdDev - 30) / 90 * 100));
  }

  return Math.round(score);
}

/**
 * Calculate average bedtime (first sleep of the day)
 */
export function calculateAverageBedtime(logs: DailyLog[], days: number = 7): string | undefined {
  const sleepLogs = getSleepLogsInRange(logs, days);
  if (sleepLogs.length === 0) return undefined;

  // Group by date and find first sleep of each day
  const dailyFirstSleeps: { [date: string]: Date } = {};

  sleepLogs.forEach(log => {
    const sleepData = log.data as SleepData;
    const startTime = new Date(sleepData.startTime);
    const dateKey = startTime.toISOString().split('T')[0];

    if (!dailyFirstSleeps[dateKey] || startTime < dailyFirstSleeps[dateKey]) {
      dailyFirstSleeps[dateKey] = startTime;
    }
  });

  const firstSleeps = Object.values(dailyFirstSleeps);
  if (firstSleeps.length === 0) return undefined;

  // Calculate average time
  const totalMinutes = firstSleeps.reduce((sum, date) => {
    return sum + (date.getHours() * 60 + date.getMinutes());
  }, 0);

  const avgMinutes = Math.round(totalMinutes / firstSleeps.length);
  const hours = Math.floor(avgMinutes / 60);
  const minutes = avgMinutes % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Calculate average wake time (last sleep end of the day)
 */
export function calculateAverageWakeTime(logs: DailyLog[], days: number = 7): string | undefined {
  const sleepLogs = getSleepLogsInRange(logs, days);
  if (sleepLogs.length === 0) return undefined;

  // Group by date and find last sleep end of each day
  const dailyLastWakes: { [date: string]: Date } = {};

  sleepLogs.forEach(log => {
    const sleepData = log.data as SleepData;
    if (!sleepData.endTime) return; // Skip ongoing sleep

    const endTime = new Date(sleepData.endTime);
    const dateKey = endTime.toISOString().split('T')[0];

    if (!dailyLastWakes[dateKey] || endTime > dailyLastWakes[dateKey]) {
      dailyLastWakes[dateKey] = endTime;
    }
  });

  const lastWakes = Object.values(dailyLastWakes);
  if (lastWakes.length === 0) return undefined;

  // Calculate average time
  const totalMinutes = lastWakes.reduce((sum, date) => {
    return sum + (date.getHours() * 60 + date.getMinutes());
  }, 0);

  const avgMinutes = Math.round(totalMinutes / lastWakes.length);
  const hours = Math.floor(avgMinutes / 60);
  const minutes = avgMinutes % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Generate sleep recommendations based on analytics
 */
export function generateSleepRecommendations(
  _logs: DailyLog[],
  analytics: SleepAnalytics
): SleepRecommendation[] {
  const recommendations: SleepRecommendation[] = [];

  // Sleeping through the night
  if (analytics.isSleepingThroughNight) {
    recommendations.push({
      id: 'sleep-through-night',
      type: 'positive',
      title: '恭喜！寶寶已經睡過夜',
      message: `寶寶最長連續睡眠達 ${Math.floor(analytics.longestContinuousSleep / 60)} 小時 ${analytics.longestContinuousSleep % 60} 分鐘，表現很棒！`,
      icon: 'PartyPopper'
    });
  } else if (analytics.longestContinuousSleep >= 240) {
    recommendations.push({
      id: 'almost-through-night',
      type: 'suggestion',
      title: '快要睡過夜了',
      message: `寶寶最長連續睡眠已達 ${Math.floor(analytics.longestContinuousSleep / 60)} 小時，再加油！試著延長睡前的餵奶量或建立固定的睡前儀式。`,
      icon: 'Moon'
    });
  }

  // Sleep quality
  if (analytics.sleepQualityScore >= 80) {
    recommendations.push({
      id: 'good-quality',
      type: 'positive',
      title: '睡眠品質優良',
      message: '寶寶的睡眠品質很好，請繼續保持目前的作息模式！',
      icon: 'Star'
    });
  } else if (analytics.sleepQualityScore < 50) {
    recommendations.push({
      id: 'poor-quality',
      type: 'warning',
      title: '睡眠品質需改善',
      message: '寶寶的睡眠品質較差，建議檢查睡眠環境（溫度、光線、噪音）或諮詢兒科醫師。',
      icon: 'AlertTriangle'
    });
  }

  // Night wakings
  if (analytics.nightWakingsTotal > 5) {
    recommendations.push({
      id: 'too-many-wakings',
      type: 'warning',
      title: '夜醒次數較多',
      message: `寶寶在過去 24 小時內夜醒了 ${analytics.nightWakingsTotal} 次。可能原因：飢餓、尿布濕、太冷/太熱、分離焦慮等。`,
      icon: 'AlertCircle'
    });
  } else if (analytics.nightWakingsTotal === 0 && analytics.sleepCount > 0) {
    recommendations.push({
      id: 'no-wakings',
      type: 'positive',
      title: '一覺到天亮',
      message: '寶寶昨天完全沒有夜醒，睡眠品質極佳！',
      icon: 'Heart'
    });
  }

  // Routine score
  if (analytics.routineScore >= 75) {
    recommendations.push({
      id: 'good-routine',
      type: 'positive',
      title: '作息規律穩定',
      message: `寶寶的睡眠時間很規律（規律性 ${analytics.routineScore}%），這有助於培養良好的睡眠習慣。`,
      icon: 'Clock'
    });
  } else if (analytics.routineScore < 50) {
    recommendations.push({
      id: 'poor-routine',
      type: 'suggestion',
      title: '建議建立固定作息',
      message: '寶寶的睡眠時間不太規律。試著每天在相同時間進行睡前儀式（洗澡、按摩、唱搖籃曲），幫助建立生理時鐘。',
      icon: 'Calendar'
    });
  }

  // Total sleep duration
  if (analytics.totalSleepDuration < 600) { // < 10 hours
    recommendations.push({
      id: 'insufficient-sleep',
      type: 'warning',
      title: '睡眠時間不足',
      message: `寶寶過去 24 小時只睡了 ${Math.floor(analytics.totalSleepDuration / 60)} 小時 ${analytics.totalSleepDuration % 60} 分鐘。新生兒需要 14-17 小時，6個月大約 12-15 小時。`,
      icon: 'Clock'
    });
  }

  // If no recommendations, give a general positive message
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'keep-tracking',
      type: 'suggestion',
      title: '繼續記錄',
      message: '持續記錄寶寶的睡眠數據，可以幫助您了解寶寶的作息模式並做出調整。',
      icon: 'TrendingUp'
    });
  }

  return recommendations;
}

/**
 * Analyze sleep patterns and generate full analytics
 */
export function analyzeSleepPatterns(logs: DailyLog[]): SleepAnalytics {
  const last24hLogs = getSleepLogsInRange(logs, 1);
  const last7dLogs = getSleepLogsInRange(logs, 7);

  const totalSleepDuration = calculateTotalSleepDuration(last24hLogs);
  const longestSleepDuration = findLongestSleepSession(last24hLogs);
  const averageSleepDuration = calculateAverageSleepDuration(last24hLogs);
  const sleepCount = filterSleepLogs(last24hLogs).length;
  const sleepQualityScore = calculateSleepQualityScore(last24hLogs);
  const nightWakingsTotal = calculateTotalNightWakings(last24hLogs);
  const isSleepingThroughNight = detectSleepingThroughNight(last24hLogs);
  const longestContinuousSleep = longestSleepDuration;
  const routineScore = calculateRoutineScore(last7dLogs, 7);
  const averageBedtime = calculateAverageBedtime(last7dLogs, 7);
  const averageWakeTime = calculateAverageWakeTime(last7dLogs, 7);

  const analytics: SleepAnalytics = {
    totalSleepDuration,
    longestSleepDuration,
    averageSleepDuration,
    sleepCount,
    sleepQualityScore,
    nightWakingsTotal,
    isSleepingThroughNight,
    longestContinuousSleep,
    routineScore,
    averageBedtime,
    averageWakeTime,
    recommendations: []
  };

  // Generate recommendations based on analytics
  analytics.recommendations = generateSleepRecommendations(logs, analytics);

  return analytics;
}

/**
 * Get sleep patterns by date (for visualization)
 */
export function getSleepPatternsByDate(logs: DailyLog[], days: number = 7): SleepPattern[] {
  const sleepLogs = getSleepLogsInRange(logs, days);

  // Group by date
  const logsByDate: { [date: string]: DailyLog[] } = {};

  sleepLogs.forEach(log => {
    const date = new Date(log.timestamp).toISOString().split('T')[0];
    if (!logsByDate[date]) {
      logsByDate[date] = [];
    }
    logsByDate[date].push(log);
  });

  // Convert to SleepPattern array
  return Object.entries(logsByDate).map(([date, logs]) => {
    const sessions = logs.map(log => {
      const sleepData = log.data as SleepData;
      return {
        startTime: sleepData.startTime,
        endTime: sleepData.endTime,
        duration: sleepData.duration || 0,
        quality: sleepData.quality,
        nightWakings: sleepData.nightWakings
      };
    });

    const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
    const longestSession = Math.max(...sessions.map(s => s.duration));
    const qualityScore = calculateSleepQualityScore(logs);

    return {
      date,
      sleepSessions: sessions,
      totalDuration,
      longestSession,
      qualityScore
    };
  }).sort((a, b) => b.date.localeCompare(a.date)); // Sort newest first
}
