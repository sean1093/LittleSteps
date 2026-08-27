import { dueDateFromLmp, lmpFromDueDate } from '../../utils/dateHelpers';
import type { PrenatalCheckupTemplate } from '../data/prenatalCheckups';

/**
 * Naegele 法則：預產期 = 末次月經（LMP）第一天 + 280 天。
 * 換算函式本身住在 src/utils/dateHelpers.ts，因為寫入路徑也要用；
 * 這裡再匯出一次，讓孕期相關的呼叫端只要認識這個模組即可。
 */
export { dueDateFromLmp, lmpFromDueDate };

export type PrenatalItemStatus = 'upcoming' | 'due' | 'overdue' | 'done';

export interface ResolvedPrenatalItem {
  template: PrenatalCheckupTemplate;
  /** 建議週對應的日曆日 */
  dueDate: string; // YYYY-MM-DD
  /** 可執行區間的第一天 */
  windowStart: string; // YYYY-MM-DD
  /** 可執行區間的最後一天（toWeek 那一週的第 6 天，即臨床寫法的 toWeek+6d） */
  windowEnd: string; // YYYY-MM-DD
  status: PrenatalItemStatus;
  /** 距建議週的週數；負數表示已過 */
  weeksUntilDue: number;
  completedDate?: string;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DAYS_PER_WEEK = 7;

/** 將 YYYY-MM-DD 解析為當地時區正午的 Date，避開 UTC 位移造成的差一天。 */
function parseLocalDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** 在 YYYY-MM-DD 上加指定天數。以當地正午為基準，跨日光節約時間也不會差一天。 */
function addDays(isoDate: string, days: number): string {
  const date = parseLocalDate(isoDate);
  date.setDate(date.getDate() + days);
  return formatLocalDate(date);
}

/**
 * 已完成的妊娠週數（整週）。
 *
 * LMP 當天到第 6 天都是第 0 週，顯示層若要寫「第 N 週」請自行 +1。
 * LMP 落在未來時（使用者打錯日期）回傳 0，而不是負數，也不取絕對值——
 * 未來的日期不代表已經懷孕那麼久。
 */
export function weeksPregnant(lastPeriodDate: string, today: Date = new Date()): number {
  if (!lastPeriodDate) return 0;
  const days = Math.round(
    (parseLocalDate(formatLocalDate(today)).getTime() -
      parseLocalDate(lastPeriodDate).getTime()) /
      MS_PER_DAY,
  );
  if (days < 0) return 0;
  return Math.floor(days / DAYS_PER_WEEK);
}

function resolveStatus(
  completedDate: string | undefined,
  today: Date,
  dueDate: Date,
  windowEnd: Date,
): PrenatalItemStatus {
  if (completedDate !== undefined) return 'done';
  if (today.getTime() > windowEnd.getTime()) return 'overdue';
  if (today.getTime() >= dueDate.getTime()) return 'due';
  return 'upcoming';
}

/**
 * 依末次月經將靜態時程展開為帶狀態的產檢清單，依建議日期遞增排序。
 * 完全無 I/O；today 可注入以利測試。
 *
 * completed 以 template.id 為鍵，由呼叫端從已記錄的產檢資料整理後傳入。
 */
export function resolvePrenatalItems(
  lastPeriodDate: string,
  templates: PrenatalCheckupTemplate[],
  completed: Record<string, { completedDate: string }>,
  today: Date = new Date(),
): ResolvedPrenatalItem[] {
  if (!lastPeriodDate) return [];

  // 丟掉時分秒，只比日期。
  const todayLocal = parseLocalDate(formatLocalDate(today));
  const currentWeek = weeksPregnant(lastPeriodDate, todayLocal);

  return templates
    .map((template) => {
      const dueDate = addDays(lastPeriodDate, template.dueWeek * DAYS_PER_WEEK);
      const windowStart = addDays(lastPeriodDate, template.fromWeek * DAYS_PER_WEEK);
      // toWeek 那一整週都還能做，所以區間結束在該週的最後一天。
      const windowEnd = addDays(
        lastPeriodDate,
        template.toWeek * DAYS_PER_WEEK + (DAYS_PER_WEEK - 1),
      );
      const completedDate = completed[template.id]?.completedDate;

      return {
        template,
        dueDate,
        windowStart,
        windowEnd,
        status: resolveStatus(
          completedDate,
          todayLocal,
          parseLocalDate(dueDate),
          parseLocalDate(windowEnd),
        ),
        weeksUntilDue: template.dueWeek - currentWeek,
        completedDate,
      };
    })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}
