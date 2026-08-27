import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { backdrop, sheet } from '../../../common/ui/motion';
import { FoodTrialRecord, AllergyReaction, AllergyReactionType, AllergySeverity, FoodPreference } from '../../../types';
import { toLocalDateKey } from '../../../common/utils/dateHelpers';

interface FoodTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (foodData: Omit<FoodTrialRecord, 'id' | 'createdAt'>) => void;
  editingFood?: FoodTrialRecord | null;
}

/* Same recipe as the other two modals; every field here had its own border. */
const FIELD = 'w-full px-4 py-3 rounded-xl border border-ink/15 focus:border-primary-dark transition-colors';
const LABEL = 'block text-sm font-medium text-ink mb-2';

const PREFERENCES: { value: FoodPreference; label: string }[] = [
  { value: 'love', label: '超愛' },
  { value: 'like', label: '喜歡' },
  { value: 'neutral', label: '普通' },
  { value: 'dislike', label: '不喜歡' },
  { value: 'refuse', label: '拒絕' },
];

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
      setFirstTriedDate(toLocalDateKey());
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
    const today = toLocalDateKey();
    if (!trialDates.includes(today)) {
      setTrialDates([...trialDates, today].sort());
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            {...backdrop}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          <motion.div
            {...sheet}
            className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-ink/10 px-4 py-3 flex items-center justify-between">
              <h2>{editingFood ? '編輯食物記錄' : '記錄新食物嘗試'}</h2>
              <button onClick={onClose} className="btn-icon" aria-label="關閉">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-4 space-y-4">
              <div>
                <label className={LABEL}>
                  食物名稱 <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="例如：高麗菜、香蕉、地瓜"
                  className={FIELD}
                />
              </div>

              <div>
                <label className={LABEL}>食物分類</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={FIELD}
                >
                  <option value="">選擇分類（選填）</option>
                  <option value="蔬菜">蔬菜</option>
                  <option value="水果">水果</option>
                  <option value="穀類">穀類</option>
                  <option value="蛋白質">蛋白質</option>
                  <option value="豆類">豆類</option>
                  <option value="奶製品">奶製品</option>
                  <option value="其他">其他</option>
                </select>
              </div>

              <div>
                <label className={LABEL}>
                  首次嘗試日期 <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  value={firstTriedDate}
                  onChange={(e) => setFirstTriedDate(e.target.value)}
                  className={FIELD}
                />
              </div>

              {/*
                This was a row of five emoji faces. The preference itself is a real
                choice, so the glyphs became labels — and chips wrap instead of
                squeezing five cells into a 360px row.
              */}
              <div>
                <label className={LABEL}>寶寶喜好度</label>
                <div className="flex flex-wrap gap-2">
                  {PREFERENCES.map((pref) => (
                    <button
                      key={pref.value}
                      type="button"
                      aria-pressed={preference === pref.value}
                      onClick={() => setPreference(pref.value)}
                      className={`chip ${preference === pref.value ? 'chip-on' : ''}`}
                    >
                      {pref.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Has Allergy Toggle */}
              <div className="card bg-warm-white flex items-center justify-between">
                <span className="font-medium">有過敏反應</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={hasAllergy}
                  aria-label="有過敏反應"
                  onClick={() => setHasAllergy(!hasAllergy)}
                  className="h-tap flex items-center shrink-0"
                >
                  <span
                    className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                      hasAllergy ? 'bg-red-600' : 'bg-ink/25'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                        hasAllergy ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </span>
                </button>
              </div>

              {/* Allergy Reactions */}
              {hasAllergy && (
                <div className="space-y-3">
                  <label className={LABEL}>過敏反應記錄</label>

                  {allergyReactions.map((reaction, index) => (
                    <div key={index} className="card bg-red-50 border border-red-200">
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
                          className="btn-icon -my-2.5 text-red-600 hover:bg-red-100"
                          aria-label="移除這筆過敏反應"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add New Reaction */}
                  <div className="card bg-butter-soft border border-butter/40">
                    <div className="text-sm font-medium mb-3">新增過敏反應</div>

                    <div className="space-y-3">
                      <select
                        value={newReactionType}
                        onChange={(e) => setNewReactionType(e.target.value as AllergyReactionType)}
                        className={FIELD}
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
                        className={FIELD}
                      >
                        <option value="mild">輕微</option>
                        <option value="moderate">中度</option>
                        <option value="severe">嚴重</option>
                      </select>

                      <input
                        type="date"
                        value={newReactionDate}
                        onChange={(e) => setNewReactionDate(e.target.value)}
                        className={FIELD}
                      />

                      <textarea
                        value={newReactionDescription}
                        onChange={(e) => setNewReactionDescription(e.target.value)}
                        placeholder="補充說明（選填）"
                        rows={2}
                        className={`${FIELD} resize-none`}
                      />

                      <button
                        type="button"
                        onClick={addAllergyReaction}
                        className="btn-secondary w-full"
                      >
                        <Plus className="w-4 h-4" />
                        新增反應記錄
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Trial Dates (4x3 Rule Tracking) */}
              <div>
                <label className={LABEL}>嘗試日期記錄（4x3 法則）</label>
                <div className="card bg-secondary-soft border border-secondary/40">
                  <p className="text-sm text-ink-muted mb-2">
                    已記錄 {trialDates.length} 次嘗試
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {trialDates.map((date, index) => (
                      <span key={index} className="tag bg-secondary-light text-secondary-dark">
                        {date}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addTrialDate}
                    className="btn-secondary w-full"
                  >
                    <Plus className="w-4 h-4" />
                    記錄今天嘗試
                  </button>
                </div>
              </div>

              <div>
                <label className={LABEL}>備註</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="記錄任何額外資訊..."
                  rows={3}
                  className={`${FIELD} resize-none`}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button onClick={onClose} className="btn-secondary flex-1">
                  取消
                </button>
                <button onClick={handleSave} className="btn-primary flex-1">
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
