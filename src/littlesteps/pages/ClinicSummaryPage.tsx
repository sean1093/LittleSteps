import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUp,
  ArrowUpRight,
  ArrowRight,
  ArrowDownRight,
  ArrowDown,
} from 'lucide-react';
import { User } from 'firebase/auth';
import type { ChildProfile, DailyLog } from '../../types';
import { useClinicSummary } from '../hooks/useClinicSummary';
import { formatDuration } from '../utils/logHelpers';
import { formatDate, formatTime } from '../../common/utils/dateHelpers';
import EmptyState from '../../common/ui/EmptyState';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { stagger, listItem } from '../../common/ui/motion';

interface ClinicSummaryPageProps {
  currentChild?: ChildProfile;
  dailyLogs: DailyLog[];
  user: User | null;
}

/** 這份摘要要帶去診間，所以產生時間必須連時刻一起顯示；日期部分沿用全站格式。 */
function formatDateTime(iso: string): string {
  return `${formatDate(iso)} ${formatTime(iso)}`;
}

function genderLabel(gender?: string): string {
  if (gender === 'male') return '男';
  if (gender === 'female') return '女';
  return '未設定';
}

/**
 * Compute a trend arrow comparing current value to previous value.
 * Direction and magnitude are only carried by the glyph, so this one stays.
 */
function TrendArrow({ current, previous }: { current?: number; previous?: number }) {
  if (current === undefined || previous === undefined) {
    return <span className="text-ink-faint">--</span>;
  }
  const diff = current - previous;
  const pct = previous !== 0 ? (diff / previous) * 100 : 0;

  if (Math.abs(pct) < 0.5) {
    return <ArrowRight className="w-4 h-4 text-ink-faint inline-block" />;
  }
  if (pct >= 5) {
    return <ArrowUp className="w-4 h-4 text-mint-dark inline-block" />;
  }
  if (pct >= 1) {
    return <ArrowUpRight className="w-4 h-4 text-mint-dark inline-block" />;
  }
  if (pct <= -5) {
    return <ArrowDown className="w-4 h-4 text-primary-dark inline-block" />;
  }
  return <ArrowDownRight className="w-4 h-4 text-butter-dark inline-block" />;
}

function PercentileBadge({ value }: { value?: number }) {
  if (value === undefined) return null;
  let bg = 'bg-mint-light text-mint-dark';
  if (value < 15) bg = 'bg-butter-light text-butter-dark';
  else if (value > 85) bg = 'bg-secondary-light text-secondary-dark';
  return <span className={`tag ${bg}`}>P{Math.round(value)}</span>;
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
      <div className="screen">
        <div className="screen-body-wide">
          <EmptyState
            theme={SERVICE_THEME.littlesteps}
            title="尚未建立寶寶檔案"
            description="請從左上角選單新增寶寶資料"
          />
        </div>
      </div>
    );
  }

  // --- Loading state ---
  if (loading || !data) {
    return (
      <div className="screen">
        <div className="screen-body-wide flex justify-center py-16">
          <div className="w-40 h-1 rounded-full bg-primary-light overflow-hidden" role="status">
            <div className="h-full w-1/3 rounded-full bg-primary-dark animate-[loading_1.2s_ease-in-out_infinite]" />
            <span className="sr-only">正在準備看診摘要</span>
          </div>
        </div>
      </div>
    );
  }

  // Prepare growth records for the table (oldest first so trend arrows make sense)
  const growthRows = [...data.recentGrowthRecords].reverse();

  return (
    <div className="screen">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="screen-body-wide"
      >
        {/* 產生時間是 AppBar 標題沒帶到的資訊，看診時要唸給醫師聽，所以留著。 */}
        <motion.p variants={listItem} className="text-sm text-ink-muted mb-5">
          產生時間：{formatDateTime(data.generatedAt)}
        </motion.p>

        {/* ===== Section 1: 寶寶基本資料 ===== */}
        <motion.section variants={listItem} className="panel mb-4">
          <h2>寶寶基本資料</h2>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <InfoItem label="姓名" value={data.childName} />
            <InfoItem label="性別" value={genderLabel(data.gender)} />
            <InfoItem label="生日" value={formatDate(data.birthday)} />
            <InfoItem label="目前年齡" value={data.ageDisplay} />
          </div>

          {data.latestGrowth && (
            <div className="mt-5 pt-4 border-t border-ink/10">
              <p className="text-sm text-ink-muted mb-3">
                最新測量（{formatDate(data.latestGrowth.date)}）
              </p>
              <div className="grid grid-cols-3 gap-3">
                {data.latestGrowth.weight !== undefined && (
                  <MeasurementCard
                    label="體重"
                    value={`${data.latestGrowth.weight} kg`}
                    percentile={data.latestGrowth.percentile?.weight}
                  />
                )}
                {data.latestGrowth.height !== undefined && (
                  <MeasurementCard
                    label="身高"
                    value={`${data.latestGrowth.height} cm`}
                    percentile={data.latestGrowth.percentile?.height}
                  />
                )}
                {data.latestGrowth.headCircumference !== undefined && (
                  <MeasurementCard
                    label="頭圍"
                    value={`${data.latestGrowth.headCircumference} cm`}
                    percentile={data.latestGrowth.percentile?.headCircumference}
                  />
                )}
              </div>
            </div>
          )}
        </motion.section>

        {/* ===== Section 2: 成長趨勢 ===== */}
        <motion.section variants={listItem} className="panel mb-4">
          <h2>成長趨勢</h2>

          {growthRows.length === 0 ? (
            <p className="text-ink-muted text-sm mt-4">尚無成長紀錄</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-ink-muted border-b border-ink/10">
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
                      <tr key={row.date} className="border-b border-ink/5 last:border-0">
                        <td className="py-2.5 pr-3 text-ink">{formatDate(row.date)}</td>
                        <td className="py-2.5 pr-3 text-ink">
                          {row.weight !== undefined ? (
                            <span className="inline-flex items-center gap-1">
                              {row.weight}
                              {prev && <TrendArrow current={row.weight} previous={prev.weight} />}
                            </span>
                          ) : (
                            '--'
                          )}
                        </td>
                        <td className="py-2.5 pr-3 text-ink">
                          {row.height !== undefined ? (
                            <span className="inline-flex items-center gap-1">
                              {row.height}
                              {prev && <TrendArrow current={row.height} previous={prev.height} />}
                            </span>
                          ) : (
                            '--'
                          )}
                        </td>
                        <td className="py-2.5 text-ink">
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
        <motion.section variants={listItem} className="panel mb-4">
          <h2>疫苗紀錄</h2>

          {data.administeredVaccines.length === 0 ? (
            <p className="text-ink-muted text-sm mt-4">尚無接種紀錄</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {data.administeredVaccines.map((v, idx) => (
                <li
                  key={`${v.name}-${v.dose}-${idx}`}
                  className="flex items-center justify-between text-sm border-b border-ink/5 pb-2 last:border-0"
                >
                  <span className="text-ink">{v.name}</span>
                  <span className="text-ink-muted">
                    {v.date ? formatDate(v.date) : '日期未記錄'}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {data.nextVaccine && (
            <div className="mt-4 p-3 rounded-xl bg-secondary-light border border-secondary/30">
              <p className="text-sm font-medium text-secondary-dark">
                下一劑：{data.nextVaccine.name}（第 {data.nextVaccine.doseNumber} 劑）
              </p>
              <p className="text-sm text-secondary-dark mt-0.5">
                建議時間：{data.nextVaccine.timing}
              </p>
            </div>
          )}
        </motion.section>

        {/* ===== Section 4: 近 7 天日常摘要 ===== */}
        <motion.section variants={listItem} className="panel mb-4">
          <h2>近 7 天日常摘要</h2>

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

        {/* ===== 完整健康時間軸 =====
            上面幾段是分項摘要，這一段是一條線：產檢、疫苗、成長、兒童健檢
            按日期排在一起。這份摘要原本只涵蓋四種紀錄裡的兩種，講到出生就斷了，
            而醫師想看的正是連續。 */}
        {data.healthTimeline.length > 0 && (
          <motion.section variants={listItem} className="panel mb-4">
            <h2>完整健康紀錄</h2>
            <ul className="mt-4 space-y-2">
              {data.healthTimeline.map((event) => (
                <li key={event.id} className="flex items-baseline gap-3 text-sm">
                  <span className="text-ink-faint shrink-0 tabular-nums">
                    {event.date || '未記日期'}
                  </span>
                  <span className="text-ink">
                    {event.title}
                    {event.location && (
                      <span className="text-ink-muted">（{event.location}）</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        {/* ===== Section 5: 特殊事項 ===== */}
        <motion.section variants={listItem} className="panel mb-4">
          <h2>特殊事項</h2>

          <textarea
            className="w-full mt-4 p-4 rounded-xl border border-ink/10 bg-warm-white text-base text-ink placeholder-ink-faint resize-none"
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

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-ink-muted mb-0.5">{label}</p>
      <p className="text-base font-medium text-ink">{value}</p>
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
    <div className="bg-secondary-light rounded-xl p-3 text-center">
      <p className="text-sm text-ink-muted mb-1">{label}</p>
      <p className="text-lg font-bold text-ink">{value}</p>
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
    <div className="bg-warm-white rounded-xl p-3">
      <p className="text-sm text-ink-muted mb-1">{label}</p>
      <p className={`font-bold text-ink ${small ? 'text-sm' : 'text-lg'}`}>{value}</p>
    </div>
  );
}
