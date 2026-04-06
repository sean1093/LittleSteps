import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { FoodTrialRecord } from '../types';

interface FourByThreeTrackerProps {
  foodTrials: FoodTrialRecord[];
  onAddTrialDate: (foodId: string) => void;
  onViewFood: (food: FoodTrialRecord) => void;
}

export default function FourByThreeTracker({
  foodTrials,
  onAddTrialDate,
  onViewFood,
}: FourByThreeTrackerProps) {
  /**
   * 計算下次可嘗試日期
   */
  const getNextTrialDate = (food: FoodTrialRecord): string | null => {
    const trialDates = food.trialDates || [];
    if (trialDates.length === 0) return null;

    const lastTrialDate = trialDates[trialDates.length - 1];
    const lastTrial = new Date(lastTrialDate);
    const nextTrial = new Date(lastTrial);
    nextTrial.setDate(nextTrial.getDate() + 3);

    return nextTrial.toISOString().split('T')[0];
  };

  /**
   * 檢查是否可以嘗試（距離上次 >= 3 天）
   */
  const canTryNow = (food: FoodTrialRecord): boolean => {
    const nextDate = getNextTrialDate(food);
    if (!nextDate) return true;

    const today = new Date().toISOString().split('T')[0];
    return today >= nextDate;
  };

  /**
   * 計算距離下次嘗試還有幾天
   */
  const getDaysUntilNext = (food: FoodTrialRecord): number => {
    const nextDate = getNextTrialDate(food);
    if (!nextDate) return 0;

    const today = new Date();
    const next = new Date(nextDate);
    const diffTime = next.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  };

  /**
   * 取得嘗試進度（第幾次/建議4次）
   */
  const getTrialProgress = (food: FoodTrialRecord): { current: number; total: number } => {
    const trialDates = food.trialDates || [];
    return {
      current: trialDates.length,
      total: 4, // 4x3 法則建議嘗試 4 次
    };
  };

  // 過濾出正在追蹤的食物（嘗試次數 < 4 次）
  const activeFoods = foodTrials.filter(food => {
    const progress = getTrialProgress(food);
    return progress.current < progress.total;
  });

  // 依可嘗試狀態排序（可嘗試的排前面）
  const sortedFoods = [...activeFoods].sort((a, b) => {
    const aCanTry = canTryNow(a);
    const bCanTry = canTryNow(b);
    if (aCanTry && !bCanTry) return -1;
    if (!aCanTry && bCanTry) return 1;
    return getDaysUntilNext(a) - getDaysUntilNext(b);
  });

  return (
    <div className="px-4 space-y-4">
      {/* Info Card */}
      <div className="card bg-purple-50/50 border border-purple-200/30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center flex-shrink-0">
            <Icons.Info className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-purple-900 mb-1">4×3 試敏法則</h4>
            <p className="text-sm text-purple-800 leading-relaxed">
              每種新食物需連續嘗試 <strong>4 天</strong>，每次間隔 <strong>3 天</strong>，觀察是否有過敏反應。
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">追蹤中的食物</h3>
        <span className="text-sm text-gray-600">{activeFoods.length} 項</span>
      </div>

      {/* No Active Tracking */}
      {activeFoods.length === 0 && (
        <div className="card text-center py-12">
          <Icons.CheckCircle2 className="w-16 h-16 text-green-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">目前沒有正在追蹤的食物</p>
          <p className="text-gray-400 text-xs mt-1">新增食物記錄後會在這裡顯示追蹤進度</p>
        </div>
      )}

      {/* Active Foods List */}
      <div className="space-y-3">
        {sortedFoods.map((food, index) => {
          const canTry = canTryNow(food);
          const daysUntil = getDaysUntilNext(food);
          const progress = getTrialProgress(food);
          const progressPercent = (progress.current / progress.total) * 100;

          return (
            <motion.div
              key={food.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                card cursor-pointer transition-all
                ${canTry
                  ? 'bg-[#E8F5E9]/50 border-2 border-[#81C784]/30 shadow-soft'
                  : 'bg-white border border-gray-200'
                }
              `}
              onClick={() => onViewFood(food)}
            >
              <div className="flex items-start gap-3">
                {/* Food Icon */}
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl
                  ${canTry ? 'bg-green-200' : 'bg-gray-100'}
                `}>
                  {food.category === '蔬菜' ? '🥬' :
                   food.category === '水果' ? '🍎' :
                   food.category === '穀類' ? '🌾' :
                   food.category === '蛋白質' ? '🍖' :
                   food.category === '豆類' ? '🫘' :
                   '🍽️'}
                </div>

                {/* Food Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{food.foodName}</h4>
                      {food.category && (
                        <p className="text-xs text-gray-500">{food.category}</p>
                      )}
                    </div>

                    {/* Status Badge */}
                    {canTry ? (
                      <span className="flex-shrink-0 px-2 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
                        可嘗試
                      </span>
                    ) : (
                      <span className="flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                        {daysUntil} 天後
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>進度：{progress.current} / {progress.total} 次</span>
                      <span>{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`h-full rounded-full ${
                          canTry ? 'bg-green-500' : 'bg-purple-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Trial Dates */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {(food.trialDates || []).map((date, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs"
                      >
                        Day {idx + 1}: {date}
                      </span>
                    ))}
                  </div>

                  {/* Next Trial Info */}
                  {!canTry && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Icons.Clock className="w-3 h-3" />
                      <span>下次嘗試：{getNextTrialDate(food)}</span>
                    </div>
                  )}

                  {/* Action Button */}
                  {canTry && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddTrialDate(food.id);
                      }}
                      className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
                    >
                      <Icons.Plus className="w-4 h-4" />
                      記錄今天嘗試
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Completed Foods Summary */}
      {foodTrials.length > activeFoods.length && (
        <div className="card bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Icons.CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>
              {foodTrials.length - activeFoods.length} 種食物已完成 4×3 試敏追蹤
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
