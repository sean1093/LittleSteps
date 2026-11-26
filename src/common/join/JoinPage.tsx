import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AppBar from '../ui/AppBar';
import EmptyState from '../ui/EmptyState';
import { SERVICE_THEME } from '../ui/serviceTheme';
import { fadeInUp, tap } from '../ui/motion';
import { goTo } from '../navigate';
import { useChildStoreContext } from '../contexts/ChildStoreContext';
import { useOptionalAuth } from '../../contexts/AuthContext';
import { ChildJoinError } from '../childJoinError';
import { CHILD_LIMIT_FREE_SLOT, CHILD_LIMIT_MESSAGE, MAX_CHILDREN } from '../childLimits';
import { entryPageForChild } from '../stageEntry';
import { isPregnancyProfile } from '../pregnancy';
import { toMemberName } from '../memberNames';
import { clearJoinCode, joinPressedFor, noteJoinPressed, pendingJoinCode } from '../joinLink';

const theme = SERVICE_THEME.littlesteps;

/**
 * The confirm screen behind a share link, `/join#<code>`.
 *
 * Gated: it writes this account into a child's member list. It joins only
 * when the parent presses the button — never on load — because opening a link
 * someone pasted into a group chat must not silently add anyone to a health
 * record. The join itself is the store's `joinChild`, which reads only
 * `childIndex/<code>` before the membership exists, never the child node.
 *
 * The code comes from `common/joinLink`, which took it out of the address bar
 * at start-up. It stays in memory until the parent leaves this page through
 * one of its buttons: joining briefly puts the app back on its loading bar,
 * which unmounts this page, and when it comes back the new record is already
 * on the parent's list, so the page says the join worked (joinLink remembers
 * the press across that remount) and offers to open it.
 *
 * The raw code is not shown: a child's id means nothing to a grandparent.
 */
export default function JoinPage() {
  const store = useChildStoreContext();
  const user = useOptionalAuth()?.user ?? null;
  const [code, setCode] = useState(pendingJoinCode);
  // A second link pasted into a tab already on /join changes only the
  // fragment: captureJoinLink (installed in main.tsx, so it runs first) takes
  // the new code, and the page follows it instead of the one it mounted with.
  useEffect(() => {
    const follow = () => setCode(pendingJoinCode());
    window.addEventListener('hashchange', follow);
    return () => window.removeEventListener('hashchange', follow);
  }, []);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const leave = (page: Parameters<typeof goTo>[0]) => {
    clearJoinCode();
    goTo(page);
  };

  const body = (() => {
    if (!code) {
      return (
        <EmptyState
          theme={theme}
          title="沒有收到代碼"
          description={
            '這個連結裡沒有可以用的代碼，或是登入時重新整理了頁面。\n請再點一次家人傳來的連結；也可以請對方直接給你代碼，在帳號視窗用代碼加入。'
          }
          action={{ label: '回到所有服務', onClick: () => leave('home') }}
        />
      );
    }

    const joined = store.childProfiles.find((child) => child.id === code);
    if (joined) {
      // A join pressed in this visit gets its own success state. 「已經在名單上」
      // after pressing 「加入」 reads like a mistake; it is kept for arriving
      // on a link to a record the parent was already a member of.
      const justJoined = joinPressedFor(joined.id);
      return (
        <EmptyState
          theme={theme}
          title={justJoined ? '加入好了' : '你已經在這份紀錄的名單上'}
          description={
            justJoined
              ? `${joined.name}的紀錄已經放進你的帳號，現在就能一起記錄。`
              : `${joined.name}的紀錄已經在你的帳號裡了。`
          }
          action={{
            label: '打開紀錄',
            onClick: () => {
              void store.setCurrentChild(joined.id);
              leave(entryPageForChild(joined));
            },
          }}
        />
      );
    }

    if (store.childProfiles.length >= MAX_CHILDREN) {
      return (
        <EmptyState
          theme={theme}
          title="這個帳號的檔案已經滿了"
          description={`${CHILD_LIMIT_MESSAGE}。${CHILD_LIMIT_FREE_SLOT}`}
          action={{ label: '回到所有服務', onClick: () => leave('home') }}
        />
      );
    }

    const name = toMemberName(user?.displayName);

    const handleJoin = async () => {
      setError(null);
      setPending(true);
      noteJoinPressed(code);
      try {
        await store.joinChild(code);
      } catch (failure) {
        noteJoinPressed(null);
        setError(
          failure instanceof ChildJoinError
            ? failure.message
            : '加入沒有成功，請檢查網路連線後再試一次',
        );
      } finally {
        setPending(false);
      }
    };

    return (
      <motion.section variants={fadeInUp} initial="hidden" animate="visible" className="panel">
        <h2 className="text-ink mb-2">要加入家人的紀錄嗎？</h2>
        <p className="text-ink-muted leading-relaxed">
          加入之後，你會出現在這份紀錄的名單上：看得到、也改得了裡面的每一筆紀錄。名單上的其他人會看到你，
          {name ? `名字是「${name}」，之後可以在分享視窗改。` : '你可以之後在分享視窗替自己取名字。'}
        </p>

        {error && (
          <p role="alert" className="text-sm text-primary-dark bg-primary-light rounded-2xl px-4 py-3 mt-4">
            {error}
          </p>
        )}

        <motion.button
          type="button"
          whileTap={tap}
          onClick={handleJoin}
          disabled={pending}
          className={`btn-primary w-full mt-6 disabled:opacity-60 ${theme.fill} ${theme.fillText}`}
        >
          {pending ? '加入中…' : '加入'}
        </motion.button>
        <button
          type="button"
          onClick={() => leave('home')}
          disabled={pending}
          className="btn-ghost w-full mt-2"
        >
          先不要
        </button>
      </motion.section>
    );
  })();

  // A pregnancy profile is only known once joined; until then the page names
  // neither, since the link can lead to either.
  const joinedChild = code ? store.childProfiles.find((child) => child.id === code) : undefined;
  const title = joinedChild && isPregnancyProfile(joinedChild) ? '加入家人的孕期檔案' : '加入家人的紀錄';

  return (
    <div className="screen">
      <AppBar theme={theme} title={title} backTo="home" backLabel="返回所有服務" />
      <main className="screen-body space-y-4">{body}</main>
    </div>
  );
}
