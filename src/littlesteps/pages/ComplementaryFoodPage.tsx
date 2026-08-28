import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Hand, TestTube } from 'lucide-react';
import { User } from 'firebase/auth';
import { allergyTestingMethod, fingerFoodPrinciples } from '../data/complementaryFood';
import { ChildProfile, FoodTrialRecord } from '../../types';
import { useFoodTracking } from '../hooks/useFoodTracking';
import { useFirebaseChildren } from '../../common/hooks/useFirebaseChildren';
import FoodTrialModal from '../components/food/FoodTrialModal';
import FoodSheet from '../components/food/FoodSheet';
import FoodHomeView from '../components/food/FoodHomeView';
import FoodGuideOverview from '../components/food/FoodGuideOverview';
import FoodGuideStages from '../components/food/FoodGuideStages';
import FoodGuideMenu from '../components/food/FoodGuideMenu';
import FoodGuideSafety from '../components/food/FoodGuideSafety';
import FoodTrackingView from '../components/food/FoodTrackingView';
import type { TrackingTab, ViewMode } from '../components/food/types';
import { toLocalDateKey } from '../../common/utils/dateHelpers';
import { fadeInUp } from '../../common/ui/motion';

interface ComplementaryFoodPageProps {
  currentChild?: ChildProfile | null;
  user: User | null;
}

/**
 * 副食品指南。
 *
 * 這一頁自己不畫任何內容，只做三件事：管六個檢視的狀態、把食物紀錄的
 * 增刪改接到 Firebase、決定現在要渲染哪一個檢視。每個檢視各自一個檔案。
 */
export default function ComplementaryFoodPage({
  currentChild,
  user,
}: ComplementaryFoodPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [trackingTab, setTrackingTab] = useState<TrackingTab>('foods');
  const [showAllergyTest, setShowAllergyTest] = useState(false);
  const [showFingerFood, setShowFingerFood] = useState(false);
  const [expandedStage, setExpandedStage] = useState<number | null>(null);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodTrialRecord | null>(null);

  const childId = currentChild?.id || null;
  const { foodProgress, foodTrials, stats } = useFoodTracking(childId, user);
  const firebaseChildren = useFirebaseChildren(user?.uid || null);

  const handleAddFood = () => {
    setEditingFood(null);
    setShowFoodModal(true);
  };

  const handleEditFood = (food: FoodTrialRecord) => {
    setEditingFood(food);
    setShowFoodModal(true);
  };

  const handleSaveFood = async (foodData: Omit<FoodTrialRecord, 'id' | 'createdAt'>) => {
    if (!childId) {
      alert('請先選擇寶寶');
      return;
    }

    try {
      if (editingFood) {
        await firebaseChildren.updateFoodTrial(childId, editingFood.id, foodData);
      } else {
        await firebaseChildren.addFoodTrial(childId, foodData);
      }
      setShowFoodModal(false);
      setEditingFood(null);
    } catch (error) {
      console.error('保存食物記錄失敗:', error);
      alert(error instanceof Error ? error.message : '保存失敗，請稍後再試');
    }
  };

  const handleDeleteFood = async (foodId: string) => {
    if (!childId) return;

    try {
      await firebaseChildren.deleteFoodTrial(childId, foodId);
    } catch (error) {
      console.error('刪除食物記錄失敗:', error);
      alert(error instanceof Error ? error.message : '刪除失敗，請稍後再試');
    }
  };

  const handleAddTrialDate = async (foodId: string) => {
    if (!childId) return;

    const today = toLocalDateKey();
    const food = foodProgress[foodId];
    if (!food) return;

    try {
      const updatedTrialDates = [...(food.trialDates || []), today].sort();
      await firebaseChildren.updateFoodTrial(childId, foodId, {
        trialDates: updatedTrialDates,
      });
    } catch (error) {
      console.error('新增嘗試日期失敗:', error);
      alert(error instanceof Error ? error.message : '新增失敗，請稍後再試');
    }
  };

  const openTracking = (tab: TrackingTab) => {
    setTrackingTab(tab);
    setViewMode('my-tracking');
  };

  return (
    <div className="screen">
      <div className="screen-body">
        <p className="text-sm text-ink-muted mb-4">
          4-12個月寶寶的副食品添加完整攻略
        </p>

        <div className="grid grid-cols-2 gap-2 mb-6">
          <button onClick={() => setShowAllergyTest(true)} className="btn-secondary w-full text-sm">
            <TestTube className="w-4 h-4" />
            <span>4x3 試敏法</span>
          </button>
          <button onClick={() => setShowFingerFood(true)} className="btn-secondary w-full text-sm">
            <Hand className="w-4 h-4" />
            <span>手指食物指南</span>
          </button>
        </div>

        {viewMode !== 'home' && (
          <button onClick={() => setViewMode('home')} className="btn-ghost -ml-4 mb-2">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">返回主頁</span>
          </button>
        )}

        {/* viewMode 是這一頁的主要導航（六個檢視），原本硬切換，
            其他小 modal 卻都有動畫。 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
          >
            {viewMode === 'home' && (
              <FoodHomeView
                stats={stats}
                onOpenTracking={openTracking}
                onOpenGuide={setViewMode}
              />
            )}

            {viewMode === 'guide-overview' && <FoodGuideOverview />}

            {viewMode === 'guide-stages' && (
              <FoodGuideStages expandedStage={expandedStage} onToggleStage={setExpandedStage} />
            )}

            {viewMode === 'guide-menu' && <FoodGuideMenu />}

            {viewMode === 'guide-safety' && <FoodGuideSafety />}

            {viewMode === 'my-tracking' && (
              <FoodTrackingView
                activeTab={trackingTab}
                onTabChange={setTrackingTab}
                foodTrials={foodTrials}
                stats={stats}
                onAddFood={handleAddFood}
                onEditFood={handleEditFood}
                onDeleteFood={handleDeleteFood}
                onAddTrialDate={handleAddTrialDate}
                user={user}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <FoodTrialModal
        isOpen={showFoodModal}
        onClose={() => {
          setShowFoodModal(false);
          setEditingFood(null);
        }}
        onSave={handleSaveFood}
        editingFood={editingFood}
      />

      <AnimatePresence>
        {showAllergyTest && (
          <FoodSheet title={allergyTestingMethod.name} onClose={() => setShowAllergyTest(false)}>
            <div className="bg-secondary-soft rounded-2xl p-4">
              <p className="text-sm text-ink">{allergyTestingMethod.description}</p>
            </div>

            {allergyTestingMethod.steps.map((step) => (
              <div key={step.step} className="card">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary-light flex items-center justify-center flex-shrink-0 font-bold text-secondary-dark">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1">{step.title}</h3>
                    <p className="text-sm text-ink-muted">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-butter-light rounded-2xl p-4">
              <p className="text-sm text-butter-dark font-medium">{allergyTestingMethod.principle}</p>
            </div>
          </FoodSheet>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFingerFood && (
          <FoodSheet title={fingerFoodPrinciples.title} onClose={() => setShowFingerFood(false)}>
            <div className="bg-butter-light rounded-2xl p-4">
              <p className="text-sm text-butter-dark font-medium">
                適用年齡：{fingerFoodPrinciples.ageRange}
              </p>
            </div>

            {fingerFoodPrinciples.principles.map((principle, idx) => (
              <div key={idx} className="card">
                <h3 className="mb-1">{principle.name}</h3>
                <p className="text-sm text-ink-muted">{principle.description}</p>
              </div>
            ))}
          </FoodSheet>
        )}
      </AnimatePresence>
    </div>
  );
}
