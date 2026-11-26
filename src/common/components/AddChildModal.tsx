import { useState, useEffect } from 'react';
import { ChildProfile, Gender } from '../../types';
import { GESTATIONAL_AGE_RANGE, type GestationalAge } from '../correctedAge';
import { CHILD_NAME_LIMIT } from '../recordLimits';
import ModalFrame from './ModalFrame';
import { ChildJoinError } from '../childJoinError';
import { toLocalDateKey } from '../utils/dateHelpers';

export type ChildModalMode = 'create' | 'join' | 'pregnancy';

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  /**
   * 回傳 promise 時，視窗會等它成功才關閉。寫入失敗的話輸入留在原地——
   * 家長不必重打一次名字與生日。
   */
  onSave: (
    name: string,
    birthday: string,
    gender?: Gender,
    isPregnancy?: boolean,
    dueDate?: string,
    gestationalAge?: GestationalAge,
  ) => void | Promise<void>;
  onJoin?: (uuid: string) => void | Promise<void>; // New: join existing child
  editingChild?: ChildProfile | null;
  /** 只在編輯既有寶寶時提供。刪除從側邊欄那一列搬進來，避開誤觸。 */
  onDelete?: () => void;
  /**
   * 這個入口提供哪些分頁，順序即顯示順序。
   *
   * 每個服務自己開自己需要的：LittleBloom 只要建孕期檔案，LittleSteps 與
   * LittleExplorer 要建寶寶或加入既有寶寶。共用的是帳號與孩子資料，不是
   * 彼此的畫面——孕期檔案原本只能從 LittleSteps 的側邊欄新增，等於要先進
   * 別的服務才能開始用 LittleBloom。
   */
  modes?: readonly ChildModalMode[];
  /**
   * 打開時停在哪一個分頁；省略就是 `modes` 的第一個。拿著家人給的代碼來的人
   * 要的是「加入」，不該先看到一張新增寶寶的表單。
   */
  initialMode?: ChildModalMode;
  /**
   * 選取中的分頁與送出鍵的顏色。預設是 LittleSteps 的主色；其他服務傳入
   * 自己的 `ServiceTheme.fill` + `fillText`，這樣視窗看起來就屬於當下的服務。
   */
  accent?: string;
  accentText?: string;
}

const FIELD =
  'w-full min-h-tap px-4 py-3 rounded-2xl border border-ink/15 text-ink placeholder-ink-faint transition-colors';

const LABEL = 'block text-sm font-medium text-ink mb-1';

export default function AddChildModal({
  isOpen,
  onClose,
  onSave,
  onJoin,
  editingChild,
  onDelete,
  modes = ['create', 'join'],
  initialMode,
  accent = 'bg-primary-dark',
  accentText = 'text-white',
}: AddChildModalProps) {
  const [mode, setMode] = useState<ChildModalMode>(initialMode ?? modes[0]);
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [childUuid, setChildUuid] = useState('');
  // 字串而不是數字：數字型 state 沒辦法表達「使用者清空了這一格」。
  const [gestationalWeeks, setGestationalWeeks] = useState('');
  const [gestationalDays, setGestationalDays] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingChild) {
      setMode('create');
      setName(editingChild.name);
      setBirthday(editingChild.birthday);
      setGender(editingChild.gender || '');
      setGestationalWeeks(editingChild.gestationalAgeWeeks?.toString() ?? '');
      setGestationalDays(editingChild.gestationalAgeDays?.toString() ?? '');
    } else {
      // 回到這個入口提供的第一個分頁，而不是硬回 'create'——只提供
      // 孕期的入口沒有 'create' 可回。
      setMode(initialMode ?? modes[0]);
      setName('');
      setBirthday('');
      setDueDate('');
      setGender('');
      setGestationalWeeks('');
      setGestationalDays('');
      setChildUuid('');
    }
    setError('');
  }, [editingChild, isOpen, initialMode]);

  const runWrite = async (write: () => void | Promise<void>) => {
    setSaving(true);
    setError('');
    try {
      await write();
      onClose();
    } catch (failure) {
      // 加入失敗時，資料層知道確切原因（代碼不存在、對方沒開放、已經加入過），
      // 那句話就是寫給家長看的，照樣顯示。這裡原本一律說「請確認網路」，於是
      // 女兒把分享關掉之後，阿嬤被叫去檢查 Wi-Fi。其他失敗沒有可以給人看的
      // 原因，才用通用的那一句。
      setError(
        failure instanceof ChildJoinError
          ? failure.message
          : '儲存失敗，請確認網路後再試一次。',
      );
    } finally {
      setSaving(false);
    }
  };

  /**
   * 週數留空就送 undefined，兩格都不寫進資料。填了但超出合理範圍時擋下來
   * 並說清楚，而不是靜靜存一個算不出矯正年齡的數字——correctedAge 讀到範圍
   * 外的值會當足月處理，家長會以為自己填了卻沒有作用。
   */
  const readGestationalAge = (): { weeks?: number; days?: number } | 'invalid' | undefined => {
    if (gestationalWeeks.trim() === '' && gestationalDays.trim() === '') return undefined;
    const weeks = Number(gestationalWeeks);
    const days = gestationalDays.trim() === '' ? 0 : Number(gestationalDays);
    const weeksOk =
      Number.isInteger(weeks) &&
      weeks >= GESTATIONAL_AGE_RANGE.minWeeks &&
      weeks <= GESTATIONAL_AGE_RANGE.maxWeeks;
    const daysOk = Number.isInteger(days) && days >= 0 && days <= 6;
    if (!weeksOk || !daysOk) return 'invalid';
    return { weeks, days };
  };

  // 編輯孕期檔案時，「生日」那一格裝的是預產期，本來就該在未來。
  const birthdayIsDueDate = editingChild?.isPregnancy === true;
  const today = toLocalDateKey();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'create') {
      if (name && birthday) {
        // 未來的生日其實是預產期。照樣存成寶寶檔案的話，孕期陪伴認不得它，
        // 寶寶成長則替一個還沒出生的孩子算月齡。YYYY-MM-DD 可以直接比字串。
        if (!birthdayIsDueDate && birthday > today) {
          setError('寶寶還沒出生？請改選「懷孕中」，填預產期。');
          return;
        }
        const gestationalAge = readGestationalAge();
        if (gestationalAge === 'invalid') {
          setError(
            `出生週數請填 ${GESTATIONAL_AGE_RANGE.minWeeks}-${GESTATIONAL_AGE_RANGE.maxWeeks} 週、天數 0-6 天，或整格留空。`,
          );
          return;
        }
        void runWrite(() => onSave(name, birthday, gender || undefined, undefined, undefined, gestationalAge));
      }
    } else if (mode === 'pregnancy') {
      // 小名標的是選填，所以條件只有預產期。這裡原本連小名一起要求，還沒取名
      // 的家長按下送出什麼都不會發生，也沒有任何提示。名字欄位在資料裡不能空，
      // 沒取名就先叫「寶寶」，之後在編輯裡改得掉。
      if (dueDate) {
        // 孕期檔案的 birthday 存的就是預產期。
        void runWrite(() => onSave(name.trim() || '寶寶', dueDate, undefined, true, dueDate));
      }
    } else if (mode === 'join') {
      if (childUuid && onJoin) {
        void runWrite(() => onJoin(childUuid.trim()));
      }
    }
  };

  const MODE_LABELS: Record<ChildModalMode, string> = {
    create: '寶寶',
    pregnancy: '懷孕中',
    join: '加入寶寶',
  };

  // 只有一種選擇時不畫分頁——LittleBloom 只建孕期檔案，一顆孤零零的
  // 「懷孕中」按鈕沒有在選什麼。
  const available = modes.filter((m) => m !== 'join' || onJoin);
  const showModeSelector = !editingChild && available.length > 1;

  const title = editingChild
    ? '編輯寶寶資料'
    : mode === 'create'
      ? '新增寶寶'
      : mode === 'pregnancy'
        ? '新增孕期'
        : '加入寶寶';

  const submitLabel = editingChild
    ? '儲存修改'
    : mode === 'create'
      ? '新增寶寶'
      : mode === 'pregnancy'
        ? '開始追蹤孕期'
        : '加入寶寶';

  return (
    <ModalFrame isOpen={isOpen} onClose={onClose} title={title} closeDisabled={saving}>
      {showModeSelector && (
        <div className="flex gap-2 mb-5">
          {available.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              aria-pressed={mode === id}
              className={`flex-1 min-h-tap px-3 rounded-2xl text-sm font-medium transition-colors ${
                mode === id
                  ? `${accent} ${accentText}`
                  : 'bg-ink/5 text-ink-muted hover:bg-ink/10'
              }`}
            >
              {MODE_LABELS[id]}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'create' ? (
          <>
            <div>
              <label htmlFor="childName" className={LABEL}>
                寶寶姓名
              </label>
              <input
                type="text"
                id="childName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={FIELD}
                placeholder="例如: 小寶"
                // 上限就是規則的上限。超過它回來的是 PERMISSION_DENIED，表單只會說
                // 「請確認網路」。孕期表單的小名寫的是同一個欄位，所以用同一個數。
                maxLength={CHILD_NAME_LIMIT}
                required
              />
            </div>
            <div>
              <label htmlFor="childBirthday" className={LABEL}>
                {/* 孕期檔案的這個欄位存的是預產期。標成「寶寶生日」會讓家長
                    以為填錯了，或者不敢改。 */}
                {birthdayIsDueDate ? '預產期' : '寶寶生日'}
              </label>
              <input
                type="date"
                id="childBirthday"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className={FIELD}
                // 日期選擇器先擋一次；送出時還會再比，因為手打的日期不受 max 管。
                max={birthdayIsDueDate ? undefined : today}
                required
              />
            </div>
            <div>
              <label htmlFor="childGender" className={LABEL}>
                寶寶性別
              </label>
              <select
                id="childGender"
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender | '')}
                className={FIELD}
              >
                <option value="">請選擇性別（選填）</option>
                <option value="male">男生</option>
                <option value="female">女生</option>
              </select>
            </div>
            {/*
              早產週數。放在最後、標明選填、預設留空：九成的家長不必理它，
              而填了的那一成才拿得到正確的百分位與里程碑（見
              common/correctedAge）。只在建立／編輯寶寶時出現，孕期檔案還沒
              有出生週數可填。
            */}
            <div>
              <label htmlFor="childGestationalWeeks" className={LABEL}>
                出生時的週數（選填）
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="childGestationalWeeks"
                  inputMode="numeric"
                  min={GESTATIONAL_AGE_RANGE.minWeeks}
                  max={GESTATIONAL_AGE_RANGE.maxWeeks}
                  value={gestationalWeeks}
                  onChange={(e) => setGestationalWeeks(e.target.value)}
                  placeholder="32"
                  className={FIELD}
                />
                <span className="text-sm text-ink-muted shrink-0">週</span>
                <input
                  type="number"
                  id="childGestationalDays"
                  inputMode="numeric"
                  min={0}
                  max={6}
                  value={gestationalDays}
                  onChange={(e) => setGestationalDays(e.target.value)}
                  placeholder="0"
                  className={FIELD}
                  aria-label="出生時的天數"
                />
                <span className="text-sm text-ink-muted shrink-0">天</span>
              </div>
              <p className="mt-1 text-xs text-ink-faint">
                足月（37 週以上）可以不填。早產寶寶填了之後，生長曲線與發展檢核會改用矯正年齡。
              </p>
            </div>
          </>
        ) : mode === 'pregnancy' ? (
          <>
            <div>
              <label htmlFor="pregnancyName" className={LABEL}>
                寶寶小名 (選填)
              </label>
              <input
                type="text"
                id="pregnancyName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={FIELD}
                placeholder="還沒取名可以留空"
                maxLength={CHILD_NAME_LIMIT}
              />
            </div>
            <div>
              <label htmlFor="dueDate" className={LABEL}>
                預產期
              </label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={FIELD}
                required
              />
            </div>
          </>
        ) : (
          <div>
            <label htmlFor="childUuid" className={LABEL}>
              寶寶代碼
            </label>
            <input
              type="text"
              id="childUuid"
              value={childUuid}
              onChange={(e) => setChildUuid(e.target.value)}
              className={`${FIELD} font-mono text-sm`}
              placeholder="例如: 1234abcd-..."
              // 代碼是一串英數字：自動大寫、自動修正與拼字檢查只會把它改壞。
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              required
            />
          </div>
        )}

        {error && (
          <p role="alert" className="text-sm text-primary-dark bg-primary-light rounded-2xl px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className={`btn-primary w-full disabled:opacity-60 ${accent} ${accentText}`}
        >
          {saving ? (mode === 'join' ? '加入中…' : '儲存中…') : submitLabel}
        </button>
      </form>

      {editingChild && onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="btn-ghost w-full mt-2 text-primary-dark hover:bg-primary-light"
        >
          刪除這位寶寶的資料
        </button>
      )}
    </ModalFrame>
  );
}
