import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronDown, PartyPopper, X } from 'lucide-react';
import type {
  ChildProfile,
  DevelopmentCheckItem,
  DevelopmentCheckProgress,
  DevelopmentDomain,
  ToddlerAgeBand,
  ToothProgress,
  Gender,
} from '../../types';
import { isPregnancyProfile } from '../../common/pregnancy';
import { calculateAge } from '../../common/utils/dateHelpers';
import { calculateAgeDisplay } from '../../common/utils/summaryCalculator';
import EmptyState from '../../common/ui/EmptyState';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { listItem, stagger, tap } from '../../common/ui/motion';
import {
  developmentCheckItems,
  developmentWarnings,
  domainLabels,
} from '../data/developmentChecks';
import { TODDLER_MAX_MONTHS, TODDLER_MIN_MONTHS, bandForMonths } from '../utils/ageBands';
import ExplorerShell from '../components/ExplorerShell';
import NoChildNotice from '../components/NoChildNotice';
import AgeBandPicker from '../components/AgeBandPicker';
import GrowthCurveLink from '../components/GrowthCurveLink';
import ToothChart from '../components/ToothChart';
import { goTo } from '../../common/navigate';

const THEME = SERVICE_THEME.littleexplorer;

const DOMAIN_ORDER: DevelopmentDomain[] = [
  'gross-motor',
  'fine-motor',
  'language',
  'cognitive',
  'social',
];

interface DevelopmentPageProps {
  currentChild?: ChildProfile | null;
  progress: DevelopmentCheckProgress;
  toothProgress: ToothProgress;
  reminderBadge?: number;
  onToggleCheck: (checkItemId: string) => Promise<void>;
  onQuickDiary: (content: string, linkedCheckItemId: string) => Promise<void>;
  onToggleTooth: (toothId: string) => Promise<void>;
  /**
   * 新增／加入寶寶。LittleExplorer 自己開新增視窗，不把家長送去 LittleSteps
   * ——共用的是帳號與孩子資料，不是彼此的畫面。
   */
  onAddChild: (name: string, birthday: string, gender?: Gender) => Promise<void>;
  onJoinChild?: (uuid: string) => Promise<void>;
}

/**
 * 成長分頁：這個年紀會什麼、該學什麼。
 *
 * 語氣是這一頁的設計核心。進度與鼓勵在前，紅旗警訊收在底部的可展開區塊——
 * 篩檢優先的版面會讓家長每次打開都在找孩子哪裡不對勁。
 */
export default function DevelopmentPage({
  currentChild,
  progress,
  toothProgress,
  reminderBadge,
  onToggleTooth,
  onToggleCheck,
  onQuickDiary,
  onAddChild,
  onJoinChild,
}: DevelopmentPageProps) {
  const ageMonths = currentChild ? calculateAge(currentChild.birthday) : 0;
  const [band, setBand] = useState<ToddlerAgeBand>(() => bandForMonths(ageMonths));
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [warningsOpen, setWarningsOpen] = useState(false);
  const [diaryFor, setDiaryFor] = useState<string | null>(null);
  const [diaryText, setDiaryText] = useState('');
  const [savedFor, setSavedFor] = useState<string | null>(null);

  const bandItems = useMemo(
    () => developmentCheckItems.filter((item) => item.ageBand === band),
    [band],
  );
  const achievedCount = bandItems.filter((item) => progress[item.id]?.achieved).length;
  const warning = developmentWarnings.find((w) => w.ageBand === band);

  const outOfRange = !currentChild ? (
    <NoChildNotice
      description={'新增寶寶後，這裡就會依月齡顯示該階段的成長重點。'}
      onAddChild={onAddChild}
      onJoinChild={onJoinChild}
    />
  ) : isPregnancyProfile(currentChild) ? (
    // 孕期檔案的 birthday 是預產期，月齡會算成 0，若不先攔下來就會被
    // 誤導去 LittleSteps 追蹤一個還沒出生的孩子的里程碑。
    <EmptyState
      theme={THEME}
      title="這是孕期檔案"
      description={'目前選擇的是還沒出生的寶寶。\n孕期的產檢與每週指南在 LittleBloom；出生後在那裡登記出生日期，這裡就會接手。'}
      action={{ label: '前往 LittleBloom', onClick: () => { goTo('littlebloom'); } }}
    />
  ) : ageMonths < TODDLER_MIN_MONTHS ? (
    <EmptyState
      theme={THEME}
      title="寶寶還不到 1 歲"
      description={'幼兒期的成長追蹤從滿 1 歲開始。\n在那之前，LittleSteps 的里程碑與副食品指南更適合現在的階段。'}
      action={{ label: '回 LittleSteps 追蹤里程碑', onClick: () => { goTo('littlesteps/milestones'); } }}
    />
  ) : null;

  const handleToggle = async (item: DevelopmentCheckItem) => {
    const wasAchieved = progress[item.id]?.achieved === true;
    await onToggleCheck(item.id);
    if (!wasAchieved) {
      setDiaryFor(item.id);
      setDiaryText('');
    } else if (diaryFor === item.id) {
      setDiaryFor(null);
    }
  };

  const handleQuickDiary = async (item: DevelopmentCheckItem) => {
    const content = diaryText.trim();
    if (!content) return;
    await onQuickDiary(content, item.id);
    setDiaryFor(null);
    setDiaryText('');
    setSavedFor(item.id);
    window.setTimeout(() => setSavedFor((id) => (id === item.id ? null : id)), 2500);
  };

  return (
    <ExplorerShell
      active="development"
      childName={currentChild?.name}
      ageLabel={currentChild ? calculateAgeDisplay(currentChild.birthday) : undefined}
      reminderBadge={reminderBadge}
    >
      {outOfRange ?? (
        <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
          {ageMonths >= TODDLER_MAX_MONTHS && (
            <motion.div variants={listItem}>
              <EmptyState
                theme={THEME}
                icon={PartyPopper}
                title="已經滿 3 歲了"
                description={
                  // 原本只說「告一段落」就結束了，等於把家長送進一條死路。
                  // 實際上還有事要做：疫苗時程在 48 與 60 個月還有 3 劑，
                  // 而幼兒百科的文章沒有年齡限制，隨時查得到。
                  '幼兒期的成長追蹤告一段落，紀錄都留著。\n滿 5 歲前還有幾劑疫苗要打，時程在 LittleSteps 的疫苗追蹤；百科文章隨時都能回來看。'
                }
                action={{
                  label: '看疫苗時程',
                  onClick: () => {
                    goTo('littlesteps/vaccine-tracking');
                  },
                }}
              />
            </motion.div>
          )}

          <motion.div variants={listItem}>
            <AgeBandPicker selected={band} onSelect={setBand} />
          </motion.div>

          {/* 這個分頁叫「成長」卻沒有身高體重。WHO 標準到 36 個月都適用，
              但那張圖住在 LittleSteps，而這裡從來沒提過。
              滿 3 歲之後就不顯示：WHO 這份資料只到 36 個月，再往後那張圖
              算不出百分位，而這張卡片正是拿百分位當賣點。 */}
          {ageMonths < TODDLER_MAX_MONTHS && <GrowthCurveLink />}

          <motion.section variants={listItem} className="panel">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className={THEME.body}>這個階段的 {bandItems.length} 件事</h2>
              <p className={`text-sm ${THEME.muted}`}>
                已經會了 <span className="text-xl font-bold text-explorer-meadow-ink">{achievedCount}</span> 件
              </p>
            </div>
            <div className="h-2.5 rounded-full bg-explorer-sand overflow-hidden">
              <div
                className="h-full rounded-full bg-explorer-meadow transition-all duration-500"
                style={{ width: `${bandItems.length ? (achievedCount / bandItems.length) * 100 : 0}%` }}
              />
            </div>
          </motion.section>

          {DOMAIN_ORDER.map((domain) => {
            const items = bandItems.filter((item) => item.domain === domain);
            if (items.length === 0) return null;

            return (
              <motion.section key={domain} variants={listItem} className="panel">
                <h3 className={`mb-3 ${THEME.body}`}>{domainLabels[domain]}</h3>

                <ul className="space-y-2">
                  {items.map((item) => {
                    const achieved = progress[item.id]?.achieved === true;
                    const isExpanded = expandedId === item.id;

                    return (
                      <li key={item.id} className="rounded-2xl bg-explorer-sand/60 py-1 pr-3">
                        {/* 勾選鍵佔滿左側 44px，之後每一層都用 pl-tap 對齊題目 */}
                        <div className="flex items-start">
                          <motion.button
                            type="button"
                            whileTap={tap}
                            onClick={() => handleToggle(item)}
                            aria-pressed={achieved}
                            aria-label={`${achieved ? '取消' : '標記'}：${item.title}`}
                            className="w-tap h-tap shrink-0 flex items-center justify-center"
                          >
                            <span
                              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                                achieved
                                  ? 'bg-explorer-meadow-ink border-explorer-meadow-ink text-white'
                                  : 'bg-white border-explorer-bark/25'
                              }`}
                            >
                              {achieved && <Check className="w-4 h-4" strokeWidth={3} />}
                            </span>
                          </motion.button>

                          <button
                            type="button"
                            onClick={() => setExpandedId(isExpanded ? null : item.id)}
                            aria-expanded={isExpanded}
                            className="flex-1 min-h-tap flex items-center text-left py-1"
                          >
                            <span className={`text-sm ${achieved ? THEME.body : THEME.muted}`}>
                              {item.title}
                              <ChevronDown
                                className={`inline-block w-4 h-4 ml-1 align-middle text-explorer-bark/40 transition-transform ${
                                  isExpanded ? 'rotate-180' : ''
                                }`}
                              />
                            </span>
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="pl-tap pr-1 pb-2 space-y-2">
                            <p className={`text-sm leading-relaxed ${THEME.muted}`}>{item.detail}</p>
                            <ul className="space-y-1">
                              {item.tips.map((tip) => (
                                <li key={tip} className={`text-sm flex gap-2 ${THEME.muted}`}>
                                  <span className="text-explorer-meadow-ink shrink-0">·</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {diaryFor === item.id && (
                          <div className="pl-tap pr-1 pb-2 flex items-center gap-2">
                            <input
                              type="text"
                              value={diaryText}
                              onChange={(e) => setDiaryText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleQuickDiary(item);
                                if (e.key === 'Escape') setDiaryFor(null);
                              }}
                              placeholder="要記一筆嗎？（選填）"
                              autoFocus
                              className="flex-1 min-w-0 px-3 min-h-tap rounded-xl border border-explorer-sand bg-white text-sm text-explorer-bark"
                            />
                            <button
                              type="button"
                              onClick={() => handleQuickDiary(item)}
                              disabled={!diaryText.trim()}
                              className={`btn-primary px-4 text-sm ${THEME.fill} ${THEME.fillText}`}
                            >
                              記下來
                            </button>
                            <button
                              type="button"
                              onClick={() => setDiaryFor(null)}
                              aria-label="關閉"
                              className="btn-icon"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        )}

                        {savedFor === item.id && (
                          <p className="pl-tap pb-2 text-xs text-explorer-meadow-ink">已寫進日記</p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </motion.section>
            );
          })}

          <motion.div variants={listItem}>
            <ToothChart
              progress={toothProgress}
              ageMonths={ageMonths}
              onToggleTooth={onToggleTooth}
            />
          </motion.div>

          {warning && (
            <motion.section variants={listItem} className="bg-explorer-clay/10 rounded-3xl p-5">
              <motion.button
                type="button"
                whileTap={tap}
                onClick={() => setWarningsOpen(!warningsOpen)}
                aria-expanded={warningsOpen}
                className="w-full min-h-tap flex items-center gap-2 text-left"
              >
                <h3 className={`flex-1 ${THEME.body}`}>什麼時候該諮詢醫師</h3>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 text-explorer-bark/40 transition-transform ${warningsOpen ? 'rotate-180' : ''}`}
                />
              </motion.button>

              {warningsOpen && (
                <div className="mt-4 space-y-3">
                  <ul className="space-y-2">
                    {warning.signals.map((signal) => (
                      <li key={signal} className={`text-sm flex gap-2 ${THEME.body}`}>
                        <span className="text-explorer-clay-ink shrink-0">·</span>
                        <span>{signal}</span>
                      </li>
                    ))}
                  </ul>
                  <p className={`text-sm leading-relaxed border-t border-explorer-clay/20 pt-3 ${THEME.muted}`}>
                    {warning.action}
                  </p>
                </div>
              )}
            </motion.section>
          )}

          <p className={`text-xs leading-relaxed px-1 ${THEME.muted}`}>
            每個孩子的發展速度不同，本表僅供家長觀察參考，不是診斷工具。若有疑慮，正式評估請至兒童發展聯合評估中心。
          </p>
        </motion.div>
      )}
    </ExplorerShell>
  );
}
