import { useState, useEffect, useRef } from 'react';
import { Minus, Plus } from 'lucide-react';
import ModalFrame from '../../../common/components/ModalFrame';
import ChoiceChips from '../../../common/ui/ChoiceChips';
import { DailyLog, FeedingData, SleepData, DiaperData } from '../../../types';
import {
  getCurrentDateTimeLocal,
  dateTimeLocalToISO,
  isoToDateTimeLocal,
  calculateDuration,
} from '../../../common/utils/dateHelpers';
import { DAILY_LOG_NOTES_LIMIT } from '../../../common/recordLimits';
import {
  CONSISTENCIES,
  DIAPER_TYPES,
  FEEDING_SIDES,
  FEEDING_TYPES,
  getConsistencyLabel,
  getDiaperTypeLabel,
  getFeedingSideLabel,
  getFeedingTypeLabel,
  breastSideOf,
  formatTime,
} from '../../utils/logHelpers';
import { isSameDay } from '../../../common/utils/dateHelpers';

interface LogEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (logData: Omit<DailyLog, 'id'>) => Promise<void>;
  logType: 'feeding' | 'sleep' | 'diaper';
  editingLog?: DailyLog | null;
  /**
   * 這個孩子上一筆同類型的紀錄，用來預填新增表單。
   *
   * 表單原本每次都從 `breast_left` 和空白奶量開始，所以一位喝配方奶的家長
   * 一天要重打同樣的 120 八次，而且是凌晨三點單手抱著小孩打。這裡帶進來的是
   * 真的填進欄位的值，不是灰色提示：家長要看得見接下來會存進去什麼。
   */
  lastLog?: DailyLog | null;
  /**
   * 這筆紀錄是誰的。有兩個孩子的家長，凌晨換完一個再餵另一個，表單標題是唯一
   * 看得出「現在記在誰身上」的地方。沒給就維持不帶名字的標題。
   */
  childName?: string;
  /**
   * 這個孩子最近一次親餵（左、右或兩邊）。只拿來顯示「上次：左側（03:12）」，
   * 不會替家長換邊：先餵比較脹的那一側才是原則，左右輪流只是經驗法則。
   */
  lastBreastFeed?: DailyLog | null;
}

/* Repeated verbatim on eight fields below. */
const FIELD = 'w-full px-4 py-3 rounded-xl border border-ink/15 focus:border-primary-dark transition-colors';
const LABEL = 'block text-sm font-medium text-ink mb-1';

/*
  常用的數字做成一點就填的鍵。這張表一天開八次以上，多半單手，而兩個數字欄位
  每一次都叫出鍵盤、把送出鍵頂出畫面。輸入框留著：喝了 75 ml 的那一餐還是要
  記得進去。
*/
const DURATION_PRESETS = [5, 10, 15, 20, 30];
const AMOUNT_PRESETS = [60, 90, 120, 150, 180];

/** 「幾分鐘前」的快捷鍵。0 就是現在。 */
const TIME_PRESETS = [
  { label: '現在', minutesAgo: 0 },
  { label: '5 分鐘前', minutesAgo: 5 },
  { label: '15 分鐘前', minutesAgo: 15 },
  { label: '30 分鐘前', minutesAgo: 30 },
  { label: '1 小時前', minutesAgo: 60 },
];

/**
 * 填進 datetime-local 的值，不是直接拿去存的值：送出時仍然走
 * dateTimeLocalToISO → toISOString()，資料庫規則只收那個格式。
 */
function minutesAgoLocal(minutesAgo: number): string {
  return isoToDateTimeLocal(new Date(Date.now() - minutesAgo * 60_000).toISOString());
}

interface NumberPresetsProps {
  /** 這一排在填什麼，給讀螢幕軟體用。 */
  label: string;
  unit: string;
  presets: number[];
  value: string;
  onPick: (value: string) => void;
}

/*
  不用 ChoiceChips：它是單選題，自己畫一行標題，而且一定有一個被選中。這裡是
  幫輸入框代打數字的捷徑，欄位的 label 已經在上面，值也可以不在這五個裡面。

  沒有 flex-1：跟 min-w-tap 配在一起，nowrap 的字會溢出去疊到隔壁（見 CLAUDE.md）。
*/
function NumberPresets({ label, unit, presets, value, onPick }: NumberPresetsProps) {
  return (
    <div role="group" aria-label={label} className="mt-2 flex flex-wrap gap-2">
      {presets.map((preset) => {
        const picked = value === String(preset);
        return (
          <button
            key={preset}
            type="button"
            aria-pressed={picked}
            aria-label={`${preset} ${unit}`}
            onClick={() => onPick(String(preset))}
            className={`chip min-w-tap justify-center ${picked ? 'chip-on' : ''}`}
          >
            {preset}
          </button>
        );
      })}
    </div>
  );
}

function TimePresets({ onPick }: { onPick: (dateTimeLocal: string) => void }) {
  return (
    <div role="group" aria-label="快速設定時間" className="mt-2 flex flex-wrap gap-2">
      {TIME_PRESETS.map((preset) => (
        <button
          key={preset.label}
          type="button"
          onClick={() => onPick(minutesAgoLocal(preset.minutesAgo))}
          className="chip"
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}

const FORM_ID = 'log-entry-form';

/** 「上次：左側（03:12）」；不是今天的話把日期帶上，免得把昨晚的讀成剛剛。 */
function lastSideLine(log: DailyLog): string | null {
  const side = breastSideOf(log);
  if (!side) return null;
  const time = formatTime(log.timestamp);
  const date = new Date(log.timestamp);
  const when = isSameDay(date, new Date()) ? time : `${date.getMonth() + 1}/${date.getDate()} ${time}`;
  return `上次：${getFeedingSideLabel(side)}（${when}）`;
}

const RANGE_ERROR = '結束時間要晚於開始時間；睡到隔天的話，結束時間請選隔天的日期。';

export default function LogEntryModal({
  isOpen,
  onClose,
  onSave,
  logType,
  editingLog,
  lastLog,
  childName,
  lastBreastFeed,
}: LogEntryModalProps) {
  // Common fields
  const [timestamp, setTimestamp] = useState(getCurrentDateTimeLocal());

  // Feeding fields
  const [feedingType, setFeedingType] = useState<FeedingData['feedingType']>('breast_left');
  const [duration, setDuration] = useState('');
  const [amount, setAmount] = useState('');
  /** 只有擠奶用得到。空字串是「沒選邊」。 */
  const [side, setSide] = useState<'' | NonNullable<FeedingData['side']>>('');

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
  /*
    備註預設收起來。三列高的輸入框排在送出鍵前面，鍵盤一開送出鍵就在畫面外，
    而絕大多數的紀錄根本沒有備註。編輯一筆本來就有備註的紀錄時自動展開——藏
    起來的話，家長會以為它不見了。
  */
  const [notesOpen, setNotesOpen] = useState(false);
  const notesRef = useRef<HTMLTextAreaElement>(null);
  /** 只有按「加備註」展開的那一次要把游標放進去；編輯時自動展開的不搶焦點。 */
  const focusNotesOnOpen = useRef(false);

  useEffect(() => {
    if (notesOpen && focusNotesOnOpen.current) {
      focusNotesOnOpen.current = false;
      notesRef.current?.focus();
    }
  }, [notesOpen]);

  // Loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form when editing
  useEffect(() => {
    // Reset error state when modal opens/closes
    setError(null);
    setIsSubmitting(false);

    if (editingLog) {
      const existingNotes = (editingLog.data as { notes?: string }).notes;
      setNotesOpen(Boolean(existingNotes));
      // 不是 slice(0, 16)：存的是 UTC，input 讀的是本地時間。見 isoToDateTimeLocal。
      setTimestamp(isoToDateTimeLocal(editingLog.timestamp));

      if (logType === 'feeding') {
        const data = editingLog.data as FeedingData;
        setFeedingType(data.feedingType);
        setDuration(data.duration?.toString() || '');
        setAmount(data.amount?.toString() || '');
        setSide(data.side ?? '');
        setNotes(data.notes || '');
      } else if (logType === 'sleep') {
        const data = editingLog.data as SleepData;
        setStartTime(isoToDateTimeLocal(data.startTime));
        setEndTime(data.endTime ? isoToDateTimeLocal(data.endTime) : '');
        setNightWakings(data.nightWakings?.toString() ?? '');
        setNotes(data.notes || '');
      } else if (logType === 'diaper') {
        const data = editingLog.data as DiaperData;
        setDiaperType(data.type);
        setConsistency(data.consistency || 'normal');
        setNotes(data.notes || '');
      }
    } else {
      /*
        新增：時間永遠是現在，其餘沿用上一筆同類型的紀錄。備註不沿用——那是
        當下那一次的事，重複出現只會變成錯的敘述。第一次記錄的孩子沒有上一筆，
        就回到原本的預設值，不需要空狀態也不該報錯。
      */
      const lastFeeding = logType === 'feeding' ? (lastLog?.data as FeedingData | undefined) : undefined;
      const lastDiaper = logType === 'diaper' ? (lastLog?.data as DiaperData | undefined) : undefined;

      setTimestamp(getCurrentDateTimeLocal());
      setStartTime(getCurrentDateTimeLocal());
      setEndTime('');
      setNightWakings('');
      setNotes('');
      setNotesOpen(false);
      setDuration(lastFeeding?.duration?.toString() ?? '');
      setAmount(lastFeeding?.amount?.toString() ?? '');
      setFeedingType(lastFeeding?.feedingType ?? 'breast_left');
      setSide(lastFeeding?.side ?? '');
      setDiaperType(lastDiaper?.type ?? 'pee');
      setConsistency(lastDiaper?.consistency ?? 'normal');
    }
    /*
      lastLog 刻意不在相依陣列裡：它是「開啟的那一刻讀一次」，不是要追蹤的值。
      追蹤它的話，另一位照顧者存進一筆紀錄就會讓監聽器送回新的物件、effect 重跑、
      把這位家長正在打的奶量或備註洗掉——而且是無聲的。共用孩子的兩個人同時記錄
      在這個 app 裡是常態，不是邊緣情況。
    */
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

  /** 擠奶是唯一一個記「產出」而不是「攝取」的類型，表單也要看得出來。 */
  const isPumping = feedingType === 'pumping';

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
          // 哪一邊只對擠奶有意義；改成別的類型時不要留下上一次選的值。
          side: feedingType === 'pumping' && side ? side : undefined,
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
    // 擠奶不是餵奶。標題還寫著「餵奶記錄」，等於畫面自己否認了這個區別。
    const subject =
      logType === 'feeding' ? (isPumping ? '擠奶' : '餵奶') : logType === 'sleep' ? '睡眠' : '尿布';

    if (childName) {
      return editingLog ? `修改${childName}的${subject}記錄` : `幫${childName}記${subject}`;
    }
    return `${editingLog ? '編輯' : '新增'}${subject}記錄`;
  };

  // The shared frame, like every other form in the app. This sheet used to be
  // drawn by hand: no dialog role, no focus trap, no Escape, and a backdrop
  // that closed it mid-save and took the request's result with it.
  // 新增時才說：編輯一筆舊紀錄時，「上次」指的不是那一筆的上一次。
  const sideLine = !editingLog && lastBreastFeed ? lastSideLine(lastBreastFeed) : null;

  return (
    <ModalFrame
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      closeDisabled={isSubmitting}
      footer={
        <>
          {error && (
            <div role="alert" className="mb-3 bg-primary-soft border border-primary/30 rounded-2xl p-3">
              <p className="text-sm text-primary-dark">{error}</p>
            </div>
          )}
          <button
            type="submit"
            form={FORM_ID}
            disabled={isSubmitting || sleepRangeError !== null}
            className="btn-primary w-full"
          >
            {isSubmitting ? '儲存中...' : (editingLog ? '更新' : '儲存')}
          </button>
        </>
      }
    >
            <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
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
                    {/* 只在新增時：這些鍵是相對於「現在」的，按在一筆上週的紀錄上
                        會把它整筆搬到今天。 */}
                    {!editingLog && <TimePresets onPick={setTimestamp} />}
                  </div>

                  <div>
                    {sideLine && <p className="mb-2 text-sm text-ink">{sideLine}</p>}
                    <ChoiceChips
                      label="類型"
                      value={feedingType}
                      onChange={setFeedingType}
                      options={FEEDING_TYPES.map((type) => ({
                        value: type,
                        label: getFeedingTypeLabel(type),
                      }))}
                    />
                    {isPumping && (
                      <p className="mt-1 text-xs text-ink-faint">
                        擠出來的量記在這裡，不會算進寶寶今天喝了多少
                      </p>
                    )}
                  </div>

                  {isPumping && (
                    <ChoiceChips
                      label="哪一邊"
                      value={side}
                      onChange={setSide}
                      options={[
                        { value: '' as typeof side, label: '不記錄' },
                        ...FEEDING_SIDES.map((value) => ({
                          value: value as typeof side,
                          label: getFeedingSideLabel(value),
                        })),
                      ]}
                    />
                  )}

                  <div>
                    <label htmlFor="feeding-duration" className={LABEL}>時長（分鐘）</label>
                    <input
                      id="feeding-duration"
                      type="number"
                      inputMode="numeric"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className={FIELD}
                      placeholder="例如: 15"
                      min="0"
                    />
                    <NumberPresets
                      label="常用時長"
                      unit="分鐘"
                      presets={DURATION_PRESETS}
                      value={duration}
                      onPick={setDuration}
                    />
                  </div>

                  <div>
                    <label htmlFor="feeding-amount" className={LABEL}>
                      {isPumping ? '擠出量（ml）' : '奶量（ml）'}
                    </label>
                    <input
                      id="feeding-amount"
                      type="number"
                      inputMode="numeric"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className={FIELD}
                      placeholder="例如: 120"
                      min="0"
                    />
                    <NumberPresets
                      label={isPumping ? '常用擠出量' : '常用奶量'}
                      unit="ml"
                      presets={AMOUNT_PRESETS}
                      value={amount}
                      onPick={setAmount}
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
                      <p role="alert" className="bg-primary-soft border border-primary/30 rounded-2xl p-3 text-sm text-primary-dark">
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
                    {/* 只在新增時：這些鍵是相對於「現在」的，按在一筆上週的紀錄上
                        會把它整筆搬到今天。 */}
                    {!editingLog && <TimePresets onPick={setTimestamp} />}
                  </div>

                  <ChoiceChips
                    label="類型"
                    value={diaperType}
                    onChange={setDiaperType}
                    options={DIAPER_TYPES.map((type) => ({ value: type, label: getDiaperTypeLabel(type) }))}
                  />

                  {(diaperType === 'poop' || diaperType === 'both') && (
                    <ChoiceChips
                      label="便便的樣子"
                      value={consistency ?? 'normal'}
                      onChange={setConsistency}
                      options={CONSISTENCIES.map((value) => ({
                        value,
                        label: getConsistencyLabel(value),
                      }))}
                    />
                  )}
                </>
              )}

              {notesOpen ? (
                <div>
                  <label htmlFor="log-notes" className={LABEL}>備註</label>
                  <textarea
                    id="log-notes"
                    ref={notesRef}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className={`${FIELD} resize-none`}
                    rows={3}
                    placeholder="選填"
                    // 上限就是規則的上限。超過它回來的是 PERMISSION_DENIED，表單只會照印
                    // SDK 的原文，家長看不出該改什麼。
                    maxLength={DAILY_LOG_NOTES_LIMIT}
                    disabled={isSubmitting}
                  />
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      focusNotesOnOpen.current = true;
                      setNotesOpen(true);
                    }}
                    disabled={isSubmitting}
                    className="btn-ghost -ml-4 text-sm"
                  >
                    加備註
                  </button>
                </div>
              )}
            </form>
    </ModalFrame>
  );
}
