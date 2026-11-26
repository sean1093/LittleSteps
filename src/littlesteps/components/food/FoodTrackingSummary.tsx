import { Calendar, List } from 'lucide-react';
import type { FoodStats } from '../../hooks/useFoodTracking';
import type { TrackingTab } from './types';

interface FoodTrackingSummaryProps {
  stats: FoodStats;
  onOpenTracking: (tab: TrackingTab) => void;
}

/** 主頁上的追蹤概況：三個數字，加上通往兩個追蹤分頁的入口。 */
export default function FoodTrackingSummary({ stats, onOpenTracking }: FoodTrackingSummaryProps) {
  return (
    <div className="panel bg-mint-soft mb-6">
      <h2 className="mb-1">我的副食品追蹤</h2>
      <p className="text-sm text-ink-muted mb-4">記錄寶寶的食物嘗試與過敏反應</p>

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

      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => onOpenTracking('foods')} className="btn-primary w-full text-sm">
          <List className="w-5 h-5" />
          <span>我的食物清單</span>
        </button>
        <button onClick={() => onOpenTracking('tracker')} className="btn-secondary w-full text-sm">
          <Calendar className="w-5 h-5" />
          <span>試新食材</span>
        </button>
      </div>
    </div>
  );
}
