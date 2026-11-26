import { DailyLog, FeedingData } from '../../../types';
import { getFeedingTypeLabel } from '../../utils/logHelpers';

const MINUTE_MS = 60_000;
const MINUTES_PER_DAY = 24 * 60;

/**
 * 「多久以前」，給「上次餵奶」這種一眼要讀完的句子用。
 *
 * 粒度跟著距離走：家長問的是「該不該餵了」，一小時內要看得到分鐘，幾小時內
 * 要小時加分鐘，過了一天之後分鐘已經沒有意義——那時這句話在說的是「很久沒記了」。
 *
 * 不滿一分鐘、或時間落在未來（兩支手機的時鐘差幾秒）一律是「剛剛」，不印
 * 「0 分鐘前」，更不印負數。讀不懂的時間回空字串，由呼叫端決定要不要畫。
 */
export function formatTimeAgo(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';

  const minutes = Math.floor((now.getTime() - then) / MINUTE_MS);
  if (minutes < 1) return '剛剛';
  if (minutes < 60) return `${minutes} 分鐘前`;
  if (minutes < MINUTES_PER_DAY) {
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return rest === 0 ? `${hours} 小時前` : `${hours} 小時 ${rest} 分鐘前`;
  }
  return `${Math.floor(minutes / MINUTES_PER_DAY)} 天前`;
}

/**
 * 上一餐是什麼：「母乳（左）」「配方奶」。
 *
 * 親餵的家長下一餐要換邊，所以這裡印的是那一餐自己的類型，而類型本身就帶著
 * 哪一邊。
 */
export function lastFeedingDetail(log: DailyLog): string {
  return getFeedingTypeLabel((log.data as FeedingData).feedingType);
}
