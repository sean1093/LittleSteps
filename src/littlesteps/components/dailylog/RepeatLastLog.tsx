import { motion } from 'framer-motion';
import { DailyLog, DiaperData, FeedingData } from '../../../types';
import {
  getConsistencyLabel,
  getDiaperTypeLabel,
  getFeedingTypeLabel,
} from '../../utils/logHelpers';
import { tap } from '../../../common/ui/motion';

interface RepeatLastLogProps {
  /** 上一筆餵奶與上一筆尿布，各自可能不存在。 */
  lastFeeding: DailyLog | null;
  lastDiaper: DailyLog | null;
  onRepeat: (log: DailyLog) => void | Promise<void>;
}

/** 「配方奶 120 ml」這種一眼看得出要存什麼的短句。 */
function describe(log: DailyLog): string {
  if (log.type === 'feeding') {
    const data = log.data as FeedingData;
    const parts = [getFeedingTypeLabel(data.feedingType)];
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
export default function RepeatLastLog({ lastFeeding, lastDiaper, onRepeat }: RepeatLastLogProps) {
  const targets = [
    { label: '餵奶', log: lastFeeding },
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
            className="chip flex-1 justify-center"
          >
            {target.label}（{describe(target.log)}）
          </motion.button>
        ))}
      </div>
    </div>
  );
}
