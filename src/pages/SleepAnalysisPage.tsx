import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { User } from 'firebase/auth';
import { Star, TrendingUp, Moon, Sun, Clock } from 'lucide-react';
import { ChildProfile } from '../types';
import { useDailyLogs } from '../hooks/useDailyLogs';
import {
  calculateAge,
  calculateSleepStats,
  calculateSleepRegularity,
  getSleepRecommendation,
  generateSleepAdvice,
  parseHourRange,
} from '../utils/sleepAnalysis';
import SimpleBarChart from '../components/SimpleBarChart';
import SleepTimelineChart from '../components/SleepTimelineChart';

interface SleepAnalysisPageProps {
  currentChild?: ChildProfile | null;
  user: User | null;
}

export default function SleepAnalysisPage({ currentChild, user }: SleepAnalysisPageProps) {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('week');

  // Load daily logs
  const { logs, loading } = useDailyLogs(currentChild?.id || null, user);

  // Filter sleep logs
  const sleepLogs = useMemo(() => {
    return logs.filter((log) => log.type === 'sleep');
  }, [logs]);

  // Calculate statistics
  const stats = useMemo(() => {
    return calculateSleepStats(sleepLogs, period);
  }, [sleepLogs, period]);

  const regularity = useMemo(() => {
    return calculateSleepRegularity(sleepLogs);
  }, [sleepLogs]);

  const ageInMonths = useMemo(() => {
    return currentChild ? calculateAge(currentChild.birthday) : 0;
  }, [currentChild]);

  const recommendation = useMemo(() => {
    return getSleepRecommendation(ageInMonths);
  }, [ageInMonths]);

  const advice = useMemo(() => {
    return generateSleepAdvice(stats, ageInMonths);
  }, [stats, ageInMonths]);

  // Parse recommendation hours
  const { max: maxHours } = parseHourRange(recommendation.totalHours);
  const actualHours = stats.totalDuration / 60;

  // Chart data for actual vs recommended
  const comparisonData = [
    {
      label: '實際睡眠',
      value: actualHours,
      max: maxHours,
      color: 'bg-gradient-to-r from-blue-400 to-blue-500',
    },
    {
      label: '建議睡眠',
      value: maxHours,
      max: maxHours,
      color: 'bg-gradient-to-r from-gray-300 to-gray-400',
    },
  ];

  // Chart data for night vs day
  const nightDayData = [
    {
      label: '夜間睡眠',
      value: stats.nightSleep / 60,
      max: actualHours > 0 ? actualHours : 1,
      color: 'bg-gradient-to-r from-purple-400 to-purple-500',
    },
    {
      label: '白天小睡',
      value: stats.daytimeNaps / 60,
      max: actualHours > 0 ? actualHours : 1,
      color: 'bg-gradient-to-r from-blue-300 to-blue-400',
    },
  ];

  // Calculate regularity stars (5-star rating)
  const bedtimeStars = Math.round((regularity.bedtimeRegularity / 100) * 5);
  const wakeTimeStars = Math.round((regularity.wakeTimeRegularity / 100) * 5);

  // No child selected
  if (!currentChild) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center max-w-md"
        >
          <p className="text-gray-600">請先在側邊欄選擇或新增寶寶</p>
        </motion.div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  // Empty state - no sleep records
  if (sleepLogs.length === 0) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center max-w-md"
        >
          <Moon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">還沒有睡眠記錄</h2>
          <p className="text-gray-600 mb-4">開始記錄寶寶的睡眠，就能看到分析與建議囉！</p>
          <p className="text-sm text-gray-500">前往「快速日誌」頁面記錄睡眠</p>
        </motion.div>
      </div>
    );
  }

  // Insufficient data warning
  const showInsufficientDataWarning = sleepLogs.length < 3;

  return (
    <div className="min-h-screen bg-warm-white pb-6">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {currentChild.name}的睡眠分析
          </h1>
          <p className="text-sm text-gray-600">
            根據睡眠記錄分析寶寶的作息規律，並提供改善建議
          </p>
        </motion.div>

        {/* Insufficient Data Warning */}
        {showInsufficientDataWarning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6"
          >
            <p className="text-sm text-yellow-800">
              ⚠️ 睡眠記錄較少（共 {sleepLogs.length} 筆），分析結果可能不夠準確。建議累積更多記錄後再查看。
            </p>
          </motion.div>
        )}

        {/* Period Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-3 mb-6"
        >
          {(['today', 'week', 'month'] as const).map((p) => {
            const labels = { today: '今日', week: '本週', month: '本月' };
            const isActive = period === p;

            return (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`
                  px-6 py-2 rounded-xl font-medium transition-all
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-soft'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {labels[p]}
              </button>
            );
          })}
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="bg-white rounded-2xl p-4 shadow-soft text-center">
            <div className="text-2xl font-bold text-blue-600">
              {(stats.totalDuration / 60).toFixed(1)}h
            </div>
            <div className="text-xs text-gray-600 mt-1">總時長</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-soft text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.sleepCount}次</div>
            <div className="text-xs text-gray-600 mt-1">睡眠次數</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-soft text-center">
            <div className="text-2xl font-bold text-pink-600">
              {(stats.averageDuration / 60).toFixed(1)}h
            </div>
            <div className="text-xs text-gray-600 mt-1">平均時長</div>
          </div>
        </motion.div>

        {/* Sleep Duration Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-soft mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-800">睡眠時長對比</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            {ageInMonths} 個月大寶寶建議：{recommendation.totalHours}
          </p>
          <SimpleBarChart data={comparisonData} />
        </motion.div>

        {/* Night vs Day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-soft mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Moon className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-gray-800">夜間 vs 白天</h2>
          </div>
          <SimpleBarChart data={nightDayData} height={32} />
          <div className="mt-3 text-sm text-gray-600">
            夜間佔比：
            {stats.totalDuration > 0
              ? `${((stats.nightSleep / stats.totalDuration) * 100).toFixed(0)}%`
              : '0%'}
          </div>
        </motion.div>

        {/* Week Timeline */}
        {sleepLogs.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sun className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold text-gray-800">本週睡眠時間軸</h2>
            </div>
            <SleepTimelineChart weekLogs={sleepLogs} />
          </motion.div>
        )}

        {/* Sleep Regularity */}
        {sleepLogs.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-soft mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-gray-800">睡眠規律性</h2>
            </div>

            {/* Bedtime Regularity */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">入睡時間規律性</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i <= bedtimeStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600">
                平均入睡時間：{regularity.averageBedtime}
              </p>
            </div>

            {/* Wake Time Regularity */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">清醒時間規律性</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i <= wakeTimeStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600">
                平均清醒時間：{regularity.averageWakeTime}
              </p>
            </div>
          </motion.div>
        )}

        {/* Sleep Advice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-lg font-bold text-gray-800 mb-3">💡 改善建議</h2>

          <div className="space-y-3">
            {advice.map((item, index) => {
              const bgColor =
                item.category === 'good'
                  ? 'bg-green-50 border-green-200'
                  : item.category === 'attention'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-red-50 border-red-200';

              const textColor =
                item.category === 'good'
                  ? 'text-green-800'
                  : item.category === 'attention'
                  ? 'text-yellow-800'
                  : 'text-red-800';

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className={`${bgColor} border rounded-2xl p-4`}
                >
                  <h3 className={`font-bold mb-2 ${textColor}`}>{item.title}</h3>
                  <p className={`text-sm mb-3 ${textColor}`}>{item.description}</p>
                  {item.suggestions.length > 0 && (
                    <ul className={`text-sm space-y-1 ${textColor}`}>
                      {item.suggestions.map((suggestion, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
