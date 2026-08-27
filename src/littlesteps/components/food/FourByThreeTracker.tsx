import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import EmptyState from '../../../common/ui/EmptyState';
import { SERVICE_THEME } from '../../../common/ui/serviceTheme';
import { listItem, stagger } from '../../../common/ui/motion';
import { FoodTrialRecord } from '../../../types';
import { toLocalDateKey } from '../../../common/utils/dateHelpers';

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

    return toLocalDateKey(nextTrial);
  };

  /**
   * 檢查是否可以嘗試（距離上次 >= 3 天）
   */
  const canTryNow = (food: FoodTrialRecord): boolean => {
    const nextDate = getNextTrialDate(food);
    if (!nextDate) return true;

    const today = toLocalDateKey();
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
    <div className="space-y-4">
      {/* What the 4×3 rule is */}
      <div className="card bg-secondary-soft">
        <h4 className="mb-1">4×3 試敏法則</h4>
        <p className="text-sm text-ink-muted leading-relaxed">
          每種新食物需連續嘗試 <strong>4 天</strong>，每次間隔 <strong>3 天</strong>，觀察是否有過敏反應。
        </p>
      </div>

      <div className="flex items-center justify-between">
        <h3>追蹤中的食物</h3>
        <span className="text-sm text-ink-muted">{activeFoods.length} 項</span>
      </div>

      {activeFoods.length === 0 && (
        <EmptyState
          theme={SERVICE_THEME.littlesteps}
          title="目前沒有正在追蹤的食物"
          description="新增食物記錄後會在這裡顯示追蹤進度"
        />
      )}

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {sortedFoods.map((food) => {
          const canTry = canTryNow(food);
          const daysUntil = getDaysUntilNext(food);
          const progress = getTrialProgress(food);
          const progressPercent = (progress.current / progress.total) * 100;

          return (
            <motion.div
              key={food.id}
              variants={listItem}
              className={`card-tap border ${canTry ? 'bg-mint-light/50 border-mint' : 'border-ink/10'}`}
              onClick={() => onViewFood(food)}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <h4>{food.foodName}</h4>
                  {food.category && (
                    <p className="text-xs text-ink-faint">{food.category}</p>
                  )}
                </div>

                {canTry ? (
                  <span className="tag shrink-0 bg-mint-dark text-white">可嘗試</span>
                ) : (
                  <span className="tag shrink-0 bg-ink/10 text-ink-muted">
                    {daysUntil} 天後
                  </span>
                )}
              </div>

              {/* Progress */}
              <div className="mb-2">
                <div className="flex items-center justify-between text-xs text-ink-muted mb-1">
                  <span>進度：{progress.current} / {progress.total} 次</span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <div className="h-2 bg-ink/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={`h-full rounded-full ${canTry ? 'bg-mint' : 'bg-secondary'}`}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-2">
                {(food.trialDates || []).map((date, idx) => (
                  <span key={idx} className="tag bg-secondary-light text-secondary-dark">
                    Day {idx + 1}: {date}
                  </span>
                ))}
              </div>

              {!canTry && (
                <p className="text-xs text-ink-muted">下次嘗試：{getNextTrialDate(food)}</p>
              )}

              {canTry && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddTrialDate(food.id);
                  }}
                  className="btn-primary w-full mt-2"
                >
                  <Plus className="w-4 h-4" />
                  記錄今天嘗試
                </button>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {foodTrials.length > activeFoods.length && (
        <p className="card bg-warm-white text-sm text-ink-muted">
          {foodTrials.length - activeFoods.length} 種食物已完成 4×3 試敏追蹤
        </p>
      )}
    </div>
  );
}
