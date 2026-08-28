import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle2, ChevronDown, ChevronLeft, Hand, List, TestTube, X, XCircle } from 'lucide-react';
import { getLucideIcon } from '../../common/lucideIcons';
import { User } from 'firebase/auth';
import {
  foodStages,
  foodProgression,
  vegetableAllergyLevels,
  fruitAllergyLevels,
  monthlyFoodMenus,
  fingerFoodGuidelines,
  foodPrinciples,
  foodWarnings,
  allergyTestingMethod,
  fingerFoodPrinciples,
  feedingMethods,
  startingSignals,
  feedingPrinciples,
  cookingTips,
  foodHandlingTips,
  infantFoodRestrictions,
  foodQA
} from '../data/complementaryFood';
import { ChildProfile, FoodTrialRecord } from '../../types';
import { useFoodTracking } from '../hooks/useFoodTracking';
import { useFirebaseChildren } from '../../common/hooks/useFirebaseChildren';
import FoodTrackingTab from '../components/food/FoodTrackingTab';
import FoodTrialModal from '../components/food/FoodTrialModal';
import FourByThreeTracker from '../components/food/FourByThreeTracker';
import { toLocalDateKey } from '../../common/utils/dateHelpers';
import { stagger, listItem, fadeInUp, sheet, backdrop, collapse, tap, hoverLift } from '../../common/ui/motion';
import { pressable } from '../../common/ui/pressable';

type ViewMode = 'home' | 'my-tracking' | 'guide-overview' | 'guide-stages' | 'guide-menu' | 'guide-safety';
type TrackingTab = 'foods' | 'tracker';

interface ComplementaryFoodPageProps {
  currentChild?: ChildProfile | null;
  user: User | null;
}

const GUIDE_CARDS: { view: ViewMode; title: string; description: string }[] = [
  { view: 'guide-overview', title: '開始使用指南', description: '副食品添加原則與時機' },
  { view: 'guide-stages', title: '發展階段', description: '奶量與副食品轉換' },
  { view: 'guide-menu', title: '菜單建議', description: '月份推薦與過敏等級' },
  { view: 'guide-safety', title: '安全須知', description: '禁忌食物與注意事項' },
];

/** Same bottom sheet as the vaccine page's reference sheets. */
function Sheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <>
      <motion.div {...backdrop} onClick={onClose} className="fixed inset-0 bg-black/50 z-40" />
      <motion.div
        {...sheet}
        className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-ink/10 px-4 py-3 flex items-center justify-between gap-3">
          <h2>{title}</h2>
          <button onClick={onClose} aria-label="關閉" className="btn-icon bg-ink/5 hover:bg-ink/10">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">{children}</div>
      </motion.div>
    </>
  );
}

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

  // Food tracking hook
  const childId = currentChild?.id || null;
  const { foodProgress, foodTrials, stats } = useFoodTracking(childId, user);

  // Firebase methods (for logged-in users)
  const firebaseChildren = useFirebaseChildren(user?.uid || null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'danger':
        return 'bg-primary-light text-primary-dark';
      case 'warning':
        return 'bg-butter-light text-butter-dark';
      case 'info':
        return 'bg-secondary-light text-secondary-dark';
      default:
        return 'bg-ink/5 text-ink';
    }
  };

  const getAllergyLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-mint-light text-mint-dark';
      case 'medium':
        return 'bg-butter-light text-butter-dark';
      case 'high':
        return 'bg-primary-light text-primary-dark';
      default:
        return 'bg-ink/5 text-ink-muted';
    }
  };

  // Food Tracking Handlers
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

  return (
    <div className="screen">
      <div className="screen-body">
        <p className="text-sm text-ink-muted mb-4">
          4-12個月寶寶的副食品添加完整攻略
        </p>

        {/* Quick Actions */}
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

        {/* Back Button (for sub-pages) */}
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
            {/* Home Page */}
            {viewMode === 'home' && (
              <div className="space-y-6">
                {/* My Food Tracking Section */}
                <div className="panel bg-mint-soft">
                  <h2 className="mb-1">我的副食品追蹤</h2>
                  <p className="text-sm text-ink-muted mb-4">記錄寶寶的食物嘗試與過敏反應</p>

                  {/* Stats Preview */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-white rounded-xl p-3 text-center">
                      <div className="text-2xl font-bold text-ink">{stats.total}</div>
                      <div className="text-sm text-ink-muted mt-1">已試食物</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center">
                      <div className="text-2xl font-bold text-mint-dark">{stats.noAllergy}</div>
                      <div className="text-sm text-ink-muted mt-1">無過敏</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center">
                      <div className="text-2xl font-bold text-butter-dark">{stats.withAllergy}</div>
                      <div className="text-sm text-ink-muted mt-1">有過敏</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setTrackingTab('foods');
                        setViewMode('my-tracking');
                      }}
                      className="btn-primary w-full text-sm"
                    >
                      <List className="w-5 h-5" />
                      <span>我的食物清單</span>
                    </button>
                    <button
                      onClick={() => {
                        setTrackingTab('tracker');
                        setViewMode('my-tracking');
                      }}
                      className="btn-secondary w-full text-sm"
                    >
                      <Calendar className="w-5 h-5" />
                      <span>4×3 追蹤</span>
                    </button>
                  </div>
                </div>

                {/* Knowledge Base Section */}
                <div>
                  <h2 className="mb-3">副食品知識庫</h2>

                  <motion.div
                    className="grid grid-cols-2 gap-3"
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                  >
                    {GUIDE_CARDS.map((guide) => (
                      <motion.button
                        key={guide.view}
                        variants={listItem}
                        whileHover={hoverLift}
                        whileTap={tap}
                        onClick={() => setViewMode(guide.view)}
                        className="card-tap text-left"
                      >
                        <h3 className="mb-1">{guide.title}</h3>
                        <p className="text-sm text-ink-muted">{guide.description}</p>
                      </motion.button>
                    ))}
                  </motion.div>
                </div>
              </div>
            )}

            {/* Guide: Overview (Starting Guide) */}
            {viewMode === 'guide-overview' && (
              <div className="space-y-6">
                {/* Principles */}
                <div>
                  <h2 className="mb-3">副食品添加三大原則</h2>
                  <motion.div
                    className="space-y-3"
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                  >
                    {foodPrinciples.map((principle) => {
                      const IconComponent = getLucideIcon(principle.icon);
                      return (
                        <motion.div key={principle.id} variants={listItem} className="card">
                          <div className="flex gap-3">
                            {IconComponent && (
                              <IconComponent className="w-5 h-5 text-primary-dark shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <h3 className="mb-1">{principle.title}</h3>
                              <p className="text-sm text-ink-muted">{principle.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>

                {/* Starting Signals */}
                <div>
                  <h2 className="mb-3">開始副食品的時機</h2>
                  <div className="card">
                    <ul className="space-y-1.5 list-disc pl-5 marker:text-primary">
                      {startingSignals.map((signal, idx) => (
                        <li key={idx} className="text-sm text-ink">{signal}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Feeding Methods */}
                <div>
                  <h2 className="mb-3">常見副食品餵食法</h2>
                  <div className="space-y-2">
                    {feedingMethods.map((method) => (
                      <div key={method.id} className="card">
                        <h3 className="mb-1">{method.name}</h3>
                        <p className="text-sm text-ink-muted">{method.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Food Progression */}
                <div>
                  <h2 className="mb-3">質地與頻率轉變</h2>
                  <div className="space-y-3">
                    {foodProgression.map((progression, idx) => (
                      <div key={idx} className="card bg-butter-soft">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-xl bg-secondary-light flex items-center justify-center flex-shrink-0 font-bold text-secondary-dark">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="mb-1">{progression.ageRange}</h3>
                            <div className="text-sm text-ink-muted space-y-1">
                              <div><span className="font-medium">質地：</span>{progression.texture}</div>
                              <div><span className="font-medium">頻率：</span>{progression.frequency}</div>
                              <div><span className="font-medium">目的：</span>{progression.purpose}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feeding Principles */}
                <div>
                  <h2 className="mb-3">副食品添加基本原則</h2>
                  <div className="space-y-2">
                    {feedingPrinciples.map((principle, idx) => (
                      <div key={idx} className="card">
                        <h3 className="mb-1">{principle.title}</h3>
                        <p className="text-sm text-ink-muted">{principle.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Food QA */}
                <div>
                  <h2 className="mb-3">副食品常見問答</h2>
                  <div className="space-y-3">
                    {foodQA.map((qa, idx) => (
                      <div key={idx} className="card bg-secondary-soft">
                        <h3 className="mb-2">{qa.question}</h3>
                        <p className="text-sm text-ink">{qa.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Guide: Stages */}
            {viewMode === 'guide-stages' && (
              <div>
                <h2 className="mb-3">副食品與奶量轉換三階段</h2>
                <motion.div
                  className="space-y-3"
                  variants={stagger}
                  initial="hidden"
                  animate="visible"
                >
                  {foodStages.map((stage) => {
                    const isExpanded = expandedStage === stage.level;
                    return (
                      <motion.div
                        key={stage.level}
                        layout
                        variants={listItem}
                        className="card-tap"
                        {...pressable(() => setExpandedStage(isExpanded ? null : stage.level), isExpanded)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-16 h-16 rounded-full bg-primary-light flex flex-col items-center justify-center text-primary-dark font-bold flex-shrink-0">
                            <div className="text-xs">Level</div>
                            <div className="text-2xl leading-none">{stage.level}</div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <h3>{stage.name}</h3>
                                <p className="text-sm text-ink-muted">{stage.ageRange}</p>
                              </div>
                              <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronDown className="w-5 h-5 text-ink-faint" />
                              </motion.div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                              <div className="bg-secondary-light px-2 py-1 rounded">
                                <span className="text-secondary-dark">奶：</span>
                                <span className="font-medium text-secondary-dark">{stage.milkRatio}</span>
                              </div>
                              <div className="bg-mint-light px-2 py-1 rounded">
                                <span className="text-mint-dark">副食品：</span>
                                <span className="font-medium text-mint-dark">{stage.foodRatio}</span>
                              </div>
                            </div>

                            {/* 兩段文字在 390px 上並排會擠成兩欄，所以直接分行 */}
                            <div className="text-sm text-ink-muted space-y-0.5">
                              <div>{stage.mealsPerDay}</div>
                              <div>{stage.texture}</div>
                            </div>

                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div {...collapse} className="overflow-hidden">
                                  <div className="mt-3 pt-3 border-t border-ink/10 space-y-3">
                                    <div>
                                      <h4 className="mb-2">重點提示</h4>
                                      <ul className="space-y-1 list-disc pl-5 marker:text-primary">
                                        {stage.keyPoints.map((point, idx) => (
                                          <li key={idx} className="text-sm text-ink-muted">{point}</li>
                                        ))}
                                      </ul>
                                    </div>

                                    {stage.warnings && stage.warnings.length > 0 && (
                                      <div className="bg-primary-light rounded-xl p-3">
                                        <h4 className="text-primary-dark mb-2">特別注意</h4>
                                        <ul className="space-y-1 list-disc pl-5 marker:text-primary-dark">
                                          {stage.warnings.map((warning, idx) => (
                                            <li key={idx} className="text-sm text-ink">{warning}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            )}

            {/* Guide: Menu */}
            {viewMode === 'guide-menu' && (
              <div className="space-y-6">
                {/* Monthly Menu */}
                <div>
                  <h2 className="mb-3">試敏菜單與月份推薦</h2>
                  <motion.div
                    className="space-y-3"
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                  >
                    {monthlyFoodMenus.map((menu, idx) => (
                      <motion.div key={idx} variants={listItem} className="card">
                        <h3>{menu.month}</h3>
                        <p className="text-sm text-ink-muted mb-2">重點：{menu.focus}</p>
                        <div className="flex flex-wrap gap-2">
                          {menu.foods.map((food, foodIdx) => (
                            <span
                              key={foodIdx}
                              className="px-2 py-1 bg-secondary-light text-secondary-dark rounded-lg text-sm font-medium"
                            >
                              {food}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Vegetable Allergy Levels */}
                <div>
                  <h2 className="mb-3">蔬菜類過敏等級</h2>
                  <div className="space-y-3">
                    {vegetableAllergyLevels.map((level) => (
                      <div key={level.level} className="card">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${getAllergyLevelColor(level.level)}`}>
                            {level.level === 'low' ? '低敏' : level.level === 'medium' ? '中敏' : '高敏'}
                          </span>
                          <span className="text-sm text-ink-muted">{level.ageRange}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {level.foods.map((food: string, idx: number) => (
                            <span key={idx} className="text-sm text-ink bg-ink/5 px-2 py-1 rounded">
                              {food}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fruit Allergy Levels */}
                <div>
                  <h2 className="mb-3">水果類過敏等級</h2>
                  <div className="space-y-3">
                    {fruitAllergyLevels.map((level) => (
                      <div key={level.level} className="card">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${getAllergyLevelColor(level.level)}`}>
                            {level.level === 'low' ? '低敏' : level.level === 'medium' ? '中敏' : '高敏'}
                          </span>
                          <span className="text-sm text-ink-muted">{level.ageRange}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {level.foods.map((food: string, idx: number) => (
                            <span key={idx} className="text-sm text-ink bg-ink/5 px-2 py-1 rounded">
                              {food}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Finger Food */}
                <div>
                  <h2 className="mb-3">手指食物推薦（7-8個月起）</h2>
                  <div className="space-y-2">
                    {fingerFoodGuidelines.map((guideline) => (
                      <div key={guideline.category} className="card">
                        <h3 className="mb-2">{guideline.category}</h3>
                        <div className="flex flex-wrap gap-2">
                          {guideline.examples.map((example, idx) => (
                            <span key={idx} className="text-sm text-ink bg-butter-light px-2 py-1 rounded">
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Guide: Safety */}
            {viewMode === 'guide-safety' && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-3">專業提醒與禁忌</h2>
                  <motion.div
                    className="space-y-3"
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                  >
                    {foodWarnings.map((warning) => {
                      const IconComponent = getLucideIcon(warning.icon);
                      return (
                        <motion.div
                          key={warning.id}
                          variants={listItem}
                          className={`card ${getSeverityColor(warning.severity)}`}
                        >
                          <div className="flex gap-3">
                            {IconComponent && (
                              <IconComponent className="w-5 h-5 shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <h3 className="mb-1">{warning.title}</h3>
                              <p className="text-sm">{warning.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>

                {/* Infant Food Restrictions */}
                <div>
                  <h2 className="mb-3">嬰幼兒飲食禁忌</h2>
                  <div className="space-y-4">
                    {infantFoodRestrictions.map((category, idx) => (
                      <div key={idx}>
                        <h3 className="mb-2">{category.category}</h3>
                        <div className="space-y-2">
                          {category.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="card bg-primary-soft">
                              <h4 className="text-primary-dark">{item.food}</h4>
                              <p className="text-sm text-ink mt-1">
                                <span className="font-medium">{item.ageLimit}</span> - {item.reason}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cooking Tips */}
                <div>
                  <h2 className="mb-3">烹調與保存技巧</h2>
                  <div className="space-y-4">
                    {cookingTips.map((category, idx) => (
                      <div key={idx}>
                        <h3 className="mb-2">{category.category}</h3>
                        <div className="space-y-2">
                          {category.tips.map((tip, tipIdx) => (
                            <div key={tipIdx} className="card bg-butter-soft">
                              <h4 className="mb-1">{tip.title}</h4>
                              <p className="text-sm text-ink">{tip.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Food Handling Tips */}
                <div>
                  <h2 className="mb-3">食材特殊處理</h2>
                  <div className="space-y-4">
                    {foodHandlingTips.map((category, idx) => (
                      <div key={idx}>
                        <h3 className="mb-2">{category.category}</h3>
                        <div className="space-y-2">
                          {category.items.map((item, itemIdx) => (
                            <div
                              key={itemIdx}
                              className={`card ${item.canEat ? 'bg-mint-soft' : 'bg-primary-soft'}`}
                            >
                              <div className="flex items-start gap-2">
                                {/* 能吃／不能吃只靠這個符號區分 */}
                                {item.canEat ? (
                                  <CheckCircle2 className="w-4 h-4 text-mint-dark flex-shrink-0 mt-1" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-primary-dark flex-shrink-0 mt-1" />
                                )}
                                <div className="flex-1">
                                  <h4>{item.food}</h4>
                                  <p className="text-sm text-ink mt-1">{item.note}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* My Food Tracking (with tabs) */}
            {viewMode === 'my-tracking' && (
              <div className="space-y-4">
                {/* Tracking Tabs */}
                <div className="flex gap-2 bg-ink/5 rounded-2xl p-1">
                  <button
                    onClick={() => setTrackingTab('foods')}
                    className={`
                      flex-1 flex items-center justify-center gap-2 min-h-tap px-4 rounded-xl font-medium transition-all text-sm
                      ${trackingTab === 'foods'
                        ? 'bg-white text-ink shadow-soft'
                        : 'text-ink-muted hover:text-ink'
                      }
                    `}
                  >
                    <List className="w-4 h-4" />
                    <span>我的食物清單</span>
                    {stats.total > 0 && (
                      <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                        trackingTab === 'foods' ? 'bg-mint-light text-mint-dark' : 'bg-ink/10 text-ink-muted'
                      }`}>
                        {stats.total}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setTrackingTab('tracker')}
                    className={`
                      flex-1 flex items-center justify-center gap-2 min-h-tap px-4 rounded-xl font-medium transition-all text-sm
                      ${trackingTab === 'tracker'
                        ? 'bg-white text-ink shadow-soft'
                        : 'text-ink-muted hover:text-ink'
                      }
                    `}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>4×3 追蹤</span>
                  </button>
                </div>

                {/* Tab Content */}
                {trackingTab === 'foods' && (
                  <FoodTrackingTab
                    foodTrials={foodTrials}
                    stats={stats}
                    onAddFood={handleAddFood}
                    onEditFood={handleEditFood}
                    onDeleteFood={handleDeleteFood}
                    user={user}
                  />
                )}

                {trackingTab === 'tracker' && (
                  <FourByThreeTracker
                    foodTrials={foodTrials}
                    onAddTrialDate={handleAddTrialDate}
                    onViewFood={handleEditFood}
                  />
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Food Trial Modal */}
      <FoodTrialModal
        isOpen={showFoodModal}
        onClose={() => {
          setShowFoodModal(false);
          setEditingFood(null);
        }}
        onSave={handleSaveFood}
        editingFood={editingFood}
      />

      {/* 4x3 Allergy Testing Sheet */}
      <AnimatePresence>
        {showAllergyTest && (
          <Sheet title={allergyTestingMethod.name} onClose={() => setShowAllergyTest(false)}>
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
          </Sheet>
        )}
      </AnimatePresence>

      {/* Finger Food Sheet */}
      <AnimatePresence>
        {showFingerFood && (
          <Sheet title={fingerFoodPrinciples.title} onClose={() => setShowFingerFood(false)}>
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
          </Sheet>
        )}
      </AnimatePresence>
    </div>
  );
}
