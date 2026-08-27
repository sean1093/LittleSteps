import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { User } from 'firebase/auth';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ChildProfile, DailyLog } from '../../types';
import { useReport, ReportPeriod } from '../hooks/useReport';
import ScoreCircle from '../components/shared/ScoreCircle';
import ReportChart from '../components/report/ReportChart';
import { TrendDirection } from '../utils/trendCalculator';
import EmptyState from '../../common/ui/EmptyState';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { stagger, listItem } from '../../common/ui/motion';

interface ReportPageProps {
  currentChild?: ChildProfile;
  dailyLogs: DailyLog[];
  user: User | null;
}

/**
 * Helper: format date string YYYY-MM-DD to MM/DD
 */
function formatDateShort(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  return `${parseInt(parts[1], 10)}/${parseInt(parts[2], 10)}`;
}

/**
 * Helper: generate date labels for the last N days (oldest first)
 */
function generateDateLabels(days: number): string[] {
  const labels: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    labels.push(`${month}/${day}`);
  }
  return labels;
}

/**
 * Helper: render trend icon. Colour and shape together encode the value, so
 * this one stays.
 */
function TrendIcon({ direction }: { direction: TrendDirection }) {
  if (direction === 'increasing') {
    return <TrendingUp className="w-4 h-4 text-primary-dark" />;
  }
  if (direction === 'decreasing') {
    return <TrendingDown className="w-4 h-4 text-mint-dark" />;
  }
  return <Minus className="w-4 h-4 text-ink-faint" />;
}

/**
 * Helper: translate trend direction
 */
function trendLabel(direction: TrendDirection): string {
  if (direction === 'increasing') return '上升';
  if (direction === 'decreasing') return '下降';
  return '穩定';
}

/**
 * Helper: translate poop consistency
 */
function consistencyLabel(key: string): string {
  const map: Record<string, string> = {
    normal: '正常',
    soft: '軟便',
    hard: '硬便',
  };
  return map[key] || key;
}

export default function ReportPage({
  currentChild,
  dailyLogs,
  user,
}: ReportPageProps) {
  const { report, period, setPeriod, loading } = useReport(
    currentChild,
    dailyLogs,
    user
  );

  const days = period === '7days' ? 7 : 30;
  const dateLabels = useMemo(() => generateDateLabels(days), [days]);

  // No child selected
  if (!currentChild) {
    return (
      <div className="screen">
        <div className="screen-body-wide">
          <EmptyState
            theme={SERVICE_THEME.littlesteps}
            title="還沒有選擇寶寶"
            description="請先在側邊欄選擇或新增寶寶"
          />
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="screen">
        <div className="screen-body-wide flex justify-center py-16">
          <div className="w-40 h-1 rounded-full bg-primary-light overflow-hidden" role="status">
            <div className="h-full w-1/3 rounded-full bg-primary-dark animate-[loading_1.2s_ease-in-out_infinite]" />
            <span className="sr-only">載入中</span>
          </div>
        </div>
      </div>
    );
  }

  // Check if we have any data at all
  const hasData =
    report &&
    (report.feeding.avgDailyCount > 0 ||
      report.sleep.avgDailyHours > 0 ||
      report.poop.avgDailyCount > 0);

  // Empty state
  if (!hasData) {
    return (
      <div className="screen">
        <div className="screen-body-wide">
          <EmptyState
            theme={SERVICE_THEME.littlesteps}
            title="還沒有足夠的記錄"
            description={'開始記錄寶寶的日常，就能看到分析報告囉！\n前往「快速日誌」頁面記錄餵奶、睡眠與換尿布'}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <motion.div
        className="screen-body-wide"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Period Toggle */}
        <motion.div variants={listItem} className="mb-6">
          <div className="flex justify-center gap-2 mb-2">
            {(['7days', '30days'] as ReportPeriod[]).map((p) => {
              const labels: Record<ReportPeriod, string> = {
                '7days': '近 7 天',
                '30days': '近 30 天',
              };
              return (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`chip ${period === p ? 'chip-on' : ''}`}
                >
                  {labels[p]}
                </button>
              );
            })}
          </div>
          {report && (
            <p className="text-center text-sm text-ink-muted">
              {formatDateShort(report.period.start)} ~{' '}
              {formatDateShort(report.period.end)}
            </p>
          )}
        </motion.div>

        {report && (
          <>
            {/* Section 1: Score Overview */}
            <motion.div variants={listItem} className="panel mb-4">
              <h2 className="mb-5">總覽評分</h2>
              <div className="flex justify-around">
                <ScoreCircle
                  score={report.scores.feeding.score}
                  label={report.scores.feeding.label}
                  title="餵奶規律度"
                  size={100}
                />
                <ScoreCircle
                  score={report.scores.sleep.score}
                  label={report.scores.sleep.label}
                  title="睡眠品質"
                  size={100}
                />
                <ScoreCircle
                  score={report.scores.poop.score}
                  label={report.scores.poop.label}
                  title="排便正常度"
                  size={100}
                />
              </div>
            </motion.div>

            {/* Section 2: Feeding Report */}
            <motion.div variants={listItem} className="panel mb-4">
              <h2 className="mb-4">餵奶報告</h2>
              <ReportChart
                data={report.feeding.dailyAmounts}
                labels={dateLabels}
                type="line"
                unit="ml"
              />
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-primary-soft rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-primary-dark">
                    {report.feeding.avgDailyCount}
                  </div>
                  <div className="text-sm text-ink-muted">平均每日次數</div>
                </div>
                <div className="bg-primary-soft rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-primary-dark">
                    {report.feeding.avgDailyAmount}
                    <span className="text-sm font-normal ml-0.5">ml</span>
                  </div>
                  <div className="text-sm text-ink-muted">平均每日總量</div>
                </div>
                <div className="bg-warm-white rounded-xl p-3 text-center">
                  <div className="text-sm font-bold text-ink">
                    {report.feeding.maxDay.amount}
                    <span className="text-xs font-normal ml-0.5">ml</span>
                  </div>
                  <div className="text-sm text-ink-muted">
                    最高日 ({formatDateShort(report.feeding.maxDay.date)})
                  </div>
                </div>
                <div className="bg-warm-white rounded-xl p-3 text-center">
                  <div className="text-sm font-bold text-ink">
                    {report.feeding.minDay.amount}
                    <span className="text-xs font-normal ml-0.5">ml</span>
                  </div>
                  <div className="text-sm text-ink-muted">
                    最低日 ({formatDateShort(report.feeding.minDay.date)})
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Section 3: Sleep Report */}
            <motion.div variants={listItem} className="panel mb-4">
              <h2 className="mb-4">睡眠報告</h2>
              <ReportChart
                data={report.sleep.dailyDurations}
                labels={dateLabels}
                type="line"
                unit="小時"
                recommendedValue={report.sleep.recommendedHours}
              />
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-secondary-soft rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-secondary-dark">
                    {report.sleep.avgDailyHours}
                    <span className="text-xs font-normal ml-0.5">h</span>
                  </div>
                  <div className="text-sm text-ink-muted">平均每日時數</div>
                </div>
                <div className="bg-secondary-soft rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-secondary-dark">
                    {report.sleep.longestContinuous > 0
                      ? `${(report.sleep.longestContinuous / 60).toFixed(1)}`
                      : '0'}
                    <span className="text-xs font-normal ml-0.5">h</span>
                  </div>
                  <div className="text-sm text-ink-muted">最長連續睡眠</div>
                </div>
                <div className="bg-secondary-soft rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <TrendIcon direction={report.sleep.nightWakingsTrend} />
                    <span className="text-sm font-bold text-secondary-dark">
                      {trendLabel(report.sleep.nightWakingsTrend)}
                    </span>
                  </div>
                  <div className="text-sm text-ink-muted">夜醒趨勢</div>
                </div>
              </div>
            </motion.div>

            {/* Section 4: Poop Report */}
            <motion.div variants={listItem} className="panel mb-4">
              <h2 className="mb-4">排便報告</h2>
              <ReportChart
                data={report.poop.dailyCounts}
                labels={dateLabels}
                type="bar"
                unit="次"
              />
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-butter-soft rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-butter-dark">
                    {report.poop.avgDailyCount}
                  </div>
                  <div className="text-sm text-ink-muted">平均每日次數</div>
                </div>
                <div className="bg-butter-soft rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-butter-dark">
                    {report.poop.longestGap > 0
                      ? `${report.poop.longestGap}`
                      : '-'}
                    <span className="text-xs font-normal ml-0.5">
                      {report.poop.longestGap > 0 ? 'h' : ''}
                    </span>
                  </div>
                  <div className="text-sm text-ink-muted">最長間隔</div>
                </div>
                <div className="bg-butter-soft rounded-xl p-3 text-center">
                  <div className="text-sm text-ink space-y-0.5">
                    {Object.keys(report.poop.consistencyDistribution).length >
                    0 ? (
                      Object.entries(report.poop.consistencyDistribution).map(
                        ([key, count]) => (
                          <div key={key}>
                            {consistencyLabel(key)}: {count}
                          </div>
                        )
                      )
                    ) : (
                      <span className="text-ink-faint">-</span>
                    )}
                  </div>
                  <div className="text-sm text-ink-muted mt-1">型態分布</div>
                </div>
              </div>
            </motion.div>

            {/* Section 5: Growth Record (30-day only) */}
            {period === '30days' && report.growth && (
              <motion.div variants={listItem} className="panel mb-4">
                <h2 className="mb-4">成長紀錄</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-mint-soft rounded-xl p-4 text-center">
                    <div className="text-lg font-bold text-mint-dark">
                      {report.growth.weightChange > 0 ? '+' : ''}
                      {report.growth.weightChange}
                      <span className="text-xs font-normal ml-0.5">kg</span>
                    </div>
                    <div className="text-sm text-ink-muted">體重變化</div>
                    {report.growth.latestPercentiles.weight !== undefined && (
                      <div className="text-sm text-ink-muted mt-1">
                        百分位: {report.growth.latestPercentiles.weight}%
                      </div>
                    )}
                  </div>
                  <div className="bg-mint-soft rounded-xl p-4 text-center">
                    <div className="text-lg font-bold text-mint-dark">
                      {report.growth.heightChange > 0 ? '+' : ''}
                      {report.growth.heightChange}
                      <span className="text-xs font-normal ml-0.5">cm</span>
                    </div>
                    <div className="text-sm text-ink-muted">身高變化</div>
                    {report.growth.latestPercentiles.height !== undefined && (
                      <div className="text-sm text-ink-muted mt-1">
                        百分位: {report.growth.latestPercentiles.height}%
                      </div>
                    )}
                  </div>
                </div>
                {report.growth.latestPercentiles.headCircumference !==
                  undefined && (
                  <div className="mt-3 text-center text-sm text-ink-muted">
                    頭圍百分位:{' '}
                    {report.growth.latestPercentiles.headCircumference}%
                  </div>
                )}
              </motion.div>
            )}

            {/* Section 6: Summary */}
            <motion.div variants={listItem} className="panel bg-butter-soft">
              <h2 className="mb-3">本期重點摘要</h2>
              <p className="text-sm text-ink leading-relaxed">
                {report.summaryText}
              </p>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
