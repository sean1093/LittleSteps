import { motion } from 'framer-motion';
import AppBar from '../ui/AppBar';
import { SERVICE_THEME } from '../ui/serviceTheme';
import { fadeInUp, tap } from '../ui/motion';
import { goTo } from '../navigate';

const theme = SERVICE_THEME.littlesteps;

/**
 * What a signed-out visitor sees at `/join`.
 *
 * The join link is gated like every page that writes to a child's record, so
 * a visitor without a session sees an intro at the same URL — the code is
 * already held in memory (see `common/joinLink`), and signing in renders the
 * confirm screen right here. It is its own intro rather than one of the three
 * service intros because the link can lead to a baby's record or a pregnancy
 * profile, and nothing can say which before the visitor is a member.
 *
 * Static on purpose: no store, no database, so a stranger's first view of a
 * shared link fetches nothing about anyone's child.
 */
export default function JoinIntro({ onSignIn }: { onSignIn: () => Promise<void> }) {
  return (
    <div className="screen">
      <AppBar theme={theme} title="加入家人的紀錄" backTo="home" backLabel="返回所有服務" />
      <main className="screen-body space-y-4">
        <motion.section variants={fadeInUp} initial="hidden" animate="visible" className="panel">
          <p className="text-ink leading-relaxed">
            家人邀請你一起記錄。先用 Google 登入，登入後會回到這一頁；要等你按下「加入」，才會把你放進這份紀錄的名單。
          </p>
          <motion.button
            type="button"
            whileTap={tap}
            onClick={onSignIn}
            className={`btn-primary w-full mt-6 ${theme.fill} ${theme.fillText}`}
          >
            使用 Google 登入
          </motion.button>
          <p className="text-sm text-ink-muted leading-relaxed mt-4">
            只有名單上的人看得到這份紀錄，每一位都能記錄，也都能把別人移除。
          </p>
          <button
            type="button"
            onClick={() => goTo('about')}
            className="btn-ghost w-full mt-2 text-secondary-dark"
          >
            看看孩子的紀錄怎麼被保護
          </button>
        </motion.section>
      </main>
    </div>
  );
}
