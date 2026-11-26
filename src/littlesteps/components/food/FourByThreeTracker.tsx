import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import EmptyState from '../../../common/ui/EmptyState';
import { SERVICE_THEME } from '../../../common/ui/serviceTheme';
import { listItem, stagger } from '../../../common/ui/motion';
import { pressable } from '../../../common/ui/pressable';
import { FoodTrialRecord } from '../../../types';
import { formatDate, toLocalDateKey } from '../../../common/utils/dateHelpers';
import { allergyTestingMethod } from '../../data/complementaryFood';
import { trialDatesOf } from '../../utils/foodTrialDates';

interface FourByThreeTrackerProps {
  foodTrials: FoodTrialRecord[];
  onAddTrialDate: (foodId: string) => void;
  onViewFood: (food: FoodTrialRecord) => void;
}

/*
  元件還叫 FourByThree，是因為它原本實作「4x3 試敏法」：一種食材 9 天。指南已經
  改成 AAP 的說法——每 3 到 5 天試一種新食材（complementaryFood.ts 的
  allergyTestingMethod）——檔名與元件名沒有跟著改，只為了不讓一次內容修正牽動一串
  import。

  天數一律讀資料檔的 observeDays，不在這裡自己乘：上一版用「階段數 × 3」算總天數，
  指南一改步驟，這裡印出來的天數就和同一頁的說明對不上。

  觀察滿下限（3 天）沒有反應就算試完，但不把家長擋在第 3 天：還在連續記的那幾天
  卡片留著，照樣可以記第 4、第 5 天。舊制下記了 7、8 天的紀錄也走同一條路——天數
  照實算、每一天都列出來，只是不再說「還差幾天」。
*/
const { min: MIN_DAYS, max: MAX_DAYS } = allergyTestingMethod.observeDays;
const [FIRST_STEP, LATER_STEP] = allergyTestingMethod.steps;

export default function FourByThreeTracker({
  foodTrials,
  onAddTrialDate,
  onViewFood,
}: FourByThreeTrackerProps) {
  const now = new Date();
  const today = toLocalDateKey(now);
  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(now.getDate() - 1);
  const yesterday = toLocalDateKey(yesterdayDate);

  // 嘗試日期在資料庫裡有兩種形狀（見 StoredTrialDates），一律先整理成日期清單。
  const datesOf = new Map(foodTrials.map((food) => [food.id, trialDatesOf(food)]));
  const dates = (food: FoodTrialRecord) => datesOf.get(food.id) ?? [];

  const observed = (food: FoodTrialRecord) => dates(food).length >= MIN_DAYS;
  // 昨天或今天還有記，代表這一輪還在進行。
  const stillGoing = (food: FoodTrialRecord) =>
    dates(food).includes(today) || dates(food).includes(yesterday);

  // 追蹤中的食物：還沒觀察滿下限的，加上已經滿了但這兩天還在記的。
  const activeFoods = foodTrials.filter((food) => !observed(food) || stillGoing(food));
  const doneCount = foodTrials.length - activeFoods.length;

  // 今天還沒記的排前面（一天只記一次），其餘維持原本的順序。
  const sortedFoods = [...activeFoods].sort(
    (a, b) => Number(dates(a).includes(today)) - Number(dates(b).includes(today)),
  );

  return (
    <div className="space-y-4">
      {/* What the method is */}
      <div className="card bg-secondary-soft">
        <h4 className="mb-1">{allergyTestingMethod.name}</h4>
        <p className="text-sm text-ink-muted leading-relaxed">
          同一種新食物觀察 <strong>{MIN_DAYS} 到 {MAX_DAYS} 天</strong>：
          {allergyTestingMethod.steps.map((step) => step.title).join('、')}。這段期間不要再加入其他新食材。
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
          const trialDates = dates(food);
          const dayCount = trialDates.length;
          const isObserved = dayCount >= MIN_DAYS;
          // 記過反應的食材，指南說的是先暫停、回診問醫師；這裡不能再請家長「記錄今天嘗試」，
          // 也不能說它可以換下一種了。
          const paused = food.hasAllergy;
          const canTry = !paused && !trialDates.includes(today);
          const progressPercent = Math.min(dayCount / MIN_DAYS, 1) * 100;
          const step = dayCount === 0 ? FIRST_STEP : LATER_STEP;

          return (
            <motion.div
              key={food.id}
              variants={listItem}
              className={`card-tap border ${canTry ? 'bg-mint-light/50 border-mint' : 'border-ink/10'}`}
              {...pressable(() => onViewFood(food))}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <h4>{food.foodName}</h4>
                  {food.category && (
                    <p className="text-xs text-ink-faint">{food.category}</p>
                  )}
                </div>

                {paused ? (
                  <span className="tag shrink-0 bg-butter-light text-butter-dark">有反應記錄</span>
                ) : canTry ? (
                  <span className="tag shrink-0 bg-mint-dark text-white">可記錄</span>
                ) : (
                  <span className="tag shrink-0 bg-ink/10 text-ink-muted">今天已記錄</span>
                )}
              </div>

              {/* Progress */}
              <div className="mb-2">
                {paused ? (
                  <p className="text-sm text-ink-muted mb-1">
                    已記錄 {dayCount} 天。先暫停這種食材，回診時問醫師
                  </p>
                ) : isObserved ? (
                  <p className="text-sm text-mint-dark font-medium mb-1">
                    已觀察 {dayCount} 天，沒有反應就可以試下一種
                  </p>
                ) : (
                  <div className="flex items-center justify-between text-xs text-ink-muted mb-1">
                    <span>進度：{dayCount} / {MIN_DAYS} 天</span>
                    <span>{step.title}</span>
                  </div>
                )}
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
                {trialDates.map((date, idx) => (
                  <span key={date} className="tag bg-secondary-light text-secondary-dark">
                    第 {idx + 1} 天：{formatDate(date)}
                  </span>
                ))}
              </div>

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

      {doneCount > 0 && (
        <p className="card bg-warm-white text-sm text-ink-muted">
          {doneCount} 種食物已觀察滿 {MIN_DAYS} 天
        </p>
      )}
    </div>
  );
}
