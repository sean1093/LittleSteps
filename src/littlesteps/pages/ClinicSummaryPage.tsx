import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  Baby,
  TrendingUp,
  Syringe,
  CalendarClock,
  FileText,
  ArrowUp,
  ArrowUpRight,
  ArrowRight,
  ArrowDownRight,
  ArrowDown,
  Loader2,
} from 'lucide-react';
import { User } from 'firebase/auth';
import type { ChildProfile, DailyLog } from '../../types';
import { useClinicSummary } from '../hooks/useClinicSummary';
import { formatDuration } from '../utils/logHelpers';

interface ClinicSummaryPageProps {
  currentChild?: ChildProfile;
  dailyLogs: DailyLog[];
  user: User | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function genderLabel(gender?: string): string {
  if (gender === 'male') return '男';
  if (gender === 'female') return '女';
  return '未設定';
}

/**
 * Compute a trend arrow comparing current value to previous value.
 * Returns a React element with the appropriate arrow icon.
 */
function TrendArrow({ current, previous }: { current?: number; previous?: number }) {
  if (current === undefined || previous === undefined) {
    return <span className="text-gray-300">--</span>;
  }
  const diff = current - previous;
  const pct = previous !== 0 ? (diff / previous) * 100 : 0;

  if (Math.abs(pct) < 0.5) {
    return <ArrowRight className="w-4 h-4 text-gray-400 inline-block" />;
  }
  if (pct >= 5) {
    return <ArrowUp className="w-4 h-4 text-green-500 inline-block" />;
  }
  if (pct >= 1) {
    return <ArrowUpRight className="w-4 h-4 text-green-400 inline-block" />;
  }
  if (pct <= -5) {
    return <ArrowDown className="w-4 h-4 text-red-500 inline-block" />;
  }
  return <ArrowDownRight className="w-4 h-4 text-orange-400 inline-block" />;
}

function PercentileBadge({ value }: { value?: number }) {
  if (value === undefined) return null;
  let bg = 'bg-green-100 text-green-700';
  if (value < 15) bg = 'bg-orange-100 text-orange-700';
  else if (value > 85) bg = 'bg-blue-100 text-blue-700';
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${bg}`}>
      P{Math.round(value)}
    </span>
  );
}

export default function ClinicSummaryPage({
  currentChild,
  dailyLogs,
  user,
}: ClinicSummaryPageProps) {
  const { data, loading } = useClinicSummary(currentChild, dailyLogs, user);
  const [notes, setNotes] = useState('');

  // --- Empty state ---
  if (!currentChild) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-xl text-gray-600 mb-6">尚未建立寶寶檔案</p>
        <p className="text-gray-500">請從左上角選單新增寶寶資料</p>
      </div>
    );
  }

  // --- Loading state ---
  if (loading || !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Loader2 className="w-10 h-10 text-[#7EC8E3] mx-auto mb-4 animate-spin" />
        <p className="text-gray-500">正在準備看診摘要...</p>
      </div>
    );
  }

  // Prepare growth records for the table (oldest first so trend arrows make sense)
  const growthRows = [...data.recentGrowthRecords].reverse();

  return (
    <div className="min-h-screen bg-[#FDFBF7] px-4 py-8 relative overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto relative z-10"
      >
        {/* ===== Header ===== */}
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#E8F4F8] mb-3">
            <Stethoscope className="w-7 h-7 text-[#7EC8E3]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">看診摘要</h1>
          <p className="text-sm text-gray-400">
            產生時間：{formatDateTime(data.generatedAt)}
          </p>
        </motion.div>

        {/* ===== Section 1: 寶寶基本資料 ===== */}
        <motion.section variants={itemVariants} className="bg-white rounded-2xl shadow-soft p-6 mb-5">
          <SectionHeader icon={<Baby className="w-5 h-5" />} title="寶寶基本資料" />

          <div className="grid grid-cols-2 gap-4 mt-4">
            <InfoItem label="姓名" value={data.childName} />
            <InfoItem label="性別" value={genderLabel(data.gender)} />
            <InfoItem label="生日" value={formatDateShort(data.birthday)} />
            <InfoItem label="目前年齡" value={data.ageDisplay} />
          </div>

          {data.latestGrowth && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-3">
                最新測量（{formatDateShort(data.latestGrowth.date)}）
              </p>
              <div className="grid grid-cols-3 gap-3">
                {data.latestGrowth.weight !== undefined && (
                  <MeasurementCard
                    label="體重"
                    value={`${data.latestGrowth.weight} kg`}
                    percentile={data.latestGrowth.percentile.weight}
                  />
                )}
                {data.latestGrowth.height !== undefined && (
                  <MeasurementCard
                    label="身高"
                    value={`${data.latestGrowth.height} cm`}
                    percentile={data.latestGrowth.percentile.height}
                  />
                )}
                {data.latestGrowth.headCircumference !== undefined && (
                  <MeasurementCard
                    label="頭圍"
                    value={`${data.latestGrowth.headCircumference} cm`}
                    percentile={data.latestGrowth.percentile.headCircumference}
                  />
                )}
              </div>
            </div>
          )}
        </motion.section>

        {/* ===== Section 2: 成長趨勢 ===== */}
        <motion.section variants={itemVariants} className="bg-white rounded-2xl shadow-soft p-6 mb-5">
          <SectionHeader icon={<TrendingUp className="w-5 h-5" />} title="成長趨勢" />

          {growthRows.length === 0 ? (
            <p className="text-gray-400 text-sm mt-4">尚無成長紀錄</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-2 pr-3 font-medium">日期</th>
                    <th className="pb-2 pr-3 font-medium">體重 (kg)</th>
                    <th className="pb-2 pr-3 font-medium">身高 (cm)</th>
                    <th className="pb-2 font-medium">頭圍 (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {growthRows.map((row, idx) => {
                    const prev = idx > 0 ? growthRows[idx - 1] : undefined;
                    return (
                      <tr key={row.date} className="border-b border-gray-50 last:border-0">
                        <td className="py-2.5 pr-3 text-gray-700">{formatDateShort(row.date)}</td>
                        <td className="py-2.5 pr-3 text-gray-700">
                          {row.weight !== undefined ? (
                            <span className="inline-flex items-center gap-1">
                              {row.weight}
                              {prev && <TrendArrow current={row.weight} previous={prev.weight} />}
                            </span>
                          ) : (
                            '--'
                          )}
                        </td>
                        <td className="py-2.5 pr-3 text-gray-700">
                          {row.height !== undefined ? (
                            <span className="inline-flex items-center gap-1">
                              {row.height}
                              {prev && <TrendArrow current={row.height} previous={prev.height} />}
                            </span>
                          ) : (
                            '--'
                          )}
                        </td>
                        <td className="py-2.5 text-gray-700">
                          {row.headCircumference !== undefined ? (
                            <span className="inline-flex items-center gap-1">
                              {row.headCircumference}
                              {prev && (
                                <TrendArrow
                                  current={row.headCircumference}
                                  previous={prev.headCircumference}
                                />
                              )}
                            </span>
                          ) : (
                            '--'
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>

        {/* ===== Section 3: 疫苗紀錄 ===== */}
        <motion.section variants={itemVariants} className="bg-white rounded-2xl shadow-soft p-6 mb-5">
          <SectionHeader icon={<Syringe className="w-5 h-5" />} title="疫苗紀錄" />

          {data.administeredVaccines.length === 0 ? (
            <p className="text-gray-400 text-sm mt-4">尚無接種紀錄</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {data.administeredVaccines.map((v, idx) => (
                <li
                  key={`${v.name}-${v.dose}-${idx}`}
                  className="flex items-center justify-between text-sm border-b border-gray-50 pb-2 last:border-0"
                >
                  <span className="text-gray-700">{v.name}</span>
                  <span className="text-gray-400 text-xs">
                    {v.date ? formatDateShort(v.date) : '日期未記錄'}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {data.nextVaccine && (
            <div className="mt-4 p-3 rounded-xl bg-[#E8F4F8] border border-[#7EC8E3]/20">
              <p className="text-sm font-medium text-[#2B7A9E]">
                下一劑：{data.nextVaccine.name}（第 {data.nextVaccine.doseNumber} 劑）
              </p>
              <p className="text-xs text-[#5AA5C2] mt-0.5">
                建議時間：{data.nextVaccine.timing}
              </p>
            </div>
          )}
        </motion.section>

        {/* ===== Section 4: 近 7 天日常摘要 ===== */}
        <motion.section variants={itemVariants} className="bg-white rounded-2xl shadow-soft p-6 mb-5">
          <SectionHeader icon={<CalendarClock className="w-5 h-5" />} title="近 7 天日常摘要" />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            <StatCard label="每日平均餵奶次數" value={`${data.weekSummary.avgFeedingCount} 次`} />
            <StatCard label="每日平均奶量" value={`${data.weekSummary.avgFeedingAmount} ml`} />
            <StatCard label="每日平均睡眠" value={`${data.weekSummary.avgSleepHours} 小時`} />
            <StatCard
              label="最長連續睡眠"
              value={data.weekSummary.longestSleep > 0 ? formatDuration(data.weekSummary.longestSleep) : '--'}
            />
            <StatCard label="每日平均便便次數" value={`${data.weekSummary.avgPoopCount} 次`} />
            <StatCard
              label="最後一次便便"
              value={
                data.weekSummary.lastPoopTime
                  ? formatDateTime(data.weekSummary.lastPoopTime)
                  : '無紀錄'
              }
              small
            />
          </div>
        </motion.section>

        {/* ===== Section 5: 特殊事項 ===== */}
        <motion.section variants={itemVariants} className="bg-white rounded-2xl shadow-soft p-6 mb-5">
          <SectionHeader icon={<FileText className="w-5 h-5" />} title="特殊事項" />

          <textarea
            className="w-full mt-4 p-4 rounded-xl border border-gray-200 bg-gray-50 text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7EC8E3]/40 focus:border-[#7EC8E3] resize-none transition-colors"
            rows={4}
            placeholder="可在此記錄要告知醫師的事項..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </motion.section>
      </motion.div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-1 h-6 rounded-full bg-[#7EC8E3]" />
      <span className="text-[#7EC8E3]">{icon}</span>
      <h2 className="text-lg font-bold text-gray-800">{title}</h2>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-base font-medium text-gray-700">{value}</p>
    </div>
  );
}

function MeasurementCard({
  label,
  value,
  percentile,
}: {
  label: string;
  value: string;
  percentile?: number;
}) {
  return (
    <div className="bg-[#E8F4F8] rounded-xl p-3 text-center">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-bold text-gray-800">{value}</p>
      {percentile !== undefined && (
        <div className="mt-1">
          <PercentileBadge value={percentile} />
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  small,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`font-bold text-gray-800 ${small ? 'text-sm' : 'text-lg'}`}>{value}</p>
    </div>
  );
}
