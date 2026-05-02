import { motion } from 'framer-motion';
import { Apple, AlertCircle, Heart, TrendingUp, ArrowRight } from 'lucide-react';

interface FoodStats {
  total: number;
  noAllergy: number;
  withAllergy: number;
  loved: number;
  disliked: number;
}

interface FoodTrackingSummaryCardProps {
  stats: FoodStats;
  onNavigate: () => void;
}

export default function FoodTrackingSummaryCard({
  stats,
  onNavigate,
}: FoodTrackingSummaryCardProps) {
  const safeRate = stats.total > 0
    ? Math.round((stats.noAllergy / stats.total) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.08)' }}
      className="bg-white rounded-3xl p-6 shadow-soft cursor-pointer"
      onClick={onNavigate}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
            <Apple className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">副食品追蹤</h3>
            <p className="text-xs text-gray-500">食物嘗試與過敏紀錄</p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.total}</div>
          <div className="text-xs text-gray-600 mt-1">已試食物</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.noAllergy}</div>
          <div className="text-xs text-gray-600 mt-1">無過敏</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.withAllergy}</div>
          <div className="text-xs text-gray-600 mt-1">有過敏</div>
        </div>
      </div>

      {/* Highlights */}
      <div className="space-y-2">
        {/* Safe Rate */}
        {stats.total > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>安全率</span>
            </div>
            <div className="font-bold text-green-600">{safeRate}%</div>
          </div>
        )}

        {/* Loved Foods */}
        {stats.loved > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Heart className="w-4 h-4 text-pink-500" />
              <span>喜歡的食物</span>
            </div>
            <div className="font-bold text-pink-600">{stats.loved} 種</div>
          </div>
        )}

        {/* Allergy Alert */}
        {stats.withAllergy > 0 && (
          <div className="flex items-center gap-2 text-sm bg-orange-50 rounded-xl px-3 py-2">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <span className="text-orange-800 font-medium">
              {stats.withAllergy} 種食物有過敏反應
            </span>
          </div>
        )}

        {/* Empty State */}
        {stats.total === 0 && (
          <div className="text-center py-2 text-sm text-gray-500">
            尚未記錄任何食物
          </div>
        )}
      </div>
    </motion.div>
  );
}
