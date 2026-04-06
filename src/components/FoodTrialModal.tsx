import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { FoodTrialRecord, AllergyReaction, AllergyReactionType, AllergySeverity, FoodPreference } from '../types';

interface FoodTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (foodData: Omit<FoodTrialRecord, 'id' | 'createdAt'>) => void;
  editingFood?: FoodTrialRecord | null;
}

export default function FoodTrialModal({
  isOpen,
  onClose,
  onSave,
  editingFood,
}: FoodTrialModalProps) {
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState('');
  const [firstTriedDate, setFirstTriedDate] = useState('');
  const [hasAllergy, setHasAllergy] = useState(false);
  const [allergyReactions, setAllergyReactions] = useState<AllergyReaction[]>([]);
  const [preference, setPreference] = useState<FoodPreference | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [trialDates, setTrialDates] = useState<string[]>([]);

  // New allergy reaction form
  const [newReactionType, setNewReactionType] = useState<AllergyReactionType>('rash');
  const [newReactionSeverity, setNewReactionSeverity] = useState<AllergySeverity>('mild');
  const [newReactionDescription, setNewReactionDescription] = useState('');
  const [newReactionDate, setNewReactionDate] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (editingFood) {
      setFoodName(editingFood.foodName);
      setCategory(editingFood.category || '');
      setFirstTriedDate(editingFood.firstTriedDate);
      setHasAllergy(editingFood.hasAllergy);
      setAllergyReactions(editingFood.allergyReactions || []);
      setPreference(editingFood.preference);
      setNotes(editingFood.notes || '');
      setTrialDates(editingFood.trialDates || []);
    } else {
      // Reset form for new entry
      setFoodName('');
      setCategory('');
      setFirstTriedDate(new Date().toISOString().split('T')[0]);
      setHasAllergy(false);
      setAllergyReactions([]);
      setPreference(undefined);
      setNotes('');
      setTrialDates([]);
    }
  }, [editingFood, isOpen]);

  const handleSave = () => {
    if (!foodName.trim()) {
      alert('請輸入食物名稱');
      return;
    }

    if (!firstTriedDate) {
      alert('請選擇首次嘗試日期');
      return;
    }

    const foodData: Omit<FoodTrialRecord, 'id' | 'createdAt'> = {
      foodName: foodName.trim(),
      category: category.trim() || undefined,
      firstTriedDate,
      trialDates: trialDates.length > 0 ? trialDates : [firstTriedDate],
      hasAllergy,
      allergyReactions: hasAllergy ? allergyReactions : undefined,
      preference,
      notes: notes.trim() || undefined,
      updatedAt: editingFood ? new Date().toISOString() : undefined,
    };

    onSave(foodData);
    onClose();
  };

  const addAllergyReaction = () => {
    if (!newReactionDate) {
      alert('請選擇過敏反應日期');
      return;
    }

    const newReaction: AllergyReaction = {
      type: newReactionType,
      severity: newReactionSeverity,
      description: newReactionDescription.trim() || undefined,
      date: newReactionDate,
    };

    setAllergyReactions([...allergyReactions, newReaction]);

    // Reset form
    setNewReactionType('rash');
    setNewReactionSeverity('mild');
    setNewReactionDescription('');
    setNewReactionDate('');
  };

  const removeAllergyReaction = (index: number) => {
    setAllergyReactions(allergyReactions.filter((_, i) => i !== index));
  };

  const addTrialDate = () => {
    const today = new Date().toISOString().split('T')[0];
    if (!trialDates.includes(today)) {
      setTrialDates([...trialDates, today].sort());
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icons.Apple className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-bold text-gray-800">
                  {editingFood ? '編輯食物記錄' : '記錄新食物嘗試'}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <Icons.X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Form */}
            <div className="p-4 space-y-4">
              {/* Food Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  食物名稱 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="例如：高麗菜、香蕉、地瓜"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-0 transition-colors"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  食物分類
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-0 transition-colors"
                >
                  <option value="">選擇分類（選填）</option>
                  <option value="蔬菜">🥬 蔬菜</option>
                  <option value="水果">🍎 水果</option>
                  <option value="穀類">🌾 穀類</option>
                  <option value="蛋白質">🍖 蛋白質</option>
                  <option value="豆類">🫘 豆類</option>
                  <option value="奶製品">🥛 奶製品</option>
                  <option value="其他">🍽️ 其他</option>
                </select>
              </div>

              {/* First Tried Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  首次嘗試日期 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={firstTriedDate}
                  onChange={(e) => setFirstTriedDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-0 transition-colors"
                />
              </div>

              {/* Preference */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  寶寶喜好度
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { value: 'love', emoji: '😍', label: '超愛' },
                    { value: 'like', emoji: '😊', label: '喜歡' },
                    { value: 'neutral', emoji: '😐', label: '普通' },
                    { value: 'dislike', emoji: '😕', label: '不喜歡' },
                    { value: 'refuse', emoji: '😣', label: '拒絕' },
                  ].map((pref) => (
                    <button
                      key={pref.value}
                      type="button"
                      onClick={() => setPreference(pref.value as FoodPreference)}
                      className={`
                        p-3 rounded-xl border-2 transition-all
                        ${preference === pref.value
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="text-2xl mb-1">{pref.emoji}</div>
                      <div className="text-xs font-medium text-gray-700">{pref.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Has Allergy Toggle */}
              <div className="card bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icons.AlertTriangle className={`w-5 h-5 ${hasAllergy ? 'text-red-600' : 'text-gray-400'}`} />
                    <span className="font-medium text-gray-800">有過敏反應</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHasAllergy(!hasAllergy)}
                    className={`
                      w-12 h-6 rounded-full transition-colors
                      ${hasAllergy ? 'bg-red-500' : 'bg-gray-300'}
                    `}
                  >
                    <div
                      className={`
                        w-5 h-5 bg-white rounded-full shadow-sm transition-transform
                        ${hasAllergy ? 'translate-x-6' : 'translate-x-0.5'}
                      `}
                    />
                  </button>
                </div>
              </div>

              {/* Allergy Reactions */}
              {hasAllergy && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    過敏反應記錄
                  </label>

                  {/* Existing Reactions */}
                  {allergyReactions.map((reaction, index) => (
                    <div key={index} className="card bg-red-50 border-2 border-red-200">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="font-medium text-red-900 mb-1">
                            {reaction.type === 'rash' ? '紅疹' :
                             reaction.type === 'diarrhea' ? '腹瀉' :
                             reaction.type === 'vomiting' ? '嘔吐' :
                             reaction.type === 'constipation' ? '便秘' :
                             reaction.type === 'runny_nose' ? '流鼻涕' :
                             reaction.type === 'cough' ? '咳嗽' :
                             reaction.type === 'eczema' ? '濕疹' :
                             '其他'}
                            {' - '}
                            {reaction.severity === 'mild' ? '輕微' :
                             reaction.severity === 'moderate' ? '中度' :
                             '嚴重'}
                          </div>
                          <div className="text-sm text-red-700">{reaction.date}</div>
                          {reaction.description && (
                            <p className="text-sm text-red-800 mt-1">{reaction.description}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAllergyReaction(index)}
                          className="flex-shrink-0 w-7 h-7 rounded-full hover:bg-red-200 flex items-center justify-center transition-colors"
                        >
                          <Icons.X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add New Reaction */}
                  <div className="card bg-yellow-50 border border-yellow-200">
                    <div className="text-sm font-medium text-gray-700 mb-3">新增過敏反應</div>

                    <div className="space-y-3">
                      <select
                        value={newReactionType}
                        onChange={(e) => setNewReactionType(e.target.value as AllergyReactionType)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                      >
                        <option value="rash">紅疹</option>
                        <option value="diarrhea">腹瀉</option>
                        <option value="vomiting">嘔吐</option>
                        <option value="constipation">便秘</option>
                        <option value="runny_nose">流鼻涕</option>
                        <option value="cough">咳嗽</option>
                        <option value="eczema">濕疹</option>
                        <option value="other">其他</option>
                      </select>

                      <select
                        value={newReactionSeverity}
                        onChange={(e) => setNewReactionSeverity(e.target.value as AllergySeverity)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                      >
                        <option value="mild">輕微</option>
                        <option value="moderate">中度</option>
                        <option value="severe">嚴重</option>
                      </select>

                      <input
                        type="date"
                        value={newReactionDate}
                        onChange={(e) => setNewReactionDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                      />

                      <textarea
                        value={newReactionDescription}
                        onChange={(e) => setNewReactionDescription(e.target.value)}
                        placeholder="補充說明（選填）"
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                      />

                      <button
                        type="button"
                        onClick={addAllergyReaction}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                      >
                        <Icons.Plus className="w-4 h-4" />
                        新增反應記錄
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Trial Dates (4x3 Rule Tracking) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  嘗試日期記錄（4x3 法則）
                </label>
                <div className="card bg-purple-50 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Icons.Calendar className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-purple-800">已記錄 {trialDates.length} 次嘗試</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {trialDates.map((date, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                        {date}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addTrialDate}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 transition-colors"
                  >
                    <Icons.Plus className="w-4 h-4" />
                    記錄今天嘗試
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  備註
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="記錄任何額外資訊..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-0 transition-colors resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-6 rounded-2xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-soft hover:shadow-soft-lg transition-all"
                >
                  {editingFood ? '更新' : '儲存'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
