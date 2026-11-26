import { useEffect, useState } from 'react';
import { DailyLog } from '../../../types';
import { formatTimeAgo, lastFeedingDetail } from './lastEvent';

interface LastEventLinesProps {
  /** 上一次真的餵進寶寶嘴裡的那一筆；擠奶不算。 */
  lastFeeding: DailyLog | null;
  lastDiaper: DailyLog | null;
}

/** 跟 OpenSleepCard 同一個節奏：讀數最多落後 30 秒。 */
const TICK_MS = 30_000;

/**
 * 「上次什麼時候餵的？」——家長打開這個 app 最常想知道的一件事。
 *
 * 這兩筆紀錄頁面本來就找出來了，卻只拿去做「再記一次」的按鈕；要知道答案得
 * 自己滑到時間軸、找到那一筆、再心算現在幾點減幾點。
 *
 * 沒有 aria-live：這是每 30 秒自己變的讀數，朗讀出來只會一直打斷人。
 */
export default function LastEventLines({ lastFeeding, lastDiaper }: LastEventLinesProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), TICK_MS);
    return () => window.clearInterval(timer);
  }, []);

  const feedingAgo = lastFeeding ? formatTimeAgo(lastFeeding.timestamp, now) : '';
  const diaperAgo = lastDiaper ? formatTimeAgo(lastDiaper.timestamp, now) : '';
  if (!feedingAgo && !diaperAgo) return null;

  return (
    <div className="space-y-1">
      {lastFeeding && feedingAgo && (
        <p className="text-sm text-ink-muted">
          上次餵奶 <span className="font-semibold text-ink">{feedingAgo}</span> ·{' '}
          {lastFeedingDetail(lastFeeding)}
        </p>
      )}
      {diaperAgo && (
        <p className="text-sm text-ink-muted">
          上次換尿布 <span className="font-semibold text-ink">{diaperAgo}</span>
        </p>
      )}
    </div>
  );
}
