import type { ResolvedCareTask } from '../../types';
import { formatDate, parseLocalDate, toLocalDateKey } from '../../common/utils/dateHelpers';

const CRLF = '\r\n';

/** RFC 5545 §3.1：一列最多 75 個 octet，不含收尾的 CRLF。 */
const MAX_OCTETS = 75;

/**
 * 下載觸發後才能撤銷 blob URL，否則有些瀏覽器（尤其 iOS Safari）還沒讀完
 * blob 就拿不到內容，家長按了匯出卻得到一個空檔案。原本是 click() 的下一行
 * 就撤銷，等於和下載賽跑。
 */
const REVOKE_DELAY_MS = 40_000;

/** RFC 5545 §3.3.11 文字跳脫。反斜線必須最先處理。 */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/** YYYY-MM-DD → YYYYMMDD */
function toIcsDate(isoDate: string): string {
  return isoDate.replace(/-/g, '');
}

/** 從 code point 算 UTF-8 位元組數，不必為每個字配一個 Uint8Array。 */
function utf8Length(codePoint: number): number {
  if (codePoint < 0x80) return 1;
  if (codePoint < 0x800) return 2;
  if (codePoint < 0x10000) return 3;
  return 4;
}

/**
 * RFC 5545 §3.1 行折疊：超長的列拆開，續行以一個空白開頭。
 *
 * 以 octet 計而非字元數——中文一個字 3 bytes，繁體中文的 DESCRIPTION 動輒
 * 超過 90 bytes，嚴格的解析器會整列丟掉。切點必須落在字元邊界，切在 UTF-8
 * 中間會產生亂碼，所以逐 code point 累加而不是切 byte 陣列。
 */
function foldLine(line: string): string {
  const segments: string[] = [];
  let segment = '';
  let octets = 0;
  let budget = MAX_OCTETS;

  for (const char of line) {
    const size = utf8Length(char.codePointAt(0) as number);
    if (octets + size > budget) {
      segments.push(segment);
      segment = '';
      octets = 0;
      // 續行的前導空白也計入 75 octet。
      budget = MAX_OCTETS - 1;
    }
    segment += char;
    octets += size;
  }
  segments.push(segment);

  return segments.join(`${CRLF} `);
}

/** RFC 5545 §3.3.5 UTC date-time：YYYYMMDDTHHMMSSZ。 */
function toIcsTimestamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/** 全天事件的 DTEND 為 exclusive，需為隔日。 */
function nextDay(isoDate: string): string {
  const date = parseLocalDate(isoDate);
  date.setDate(date.getDate() + 1);
  return toLocalDateKey(date);
}

function eventTitle(task: ResolvedCareTask, childName: string): string {
  return `${childName}：${task.template.title}`;
}

function eventDetails(task: ResolvedCareTask): string {
  // 家長讀的是行事曆內文，不是資料庫欄位：日期照 app 其他地方的寫法。
  return `${task.template.description}\n可執行區間至 ${formatDate(task.windowEnd)}\n資料來源：${task.template.source}`;
}

function buildEvent(
  task: ResolvedCareTask,
  childName: string,
  dtstamp: string,
): string[] {
  return [
    'BEGIN:VEVENT',
    `UID:${task.template.id}-${toIcsDate(task.dueDate)}@littleexplorer`,
    // RFC 5545 §3.6.1 要求 VEVENT 必須有 DTSTAMP；少了它，嚴格的匯入端
    // （Outlook、部分 CalDAV 伺服器）會整個檔案拒收。
    `DTSTAMP:${dtstamp}`,
    `DTSTART;VALUE=DATE:${toIcsDate(task.dueDate)}`,
    `DTEND;VALUE=DATE:${toIcsDate(nextDay(task.dueDate))}`,
    `SUMMARY:${escapeText(eventTitle(task, childName))}`,
    `DESCRIPTION:${escapeText(eventDetails(task))}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'TRIGGER:-P7D',
    `DESCRIPTION:${escapeText(eventTitle(task, childName))}`,
    'END:VALARM',
    'END:VEVENT',
  ];
}

/**
 * 將未完成的照護任務序列化為 RFC 5545 行事曆。
 * 全天事件，各附提前 7 天的顯示提醒。
 *
 * `now` 只為了 DTSTAMP，注入以利測試。
 */
export function buildIcs(
  tasks: ResolvedCareTask[],
  childName: string,
  now: Date = new Date(),
): string {
  const dtstamp = toIcsTimestamp(now);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//LittleExplorer//幼兒照護時程//ZH-TW',
    'CALSCALE:GREGORIAN',
    ...tasks
      .filter((task) => task.status !== 'done')
      .flatMap((task) => buildEvent(task, childName, dtstamp)),
    'END:VCALENDAR',
  ];
  return lines.map(foldLine).join(CRLF) + CRLF;
}

/** 單筆任務的 Google 日曆快速加入連結。 */
export function buildGoogleCalendarUrl(
  task: ResolvedCareTask,
  childName: string,
): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventTitle(task, childName),
    details: eventDetails(task),
    dates: `${toIcsDate(task.dueDate)}/${toIcsDate(nextDay(task.dueDate))}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** 觸發 .ics 下載。純瀏覽器副作用，故不在單元測試涵蓋範圍。 */
export function downloadIcs(
  tasks: ResolvedCareTask[],
  childName: string,
): void {
  const blob = new Blob([buildIcs(tasks, childName)], {
    type: 'text/calendar;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${childName}-照護時程.ics`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), REVOKE_DELAY_MS);
}
