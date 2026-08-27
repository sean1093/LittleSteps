import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { backdrop, sheet } from '../../../common/ui/motion';
import { DailyLog, FeedingData, SleepData, DiaperData } from '../../../types';
import { getCurrentDateTimeLocal, dateTimeLocalToISO, calculateDuration } from '../../../common/utils/dateHelpers';

interface LogEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (logData: Omit<DailyLog, 'id'>) => void;
  logType: 'feeding' | 'sleep' | 'diaper';
  editingLog?: DailyLog | null;
}

/* Repeated verbatim on eight fields below. */
const FIELD = 'w-full px-4 py-3 rounded-xl border border-ink/15 focus:border-primary-dark transition-colors';
const LABEL = 'block text-sm font-medium text-ink mb-1';

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
          <motion.div
            {...backdrop}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/*
            A bottom sheet, like every other modal in the app. This one used to be
            a centred dialog with no scroll, so on a phone with the keyboard up the
            submit button was unreachable — and it is the most-used form here.
          */}
          <motion.div
            {...sheet}
            className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-ink/10 px-4 py-3 flex items-center justify-between">
              <h2>{getTitle()}</h2>
              <button onClick={onClose} className="btn-icon" aria-label="關閉">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {logType === 'feeding' && (
                <>
                  <div>
                    <label className={LABEL}>時間 *</label>
                    <input
                      type="datetime-local"
                      value={timestamp}
                      onChange={(e) => setTimestamp(e.target.value)}
                      className={FIELD}
                      required
                    />
                  </div>

                  <div>
                    <label className={LABEL}>類型 *</label>
                    <select
                      value={feedingType}
                      onChange={(e) => setFeedingType(e.target.value as FeedingData['feedingType'])}
                      className={FIELD}
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
                    <label className={LABEL}>時長（分鐘）</label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className={FIELD}
                      placeholder="例如: 15"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className={LABEL}>奶量（ml）</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className={FIELD}
                      placeholder="例如: 120"
                      min="0"
                    />
                  </div>
                </>
              )}

              {logType === 'sleep' && (
                <>
                  <div>
                    <label className={LABEL}>開始時間 *</label>
                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className={FIELD}
                      required
                    />
                  </div>

                  <div>
                    <label className={LABEL}>結束時間</label>
                    <input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className={FIELD}
                    />
                    <p className="mt-1 text-xs text-ink-faint">不填表示還在睡</p>
                  </div>

                  {endTime && (
                    <div className="bg-secondary-light rounded-xl p-3">
                      <p className="text-sm text-secondary-dark">
                        時長：{calculateDuration(dateTimeLocalToISO(startTime), dateTimeLocalToISO(endTime))} 分鐘
                      </p>
                    </div>
                  )}
                </>
              )}

              {logType === 'diaper' && (
                <>
                  <div>
                    <label className={LABEL}>時間 *</label>
                    <input
                      type="datetime-local"
                      value={timestamp}
                      onChange={(e) => setTimestamp(e.target.value)}
                      className={FIELD}
                      required
                    />
                  </div>

                  <div>
                    <label className={LABEL}>類型 *</label>
                    <select
                      value={diaperType}
                      onChange={(e) => setDiaperType(e.target.value as DiaperData['type'])}
                      className={FIELD}
                      required
                    >
                      <option value="pee">小便</option>
                      <option value="poop">大便</option>
                      <option value="both">大小便都有</option>
                    </select>
                  </div>

                  {(diaperType === 'poop' || diaperType === 'both') && (
                    <div>
                      <label className={LABEL}>性狀</label>
                      <select
                        value={consistency}
                        onChange={(e) => setConsistency(e.target.value as DiaperData['consistency'])}
                        className={FIELD}
                      >
                        <option value="normal">正常</option>
                        <option value="soft">軟便</option>
                        <option value="hard">硬便</option>
                      </select>
                    </div>
                  )}
                </>
              )}

              <div>
                <label className={LABEL}>備註</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={`${FIELD} resize-none`}
                  rows={3}
                  placeholder="選填"
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                {isSubmitting ? '儲存中...' : (editingLog ? '更新' : '儲存')}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
