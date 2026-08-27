import { useMemo, useState } from 'react';
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
import { toLocalDateKey } from '../../utils/dateHelpers';

const KIND_STYLE: Record<PrenatalItemKind, string> = {
  checkup: 'bg-bloom-dusty-rose/15 text-bloom-dusty-rose-dark',
  ultrasound: 'bg-bloom-dusty-blue/20 text-bloom-dusty-blue-dark',
  screening: 'bg-bloom-sage/20 text-bloom-sage-dark',
  vaccine: 'bg-bloom-mauve/20 text-bloom-mauve-dark',
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

  if (!lmp) {
    return (
      <BloomShell title="產檢時程" backTo="#/littlebloom">
        <div className="bg-white rounded-3xl shadow-soft p-6 text-center">
          <Baby className="w-12 h-12 text-bloom-dusty-rose mx-auto mb-4" />
          <h2 className="text-lg font-bold text-bloom-stone mb-2">還沒有孕期資料</h2>
          <p className="text-sm text-bloom-stone/70 leading-relaxed">
            請先從側邊選單新增一個孕期檔案並填入預產期，
            <br />
            產檢時程會依末次月經自動排出來。
          </p>
        </div>
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
      <div className="space-y-5">
        {SECTIONS.map(({ status, title }) => {
          const rows = items.filter((item) => item.status === status);
          if (rows.length === 0) return null;

          return (
            <section key={status}>
              <h2 className="px-1 mb-2 text-sm font-semibold text-bloom-stone/70">
                {title}
                <span className="ml-2 font-normal">{rows.length}</span>
              </h2>

              <ul className="space-y-3">
                {rows.map((item) => {
                  const { template } = item;
                  const showForm = formFor === template.id;

                  return (
                    <li
                      key={template.id}
                      className={`rounded-3xl shadow-soft p-4 ${
                        status === 'overdue' ? 'bg-bloom-terracotta/10' : 'bg-white'
                      } ${status === 'done' ? 'opacity-70' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`shrink-0 px-2 py-1 rounded-lg text-[11px] font-medium ${KIND_STYLE[template.kind]}`}
                        >
                          {prenatalItemKindLabels[template.kind]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-bloom-stone">
                            {template.visitNumber ? `第 ${template.visitNumber} 次 · ` : ''}
                            {template.title}
                          </h3>
                          <p className="text-sm text-bloom-stone/60 mt-0.5">
                            建議第 {template.dueWeek} 週 · {item.dueDate}
                            {status !== 'done' &&
                              (item.weeksUntilDue >= 0
                                ? ` · 還有 ${item.weeksUntilDue} 週`
                                : ` · 已過 ${Math.abs(item.weeksUntilDue)} 週`)}
                          </p>
                          <p className="text-sm text-bloom-stone/70 mt-2 leading-relaxed">
                            {template.description}
                          </p>
                          {item.completedDate && (
                            <p className="text-sm text-bloom-sage-dark mt-2">
                              已於 {item.completedDate} 完成
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 pl-1">
                        {status === 'done' ? (
                          <button
                            type="button"
                            onClick={() => onUndo(template.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-bloom-stone/60 text-sm hover:bg-bloom-sand"
                          >
                            <Undo2 className="w-4 h-4" />
                            取消完成
                          </button>
                        ) : (
                          <button
                            type="button"
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
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-bloom-sage/20 text-bloom-sage-dark text-sm font-medium"
                          >
                            <Check className="w-4 h-4" />
                            標記完成
                          </button>
                        )}
                      </div>

                      {showForm && (
                        <div className="mt-3 pt-3 border-t border-bloom-sand space-y-2">
                          <label className="block text-xs text-bloom-stone/60">
                            完成日期
                            <input
                              type="date"
                              value={completedDate}
                              onChange={(e) => setCompletedDate(e.target.value)}
                              className="mt-1 w-full px-3 py-2 rounded-xl border border-bloom-sand text-sm text-bloom-stone focus:outline-none focus:ring-2 focus:ring-bloom-dusty-rose"
                            />
                          </label>
                          <input
                            type="text"
                            value={clinicName}
                            onChange={(e) => setClinicName(e.target.value)}
                            placeholder="院所（選填）"
                            className="w-full px-3 py-2 rounded-xl border border-bloom-sand text-sm focus:outline-none focus:ring-2 focus:ring-bloom-dusty-rose"
                          />
                          <input
                            type="text"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="備註（選填）"
                            className="w-full px-3 py-2 rounded-xl border border-bloom-sand text-sm focus:outline-none focus:ring-2 focus:ring-bloom-dusty-rose"
                          />
                          <button
                            type="button"
                            onClick={() => submit(template.id)}
                            className="w-full py-2 rounded-xl bg-bloom-dusty-rose text-white text-sm font-semibold"
                          >
                            儲存
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

        <p className="text-xs text-bloom-stone/50 leading-relaxed px-1">
          週數依末次月經第一天推算，實際時程請以產檢醫師安排為準。標示為自費的項目不在公費補助範圍內。
        </p>
      </div>
    </BloomShell>
  );
}
