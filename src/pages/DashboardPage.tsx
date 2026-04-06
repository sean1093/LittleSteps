import { motion } from 'framer-motion';
import { Baby, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
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
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Baby className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-xl text-gray-600 mb-6">尚未建立寶寶檔案</p>
        <p className="text-gray-500">請從左上角選單新增寶寶資料</p>
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
