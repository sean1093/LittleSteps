import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flower2, Sparkles, Book, Calendar, Plus } from 'lucide-react';
import { User } from 'firebase/auth';
import { pregnancyGuides } from '../../data/pregnancyGuides';
import { ChildProfile, PrenatalCheckup } from '../../types';
import { usePregnancyData } from '../hooks/usePregnancyData';
import LoginPrompt from '../../common/components/LoginPrompt';

interface LittleBloomPageProps {
  currentChild?: ChildProfile | null;
  user: User | null;
  onSignIn: () => void;
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

// Placeholder prenatal-checkup data for the WIP pregnancy page (no editing UI yet).
const PLACEHOLDER_CHECKUPS: PrenatalCheckup[] = [
  { id: '1', childId: 'c1', date: '2026-04-15', clinicName: '幸福婦產科', notes: '初步檢查', completed: false }
];

function LittleBloomPage({ currentChild, user, onSignIn }: LittleBloomPageProps) {
  const { pregnancyData } = usePregnancyData(currentChild?.id || null, user);

  const currentWeek = useMemo(() => {
    if (!pregnancyData) return 1;
    const start = new Date(pregnancyData.lastPeriodDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7) + 1;
  }, [pregnancyData]);

  const currentGuide = useMemo(() => {
    return pregnancyGuides.find(g => g.week === currentWeek) || pregnancyGuides[0];
  }, [currentWeek]);

  const nextCheckup = useMemo(() => {
    return PLACEHOLDER_CHECKUPS.find(c => !c.completed && new Date(c.date) > new Date());
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <LoginPrompt 
          message="登入以開始您的孕期記錄旅程，讓我們陪伴妳度過這段珍貴的時光 ✨" 
          onSignIn={onSignIn}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] px-4 py-8 relative overflow-hidden">
      {/* Soft decorative circles */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-[#E8F4F8] rounded-full opacity-30 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#FFE5E5] rounded-full opacity-30 blur-3xl" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto relative z-10"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl p-8 shadow-soft mb-6 text-center"
        >
          <Flower2 className="w-12 h-12 text-[#FF9B9B] mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            LittleBloom
          </h1>
          <p className="text-gray-600 font-medium">第 {currentWeek} 週，妳做得很好 ✨</p>
        </motion.div>

        {/* Weekly Guide Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl p-6 shadow-soft"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-2">{currentGuide.title}</h2>
          <p className="text-gray-600 mb-6">{currentGuide.summary}</p>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-[#FF9B9B] flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> 本週提醒
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              {currentGuide.tips.map((tip, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[#FF9B9B]">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Prenatal Checkup Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl p-6 shadow-soft"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#81C784]" /> 下次產檢
          </h3>
          {nextCheckup ? (
            <div className="flex items-center justify-between bg-[#FDFBF7] p-4 rounded-2xl border border-gray-100">
              <div>
                <p className="font-semibold text-gray-800">{nextCheckup.clinicName}</p>
                <p className="text-sm text-gray-600">{nextCheckup.date}</p>
              </div>
              <span className="bg-[#E8F5E9] text-[#81C784] px-3 py-1 rounded-full text-xs font-medium">
                進行中
              </span>
            </div>
          ) : (
            <button className="flex items-center text-[#FF9B9B] font-medium gap-1 hover:text-[#FF8080]">
              <Plus className="w-4 h-4" /> 新增產檢預約
            </button>
          )}
        </motion.div>

        {/* Quick Navigation */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-bold text-gray-800 mb-4">快速導航</h2>
          <div className="grid grid-cols-2 gap-4">
            <NavButton
              label="產檢時程"
              onClick={() => {}}
              icon={<Calendar className="w-6 h-6" />}
              gradient="from-green-400 to-green-600"
            />
            <NavButton
              label="完整知識庫"
              onClick={() => window.location.hash = '#/littlebloom/wiki'}
              icon={<Book className="w-6 h-6" />}
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
  icon: React.ReactNode;
  gradient: string;
}

function NavButton({ label, onClick, icon, gradient }: NavButtonProps) {
  const colorMap: Record<string, string> = {
    'from-green-400 to-green-600': 'bg-[#E8F5E9] text-[#81C784]',
    'from-blue-400 to-blue-600': 'bg-[#E8F4F8] text-[#7EC8E3]',
  };
  const colorClass = colorMap[gradient] || 'bg-[#E8F4F8] text-[#7EC8E3]';

  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${colorClass} rounded-3xl p-6 shadow-soft hover:shadow-soft-lg transition-all flex flex-col items-center gap-3`}
    >
      {icon}
      <span className="font-semibold">{label}</span>
    </motion.button>
  );
}

export default LittleBloomPage;
