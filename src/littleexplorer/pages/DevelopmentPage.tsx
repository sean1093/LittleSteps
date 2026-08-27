import { useMemo, useState } from 'react';
import { AlertTriangle, Baby, Check, ChevronDown, Flower2, PartyPopper, Sprout } from 'lucide-react';
import type {
  ChildProfile,
  DevelopmentCheckItem,
  DevelopmentCheckProgress,
  DevelopmentDomain,
  ToddlerAgeBand,
  ToothProgress,
} from '../../types';
import { getLucideIcon } from '../../common/lucideIcons';
import { isPregnancyProfile } from '../../common/pregnancy';
import { calculateAge } from '../../utils/dateHelpers';
import { calculateAgeDisplay } from '../../utils/summaryCalculator';
import {
  developmentCheckItems,
  developmentWarnings,
  domainIcons,
  domainLabels,
} from '../data/developmentChecks';
import { TODDLER_MAX_MONTHS, TODDLER_MIN_MONTHS, bandForMonths } from '../utils/ageBands';
import ExplorerShell from '../components/ExplorerShell';
import ServiceNotice from '../../common/components/ServiceNotice';
import AgeBandPicker from '../components/AgeBandPicker';
import ToothChart from '../components/ToothChart';

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
    <ServiceNotice service="littleexplorer"
      icon={Baby}
      title="還沒有寶寶資料"
      description={'請先到 LittleSteps 新增寶寶，\n之後這裡就會依月齡顯示該階段的成長重點。'}
      action={{ label: '前往 LittleSteps', onClick: () => { window.location.hash = '#/littlesteps'; } }}
    />
  ) : isPregnancyProfile(currentChild) ? (
    // 孕期檔案的 birthday 是預產期，月齡會算成 0，若不先攔下來就會被
    // 誤導去 LittleSteps 追蹤一個還沒出生的孩子的里程碑。
    <ServiceNotice service="littleexplorer"
      icon={Flower2}
      title="這是孕期檔案"
      description={'目前選擇的是還沒出生的寶寶。\n孕期的產檢與每週指南在 LittleBloom；出生後在那裡登記出生日期，這裡就會接手。'}
      action={{ label: '前往 LittleBloom', onClick: () => { window.location.hash = '#/littlebloom'; } }}
    />
  ) : ageMonths < TODDLER_MIN_MONTHS ? (
    <ServiceNotice service="littleexplorer"
      icon={Baby}
      title="寶寶還不到 1 歲"
      description={'幼兒期的成長追蹤從滿 1 歲開始。\n在那之前，LittleSteps 的里程碑與副食品指南更適合現在的階段。'}
      action={{ label: '回 LittleSteps 追蹤里程碑', onClick: () => { window.location.hash = '#/littlesteps/milestones'; } }}
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
    <div className="space-y-4">
      {ageMonths >= TODDLER_MAX_MONTHS && (
        <ServiceNotice service="littleexplorer"
          icon={PartyPopper}
          tone="celebrate"
          title="已經滿 3 歲了"
          description="幼兒期的成長追蹤告一段落。下面留著最後一個階段的紀錄，隨時都能回來看。"
        />
      )}

      <AgeBandPicker selected={band} onSelect={setBand} />

      <section className="bg-white rounded-3xl shadow-soft p-5">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-bold text-explorer-bark">這個階段的 {bandItems.length} 件事</h2>
          <p className="text-sm text-explorer-bark/70">
            已經會了 <span className="text-xl font-bold text-explorer-meadow-dark">{achievedCount}</span> 件
          </p>
        </div>
        <div className="h-2.5 rounded-full bg-explorer-sand overflow-hidden">
          <div
            className="h-full rounded-full bg-explorer-meadow transition-all duration-500"
            style={{ width: `${bandItems.length ? (achievedCount / bandItems.length) * 100 : 0}%` }}
          />
        </div>
      </section>

      {DOMAIN_ORDER.map((domain) => {
        const items = bandItems.filter((item) => item.domain === domain);
        if (items.length === 0) return null;
        const DomainIcon = getLucideIcon(domainIcons[domain]);

        return (
          <section key={domain} className="bg-white rounded-3xl shadow-soft p-5">
            <div className="flex items-center gap-2 mb-3">
              <DomainIcon className="w-5 h-5 text-explorer-sunbeam-dark" />
              <h3 className="font-semibold text-explorer-bark">{domainLabels[domain]}</h3>
            </div>

            <ul className="space-y-3">
              {items.map((item) => {
                const achieved = progress[item.id]?.achieved === true;
                const isExpanded = expandedId === item.id;

                return (
                  <li key={item.id} className="rounded-2xl bg-explorer-sand/60 p-3">
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggle(item)}
                        aria-pressed={achieved}
                        aria-label={`${achieved ? '取消' : '標記'}：${item.title}`}
                        className={`mt-0.5 w-6 h-6 shrink-0 rounded-lg border-2 flex items-center justify-center transition-colors ${
                          achieved
                            ? 'bg-explorer-meadow border-explorer-meadow text-white'
                            : 'bg-white border-explorer-sand'
                        }`}
                      >
                        {achieved && <Check className="w-4 h-4" strokeWidth={3} />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        aria-expanded={isExpanded}
                        className="flex-1 text-left"
                      >
                        <span className={`text-sm ${achieved ? 'text-explorer-bark' : 'text-explorer-bark/80'}`}>
                          {item.title}
                        </span>
                        <ChevronDown
                          className={`inline-block w-4 h-4 ml-1 text-explorer-bark/40 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pl-9 space-y-2">
                        <p className="text-sm text-explorer-bark/70 leading-relaxed">{item.detail}</p>
                        <ul className="space-y-1">
                          {item.tips.map((tip) => (
                            <li key={tip} className="text-sm text-explorer-bark/60 flex gap-2">
                              <span className="text-explorer-meadow-dark shrink-0">·</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {diaryFor === item.id && (
                      <div className="mt-3 pl-9 flex gap-2">
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
                          className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-explorer-sand text-sm focus:outline-none focus:ring-2 focus:ring-explorer-sunbeam"
                        />
                        <button
                          type="button"
                          onClick={() => handleQuickDiary(item)}
                          disabled={!diaryText.trim()}
                          className="px-3 py-2 rounded-xl bg-explorer-sunbeam text-white text-sm font-medium disabled:opacity-40"
                        >
                          記下來
                        </button>
                        <button
                          type="button"
                          onClick={() => setDiaryFor(null)}
                          aria-label="關閉"
                          className="px-2 text-explorer-bark/40 hover:text-explorer-bark"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {savedFor === item.id && (
                      <p className="mt-2 pl-9 text-xs text-explorer-meadow-dark">已寫進日記 ✓</p>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <ToothChart
        progress={toothProgress}
        ageMonths={ageMonths}
        onToggleTooth={onToggleTooth}
      />

      {warning && (
        <section className="bg-explorer-clay/10 rounded-3xl p-5">
          <button
            type="button"
            onClick={() => setWarningsOpen(!warningsOpen)}
            aria-expanded={warningsOpen}
            className="w-full flex items-center gap-2 text-left"
          >
            <AlertTriangle className="w-5 h-5 text-explorer-clay shrink-0" />
            <h3 className="flex-1 font-semibold text-explorer-bark">什麼時候該諮詢醫師</h3>
            <ChevronDown
              className={`w-5 h-5 text-explorer-bark/40 transition-transform ${warningsOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {warningsOpen && (
            <div className="mt-4 space-y-3">
              <ul className="space-y-2">
                {warning.signals.map((signal) => (
                  <li key={signal} className="text-sm text-explorer-bark/80 flex gap-2">
                    <span className="text-explorer-clay shrink-0">·</span>
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-explorer-bark/70 leading-relaxed border-t border-explorer-clay/20 pt-3">
                {warning.action}
              </p>
            </div>
          )}
        </section>
      )}

      <p className="flex items-start gap-2 text-xs text-explorer-bark/50 leading-relaxed px-1">
        <Sprout className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          每個孩子的發展速度不同，本表僅供家長觀察參考，不是診斷工具。若有疑慮，正式評估請至兒童發展聯合評估中心。
        </span>
      </p>
    </div>
      )}
    </ExplorerShell>
  );
}
