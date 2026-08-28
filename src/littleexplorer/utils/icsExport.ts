import type { ResolvedCareTask } from '../../types';
import { parseLocalDate, toLocalDateKey } from '../../common/utils/dateHelpers';

const CRLF = '\r\n';

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
  return `${task.template.description}\n可執行區間至 ${task.windowEnd}\n資料來源：${task.template.source}`;
}

function buildEvent(task: ResolvedCareTask, childName: string): string[] {
  return [
    'BEGIN:VEVENT',
    `UID:${task.template.id}-${toIcsDate(task.dueDate)}@littleexplorer`,
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
 */
export function buildIcs(tasks: ResolvedCareTask[], childName: string): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//LittleExplorer//幼兒照護時程//ZH-TW',
    'CALSCALE:GREGORIAN',
    ...tasks
      .filter((task) => task.status !== 'done')
      .flatMap((task) => buildEvent(task, childName)),
    'END:VCALENDAR',
  ];
  return lines.join(CRLF) + CRLF;
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
  URL.revokeObjectURL(url);
}
