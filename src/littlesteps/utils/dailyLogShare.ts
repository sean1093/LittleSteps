import type { DailyLog, DiaperData, FeedingData, SleepData } from '../../types';
import { isSameDay } from '../../common/utils/dateHelpers';
import {
  findLastLog,
  formatDuration,
  formatTime,
  getConsistencyLabel,
  getDiaperTypeLabel,
  getFeedingTypeLabel,
  isIntakeFeedingLog,
  isStaleOpenSleep,
  sortLogsByTime,
} from './logHelpers';

/**
 * Today's daily log as plain text, for handing over to a sitter or a
 * grandparent who is not a member of the child's record.
 *
 * The text is the only thing that leaves: no link, no token, no read path for
 * anyone else. The parent sees it before sending it. It names the child the
 * way the parent already sees them and carries nothing else that identifies
 * them, birthday included.
 *
 * Pumping is the mother's output, not a feed, so it is left out of the feeds
 * and out of "last feed", as everywhere else in the app.
 */

function feedingLine(log: DailyLog): string {
  const data = log.data as FeedingData;
  const parts = [formatTime(log.timestamp), getFeedingTypeLabel(data.feedingType)];
  if (data.amount) parts.push(`${data.amount} ml`);
  if (data.duration) parts.push(`${data.duration} 分鐘`);
  return parts.join(' ');
}

function sleepLine(log: DailyLog): string {
  const data = log.data as SleepData;
  const start = formatTime(data.startTime);
  if (!data.endTime) return `${start} 入睡，還在睡`;
  const minutes = data.duration ?? Math.round(
    (new Date(data.endTime).getTime() - new Date(data.startTime).getTime()) / 60_000,
  );
  return `${start}–${formatTime(data.endTime)}（${formatDuration(minutes)}）`;
}

function diaperLine(log: DailyLog): string {
  const data = log.data as DiaperData;
  const consistency = getConsistencyLabel(data.consistency);
  return [formatTime(log.timestamp), getDiaperTypeLabel(data.type), consistency]
    .filter(Boolean)
    .join(' ');
}

/** "11/26 03:12" when the last one was not today, so last night is not read as just now. */
function when(log: DailyLog, now: Date): string {
  const date = new Date(log.timestamp);
  const time = formatTime(log.timestamp);
  return isSameDay(date, now) ? time : `${date.getMonth() + 1}/${date.getDate()} ${time}`;
}

/**
 * @param logs this child's logs; today's are picked out here, and the "last
 *   of each" lines look across all of them, since the last feed is often
 *   last night's.
 */
export function buildDailyLogShareText(
  childName: string,
  logs: DailyLog[],
  now: Date = new Date(),
): string {
  const today = sortLogsByTime(logs.filter((log) => isSameDay(log.timestamp, now))).reverse();
  const feeds = today.filter(isIntakeFeedingLog);
  // A sleep left open past the stale limit is a missing end time, not a sleep.
  const sleeps = today.filter((log) => log.type === 'sleep' && !isStaleOpenSleep(log, now));
  const diapers = today.filter((log) => log.type === 'diaper');

  const lines = [`【${childName} 今天的紀錄】${now.getMonth() + 1}/${now.getDate()}`];

  if (feeds.length + sleeps.length + diapers.length === 0) {
    lines.push('今天還沒有紀錄。');
  } else {
    const section = (title: string, items: DailyLog[], line: (log: DailyLog) => string) => {
      if (items.length === 0) return;
      lines.push('', `${title}（${items.length} 次）`, ...items.map(line));
    };
    section('餵奶', feeds, feedingLine);
    section('睡眠', sleeps, sleepLine);
    section('尿布', diapers, diaperLine);
  }

  const lastFeed = findLastLog(logs, isIntakeFeedingLog);
  const lastSleep = findLastLog(logs, (log) => log.type === 'sleep' && !isStaleOpenSleep(log, now));
  const lastDiaper = findLastLog(logs, (log) => log.type === 'diaper');
  const last = [
    lastFeed && `上次餵奶：${when(lastFeed, now)} ${getFeedingTypeLabel((lastFeed.data as FeedingData).feedingType)}`,
    lastSleep &&
      ((lastSleep.data as SleepData).endTime
        ? `上次睡醒：${when({ ...lastSleep, timestamp: (lastSleep.data as SleepData).endTime! }, now)}`
        : `現在在睡：${when(lastSleep, now)} 入睡`),
    lastDiaper && `上次換尿布：${when(lastDiaper, now)} ${getDiaperTypeLabel((lastDiaper.data as DiaperData).type)}`,
  ].filter((line): line is string => Boolean(line));
  if (last.length > 0) lines.push('', ...last);

  return lines.join('\n');
}
