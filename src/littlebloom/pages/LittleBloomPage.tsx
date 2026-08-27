import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Book, Calendar, Flower2, Sparkles } from 'lucide-react';
import type { ChildProfile, PrenatalCheckupProgress } from '../../types';
import { PREGNANCY_TOTAL_WEEKS, pregnancyGuides, trimesterOf } from '../data/pregnancyGuides';
import { prenatalCheckupSchedule } from '../data/prenatalCheckups';
import { resolvePrenatalItems, weeksPregnant } from '../utils/prenatalSchedule';
import BloomShell from '../components/BloomShell';

interface LittleBloomPageProps {
  currentChild?: ChildProfile | null;
  progress: PrenatalCheckupProgress;
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

export default function LittleBloomPage({ currentChild, progress }: LittleBloomPageProps) {
  const lmp = currentChild?.pregnancyData?.lastPeriodDate ?? '';
  const dueDate = currentChild?.pregnancyData?.dueDate ?? '';

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

  if (!lmp) {
    return (
      <BloomShell title="LittleBloom" subtitle="孕期陪伴">
        <div className="bg-white rounded-3xl shadow-soft p-8 text-center">
          <Flower2 className="w-14 h-14 text-bloom-dusty-rose mx-auto mb-4" />
          <h2 className="text-xl font-bold text-bloom-stone mb-3">還沒有孕期檔案</h2>
          <p className="text-sm text-bloom-stone/70 leading-relaxed mb-6">
            到 LittleSteps 的側邊選單新增一個「孕期檔案」並填入預產期，
            <br />
            這裡就會依週數顯示身體變化、本週提醒與產檢時程。
          </p>
          <button
            type="button"
            onClick={() => {
              window.location.hash = '#/littlesteps';
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-bloom-dusty-rose to-bloom-mauve text-white font-semibold shadow-soft"
          >
            前往新增孕期檔案
          </button>
        </div>
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
