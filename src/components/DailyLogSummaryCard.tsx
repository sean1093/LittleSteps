import { ClipboardList } from 'lucide-react';
import DashboardCard from './DashboardCard';
import { DailySummary } from '../types';
import { formatDuration } from '../utils/logHelpers';

interface DailyLogSummaryCardProps {
  summary: DailySummary;
  onNavigate: () => void;
}

export default function DailyLogSummaryCard({
  summary,
  onNavigate,
}: DailyLogSummaryCardProps) {
  const hasAnyLogs = summary.feedingCount > 0 || summary.sleepCount > 0 || summary.diaperCount > 0;

  return (
    <DashboardCard
      title="今日記錄"
      icon={ClipboardList}
      iconColor="text-white"
      iconBgGradient="from-blue-400 to-blue-600"
      onClick={onNavigate}
      bgColor="bg-blue-50/50"
    >
      {hasAnyLogs ? (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-3">
            {/* Feeding */}
            <div className="text-center">
              <div className="text-2xl mb-1">🍼</div>
              <div className="text-xl font-bold text-blue-600">{summary.feedingCount}</div>
              <div className="text-xs text-gray-600">餵奶</div>
              {summary.totalFeedingAmount > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  {summary.totalFeedingAmount}ml
                </div>
              )}
            </div>

            {/* Sleep */}
            <div className="text-center">
              <div className="text-2xl mb-1">💤</div>
              <div className="text-xl font-bold text-blue-600">{summary.sleepCount}</div>
              <div className="text-xs text-gray-600">睡眠</div>
              {summary.totalSleepDuration > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  {formatDuration(summary.totalSleepDuration)}
                </div>
              )}
            </div>

            {/* Diaper */}
            <div className="text-center">
              <div className="text-2xl mb-1">💩</div>
              <div className="text-xl font-bold text-blue-600">{summary.diaperCount}</div>
              <div className="text-xs text-gray-600">尿布</div>
              {summary.diaperCount > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  {summary.poopCount > 0 && `${summary.poopCount}大`}
                  {summary.poopCount > 0 && summary.peeCount > 0 && ' '}
                  {summary.peeCount > 0 && `${summary.peeCount}小`}
                </div>
              )}
            </div>
          </div>

          {/* View Details Link */}
          <div className="pt-3 border-t border-gray-200">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
              查看詳細記錄 →
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500 mb-3">今日尚無記錄</p>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
            開始記錄 →
          </button>
        </div>
      )}
    </DashboardCard>
  );
}
