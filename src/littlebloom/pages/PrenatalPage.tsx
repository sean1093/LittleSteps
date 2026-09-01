import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Baby, Check, ChevronDown, History, Undo2 } from 'lucide-react';
import type { ChildProfile, PrenatalCheckupProgress } from '../../types';
import {
  prenatalCheckupSchedule,
  prenatalItemKindLabels,
} from '../data/prenatalCheckups';
import type { PrenatalItemKind } from '../data/prenatalCheckups';
import { resolvePrenatalItems, weeksPregnant } from '../utils/prenatalSchedule';
import type { PrenatalItemStatus, ResolvedPrenatalItem } from '../utils/prenatalSchedule';
import BloomShell from '../components/BloomShell';
import EmptyState from '../../common/ui/EmptyState';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { collapse, listItem, stagger, tap } from '../../common/ui/motion';
import { pressable } from '../../common/ui/pressable';
import { isPregnancyProfile } from '../../common/pregnancy';
import { formatDate, toLocalDateKey } from '../../common/utils/dateHelpers';
import { splitOverdueByProfileStart } from '../../common/utils/profileHistory';
import { goTo } from '../../common/navigate';

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
];

/* 已完成殿後，中間還要夾一區建檔前就到期的，所以不和上面三個放同一個陣列。 */
const DONE_SECTION: { status: PrenatalItemStatus; title: string } = {
  status: 'done',
  title: '已完成',
};

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
  /* 建檔前那一區預設收合：重點是「有這些東西」，不是逐條看完。 */
  const [historyOpen, setHistoryOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  /* 失敗訊息綁在出問題的那一列：這一頁同時列 14 次產檢，頁面級的橫幅說不清是哪一項。 */
  const [failure, setFailure] = useState<{ templateId: string; message: string } | null>(null);

  const lmp = currentChild?.pregnancyData?.lastPeriodDate ?? '';

  const items = useMemo(
    () => resolvePrenatalItems(lmp, prenatalCheckupSchedule, progress),
    [lmp, progress],
  );

  /* 建檔之後才到期的才是真的逾期；建檔前的只是 app 沒有那段紀錄。 */
  const { overdue, missingHistory } = useMemo(
    () => splitOverdueByProfileStart(items, currentChild?.createdAt),
    [items, currentChild?.createdAt],
  );

  const weeks = lmp ? weeksPregnant(lmp) : 0;

  // 與 LittleBloomPage 同一個理由：出生後 lmp 仍在，只有 status 變成 archived。
  if (currentChild && lmp && !isPregnancyProfile(currentChild)) {
    return (
      <BloomShell title="產檢時程" backTo="littlebloom">
        <EmptyState
          theme={THEME}
          icon={Baby}
          title="寶寶已經出生了"
          description={'產檢時程已經走完，紀錄都保留著。\n寶寶的健兒門診與疫苗時程請到 LittleSteps 查看。'}
          action={{
            label: '前往 LittleSteps',
            onClick: () => {
              goTo('littlesteps');
            },
          }}
        />
      </BloomShell>
    );
  }

  if (!lmp) {
    return (
      <BloomShell title="產檢時程" backTo="littlebloom">
        <EmptyState
          theme={THEME}
          title="還沒有孕期資料"
          description={'新增一個孕期檔案並填入預產期後，\n14 次公費產檢的時程會依末次月經自動排出來。'}
          action={{
            label: '回 LittleBloom 建立孕期檔案',
            onClick: () => {
              // 留在 LittleBloom 之內：新增孕期檔案的入口在本服務的首頁。
              goTo('littlebloom');
            },
          }}
        />
      </BloomShell>
    );
  }

  /*
   * store 的 upsertPrenatalRecord／clearPrenatalRecord 失敗時往外丟且不 toast
   * ——訊息由這一頁負責。表單必須留著：家長剛打的院所與備註不能因為一次網路
   * 逾時就被清掉，而重複點擊會寫進兩次。
   */
  const submit = async (templateId: string) => {
    if (saving) return;
    setSaving(true);
    setFailure(null);
    try {
      await onComplete(templateId, {
        completedDate,
        clinicName: clinicName.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      setFormFor(null);
    } catch (error) {
      console.error('儲存產檢記錄失敗:', error);
      setFailure({ templateId, message: '儲存失敗，剛才填的內容還在，請確認網路後再送出。' });
    } finally {
      setSaving(false);
    }
  };

  const undo = async (templateId: string) => {
    if (saving) return;
    setSaving(true);
    setFailure(null);
    try {
      await onUndo(templateId);
    } catch (error) {
      console.error('取消產檢記錄失敗:', error);
      setFailure({ templateId, message: '取消失敗，請確認網路後再試一次。' });
    } finally {
      setSaving(false);
    }
  };

  /**
   * 一列產檢。beforeProfile 的列不上警示底色、也不講落後幾週：那是給孕婦
   * 開始使用之後才到期的項目用的，套在她建檔前的產檢上只是在責怪她。
   */
  const itemRow = (item: ResolvedPrenatalItem, beforeProfile = false) => {
    const { template, status } = item;
    const showForm = formFor === template.id;
    const accent = status === 'overdue' && !beforeProfile ? 'bg-bloom-terracotta/10' : '';

    return (
      <li key={template.id} className={`card ${accent} ${status === 'done' ? 'opacity-70' : ''}`}>
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
              建議第 {template.dueWeek} 週 · {formatDate(item.dueDate)}
              {/* 落後幾週只講給真正過期的那幾項。狀態是 due 的還在可做的區間，
                  掛在「現在可以做」底下說它超過建議週數會自相矛盾。 */}
              {!beforeProfile &&
                status !== 'done' &&
                (status === 'overdue'
                  ? ` · 已超過建議週數 ${Math.abs(item.weeksUntilDue)} 週`
                  : item.weeksUntilDue >= 0
                    ? ` · 還有 ${item.weeksUntilDue} 週`
                    : '')}
            </p>
            <p className={`text-sm mt-2 leading-relaxed ${THEME.body}`}>
              {template.description}
            </p>
            {item.completedDate && (
              <p className="text-sm text-bloom-sage-ink mt-2">
                已於 {formatDate(item.completedDate)} 完成
              </p>
            )}
          </div>
        </div>

        <div className="mt-3">
          {status === 'done' ? (
            <motion.button
              type="button"
              whileTap={tap}
              onClick={() => {
                void undo(template.id);
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
                max={today()}
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
              onClick={() => {
                void submit(template.id);
              }}
              disabled={saving || !completedDate || completedDate > today()}
              className={`btn-primary w-full ${THEME.fill} ${THEME.fillText}`}
            >
              {saving ? '儲存中…' : '儲存'}
            </button>
          </div>
        )}

        {failure?.templateId === template.id && (
          <p role="alert" className="text-sm mt-2 text-bloom-terracotta-ink">
            {failure.message}
          </p>
        )}
      </li>
    );
  };

  /* 逾期那一區只放建檔之後才到期的項目，其餘照 status 分。 */
  const renderSection = ({ status, title }: { status: PrenatalItemStatus; title: string }) => {
    const rows = status === 'overdue' ? overdue : items.filter((item) => item.status === status);
    if (rows.length === 0) return null;

    return (
      <motion.section key={status} variants={listItem}>
        <h2 className={`px-1 mb-2 ${THEME.body}`}>
          {title}
          <span className={`ml-2 text-sm font-normal ${THEME.muted}`}>{rows.length}</span>
        </h2>

        <ul className="space-y-3">{rows.map((item) => itemRow(item))}</ul>
      </motion.section>
    );
  };

  return (
    <BloomShell
      title="產檢時程"
      subtitle={`第 ${weeks + 1} 週 · 預產期 ${formatDate(currentChild?.pregnancyData?.dueDate)}`}
      backTo="littlebloom"
    >
      <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
        {SECTIONS.map(renderSection)}

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
                    {'這些項目在你開始使用之前就到期了，app 沒有那段紀錄，不代表沒做。手邊有孕婦健康手冊的話可以照著補登；不補也不會影響之後的提醒。'}
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
                    {missingHistory.map((item) => itemRow(item, true))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )}

        {renderSection(DONE_SECTION)}

        <p className={`text-xs leading-relaxed px-1 ${THEME.muted}`}>
          週數依末次月經第一天推算，實際時程請以產檢醫師安排為準。標示為自費的項目不在公費補助範圍內。
        </p>
      </motion.div>
    </BloomShell>
  );
}
