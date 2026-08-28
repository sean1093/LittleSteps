import { motion } from 'framer-motion';
import { Milk, Moon, Baby, Edit, Trash2 } from 'lucide-react';
import { DailyLog, FeedingData, SleepData, DiaperData } from '../../../types';
import { formatTime, formatDuration, isSameDay } from '../../../common/utils/dateHelpers';
import EmptyState from '../../../common/ui/EmptyState';
import { SERVICE_THEME } from '../../../common/ui/serviceTheme';
import { listItem, stagger } from '../../../common/ui/motion';

interface LogTimelineProps {
  logs: DailyLog[];
  onEdit: (log: DailyLog) => void;
  onDelete: (logId: string) => void;
  /**
   * 目前登入者的 uid。只有別人記的那幾筆會標出記錄者——一個人自己用的時候，
   * 每一列都掛上自己的名字只是噪音。
   */
  currentUserId?: string | null;
  /** 要顯示哪一天。省略時是今天。 */
  date?: Date;
}

export default function LogTimeline({
  logs,
  onEdit,
  onDelete,
  currentUserId,
  date,
}: LogTimelineProps) {
  // Filter today's logs and sort by time (newest first)
  const shownDate = date ?? new Date();
  const isToday = isSameDay(shownDate, new Date());
  const todayLogs = logs
    .filter((log) => isSameDay(log.timestamp, shownDate))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const handleDelete = (log: DailyLog) => {
    if (window.confirm('確定要刪除此記錄嗎？')) {
      onDelete(log.id);
    }
  };

  /*
    The one place a per-row icon earns its keep: three log types interleave in a
    long scroll, and the glyph is what lets you find "the feeds" at a glance.
  */
  const getLogIcon = (type: DailyLog['type']) => {
    switch (type) {
      case 'feeding':
        return <Milk className="w-5 h-5 text-butter-dark" />;
      case 'sleep':
        return <Moon className="w-5 h-5 text-secondary-dark" />;
      case 'diaper':
        return <Baby className="w-5 h-5 text-mint-dark" />;
    }
  };

  const getLogTitle = (type: DailyLog['type']) => {
    switch (type) {
      case 'feeding':
        return '餵奶';
      case 'sleep':
        return '睡眠';
      case 'diaper':
        return '尿布';
    }
  };

  const getLogDetails = (log: DailyLog) => {
    if (log.type === 'feeding') {
      const data = log.data as FeedingData;
      const typeMap = {
        breast_left: '母乳左側',
        breast_right: '母乳右側',
        breast_both: '母乳雙側',
        formula: '配方奶',
        solid: '副食品',
      };
      const parts = [typeMap[data.feedingType]];
      if (data.duration) parts.push(`${data.duration}分鐘`);
      if (data.amount) parts.push(`${data.amount}ml`);
      return parts.join(' · ');
    } else if (log.type === 'sleep') {
      const data = log.data as SleepData;
      if (data.endTime && data.duration) {
        return formatDuration(data.duration);
      } else {
        return '進行中';
      }
    } else {
      const data = log.data as DiaperData;
      const typeMap = {
        pee: '小便',
        poop: '大便',
        both: '大小便都有',
      };
      const parts = [typeMap[data.type]];
      if (data.consistency && (data.type === 'poop' || data.type === 'both')) {
        const consistencyMap = {
          normal: '正常',
          soft: '軟便',
          hard: '硬便',
        };
        parts.push(consistencyMap[data.consistency]);
      }
      return parts.join(' · ');
    }
  };

  if (todayLogs.length === 0) {
    return (
      <EmptyState
        theme={SERVICE_THEME.littlesteps}
        title={isToday ? '今天還沒有記錄' : '這天沒有記錄'}
        description={isToday ? '點擊上方按鈕開始記錄吧！' : '這一天沒有留下任何紀錄'}
      />
    );
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      {todayLogs.map((log) => (
        <motion.div key={log.id} variants={listItem} className="card">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">{getLogIcon(log.type)}</div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-ink-faint">
                  {formatTime(log.timestamp)}
                </span>
                <span className="font-bold">{getLogTitle(log.type)}</span>
              </div>

              <p className="text-sm text-ink-muted">{getLogDetails(log)}</p>

              {log.data.notes && (
                <p className="text-xs text-ink-faint mt-1">備註：{log.data.notes}</p>
              )}

              {/* 「上一餐誰餵的」是兩個人輪流照顧時最常問的問題。只在確定是
                  別人記的時候才顯示：舊紀錄沒有這個欄位，不能因為缺值就猜。 */}
              {log.createdByName && log.createdBy && log.createdBy !== currentUserId && (
                <p className="text-xs text-ink-faint mt-1">由 {log.createdByName} 記錄</p>
              )}
            </div>

            <div className="flex gap-1 flex-shrink-0 -my-2.5">
              <button
                onClick={() => onEdit(log)}
                className="btn-icon text-secondary-dark hover:bg-secondary-soft"
                aria-label="編輯"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(log)}
                className="btn-icon text-red-600 hover:bg-red-50"
                aria-label="刪除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
