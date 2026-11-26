import { useState, type FormEvent } from 'react';
import { ChildProfile } from '../../types';
import ModalFrame from './ModalFrame';
import { confirmDelete } from '../ui/confirmDelete';
import { goTo } from '../navigate';
import { useOptionalAuth } from '../../contexts/AuthContext';
import { SHARING_REMOVAL } from '../landing/serviceCopy';
import { MEMBER_NAME_MAX, UNNAMED_MEMBER, memberRows, type MemberRow } from '../memberNames';

interface ShareChildUuidModalProps {
  isOpen: boolean;
  onClose: () => void;
  child: ChildProfile | null;
  /**
   * 移除名單上的一位成員；是自己的話就是離開。失敗時 reject 且不 toast：
   * 訊息要留在這扇窗裡，家長才知道剛才那一下沒生效。
   */
  removeMember: (childId: string, memberUid: string) => Promise<void>;
  setMemberName: (childId: string, name: string) => Promise<void>;
  setJoinOpen: (childId: string, open: boolean) => Promise<void>;
}

/**
 * 分享代碼就是寶寶資料的 id，換不掉；所以「收回分享」只能是移除成員並關掉
 * 加入。這扇窗是家長唯一看得到、也唯一改得動存取權的地方，因此它先列出誰
 * 看得到——用每個人自己取的名字，一列一個移除鈕——再給開關與代碼。
 */
export default function ShareChildUuidModal({
  isOpen,
  onClose,
  child,
  removeMember,
  setMemberName,
  setJoinOpen,
}: ShareChildUuidModalProps) {
  const [pending, setPending] = useState<'copy' | 'join' | 'remove' | 'name' | null>(null);
  /** 正在移除的是誰，按鈕上的「移除中…」只出現在那一列。 */
  const [removingUid, setRemovingUid] = useState<string | null>(null);
  /** 改名字的輸入框；null 是沒在改。 */
  const [nameDraft, setNameDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const user = useOptionalAuth()?.user ?? null;

  if (!child) return null;

  const memberCount = Object.keys(child.members).length;
  const rows = memberRows(child, user?.uid ?? null);
  const myRow = rows.find((row) => row.isMe);
  // 開關直接讀資料庫來的值，不留一份本地狀態：寫入失敗時它就不會停在
  // 資料庫沒有的位置上。
  const joinOpen = child.joinOpen === true;
  const busy = pending !== null;

  const handleCopy = async () => {
    setError(null);
    setPending('copy');
    let opened = joinOpen;
    try {
      // 先確定代碼真的能用，才把它交到家長手上：順序反過來的話，寫入失敗的人
      // 手上會有一組貼出去也加不進來的代碼，而且看不出哪裡不對。
      if (!opened) {
        await setJoinOpen(child.id, true);
        opened = true;
      }
      await navigator.clipboard.writeText(child.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(
        opened
          ? '複製失敗，請手動選取上方代碼'
          : '開放加入沒有成功，代碼現在還不能用，請再試一次',
      );
    } finally {
      setPending(null);
    }
  };

  const handleToggleJoin = async () => {
    setError(null);
    setPending('join');
    try {
      await setJoinOpen(child.id, !joinOpen);
    } catch {
      setError('設定沒有存到，開關維持原本的狀態，請再試一次');
    } finally {
      setPending(null);
    }
  };

  const handleRemove = async (row: MemberRow) => {
    // 走共用的刪除確認：全 app 只有這一種攔阻的說法，收回存取權不該長出第二種。
    const confirmed = row.isMe
      ? confirmDelete('你自己的存取權', undefined, `${child.name}的紀錄會留給名單上的其他人。`)
      : confirmDelete(`${row.label}的存取權`, undefined, '「開放用代碼加入」會一起關掉。');
    if (!confirmed) return;

    setError(null);
    setPending('remove');
    setRemovingUid(row.uid);
    try {
      await removeMember(child.id, row.uid);
      // 離開之後這份紀錄就不是我的了，窗留著只會顯示一份讀不到的名單。
      if (row.isMe) onClose();
    } catch {
      setError(
        row.isMe
          ? '離開沒有成功，你仍然在名單上，請再試一次'
          : '移除沒有成功，對方仍然看得到，請再試一次',
      );
    } finally {
      setPending(null);
      setRemovingUid(null);
    }
  };

  const handleSaveName = async (event: FormEvent) => {
    event.preventDefault();
    if (nameDraft === null || !nameDraft.trim()) return;

    setError(null);
    setPending('name');
    try {
      await setMemberName(child.id, nameDraft);
      setNameDraft(null);
    } catch {
      setError('名字沒有存到，請再試一次');
    } finally {
      setPending(null);
    }
  };

  return (
    <ModalFrame isOpen={isOpen} onClose={onClose} title="分享寶寶資料">
      <div className="bg-primary-soft rounded-2xl p-4 mb-4">
        <p className="font-bold text-ink">
          目前有 {memberCount} 個帳號可以看到{child.name}的紀錄（包含你）
        </p>
        <p className="text-sm text-ink-muted mt-1">加入的人都能修改紀錄。{SHARING_REMOVAL}</p>
      </div>

      <section className="mb-4">
        <h3 id="share-members-heading" className="text-ink mb-2">
          誰看得到
        </h3>
        <ul className="space-y-2" aria-labelledby="share-members-heading">
          {rows.map((row) => (
            <li key={row.uid} className="card flex items-center justify-between gap-2 py-2 pr-2">
              <div className="min-w-0">
                <p
                  title={row.label}
                  className={`font-medium truncate ${row.unnamed ? 'text-ink-muted' : 'text-ink'}`}
                >
                  {row.label}
                  {row.isMe && '（你）'}
                </p>
                {row.isCreator && <p className="text-sm text-ink-muted">建立這份紀錄</p>}
              </div>
              <div className="flex shrink-0 items-center">
                {row.isMe && nameDraft === null && (
                  <button
                    type="button"
                    onClick={() => setNameDraft(row.unnamed ? '' : row.label)}
                    disabled={busy}
                    className="btn-ghost px-3 text-secondary-dark disabled:opacity-50"
                  >
                    改名字
                  </button>
                )}
                {/* 最後一位不給移除：名單空掉的紀錄沒有人讀得到、也刪不掉，規則
                    同樣擋著。那時要走的路是刪除這份檔案。 */}
                {memberCount > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemove(row)}
                    disabled={busy}
                    aria-label={row.isMe ? '離開這份紀錄' : `移除${row.label}`}
                    className="btn-ghost px-3 text-primary-dark hover:bg-primary-light disabled:opacity-50"
                  >
                    {removingUid === row.uid ? '處理中…' : row.isMe ? '離開' : '移除'}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>

        {nameDraft !== null && myRow && (
          <form onSubmit={handleSaveName} className="mt-3">
            <label htmlFor="memberName" className="block text-sm font-medium text-ink mb-2">
              你在名單上的名字
            </label>
            <input
              id="memberName"
              type="text"
              value={nameDraft}
              maxLength={MEMBER_NAME_MAX}
              onChange={(event) => setNameDraft(event.target.value)}
              placeholder="例如：媽媽、外婆、保母阿姨"
              className="w-full min-h-tap px-4 py-3 rounded-2xl border border-ink/15 bg-white text-ink"
            />
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                disabled={busy || !nameDraft.trim()}
                className="btn-primary disabled:opacity-60"
              >
                {pending === 'name' ? '儲存中…' : '儲存'}
              </button>
              <button
                type="button"
                onClick={() => setNameDraft(null)}
                disabled={busy}
                className="btn-ghost"
              >
                取消
              </button>
            </div>
          </form>
        )}

        {rows.some((row) => row.unnamed && !row.isMe) && (
          <p className="text-sm text-ink-muted mt-2">
            「{UNNAMED_MEMBER}」是還沒替自己取名字的人，請對方打開這扇分享視窗按「改名字」。
          </p>
        )}
      </section>

      <div className="card bg-warm-white flex items-center justify-between gap-3 mb-4">
        <div className="min-w-0">
          <p className="font-medium text-ink">開放用代碼加入</p>
          <p className="text-sm text-ink-muted">
            {joinOpen ? '現在拿到代碼的人都能加入，家人加入後記得關掉。' : '現在就算有代碼也加不進來。'}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={joinOpen}
          aria-label="開放用代碼加入"
          disabled={busy}
          onClick={handleToggleJoin}
          className="h-tap flex items-center shrink-0 disabled:opacity-50"
        >
          <span
            className={`w-12 h-6 rounded-full flex items-center transition-colors ${
              joinOpen ? 'bg-secondary-dark' : 'bg-ink/25'
            }`}
          >
            <span
              className={`w-5 h-5 bg-white rounded-full shadow-soft transition-transform ${
                joinOpen ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </span>
        </button>
      </div>

      <div className="mb-3">
        <label htmlFor="childCode" className="block text-sm font-medium text-ink mb-2">
          寶寶代碼
        </label>
        <input
          id="childCode"
          type="text"
          value={child.id}
          readOnly
          className="w-full min-h-tap px-4 py-3 rounded-2xl border border-ink/15 bg-warm-white font-mono text-sm text-ink select-all"
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
      </div>

      <button
        type="button"
        onClick={handleCopy}
        disabled={busy}
        className="btn-primary w-full disabled:opacity-60"
      >
        {pending === 'copy'
          ? '處理中…'
          : copied
            ? '已複製代碼'
            : joinOpen
              ? '複製代碼'
              : '開放加入並複製代碼'}
      </button>

      {error && (
        <p role="alert" className="text-sm text-primary-dark bg-primary-light rounded-2xl px-4 py-3 mt-3">
          {error}
        </p>
      )}

      <div className="bg-secondary-soft border border-secondary/40 rounded-2xl p-4 mt-4 mb-4">
        <h3 className="text-ink mb-1.5">家人怎麼加入？</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-ink-muted">
          <li>把代碼傳給家人（Line、訊息都可以）</li>
          <li>家人在「新增寶寶」選「加入寶寶」</li>
          <li>貼上代碼就能一起管理</li>
        </ol>
      </div>

      <p className="text-sm text-ink-muted">
        代碼就是這份寶寶資料的編號，換不了新的一組。要收回分享，就把對方從上面的名單移除——移除時會一併關掉「開放用代碼加入」，流出去的舊代碼就再也加不進來。
      </p>

      {/* 把代碼交出去的這一刻，是家長最想知道「這份資料到底怎麼被保護」的時候。 */}
      <button
        type="button"
        onClick={() => {
          onClose();
          goTo('about');
        }}
        className="btn-ghost w-full mt-2 text-secondary-dark"
      >
        看看孩子的紀錄怎麼被保護
      </button>

    </ModalFrame>
  );
}
