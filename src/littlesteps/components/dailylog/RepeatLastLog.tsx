import { motion } from 'framer-motion';
import { DailyLog, DiaperData, FeedingData } from '../../../types';
import {
  getConsistencyLabel,
  getDiaperTypeLabel,
  getFeedingTypeLabel,
} from '../../utils/logHelpers';
import { tap } from '../../../common/ui/motion';

interface RepeatLastLogProps {
  /** 上一次真的餵進寶寶嘴裡的那一筆。 */
  lastFeeding: DailyLog | null;
  /** 上一次擠奶。獨立一顆：擠奶不是一餐，也不該擋住「再餵一次」。 */
  lastPumping: DailyLog | null;
  lastDiaper: DailyLog | null;
  onRepeat: (log: DailyLog) => void | Promise<void>;
}

/** 「配方奶 120 ml」這種一眼看得出要存什麼的短句。 */
function describe(log: DailyLog): string {
  if (log.type === 'feeding') {
    const data = log.data as FeedingData;
    /*
      擠奶的類型字已經是這顆按鈕的標題。再印一次會變成「擠奶（擠奶 150 ml）」，
      而寫成「餵奶（擠奶 150 ml）」更糟：那正是把媽媽的產出說成寶寶一餐的說法。
    */
    const parts = data.feedingType === 'pumping' ? [] : [getFeedingTypeLabel(data.feedingType)];
    if (data.amount) parts.push(`${data.amount} ml`);
    else if (data.duration) parts.push(`${data.duration} 分鐘`);
    return parts.join(' ');
  }

  const data = log.data as DiaperData;
  const consistency = getConsistencyLabel(data.consistency);
  return consistency ? `${getDiaperTypeLabel(data.type)} ${consistency}` : getDiaperTypeLabel(data.type);
}

/**
 * 一鍵重複上一筆。
 *
 * 同一位家長一天會記八次一模一樣的餵奶，而每一次都要開表單、選類型、打奶量。
 * 這裡直接用上一筆的內容寫一筆新的，時間是現在，完全不開表單。
 */
export default function RepeatLastLog({
  lastFeeding,
  lastPumping,
  lastDiaper,
  onRepeat,
}: RepeatLastLogProps) {
  const targets = [
    { label: '餵奶', log: lastFeeding },
    { label: '擠奶', log: lastPumping },
    { label: '尿布', log: lastDiaper },
  ].filter((target): target is { label: string; log: DailyLog } => target.log !== null);

  if (targets.length === 0) return null;

  return (
    <div className="card">
      <p className="mb-2 text-sm text-ink-muted">再記一次上次的</p>
      <div className="flex flex-wrap gap-2">
        {targets.map((target) => (
          <motion.button
            key={target.label}
            type="button"
            whileTap={tap}
            onClick={() => onRepeat(target.log)}
            className="chip flex-1 min-w-tap justify-center"
          >
            {target.label}（{describe(target.log)}）
          </motion.button>
        ))}
      </div>
    </div>
  );
}
