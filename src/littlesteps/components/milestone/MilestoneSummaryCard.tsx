import DashboardCard from '../dashboard/DashboardCard';
import { MilestoneProgress } from '../../../types';
import { calculateMilestoneSummary } from '../../../common/utils/summaryCalculator';

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
    <DashboardCard title="里程碑追蹤" onClick={onNavigate} bgColor="bg-primary-light/30">
      {/*
        只說已經會了幾件，沒有分母也沒有進度條。原本是「3 / 33 已達成」加一條
        9% 的進度條：分母是整個第一年的里程碑，等於拿一歲的清單替新生兒打分數。
      */}
      <p className="text-ink-muted">
        已經會了{' '}
        <span className="text-2xl font-bold text-primary-dark">{summary.achievedCount}</span> 件
      </p>

      {summary.recentAchievements.length > 0 ? (
        <div className="pt-2 border-t border-ink/10">
          <p className="text-xs font-medium text-ink-faint mb-2">最近達成</p>
          <div className="space-y-1">
            {summary.recentAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="text-sm text-ink flex items-start gap-2"
              >
                <span className="text-primary-dark">•</span>
                <span className="flex-1">{achievement.title}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-ink-faint">尚無達成記錄</p>
      )}
    </DashboardCard>
  );
}
