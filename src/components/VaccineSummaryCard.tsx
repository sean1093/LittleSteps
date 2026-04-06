import { Syringe } from 'lucide-react';
import DashboardCard from './DashboardCard';
import { VaccineProgress } from '../types';
import { calculateVaccineSummary } from '../utils/summaryCalculator';

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
    <DashboardCard
      title="疫苗追蹤"
      icon={Syringe}
      iconColor="text-[#81C784]"
      iconBg="bg-[#E8F5E9]"
      onClick={onNavigate}
      bgColor="bg-[#E8F5E9]/30"
    >
      {/* Progress Stats */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-[#81C784]">
          {summary.administeredCount}
        </span>
        <span className="text-gray-600">
          / {summary.totalDoses} 已接種
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#81C784] transition-all duration-500"
          style={{ width: `${summary.administrationRate}%` }}
        />
      </div>

      {/* Next Vaccine */}
      {summary.nextVaccine ? (
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-500 mb-2">下次接種</p>
          <div className="bg-white rounded-lg p-3 border border-[#81C784]/30">
            <p className="font-medium text-gray-800">{summary.nextVaccine.name}</p>
            <p className="text-sm text-gray-600 mt-1">
              第 {summary.nextVaccine.doseNumber} 劑 • {summary.nextVaccine.timing}
            </p>
          </div>
        </div>
      ) : (
        <div className="pt-2 border-t border-gray-200">
          <p className="text-sm text-[#81C784] font-medium flex items-center gap-2">
            <span>✓</span>
            <span>所有疫苗皆已接種完成</span>
          </p>
        </div>
      )}
    </DashboardCard>
  );
}
