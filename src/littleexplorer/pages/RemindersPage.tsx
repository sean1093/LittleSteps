import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarPlus, Check, ChevronDown, Download, History, Syringe, Undo2 } from 'lucide-react';
import type {
  CareTaskRecord,
  ChildProfile,
  ResolvedCareTask,
  ToddlerAgeBand,
  ToddlerTipCategory,
  Gender,
} from '../../types';
import { isCorrecting, type GestationalAge } from '../../common/correctedAge';
import { isPregnancyProfile } from '../../common/pregnancy';
import { calculateAge, formatDate, toLocalDateKey } from '../../common/utils/dateHelpers';
import { calculateAgeDisplay } from '../../common/utils/summaryCalculator';
import { splitOverdueByProfileStart } from '../../common/utils/profileHistory';
import EmptyState from '../../common/ui/EmptyState';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { collapse, listItem, stagger, tap } from '../../common/ui/motion';
import { pressable } from '../../common/ui/pressable';
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

/*
 * 逾期是唯一需要靠卡片本身喊出來的狀態，所以只有它帶顏色與框線。
 * 這一區只放建檔之後才到期的項目；建檔前就到期的另外收在下方的收合區。
 */
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
   * 取消一筆照護記錄。沒有它，日期填錯的完成就永遠改不回來——完成的項目會
   * 被這一頁篩掉，家長再也看不到、也碰不到那筆紀錄。
   */
  onUndoTask?: (taskId: string) => Promise<void>;
  /**
   * 新增／加入寶寶。LittleExplorer 自己開新增視窗，不把家長送去 LittleSteps
   * ——共用的是帳號與孩子資料，不是彼此的畫面。
   */
  onAddChild: (
    name: string,
    birthday: string,
    gender?: Gender,
    gestationalAge?: GestationalAge,
  ) => Promise<void>;
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
  onUndoTask,
  onAddChild,
  onJoinChild,
}: RemindersPageProps) {
  const ageMonths = currentChild ? calculateAge(currentChild.birthday) : 0;
  const [band, setBand] = useState<ToddlerAgeBand>(() => bandForMonths(ageMonths));
  const [formFor, setFormFor] = useState<string | null>(null);
  const [completedDate, setCompletedDate] = useState(today);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  /* 建檔前那一區預設收合：重點是「有這些東西」，不是逐條看完。 */
  const [historyOpen, setHistoryOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  /* 失敗訊息綁在出問題的那一列：這一頁同時列十幾項，頁面級的橫幅說不清是哪一項。 */
  const [failure, setFailure] = useState<{ taskId: string; message: string } | null>(null);

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

  /*
   * 完成的項目要留得看得見。原本 visible 把 done 濾掉，於是一按下標記完成
   * 那一列就從畫面上消失——日期填錯也沒有任何入口可以改。
   */
  const done = useMemo(() => tasks.filter((task) => task.status === 'done'), [tasks]);

  /* 建檔之後才到期的才是真的逾期；建檔前的只是 app 沒有那段紀錄。 */
  const { overdue, missingHistory } = useMemo(
    () => splitOverdueByProfileStart(visible, currentChild?.createdAt),
    [visible, currentChild?.createdAt],
  );

  const sections = useMemo(
    () =>
      SECTIONS.map(({ status, title, accent }) => ({
        status,
        title,
        accent,
        rows: status === 'overdue' ? overdue : visible.filter((task) => task.status === status),
      })).filter(({ rows }) => rows.length > 0),
    [overdue, visible],
  );

  /* 空狀態與匯出都只看可行動的項目：建檔前的舊項目不該塞進家長的行事曆。 */
  const actionable = useMemo(() => sections.flatMap(({ rows }) => rows), [sections]);

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

  /*
   * store 的 upsertCareTaskRecord／清除記錄失敗時往外丟且不 toast——訊息由這
   * 一頁負責。表單要留著：家長剛填的院所與備註不能因為一次網路逾時就消失，
   * 而重複點擊會寫進兩次。
   */
  const submitForm = async (taskId: string) => {
    if (saving) return;
    setSaving(true);
    setFailure(null);
    try {
      await onCompleteTask({
        taskId,
        completedDate,
        location: location.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      setFormFor(null);
    } catch (error) {
      console.error('儲存照護記錄失敗:', error);
      setFailure({ taskId, message: '儲存失敗，剛才填的內容還在，請確認網路後再送出。' });
    } finally {
      setSaving(false);
    }
  };

  const undoTask = async (taskId: string) => {
    if (!onUndoTask || saving) return;
    setSaving(true);
    setFailure(null);
    try {
      await onUndoTask(taskId);
    } catch (error) {
      console.error('取消照護記錄失敗:', error);
      setFailure({ taskId, message: '取消失敗，請確認網路後再試一次。' });
    } finally {
      setSaving(false);
    }
  };

  /**
   * 一列待辦。beforeProfile 的列不講「已逾期 N 天」，也不給加入日曆：那兩件事
   * 是給家長用 app 期間漏掉的項目用的，套在建檔前的舊項目上等於指責家長沒做錯
   * 的事，還會把一年前的行程塞進行事曆。
   */
  const taskRow = (task: ResolvedCareTask, accent: string, beforeProfile = false) => {
    const isVaccine = Boolean(task.template.vaccineId);
    const showForm = formFor === task.template.id;
    const isDone = task.status === 'done';
    /* 已完成、又不是疫苗、而 onUndoTask 還沒接上時，這一列沒有任何動作可做。 */
    const showActions = !isDone || isVaccine || Boolean(onUndoTask);

    return (
      <li key={task.template.id} className={`card ${accent}`}>
        <div className="flex items-start gap-3">
          <span className={`tag shrink-0 bg-explorer-sand ${THEME.muted}`}>
            {careTaskKindLabels[task.template.kind]}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className={THEME.body}>{task.template.title}</h3>
            <p className={`text-sm mt-0.5 ${THEME.muted}`}>
              {/* 「已逾期」只給真正逾期的列。狀態是 due 的項目施打窗口還開著，
                  在「現在可以做」底下寫「已逾期 365 天」自相矛盾，也把一件
                  還來得及的事說成錯誤。 */}
              {beforeProfile
                ? `建議日期 ${formatDate(task.dueDate)}`
                : task.status === 'overdue'
                  ? `${formatDate(task.dueDate)} · 已逾期 ${Math.abs(task.daysUntilDue)} 天`
                  : task.daysUntilDue >= 0
                    ? `${formatDate(task.dueDate)} · 還有 ${task.daysUntilDue} 天`
                    : `建議日期 ${formatDate(task.dueDate)}`}
            </p>
            <p className={`text-sm mt-2 leading-relaxed ${THEME.body}`}>
              {task.template.description}
            </p>
            {isDone && (
              <p className="text-sm mt-2 text-explorer-meadow-ink">
                {/* 疫苗只勾了接種、沒填日期時 completedDate 是空字串，
                    寫成「已於 完成」等於漏字。 */}
                {task.completedDate
                  ? `已於 ${formatDate(task.completedDate)} 完成`
                  : '已完成（沒有記錄日期）'}
              </p>
            )}
          </div>
        </div>

        {showActions && (
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
            ) : isDone ? (
              <motion.button
                type="button"
                whileTap={tap}
                onClick={() => {
                  void undoTask(task.template.id);
                }}
                disabled={saving}
                className="btn-ghost text-sm disabled:opacity-60"
              >
                <Undo2 className="w-4 h-4" />
                取消完成
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

            {/* 做完的項目不必再塞進行事曆。 */}
            {!beforeProfile && !isDone && (
              <a
                href={buildGoogleCalendarUrl(task, currentChild?.name ?? '寶寶')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-sm"
              >
                <CalendarPlus className="w-4 h-4" />
                加入 Google 日曆
              </a>
            )}
          </div>
        )}

        {showForm && (
          <div className="mt-3 pt-3 border-t border-explorer-sand space-y-2">
            <label className={`block text-xs ${THEME.muted}`}>
              完成日期
              <input
                type="date"
                value={completedDate}
                max={today()}
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
              onClick={() => {
                void submitForm(task.template.id);
              }}
              disabled={saving || !completedDate || completedDate > today()}
              className={`btn-primary w-full ${THEME.fill} ${THEME.fillText}`}
            >
              {saving ? '儲存中…' : '儲存'}
            </button>
          </div>
        )}

        {failure?.taskId === task.template.id && (
          <p role="alert" className="text-sm mt-2 text-explorer-clay-ink">
            {failure.message}
          </p>
        )}
      </li>
    );
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
          {/* 這一頁的到期日全部依出生日期算，與生長曲線用的矯正年齡不同。
              早產兒的家長看得到兩套年齡，所以要說明哪一套用在哪裡——政府的
              健檢與疫苗時程沒有矯正年齡這回事。 */}
          {currentChild && isCorrecting(currentChild) && (
            <motion.p variants={listItem} className={`card text-sm ${THEME.muted}`}>
              健檢、疫苗與塗氟的到期日依實際出生日期計算，不因早產而延後。矯正年齡用在生長曲線與發展檢核。
            </motion.p>
          )}
          {actionable.length === 0 ? (
            <motion.div variants={listItem}>
              <EmptyState
                theme={THEME}
                title="目前沒有待辦"
                description="接下來 90 天沒有到期的健檢、疫苗或塗氟。下一項到期時會自動出現在這裡。"
              />
            </motion.div>
          ) : (
            sections.map(({ status, title, accent, rows }) => (
              <motion.section key={status} variants={listItem}>
                <h2 className={`px-1 mb-2 ${THEME.body}`}>{title}</h2>
                <ul className="space-y-3">{rows.map((task) => taskRow(task, accent))}</ul>
              </motion.section>
            ))
          )}

          {missingHistory.length > 0 && (
            <motion.section variants={listItem}>
              <div
                className="card-tap"
                {...pressable(() => setHistoryOpen((open) => !open), historyOpen)}
              >
                <div className="flex items-start gap-3">
                  <History className={`w-5 h-5 mt-0.5 shrink-0 ${THEME.muted}`} />
                  <div className="flex-1 min-w-0">
                    <h2 className={THEME.body}>
                      開始使用前就到期的項目
                      <span className={`ml-2 text-sm font-normal ${THEME.muted}`}>
                        {missingHistory.length} 項
                      </span>
                    </h2>
                    <p className={`text-sm mt-1 leading-relaxed ${THEME.muted}`}>
                      {'這些項目在你開始使用之前就到期了，app 沒有那段紀錄，不代表沒做。手邊有兒童健康手冊的話可以照著補登；不補也不會影響之後的提醒。'}
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: historyOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className={`w-5 h-5 shrink-0 ${THEME.muted}`} />
                  </motion.div>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {historyOpen && (
                  <motion.div {...collapse} className="overflow-hidden">
                    <ul className="space-y-3 pt-3">
                      {missingHistory.map((task) => taskRow(task, '', true))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          )}

          {/* 已完成殿後，而且不算進 actionable：匯出與空狀態都只看還得動的項目。 */}
          {done.length > 0 && (
            <motion.section variants={listItem}>
              <h2 className={`px-1 mb-2 ${THEME.body}`}>
                已完成
                <span className={`ml-2 text-sm font-normal ${THEME.muted}`}>{done.length}</span>
              </h2>
              <ul className="space-y-3">{done.map((task) => taskRow(task, ''))}</ul>
            </motion.section>
          )}

          {actionable.length > 0 && (
            <motion.button
              variants={listItem}
              type="button"
              whileTap={tap}
              onClick={() => downloadIcs(actionable, currentChild?.name ?? '寶寶')}
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
