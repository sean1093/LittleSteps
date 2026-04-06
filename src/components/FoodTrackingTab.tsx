import { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { FoodTrialRecord, FoodPreference, AllergySeverity } from '../types';

interface FoodTrackingTabProps {
  foodTrials: FoodTrialRecord[];
  stats: {
    total: number;
    withAllergy: number;
    loved: number;
    disliked: number;
    noAllergy: number;
  };
  onAddFood: () => void;
  onEditFood: (food: FoodTrialRecord) => void;
  onDeleteFood: (foodId: string) => void;
  user: any; // User from firebase/auth
}

export default function FoodTrackingTab({
  foodTrials,
  stats,
  onAddFood,
  onEditFood,
  onDeleteFood,
  user,
}: FoodTrackingTabProps) {
  const [filter, setFilter] = useState<'all' | 'safe' | 'allergy'>('all');

  // 取得喜好度圖示和顏色
  const getPreferenceDisplay = (preference?: FoodPreference) => {
    switch (preference) {
      case 'love':
        return { icon: '😍', label: '超愛', color: 'text-pink-600' };
      case 'like':
        return { icon: '😊', label: '喜歡', color: 'text-green-600' };
      case 'neutral':
        return { icon: '😐', label: '普通', color: 'text-gray-600' };
      case 'dislike':
        return { icon: '😕', label: '不喜歡', color: 'text-orange-600' };
      case 'refuse':
        return { icon: '😣', label: '拒絕', color: 'text-red-600' };
      default:
        return null;
    }
  };

  // 取得過敏嚴重度顏色
  const getAllergySeverityColor = (severity: AllergySeverity) => {
    switch (severity) {
      case 'mild':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'moderate':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'severe':
        return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  // 過濾食物列表
  const filteredFoods = foodTrials.filter(food => {
    if (filter === 'safe') return !food.hasAllergy;
    if (filter === 'allergy') return food.hasAllergy;
    return true;
  });

  return (
    <div className="px-4 space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card bg-[#E8F4F8]/50 border border-[#7EC8E3]/30">
          <div className="flex items-center gap-2 mb-1">
            <Icons.Apple className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">已嘗試食物</span>
          </div>
          <div className="text-3xl font-bold text-blue-700">{stats.total}</div>
        </div>

        <div className="card bg-[#E8F5E9]/50 border border-[#81C784]/30">
          <div className="flex items-center gap-2 mb-1">
            <Icons.CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">無過敏</span>
          </div>
          <div className="text-3xl font-bold text-green-700">{stats.noAllergy}</div>
        </div>

        <div className="card bg-[#FFE5E5]/50 border border-[#FF9B9B]/30">
          <div className="flex items-center gap-2 mb-1">
            <Icons.Heart className="w-5 h-5 text-pink-600" />
            <span className="text-sm font-medium text-pink-900">喜歡</span>
          </div>
          <div className="text-3xl font-bold text-pink-700">{stats.loved}</div>
        </div>

        <div className="card bg-red-50/50 border border-red-200/30">
          <div className="flex items-center gap-2 mb-1">
            <Icons.AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-900">有過敏</span>
          </div>
          <div className="text-3xl font-bold text-red-700">{stats.withAllergy}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`
            flex-shrink-0 px-4 py-2 rounded-2xl font-medium transition-all text-sm
            ${filter === 'all'
              ? 'bg-primary text-white shadow-soft'
              : 'bg-white text-gray-600 hover:bg-gray-50'
            }
          `}
        >
          全部 ({stats.total})
        </button>
        <button
          onClick={() => setFilter('safe')}
          className={`
            flex-shrink-0 px-4 py-2 rounded-2xl font-medium transition-all text-sm
            ${filter === 'safe'
              ? 'bg-green-600 text-white shadow-soft'
              : 'bg-white text-gray-600 hover:bg-gray-50'
            }
          `}
        >
          <Icons.CheckCircle2 className="w-4 h-4 inline mr-1" />
          無過敏 ({stats.noAllergy})
        </button>
        <button
          onClick={() => setFilter('allergy')}
          className={`
            flex-shrink-0 px-4 py-2 rounded-2xl font-medium transition-all text-sm
            ${filter === 'allergy'
              ? 'bg-red-600 text-white shadow-soft'
              : 'bg-white text-gray-600 hover:bg-gray-50'
            }
          `}
        >
          <Icons.AlertTriangle className="w-4 h-4 inline mr-1" />
          有過敏 ({stats.withAllergy})
        </button>
      </div>

      {/* Add Food Button */}
      <button
        onClick={onAddFood}
        className="w-full flex items-center justify-center gap-2 p-4 rounded-full bg-[#7EC8E3] hover:bg-[#6BB8D3] text-white font-semibold shadow-soft hover:shadow-soft-lg transition-all"
      >
        <Icons.Plus className="w-5 h-5" />
        記錄新食物嘗試
      </button>

      {/* No Login Prompt */}
      {!user && foodTrials.length > 0 && (
        <div className="card bg-blue-50 border-2 border-blue-200">
          <div className="flex items-start gap-3">
            <Icons.Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm text-blue-800">
              <p className="font-medium mb-1">提示：使用 Google 登入保存資料</p>
              <p>目前使用本地儲存，登入後可跨裝置同步您的食物追蹤記錄。</p>
            </div>
          </div>
        </div>
      )}

      {/* Food Trials List */}
      {filteredFoods.length === 0 && (
        <div className="card text-center py-12">
          <Icons.Salad className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">
            {filter === 'all' ? '尚未記錄任何食物嘗試' : '無符合條件的食物記錄'}
          </p>
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="mt-3 text-primary text-sm font-medium hover:underline"
            >
              查看全部記錄
            </button>
          )}
        </div>
      )}

      <div className="space-y-3">
        {filteredFoods.map((food, index) => {
          const preferenceDisplay = getPreferenceDisplay(food.preference);
          const trialCount = food.trialDates?.length || 1;

          return (
            <motion.div
              key={food.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card hover:shadow-soft-lg transition-shadow cursor-pointer"
              onClick={() => onEditFood(food)}
            >
              <div className="flex items-start gap-3">
                {/* Food Icon/Category */}
                <div className="w-12 h-12 rounded-full bg-[#FFF3E0] flex items-center justify-center flex-shrink-0 text-2xl">
                  {food.category === '蔬菜' ? '🥬' :
                   food.category === '水果' ? '🍎' :
                   food.category === '穀類' ? '🌾' :
                   food.category === '蛋白質' ? '🍖' :
                   food.category === '豆類' ? '🫘' :
                   '🍽️'}
                </div>

                {/* Food Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-lg">{food.foodName}</h4>
                      {food.category && (
                        <p className="text-xs text-gray-500">{food.category}</p>
                      )}
                    </div>

                    {/* Allergy Badge */}
                    {food.hasAllergy && (
                      <span className="flex-shrink-0 px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                        過敏
                      </span>
                    )}
                  </div>

                  {/* Preference */}
                  {preferenceDisplay && (
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-lg">{preferenceDisplay.icon}</span>
                      <span className={`text-sm font-medium ${preferenceDisplay.color}`}>
                        {preferenceDisplay.label}
                      </span>
                    </div>
                  )}

                  {/* Trial Info */}
                  <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Icons.Calendar className="w-3 h-3" />
                      <span>首次：{food.firstTriedDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icons.RotateCw className="w-3 h-3" />
                      <span>嘗試 {trialCount} 次</span>
                    </div>
                  </div>

                  {/* Allergy Reactions */}
                  {food.hasAllergy && food.allergyReactions && food.allergyReactions.length > 0 && (
                    <div className="space-y-1">
                      {food.allergyReactions.slice(0, 2).map((reaction, idx) => (
                        <div
                          key={idx}
                          className={`text-xs px-2 py-1 rounded-lg border ${getAllergySeverityColor(reaction.severity)}`}
                        >
                          <span className="font-medium">
                            {reaction.type === 'rash' ? '紅疹' :
                             reaction.type === 'diarrhea' ? '腹瀉' :
                             reaction.type === 'vomiting' ? '嘔吐' :
                             reaction.type === 'constipation' ? '便秘' :
                             reaction.type === 'runny_nose' ? '流鼻涕' :
                             reaction.type === 'cough' ? '咳嗽' :
                             reaction.type === 'eczema' ? '濕疹' :
                             '其他'}
                          </span>
                          {reaction.severity === 'mild' ? ' (輕微)' :
                           reaction.severity === 'moderate' ? ' (中度)' :
                           ' (嚴重)'}
                        </div>
                      ))}
                      {food.allergyReactions.length > 2 && (
                        <div className="text-xs text-gray-500">
                          還有 {food.allergyReactions.length - 2} 個反應記錄...
                        </div>
                      )}
                    </div>
                  )}

                  {/* Notes Preview */}
                  {food.notes && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {food.notes}
                    </p>
                  )}
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`確定要刪除「${food.foodName}」的記錄嗎？`)) {
                      onDeleteFood(food.id);
                    }
                  }}
                  className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-red-100 flex items-center justify-center transition-colors"
                  title="刪除記錄"
                >
                  <Icons.Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
