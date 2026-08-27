import { useState, useEffect } from 'react';
import { ChildProfile, Gender } from '../../types';
import ModalFrame from './ModalFrame';

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, birthday: string, gender?: Gender, isPregnancy?: boolean, dueDate?: string) => void;
  onJoin?: (uuid: string) => void; // New: join existing child
  editingChild?: ChildProfile | null;
  /** 只在編輯既有寶寶時提供。刪除從側邊欄那一列搬進來，避開誤觸。 */
  onDelete?: () => void;
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
  onDelete
}: AddChildModalProps) {
  const [mode, setMode] = useState<'create' | 'join' | 'pregnancy'>('create');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [childUuid, setChildUuid] = useState('');

  useEffect(() => {
    if (editingChild) {
      setMode('create');
      setName(editingChild.name);
      setBirthday(editingChild.birthday);
      setGender(editingChild.gender || '');
    } else {
      setName('');
      setBirthday('');
      setDueDate('');
      setGender('');
      setChildUuid('');
    }
  }, [editingChild, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'create') {
      if (name && birthday) {
        onSave(name, birthday, gender || undefined);
        onClose();
      }
    } else if (mode === 'pregnancy') {
      if (name && dueDate) {
        // Assume birthday is dueDate for simplicity or pass differently
        onSave(name, dueDate, undefined, true, dueDate);
        onClose();
      }
    } else if (mode === 'join') {
      if (childUuid && onJoin) {
        onJoin(childUuid.trim());
        onClose();
      }
    }
  };

  // If editing, only show create mode
  const showModeSelector = !editingChild && onJoin;

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

  const MODES = [
    { id: 'create', label: '寶寶' },
    { id: 'pregnancy', label: '懷孕中' },
    { id: 'join', label: '加入' },
  ] as const;

  return (
    <ModalFrame isOpen={isOpen} onClose={onClose} title={title}>
      {showModeSelector && (
        <div className="flex gap-2 mb-5">
          {MODES.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setMode(option.id)}
              aria-pressed={mode === option.id}
              className={`flex-1 min-h-tap px-3 rounded-2xl text-sm font-medium transition-colors ${
                mode === option.id
                  ? 'bg-primary-dark text-white'
                  : 'bg-ink/5 text-ink-muted hover:bg-ink/10'
              }`}
            >
              {option.label}
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
                寶寶生日
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

        <button type="submit" className="btn-primary w-full">
          {submitLabel}
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
