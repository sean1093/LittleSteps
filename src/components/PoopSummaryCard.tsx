import { AlertTriangle } from 'lucide-react';
import DashboardCard from './DashboardCard';
import SparklineChart from './SparklineChart';
import { DailyLog, DiaperData } from '../types';
import { generateSparklineData } from '../utils/trendCalculator';

interface PoopSummaryCardProps {
  dailyLogs: DailyLog[];
  onNavigate: () => void;
}

/**
 * Custom icon component using poop emoji for the DashboardCard header
 */
function PoopIcon({ className }: { className?: string }) {
  return <span className={className} style={{ fontSize: '1.5rem' }}>{'💩'}</span>;
}

export default function PoopSummaryCard({
  dailyLogs,
  onNavigate,
}: PoopSummaryCardProps) {
  // Find last poop time
  const poopLogs = dailyLogs
    .filter(log => log.type === 'diaper')
    .filter(log => {
      const data = log.data as DiaperData;
      return data.type === 'poop' || data.type === 'both';
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const lastPoopTime = poopLogs.length > 0 ? new Date(poopLogs[0].timestamp) : null;
  const hoursSinceLastPoop = lastPoopTime
    ? (Date.now() - lastPoopTime.getTime()) / (1000 * 60 * 60)
    : null;

  // Format relative time
  const formatRelativeTime = (hours: number): string => {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes} 分鐘前`;
    }
    if (hours < 24) {
      return `${Math.round(hours)} 小時前`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    if (remainingHours === 0) {
      return `${days} 天前`;
    }
    return `${days} 天 ${remainingHours} 小時前`;
  };

  // 7-day sparkline data
  const sparklineData = generateSparklineData(dailyLogs, 7, 'poop_count');
  const total7Days = sparklineData.reduce((sum, v) => sum + v, 0);
  const isWarning = hoursSinceLastPoop !== null && hoursSinceLastPoop > 48;

  return (
    <DashboardCard
      title="排便追蹤"
      icon={PoopIcon as unknown as import('lucide-react').LucideIcon}
      iconColor="text-amber-700"
      iconBg="bg-[#FFF3E0]"
      onClick={onNavigate}
      bgColor="bg-[#FFF3E0]/30"
    >
      {lastPoopTime ? (
        <>
          {/* Last Poop Time */}
          <div className={`rounded-xl p-3 ${isWarning ? 'bg-red-50' : 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-600 mb-1">上次排便</div>
                <div className={`text-lg font-bold ${isWarning ? 'text-red-600' : 'text-amber-700'}`}>
                  {formatRelativeTime(hoursSinceLastPoop!)}
                </div>
              </div>
              {isWarning && (
                <div className="flex items-center gap-1 text-red-500">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-xs font-medium">留意</span>
                </div>
              )}
            </div>
          </div>

          {/* 7-day Sparkline */}
          <div className="bg-white rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">近 7 天趨勢</span>
              <span className="text-xs text-gray-500">共 {total7Days} 次</span>
            </div>
            <SparklineChart
              data={sparklineData}
              width={200}
              height={36}
              color="#D97706"
              fillColor="#D97706"
            />
          </div>

          {/* View Details Link */}
          <div className="pt-3 border-t border-gray-200">
            <button className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors">
              查看詳細記錄 →
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500 mb-3">尚無排便記錄</p>
          <button className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors">
            開始記錄 →
          </button>
        </div>
      )}
    </DashboardCard>
  );
}
