import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
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
import { ChildProfile, FoodTrialRecord } from '../types';
import { useFoodTracking } from '../hooks/useFoodTracking';
import { useFirebaseChildren } from '../hooks/useFirebaseChildren';
import FoodTrackingTab from '../components/FoodTrackingTab';
import FoodTrialModal from '../components/FoodTrialModal';
import FourByThreeTracker from '../components/FourByThreeTracker';

type ViewMode = 'overview' | 'stages' | 'menu' | 'safety' | 'tracking' | 'my-foods';

interface ComplementaryFoodPageProps {
  currentChild?: ChildProfile | null;
  user: User | null;
  familyId: string | null;
}

export default function ComplementaryFoodPage({
  currentChild,
  user,
  familyId,
}: ComplementaryFoodPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [showAllergyTest, setShowAllergyTest] = useState(false);
  const [showFingerFood, setShowFingerFood] = useState(false);
  const [expandedStage, setExpandedStage] = useState<number | null>(null);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodTrialRecord | null>(null);

  // Food tracking hook
  const childId = currentChild?.id || null;
  const {
    foodProgress,
    foodTrials,
    stats,
    addFoodTrial,
    updateFoodTrial,
    deleteFoodTrial,
  } = useFoodTracking(childId, user, familyId);

  // Firebase methods (for logged-in users)
  const firebaseChildren = useFirebaseChildren(familyId);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'danger':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getAllergyLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
      if (user && familyId) {
        // Firebase mode
        if (editingFood) {
          await firebaseChildren.updateFoodTrial(childId, editingFood.id, foodData);
        } else {
          await firebaseChildren.addFoodTrial(childId, foodData);
        }
      } else {
        // LocalStorage mode
        if (editingFood) {
          await updateFoodTrial(editingFood.id, foodData);
        } else {
          await addFoodTrial(foodData);
        }
      }
      setShowFoodModal(false);
      setEditingFood(null);
    } catch (error: any) {
      console.error('保存食物記錄失敗:', error);
      alert(error.message || '保存失敗，請稍後再試');
    }
  };

  const handleDeleteFood = async (foodId: string) => {
    if (!childId) return;

    try {
      if (user && familyId) {
        // Firebase mode
        await firebaseChildren.deleteFoodTrial(childId, foodId);
      } else {
        // LocalStorage mode
        await deleteFoodTrial(foodId);
      }
    } catch (error: any) {
      console.error('刪除食物記錄失敗:', error);
      alert(error.message || '刪除失敗，請稍後再試');
    }
  };

  const handleAddTrialDate = async (foodId: string) => {
    if (!childId) return;

    const today = new Date().toISOString().split('T')[0];
    const food = foodProgress[foodId];
    if (!food) return;

    try {
      // Update trialDates array
      const updatedTrialDates = [...(food.trialDates || []), today].sort();

      if (user && familyId) {
        // Firebase mode
        await firebaseChildren.updateFoodTrial(childId, foodId, {
          trialDates: updatedTrialDates,
        });
      } else {
        // LocalStorage mode
        await updateFoodTrial(foodId, {
          trialDates: updatedTrialDates,
        });
      }
    } catch (error: any) {
      console.error('新增嘗試日期失敗:', error);
      alert(error.message || '新增失敗，請稍後再試');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-6 relative overflow-hidden">
      {/* Soft decorative circles */}
      <div className="absolute top-10 right-5 w-48 h-48 bg-[#FFF3E0] rounded-full opacity-30 blur-3xl" />
      <div className="absolute bottom-40 left-5 w-64 h-64 bg-[#E8F5E9] rounded-full opacity-30 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 bg-[#FFF3E0]/30 px-4 py-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#FFF3E0] flex items-center justify-center">
            <Icons.UtensilsCrossed className="w-5 h-5 text-[#FF9B9B]" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">副食品指南</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          4-12個月寶寶的副食品添加完整攻略
        </p>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setShowAllergyTest(true)}
            className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-2 rounded-xl transition-colors text-sm font-medium"
          >
            <Icons.TestTube className="w-4 h-4" />
            <span>4x3 試敏法</span>
          </button>
          <button
            onClick={() => setShowFingerFood(true)}
            className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 py-2 rounded-xl transition-colors text-sm font-medium"
          >
            <Icons.Hand className="w-4 h-4" />
            <span>手指食物指南</span>
          </button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setViewMode('overview')}
            className={`
              flex-shrink-0 px-4 py-2 rounded-2xl font-medium transition-all text-sm
              ${viewMode === 'overview'
                ? 'bg-primary text-white shadow-soft'
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            總覽
          </button>
          <button
            onClick={() => setViewMode('stages')}
            className={`
              flex-shrink-0 px-4 py-2 rounded-2xl font-medium transition-all text-sm
              ${viewMode === 'stages'
                ? 'bg-primary text-white shadow-soft'
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            發展階段
          </button>
          <button
            onClick={() => setViewMode('menu')}
            className={`
              flex-shrink-0 px-4 py-2 rounded-2xl font-medium transition-all text-sm
              ${viewMode === 'menu'
                ? 'bg-primary text-white shadow-soft'
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            菜單建議
          </button>
          <button
            onClick={() => setViewMode('safety')}
            className={`
              flex-shrink-0 px-4 py-2 rounded-2xl font-medium transition-all text-sm
              ${viewMode === 'safety'
                ? 'bg-primary text-white shadow-soft'
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            安全須知
          </button>
          <button
            onClick={() => setViewMode('my-foods')}
            className={`
              flex-shrink-0 px-4 py-2 rounded-2xl font-medium transition-all text-sm
              ${viewMode === 'my-foods'
                ? 'bg-green-600 text-white shadow-soft'
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            <Icons.Apple className="w-4 h-4 inline mr-1" />
            我的食物
            {stats.total > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold ${
                viewMode === 'my-foods' ? 'bg-white text-green-600' : 'bg-green-100 text-green-700'
              }`}>
                {stats.total}
              </span>
            )}
          </button>
          <button
            onClick={() => setViewMode('tracking')}
            className={`
              flex-shrink-0 px-4 py-2 rounded-2xl font-medium transition-all text-sm
              ${viewMode === 'tracking'
                ? 'bg-purple-600 text-white shadow-soft'
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            <Icons.Calendar className="w-4 h-4 inline mr-1" />
            4×3 追蹤
          </button>
        </div>
      </div>

      {/* Overview Mode */}
      {viewMode === 'overview' && (
        <div className="px-4 space-y-6">
          {/* Principles */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Icons.Lightbulb className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-gray-800">副食品添加三大原則</h3>
            </div>
            <div className="space-y-3">
              {foodPrinciples.map((principle) => {
                const IconComponent = Icons[principle.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
                return (
                  <motion.div
                    key={principle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card"
                  >
                    <div className="flex gap-3">
                      {IconComponent && (
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{principle.title}</h4>
                        <p className="text-sm text-gray-600">{principle.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Starting Signals */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Icons.PlayCircle className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-gray-800">開始副食品的時機</h3>
            </div>
            <div className="card">
              <ul className="space-y-2">
                {startingSignals.map((signal, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-gray-700">
                    <Icons.Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feeding Methods */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Icons.Utensils className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-gray-800">常見副食品餵食法</h3>
            </div>
            <div className="space-y-2">
              {feedingMethods.map((method) => (
                <div key={method.id} className="card">
                  <h4 className="font-semibold text-gray-800 mb-1">{method.name}</h4>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Food Progression */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Icons.TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-gray-800">質地與頻率轉變</h3>
            </div>
            <div className="space-y-3">
              {foodProgression.map((progression, idx) => (
                <div key={idx} className="card bg-gradient-to-r from-secondary/5 to-transparent">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0 font-bold text-secondary">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 mb-1">{progression.ageRange}</div>
                      <div className="text-sm text-gray-600 space-y-1">
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
            <div className="flex items-center gap-2 mb-4">
              <Icons.CheckCircle2 className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-800">副食品添加基本原則</h3>
            </div>
            <div className="space-y-2">
              {feedingPrinciples.map((principle, idx) => (
                <div key={idx} className="card">
                  <h4 className="font-semibold text-gray-800 mb-1">{principle.title}</h4>
                  <p className="text-sm text-gray-600">{principle.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Food QA */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Icons.HelpCircle className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">副食品常見問答</h3>
            </div>
            <div className="space-y-3">
              {foodQA.map((qa, idx) => (
                <div key={idx} className="card bg-blue-50/50">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-start gap-2">
                    <Icons.MessageCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>{qa.question}</span>
                  </h4>
                  <p className="text-sm text-gray-700 ml-6">{qa.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stages Mode */}
      {viewMode === 'stages' && (
        <div className="px-4">
          <div className="flex items-center gap-2 mb-4">
            <Icons.Layers className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-800">副食品與奶量轉換三階段</h3>
          </div>
          <div className="space-y-3">
            {foodStages.map((stage) => {
              const isExpanded = expandedStage === stage.level;
              return (
                <motion.div
                  key={stage.level}
                  layout
                  className="card cursor-pointer"
                  onClick={() => setExpandedStage(isExpanded ? null : stage.level)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex flex-col items-center justify-center text-white font-bold flex-shrink-0">
                      <div className="text-xs opacity-90">Level</div>
                      <div className="text-2xl">{stage.level}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h4 className="font-bold text-gray-800">{stage.name}</h4>
                          <p className="text-sm text-gray-600">{stage.ageRange}</p>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Icons.ChevronDown className="w-5 h-5 text-gray-400" />
                        </motion.div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                        <div className="bg-blue-50 px-2 py-1 rounded">
                          <span className="text-blue-600">奶：</span>
                          <span className="font-medium text-blue-800">{stage.milkRatio}</span>
                        </div>
                        <div className="bg-green-50 px-2 py-1 rounded">
                          <span className="text-green-600">副食品：</span>
                          <span className="font-medium text-green-800">{stage.foodRatio}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Icons.Clock className="w-3 h-3" />
                        <span>{stage.mealsPerDay}</span>
                        <span className="mx-1">•</span>
                        <span>{stage.texture}</span>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 pt-3 border-t border-gray-100 space-y-3"
                          >
                            <div>
                              <div className="text-sm font-medium text-gray-700 mb-2">重點提示</div>
                              <ul className="space-y-1">
                                {stage.keyPoints.map((point, idx) => (
                                  <li key={idx} className="text-sm text-gray-600 flex gap-2">
                                    <Icons.Dot className="w-4 h-4 text-primary flex-shrink-0" />
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {stage.warnings && stage.warnings.length > 0 && (
                              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <Icons.AlertTriangle className="w-4 h-4 text-red-600" />
                                  <span className="text-sm font-medium text-red-800">特別注意</span>
                                </div>
                                <ul className="space-y-1">
                                  {stage.warnings.map((warning, idx) => (
                                    <li key={idx} className="text-sm text-red-700">• {warning}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Menu Mode */}
      {viewMode === 'menu' && (
        <div className="px-4 space-y-6">
          {/* Monthly Menu */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Icons.BookOpen className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-gray-800">試敏菜單與月份推薦</h3>
            </div>
            <div className="space-y-3">
              {monthlyFoodMenus.map((menu, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="card"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icons.Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{menu.month}</h4>
                      <p className="text-xs text-gray-600">重點：{menu.focus}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {menu.foods.map((food, foodIdx) => (
                      <span
                        key={foodIdx}
                        className="px-2 py-1 bg-secondary/10 text-secondary rounded-lg text-xs font-medium"
                      >
                        {food}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Vegetable Allergy Levels */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Icons.Carrot className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-800">蔬菜類過敏等級</h3>
            </div>
            <div className="space-y-3">
              {vegetableAllergyLevels.map((level) => (
                <div key={level.level} className="card">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getAllergyLevelColor(level.level)}`}>
                      {level.level === 'low' ? '低敏' : level.level === 'medium' ? '中敏' : '高敏'}
                    </span>
                    <span className="text-sm text-gray-600">{level.ageRange}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {level.foods.map((food: string, idx: number) => (
                      <span key={idx} className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded">
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
            <div className="flex items-center gap-2 mb-4">
              <Icons.Apple className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-gray-800">水果類過敏等級</h3>
            </div>
            <div className="space-y-3">
              {fruitAllergyLevels.map((level) => (
                <div key={level.level} className="card">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getAllergyLevelColor(level.level)}`}>
                      {level.level === 'low' ? '低敏' : level.level === 'medium' ? '中敏' : '高敏'}
                    </span>
                    <span className="text-sm text-gray-600">{level.ageRange}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {level.foods.map((food: string, idx: number) => (
                      <span key={idx} className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded">
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
            <div className="flex items-center gap-2 mb-4">
              <Icons.Hand className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-gray-800">手指食物推薦（7-8個月起）</h3>
            </div>
            <div className="space-y-2">
              {fingerFoodGuidelines.map((guideline) => (
                <div key={guideline.category} className="card">
                  <h4 className="font-semibold text-gray-800 mb-2">{guideline.category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {guideline.examples.map((example, idx) => (
                      <span key={idx} className="text-sm text-gray-700 bg-orange-50 px-2 py-1 rounded">
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

      {/* Safety Mode */}
      {viewMode === 'safety' && (
        <div className="px-4">
          <div className="flex items-center gap-2 mb-4">
            <Icons.Shield className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-800">專業提醒與禁忌</h3>
          </div>
          <div className="space-y-3">
            {foodWarnings.map((warning) => {
              const IconComponent = Icons[warning.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
              return (
                <motion.div
                  key={warning.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`card border-2 ${getSeverityColor(warning.severity)}`}
                >
                  <div className="flex gap-3">
                    {IconComponent && (
                      <div className="flex-shrink-0">
                        <IconComponent className="w-6 h-6" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold mb-1">{warning.title}</h4>
                      <p className="text-sm">{warning.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Infant Food Restrictions */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Icons.Ban className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-gray-800">嬰幼兒飲食禁忌</h3>
            </div>
            <div className="space-y-4">
              {infantFoodRestrictions.map((category, idx) => (
                <div key={idx}>
                  <h4 className="font-semibold text-gray-800 mb-2">{category.category}</h4>
                  <div className="space-y-2">
                    {category.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="card bg-red-50 border border-red-200">
                        <div className="flex items-start gap-2">
                          <Icons.AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-medium text-red-900">{item.food}</div>
                            <div className="text-sm text-red-700 mt-1">
                              <span className="font-medium">{item.ageLimit}</span> - {item.reason}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cooking Tips */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Icons.ChefHat className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-gray-800">烹調與保存技巧</h3>
            </div>
            <div className="space-y-4">
              {cookingTips.map((category, idx) => (
                <div key={idx}>
                  <h4 className="font-semibold text-gray-800 mb-2">{category.category}</h4>
                  <div className="space-y-2">
                    {category.tips.map((tip, tipIdx) => (
                      <div key={tipIdx} className="card bg-orange-50">
                        <h5 className="font-medium text-gray-800 mb-1">{tip.title}</h5>
                        <p className="text-sm text-gray-700">{tip.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Food Handling Tips */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Icons.Lightbulb className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-gray-800">食材特殊處理</h3>
            </div>
            <div className="space-y-4">
              {foodHandlingTips.map((category, idx) => (
                <div key={idx}>
                  <h4 className="font-semibold text-gray-800 mb-2">{category.category}</h4>
                  <div className="space-y-2">
                    {category.items.map((item, itemIdx) => (
                      <div key={itemIdx} className={`card ${item.canEat ? 'bg-green-50' : 'bg-red-50'}`}>
                        <div className="flex items-start gap-2">
                          {item.canEat ? (
                            <Icons.CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <Icons.XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{item.food}</div>
                            <p className="text-sm text-gray-700 mt-1">{item.note}</p>
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

      {/* My Foods Mode */}
      {viewMode === 'my-foods' && (
        <FoodTrackingTab
          foodTrials={foodTrials}
          stats={stats}
          onAddFood={handleAddFood}
          onEditFood={handleEditFood}
          onDeleteFood={handleDeleteFood}
          user={user}
        />
      )}

      {/* 4x3 Tracking Mode */}
      {viewMode === 'tracking' && (
        <FourByThreeTracker
          foodTrials={foodTrials}
          onAddTrialDate={handleAddTrialDate}
          onViewFood={handleEditFood}
        />
      )}

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

      {/* 4x3 Allergy Testing Modal */}
      <AnimatePresence>
        {showAllergyTest && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAllergyTest(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icons.TestTube className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-800">{allergyTestingMethod.name}</h3>
                </div>
                <button
                  onClick={() => setShowAllergyTest(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <Icons.X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
                  <p className="text-sm text-purple-800">{allergyTestingMethod.description}</p>
                </div>

                {allergyTestingMethod.steps.map((step) => (
                  <div key={step.step} className="card">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0 font-bold text-purple-700">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{step.title}</h4>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
                  <div className="flex items-start gap-2">
                    <Icons.Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <p className="text-sm text-yellow-800 font-medium">{allergyTestingMethod.principle}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Finger Food Modal */}
      <AnimatePresence>
        {showFingerFood && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFingerFood(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icons.Hand className="w-6 h-6 text-orange-600" />
                  <h3 className="text-lg font-bold text-gray-800">{fingerFoodPrinciples.title}</h3>
                </div>
                <button
                  onClick={() => setShowFingerFood(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <Icons.X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
                  <p className="text-sm text-orange-800 font-medium">適用年齡：{fingerFoodPrinciples.ageRange}</p>
                </div>

                {fingerFoodPrinciples.principles.map((principle, idx) => (
                  <div key={idx} className="card">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Icons.CheckCircle2 className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{principle.name}</h4>
                        <p className="text-sm text-gray-600">{principle.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
