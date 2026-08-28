import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { isPregnancyProfile } from '../../common/pregnancy';
import { ChildProfile, DailyLog } from '../../types';
import { User } from 'firebase/auth';
import { useChildSummary } from '../hooks/useChildSummary';
import { useSleepAnalytics } from '../hooks/useSleepAnalytics';
import { useFoodTracking } from '../hooks/useFoodTracking';
import { calculateAgeDisplay } from '../../common/utils/summaryCalculator';
import { formatDate } from '../../common/utils/dateHelpers';
import { getActiveAlerts } from '../utils/alertEngine';
import MilestoneSummaryCard from '../components/milestone/MilestoneSummaryCard';
import VaccineSummaryCard from '../components/vaccine/VaccineSummaryCard';
import DailyLogSummaryCard from '../components/dailylog/DailyLogSummaryCard';
import SleepAnalyticsCard from '../components/sleep/SleepAnalyticsCard';
import FoodTrackingSummaryCard from '../components/food/FoodTrackingSummaryCard';
import AlertBanner from '../components/shared/AlertBanner';
import PoopSummaryCard from '../components/dailylog/PoopSummaryCard';
import EmptyState from '../../common/ui/EmptyState';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { stagger, listItem, tap, hoverLift } from '../../common/ui/motion';
import { goTo } from '../../common/navigate';

interface DashboardPageProps {
  currentChild?: ChildProfile;
  dailyLogs: DailyLog[];
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

const QUICK_NAV: { label: string; page: 'littlesteps/milestones' | 'littlesteps/vaccine-tracking' | 'littlesteps/complementary-food' | 'littlesteps/care-guide' }[] = [
  { label: '里程碑', page: 'littlesteps/milestones' },
  { label: '疫苗追蹤', page: 'littlesteps/vaccine-tracking' },
  { label: '副食品', page: 'littlesteps/complementary-food' },
  { label: '照顧重點', page: 'littlesteps/care-guide' },
];

export default function DashboardPage({
  currentChild,
  dailyLogs,
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

  // Get active alerts
  const activeAlerts = currentChild ? getActiveAlerts(dailyLogs, ageMonths) : [];

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
              title="開始記錄寶寶的成長旅程"
              description={'建立寶寶檔案後，即可使用所有功能追蹤寶寶的成長里程碑\n請從左上角選單新增寶寶資料'}
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
              每週指南與產檢時程在 LittleBloom；出生後在那裡登記出生日期，這裡就會開始有內容。
            </p>
            <button
              type="button"
              onClick={() => {
                goTo('littlebloom');
              }}
              className="btn-primary bg-bloom-dusty-rose-deep mt-3"
            >
              前往 LittleBloom
            </button>
          </motion.div>
        )}

        {/* 月齡與出生日期是 AppBar 標題沒帶到的資訊，所以這一段留著；
            重複的頁面標題與寶寶頭像圖示已移除。 */}
        <motion.div variants={listItem} className="panel mb-4">
          <h1 className="mb-1">{ageDisplay}</h1>
          <p className="text-sm text-ink-muted">出生: {formatDate(currentChild.birthday)}</p>
        </motion.div>

        {activeAlerts.length > 0 && (
          <motion.div variants={listItem} className="mb-4">
            <AlertBanner alerts={activeAlerts} />
          </motion.div>
        )}

        {/* Summary Cards Grid */}
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
              onNavigate={() => onNavigate('littlesteps/vaccine-tracking')}
            />
          )}
        </motion.div>

        {/* Daily Log & Sleep Analytics */}
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
        <motion.div variants={listItem} className="grid md:grid-cols-2 gap-4 mb-6">
          <PoopSummaryCard
            dailyLogs={dailyLogs}
            onNavigate={() => onNavigate('littlesteps/daily-log')}
          />
          <FoodTrackingSummaryCard
            stats={foodStats}
            onNavigate={() => onNavigate('littlesteps/complementary-food')}
          />
        </motion.div>

        {/* Quick Navigation */}
        <motion.div variants={listItem}>
          <h2 className="mb-3">快速導航</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {QUICK_NAV.map((item) => (
              <motion.button
                key={item.page}
                whileHover={hoverLift}
                whileTap={tap}
                onClick={() => onNavigate(item.page)}
                className="card-tap flex items-center justify-between gap-2 text-left"
              >
                <span className="font-semibold text-ink">{item.label}</span>
                <ArrowRight className="w-4 h-4 text-primary-dark shrink-0" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
