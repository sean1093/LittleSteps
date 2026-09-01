import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { User } from 'firebase/auth';
import { Star } from 'lucide-react';
import { ChildProfile } from '../../types';
import { useDailyLogs } from '../hooks/useDailyLogs';
import { calculateAge } from '../../common/utils/dateHelpers';
import {
  calculateSleepStats,
  calculateSleepRegularity,
  generateSleepAdvice,
  parseHourRange,
} from '../utils/sleepAnalysis';
import { getSleepRequirementForAge } from '../data/sleep';
import SimpleBarChart from '../components/sleep/SimpleBarChart';
import SleepTimelineChart from '../components/sleep/SleepTimelineChart';
import EmptyState from '../../common/ui/EmptyState';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { stagger, listItem } from '../../common/ui/motion';

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
    return getSleepRequirementForAge(ageInMonths);
  }, [ageInMonths]);

  const advice = useMemo(() => {
    return generateSleepAdvice(stats, ageInMonths);
  }, [stats, ageInMonths]);

  // Parse recommendation hours
  const { max: maxHours } = parseHourRange(recommendation.totalHours);
  const actualHours = stats.dailyAverage / 60; // 使用每日平均

  // 分母是「有記錄的天數」，不是視窗長度。除以固定的 7 或 30 會把一晚 10 小時
  // 算成每日 0.3 小時，然後對照建議時數說睡眠不足——那不是結論，是沒記錄。
  const hasRecords = stats.daysWithRecords > 0;
  const dailyNightSleep = hasRecords ? stats.nightSleep / stats.daysWithRecords / 60 : 0;
  const dailyDaytimeNaps = hasRecords ? stats.daytimeNaps / stats.daysWithRecords / 60 : 0;

  // Chart data for actual vs recommended. Bars carry no text, so the DEFAULT
  // token fills are the right shades here.
  const comparisonData = [
    {
      label: period === 'today' ? '今日睡眠' : '每日平均',
      value: actualHours,
      max: maxHours,
      color: 'bg-primary',
    },
    {
      label: '建議睡眠',
      value: maxHours,
      max: maxHours,
      color: 'bg-ink/20',
    },
  ];

  // Chart data for night vs day
  const nightDayData = [
    {
      label: '夜間睡眠',
      value: dailyNightSleep,
      max: actualHours > 0 ? actualHours : 1,
      color: 'bg-secondary',
    },
    {
      label: '白天小睡',
      value: dailyDaytimeNaps,
      max: actualHours > 0 ? actualHours : 1,
      color: 'bg-butter',
    },
  ];

  // Calculate regularity stars (5-star rating)
  const bedtimeStars = Math.round((regularity.bedtimeRegularity / 100) * 5);
  const wakeTimeStars = Math.round((regularity.wakeTimeRegularity / 100) * 5);

  // No child selected
  if (!currentChild) {
    return (
      <div className="screen">
        <div className="screen-body">
          <EmptyState
            theme={SERVICE_THEME.littlesteps}
            title="還沒有寶寶的資料"
            description="請點右上角的帳號按鈕新增或選擇寶寶。"
          />
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="screen">
        <div className="screen-body flex justify-center py-16">
          <div className="w-40 h-1 rounded-full bg-primary-light overflow-hidden" role="status">
            <div className="h-full w-1/3 rounded-full bg-primary-dark animate-[loading_1.2s_ease-in-out_infinite]" />
            <span className="sr-only">載入中</span>
          </div>
        </div>
      </div>
    );
  }

  // Empty state - no sleep records
  if (sleepLogs.length === 0) {
    return (
      <div className="screen">
        <div className="screen-body">
          <EmptyState
            theme={SERVICE_THEME.littlesteps}
            title="還沒有睡眠記錄"
            description={'開始記錄寶寶的睡眠，就能看到分析與建議囉！\n前往「快速日誌」頁面記錄睡眠'}
          />
        </div>
      </div>
    );
  }

  // Insufficient data warning
  const showInsufficientDataWarning = sleepLogs.length < 3;

  return (
    <div className="screen">
      <motion.div
        className="screen-body"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {showInsufficientDataWarning && (
          <motion.div variants={listItem} className="card bg-butter-light mb-4">
            <p className="text-sm text-butter-dark">
              睡眠記錄較少（共 {sleepLogs.length} 筆），分析結果可能不夠準確。建議累積更多記錄後再查看。
            </p>
          </motion.div>
        )}

        {/* Period Selection */}
        <motion.div variants={listItem} className="flex justify-center gap-2 mb-6">
          {(['today', 'week', 'month'] as const).map((p) => {
            const labels = { today: '今日', week: '本週', month: '本月' };

            return (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                aria-pressed={period === p}
                className={`chip ${period === p ? 'chip-on' : ''}`}
              >
                {labels[p]}
              </button>
            );
          })}
        </motion.div>

        {/* Statistics Cards */}
        <motion.div variants={listItem} className="grid grid-cols-3 gap-3 mb-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-dark">
              {hasRecords ? `${(stats.dailyAverage / 60).toFixed(1)}h` : '—'}
            </div>
            <div className="text-sm text-ink-muted mt-1">
              {period === 'today' ? '今日總時長' : '每日平均'}
            </div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-dark">
              {!hasRecords
                ? '—'
                : period === 'today'
                  ? `${stats.sleepCount}次`
                  : `${(stats.sleepCount / stats.daysWithRecords).toFixed(1)}次`}
            </div>
            <div className="text-sm text-ink-muted mt-1">
              {period === 'today' ? '睡眠次數' : '每日次數'}
            </div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-dark">
              {hasRecords ? `${(stats.averageDuration / 60).toFixed(1)}h` : '—'}
            </div>
            <div className="text-sm text-ink-muted mt-1">每次平均</div>
          </div>
        </motion.div>

        {/* 這一段沒有記錄就什麼都不畫。一根 0 高度的長條擺在滿高的「建議睡眠」
            旁邊，讀起來是「這孩子沒睡」，而事實只是還沒記。 */}
        {hasRecords ? (
          <>
            <motion.div variants={listItem} className="panel mb-4">
              <h2 className="mb-2">睡眠時長對比</h2>
              <p className="text-sm text-ink-muted mb-4">
                {ageInMonths} 個月大寶寶建議：{recommendation.totalHours}
              </p>
              <SimpleBarChart data={comparisonData} />
              {stats.daysWithRecords < stats.daysInPeriod && (
                <p className="text-xs text-ink-faint mt-2">{stats.daysWithRecords} 天有記錄</p>
              )}
            </motion.div>

            <motion.div variants={listItem} className="panel mb-4">
              <h2 className="mb-4">夜間 vs 白天</h2>
              <SimpleBarChart data={nightDayData} height={32} />
              <div className="mt-3 text-sm text-ink-muted">
                夜間佔比：
                {stats.totalDuration > 0
                  ? `${((stats.nightSleep / stats.totalDuration) * 100).toFixed(0)}%`
                  : '0%'}
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div variants={listItem} className="mb-4">
            <EmptyState
              theme={SERVICE_THEME.littlesteps}
              title="這段時間還沒有睡眠記錄"
              description="在快速日誌記下一次睡眠，這裡就會出現時長對比與夜間白天的比例。"
            />
          </motion.div>
        )}

        {/* Week Timeline */}
        {sleepLogs.length >= 2 && (
          <motion.div variants={listItem} className="mb-4">
            <h2 className="mb-3">本週睡眠時間軸</h2>
            <SleepTimelineChart weekLogs={sleepLogs} />
          </motion.div>
        )}

        {/* 規律性只算夜間睡眠。只記過小睡的話沒有就寢時間可談，0 顆星會被讀成
            「很不規律」，而事實是「還沒有這項資料」。 */}
        {sleepLogs.length >= 3 && (regularity.averageBedtime || regularity.averageWakeTime) && (
          <motion.div variants={listItem} className="panel mb-4">
            <h2 className="mb-4">睡眠規律性</h2>

            {regularity.averageBedtime && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-ink">入睡時間規律性</span>
                  {/* 星星只用顏色與填滿表達程度，讀螢幕軟體看不到；名稱補在
                      群組上，個別星星就不必逐顆唸。 */}
                  <div
                    className="flex gap-1"
                    role="img"
                    aria-label={`5 顆星中的 ${bedtimeStars} 顆`}
                  >
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        aria-hidden="true"
                        className={`w-4 h-4 ${
                          i <= bedtimeStars ? 'text-butter-dark fill-butter-dark' : 'text-ink/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-ink-muted">
                  平均入睡時間：{regularity.averageBedtime}
                </p>
              </div>
            )}

            {regularity.averageWakeTime && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-ink">清醒時間規律性</span>
                  <div
                    className="flex gap-1"
                    role="img"
                    aria-label={`5 顆星中的 ${wakeTimeStars} 顆`}
                  >
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        aria-hidden="true"
                        className={`w-4 h-4 ${
                          i <= wakeTimeStars ? 'text-butter-dark fill-butter-dark' : 'text-ink/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-ink-muted">
                  平均清醒時間：{regularity.averageWakeTime}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Sleep Advice */}
        <motion.div variants={listItem}>
          <h2 className="mb-3">改善建議</h2>

          <motion.div className="space-y-3" variants={stagger}>
            {advice.map((item, index) => {
              const tint =
                item.category === 'good'
                  ? 'bg-mint-light'
                  : item.category === 'attention'
                  ? 'bg-butter-light'
                  : 'bg-primary-light';

              const textColor =
                item.category === 'good'
                  ? 'text-mint-dark'
                  : item.category === 'attention'
                  ? 'text-butter-dark'
                  : 'text-primary-dark';

              return (
                <motion.div
                  key={index}
                  variants={listItem}
                  className={`card ${tint}`}
                >
                  <h3 className={`mb-2 ${textColor}`}>{item.title}</h3>
                  <p className={`text-sm mb-3 ${textColor}`}>{item.description}</p>
                  {item.suggestions.length > 0 && (
                    <ul className={`text-sm space-y-1 list-disc pl-5 ${textColor}`}>
                      {item.suggestions.map((suggestion, i) => (
                        <li key={i}>{suggestion}</li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
