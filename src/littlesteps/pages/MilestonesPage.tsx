import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { ChildProfile, MonthRange, Category, MilestoneProgress } from '../../types';
import { milestones, monthRanges, categories } from '../data/milestones';
import MonthPicker from '../components/shared/MonthPicker';
import CategoryFilter from '../components/food/CategoryFilter';
import MilestoneCard from '../components/milestone/MilestoneCard';
import MilestoneModal from '../components/milestone/MilestoneModal';
import MilestonePaceNote from '../components/milestone/MilestonePaceNote';
import ChildSwitcher from '../../common/components/ChildSwitcher';
import EmptyState from '../../common/ui/EmptyState';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { stagger, listItem, fadeInUp } from '../../common/ui/motion';
import { monthRangeForChild } from '../utils/ageDefaults';
import { confirmDelete } from '../../common/ui/confirmDelete';

interface MilestonesPageProps {
  currentChild?: ChildProfile | null;
  progress: MilestoneProgress;
  onToggleMilestone: (id: string) => void;
  /**
   * 明講狀態與日期的寫法：補登幾天前就會的事、或改掉填錯的日期。toggle 只會
   * 「反過來」而且一律蓋今天，兩件事都做不到。沒接上時視窗就不顯示日期欄。
   */
  onSetMilestone?: (id: string, achieved: boolean, achievedDate?: string) => void;
}

export default function MilestonesPage({
  currentChild,
  progress,
  onToggleMilestone,
  onSetMilestone,
}: MilestonesPageProps) {
  // 從孩子現在的月齡起跑，而不是從 0-2 個月。停在出生那一段對任何滿三個月
  // 以上的寶寶都是錯的起點，家長每次進來都得自己滑過去。
  /*
    月齡區間的優先順序：這次點的 > 孩子的月齡。跟 LittleGuard 的年齡層同一種
    寫法（RadarPage.tsx），`null` 就是「家長還沒挑過」。

    換寶寶時這一頁不會卸載（App.tsx 的錯誤邊界綁的是路由，不是孩子），所以不能
    用 useState 的初始值：那只在掛載時算一次，篩選器會一直停在上一個寶寶的月齡，
    六個月大切到三歲，畫面照樣拿 5-6 個月的里程碑對新寶寶打勾。每次 render 重推，
    連改生日也跟著更新；家長挑過的則永遠贏過推導出來的值。

    點到已經選中的那一顆不算挑過：pickMonth 把 picked 收回 null，這一頁就繼續
    跟著孩子走。理由與代價寫在 VaccineTrackingPage.tsx 的同一段註解裡。
  */
  const [pickedMonth, setPickedMonth] = useState<MonthRange | null>(null);
  const derivedMonth = monthRangeForChild(currentChild);
  const selectedMonth = pickedMonth ?? derivedMonth;
  const pickMonth = (value: MonthRange) =>
    setPickedMonth(value === derivedMonth ? null : value);
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

  /*
    取消打勾會把「第一次看到」的日期一起刪掉，而那個日期正是這一頁要留下來的
    東西，所以先問。打勾不必問：勾錯了再取消就好。
  */
  const toggle = (id: string, title: string) => {
    if (progress[id]?.achieved && !confirmDelete(`「${title}」第一次看到的日期`)) return;
    onToggleMilestone(id);
  };

  return (
    <div className="screen">
      <div className="screen-body">
        <ChildSwitcher service="littlesteps" className="mb-4" />

        <div className="mb-4">
          <MonthPicker ranges={monthRanges} selected={selectedMonth} onChange={pickMonth} />
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
                    onToggle={() => toggle(milestone.id, milestone.title)}
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

        {filteredMilestones.length > 0 && <MilestonePaceNote className="mt-4 px-1" />}
      </div>

      <MilestoneModal
        milestone={selectedMilestone}
        isOpen={!!selectedMilestone}
        onClose={() => setSelectedMilestoneId(null)}
        isCompleted={selectedMilestone ? progress[selectedMilestone.id]?.achieved || false : false}
        achievedDate={selectedMilestone ? progress[selectedMilestone.id]?.achievedDate : undefined}
        onToggle={() => selectedMilestone && toggle(selectedMilestone.id, selectedMilestone.title)}
        onSetAchieved={
          onSetMilestone && selectedMilestone
            ? (date) => onSetMilestone(selectedMilestone.id, true, date)
            : undefined
        }
      />
    </div>
  );
}
