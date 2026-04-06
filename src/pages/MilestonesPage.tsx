import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Baby } from 'lucide-react';
import { User } from 'firebase/auth';
import { MonthRange, Category, MilestoneProgress } from '../types';
import { milestones, monthRanges, categories } from '../data/milestones';
import MonthPicker from '../components/MonthPicker';
import CategoryFilter from '../components/CategoryFilter';
import MilestoneCard from '../components/MilestoneCard';
import MilestoneModal from '../components/MilestoneModal';

interface MilestonesPageProps {
  progress: MilestoneProgress;
  onToggleMilestone: (id: string) => void;
  user?: User | null;
  onSignIn?: () => Promise<void>;
}

export default function MilestonesPage({ progress, onToggleMilestone, user, onSignIn }: MilestonesPageProps) {
  const [selectedMonth, setSelectedMonth] = useState<MonthRange>("0-2");
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);

  const filteredMilestones = useMemo(() => {
    return milestones.filter(m => {
      const monthMatch = m.monthRange === selectedMonth;
      const categoryMatch = selectedCategory === "all" || m.category === selectedCategory;
      return monthMatch && categoryMatch;
    });
  }, [selectedMonth, selectedCategory]);

  const selectedMilestone = useMemo(() => {
    return milestones.find(m => m.id === selectedMilestoneId) || null;
  }, [selectedMilestoneId]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-6 relative overflow-hidden">
      {/* Soft decorative circles */}
      <div className="absolute top-10 right-5 w-48 h-48 bg-[#FFE5E5] rounded-full opacity-30 blur-3xl" />
      <div className="absolute top-40 left-5 w-56 h-56 bg-[#E8F4F8] rounded-full opacity-30 blur-3xl" />

      {/* Header Info */}
      <div className="relative z-10 bg-[#E8F4F8]/30 px-4 py-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#FFE5E5] flex items-center justify-center">
            <Baby className="w-5 h-5 text-[#FF9B9B]" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">寶寶成長里程碑</h2>
        </div>
        <p className="text-sm text-gray-600">
          記錄寶寶每個珍貴的成長時刻，從第一個微笑到第一步
        </p>
      </div>

      {/* Login Prompt - show when not logged in */}
      {!user && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 mb-4 relative z-10"
        >
          <div className="bg-[#E8F4F8]/50 border-2 border-[#7EC8E3]/30 rounded-3xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#7EC8E3] flex items-center justify-center flex-shrink-0">
                <Baby className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">登入以記錄里程碑</h4>
                <p className="text-sm text-gray-600 mb-3">
                  登入後即可追蹤並記錄寶寶的成長里程碑，資料會自動同步到所有裝置
                </p>
                <button
                  onClick={async () => {
                    try {
                      await onSignIn?.();
                    } catch (error: any) {
                      if (error?.code === 'auth/popup-closed-by-user') {
                        return;
                      }
                      console.error('登入失敗:', error);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#7EC8E3] text-white text-sm font-medium hover:bg-[#6BB8D3] transition-colors"
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    className="w-4 h-4 bg-white rounded-full p-0.5"
                  />
                  <span>使用 Google 登入</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Month Picker */}
      <div className="px-4 mb-4">
        <MonthPicker
          ranges={monthRanges}
          selected={selectedMonth}
          onChange={setSelectedMonth}
        />
      </div>

      {/* Category Filter */}
      <div className="px-4 mb-4">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>

      {/* Milestones List */}
      <div className="px-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredMilestones.length > 0 ? (
            filteredMilestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <MilestoneCard
                  milestone={milestone}
                  isCompleted={progress[milestone.id]?.achieved || false}
                  achievedDate={progress[milestone.id]?.achievedDate}
                  onToggle={() => onToggleMilestone(milestone.id)}
                  onClick={() => setSelectedMilestoneId(milestone.id)}
                  isReadOnly={!user}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">👶</div>
              <p className="text-gray-500">
                {selectedCategory === "all"
                  ? "這個月齡階段沒有里程碑資料"
                  : "這個分類沒有里程碑資料"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <MilestoneModal
        milestone={selectedMilestone}
        isOpen={!!selectedMilestone}
        onClose={() => setSelectedMilestoneId(null)}
        isCompleted={selectedMilestone ? progress[selectedMilestone.id]?.achieved || false : false}
        achievedDate={selectedMilestone ? progress[selectedMilestone.id]?.achievedDate : undefined}
        onToggle={() => selectedMilestone && onToggleMilestone(selectedMilestone.id)}
        isReadOnly={!user}
      />
    </div>
  );
}
