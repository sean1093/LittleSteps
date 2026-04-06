import { Baby } from 'lucide-react';
import DashboardCard from './DashboardCard';
import { MilestoneProgress } from '../types';
import { calculateMilestoneSummary } from '../utils/summaryCalculator';

interface MilestoneSummaryCardProps {
  milestoneProgress: MilestoneProgress;
  onNavigate: () => void;
}

export default function MilestoneSummaryCard({
  milestoneProgress,
  onNavigate,
}: MilestoneSummaryCardProps) {
  const summary = calculateMilestoneSummary(milestoneProgress);

  return (
    <DashboardCard
      title="里程碑追蹤"
      icon={Baby}
      iconColor="text-[#FF9B9B]"
      iconBg="bg-[#FFE5E5]"
      onClick={onNavigate}
      bgColor="bg-[#FFE5E5]/30"
    >
      {/* Progress Stats */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-[#FF9B9B]">
          {summary.achievedCount}
        </span>
        <span className="text-gray-600">
          / {summary.totalMilestones} 已達成
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#FF9B9B] transition-all duration-500"
          style={{ width: `${summary.achievementRate}%` }}
        />
      </div>

      {/* Recent Achievements */}
      {summary.recentAchievements.length > 0 && (
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-500 mb-2">最近達成</p>
          <div className="space-y-1">
            {summary.recentAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="text-sm text-gray-700 flex items-start gap-2"
              >
                <span className="text-[#FF9B9B]">•</span>
                <span className="flex-1">{achievement.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {summary.recentAchievements.length === 0 && (
        <p className="text-sm text-gray-500 italic">尚無達成記錄</p>
      )}
    </DashboardCard>
  );
}
