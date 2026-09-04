import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X } from 'lucide-react';
import { backdrop, sheet } from '../../../common/ui/motion';
import { DailyLog, FeedingData, SleepData, DiaperData } from '../../../types';
import { getCurrentDateTimeLocal, dateTimeLocalToISO, calculateDuration } from '../../../common/utils/dateHelpers';

interface LogEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (logData: Omit<DailyLog, 'id'>) => Promise<void>;
  logType: 'feeding' | 'sleep' | 'diaper';
  editingLog?: DailyLog | null;
}

/* Repeated verbatim on eight fields below. */
const FIELD = 'w-full px-4 py-3 rounded-xl border border-ink/15 focus:border-primary-dark transition-colors';
const LABEL = 'block text-sm font-medium text-ink mb-1';

const RANGE_ERROR = '結束時間要晚於開始時間；睡到隔天的話，結束時間請選隔天的日期。';

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
  /** 空字串是「沒問到」，'0' 是「家長說沒醒」——兩者存進去的值不一樣。 */
  const [nightWakings, setNightWakings] = useState('');

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
        setNightWakings(data.nightWakings?.toString() ?? '');
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
      setNightWakings('');
      setDuration('');
      setAmount('');
      setNotes('');
      setFeedingType('breast_left');
      setDiaperType('pee');
      setConsistency('normal');
    }
  }, [editingLog, logType, isOpen]);

  /*
    兩個欄位都是 datetime-local，各自帶日期，所以「22:30 睡到隔天 06:00」算出來
    本來就是正的 450 分鐘，不需要特別處理。真正會出事的是把結束時間選在開始
    時間之前：calculateDuration 會存進一個負數，列表印成「0分鐘」，但睡眠平均、
    報告與建議全部被它往下拉，而且沒有任何地方看得出來。
  */
  const startMs = new Date(startTime).getTime();
  const endMs = endTime ? new Date(endTime).getTime() : NaN;
  const hasSleepRange = logType === 'sleep' && !Number.isNaN(startMs) && !Number.isNaN(endMs);
  const sleepRangeError = hasSleepRange && endMs <= startMs ? RANGE_ERROR : null;

  /** 從留白按下去就是 0：那是家長主動說「沒醒」，跟沒問到不一樣。 */
  const stepNightWakings = (delta: number) => {
    const current = parseInt(nightWakings, 10);
    setNightWakings(String(Math.max(0, (Number.isNaN(current) ? 0 : current) + delta)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sleepRangeError) return; // 訊息已經即時顯示在結束時間下方
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
        const parsedWakings = parseInt(nightWakings, 10);
        const sleepData: SleepData = {
          startTime: dateTimeLocalToISO(startTime),
          endTime: endTime ? dateTimeLocalToISO(endTime) : undefined,
          // 留白就是沒問到，不能存成 0：夜醒趨勢與睡眠分數都得分得出這兩件事。
          nightWakings: Number.isNaN(parsedWakings) ? undefined : Math.max(0, parsedWakings),
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

      // 寫入成功才關；失敗時留在原地，家長剛打完的東西還在。
      await onSave(logData);
      onClose();
    } catch (err) {
      console.error('保存失敗:', err);
      setError(err instanceof Error ? err.message : '保存失敗，請稍後再試');
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
                    <label htmlFor="feeding-time" className={LABEL}>時間 *</label>
                    <input
                      id="feeding-time"
                      type="datetime-local"
                      value={timestamp}
                      onChange={(e) => setTimestamp(e.target.value)}
                      className={FIELD}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="feeding-type" className={LABEL}>類型 *</label>
                    <select
                      id="feeding-type"
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
                    <label htmlFor="feeding-duration" className={LABEL}>時長（分鐘）</label>
                    <input
                      id="feeding-duration"
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className={FIELD}
                      placeholder="例如: 15"
                      min="0"
                    />
                  </div>

                  <div>
                    <label htmlFor="feeding-amount" className={LABEL}>奶量（ml）</label>
                    <input
                      id="feeding-amount"
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
                    <label htmlFor="sleep-start" className={LABEL}>開始時間 *</label>
                    <input
                      id="sleep-start"
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className={FIELD}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="sleep-end" className={LABEL}>結束時間</label>
                    <input
                      id="sleep-end"
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className={FIELD}
                    />
                    <p className="mt-1 text-xs text-ink-faint">不填表示還在睡</p>
                  </div>

                  {hasSleepRange && (
                    sleepRangeError ? (
                      <p role="alert" className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-800">
                        {sleepRangeError}
                      </p>
                    ) : (
                      <div className="bg-secondary-light rounded-xl p-3">
                        <p className="text-sm text-secondary-dark">
                          時長：{calculateDuration(dateTimeLocalToISO(startTime), dateTimeLocalToISO(endTime))} 分鐘
                        </p>
                      </div>
                    )
                  )}

                  {/*
                    夜醒次數問在這裡，因為關掉一段睡眠就是想起這件事的那一刻。
                    在這之前，週報有一張夜醒趨勢卡，但全 app 沒有任何地方寫得進
                    這個欄位——那張卡永遠說「持平」。
                  */}
                  <div>
                    <label htmlFor="sleep-night-wakings" className={LABEL}>夜醒次數</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => stepNightWakings(-1)}
                        className="btn-icon"
                        aria-label="減少夜醒次數"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <input
                        id="sleep-night-wakings"
                        type="number"
                        inputMode="numeric"
                        value={nightWakings}
                        onChange={(e) => setNightWakings(e.target.value)}
                        className={`${FIELD} text-center`}
                        placeholder="未記錄"
                        min="0"
                      />
                      <button
                        type="button"
                        onClick={() => stepNightWakings(1)}
                        className="btn-icon"
                        aria-label="增加夜醒次數"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-ink-faint">留白表示沒記，和記 0 次不一樣</p>
                  </div>
                </>
              )}

              {logType === 'diaper' && (
                <>
                  <div>
                    <label htmlFor="diaper-time" className={LABEL}>時間 *</label>
                    <input
                      id="diaper-time"
                      type="datetime-local"
                      value={timestamp}
                      onChange={(e) => setTimestamp(e.target.value)}
                      className={FIELD}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="diaper-type" className={LABEL}>類型 *</label>
                    <select
                      id="diaper-type"
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
                      <label htmlFor="diaper-consistency" className={LABEL}>性狀</label>
                      <select
                        id="diaper-consistency"
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
                <label htmlFor="log-notes" className={LABEL}>備註</label>
                <textarea
                  id="log-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={`${FIELD} resize-none`}
                  rows={3}
                  placeholder="選填"
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <div role="alert" className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || sleepRangeError !== null}
                className="btn-primary w-full"
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
