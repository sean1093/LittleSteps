import { buildCalendar, type CalendarEvent } from '../../common/utils/icsExport';
import { formatDate } from '../../common/utils/dateHelpers';
import { splitOverdueByProfileStart } from '../../common/utils/profileHistory';
import { prenatalItemKindLabels } from '../data/prenatalCheckups';
import type { ResolvedPrenatalItem } from './prenatalSchedule';

const PRODID = '-//LittleSteps//產檢時程//ZH-TW';

/**
 * 還沒做、而且值得放進行事曆的產檢項目，依建議日期遞增。
 *
 * 少掉兩種：已經登記完成的，以及建檔之前就到期的。後者 app 只是沒有那段
 * 紀錄，多半早就做完了——第 29 週才開始用的孕婦按下匯出，不該拿到十幾筆
 * 排在幾個月前的行程。真的逾期（建檔之後才到期）的照樣匯出，日期也不往今天
 * 挪：那一天過了就是過了，家長看到的應該是事實。
 *
 * 頁面用這份清單的長度寫按鈕上的數字，匯出序列化的也是同一份，所以按下去
 * 拿到的就是那個數字。
 */
export function outstandingPrenatalItems(
  items: ResolvedPrenatalItem[],
  profileCreatedAt?: string,
): ResolvedPrenatalItem[] {
  const beforeProfile = new Set(
    splitOverdueByProfileStart(items, profileCreatedAt).missingHistory.map(
      (item) => item.template.id,
    ),
  );
  return items.filter((item) => item.status !== 'done' && !beforeProfile.has(item.template.id));
}

/** 一筆產檢項目攤成全天行程。日期是建議週對應的那一天。 */
export function prenatalEvent(item: ResolvedPrenatalItem, profileId: string): CalendarEvent {
  const { template } = item;
  return {
    // 不含日期：改了預產期之後重新匯出，行事曆裡原本那筆會跟著移動，
    // 而不是在旁邊多出一筆。
    uid: `${profileId}-${template.id}@littlebloom`,
    date: item.dueDate,
    // 標題不加孩子的名字：這是孕婦自己的行程，公費產檢的標題本來就寫了第幾次。
    title: template.title,
    details: [
      `${prenatalItemKindLabels[template.kind]} · 建議第 ${template.dueWeek} 週`,
      template.description,
      `可執行區間：${formatDate(item.windowStart)} 至 ${formatDate(item.windowEnd)}`,
      '週數依末次月經第一天推算，實際時程請以產檢醫師安排為準。',
      `資料來源：${template.source}`,
    ].join('\n'),
  };
}

/** 將未完成的產檢項目序列化為 RFC 5545 行事曆。`now` 只為了 DTSTAMP，注入以利測試。 */
export function buildPrenatalIcs(
  items: ResolvedPrenatalItem[],
  profile: { id: string; createdAt?: string },
  now: Date = new Date(),
): string {
  return buildCalendar(
    outstandingPrenatalItems(items, profile.createdAt).map((item) =>
      prenatalEvent(item, profile.id),
    ),
    PRODID,
    now,
  );
}
