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
    <div className="min-h-screen bg-warm-white pb-6">
      {/* Header Info */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 px-4 py-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Baby className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-gray-800">寶寶成長里程碑</h2>
        </div>
        <p className="text-sm text-gray-600">
          記錄寶寶每個珍貴的成長時刻，從第一個微笑到第一步
        </p>
      </div>

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
                  onSignIn={onSignIn}
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
        onSignIn={onSignIn}
      />
    </div>
  );
}
