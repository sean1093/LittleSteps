import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { ChildProfile, MonthRange, Category, MilestoneProgress } from '../../types';
import { milestones, monthRanges, categories } from '../data/milestones';
import MonthPicker from '../components/shared/MonthPicker';
import CategoryFilter from '../components/food/CategoryFilter';
import MilestoneCard from '../components/milestone/MilestoneCard';
import MilestoneModal from '../components/milestone/MilestoneModal';
import ChildSwitcher from '../../common/components/ChildSwitcher';
import EmptyState from '../../common/ui/EmptyState';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { stagger, listItem, fadeInUp } from '../../common/ui/motion';
import { monthRangeForChild } from '../utils/ageDefaults';

interface MilestonesPageProps {
  currentChild?: ChildProfile | null;
  progress: MilestoneProgress;
  onToggleMilestone: (id: string) => void;
}

export default function MilestonesPage({
  currentChild,
  progress,
  onToggleMilestone,
}: MilestonesPageProps) {
  // 從孩子現在的月齡起跑，而不是從 0-2 個月。停在出生那一段對任何滿三個月
  // 以上的寶寶都是錯的起點，家長每次進來都得自己滑過去。
  const [selectedMonth, setSelectedMonth] = useState<MonthRange>(() =>
    monthRangeForChild(currentChild),
  );
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
        <ChildSwitcher service="littlesteps" className="mb-4" />

        <div className="mb-4">
          <MonthPicker ranges={monthRanges} selected={selectedMonth} onChange={setSelectedMonth} />
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
