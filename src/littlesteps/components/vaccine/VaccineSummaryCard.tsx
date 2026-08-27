import DashboardCard from '../dashboard/DashboardCard';
import { VaccineProgress } from '../../../types';
import { calculateVaccineSummary } from '../../../common/utils/summaryCalculator';

interface VaccineSummaryCardProps {
  vaccineProgress: VaccineProgress;
  onNavigate: () => void;
}

export default function VaccineSummaryCard({
  vaccineProgress,
  onNavigate,
}: VaccineSummaryCardProps) {
  const summary = calculateVaccineSummary(vaccineProgress);

  return (
    <DashboardCard title="疫苗追蹤" onClick={onNavigate} bgColor="bg-mint-light/30">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-mint-dark">
          {summary.administeredCount}
        </span>
        <span className="text-ink-muted">
          / {summary.totalDoses} 已接種
        </span>
      </div>

      <div className="w-full h-2 bg-ink/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-mint transition-all duration-500"
          style={{ width: `${summary.administrationRate}%` }}
        />
      </div>

      {summary.nextVaccine ? (
        <div className="pt-2 border-t border-ink/10">
          <p className="text-xs font-medium text-ink-faint mb-2">下次接種</p>
          <div className="bg-white rounded-xl p-3 border border-mint/40">
            <p className="font-medium text-ink">{summary.nextVaccine.name}</p>
            <p className="text-sm text-ink-muted mt-1">
              第 {summary.nextVaccine.doseNumber} 劑 • {summary.nextVaccine.timing}
            </p>
          </div>
        </div>
      ) : (
        <div className="pt-2 border-t border-ink/10">
          <p className="text-sm text-mint-dark font-medium">所有疫苗皆已接種完成</p>
        </div>
      )}
    </DashboardCard>
  );
}
