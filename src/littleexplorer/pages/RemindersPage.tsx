import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarPlus, Check, Download, Syringe } from 'lucide-react';
import type {
  CareTaskRecord,
  ChildProfile,
  ResolvedCareTask,
  ToddlerAgeBand,
  ToddlerTipCategory,
  Gender,
} from '../../types';
import { isPregnancyProfile } from '../../common/pregnancy';
import { calculateAge, formatDate, toLocalDateKey } from '../../common/utils/dateHelpers';
import { calculateAgeDisplay } from '../../common/utils/summaryCalculator';
import EmptyState from '../../common/ui/EmptyState';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { listItem, stagger, tap } from '../../common/ui/motion';
import { careTaskKindLabels } from '../data/careTasks';
import { tipCategoryLabels, toddlerCareTips } from '../data/monthlyTips';
import { buildGoogleCalendarUrl, downloadIcs } from '../utils/icsExport';
import { TODDLER_MIN_MONTHS, bandForMonths } from '../utils/ageBands';
import ExplorerShell from '../components/ExplorerShell';
import NoChildNotice from '../components/NoChildNotice';
import AgeBandPicker from '../components/AgeBandPicker';
import { goTo } from '../../common/navigate';

const THEME = SERVICE_THEME.littleexplorer;

const CATEGORY_ORDER: ToddlerTipCategory[] = ['safety', 'feeding', 'behavior', 'health'];

const UPCOMING_HORIZON_DAYS = 90;

/* 逾期是唯一需要靠卡片本身喊出來的狀態，所以只有它帶顏色與框線。 */
const SECTIONS: { status: ResolvedCareTask['status']; title: string; accent: string }[] = [
  { status: 'overdue', title: '已經逾期', accent: 'bg-explorer-clay/10 border border-explorer-clay/40' },
  { status: 'due', title: '現在可以做', accent: '' },
  { status: 'upcoming', title: '接下來 90 天', accent: '' },
];

const today = () => toLocalDateKey();

interface RemindersPageProps {
  currentChild?: ChildProfile | null;
  tasks: ResolvedCareTask[];
  reminderBadge?: number;
  onCompleteTask: (record: CareTaskRecord) => Promise<void>;
  /**
   * 新增／加入寶寶。LittleExplorer 自己開新增視窗，不把家長送去 LittleSteps
   * ——共用的是帳號與孩子資料，不是彼此的畫面。
   */
  onAddChild: (name: string, birthday: string, gender?: Gender) => Promise<void>;
  onJoinChild?: (uuid: string) => Promise<void>;
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
  onAddChild,
  onJoinChild,
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
    <NoChildNotice
      description={'新增寶寶後，提醒會依出生日自動算出健檢、疫苗與塗氟的時程。'}
      onAddChild={onAddChild}
      onJoinChild={onJoinChild}
    />
  ) : isPregnancyProfile(currentChild) ? (
    <EmptyState
      theme={THEME}
      title="這是孕期檔案"
      description={'目前選擇的是還沒出生的寶寶。\n產檢時程在 LittleBloom；出生後在那裡登記出生日期，幼兒期的提醒就會接手。'}
      action={{ label: '前往 LittleBloom 產檢時程', onClick: () => { goTo('littlebloom/prenatal'); } }}
    />
  ) : ageMonths < TODDLER_MIN_MONTHS ? (
    <EmptyState
      theme={THEME}
      title="寶寶還不到 1 歲"
      description={'幼兒期的提醒從滿 1 歲開始。\n1 歲前的疫苗與健檢請在 LittleSteps 的疫苗追蹤查看。'}
      action={{ label: '回 LittleSteps 疫苗追蹤', onClick: () => { goTo('littlesteps/vaccine-tracking'); } }}
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
        <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
          {visible.length === 0 ? (
            <motion.div variants={listItem}>
              <EmptyState
                theme={THEME}
                icon={Check}
                title="目前沒有待辦"
                description="接下來 90 天沒有到期的健檢、疫苗或塗氟。下一項到期時會自動出現在這裡。"
              />
            </motion.div>
          ) : (
            SECTIONS.map(({ status, title, accent }) => {
              const rows = visible.filter((task) => task.status === status);
              if (rows.length === 0) return null;

              return (
                <motion.section key={status} variants={listItem}>
                  <h2 className={`px-1 mb-2 ${THEME.body}`}>{title}</h2>
                  <ul className="space-y-3">
                    {rows.map((task) => {
                      const isVaccine = Boolean(task.template.vaccineId);
                      const showForm = formFor === task.template.id;

                      return (
                        <li key={task.template.id} className={`card ${accent}`}>
                          <div className="flex items-start gap-3">
                            <span className={`tag shrink-0 bg-explorer-sand ${THEME.muted}`}>
                              {careTaskKindLabels[task.template.kind]}
                            </span>
                            <div className="flex-1 min-w-0">
                              <h3 className={THEME.body}>{task.template.title}</h3>
                              <p className={`text-sm mt-0.5 ${THEME.muted}`}>
                                {formatDate(task.dueDate)}
                                {' · '}
                                {task.daysUntilDue >= 0
                                  ? `還有 ${task.daysUntilDue} 天`
                                  : `已逾期 ${Math.abs(task.daysUntilDue)} 天`}
                              </p>
                              <p className={`text-sm mt-2 leading-relaxed ${THEME.body}`}>
                                {task.template.description}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            {isVaccine ? (
                              <motion.button
                                type="button"
                                whileTap={tap}
                                onClick={() => {
                                  goTo('littlesteps/vaccine-tracking');
                                }}
                                className="btn-secondary px-4 text-sm text-explorer-sky-ink"
                              >
                                <Syringe className="w-4 h-4" />
                                到疫苗追蹤勾選
                              </motion.button>
                            ) : (
                              <motion.button
                                type="button"
                                whileTap={tap}
                                onClick={() => (showForm ? setFormFor(null) : openForm(task.template.id))}
                                className="btn-secondary px-4 text-sm text-explorer-meadow-ink"
                              >
                                <Check className="w-4 h-4" />
                                標記完成
                              </motion.button>
                            )}

                            <a
                              href={buildGoogleCalendarUrl(task, currentChild?.name ?? '寶寶')}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-ghost text-sm"
                            >
                              <CalendarPlus className="w-4 h-4" />
                              加入 Google 日曆
                            </a>
                          </div>

                          {showForm && (
                            <div className="mt-3 pt-3 border-t border-explorer-sand space-y-2">
                              <label className={`block text-xs ${THEME.muted}`}>
                                完成日期
                                <input
                                  type="date"
                                  value={completedDate}
                                  onChange={(e) => setCompletedDate(e.target.value)}
                                  className="mt-1 w-full px-3 min-h-tap rounded-xl border border-explorer-sand text-sm text-explorer-bark"
                                />
                              </label>
                              <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="院所（選填）"
                                className="w-full px-3 min-h-tap rounded-xl border border-explorer-sand text-sm text-explorer-bark"
                              />
                              <input
                                type="text"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="備註（選填）"
                                className="w-full px-3 min-h-tap rounded-xl border border-explorer-sand text-sm text-explorer-bark"
                              />
                              <button
                                type="button"
                                onClick={() => submitForm(task.template.id)}
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
            })
          )}

          {visible.length > 0 && (
            <motion.button
              variants={listItem}
              type="button"
              whileTap={tap}
              onClick={() => downloadIcs(visible, currentChild?.name ?? '寶寶')}
              className="btn-secondary w-full text-explorer-bark"
            >
              <Download className="w-5 h-5" />
              匯出全部時程到行事曆
            </motion.button>
          )}

          <motion.section variants={listItem} className="pt-2">
            <h2 className={`px-1 mb-2 ${THEME.body}`}>這個月齡的注意事項</h2>
            <div className="mb-3">
              <AgeBandPicker selected={band} onSelect={setBand} />
            </div>

            <div className="space-y-3">
              {CATEGORY_ORDER.map((category) => {
                const tip = bandTips.find((t) => t.category === category);
                if (!tip) return null;

                return (
                  <article key={category} className="panel">
                    <span className={`text-xs font-medium ${THEME.muted}`}>
                      {tipCategoryLabels[category]}
                    </span>
                    <h3 className={`mt-1 mb-2 ${THEME.body}`}>{tip.title}</h3>
                    <ul className="space-y-1.5">
                      {tip.highlights.map((line) => (
                        <li key={line} className={`text-sm flex gap-2 leading-relaxed ${THEME.body}`}>
                          <span className="text-explorer-meadow-ink shrink-0">·</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </motion.section>
        </motion.div>
      )}
    </ExplorerShell>
  );
}
