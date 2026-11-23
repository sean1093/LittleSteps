import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { MAX_CHILDREN } from '../childLimits';
import { goTo } from '../navigate';
import { fadeInUp, listItem, stagger, tap } from '../ui/motion';
import { SERVICE_THEME } from '../ui/serviceTheme';
import { SERVICE_INTRO, STAGE_RANGE, type StagedService } from './serviceCopy';

interface ServiceIntroProps {
  service: StagedService;
  onSignIn: () => Promise<void>;
}

/**
 * What a signed-out visitor sees at any gated URL: the service introducing
 * itself, at that same URL, so signing in lands them where they were going.
 *
 * One template for all three staged services. There used to be two pages that
 * disagreed — a long hand-written one for LittleSteps and a short card for the
 * other two — with different button labels, different amounts of proof and a
 * different idea of where the button goes.
 *
 * The order is the visitor's, not the product's. They chose a destination
 * already, so the promise and the sign-in button come first; what signing in
 * unlocks comes after it for whoever wants the detail; and what can be read
 * with no account sits last, as the way forward for someone who will not sign
 * in today.
 *
 * Landmarks: this page returns before the shell in `App.tsx` can supply any,
 * so it renders its own `<header>` and `<main>`. The header holds a labelled
 * link back to the landing page — the only route to the other five services.
 */
export default function ServiceIntro({ service, onSignIn }: ServiceIntroProps) {
  const intro = SERVICE_INTRO[service];
  const theme = SERVICE_THEME[service];

  return (
    <div className={`min-h-dscreen ${theme.pageBg}`}>
      <header className="max-w-2xl mx-auto px-4 pt-3">
        <button
          type="button"
          onClick={() => {
            goTo('home');
          }}
          className={`btn-ghost -ml-4 ${theme.muted}`}
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          所有服務
        </button>
      </header>

      <main className="screen-body space-y-4">
        <motion.section variants={fadeInUp} initial="hidden" animate="visible" className="panel">
          {/* The role is the heading, not the wordmark: the suite and the
              0-12 month service share the name LittleSteps. */}
          <h1 className={`sm:text-3xl ${theme.ink}`}>{theme.role}</h1>
          <p className={`text-sm ${theme.muted}`}>
            {theme.name} · {STAGE_RANGE[service]}
          </p>
          <p className={`${theme.body} leading-relaxed mt-4`}>{intro.promise}</p>

          <motion.button
            type="button"
            whileTap={tap}
            onClick={onSignIn}
            className={`btn-primary w-full mt-6 ${theme.fill} ${theme.fillText}`}
          >
            使用 Google 登入，開始記錄
          </motion.button>
          <p className={`text-xs ${theme.muted} text-center mt-3`}>
            登入後直接回到這一頁。目前免費，一個帳號最多記錄 {MAX_CHILDREN} 個寶寶。
          </p>

          <h2 className={`${theme.body} mt-8 mb-3`}>登入後可以做什麼</h2>
          <motion.ul variants={stagger} initial="hidden" animate="visible" className="space-y-3">
            {intro.features.map((feature) => (
              <motion.li key={feature.title} variants={listItem}>
                <p className={`font-semibold ${theme.body}`}>{feature.title}</p>
                <p className={`text-sm ${theme.muted} leading-relaxed`}>{feature.detail}</p>
              </motion.li>
            ))}
          </motion.ul>
        </motion.section>

        <motion.section variants={fadeInUp} initial="hidden" animate="visible" className="space-y-2">
          <h2 className={theme.body}>不登入也能看</h2>
          <ul className="space-y-2">
            {intro.publicContent.map((item) => (
              <li key={item.page}>
                {/* Spans, not headings: a button may not contain a heading
                    (see ui/pressable). */}
                <motion.button
                  type="button"
                  whileTap={tap}
                  onClick={() => {
                    goTo(item.page);
                  }}
                  className="card-tap w-full text-left"
                >
                  <span className={`block font-semibold ${theme.ink}`}>{item.title}</span>
                  <span className="block text-sm text-ink-muted leading-snug mt-0.5">
                    {item.detail}
                  </span>
                </motion.button>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* The paragraph a parent reads twice, so it has to agree with
            database.rules.json: access hangs on the child's member list, not
            on one person. The about page says it in full. */}
        <motion.section variants={fadeInUp} initial="hidden" animate="visible">
          <a
            href="/about"
            onClick={(event) => {
              event.preventDefault();
              goTo('about');
            }}
            className="card-tap block"
          >
            <span className={`block font-semibold ${theme.body}`}>這份紀錄屬於你們家</span>
            <span className="block text-sm text-ink-muted leading-relaxed mt-0.5">
              只有你和你用分享代碼邀請的家人看得到，每一位成員都能讀寫，也都可以被移除。看完整說明。
            </span>
          </a>
        </motion.section>
      </main>
    </div>
  );
}
