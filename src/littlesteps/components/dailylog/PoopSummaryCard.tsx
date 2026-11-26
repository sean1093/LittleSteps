import { AlertTriangle } from 'lucide-react';
import DashboardCard from '../dashboard/DashboardCard';
import SparklineChart from '../shared/SparklineChart';
import { DailyLog, DiaperData } from '../../../types';
import { generateSparklineData } from '../../utils/trendCalculator';

interface PoopSummaryCardProps {
  dailyLogs: DailyLog[];
  onNavigate: () => void;
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
  /*
    跟 alertEngine 的排便提醒同一條線：72 小時，一級，不用紅色。原本這裡 48
    小時就整塊轉紅——而吃得好、便便軟的寶寶幾天一次是常見的（來源見
    alertEngine.detectPoopAlerts）。
  */
  const isWarning = hoursSinceLastPoop !== null && hoursSinceLastPoop > 72;

  return (
    <DashboardCard title="排便追蹤" onClick={onNavigate} bgColor="bg-butter-light/30">
      {lastPoopTime ? (
        <>
          <div className={`rounded-xl p-3 ${isWarning ? 'bg-butter-light' : 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-ink-muted mb-1">上次排便</div>
                <div className="text-lg font-bold text-butter-dark">
                  {formatRelativeTime(hoursSinceLastPoop!)}
                </div>
              </div>
              {isWarning && (
                <div className="flex items-center gap-1 text-butter-dark">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-xs font-medium">留意</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-ink-muted">近 7 天趨勢</span>
              <span className="text-xs text-ink-faint">共 {total7Days} 次</span>
            </div>
            {/* `#9A6212` is `butter-dark`; SVG paint can't take a Tailwind class. */}
            <SparklineChart
              data={sparklineData}
              height={36}
              color="#9A6212"
              fillColor="#9A6212"
            />
          </div>
        </>
      ) : (
        <p className="text-center py-4 text-ink-faint">尚無排便記錄</p>
      )}
    </DashboardCard>
  );
}
