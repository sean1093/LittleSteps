import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, X } from 'lucide-react';
import { backdrop, sheet, tap } from '../../../common/ui/motion';
import { GrowthRecord } from '../../../types';
import { toLocalDateKey } from '../../../common/utils/dateHelpers';
import { useToast } from '../../../common/ui/toast';

interface AddGrowthRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (record: Omit<GrowthRecord, 'id'>) => Promise<void>;
  childId: string;
}

/* Same recipe as `LogEntryModal`; the four fields below were each styled apart. */
const FIELD = 'w-full px-4 py-3 rounded-xl border border-ink/15 focus:border-primary-dark transition-colors';
const LABEL = 'block text-sm font-semibold text-ink mb-2';

export default function AddGrowthRecordModal({
  isOpen,
  onClose,
  onAdd,
  childId,
}: AddGrowthRecordModalProps) {
  const toast = useToast();
  const [date, setDate] = useState(toLocalDateKey());
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [headCircumference, setHeadCircumference] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!weight && !height && !headCircumference) {
      toast.show('請至少輸入一項測量數據');
      return;
    }

    setSaving(true);
    try {
      await onAdd({
        childId,
        date,
        weight: weight ? parseFloat(weight) : undefined,
        height: height ? parseFloat(height) : undefined,
        headCircumference: headCircumference ? parseFloat(headCircumference) : undefined,
        percentile: {}, // Will be calculated by the hook
        notes: notes || undefined,
      });

      // Reset form
      setDate(toLocalDateKey());
      setWeight('');
      setHeight('');
      setHeadCircumference('');
      setNotes('');
      onClose();
    } catch (error) {
      console.error('Failed to add record:', error);
      toast.show((error as Error).message || '新增失敗，請檢查輸入資料');
    } finally {
      setSaving(false);
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
            <div className="sticky top-0 bg-white border-b border-ink/10 flex items-center justify-between px-4 py-3 rounded-t-3xl">
              <h2>新增成長記錄</h2>
              <button onClick={onClose} className="btn-icon" aria-label="關閉">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-5">
              <div>
                <label className={LABEL}>測量日期</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={toLocalDateKey()}
                  required
                  className={FIELD}
                />
              </div>

              <div>
                <label className={LABEL}>體重 (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="50"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="例如: 8.5"
                  className={FIELD}
                />
              </div>

              <div>
                <label className={LABEL}>身高 (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="150"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="例如: 72.5"
                  className={FIELD}
                />
              </div>

              <div>
                <label className={LABEL}>頭圍 (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="70"
                  value={headCircumference}
                  onChange={(e) => setHeadCircumference(e.target.value)}
                  placeholder="例如: 43.5"
                  className={FIELD}
                />
              </div>

              <div>
                <label className={LABEL}>備註 (選填)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="例如: 在家量測"
                  rows={3}
                  className={`${FIELD} resize-none`}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <motion.button
                  type="button"
                  whileTap={tap}
                  onClick={onClose}
                  className="btn-secondary flex-1"
                >
                  取消
                </motion.button>
                <motion.button
                  type="submit"
                  whileTap={tap}
                  disabled={saving}
                  className="btn-primary flex-1"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>儲存中...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>儲存</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
