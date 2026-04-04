import { Syringe } from 'lucide-react';
import DashboardCard from './DashboardCard';
import { VaccineProgress } from '../types';
import { calculateVaccineSummary } from '../utils/summaryCalculator';

interface VaccineSummaryCardProps {
  vaccineProgress: VaccineProgress;
  childBirthday: string;
  onNavigate: () => void;
}

export default function VaccineSummaryCard({
  vaccineProgress,
  childBirthday,
  onNavigate,
}: VaccineSummaryCardProps) {
  const summary = calculateVaccineSummary(vaccineProgress, childBirthday);

  return (
    <DashboardCard
      title="疫苗追蹤"
      icon={Syringe}
      iconColor="text-white"
      iconBgGradient="from-green-400 to-green-600"
      onClick={onNavigate}
      bgColor="bg-green-50/50"
    >
      {/* Progress Stats */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-green-600">
          {summary.administeredCount}
        </span>
        <span className="text-gray-600">
          / {summary.totalDoses} 已接種
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
          style={{ width: `${summary.administrationRate}%` }}
        />
      </div>

      {/* Next Vaccine */}
      {summary.nextVaccine ? (
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-500 mb-2">下次接種</p>
          <div className="bg-white rounded-lg p-3 border border-green-200">
            <p className="font-medium text-gray-800">{summary.nextVaccine.name}</p>
            <p className="text-sm text-gray-600 mt-1">
              第 {summary.nextVaccine.doseNumber} 劑 • {summary.nextVaccine.timing}
            </p>
          </div>
        </div>
      ) : (
        <div className="pt-2 border-t border-gray-200">
          <p className="text-sm text-green-600 font-medium flex items-center gap-2">
            <span>✓</span>
            <span>所有疫苗皆已接種完成</span>
          </p>
        </div>
      )}
    </DashboardCard>
  );
}
