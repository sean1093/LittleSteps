import { useState } from 'react';
import { motion } from 'framer-motion';
import AppBar from '../ui/AppBar';
import { SERVICE_THEME } from '../ui/serviceTheme';
import { fadeInUp, tap } from '../ui/motion';
import { goTo } from '../navigate';
import { inAppBrowser } from '../inAppBrowser';
import { InAppBrowserAction } from '../components/InAppBrowserSheet';

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
 *
 * Share links mostly arrive in LINE, and Google refuses sign-in inside an
 * in-app browser. There the primary action is the in-app sheet's own action
 * (reopen in the phone's browser, or copy the link) rather than a sign-in
 * button whose only effect is to open that sheet: one tap instead of two.
 */
export default function JoinIntro({ onSignIn }: { onSignIn: () => Promise<void> }) {
  // The user agent does not change while the page is open.
  const [browser] = useState(inAppBrowser);
  const primaryClass = `btn-primary w-full ${theme.fill} ${theme.fillText}`;

  return (
    <div className="screen">
      <AppBar theme={theme} title="加入家人的紀錄" backTo="home" backLabel="返回所有服務" />
      <main className="screen-body space-y-4">
        <motion.section variants={fadeInUp} initial="hidden" animate="visible" className="panel">
          <p className="text-ink leading-relaxed">
            家人邀請你一起記錄。
            {browser === 'line'
              ? 'Google 不允許在 LINE 裡登入：按下面的按鈕，用手機的瀏覽器打開這一頁，在那裡登入。'
              : browser
                ? 'Google 不允許在這個 App 裡登入：請複製連結，貼到 Chrome 或 Safari 打開，在那裡登入。'
                : '先用 Google 登入，登入後會回到這一頁。'}
            要等你按下「加入」，才會把你放進這份紀錄的名單。
          </p>
          <div className="mt-6">
            {browser ? (
              <InAppBrowserAction browser={browser} className={primaryClass} />
            ) : (
              <motion.button type="button" whileTap={tap} onClick={onSignIn} className={primaryClass}>
                使用 Google 登入
              </motion.button>
            )}
          </div>
          <p className="text-sm text-ink-muted leading-relaxed mt-4">需要一個 Google 帳號才能加入。</p>
          <p className="text-sm text-ink-muted leading-relaxed mt-2">
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
