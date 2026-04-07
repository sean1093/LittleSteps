import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Weight, Ruler, CircleDot, Calendar } from 'lucide-react';
import { GrowthRecord } from '../types';

interface AddGrowthRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (record: Omit<GrowthRecord, 'id'>) => Promise<void>;
  childId: string;
}

export default function AddGrowthRecordModal({
  isOpen,
  onClose,
  onAdd,
  childId,
}: AddGrowthRecordModalProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [headCircumference, setHeadCircumference] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!weight && !height && !headCircumference) {
      alert('請至少輸入一項測量數據');
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
      setDate(new Date().toISOString().split('T')[0]);
      setWeight('');
      setHeight('');
      setHeadCircumference('');
      setNotes('');
      onClose();
    } catch (error) {
      console.error('Failed to add record:', error);
      alert((error as Error).message || '新增失敗，請檢查輸入資料');
    } finally {
      setSaving(false);
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

          {/* Modal - Slide up from bottom */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 flex items-center justify-between p-6 rounded-t-3xl">
              <h2 className="text-2xl font-bold text-gray-800">新增成長記錄</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  測量日期
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Weight className="w-4 h-4 text-blue-600" />
                  體重 (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="50"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="例如: 8.5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Height */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Ruler className="w-4 h-4 text-green-600" />
                  身高 (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="150"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="例如: 72.5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                />
              </div>

              {/* Head Circumference */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <CircleDot className="w-4 h-4 text-purple-600" />
                  頭圍 (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="70"
                  value={headCircumference}
                  onChange={(e) => setHeadCircumference(e.target.value)}
                  placeholder="例如: 43.5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  備註 (選填)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="例如: 在家量測"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  取消
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-[#7EC8E3] hover:bg-[#6BB8D3] text-white font-semibold rounded-full shadow-soft hover:shadow-soft-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
