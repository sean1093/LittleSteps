import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { MonthRange, Category, MilestoneProgress } from '../../types';
import { milestones, monthRanges, categories } from '../data/milestones';
import MonthPicker from '../components/shared/MonthPicker';
import CategoryFilter from '../components/food/CategoryFilter';
import MilestoneCard from '../components/milestone/MilestoneCard';
import MilestoneModal from '../components/milestone/MilestoneModal';
import EmptyState from '../../common/ui/EmptyState';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { stagger, listItem, fadeInUp } from '../../common/ui/motion';

interface MilestonesPageProps {
  progress: MilestoneProgress;
  onToggleMilestone: (id: string) => void;
}

export default function MilestonesPage({ progress, onToggleMilestone }: MilestonesPageProps) {
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
    <div className="screen">
      <div className="screen-body">
        <div className="mb-4">
          <MonthPicker
            ranges={monthRanges}
            selected={selectedMonth}
            onChange={setSelectedMonth}
          />
        </div>

        <div className="mb-4">
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>

        <AnimatePresence mode="popLayout">
          {filteredMilestones.length > 0 ? (
            /* Re-keying on the filter replays the stagger, so a chip tap reads
               as a new list arriving rather than rows silently swapping. */
            <motion.div
              key={`${selectedMonth}-${selectedCategory}`}
              className="space-y-3"
              variants={stagger}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
            >
              {filteredMilestones.map((milestone) => (
                <motion.div key={milestone.id} layout variants={listItem}>
                  <MilestoneCard
                    milestone={milestone}
                    isCompleted={progress[milestone.id]?.achieved || false}
                    achievedDate={progress[milestone.id]?.achievedDate}
                    onToggle={() => onToggleMilestone(milestone.id)}
                    onClick={() => setSelectedMilestoneId(milestone.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="empty" variants={fadeInUp} initial="hidden" animate="visible">
              <EmptyState
                theme={SERVICE_THEME.littlesteps}
                title={
                  selectedCategory === "all"
                    ? "這個月齡階段沒有里程碑資料"
                    : "這個分類沒有里程碑資料"
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MilestoneModal
        milestone={selectedMilestone}
        isOpen={!!selectedMilestone}
        onClose={() => setSelectedMilestoneId(null)}
        isCompleted={selectedMilestone ? progress[selectedMilestone.id]?.achieved || false : false}
        achievedDate={selectedMilestone ? progress[selectedMilestone.id]?.achievedDate : undefined}
        onToggle={() => selectedMilestone && onToggleMilestone(selectedMilestone.id)}
      />
    </div>
  );
}
