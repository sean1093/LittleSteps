import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Baby, Check, Undo2 } from 'lucide-react';
import type { ChildProfile, PrenatalCheckupProgress } from '../../types';
import {
  prenatalCheckupSchedule,
  prenatalItemKindLabels,
} from '../data/prenatalCheckups';
import type { PrenatalItemKind } from '../data/prenatalCheckups';
import { resolvePrenatalItems, weeksPregnant } from '../utils/prenatalSchedule';
import type { PrenatalItemStatus } from '../utils/prenatalSchedule';
import BloomShell from '../components/BloomShell';
import EmptyState from '../../common/ui/EmptyState';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { listItem, stagger, tap } from '../../common/ui/motion';
import { isPregnancyProfile } from '../../common/pregnancy';
import { toLocalDateKey } from '../../common/utils/dateHelpers';

const THEME = SERVICE_THEME.littlebloom;

/* 分類徽章：底色用淡的 DEFAULT 色階，字用同名的 -ink 才讀得到。 */
const KIND_STYLE: Record<PrenatalItemKind, string> = {
  checkup: 'bg-bloom-dusty-rose/15 text-bloom-dusty-rose-ink',
  ultrasound: 'bg-bloom-dusty-blue/20 text-bloom-dusty-blue-ink',
  screening: 'bg-bloom-sage/20 text-bloom-sage-ink',
  vaccine: 'bg-bloom-mauve/20 text-bloom-mauve-ink',
};

const SECTIONS: { status: PrenatalItemStatus; title: string }[] = [
  { status: 'overdue', title: '已過建議週數' },
  { status: 'due', title: '現在可以做' },
  { status: 'upcoming', title: '接下來' },
  { status: 'done', title: '已完成' },
];

const today = () => toLocalDateKey();

interface PrenatalPageProps {
  currentChild?: ChildProfile | null;
  progress: PrenatalCheckupProgress;
  onComplete: (
    templateId: string,
    record: { completedDate: string; clinicName?: string; notes?: string },
  ) => Promise<void>;
  onUndo: (templateId: string) => Promise<void>;
}

/**
 * 產檢時程：14 次公費產檢與各項篩檢，依末次月經推算日期。
 *
 * 這一頁補上首頁「產檢時程」按鈕原本的空實作（`onClick={() => {}}`），
 * 以及原本寫死在程式碼裡的假產檢資料。
 */
export default function PrenatalPage({
  currentChild,
  progress,
  onComplete,
  onUndo,
}: PrenatalPageProps) {
  const [formFor, setFormFor] = useState<string | null>(null);
  const [completedDate, setCompletedDate] = useState(today);
  const [clinicName, setClinicName] = useState('');
  const [notes, setNotes] = useState('');

  const lmp = currentChild?.pregnancyData?.lastPeriodDate ?? '';

  const items = useMemo(
    () => resolvePrenatalItems(lmp, prenatalCheckupSchedule, progress),
    [lmp, progress],
  );

  const weeks = lmp ? weeksPregnant(lmp) : 0;

  // 與 LittleBloomPage 同一個理由：出生後 lmp 仍在，只有 status 變成 archived。
  if (currentChild && lmp && !isPregnancyProfile(currentChild)) {
    return (
      <BloomShell title="產檢時程" backTo="#/littlebloom">
        <EmptyState
          theme={THEME}
          icon={Baby}
          title="寶寶已經出生了"
          description={'產檢時程已經走完，紀錄都保留著。\n寶寶的健兒門診與疫苗時程請到 LittleSteps 查看。'}
          action={{
            label: '前往 LittleSteps',
            onClick: () => {
              window.location.hash = '#/littlesteps';
            },
          }}
        />
      </BloomShell>
    );
  }

  if (!lmp) {
    return (
      <BloomShell title="產檢時程" backTo="#/littlebloom">
        <EmptyState
          theme={THEME}
          title="還沒有孕期資料"
          description={'新增一個孕期檔案並填入預產期後，\n14 次公費產檢的時程會依末次月經自動排出來。'}
          action={{
            label: '前往新增孕期檔案',
            onClick: () => {
              window.location.hash = '#/littlesteps';
            },
          }}
        />
      </BloomShell>
    );
  }

  const submit = async (templateId: string) => {
    await onComplete(templateId, {
      completedDate,
      clinicName: clinicName.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    setFormFor(null);
  };

  return (
    <BloomShell
      title="產檢時程"
      subtitle={`第 ${weeks + 1} 週 · 預產期 ${currentChild?.pregnancyData?.dueDate ?? ''}`}
      backTo="#/littlebloom"
    >
      <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
        {SECTIONS.map(({ status, title }) => {
          const rows = items.filter((item) => item.status === status);
          if (rows.length === 0) return null;

          return (
            <motion.section key={status} variants={listItem}>
              <h2 className={`px-1 mb-2 ${THEME.body}`}>
                {title}
                <span className={`ml-2 text-sm font-normal ${THEME.muted}`}>{rows.length}</span>
              </h2>

              <ul className="space-y-3">
                {rows.map((item) => {
                  const { template } = item;
                  const showForm = formFor === template.id;

                  return (
                    <li
                      key={template.id}
                      className={`card ${
                        status === 'overdue' ? 'bg-bloom-terracotta/10' : ''
                      } ${status === 'done' ? 'opacity-70' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`tag shrink-0 ${KIND_STYLE[template.kind]}`}>
                          {prenatalItemKindLabels[template.kind]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className={THEME.body}>
                            {template.visitNumber ? `第 ${template.visitNumber} 次 · ` : ''}
                            {template.title}
                          </h3>
                          <p className={`text-sm mt-0.5 ${THEME.muted}`}>
                            建議第 {template.dueWeek} 週 · {item.dueDate}
                            {status !== 'done' &&
                              (item.weeksUntilDue >= 0
                                ? ` · 還有 ${item.weeksUntilDue} 週`
                                : ` · 已過 ${Math.abs(item.weeksUntilDue)} 週`)}
                          </p>
                          <p className={`text-sm mt-2 leading-relaxed ${THEME.body}`}>
                            {template.description}
                          </p>
                          {item.completedDate && (
                            <p className="text-sm text-bloom-sage-ink mt-2">
                              已於 {item.completedDate} 完成
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-3">
                        {status === 'done' ? (
                          <motion.button
                            type="button"
                            whileTap={tap}
                            onClick={() => onUndo(template.id)}
                            className="btn-ghost text-sm"
                          >
                            <Undo2 className="w-4 h-4" />
                            取消完成
                          </motion.button>
                        ) : (
                          <motion.button
                            type="button"
                            whileTap={tap}
                            onClick={() => {
                              if (showForm) {
                                setFormFor(null);
                                return;
                              }
                              setFormFor(template.id);
                              setCompletedDate(today());
                              setClinicName('');
                              setNotes('');
                            }}
                            className="btn-secondary px-4 text-sm text-bloom-sage-ink"
                          >
                            <Check className="w-4 h-4" />
                            標記完成
                          </motion.button>
                        )}
                      </div>

                      {showForm && (
                        <div className="mt-3 pt-3 border-t border-bloom-sand space-y-2">
                          <label className={`block text-xs ${THEME.muted}`}>
                            完成日期
                            <input
                              type="date"
                              value={completedDate}
                              onChange={(e) => setCompletedDate(e.target.value)}
                              className="mt-1 w-full px-3 min-h-tap rounded-xl border border-bloom-sand text-sm text-bloom-stone-ink"
                            />
                          </label>
                          <input
                            type="text"
                            value={clinicName}
                            onChange={(e) => setClinicName(e.target.value)}
                            placeholder="院所（選填）"
                            className="w-full px-3 min-h-tap rounded-xl border border-bloom-sand text-sm text-bloom-stone-ink"
                          />
                          <input
                            type="text"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="備註（選填）"
                            className="w-full px-3 min-h-tap rounded-xl border border-bloom-sand text-sm text-bloom-stone-ink"
                          />
                          <button
                            type="button"
                            onClick={() => submit(template.id)}
                            className={`btn-primary w-full ${THEME.fill} ${THEME.fillText}`}
                          >
                            儲存
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </motion.section>
          );
        })}

        <p className={`text-xs leading-relaxed px-1 ${THEME.muted}`}>
          週數依末次月經第一天推算，實際時程請以產檢醫師安排為準。標示為自費的項目不在公費補助範圍內。
        </p>
      </motion.div>
    </BloomShell>
  );
}
