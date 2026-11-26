import DashboardCard from '../dashboard/DashboardCard';
import SparklineChart from '../shared/SparklineChart';
import { DailySummary, DailyLog } from '../../../types';
import { findLastLog, formatDuration, isIntakeFeedingLog } from '../../utils/logHelpers';
import LastEventLines from './LastEventLines';
import { getFeedingTrend } from '../../utils/trendCalculator';

interface DailyLogSummaryCardProps {
  summary: DailySummary;
  dailyLogs: DailyLog[];
  onNavigate: () => void;
}

export default function DailyLogSummaryCard({
  summary,
  dailyLogs,
  onNavigate,
}: DailyLogSummaryCardProps) {
  const hasAnyLogs = summary.feedingCount > 0 || summary.sleepCount > 0 || summary.diaperCount > 0;
  const feedingTrend = getFeedingTrend(dailyLogs, 7);
  // 擠奶不是一餐：跟日誌頁的「上次餵奶」用同一個定義，兩頁才不會給出兩個答案。
  const lastFeeding = findLastLog(dailyLogs, isIntakeFeedingLog);
  const lastDiaper = findLastLog(dailyLogs, (log) => log.type === 'diaper');

  return (
    <DashboardCard title="今日記錄" onClick={onNavigate} bgColor="bg-secondary-light/30">
      {/* 排在今天的數字前面，也不管今天記了沒：凌晨打開時「今天」還是空的，
          而家長要問的正是昨晚最後一餐是幾點。 */}
      <LastEventLines lastFeeding={lastFeeding} lastDiaper={lastDiaper} />
      {hasAnyLogs ? (
        <>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-xl font-bold text-secondary-dark">{summary.feedingCount}</div>
              <div className="text-xs text-ink-muted">餵奶</div>
              {summary.totalFeedingAmount > 0 && (
                <div className="text-xs text-ink-faint mt-1">
                  {summary.totalFeedingAmount}ml
                </div>
              )}
            </div>

            <div className="text-center">
              <div className="text-xl font-bold text-secondary-dark">{summary.sleepCount}</div>
              <div className="text-xs text-ink-muted">睡眠</div>
              {summary.totalSleepDuration > 0 && (
                <div className="text-xs text-ink-faint mt-1">
                  {formatDuration(summary.totalSleepDuration)}
                </div>
              )}
            </div>

            <div className="text-center">
              <div className="text-xl font-bold text-secondary-dark">{summary.diaperCount}</div>
              <div className="text-xs text-ink-muted">尿布</div>
              {summary.diaperCount > 0 && (
                <div className="text-xs text-ink-faint mt-1">
                  {summary.poopCount > 0 && `${summary.poopCount}大`}
                  {summary.poopCount > 0 && summary.peeCount > 0 && ' '}
                  {summary.peeCount > 0 && `${summary.peeCount}小`}
                </div>
              )}
            </div>
          </div>

          {feedingTrend.sparklinePoints.some(v => v > 0) && (
            <div className="bg-white rounded-xl p-3">
              <div className="text-xs text-ink-muted mb-2">近 7 天餵奶量趨勢</div>
              <SparklineChart data={feedingTrend.sparklinePoints} height={36} />
              <div className="text-xs text-ink-faint mt-1">
                平均 {Math.round(feedingTrend.averageValue)}ml
              </div>
            </div>
          )}
        </>
      ) : (
        // 整張卡就是通往日誌的那顆按鈕（DashboardCard 的 onClick），所以這裡只
        // 需要說下一步是什麼，不必再巢狀一顆做同一件事的按鈕。
        <p className="py-2 text-sm text-ink-muted">
          還沒有今天的紀錄。記第一筆：餵奶、睡眠或尿布，點一下就好。
        </p>
      )}
    </DashboardCard>
  );
}
