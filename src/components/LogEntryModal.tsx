import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { DailyLog, FeedingData, SleepData, DiaperData } from '../types';
import { getCurrentDateTimeLocal, dateTimeLocalToISO, calculateDuration } from '../utils/dateHelpers';

interface LogEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (logData: Omit<DailyLog, 'id'>) => void;
  logType: 'feeding' | 'sleep' | 'diaper';
  editingLog?: DailyLog | null;
}

export default function LogEntryModal({
  isOpen,
  onClose,
  onSave,
  logType,
  editingLog,
}: LogEntryModalProps) {
  // Common fields
  const [timestamp, setTimestamp] = useState(getCurrentDateTimeLocal());

  // Feeding fields
  const [feedingType, setFeedingType] = useState<FeedingData['feedingType']>('breast_left');
  const [duration, setDuration] = useState('');
  const [amount, setAmount] = useState('');

  // Sleep fields
  const [startTime, setStartTime] = useState(getCurrentDateTimeLocal());
  const [endTime, setEndTime] = useState('');

  // Diaper fields
  const [diaperType, setDiaperType] = useState<DiaperData['type']>('pee');
  const [consistency, setConsistency] = useState<DiaperData['consistency']>('normal');

  // Common
  const [notes, setNotes] = useState('');

  // Loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form when editing
  useEffect(() => {
    // Reset error state when modal opens/closes
    setError(null);
    setIsSubmitting(false);

    if (editingLog) {
      setTimestamp(editingLog.timestamp.slice(0, 16)); // Convert ISO to datetime-local format

      if (logType === 'feeding') {
        const data = editingLog.data as FeedingData;
        setFeedingType(data.feedingType);
        setDuration(data.duration?.toString() || '');
        setAmount(data.amount?.toString() || '');
        setNotes(data.notes || '');
      } else if (logType === 'sleep') {
        const data = editingLog.data as SleepData;
        setStartTime(data.startTime.slice(0, 16));
        setEndTime(data.endTime?.slice(0, 16) || '');
        setNotes(data.notes || '');
      } else if (logType === 'diaper') {
        const data = editingLog.data as DiaperData;
        setDiaperType(data.type);
        setConsistency(data.consistency || 'normal');
        setNotes(data.notes || '');
      }
    } else {
      // Reset form for new entry
      setTimestamp(getCurrentDateTimeLocal());
      setStartTime(getCurrentDateTimeLocal());
      setEndTime('');
      setDuration('');
      setAmount('');
      setNotes('');
      setFeedingType('breast_left');
      setDiaperType('pee');
      setConsistency('normal');
    }
  }, [editingLog, logType, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let data: FeedingData | SleepData | DiaperData;
      let finalTimestamp: string;

      if (logType === 'feeding') {
        finalTimestamp = dateTimeLocalToISO(timestamp);
        data = {
          feedingType,
          duration: duration ? parseInt(duration) : undefined,
          amount: amount ? parseInt(amount) : undefined,
          notes: notes.trim() || undefined,
        } as FeedingData;
      } else if (logType === 'sleep') {
        finalTimestamp = dateTimeLocalToISO(startTime);
        const sleepData: SleepData = {
          startTime: dateTimeLocalToISO(startTime),
          endTime: endTime ? dateTimeLocalToISO(endTime) : undefined,
          notes: notes.trim() || undefined,
        };
        // Calculate duration if endTime is provided
        if (endTime) {
          sleepData.duration = calculateDuration(sleepData.startTime, sleepData.endTime!);
        }
        data = sleepData;
      } else {
        finalTimestamp = dateTimeLocalToISO(timestamp);
        data = {
          type: diaperType,
          consistency: (diaperType === 'poop' || diaperType === 'both') ? consistency : undefined,
          notes: notes.trim() || undefined,
        } as DiaperData;
      }

      const logData: Omit<DailyLog, 'id'> = {
        childId: '', // Will be set by parent component
        type: logType,
        timestamp: finalTimestamp,
        data,
        createdAt: editingLog?.createdAt || new Date().toISOString(),
        updatedAt: editingLog ? new Date().toISOString() : undefined,
      };

      await onSave(logData);
      onClose();
    } catch (err: any) {
      console.error('保存失敗:', err);
      setError(err.message || '保存失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const getTitle = () => {
    const prefix = editingLog ? '編輯' : '新增';
    switch (logType) {
      case 'feeding':
        return `${prefix}餵奶記錄`;
      case 'sleep':
        return `${prefix}睡眠記錄`;
      case 'diaper':
        return `${prefix}尿布記錄`;
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
            className="fixed inset-0 bg-black/40 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: '-50%', x: '-50%' }}
            animate={{ opacity: 1, y: '-50%', x: '-50%' }}
            exit={{ opacity: 0, y: '-50%', x: '-50%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 w-11/12 max-w-md bg-white rounded-3xl shadow-xl z-50 p-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{getTitle()}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Feeding Form */}
              {logType === 'feeding' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      時間 *
                    </label>
                    <input
                      type="datetime-local"
                      value={timestamp}
                      onChange={(e) => setTimestamp(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-primary focus:border-primary transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      類型 *
                    </label>
                    <select
                      value={feedingType}
                      onChange={(e) => setFeedingType(e.target.value as FeedingData['feedingType'])}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-primary focus:border-primary transition-colors"
                      required
                    >
                      <option value="breast_left">母乳左側</option>
                      <option value="breast_right">母乳右側</option>
                      <option value="breast_both">母乳雙側</option>
                      <option value="formula">配方奶</option>
                      <option value="solid">副食品</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      時長（分鐘）
                    </label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="例如: 15"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      奶量（ml）
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="例如: 120"
                      min="0"
                    />
                  </div>
                </>
              )}

              {/* Sleep Form */}
              {logType === 'sleep' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      開始時間 *
                    </label>
                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-primary focus:border-primary transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      結束時間
                    </label>
                    <input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-primary focus:border-primary transition-colors"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      不填表示還在睡
                    </p>
                  </div>

                  {endTime && (
                    <div className="bg-blue-50 rounded-xl p-3">
                      <p className="text-sm text-blue-800">
                        時長：{calculateDuration(dateTimeLocalToISO(startTime), dateTimeLocalToISO(endTime))} 分鐘
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Diaper Form */}
              {logType === 'diaper' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      時間 *
                    </label>
                    <input
                      type="datetime-local"
                      value={timestamp}
                      onChange={(e) => setTimestamp(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-primary focus:border-primary transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      類型 *
                    </label>
                    <select
                      value={diaperType}
                      onChange={(e) => setDiaperType(e.target.value as DiaperData['type'])}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-primary focus:border-primary transition-colors"
                      required
                    >
                      <option value="pee">小便</option>
                      <option value="poop">大便</option>
                      <option value="both">大小便都有</option>
                    </select>
                  </div>

                  {(diaperType === 'poop' || diaperType === 'both') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        性狀
                      </label>
                      <select
                        value={consistency}
                        onChange={(e) => setConsistency(e.target.value as DiaperData['consistency'])}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-primary focus:border-primary transition-colors"
                      >
                        <option value="normal">正常</option>
                        <option value="soft">軟便</option>
                        <option value="hard">硬便</option>
                      </select>
                    </div>
                  )}
                </>
              )}

              {/* Common Notes Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  備註
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-primary focus:border-primary transition-colors resize-none"
                  rows={3}
                  placeholder="選填"
                  disabled={isSubmitting}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl shadow-soft hover:shadow-soft-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '儲存中...' : (editingLog ? '更新' : '儲存')}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
