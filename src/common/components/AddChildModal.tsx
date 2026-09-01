import { useState, useEffect } from 'react';
import { ChildProfile, Gender } from '../../types';
import ModalFrame from './ModalFrame';

export type ChildModalMode = 'create' | 'join' | 'pregnancy';

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  /**
   * 回傳 promise 時，視窗會等它成功才關閉。寫入失敗的話輸入留在原地——
   * 家長不必重打一次名字與生日。
   */
  onSave: (name: string, birthday: string, gender?: Gender, isPregnancy?: boolean, dueDate?: string) => void | Promise<void>;
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
  accent = 'bg-primary-dark',
  accentText = 'text-white',
}: AddChildModalProps) {
  const [mode, setMode] = useState<ChildModalMode>(modes[0]);
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [childUuid, setChildUuid] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingChild) {
      setMode('create');
      setName(editingChild.name);
      setBirthday(editingChild.birthday);
      setGender(editingChild.gender || '');
    } else {
      // 回到這個入口提供的第一個分頁，而不是硬回 'create'——只提供
      // 孕期的入口沒有 'create' 可回。
      setMode(modes[0]);
      setName('');
      setBirthday('');
      setDueDate('');
      setGender('');
      setChildUuid('');
    }
    setError('');
  }, [editingChild, isOpen]);

  const runWrite = async (write: () => void | Promise<void>) => {
    setSaving(true);
    setError('');
    try {
      await write();
      onClose();
    } catch {
      // 呼叫端已經跳過提示，這裡只解釋視窗為什麼還開著。
      setError('儲存失敗，請確認網路後再試一次。');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'create') {
      if (name && birthday) {
        void runWrite(() => onSave(name, birthday, gender || undefined));
      }
    } else if (mode === 'pregnancy') {
      if (name && dueDate) {
        // 孕期檔案的 birthday 存的就是預產期。
        void runWrite(() => onSave(name, dueDate, undefined, true, dueDate));
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
    join: '加入',
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
                required
              />
            </div>
            <div>
              <label htmlFor="childBirthday" className={LABEL}>
                {/* 孕期檔案的這個欄位存的是預產期。標成「寶寶生日」會讓家長
                    以為填錯了，或者不敢改。 */}
                {editingChild?.isPregnancy ? '預產期' : '寶寶生日'}
              </label>
              <input
                type="date"
                id="childBirthday"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className={FIELD}
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
                placeholder="例如: 小花苞"
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
          {saving ? '儲存中…' : submitLabel}
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
