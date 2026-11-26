import { DailyLog, SleepData, DiaperData } from '../../types';
import { filterLogsByDate, calculateSleepDuration, isIntakeFeedingLog } from './logHelpers';
import { generateDailySeries, getRecommendedSleepHours } from './trendCalculator';
import { toLocalDateKey } from '../../common/utils/dateHelpers';

export type AlertSeverity = 'warning' | 'danger';
export type AlertCategory = 'feeding' | 'sleep' | 'poop';

export interface Alert {
  id: string;
  category: AlertCategory;
  severity: AlertSeverity;
  title: string;
  message: string;
  icon: string; // lucide-react icon name
}

/**
 * 「一整天夠不夠」只能問已經過完的那一天。
 *
 * 原本兩個日總量警示比的都是「今天到目前為止」對上一整天的標準，所以每天
 * 早上第一次餵奶／第一段小睡之後就亮起來，一路亮到深夜才自動消失。天天出現
 * 的警示，家長只會學會忽略它。
 */
function lastCompletedDay(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return toLocalDateKey(date);
}

/** 少於這麼多天有記錄就沒有「平均」可比 */
const MIN_BASELINE_DAYS = 3;

const HOUR_MS = 1000 * 60 * 60;

/**
 * 「距離上次……已經多久」量的其實是「距離上次『記下來的』……」。
 *
 * 家長週末回娘家、手機沒電、或只是不想記了，紀錄就停在那裡，而這兩則警示會
 * 照樣亮起來說寶寶六小時沒喝奶、三天沒排便——說的是紀錄，不是寶寶。所以只在
 * 看得出家長還在記的時候才說話：那件事之後還有別的紀錄（任何類型），而且最新
 * 的一筆在 24 小時內。之後記了尿布卻沒記餵奶，那個空白才有可能是真的。
 */
function isStillLoggingSince(logs: DailyLog[], sinceMs: number, nowMs: number): boolean {
  return logs.some((log) => {
    const time = new Date(log.timestamp).getTime();
    return time > sinceMs && time <= nowMs && nowMs - time <= 24 * HOUR_MS;
  });
}

/**
 * 餵奶間隔的提醒只給這個月齡以下的寶寶。
 *
 * 這是審閱本功能的小兒科醫師的臨床判斷，不是引自指引的數字：三個月以上的寶寶
 * 夜裡連睡六小時以上沒喝奶是常態，對他們亮這則提醒只是每天早上的例行虛驚。
 */
const FEEDING_GAP_MAX_AGE_MONTHS = 3;

/**
 * Detect feeding alerts
 *
 * Rules:
 * - warning: yesterday's feeding amount < 70% of the surrounding week's average
 * - warning: last feeding was >6 hours ago — only under 3 months old, and only
 *   while the parent is demonstrably still logging
 *
 * Both rules count intake only. A pumping session is the mother's output and
 * says nothing about whether the baby has been fed.
 */
export function detectFeedingAlerts(logs: DailyLog[], ageMonths: number): Alert[] {
  const alerts: Alert[] = [];

  // 已經過完的 7 天（不含今天），最後一格是昨天。
  const week = generateDailySeries(logs, 8, 'feeding_amount').slice(0, 7);
  const yesterdayAmount = week[week.length - 1];
  // 基準不含昨天自己，否則偏低的那天會把自己的平均往下拉。沒記錄的日子不是
  // 「那天喝 0 ml」，不能參與平均。
  const baseline = week.slice(0, -1).filter((value): value is number => value !== null);

  // Rule 1: yesterday's feeding amount < 70% of the week's average
  if (yesterdayAmount !== null && baseline.length >= MIN_BASELINE_DAYS) {
    const avgDailyAmount = baseline.reduce((sum, v) => sum + v, 0) / baseline.length;

    if (avgDailyAmount > 0 && yesterdayAmount < avgDailyAmount * 0.7) {
      alerts.push({
        id: 'feeding-low-amount',
        category: 'feeding',
        severity: 'warning',
        title: '昨日餵奶量偏低',
        message: `昨日餵奶量 ${Math.round(yesterdayAmount)}ml，低於近一週平均 ${Math.round(avgDailyAmount)}ml 的 70%，請留意寶寶食慾。`,
        icon: 'AlertTriangle',
      });
    }
  }

  /*
    Rule 2: last feeding was >6 hours ago

    擠奶不算。一位半夜兩點擠奶的母親，寶寶並沒有因此喝到東西——把擠奶當成
    一餐，這則「超過六小時沒餵」的提醒就會被悄悄關掉，而它正是要提醒她的事。
    （擠奶紀錄倒是「家長還在記」的證據，所以下面的 isStillLoggingSince 算它。）
  */
  const feedingLogs = logs
    .filter(isIntakeFeedingLog)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (feedingLogs.length > 0 && ageMonths < FEEDING_GAP_MAX_AGE_MONTHS) {
    const lastFeedingTime = new Date(feedingLogs[0].timestamp).getTime();
    const now = Date.now();
    const hoursSinceLastFeeding = (now - lastFeedingTime) / HOUR_MS;

    if (hoursSinceLastFeeding > 6 && isStillLoggingSince(logs, lastFeedingTime, now)) {
      alerts.push({
        id: 'feeding-long-gap',
        category: 'feeding',
        severity: 'warning',
        title: '距離上次餵奶已超過 6 小時',
        message: `距離上次餵奶已經 ${Math.round(hoursSinceLastFeeding)} 小時，請確認寶寶是否需要餵食。`,
        icon: 'Clock',
      });
    }
  }

  return alerts;
}

/**
 * Detect poop alerts
 *
 * Rule:
 * - warning: no stool logged in >72 hours, while the parent is demonstrably
 *   still logging. One level only, never `danger`.
 */
export function detectPoopAlerts(logs: DailyLog[]): Alert[] {
  const alerts: Alert[] = [];

  // Find the most recent diaper log with type poop or both
  const poopLogs = logs
    .filter(log => log.type === 'diaper')
    .filter(log => {
      const data = log.data as DiaperData;
      return data.type === 'poop' || data.type === 'both';
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (poopLogs.length === 0) {
    // No poop logs at all - can't determine, skip alerts
    return alerts;
  }

  const lastPoopTime = new Date(poopLogs[0].timestamp).getTime();
  const now = Date.now();
  const hoursSinceLastPoop = (now - lastPoopTime) / HOUR_MS;

  // 來源（2026-11-26 查證）：American Academy of Pediatrics「Pooping By the Numbers」
  // https://www.healthychildren.org/English/ages-stages/baby/Pages/Pooping-By-the-Numbers.aspx
  // 原文："going as many as 5 to 7 days between poops is not necessarily a problem
  // for babies who have already proven themselves fully capable of pooping… and
  // are eating and growing well"。所以幾天沒排便本身不是「危險」：只有一級提醒，
  // 而且訊息把真正該就醫的徵象列出來，不拿時數當判決。
  if (hoursSinceLastPoop > 72 && isStillLoggingSince(logs, lastPoopTime, now)) {
    alerts.push({
      id: 'poop-no-poop-72h',
      category: 'poop',
      severity: 'warning',
      title: '超過 72 小時沒有排便紀錄',
      message: `已 ${Math.round(hoursSinceLastPoop)} 小時沒有排便紀錄。便便軟、吃得好、精神好，幾天一次也常見；便硬、解便時哭、肚子脹、吐或帶血，請就醫。`,
      icon: 'AlertTriangle',
    });
  }

  return alerts;
}

/**
 * Detect sleep alerts
 *
 * Rules:
 * - warning: yesterday's total sleep < 70% of age-recommended minimum
 */
export function detectSleepAlerts(logs: DailyLog[], ageMonths: number): Alert[] {
  const alerts: Alert[] = [];

  const sleepLogs = filterLogsByDate(logs, lastCompletedDay()).filter(
    log => log.type === 'sleep'
  );
  // 昨天完全沒記睡眠不代表寶寶沒睡。
  if (sleepLogs.length === 0) return alerts;

  let totalMinutes = 0;
  for (const log of sleepLogs) {
    const data = log.data as SleepData;
    const duration = data.duration ?? calculateSleepDuration(data);
    // 還沒按結束的那一段沒有時數，昨天的總和就是不完整的——不完整的總和
    // 拿去比建議值，得到的只會是虛驚。
    if (duration === undefined) return alerts;
    totalMinutes += duration;
  }

  const recommended = getRecommendedSleepHours(ageMonths);
  const sleepHours = totalMinutes / 60;

  if (sleepHours < recommended.min * 0.7) {
    alerts.push({
      id: 'sleep-below-recommended',
      category: 'sleep',
      severity: 'warning',
      title: '昨日睡眠時數偏低',
      message: `昨日睡眠 ${sleepHours.toFixed(1)} 小時，低於建議最低 ${recommended.min} 小時的 70%，請注意寶寶作息。`,
      icon: 'Moon',
    });
  }

  return alerts;
}

/**
 * Get all active alerts, sorted by severity (danger first)
 */
export function getActiveAlerts(logs: DailyLog[], ageMonths: number): Alert[] {
  const feedingAlerts = detectFeedingAlerts(logs, ageMonths);
  const poopAlerts = detectPoopAlerts(logs);
  const sleepAlerts = detectSleepAlerts(logs, ageMonths);

  const allAlerts = [...feedingAlerts, ...poopAlerts, ...sleepAlerts];

  // Sort by severity: danger first, then warning
  allAlerts.sort((a, b) => {
    const severityOrder: Record<AlertSeverity, number> = { danger: 0, warning: 1 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  return allAlerts;
}
