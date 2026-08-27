import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Baby, Book, Calendar, Flower2, Sparkles } from 'lucide-react';
import type { ChildProfile, PrenatalCheckupProgress } from '../../types';
import { PREGNANCY_TOTAL_WEEKS, pregnancyGuides, trimesterOf } from '../data/pregnancyGuides';
import { prenatalCheckupSchedule } from '../data/prenatalCheckups';
import { resolvePrenatalItems, weeksPregnant } from '../utils/prenatalSchedule';
import BloomShell from '../components/BloomShell';
import ServiceNotice from '../../common/components/ServiceNotice';
import { isPregnancyProfile } from '../../common/pregnancy';
import { toLocalDateKey } from '../../common/utils/dateHelpers';

interface LittleBloomPageProps {
  currentChild?: ChildProfile | null;
  progress: PrenatalCheckupProgress;
  onRecordBirth: (birthday: string) => Promise<void>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

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
        <ServiceNotice
          service="littlebloom"
          tone="celebrate"
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
        <ServiceNotice
          service="littlebloom"
          icon={Flower2}
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
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-5"
      >
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-3xl shadow-soft p-6 text-center"
        >
          <p className="text-sm text-bloom-stone/60">{TRIMESTER_LABEL[trimesterOf(displayWeek)]}</p>
          <p className="text-4xl font-bold text-bloom-dusty-rose my-2">第 {displayWeek} 週</p>
          <p className="text-sm text-bloom-stone/70">還有 {Math.max(PREGNANCY_TOTAL_WEEKS - displayWeek, 0)} 週見面</p>
        </motion.section>

        {currentGuide ? (
          <motion.section variants={itemVariants} className="bg-white rounded-3xl shadow-soft p-6">
            <h2 className="text-lg font-bold text-bloom-stone mb-2">{currentGuide.title}</h2>
            <p className="text-sm text-bloom-stone/70 leading-relaxed mb-5">{currentGuide.summary}</p>

            <h3 className="font-semibold text-bloom-dusty-rose flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" /> 本週提醒
            </h3>
            <ul className="space-y-2 mb-5">
              {currentGuide.tips.map((tip) => (
                <li key={tip} className="text-sm text-bloom-stone/80 flex gap-2 leading-relaxed">
                  <span className="text-bloom-dusty-rose shrink-0">·</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>

            {currentGuide.warningSignals.length > 0 && (
              <div className="rounded-2xl bg-bloom-terracotta/10 p-4">
                <h3 className="font-semibold text-bloom-terracotta-dark flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4" /> 這些情況請盡快就醫
                </h3>
                <ul className="space-y-1.5">
                  {currentGuide.warningSignals.map((signal) => (
                    <li key={signal} className="text-sm text-bloom-stone/80 flex gap-2 leading-relaxed">
                      <span className="text-bloom-terracotta-dark shrink-0">·</span>
                      <span>{signal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.section>
        ) : (
          <motion.section variants={itemVariants} className="bg-white rounded-3xl shadow-soft p-6">
            <p className="text-sm text-bloom-stone/70 leading-relaxed">
              已經超過第 {PREGNANCY_TOTAL_WEEKS} 週。37 至 42 週都屬正常生產期，請依產檢醫師的安排追蹤。
            </p>
          </motion.section>
        )}

        <motion.section variants={itemVariants} className="bg-white rounded-3xl shadow-soft p-6">
          <h3 className="font-bold text-bloom-stone flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-bloom-sage-dark" /> 下一項產檢
          </h3>
          {nextItem ? (
            <button
              type="button"
              onClick={() => {
                window.location.hash = '#/littlebloom/prenatal';
              }}
              className="w-full text-left rounded-2xl bg-bloom-cream p-4 hover:bg-bloom-sand transition-colors"
            >
              <p className="font-semibold text-bloom-stone">
                {nextItem.template.visitNumber ? `第 ${nextItem.template.visitNumber} 次 · ` : ''}
                {nextItem.template.title}
              </p>
              <p className="text-sm text-bloom-stone/60 mt-1">
                建議第 {nextItem.template.dueWeek} 週 · {nextItem.dueDate}
                {nextItem.status === 'overdue' && ' · 已過建議週數'}
              </p>
            </button>
          ) : (
            <p className="text-sm text-bloom-stone/60">所有產檢項目都完成了。</p>
          )}
        </motion.section>

        <motion.section variants={itemVariants} className="grid grid-cols-2 gap-4">
          <NavCard
            label="產檢時程"
            icon={<Calendar className="w-6 h-6" />}
            hash="#/littlebloom/prenatal"
            className="bg-bloom-sage/20 text-bloom-sage-dark"
          />
          <NavCard
            label="孕期知識庫"
            icon={<Book className="w-6 h-6" />}
            hash="#/littlebloom/wiki"
            className="bg-bloom-dusty-blue/20 text-bloom-dusty-blue-dark"
          />
        </motion.section>

        {/* 出生登記：孕期檔案轉為寶寶檔案。PregnancyData.status 這個欄位
            從設計出來就存在，卻一直沒有任何流程會把它改成 archived。 */}
        <motion.section variants={itemVariants} className="bg-white rounded-3xl shadow-soft p-6">
          <h3 className="font-bold text-bloom-stone flex items-center gap-2 mb-2">
            <Baby className="w-5 h-5 text-bloom-dusty-rose" /> 寶寶出生了
          </h3>
          <p className="text-sm text-bloom-stone/70 leading-relaxed mb-4">
            填入實際出生日期後，這份檔案會變成寶寶檔案，
            LittleSteps 與 LittleExplorer 就會依實際月齡接手。孕期與產檢紀錄都會保留。
          </p>

          {birthOpen ? (
            <div className="space-y-2">
              <label className="block text-xs text-bloom-stone/60">
                出生日期
                <input
                  type="date"
                  value={birthDate}
                  max={toLocalDateKey()}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-xl border border-bloom-sand text-sm text-bloom-stone focus:outline-none focus:ring-2 focus:ring-bloom-dusty-rose"
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
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-bloom-dusty-rose to-bloom-mauve text-white font-semibold disabled:opacity-60"
                >
                  {birthSaving ? '儲存中…' : '確認出生'}
                </button>
                <button
                  type="button"
                  onClick={() => setBirthOpen(false)}
                  disabled={birthSaving}
                  className="px-4 rounded-xl text-bloom-stone/50 hover:bg-bloom-sand disabled:opacity-60"
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setBirthOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-bloom-dusty-rose/15 text-bloom-dusty-rose-dark font-medium"
            >
              <Baby className="w-4 h-4" />
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
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        window.location.hash = hash;
      }}
      className={`${className} rounded-3xl p-6 shadow-soft hover:shadow-soft-lg transition-all flex flex-col items-center gap-3`}
    >
      {icon}
      <span className="font-semibold">{label}</span>
    </motion.button>
  );
}
