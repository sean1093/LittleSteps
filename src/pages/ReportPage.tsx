import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { User } from 'firebase/auth';
import {
  FileBarChart,
  Baby,
  Moon,
  Droplets,
  TrendingUp,
  TrendingDown,
  Minus,
  Ruler,
  Weight,
  Lightbulb,
} from 'lucide-react';
import { ChildProfile, DailyLog } from '../types';
import { useReport, ReportPeriod } from '../hooks/useReport';
import ScoreCircle from '../components/ScoreCircle';
import ReportChart from '../components/ReportChart';
import { TrendDirection } from '../utils/trendCalculator';

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
 * Helper: render trend icon
 */
function TrendIcon({ direction }: { direction: TrendDirection }) {
  if (direction === 'increasing') {
    return <TrendingUp className="w-4 h-4 text-red-400" />;
  }
  if (direction === 'decreasing') {
    return <TrendingDown className="w-4 h-4 text-green-500" />;
  }
  return <Minus className="w-4 h-4 text-gray-400" />;
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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

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
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-soft p-8 text-center max-w-md"
        >
          <Baby className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">請先在側邊欄選擇或新增寶寶</p>
        </motion.div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#7EC8E3] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">載入中...</p>
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
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-soft p-8 text-center max-w-md"
        >
          <FileBarChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            還沒有足夠的記錄
          </h2>
          <p className="text-gray-600 mb-4">
            開始記錄寶寶的日常，就能看到分析報告囉！
          </p>
          <p className="text-sm text-gray-500">
            前往「快速日誌」頁面記錄餵奶、睡眠與換尿布
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-6">
      <motion.div
        className="max-w-2xl mx-auto px-4 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <FileBarChart className="w-5 h-5 text-[#7EC8E3]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">週報月報</h1>
          </div>
          <p className="text-sm text-gray-500 ml-[52px]">
            {currentChild.name}
            的照護數據總覽
          </p>
        </motion.div>

        {/* Period Toggle */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex justify-center gap-3 mb-2">
            {(['7days', '30days'] as ReportPeriod[]).map((p) => {
              const labels: Record<ReportPeriod, string> = {
                '7days': '近 7 天',
                '30days': '近 30 天',
              };
              const isActive = period === p;
              return (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`
                    px-6 py-2 rounded-xl font-medium transition-all
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-[#7EC8E3] to-[#FF9B9B] text-white shadow-soft'
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-soft'
                    }
                  `}
                >
                  {labels[p]}
                </button>
              );
            })}
          </div>
          {report && (
            <p className="text-center text-xs text-gray-400">
              {formatDateShort(report.period.start)} ~{' '}
              {formatDateShort(report.period.end)}
            </p>
          )}
        </motion.div>

        {report && (
          <>
            {/* Section 1: Score Overview */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-soft p-6 mb-6"
            >
              <h2 className="text-lg font-bold text-gray-800 mb-5">
                總覽評分
              </h2>
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
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-soft p-6 mb-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Baby className="w-5 h-5 text-[#FF9B9B]" />
                <h2 className="text-lg font-bold text-gray-800">餵奶報告</h2>
              </div>
              <ReportChart
                data={report.feeding.dailyAmounts}
                labels={dateLabels}
                type="line"
                color="#FF9B9B"
                unit="ml"
              />
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-pink-50 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-pink-600">
                    {report.feeding.avgDailyCount}
                  </div>
                  <div className="text-xs text-gray-600">平均每日次數</div>
                </div>
                <div className="bg-pink-50 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-pink-600">
                    {report.feeding.avgDailyAmount}
                    <span className="text-sm font-normal ml-0.5">ml</span>
                  </div>
                  <div className="text-xs text-gray-600">平均每日總量</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-sm font-bold text-gray-700">
                    {report.feeding.maxDay.amount}
                    <span className="text-xs font-normal ml-0.5">ml</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    最高日 ({formatDateShort(report.feeding.maxDay.date)})
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-sm font-bold text-gray-700">
                    {report.feeding.minDay.amount}
                    <span className="text-xs font-normal ml-0.5">ml</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    最低日 ({formatDateShort(report.feeding.minDay.date)})
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Section 3: Sleep Report */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-soft p-6 mb-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Moon className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-bold text-gray-800">睡眠報告</h2>
              </div>
              <ReportChart
                data={report.sleep.dailyDurations}
                labels={dateLabels}
                type="line"
                color="#818cf8"
                unit="小時"
                recommendedValue={report.sleep.recommendedHours}
              />
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-indigo-50 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-indigo-600">
                    {report.sleep.avgDailyHours}
                    <span className="text-xs font-normal ml-0.5">h</span>
                  </div>
                  <div className="text-xs text-gray-600">平均每日時數</div>
                </div>
                <div className="bg-indigo-50 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-indigo-600">
                    {report.sleep.longestContinuous > 0
                      ? `${(report.sleep.longestContinuous / 60).toFixed(1)}`
                      : '0'}
                    <span className="text-xs font-normal ml-0.5">h</span>
                  </div>
                  <div className="text-xs text-gray-600">最長連續睡眠</div>
                </div>
                <div className="bg-indigo-50 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <TrendIcon direction={report.sleep.nightWakingsTrend} />
                    <span className="text-sm font-bold text-indigo-600">
                      {trendLabel(report.sleep.nightWakingsTrend)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">夜醒趨勢</div>
                </div>
              </div>
            </motion.div>

            {/* Section 4: Poop Report */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-soft p-6 mb-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Droplets className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-gray-800">排便報告</h2>
              </div>
              <ReportChart
                data={report.poop.dailyCounts}
                labels={dateLabels}
                type="bar"
                color="#f59e0b"
                unit="次"
              />
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-amber-50 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-amber-600">
                    {report.poop.avgDailyCount}
                  </div>
                  <div className="text-xs text-gray-600">平均每日次數</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-amber-600">
                    {report.poop.longestGap > 0
                      ? `${report.poop.longestGap}`
                      : '-'}
                    <span className="text-xs font-normal ml-0.5">
                      {report.poop.longestGap > 0 ? 'h' : ''}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">最長間隔</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-700 space-y-0.5">
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
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">型態分布</div>
                </div>
              </div>
            </motion.div>

            {/* Section 5: Growth Record (30-day only) */}
            {period === '30days' && report.growth && (
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-soft p-6 mb-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Ruler className="w-5 h-5 text-green-500" />
                  <h2 className="text-lg font-bold text-gray-800">
                    成長紀錄
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <Weight className="w-5 h-5 text-green-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-green-600">
                      {report.growth.weightChange > 0 ? '+' : ''}
                      {report.growth.weightChange}
                      <span className="text-xs font-normal ml-0.5">kg</span>
                    </div>
                    <div className="text-xs text-gray-600">體重變化</div>
                    {report.growth.latestPercentiles.weight !== undefined && (
                      <div className="text-xs text-gray-400 mt-1">
                        百分位: {report.growth.latestPercentiles.weight}%
                      </div>
                    )}
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <Ruler className="w-5 h-5 text-green-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-green-600">
                      {report.growth.heightChange > 0 ? '+' : ''}
                      {report.growth.heightChange}
                      <span className="text-xs font-normal ml-0.5">cm</span>
                    </div>
                    <div className="text-xs text-gray-600">身高變化</div>
                    {report.growth.latestPercentiles.height !== undefined && (
                      <div className="text-xs text-gray-400 mt-1">
                        百分位: {report.growth.latestPercentiles.height}%
                      </div>
                    )}
                  </div>
                </div>
                {report.growth.latestPercentiles.headCircumference !==
                  undefined && (
                  <div className="mt-3 text-center text-sm text-gray-500">
                    頭圍百分位:{' '}
                    {report.growth.latestPercentiles.headCircumference}%
                  </div>
                )}
              </motion.div>
            )}

            {/* Section 6: Summary */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl shadow-soft p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-gray-800">
                  本期重點摘要
                </h2>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {report.summaryText}
              </p>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
