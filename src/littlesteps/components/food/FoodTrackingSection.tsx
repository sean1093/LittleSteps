import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User } from 'firebase/auth';
import type { ChildProfile, FoodTrialInput, FoodTrialRecord } from '../../../types';
import { useFoodTracking } from '../../hooks/useFoodTracking';
import { useFirebaseChildren } from '../../../common/hooks/useFirebaseChildren';
import { toLocalDateKey } from '../../../common/utils/dateHelpers';
import { fadeInUp } from '../../../common/ui/motion';
import { useToast } from '../../../common/ui/toast';
import { trialDatesOf } from '../../utils/foodTrialDates';
import { foodTrialChanges } from '../../utils/foodTrialEdit';
import FoodTrackingSummary from './FoodTrackingSummary';
import FoodTrackingView from './FoodTrackingView';
import FoodTrialModal from './FoodTrialModal';
import type { TrackingTab, ViewMode } from './types';

interface FoodTrackingSectionProps {
  /** 已經出生的寶寶；孕期檔案不該走到這裡。 */
  currentChild: ChildProfile;
  user: User;
  viewMode: ViewMode;
  trackingTab: TrackingTab;
  onTabChange: (tab: TrackingTab) => void;
  onOpenTracking: (tab: TrackingTab) => void;
}

/**
 * 副食品頁裡需要帳號的那一半：讀這個孩子的食物紀錄、畫概況與追蹤檢視、
 * 處理所有寫入。
 *
 * 資料庫 SDK 只從這個檔案進來。副食品指南是公開頁，所以 ComplementaryFoodPage
 * 用 lazy() 載這一塊，而且只在「有人登入、選的是已出生的寶寶」時才掛它——
 * 別從公開頁的任何地方靜態匯入這個檔案。
 *
 * 它在整頁的生命週期裡只掛一次，讀指南時畫面上什麼都不畫但監聽還在：跟著
 * 檢視重掛的話，每次回主頁都會先閃一次「0 種食物」。
 */
export default function FoodTrackingSection({
  currentChild,
  user,
  viewMode,
  trackingTab,
  onTabChange,
  onOpenTracking,
}: FoodTrackingSectionProps) {
  const toast = useToast();
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodTrialRecord | null>(null);

  const childId = currentChild.id;
  const { foodProgress, foodTrials, stats, error } = useFoodTracking(childId, user);
  const firebaseChildren = useFirebaseChildren(user.uid);

  const handleAddFood = () => {
    setEditingFood(null);
    setShowFoodModal(true);
  };

  const handleEditFood = (food: FoodTrialRecord) => {
    setEditingFood(food);
    setShowFoodModal(true);
  };

  /*
    失敗時不接住：訊息與「表單留在原地」都由 FoodTrialModal 自己處理，
    這裡再 toast 一次就是同一件事講兩遍。
  */
  const handleSaveFood = async (foodData: FoodTrialInput) => {
    if (editingFood) {
      // 只送這次真的改到的欄位，而且是跟「打開表單當下那一版」比出來的：整筆
      // 寫回去會把另一位照顧者同時改的欄位一起蓋掉，被清空的欄位則要寫成
      // null，省略它等於不碰，家長刪掉的備註就會原封不動留在資料庫裡。
      await firebaseChildren.updateFoodTrial(
        childId,
        editingFood.id,
        foodTrialChanges(editingFood, foodData),
      );
    } else {
      await firebaseChildren.addFoodTrial(childId, foodData);
    }
  };

  const handleDeleteFood = async (foodId: string) => {
    try {
      await firebaseChildren.deleteFoodTrial(childId, foodId);
    } catch (error) {
      console.error('刪除食物記錄失敗:', error);
      toast.show(error instanceof Error ? error.message : '刪除失敗，請稍後再試');
    }
  };

  const handleAddTrialDate = async (foodId: string) => {
    const today = toLocalDateKey();
    const food = foodProgress[foodId];
    if (!food) return;

    // 同一天按兩次不該記成兩次嘗試。
    if (trialDatesOf(food).includes(today)) return;

    try {
      // 一天一條 leaf。整個清單重寫的話，兩位照顧者同一天各按一次，後到的那筆
      // 會連著自己手上的舊清單把對方那一天蓋掉。
      await firebaseChildren.updateFoodTrial(childId, foodId, {
        trialDates: { [today]: true },
      });
    } catch (error) {
      console.error('新增嘗試日期失敗:', error);
      toast.show(error instanceof Error ? error.message : '新增失敗，請稍後再試');
    }
  };

  const shown = viewMode === 'home' ? 'summary' : viewMode === 'my-tracking' ? 'tracking' : null;

  return (
    <>
      <AnimatePresence mode="wait">
        {shown && (
          <motion.div
            key={shown}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
          >
            {shown === 'summary' && (
              <FoodTrackingSummary stats={stats} onOpenTracking={onOpenTracking} />
            )}

            {/*
              讀取失敗時 foodTrials 是空的，直接畫追蹤頁就會說「還沒有食物記錄」，
              把「讀不到」講成「還沒記過」。
            */}
            {shown === 'tracking' &&
              (error ? (
                <div className="card">
                  <p className="text-sm text-ink-muted">讀不到食物記錄，請確認網路後重新載入</p>
                </div>
              ) : (
                <FoodTrackingView
                  activeTab={trackingTab}
                  onTabChange={onTabChange}
                  foodTrials={foodTrials}
                  stats={stats}
                  onAddFood={handleAddFood}
                  onEditFood={handleEditFood}
                  onDeleteFood={handleDeleteFood}
                  onAddTrialDate={handleAddTrialDate}
                />
              ))}
          </motion.div>
        )}
      </AnimatePresence>

      <FoodTrialModal
        isOpen={showFoodModal}
        onClose={() => {
          setShowFoodModal(false);
          setEditingFood(null);
        }}
        onSave={handleSaveFood}
        editingFood={editingFood}
      />
    </>
  );
}
