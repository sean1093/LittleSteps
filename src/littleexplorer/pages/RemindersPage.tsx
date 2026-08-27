import { useMemo, useState } from 'react';
import { Baby, CalendarPlus, Check, Download, Syringe } from 'lucide-react';
import type {
  CareTaskRecord,
  ChildProfile,
  ResolvedCareTask,
  ToddlerAgeBand,
  ToddlerTipCategory,
} from '../../types';
import { getLucideIcon } from '../../common/lucideIcons';
import { calculateAge } from '../../utils/dateHelpers';
import { calculateAgeDisplay } from '../../utils/summaryCalculator';
import { careTaskKindLabels } from '../data/careTasks';
import { tipCategoryIcons, tipCategoryLabels, toddlerCareTips } from '../data/monthlyTips';
import { buildGoogleCalendarUrl, downloadIcs } from '../utils/icsExport';
import { TODDLER_MIN_MONTHS, bandForMonths } from '../utils/ageBands';
import ExplorerShell from '../components/ExplorerShell';
import ExplorerNotice from '../components/ExplorerNotice';
import AgeBandPicker from '../components/AgeBandPicker';

const CATEGORY_ORDER: ToddlerTipCategory[] = ['safety', 'feeding', 'behavior', 'health'];

const UPCOMING_HORIZON_DAYS = 90;

const SECTIONS: { status: ResolvedCareTask['status']; title: string; accent: string }[] = [
  { status: 'overdue', title: '已經逾期', accent: 'bg-explorer-clay/10 border-explorer-clay/40' },
  { status: 'due', title: '現在可以做', accent: 'bg-white border-transparent' },
  { status: 'upcoming', title: '接下來 90 天', accent: 'bg-white border-transparent' },
];

const today = () => new Date().toISOString().split('T')[0];

interface RemindersPageProps {
  currentChild?: ChildProfile | null;
  tasks: ResolvedCareTask[];
  reminderBadge?: number;
  onCompleteTask: (record: CareTaskRecord) => Promise<void>;
}

/**
 * 提醒分頁：有日期的待辦 ＋ 這個月齡的注意事項。
 *
 * 兩者性質不同，故分區呈現。待辦會逾期、可標記完成；注意事項只是提醒，
 * 刻意不給打勾——加上勾選會讓家長以為「看過了就處理完了」。
 */
export default function RemindersPage({
  currentChild,
  tasks,
  reminderBadge,
  onCompleteTask,
}: RemindersPageProps) {
  const ageMonths = currentChild ? calculateAge(currentChild.birthday) : 0;
  const [band, setBand] = useState<ToddlerAgeBand>(() => bandForMonths(ageMonths));
  const [formFor, setFormFor] = useState<string | null>(null);
  const [completedDate, setCompletedDate] = useState(today);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const visible = useMemo(
    () =>
      tasks.filter(
        (task) =>
          task.status === 'overdue' ||
          task.status === 'due' ||
          (task.status === 'upcoming' && task.daysUntilDue <= UPCOMING_HORIZON_DAYS),
      ),
    [tasks],
  );

  const bandTips = useMemo(
    () => toddlerCareTips.filter((tip) => tip.ageBand === band),
    [band],
  );

  const outOfRange = !currentChild ? (
    <ExplorerNotice
      icon={Baby}
      title="還沒有寶寶資料"
      description={'請先到 LittleSteps 新增寶寶，\n提醒會依出生日自動算出健檢、疫苗與塗氟的時程。'}
      action={{ label: '前往 LittleSteps', onClick: () => { window.location.hash = '#/littlesteps'; } }}
    />
  ) : ageMonths < TODDLER_MIN_MONTHS ? (
    <ExplorerNotice
      icon={Baby}
      title="寶寶還不到 1 歲"
      description={'幼兒期的提醒從滿 1 歲開始。\n1 歲前的疫苗與健檢請在 LittleSteps 的疫苗追蹤查看。'}
      action={{ label: '回 LittleSteps 疫苗追蹤', onClick: () => { window.location.hash = '#/littlesteps/vaccine-tracking'; } }}
    />
  ) : null;

  const openForm = (taskId: string) => {
    setFormFor(taskId);
    setCompletedDate(today());
    setLocation('');
    setNotes('');
  };

  const submitForm = async (taskId: string) => {
    await onCompleteTask({
      taskId,
      completedDate,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    setFormFor(null);
  };

  return (
    <ExplorerShell
      active="reminders"
      childName={currentChild?.name}
      ageLabel={currentChild ? calculateAgeDisplay(currentChild.birthday) : undefined}
      reminderBadge={reminderBadge}
    >
      {outOfRange ?? (
        <div className="space-y-4">
          {visible.length === 0 ? (
            <ExplorerNotice
              icon={Check}
              tone="celebrate"
              title="目前沒有待辦"
              description="接下來 90 天沒有到期的健檢、疫苗或塗氟。下一項到期時會自動出現在這裡。"
            />
          ) : (
            SECTIONS.map(({ status, title, accent }) => {
              const rows = visible.filter((task) => task.status === status);
              if (rows.length === 0) return null;

              return (
                <section key={status}>
                  <h2 className="px-1 mb-2 text-sm font-semibold text-explorer-bark/70">{title}</h2>
                  <ul className="space-y-3">
                    {rows.map((task) => {
                      const isVaccine = Boolean(task.template.vaccineId);
                      const showForm = formFor === task.template.id;

                      return (
                        <li
                          key={task.template.id}
                          className={`rounded-3xl border shadow-soft p-4 ${accent}`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="shrink-0 px-2 py-1 rounded-lg bg-explorer-sand text-[11px] font-medium text-explorer-bark/70">
                              {careTaskKindLabels[task.template.kind]}
                            </span>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-explorer-bark">{task.template.title}</h3>
                              <p className="text-sm text-explorer-bark/60 mt-0.5">
                                {task.dueDate}
                                {' · '}
                                {task.daysUntilDue >= 0
                                  ? `還有 ${task.daysUntilDue} 天`
                                  : `已逾期 ${Math.abs(task.daysUntilDue)} 天`}
                              </p>
                              <p className="text-sm text-explorer-bark/70 mt-2 leading-relaxed">
                                {task.template.description}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-2 pl-1">
                            {isVaccine ? (
                              <button
                                type="button"
                                onClick={() => {
                                  window.location.hash = '#/littlesteps/vaccine-tracking';
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-explorer-sky/15 text-explorer-sky text-sm font-medium"
                              >
                                <Syringe className="w-4 h-4" />
                                到疫苗追蹤勾選
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => (showForm ? setFormFor(null) : openForm(task.template.id))}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-explorer-meadow/15 text-explorer-meadow-dark text-sm font-medium"
                              >
                                <Check className="w-4 h-4" />
                                標記完成
                              </button>
                            )}

                            <a
                              href={buildGoogleCalendarUrl(task, currentChild?.name ?? '寶寶')}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-explorer-bark/60 text-sm hover:bg-explorer-sand"
                            >
                              <CalendarPlus className="w-4 h-4" />
                              加入 Google 日曆
                            </a>
                          </div>

                          {showForm && (
                            <div className="mt-3 pt-3 border-t border-explorer-sand space-y-2">
                              <label className="block text-xs text-explorer-bark/60">
                                完成日期
                                <input
                                  type="date"
                                  value={completedDate}
                                  onChange={(e) => setCompletedDate(e.target.value)}
                                  className="mt-1 w-full px-3 py-2 rounded-xl border border-explorer-sand text-sm text-explorer-bark focus:outline-none focus:ring-2 focus:ring-explorer-sunbeam"
                                />
                              </label>
                              <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="院所（選填）"
                                className="w-full px-3 py-2 rounded-xl border border-explorer-sand text-sm focus:outline-none focus:ring-2 focus:ring-explorer-sunbeam"
                              />
                              <input
                                type="text"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="備註（選填）"
                                className="w-full px-3 py-2 rounded-xl border border-explorer-sand text-sm focus:outline-none focus:ring-2 focus:ring-explorer-sunbeam"
                              />
                              <button
                                type="button"
                                onClick={() => submitForm(task.template.id)}
                                className="w-full py-2 rounded-xl bg-explorer-meadow text-white text-sm font-semibold"
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
            })
          )}

          {visible.length > 0 && (
            <button
              type="button"
              onClick={() => downloadIcs(visible, currentChild?.name ?? '寶寶')}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-white shadow-soft text-explorer-bark font-medium hover:shadow-soft-lg transition-shadow"
            >
              <Download className="w-5 h-5" />
              匯出全部時程到行事曆
            </button>
          )}

          <section className="pt-2">
            <h2 className="px-1 mb-2 text-sm font-semibold text-explorer-bark/70">這個月齡的注意事項</h2>
            <div className="mb-3">
              <AgeBandPicker selected={band} onSelect={setBand} />
            </div>

            <div className="space-y-3">
              {CATEGORY_ORDER.map((category) => {
                const tip = bandTips.find((t) => t.category === category);
                if (!tip) return null;
                const CategoryIcon = getLucideIcon(tipCategoryIcons[category]);

                return (
                  <article key={category} className="bg-white rounded-3xl shadow-soft p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <CategoryIcon className="w-5 h-5 text-explorer-sunbeam-dark" />
                      <span className="text-xs font-medium text-explorer-bark/50">
                        {tipCategoryLabels[category]}
                      </span>
                    </div>
                    <h3 className="font-semibold text-explorer-bark mb-2">{tip.title}</h3>
                    <ul className="space-y-1.5">
                      {tip.highlights.map((line) => (
                        <li key={line} className="text-sm text-explorer-bark/70 flex gap-2 leading-relaxed">
                          <span className="text-explorer-meadow-dark shrink-0">·</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </ExplorerShell>
  );
}
