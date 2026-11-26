import type { MouseEvent } from 'react';
import { motion } from 'framer-motion';
import type { User } from 'firebase/auth';
import { MAX_CHILDREN } from '../childLimits';
import { goTo } from '../navigate';
import { fadeInUp, listItem, stagger } from '../ui/motion';
import { pressable } from '../ui/pressable';
import { SERVICE_THEME } from '../ui/serviceTheme';
import type { ServiceId } from '../ui/serviceTheme';
import { ROUTE_PATH } from '../../types/routes';
import {
  ANYTIME_SERVICES,
  CALCULATORS,
  CALCULATORS_HEADING,
  GUIDE_LINKS,
  SERVICE_GROUPS,
  SERVICE_PITCH,
  STAGED_SERVICES,
  STAGE_RANGE,
  TOOL_FIGURE,
  WIKI_LINKS,
  type StagedService,
} from './serviceCopy';

/**
 * The landing page: the one place that says what the whole product is.
 *
 * It reads in the order a stranger on a phone needs. What this is and the one
 * thing to do about it. Then what can be used this minute with no account,
 * because that is most of what a first visit wants and it used to sit a screen
 * and a half down. Then the three services a family records in, drawn as the
 * sequence they are. Then who can see a child's records.
 *
 * Rules the page keeps:
 *
 * - One primary action per state. Signed out it is sign-in; the tool rows
 *   directly under it are the way in for someone not ready to hand over an
 *   account. Signed in it is the child's own service, and the pitch is gone.
 * - Every service has exactly one entry, and it is a real link: it can be
 *   opened in a new tab, and it says where it goes.
 * - A service is named by what it does. The English sub-brands are gone from
 *   this page and from the pages it leads to; "LittleSteps" is the product.
 * - No number is typed here. Figures and article counts come from
 *   `serviceCopy.ts`, where a test holds each against the data.
 * - One left edge at every width. The hero used to centre on a desktop above
 *   a left-aligned page, which is two axes on one screen.
 */

interface HubLandingProps {
  onNavigate: (page: ServiceId) => void;
  user?: User | null;
  onSignIn?: () => Promise<void>;
  /**
   * The service matching the current child's stage. Omitted when there is no
   * child, signed in or not.
   */
  currentService?: ServiceId;
  /** The current child's name; with `onContinue`, turns the hero into "carry on". */
  childName?: string;
  /** Opens the current child's own service. */
  onContinue?: () => void;
  /** Opens the add-child form. The modal belongs to `LandingPage`. */
  onAddChild?: () => void;
  /** Opens the same form on its join tab, for a second carer holding a code. */
  onJoinChild?: () => void;
}

/**
 * The rule beside the stage the child is in, in that service's accent. The
 * theme only carries the accent as a background class, and Tailwind needs to
 * see a border class spelled out to generate it.
 */
const STAGE_RULE: Record<StagedService, string> = {
  littlebloom: 'border-bloom-dusty-rose',
  littlesteps: 'border-primary',
  littleexplorer: 'border-explorer-sunbeam',
};

const TRUST_POINTS = [
  '要讀寫孩子的紀錄一定要登入，沒有訪客模式。',
  '用分享代碼把另一半加進來，之後隨時可以關掉代碼、移除成員。',
  '紀錄不販售、不交換、不用於廣告，也不拿來訓練任何模型。',
  '整份紀錄可以匯出成一個檔案，孩子和帳號都刪得掉。',
];

export default function HubLanding({
  onNavigate,
  user,
  onSignIn,
  currentService,
  childName,
  onContinue,
  onAddChild,
  onJoinChild,
}: HubLandingProps) {
  const signedIn = Boolean(user);
  const [tools, staged] = SERVICE_GROUPS;

  /** A real href for the browser, in-app navigation for an ordinary tap. */
  const linkTo = (id: ServiceId) => ({
    href: ROUTE_PATH[id],
    onClick: (event: MouseEvent<HTMLAnchorElement>) => {
      if (isModifiedClick(event)) return;
      event.preventDefault();
      onNavigate(id);
    },
  });

  return (
    <div className="screen-body-wide space-y-12">
      <motion.section initial="hidden" animate="visible" variants={stagger} className="pt-4 sm:pt-10">
        {signedIn ? (
          <SignedInHero
            childName={childName}
            currentService={currentService}
            onContinue={onContinue}
            onAddChild={onAddChild}
            onJoinChild={onJoinChild}
          />
        ) : (
          <>
            {/* Chinese has no word breaks, so a narrow screen would split the
                headline mid-phrase. Each phrase is its own inline-block and
                the line can only break between them. */}
            <motion.h1 variants={listItem} className="text-3xl sm:text-5xl text-ink">
              <span className="inline-block">從懷孕到三歲，</span>
              <span className="inline-block">該記的都在這裡</span>
            </motion.h1>
            <motion.p
              variants={listItem}
              className="mt-3 text-base text-ink-muted leading-relaxed max-w-xl"
            >
              下一次產檢、下一針疫苗先排好給你看；餵奶、睡眠、尿布，點幾下就記完。
            </motion.p>

            {onSignIn && (
              <motion.div variants={listItem} className="mt-6 sm:max-w-sm">
                <button type="button" onClick={onSignIn} className="btn-primary w-full">
                  用 Google 登入，開始記錄
                </button>
                <p className="mt-3 text-xs text-ink-muted leading-relaxed">
                  目前免費，一個帳號可以記 {MAX_CHILDREN} 個寶寶。
                  <br />
                  另一半已經在記了？登入後用代碼加入。
                </p>
              </motion.div>
            )}
          </>
        )}
      </motion.section>

      <section className="space-y-3">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <h2 className="text-ink">{tools.title}</h2>
          <p className="text-sm text-ink-muted mt-1">{tools.note}</p>
        </motion.div>

        <motion.ul
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          {ANYTIME_SERVICES.map((id) => {
            const theme = SERVICE_THEME[id];
            return (
              <motion.li key={id} variants={listItem}>
                <a {...linkTo(id)} className="card-tap block h-full">
                  {/* The figure is the proof and the heading is the name, in
                      that order on screen. It is a `p`, so the h3 is still the
                      first heading inside the link. */}
                  <p className={`text-2xl font-bold tabular-nums ${theme.ink}`}>
                    {TOOL_FIGURE[id]}
                  </p>
                  <h3 className="text-ink mt-1">{theme.role}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed mt-1">
                    {SERVICE_PITCH[id]}
                  </p>
                </a>
              </motion.li>
            );
          })}
        </motion.ul>

        {/* The knowledge bases are public too, and this is their only door
            from here that does not pass a sign-in button first. */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="text-sm">
          <p className="text-ink-muted">也可以先讀</p>
          <ul className="flex flex-wrap gap-x-4">
            {WIKI_LINKS.map(({ page, title, count }) => (
              <li key={page}>
                <a
                  href={ROUTE_PATH[page]}
                  onClick={(event) => {
                    if (isModifiedClick(event)) return;
                    event.preventDefault();
                    goTo(page);
                  }}
                  className="inline-flex items-center min-h-tap font-medium text-primary-dark underline underline-offset-2"
                >
                  {title} {count} 篇
                </a>
              </li>
            ))}
            {GUIDE_LINKS.map(({ page, title }) => (
              <li key={page}>
                <a
                  href={ROUTE_PATH[page]}
                  onClick={(event) => {
                    if (isModifiedClick(event)) return;
                    event.preventDefault();
                    goTo(page);
                  }}
                  className="inline-flex items-center min-h-tap font-medium text-primary-dark underline underline-offset-2"
                >
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* Tools you open on the way out, above; tools you ask one question of,
          here. Six cards under one heading was the wall this page used to be,
          so they are two short groups, and these carry no figure: what they
          offer is an answer, not a count. */}
      <section className="space-y-3">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <h2 className="text-ink">{CALCULATORS_HEADING.title}</h2>
          <p className="text-sm text-ink-muted mt-1">{CALCULATORS_HEADING.note}</p>
        </motion.div>

        <motion.ul
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {CALCULATORS.map(({ page, title, line }) => (
            <motion.li key={page} variants={listItem}>
              <a
                href={ROUTE_PATH[page]}
                onClick={(event) => {
                  if (isModifiedClick(event)) return;
                  event.preventDefault();
                  goTo(page);
                }}
                className="card-tap block h-full"
              >
                <h3 className="text-ink">{title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed mt-1">{line}</p>
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </section>

      <section className="space-y-3">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <h2 className="text-ink">{staged.title}</h2>
          <p className="text-sm text-ink-muted mt-1">
            {signedIn ? staged.note : `需要登入。${staged.note}`}
          </p>
        </motion.div>

        {/* A sequence, not a set: a family is in one of these at a time and
            moves down the line. So it is an ordered list on a rule, not three
            more white boxes, and the age range is the largest thing in each
            row because "which one is mine" is the question it answers. */}
        <motion.ol
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="md:grid md:grid-cols-3 md:gap-6"
        >
          {STAGED_SERVICES.map((id) => {
            const theme = SERVICE_THEME[id];
            const isCurrent = id === currentService;
            return (
              <motion.li
                key={id}
                variants={listItem}
                className={`border-l-2 md:border-l-0 md:border-t-2 ${
                  isCurrent ? STAGE_RULE[id] : 'border-ink/10'
                }`}
              >
                <a {...linkTo(id)} className="block pl-4 py-4 md:pl-0 md:pr-2">
                  <p className={`text-2xl font-bold ${theme.ink}`}>{STAGE_RANGE[id]}</p>
                  <div className="flex items-baseline gap-2 flex-wrap mt-1">
                    <h3 className="text-ink">{theme.role}</h3>
                    {isCurrent && <span className={`tag ${theme.tint} ${theme.ink}`}>目前階段</span>}
                  </div>
                  <p className="text-sm text-ink-muted leading-relaxed mt-1">{SERVICE_PITCH[id]}</p>
                </a>
              </motion.li>
            );
          })}
        </motion.ol>
      </section>

      {/* The whole panel is the way into the about page, which says all of
          this in full. A signed-in parent has already decided; they keep the
          footer link. */}
      {!signedIn && (
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          {...pressable(() => goTo('about'))}
          aria-label="孩子的紀錄誰看得到，以及資料從哪裡來"
          className="panel-tap space-y-3"
        >
          <h2 className="text-ink">孩子的紀錄，只有你和你邀請的人看得到</h2>
          <ul className="space-y-1.5 text-sm text-ink-muted leading-relaxed">
            {TRUST_POINTS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <p className="text-sm text-ink-muted leading-relaxed">
            時程與名冊整理自國健署、社家署、疾管署與 WHO 的公開資料。
          </p>
          <p className="text-sm font-medium text-primary-dark">
            看完整說明：資料存在哪裡、每個數字從哪來
          </p>
        </motion.section>
      )}

      <footer className="text-xs text-ink-faint space-y-1">
        <p>
          <a
            href="/about"
            onClick={(event) => {
              event.preventDefault();
              goTo('about');
            }}
            className="inline-flex items-center min-h-tap text-ink-muted underline underline-offset-2"
          >
            關於資料與來源
          </a>
        </p>
        <p>本站內容為參考資料，不能取代醫師的判斷。</p>
        <p>© {new Date().getFullYear()} LittleSteps</p>
      </footer>
    </div>
  );
}

/** Ctrl, Cmd, Shift or middle click: the visitor asked the browser for a new tab. */
function isModifiedClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function SignedInHero({
  childName,
  currentService,
  onContinue,
  onAddChild,
  onJoinChild,
}: Pick<
  HubLandingProps,
  'childName' | 'currentService' | 'onContinue' | 'onAddChild' | 'onJoinChild'
>) {
  if (childName && onContinue) {
    const theme = currentService ? SERVICE_THEME[currentService] : undefined;
    return (
      <>
        <motion.h1 variants={listItem} className="text-3xl sm:text-4xl text-ink">
          <span className="inline-block">繼續記錄</span>
          <span className="inline-block max-w-full truncate align-bottom">{childName}</span>
        </motion.h1>
        {theme && (
          <motion.p variants={listItem} className="mt-2 text-sm text-ink-muted">
            目前階段：{theme.role}
          </motion.p>
        )}
        <motion.div variants={listItem} className="mt-5 sm:max-w-sm">
          <button
            type="button"
            onClick={onContinue}
            className={`btn-primary w-full ${theme ? `${theme.fill} ${theme.fillText}` : ''}`}
          >
            打開紀錄
          </button>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <motion.h1 variants={listItem} className="text-3xl sm:text-4xl text-ink">
        先新增一個寶寶
      </motion.h1>
      <motion.p variants={listItem} className="mt-3 text-base text-ink-muted leading-relaxed">
        懷孕中也可以：填預產期，就從孕期開始記。
      </motion.p>
      {onAddChild && (
        <motion.div variants={listItem} className="mt-5 sm:max-w-sm">
          <button type="button" onClick={onAddChild} className="btn-primary w-full">
            新增寶寶
          </button>
          {/* A second carer signs in to an account with no child and would
              otherwise create a duplicate of the one the family already keeps. */}
          {onJoinChild && (
            <button type="button" onClick={onJoinChild} className="btn-ghost w-full mt-2 text-sm">
              家人已經在記了？用代碼加入
            </button>
          )}
        </motion.div>
      )}
    </>
  );
}
