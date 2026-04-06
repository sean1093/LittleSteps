import { motion } from 'framer-motion';
import {
  Moon,
  Star,
  Clock,
  AlertTriangle,
  TrendingUp,
  PartyPopper,
  Heart,
  AlertCircle,
  Calendar
} from 'lucide-react';
import DashboardCard from './DashboardCard';
import type { SleepAnalytics } from '../types';
import { formatDuration } from '../utils/logHelpers';

interface SleepAnalyticsCardProps {
  analytics: SleepAnalytics;
  onNavigate: () => void;
}

// Icon mapping for recommendations
const iconMap: Record<string, React.ElementType> = {
  PartyPopper,
  Moon,
  Star,
  Clock,
  AlertTriangle,
  TrendingUp,
  Heart,
  AlertCircle,
  Calendar
};

export default function SleepAnalyticsCard({
  analytics,
  onNavigate,
}: SleepAnalyticsCardProps) {
  // Get quality score color
  const getQualityColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  // Get quality label
  const getQualityLabel = (score: number): string => {
    if (score >= 80) return '優良';
    if (score >= 60) return '良好';
    if (score >= 40) return '普通';
    return '需改善';
  };

  const hasData = analytics.sleepCount > 0;

  return (
    <DashboardCard
      title="睡眠分析"
      icon={Moon}
      iconColor="text-[#7EC8E3]"
      iconBg="bg-[#E8F4F8]"
      onClick={onNavigate}
      bgColor="bg-[#E8F4F8]/30"
    >
      {hasData ? (
        <>
          {/* Main Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Total Sleep */}
            <div className="bg-white rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span className="text-xs text-gray-600">總睡眠</span>
              </div>
              <div className="text-xl font-bold text-gray-800">
                {formatDuration(analytics.totalSleepDuration)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {analytics.sleepCount} 次
              </div>
            </div>

            {/* Sleep Quality */}
            <div className="bg-white rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-indigo-600" />
                <span className="text-xs text-gray-600">睡眠品質</span>
              </div>
              <div className={`text-xl font-bold ${getQualityColor(analytics.sleepQualityScore)}`}>
                {analytics.sleepQualityScore}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {getQualityLabel(analytics.sleepQualityScore)}
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {/* Longest Sleep */}
            <div className="text-center p-2 bg-white rounded-lg">
              <div className="text-lg font-bold text-indigo-600">
                {Math.floor(analytics.longestSleepDuration / 60)}h
              </div>
              <div className="text-xs text-gray-600">最長</div>
            </div>

            {/* Routine Score */}
            <div className="text-center p-2 bg-white rounded-lg">
              <div className="text-lg font-bold text-indigo-600">
                {analytics.routineScore}%
              </div>
              <div className="text-xs text-gray-600">規律性</div>
            </div>

            {/* Night Wakings */}
            <div className="text-center p-2 bg-white rounded-lg">
              <div className="text-lg font-bold text-indigo-600">
                {analytics.nightWakingsTotal}
              </div>
              <div className="text-xs text-gray-600">夜醒</div>
            </div>
          </div>

          {/* Sleeping Through Night Badge */}
          {analytics.isSleepingThroughNight && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#81C784] text-white rounded-3xl p-3 mb-4"
            >
              <div className="flex items-center gap-2">
                <PartyPopper className="w-5 h-5" />
                <div className="flex-1">
                  <div className="font-bold text-sm">睡過夜了！</div>
                  <div className="text-xs opacity-90">
                    最長連續睡眠 {Math.floor(analytics.longestContinuousSleep / 60)} 小時
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Top Recommendation */}
          {analytics.recommendations.length > 0 && (
            <div className="bg-white rounded-xl p-3 mb-3">
              {(() => {
                const topRec = analytics.recommendations[0];
                const IconComponent = iconMap[topRec.icon] || TrendingUp;
                const typeColor =
                  topRec.type === 'positive'
                    ? 'text-green-600'
                    : topRec.type === 'warning'
                    ? 'text-orange-600'
                    : 'text-blue-600';

                return (
                  <div className="flex items-start gap-3">
                    <div className={`${typeColor} mt-0.5`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-800 mb-1">
                        {topRec.title}
                      </div>
                      <div className="text-xs text-gray-600 leading-relaxed">
                        {topRec.message}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Bedtime & Wake Time */}
          {(analytics.averageBedtime || analytics.averageWakeTime) && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {analytics.averageBedtime && (
                <div className="bg-white rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-600 mb-1">平均入睡</div>
                  <div className="text-sm font-bold text-indigo-600">
                    {analytics.averageBedtime}
                  </div>
                </div>
              )}
              {analytics.averageWakeTime && (
                <div className="bg-white rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-600 mb-1">平均起床</div>
                  <div className="text-sm font-bold text-indigo-600">
                    {analytics.averageWakeTime}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* View More Link */}
          <div className="pt-3 border-t border-gray-200">
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
              查看完整分析 →
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500 mb-3">尚無睡眠記錄</p>
          <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
            開始記錄睡眠 →
          </button>
        </div>
      )}
    </DashboardCard>
  );
}
