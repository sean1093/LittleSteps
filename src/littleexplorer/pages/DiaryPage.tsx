import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PenLine, Sprout, Trash2, X } from 'lucide-react';
import type { ChildProfile, DiaryEntry, DiaryMood, Gender } from '../../types';
import { calculateAgeDisplay } from '../../common/utils/summaryCalculator';
import EmptyState from '../../common/ui/EmptyState';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { listItem, stagger, tap } from '../../common/ui/motion';
import { developmentCheckItems } from '../data/developmentChecks';
import { groupEntriesByMonth } from '../utils/diaryHelpers';
import ExplorerShell from '../components/ExplorerShell';
import NoChildNotice from '../components/NoChildNotice';
import { formatDate, toLocalDateKey } from '../../common/utils/dateHelpers';
import { confirmDelete } from '../../common/ui/confirmDelete';

const THEME = SERVICE_THEME.littleexplorer;

/* 心情是使用者選的值，不是裝飾：文字才是標籤，emoji 只是前面那一小記。 */
const MOODS: { value: DiaryMood; emoji: string; label: string }[] = [
  { value: 'happy', emoji: '😊', label: '開心' },
  { value: 'proud', emoji: '🥹', label: '感動' },
  { value: 'tired', emoji: '😮‍💨', label: '累' },
  { value: 'worried', emoji: '😟', label: '擔心' },
  { value: 'funny', emoji: '😂', label: '好笑' },
];

const today = () => toLocalDateKey();

interface DiaryPageProps {
  currentChild?: ChildProfile | null;
  entries: DiaryEntry[];
  reminderBadge?: number;
  onAdd: (entry: Omit<DiaryEntry, 'id' | 'childId' | 'createdAt'>) => Promise<string | undefined>;
  onUpdate: (entryId: string, updates: Partial<DiaryEntry>) => Promise<void>;
  onDelete: (entryId: string) => Promise<void>;
  /**
   * 新增／加入寶寶。LittleExplorer 自己開新增視窗，不把家長送去 LittleSteps
   * ——共用的是帳號與孩子資料，不是彼此的畫面。
   */
  onAddChild: (name: string, birthday: string, gender?: Gender) => Promise<void>;
  onJoinChild?: (uuid: string) => Promise<void>;
}

/**
 * 成長日記：自由書寫的質性紀錄。
 *
 * 與 LittleSteps 的快速日誌切乾淨——那邊記餵奶／睡眠／尿布的結構化數據，
 * 這邊記那些永遠不會出現在數據裡的東西。日記刻意不顯示快速日誌的資料：
 * 混合時間軸看似整合，實際上會讓家長不知道該去哪裡寫。
 *
 * 這是唯一不做年齡守門的分頁——不論孩子 11 個月還是 4 歲，既有紀錄都必須
 * 看得到、寫得了。
 */
export default function DiaryPage({
  currentChild,
  entries,
  reminderBadge,
  onAdd,
  onUpdate,
  onDelete,
  onAddChild,
  onJoinChild,
}: DiaryPageProps) {
  const [composerOpen, setComposerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [date, setDate] = useState(today);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<DiaryMood | undefined>(undefined);

  const groups = useMemo(() => groupEntriesByMonth(entries), [entries]);

  const checkItemTitles = useMemo(() => {
    const titles: Record<string, string> = {};
    for (const item of developmentCheckItems) titles[item.id] = item.title;
    return titles;
  }, []);

  const resetForm = () => {
    setComposerOpen(false);
    setEditingId(null);
    setDate(today());
    setContent('');
    setMood(undefined);
  };

  const startEdit = (entry: DiaryEntry) => {
    setEditingId(entry.id);
    setComposerOpen(false);
    setDate(entry.date);
    setContent(entry.content);
    setMood(entry.mood);
  };

  const submit = async () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    if (editingId) {
      await onUpdate(editingId, { date, content: trimmed, mood });
    } else {
      await onAdd({ date, content: trimmed, mood });
    }
    resetForm();
  };

  const remove = async (entry: DiaryEntry) => {
    if (!confirmDelete('這則日記')) return;
    await onDelete(entry.id);
    if (editingId === entry.id) resetForm();
  };

  const form = (
    <div className="space-y-3">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full px-3 min-h-tap rounded-xl border border-explorer-sand text-sm text-explorer-bark"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        autoFocus
        placeholder="今天發生了什麼？"
        className="w-full px-3 py-2 rounded-xl border border-explorer-sand text-sm text-explorer-bark leading-relaxed resize-none"
      />
      <div className="flex flex-wrap gap-2">
        {MOODS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setMood(mood === option.value ? undefined : option.value)}
            aria-pressed={mood === option.value}
            className={`chip ${
              mood === option.value
                ? 'bg-explorer-sunbeam-ink text-white border-explorer-sunbeam-ink hover:border-explorer-sunbeam-ink'
                : ''
            }`}
          >
            <span aria-hidden="true">{option.emoji}</span>
            {option.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={!content.trim()}
          className={`btn-primary flex-1 ${THEME.fill} ${THEME.fillText}`}
        >
          {editingId ? '儲存修改' : '記下來'}
        </button>
        <button type="button" onClick={resetForm} aria-label="取消" className="btn-icon">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  return (
    <ExplorerShell
      active="diary"
      childName={currentChild?.name}
      ageLabel={currentChild ? calculateAgeDisplay(currentChild.birthday) : undefined}
      reminderBadge={reminderBadge}
    >
      {!currentChild ? (
        <NoChildNotice
          description={'新增寶寶後，就能在這裡留下成長的點滴。'}
          onAddChild={onAddChild}
          onJoinChild={onJoinChild}
        />
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
          <motion.section variants={listItem} className="panel">
            {composerOpen && !editingId ? (
              form
            ) : (
              <motion.button
                type="button"
                whileTap={tap}
                onClick={() => {
                  resetForm();
                  setComposerOpen(true);
                }}
                className={`w-full min-h-tap flex items-center gap-3 text-left ${THEME.muted}`}
              >
                <PenLine className="w-5 h-5 shrink-0" />
                <span className="text-sm">今天發生了什麼？</span>
              </motion.button>
            )}
          </motion.section>

          {groups.length === 0 && !composerOpen && (
            <motion.div variants={listItem}>
              <EmptyState
                theme={THEME}
                title="還沒有任何紀錄"
                description={
                  '這裡適合記下那些不會出現在數據裡的時刻——\n今天冒出的新詞、第一次自己穿鞋、公園裡不肯回家。\n\n在成長分頁勾選會的項目時，也可以順手記一筆。'
                }
              />
            </motion.div>
          )}

          {groups.map((group) => (
            <section key={group.key}>
              {/* AppBar 固定 h-16，月份分隔線就貼在它下緣。
                  這一層刻意不做入場動畫：sticky 元素若落在有 transform 的
                  祖先裡，動畫期間會連帶被推移。 */}
              <h2
                className={`sticky top-16 z-10 -mx-4 px-4 py-2 bg-explorer-sand/95 backdrop-blur-sm ${THEME.body}`}
              >
                {group.label}
              </h2>
              <motion.ul variants={listItem} className="space-y-3 mt-2">
                {group.entries.map((entry) => {
                  const linkedTitle = entry.linkedCheckItemId
                    ? checkItemTitles[entry.linkedCheckItemId]
                    : undefined;

                  if (editingId === entry.id) {
                    return (
                      <li key={entry.id} className="panel">
                        {form}
                      </li>
                    );
                  }

                  return (
                    <li key={entry.id} className="panel">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-sm ${THEME.muted}`}>{formatDate(entry.date)}</span>
                        <span className="flex-1" />
                        <button
                          type="button"
                          onClick={() => startEdit(entry)}
                          className="btn-icon"
                          aria-label="編輯"
                        >
                          <PenLine className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(entry)}
                          className="btn-icon hover:bg-explorer-clay/10 hover:text-explorer-clay-ink"
                          aria-label="刪除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-explorer-bark leading-relaxed whitespace-pre-line">
                        {entry.content}
                      </p>

                      {linkedTitle && (
                        <p className="tag mt-3 bg-explorer-meadow/15 text-explorer-meadow-ink">
                          <Sprout className="w-3.5 h-3.5" />
                          {linkedTitle}
                        </p>
                      )}
                    </li>
                  );
                })}
              </motion.ul>
            </section>
          ))}
        </motion.div>
      )}
    </ExplorerShell>
  );
}
