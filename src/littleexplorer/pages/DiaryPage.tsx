import { useMemo, useState } from 'react';
import { PenLine, Sprout, Trash2, X } from 'lucide-react';
import type { ChildProfile, DiaryEntry, DiaryMood } from '../../types';
import { calculateAgeDisplay } from '../../utils/summaryCalculator';
import { developmentCheckItems } from '../data/developmentChecks';
import { groupEntriesByMonth } from '../utils/diaryHelpers';
import ExplorerShell from '../components/ExplorerShell';
import ExplorerNotice from '../components/ExplorerNotice';

const MOODS: { value: DiaryMood; emoji: string; label: string }[] = [
  { value: 'happy', emoji: '😊', label: '開心' },
  { value: 'proud', emoji: '🥹', label: '感動' },
  { value: 'tired', emoji: '😮‍💨', label: '累' },
  { value: 'worried', emoji: '😟', label: '擔心' },
  { value: 'funny', emoji: '😂', label: '好笑' },
];

const today = () => new Date().toISOString().split('T')[0];

interface DiaryPageProps {
  currentChild?: ChildProfile | null;
  entries: DiaryEntry[];
  reminderBadge?: number;
  onAdd: (entry: Omit<DiaryEntry, 'id' | 'childId' | 'createdAt'>) => Promise<string | undefined>;
  onUpdate: (entryId: string, updates: Partial<DiaryEntry>) => Promise<void>;
  onDelete: (entryId: string) => Promise<void>;
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
    if (!window.confirm('刪除這則紀錄？刪除後無法復原。')) return;
    await onDelete(entry.id);
    if (editingId === entry.id) resetForm();
  };

  const form = (
    <div className="space-y-3">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full px-3 py-2 rounded-xl border border-explorer-sand text-sm text-explorer-bark focus:outline-none focus:ring-2 focus:ring-explorer-sunbeam"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        autoFocus
        placeholder="今天發生了什麼？"
        className="w-full px-3 py-2 rounded-xl border border-explorer-sand text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-explorer-sunbeam"
      />
      <div className="flex flex-wrap gap-2">
        {MOODS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setMood(mood === option.value ? undefined : option.value)}
            aria-pressed={mood === option.value}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              mood === option.value
                ? 'bg-explorer-sunbeam text-white'
                : 'bg-explorer-sand text-explorer-bark/70'
            }`}
          >
            {option.emoji} {option.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={!content.trim()}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-explorer-sunbeam to-explorer-meadow text-white font-semibold disabled:opacity-40"
        >
          {editingId ? '儲存修改' : '記下來'}
        </button>
        <button
          type="button"
          onClick={resetForm}
          aria-label="取消"
          className="px-4 rounded-xl text-explorer-bark/50 hover:bg-explorer-sand"
        >
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
        <ExplorerNotice
          icon={Sprout}
          title="還沒有寶寶資料"
          description={'請先到 LittleSteps 新增寶寶，\n之後就能在這裡留下成長的點滴。'}
          action={{ label: '前往 LittleSteps', onClick: () => { window.location.hash = '#/littlesteps'; } }}
        />
      ) : (
        <div className="space-y-4">
          <section className="bg-white rounded-3xl shadow-soft p-5">
            {composerOpen && !editingId ? (
              form
            ) : (
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setComposerOpen(true);
                }}
                className="w-full flex items-center gap-3 text-left text-explorer-bark/50"
              >
                <PenLine className="w-5 h-5 shrink-0" />
                <span className="text-sm">今天發生了什麼？</span>
              </button>
            )}
          </section>

          {groups.length === 0 && !composerOpen && (
            <ExplorerNotice
              icon={Sprout}
              title="還沒有任何紀錄"
              description={
                '這裡適合記下那些不會出現在數據裡的時刻——\n今天冒出的新詞、第一次自己穿鞋、公園裡不肯回家。\n\n在成長分頁勾選會的項目時，也可以順手記一筆。'
              }
            />
          )}

          {groups.map((group) => (
            <section key={group.key}>
              <h2 className="sticky top-[72px] z-10 -mx-4 px-4 py-2 bg-explorer-sand/95 backdrop-blur-sm text-sm font-semibold text-explorer-bark/70">
                {group.label}
              </h2>
              <ul className="space-y-3 mt-2">
                {group.entries.map((entry) => {
                  const moodOption = MOODS.find((m) => m.value === entry.mood);
                  const linkedTitle = entry.linkedCheckItemId
                    ? checkItemTitles[entry.linkedCheckItemId]
                    : undefined;

                  if (editingId === entry.id) {
                    return (
                      <li key={entry.id} className="bg-white rounded-3xl shadow-soft p-5">
                        {form}
                      </li>
                    );
                  }

                  return (
                    <li key={entry.id} className="bg-white rounded-3xl shadow-soft p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-explorer-bark/50">{entry.date}</span>
                        {moodOption && (
                          <span title={moodOption.label} className="text-base leading-none">
                            {moodOption.emoji}
                          </span>
                        )}
                        <span className="flex-1" />
                        <button
                          type="button"
                          onClick={() => startEdit(entry)}
                          className="p-1.5 rounded-lg text-explorer-bark/40 hover:bg-explorer-sand hover:text-explorer-bark"
                          aria-label="編輯"
                        >
                          <PenLine className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(entry)}
                          className="p-1.5 rounded-lg text-explorer-bark/40 hover:bg-explorer-clay/10 hover:text-explorer-clay"
                          aria-label="刪除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-explorer-bark leading-relaxed whitespace-pre-line">
                        {entry.content}
                      </p>

                      {linkedTitle && (
                        <p className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-explorer-meadow/15 text-explorer-meadow-dark text-xs">
                          <Sprout className="w-3.5 h-3.5" />
                          {linkedTitle}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </ExplorerShell>
  );
}
