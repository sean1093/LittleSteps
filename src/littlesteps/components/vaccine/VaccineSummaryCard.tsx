import DashboardCard from '../dashboard/DashboardCard';
import { VaccineProgress } from '../../../types';
import { calculateVaccineSummary } from '../../../common/utils/summaryCalculator';

interface VaccineSummaryCardProps {
  vaccineProgress: VaccineProgress;
  /** 下一劑是從出生日推算的，沒有生日就算不出「接下來是哪一劑」 */
  birthday: string;
  onNavigate: () => void;
}

export default function VaccineSummaryCard({
  vaccineProgress,
  birthday,
  onNavigate,
}: VaccineSummaryCardProps) {
  const summary = calculateVaccineSummary(vaccineProgress, birthday);

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
      ) : summary.remainingNationalDoses > 0 ? (
        // 沒有下一劑，但公費劑次還沒記完——剩下的都已經超出可以補打的範圍。
        // 這時候說「皆已接種完成」是假的，說「你漏打了」也不對：家長可能打了
        // 只是沒記。用和幼兒期提醒頁同一個講法。
        <div className="pt-2 border-t border-ink/10">
          <p className="text-sm text-ink-muted leading-relaxed">
            尚有 {summary.remainingNationalDoses} 劑公費疫苗沒有記錄，沒有記錄不代表沒打，可對照兒童健康手冊補登
          </p>
        </div>
      ) : (
        // 分母是整份時程表（含自費），所以只說「公費」會和上面的 21/33 對不起來。
        // 把差額的來由講出來，這句話才不會看起來自相矛盾。
        <div className="pt-2 border-t border-ink/10">
          <p className="text-sm text-mint-dark font-medium leading-relaxed">
            公費疫苗皆已接種完成，其餘劑次不在公費時程內
          </p>
        </div>
      )}
    </DashboardCard>
  );
}
