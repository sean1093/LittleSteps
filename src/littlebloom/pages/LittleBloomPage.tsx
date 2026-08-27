import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Baby, Book, Calendar } from 'lucide-react';
import type { ChildProfile, PrenatalCheckupProgress } from '../../types';
import { PREGNANCY_TOTAL_WEEKS, pregnancyGuides, trimesterOf } from '../data/pregnancyGuides';
import { prenatalCheckupSchedule } from '../data/prenatalCheckups';
import { resolvePrenatalItems, weeksPregnant } from '../utils/prenatalSchedule';
import BloomShell from '../components/BloomShell';
import EmptyState from '../../common/ui/EmptyState';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { hoverLift, listItem, stagger, tap } from '../../common/ui/motion';
import { isPregnancyProfile } from '../../common/pregnancy';
import { toLocalDateKey } from '../../common/utils/dateHelpers';

interface LittleBloomPageProps {
  currentChild?: ChildProfile | null;
  progress: PrenatalCheckupProgress;
  onRecordBirth: (birthday: string) => Promise<void>;
}

const THEME = SERVICE_THEME.littlebloom;

const TRIMESTER_LABEL: Record<1 | 2 | 3, string> = {
  1: '第一孕期',
  2: '第二孕期',
  3: '第三孕期',
};

export default function LittleBloomPage({
  currentChild,
  progress,
  onRecordBirth,
}: LittleBloomPageProps) {
  const lmp = currentChild?.pregnancyData?.lastPeriodDate ?? '';
  const dueDate = currentChild?.pregnancyData?.dueDate ?? '';
  const [birthOpen, setBirthOpen] = useState(false);
  const [birthDate, setBirthDate] = useState(() => toLocalDateKey());
  const [birthSaving, setBirthSaving] = useState(false);
  const [birthError, setBirthError] = useState('');

  // 登記出生會改寫檔案並封存孕期資料，失敗卻靜靜關閉表單，家長會以為存好了。
  // 同時擋住重複點擊：這個動作不該被送出兩次。
  const submitBirth = async () => {
    setBirthSaving(true);
    setBirthError('');
    try {
      await onRecordBirth(birthDate);
      setBirthOpen(false);
    } catch (error) {
      console.error('登記出生失敗:', error);
      setBirthError('儲存失敗，請確認網路後再試一次。');
    } finally {
      setBirthSaving(false);
    }
  };

  // weeksPregnant 回傳已完成整週；顯示上習慣說「第 N 週」，故 +1。
  // 舊版用 Math.abs 算天數差，未來的末次月經日會被算成正的週數。
  const displayWeek = useMemo(() => {
    if (!lmp) return 0;
    return Math.min(weeksPregnant(lmp) + 1, PREGNANCY_TOTAL_WEEKS);
  }, [lmp]);

  // 舊版是 `find(...) || pregnancyGuides[0]`，而資料只有 1-4 週，
  // 於是第 5 週以後的人全部被自信地告知「懷孕第 1 週：準備懷孕」。
  const currentGuide = useMemo(() => {
    if (displayWeek === 0) return null;
    return pregnancyGuides.find((guide) => guide.week === displayWeek) ?? null;
  }, [displayWeek]);

  const nextItem = useMemo(() => {
    if (!lmp) return null;
    const items = resolvePrenatalItems(lmp, prenatalCheckupSchedule, progress);
    return (
      items.find((item) => item.status === 'overdue') ??
      items.find((item) => item.status === 'due') ??
      items.find((item) => item.status === 'upcoming') ??
      null
    );
  }, [lmp, progress]);

  // 出生後 recordBirth 會保留 lastPeriodDate 與 dueDate 當孕期紀錄，只把 status
  // 改成 archived，所以 `!lmp` 這個條件永遠不會成立。少了下面這個分支，生完的
  // 媽媽會一直看到「第 40 週」與還能按的「登記出生」。判斷條件與側邊欄、
  // LittleSteps 儀表板、LittleExplorer 兩個守門一致。
  if (currentChild && lmp && !isPregnancyProfile(currentChild)) {
    return (
      <BloomShell title="LittleBloom" subtitle="孕期已完成">
        <EmptyState
          theme={THEME}
          icon={Baby}
          title="寶寶已經出生了"
          description={`${currentChild.name} 的孕期紀錄已經封存保留。\n接下來的成長里程碑與疫苗，請到 LittleSteps 繼續。`}
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
      <BloomShell title="LittleBloom" subtitle="孕期陪伴">
        <EmptyState
          theme={THEME}
          title="還沒有孕期檔案"
          description={'到 LittleSteps 的側邊選單新增一個「孕期檔案」並填入預產期，\n這裡就會依週數顯示身體變化、本週提醒與產檢時程。'}
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

  return (
    <BloomShell title="LittleBloom" subtitle={`第 ${displayWeek} 週 · 預產期 ${dueDate}`}>
      <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
        <motion.section variants={listItem} className="panel text-center">
          <p className={`text-sm ${THEME.muted}`}>{TRIMESTER_LABEL[trimesterOf(displayWeek)]}</p>
          <p className={`text-4xl font-bold my-2 ${THEME.ink}`}>第 {displayWeek} 週</p>
          <p className={`text-sm ${THEME.muted}`}>
            還有 {Math.max(PREGNANCY_TOTAL_WEEKS - displayWeek, 0)} 週見面
          </p>
        </motion.section>

        {currentGuide ? (
          <motion.section variants={listItem} className="panel">
            <h2 className={`mb-2 ${THEME.body}`}>{currentGuide.title}</h2>
            <p className={`text-sm leading-relaxed mb-5 ${THEME.muted}`}>{currentGuide.summary}</p>

            <h3 className={`mb-2 ${THEME.ink}`}>本週提醒</h3>
            <ul className="space-y-2 mb-5">
              {currentGuide.tips.map((tip) => (
                <li key={tip} className={`text-sm flex gap-2 leading-relaxed ${THEME.body}`}>
                  <span className="text-bloom-dusty-rose-ink shrink-0">·</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>

            {currentGuide.warningSignals.length > 0 && (
              <div className="rounded-2xl bg-bloom-terracotta/10 p-4">
                <h3 className="mb-2 text-bloom-terracotta-ink">這些情況請盡快就醫</h3>
                <ul className="space-y-1.5">
                  {currentGuide.warningSignals.map((signal) => (
                    <li key={signal} className={`text-sm flex gap-2 leading-relaxed ${THEME.body}`}>
                      <span className="text-bloom-terracotta-ink shrink-0">·</span>
                      <span>{signal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.section>
        ) : (
          <motion.section variants={listItem} className="panel">
            <p className={`text-sm leading-relaxed ${THEME.body}`}>
              已經超過第 {PREGNANCY_TOTAL_WEEKS} 週。37 至 42 週都屬正常生產期，請依產檢醫師的安排追蹤。
            </p>
          </motion.section>
        )}

        <motion.section variants={listItem} className="panel">
          <h3 className={`mb-4 ${THEME.body}`}>下一項產檢</h3>
          {nextItem ? (
            <motion.button
              type="button"
              whileTap={tap}
              onClick={() => {
                window.location.hash = '#/littlebloom/prenatal';
              }}
              className="w-full text-left rounded-2xl bg-bloom-cream p-4 hover:bg-bloom-sand transition-colors"
            >
              <p className={`font-semibold ${THEME.body}`}>
                {nextItem.template.visitNumber ? `第 ${nextItem.template.visitNumber} 次 · ` : ''}
                {nextItem.template.title}
              </p>
              <p className={`text-sm mt-1 ${THEME.muted}`}>
                建議第 {nextItem.template.dueWeek} 週 · {nextItem.dueDate}
                {nextItem.status === 'overdue' && ' · 已過建議週數'}
              </p>
            </motion.button>
          ) : (
            <p className={`text-sm ${THEME.muted}`}>所有產檢項目都完成了。</p>
          )}
        </motion.section>

        <motion.section variants={listItem} className="grid grid-cols-2 gap-3 sm:gap-4">
          <NavCard
            label="產檢時程"
            icon={<Calendar className="w-6 h-6" />}
            hash="#/littlebloom/prenatal"
            className="bg-bloom-sage/20 text-bloom-sage-ink"
          />
          <NavCard
            label="孕期知識庫"
            icon={<Book className="w-6 h-6" />}
            hash="#/littlebloom/wiki"
            className="bg-bloom-dusty-blue/20 text-bloom-dusty-blue-ink"
          />
        </motion.section>

        {/* 出生登記：孕期檔案轉為寶寶檔案。PregnancyData.status 這個欄位
            從設計出來就存在，卻一直沒有任何流程會把它改成 archived。 */}
        <motion.section variants={listItem} className="panel">
          <h3 className={`mb-2 ${THEME.body}`}>寶寶出生了</h3>
          <p className={`text-sm leading-relaxed mb-4 ${THEME.muted}`}>
            填入實際出生日期後，這份檔案會變成寶寶檔案，
            LittleSteps 與 LittleExplorer 就會依實際月齡接手。孕期與產檢紀錄都會保留。
          </p>

          {birthOpen ? (
            <div className="space-y-2">
              <label className={`block text-xs ${THEME.muted}`}>
                出生日期
                <input
                  type="date"
                  value={birthDate}
                  max={toLocalDateKey()}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="mt-1 w-full px-3 min-h-tap rounded-xl border border-bloom-sand text-sm text-bloom-stone-ink"
                />
              </label>
              {birthError && (
                <p role="alert" className="text-sm text-red-600">
                  {birthError}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={submitBirth}
                  disabled={birthSaving}
                  className={`btn-primary flex-1 ${THEME.fill}`}
                >
                  {birthSaving ? '儲存中…' : '確認出生'}
                </button>
                <button
                  type="button"
                  onClick={() => setBirthOpen(false)}
                  disabled={birthSaving}
                  className="btn-ghost disabled:opacity-60"
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setBirthOpen(true)}
              className={`btn-primary ${THEME.fill}`}
            >
              登記出生
            </button>
          )}
        </motion.section>
      </motion.div>
    </BloomShell>
  );
}

interface NavCardProps {
  label: string;
  icon: React.ReactNode;
  hash: string;
  className: string;
}

function NavCard({ label, icon, hash, className }: NavCardProps) {
  return (
    <motion.button
      type="button"
      whileHover={hoverLift}
      whileTap={tap}
      onClick={() => {
        window.location.hash = hash;
      }}
      className={`${className} rounded-3xl p-5 shadow-soft hover:shadow-soft-lg transition-shadow flex flex-col items-center gap-2`}
    >
      {icon}
      <span className="font-semibold">{label}</span>
    </motion.button>
  );
}
