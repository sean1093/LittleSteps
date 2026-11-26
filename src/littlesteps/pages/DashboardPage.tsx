import { motion } from 'framer-motion';
import { isPregnancyProfile } from '../../common/pregnancy';
import { stageOfChild } from '../../common/stageEntry';
import ToddlerHandoff from '../components/ToddlerHandoff';
import VaccineDueCard from '../components/vaccine/VaccineDueCard';
import { ChildProfile, DailyLog } from '../../types';
import { User } from 'firebase/auth';
import { useChildSummary } from '../hooks/useChildSummary';
import { useSleepAnalytics } from '../hooks/useSleepAnalytics';
import { useFoodTracking } from '../hooks/useFoodTracking';
import { calculateAgeDisplay } from '../../common/utils/summaryCalculator';
import { formatDate } from '../../common/utils/dateHelpers';
import { getActiveAlerts } from '../utils/alertEngine';
import { correctedAgeMonths } from '../../common/correctedAge';
import MilestoneSummaryCard from '../components/milestone/MilestoneSummaryCard';
import VaccineSummaryCard from '../components/vaccine/VaccineSummaryCard';
import DailyLogSummaryCard from '../components/dailylog/DailyLogSummaryCard';
import SleepAnalyticsCard from '../components/sleep/SleepAnalyticsCard';
import FoodTrackingSummaryCard from '../components/food/FoodTrackingSummaryCard';
import AlertBanner from '../components/shared/AlertBanner';
import PoopSummaryCard from '../components/dailylog/PoopSummaryCard';
import EmptyState from '../../common/ui/EmptyState';
import RecordsNotice from '../../common/ui/RecordsNotice';
import type { RecordsStatus } from '../../common/recordsStatus';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { stagger, listItem } from '../../common/ui/motion';
import { goTo } from '../../common/navigate';

interface DashboardPageProps {
  currentChild?: ChildProfile;
  dailyLogs: DailyLog[];
  /**
   * dailyLogs 現在能不能拿來算。不是 ready 的時候空陣列是「還不知道」或
   * 「讀不到」，不是「沒有紀錄」——見 common/recordsStatus。
   */
  logsStatus?: RecordsStatus;
  user: User | null;
  onNavigate: (page: 'littlesteps/milestones' | 'littlesteps/vaccine-tracking' | 'littlesteps/daily-log' | 'littlesteps/care-guide' | 'littlesteps/complementary-food' | 'littlesteps/sleep-analysis' | 'littlesteps/clinic-summary') => void;
}

const FEATURES = [
  {
    title: '成長曲線圖',
    description: '記錄身高、體重、頭圍，自動計算百分位數',
    note: '追蹤寶寶健康發展',
  },
  {
    title: '里程碑追蹤',
    description: '記錄第一次微笑、翻身、爬行等珍貴時刻',
    note: '不錯過每個成長瞬間',
  },
  {
    title: '疫苗接種管理',
    description: '完整時程表，提醒下次接種時間，不漏打',
    note: '依衛福部建議時程',
  },
  {
    title: '快速日誌',
    description: '3 秒記錄餵奶、睡眠、尿布，掌握作息規律',
    note: '了解寶寶生活模式',
  },
];

const MORE_FEATURES = [
  '副食品階段指南',
  '食物過敏追蹤',
  '睡眠訓練技巧',
  '照顧重點提醒',
  '資料跨裝置同步',
  '支援多個寶寶',
];

export default function DashboardPage({
  currentChild,
  dailyLogs,
  logsStatus = 'ready',
  user,
  onNavigate,
}: DashboardPageProps) {
  const { milestoneSummary, vaccineSummary, todaySummary } = useChildSummary(currentChild, dailyLogs);
  const { analytics: sleepAnalytics } = useSleepAnalytics(dailyLogs);
  const { stats: foodStats } = useFoodTracking(currentChild?.id || null, user);

  // Calculate baby's age in months
  const ageMonths = currentChild?.birthday
    ? Math.max(0, Math.floor(
        (Date.now() - new Date(currentChild.birthday).getTime()) / (1000 * 60 * 60 * 24 * 30.44)
      ))
    : 0;

  /*
    警示用矯正年齡。「超過 6 小時沒餵」只對 3 個月以下的寶寶說話，用實際月齡
    算的話，32 週出生的寶寶在實際 3 個月、矯正還不到 2 個月時就失去這則提醒
    ——而他正是最需要它的那一個。足月或沒填出生週數時不做矯正，但月齡改依曆月計算，
    與 calculateAge 一致；舊算法是天數除以 30.44，月底出生的寶寶會差到一天。
  */
  const activeAlerts = currentChild
    ? getActiveAlerts(dailyLogs, correctedAgeMonths(currentChild))
    : [];

  if (!currentChild) {
    return (
      <div className="screen">
        <motion.div
          className="screen-body-wide"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={listItem} className="mb-6">
            <EmptyState
              theme={SERVICE_THEME.littlesteps}
              title="還沒有寶寶的資料"
              description="請點右上角的帳號按鈕新增或選擇寶寶。"
            />
          </motion.div>

          <motion.div variants={listItem} className="grid md:grid-cols-2 gap-4 mb-4">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="card">
                <h3 className="mb-1">{feature.title}</h3>
                <p className="text-sm text-ink-muted mb-1.5">{feature.description}</p>
                <p className="text-xs text-ink-faint">{feature.note}</p>
              </div>
            ))}
          </motion.div>

          <motion.div variants={listItem} className="panel">
            <h3 className="mb-3">更多實用功能</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm text-ink-muted">
              {MORE_FEATURES.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // 今日摘要、警示、睡眠與便便卡片都是從日誌算出來的。日誌還沒到、連不上或
  // 讀不到的時候先不畫，否則家長會看到「今天餵奶 0 次」——那不是事實。
  if (logsStatus !== 'ready') {
    return (
      <div className="screen">
        <div className="screen-body-wide">
          <RecordsNotice status={logsStatus} theme={SERVICE_THEME.littlesteps} />
        </div>
      </div>
    );
  }

  const ageDisplay = calculateAgeDisplay(currentChild.birthday);

  return (
    <div className="screen">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="screen-body-wide"
      >
        {/* 孕期檔案的 birthday 是預產期，所以里程碑、疫苗、日誌一律是 0，
            畫面看起來像個從未使用的帳號。直接說明並指路，勝過讓人以為壞了。 */}
        {isPregnancyProfile(currentChild) && (
          <motion.div
            variants={listItem}
            className="panel bg-bloom-cream border border-bloom-dusty-rose/30 mb-6"
          >
            <p className="font-semibold text-bloom-stone-ink mb-1">這是孕期檔案</p>
            <p className="text-sm text-bloom-stone-ink/70 leading-relaxed">
              寶寶還沒出生，所以下面的里程碑、疫苗與日誌都還是空的。
              每週指南與產檢時程在「孕期陪伴」；出生後在那裡登記出生日期，這裡就會開始有內容。
            </p>
            <button
              type="button"
              onClick={() => {
                goTo('littlebloom');
              }}
              className="btn-primary bg-bloom-dusty-rose-deep mt-3"
            >
              前往孕期陪伴
            </button>
          </motion.div>
        )}

        {/* 月齡與出生日期是 AppBar 標題沒帶到的資訊，所以這一段留著；
            重複的頁面標題與寶寶頭像圖示已移除。 */}
        <motion.div variants={listItem} className="panel mb-4">
          <h2 className="mb-1">{ageDisplay}</h2>
          {/* 孕期檔案的 birthday 是預產期。標題已經說了「尚未出生」，
              下一行再寫「出生: …」會自相矛盾。 */}
          <p className="text-sm text-ink-muted">
            {isPregnancyProfile(currentChild) ? '預產期' : '出生'}:{' '}
            {formatDate(currentChild.birthday)}
          </p>
        </motion.div>

        {activeAlerts.length > 0 && (
          <motion.div variants={listItem} className="mb-4">
            <AlertBanner alerts={activeAlerts} />
          </motion.div>
        )}

        {/* 該打的疫苗排在行為警示之後、里程碑之前：它比「昨天少喝一餐」重要，
            但不像餵食警示那樣需要今天就處理。沒有到期的劑次時整張不出現。 */}
        {!isPregnancyProfile(currentChild) && (
          <VaccineDueCard
            child={currentChild}
            onOpen={() => onNavigate('littlesteps/vaccine-tracking')}
          />
        )}

        {/* 滿一歲之後，LittleSteps 的里程碑資料就到頂了；幼兒期的檢核與
            健檢提醒在 LittleExplorer，而這裡從來沒提過它存在。 */}
        {/* 用 stageOfChild 而不是自己比月齡：它原本是 ageMonths >= 12，沒有上界，
            滿三歲的孩子每次打開都被叫去 LittleExplorer，而那一頁會把他送回來。 */}
        {stageOfChild(currentChild) === 'toddler' && (
          <ToddlerHandoff childName={currentChild.name} />
        )}

        {/*
          今天的紀錄排在里程碑與疫苗前面：這一頁一天開很多次，為的幾乎都是
          「上次什麼時候餵的」，而里程碑一個月才變一次。
        */}
        <motion.div variants={listItem} className="grid md:grid-cols-2 gap-4 mb-4">
          <DailyLogSummaryCard
            summary={todaySummary}
            dailyLogs={dailyLogs}
            onNavigate={() => onNavigate('littlesteps/daily-log')}
          />

          <SleepAnalyticsCard
            analytics={sleepAnalytics}
            ageMonths={ageMonths}
            onNavigate={() => onNavigate('littlesteps/sleep-analysis')}
          />
        </motion.div>

        {/* Poop & Food Tracking */}
        <motion.div variants={listItem} className="grid md:grid-cols-2 gap-4 mb-4">
          <PoopSummaryCard
            dailyLogs={dailyLogs}
            onNavigate={() => onNavigate('littlesteps/daily-log')}
          />
          <FoodTrackingSummaryCard
            stats={foodStats}
            onNavigate={() => onNavigate('littlesteps/complementary-food')}
          />
        </motion.div>

        {/* 里程碑與疫苗摘要 */}
        <motion.div variants={listItem} className="grid md:grid-cols-2 gap-4 mb-4">
          {milestoneSummary && (
            <MilestoneSummaryCard
              milestoneProgress={currentChild.milestoneProgress || {}}
              onNavigate={() => onNavigate('littlesteps/milestones')}
            />
          )}

          {vaccineSummary && (
            <VaccineSummaryCard
              vaccineProgress={currentChild.vaccineProgress || {}}
              birthday={currentChild.birthday}
              onNavigate={() => onNavigate('littlesteps/vaccine-tracking')}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
