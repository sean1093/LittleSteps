import { motion } from 'framer-motion';
import { Baby, TrendingUp, Calendar, ArrowRight, Sparkles, Heart, LineChart, Syringe, BookOpen, UtensilsCrossed } from 'lucide-react';
import { ChildProfile, DailyLog } from '../types';
import { useChildSummary } from '../hooks/useChildSummary';
import { useSleepAnalytics } from '../hooks/useSleepAnalytics';
import { calculateAgeDisplay } from '../utils/summaryCalculator';
import MilestoneSummaryCard from '../components/MilestoneSummaryCard';
import VaccineSummaryCard from '../components/VaccineSummaryCard';
import DailyLogSummaryCard from '../components/DailyLogSummaryCard';
import SleepAnalyticsCard from '../components/SleepAnalyticsCard';

interface DashboardPageProps {
  currentChild?: ChildProfile;
  dailyLogs: DailyLog[];
  onNavigate: (page: 'milestones' | 'vaccine-tracking' | 'daily-log' | 'care-guide' | 'complementary-food') => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export default function DashboardPage({
  currentChild,
  dailyLogs,
  onNavigate,
}: DashboardPageProps) {
  const { milestoneSummary, vaccineSummary, todaySummary } = useChildSummary(currentChild, dailyLogs);
  const { analytics: sleepAnalytics } = useSleepAnalytics(dailyLogs);

  if (!currentChild) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] px-4 py-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 rounded-full bg-[#FFE5E5] flex items-center justify-center mx-auto mb-4">
              <Baby className="w-10 h-10 text-[#FF9B9B]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              開始記錄寶寶的成長旅程 ✨
            </h1>
            <p className="text-gray-600 mb-2">
              建立寶寶檔案後，即可使用所有功能追蹤寶寶的成長里程碑
            </p>
            <p className="text-sm text-gray-500">
              請從左上角選單新增寶寶資料
            </p>
          </motion.div>

          {/* Feature Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 gap-4 mb-8"
          >
            {/* Feature: Growth Charts */}
            <div className="bg-white rounded-3xl p-6 shadow-soft">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F4F8] flex items-center justify-center flex-shrink-0">
                  <LineChart className="w-6 h-6 text-[#7EC8E3]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-2">成長曲線圖</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    記錄身高、體重、頭圍，自動計算百分位數
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Heart className="w-3 h-3 text-[#FF9B9B]" />
                    <span>追蹤寶寶健康發展</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature: Milestones */}
            <div className="bg-white rounded-3xl p-6 shadow-soft">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFE5E5] flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-[#FF9B9B]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-2">里程碑追蹤</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    記錄第一次微笑、翻身、爬行等珍貴時刻
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Sparkles className="w-3 h-3 text-[#FF9B9B]" />
                    <span>不錯過每個成長瞬間</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature: Vaccines */}
            <div className="bg-white rounded-3xl p-6 shadow-soft">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] flex items-center justify-center flex-shrink-0">
                  <Syringe className="w-6 h-6 text-[#81C784]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-2">疫苗接種管理</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    完整時程表，提醒下次接種時間，不漏打
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3 text-[#81C784]" />
                    <span>依衛福部建議時程</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature: Daily Logs */}
            <div className="bg-white rounded-3xl p-6 shadow-soft">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF3E0] flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-[#FF9B9B]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-2">快速日誌</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    3 秒記錄餵奶、睡眠、尿布，掌握作息規律
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <TrendingUp className="w-3 h-3 text-[#FF9B9B]" />
                    <span>了解寶寶生活模式</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Additional Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-6 shadow-soft"
          >
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-[#FF9B9B]" />
              更多實用功能
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 rounded-full bg-[#7EC8E3]" />
                <span>副食品階段指南</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 rounded-full bg-[#81C784]" />
                <span>食物過敏追蹤</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 rounded-full bg-[#FF9B9B]" />
                <span>睡眠訓練技巧</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 rounded-full bg-[#7EC8E3]" />
                <span>照顧重點提醒</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 rounded-full bg-[#81C784]" />
                <span>資料跨裝置同步</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 rounded-full bg-[#FF9B9B]" />
                <span>支援多個寶寶</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const ageDisplay = calculateAgeDisplay(currentChild.birthday);

  return (
    <div className="min-h-screen bg-[#FDFBF7] px-4 py-8 relative overflow-hidden">
      {/* Soft decorative circles */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-[#E8F4F8] rounded-full opacity-30 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#FFE5E5] rounded-full opacity-30 blur-3xl" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto relative z-10"
      >
        {/* Baby Info Header */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl p-6 shadow-soft mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#FFE5E5] flex items-center justify-center">
              <Baby className="w-8 h-8 text-[#FF9B9B]" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {currentChild.name} 的成長總覽
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>出生: {currentChild.birthday}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>{ageDisplay}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards Grid */}
        <motion.div
          variants={itemVariants}
          className="grid md:grid-cols-2 gap-6 mb-6"
        >
          {/* Milestone Summary */}
          {milestoneSummary && (
            <MilestoneSummaryCard
              milestoneProgress={currentChild.milestoneProgress || {}}
              onNavigate={() => onNavigate('milestones')}
            />
          )}

          {/* Vaccine Summary */}
          {vaccineSummary && (
            <VaccineSummaryCard
              vaccineProgress={currentChild.vaccineProgress || {}}
              onNavigate={() => onNavigate('vaccine-tracking')}
            />
          )}
        </motion.div>

        {/* Daily Log & Sleep Analytics */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Daily Log Summary */}
          <DailyLogSummaryCard
            summary={todaySummary}
            onNavigate={() => onNavigate('daily-log')}
          />

          {/* Sleep Analytics */}
          <SleepAnalyticsCard
            analytics={sleepAnalytics}
            onNavigate={() => onNavigate('daily-log')}
          />
        </motion.div>

        {/* Quick Navigation */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-bold text-gray-800 mb-4">快速導航</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <NavButton
              label="里程碑"
              onClick={() => onNavigate('milestones')}
              gradient="from-pink-400 to-pink-600"
            />
            <NavButton
              label="疫苗追蹤"
              onClick={() => onNavigate('vaccine-tracking')}
              gradient="from-green-400 to-green-600"
            />
            <NavButton
              label="副食品"
              onClick={() => onNavigate('complementary-food')}
              gradient="from-orange-400 to-orange-600"
            />
            <NavButton
              label="照顧重點"
              onClick={() => onNavigate('care-guide')}
              gradient="from-blue-400 to-blue-600"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

interface NavButtonProps {
  label: string;
  onClick: () => void;
  gradient: string;
}

function NavButton({ label, onClick, gradient }: NavButtonProps) {
  // Map gradients to solid colors
  const colorMap: Record<string, string> = {
    'from-pink-400 to-pink-600': 'bg-[#FFE5E5] text-[#FF9B9B]',
    'from-green-400 to-green-600': 'bg-[#E8F5E9] text-[#81C784]',
    'from-orange-400 to-orange-600': 'bg-[#FFF3E0] text-[#FF9B9B]',
    'from-blue-400 to-blue-600': 'bg-[#E8F4F8] text-[#7EC8E3]',
  };
  const colorClass = colorMap[gradient] || 'bg-[#E8F4F8] text-[#7EC8E3]';

  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${colorClass} rounded-3xl p-4 shadow-soft hover:shadow-soft-lg transition-all group`}
    >
      <span className="font-semibold text-lg">{label}</span>
      <ArrowRight className="w-4 h-4 inline-block ml-2 group-hover:translate-x-1 transition-transform" />
    </motion.button>
  );
}
