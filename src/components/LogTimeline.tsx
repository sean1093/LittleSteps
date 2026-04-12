import { motion } from 'framer-motion';
import { Milk, Moon, Baby, Edit, Trash2, Clock } from 'lucide-react';
import { DailyLog, FeedingData, SleepData, DiaperData } from '../types';
import { formatTime, formatDuration, isSameDay } from '../utils/dateHelpers';

interface LogTimelineProps {
  logs: DailyLog[];
  onEdit: (log: DailyLog) => void;
  onDelete: (logId: string) => void;
}

export default function LogTimeline({ logs, onEdit, onDelete }: LogTimelineProps) {
  // Filter today's logs and sort by time (newest first)
  const todayLogs = logs
    .filter((log) => isSameDay(log.timestamp, new Date()))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const handleDelete = (log: DailyLog) => {
    if (window.confirm('確定要刪除此記錄嗎？')) {
      onDelete(log.id);
    }
  };

  const getLogIcon = (type: DailyLog['type']) => {
    switch (type) {
      case 'feeding':
        return <Milk className="w-5 h-5 text-blue-500" />;
      case 'sleep':
        return <Moon className="w-5 h-5 text-purple-500" />;
      case 'diaper':
        return <Baby className="w-5 h-5 text-pink-500" />;
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

  // Empty state
  if (todayLogs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 px-4"
      >
        <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">今天還沒有記錄</p>
        <p className="text-gray-400 text-sm mt-2">點擊上方按鈕開始記錄吧！</p>
      </motion.div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      {todayLogs.map((log) => (
        <motion.div
          key={log.id}
          variants={itemVariants}
          whileHover={{ y: -2 }}
          className="bg-white rounded-2xl p-4 shadow-soft"
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 mt-1">{getLogIcon(log.type)}</div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Time and Title */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-500">
                  {formatTime(log.timestamp)}
                </span>
                <span className="text-base font-bold text-gray-800">
                  {getLogTitle(log.type)}
                </span>
              </div>

              {/* Details */}
              <p className="text-sm text-gray-600">{getLogDetails(log)}</p>

              {/* Notes */}
              {log.data.notes && (
                <p className="text-xs text-gray-500 mt-1 italic">
                  備註：{log.data.notes}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => onEdit(log)}
                className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                aria-label="編輯"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(log)}
                className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
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
