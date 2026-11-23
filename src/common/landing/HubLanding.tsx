import { motion } from 'framer-motion';
import type { User } from 'firebase/auth';
import { COVERAGE } from '../about/dataSources';
import { MAX_CHILDREN } from '../childLimits';
import { goTo } from '../navigate';
import { fadeInUp, listItem, stagger } from '../ui/motion';
import { pressable } from '../ui/pressable';
import { SERVICE_THEME } from '../ui/serviceTheme';
import type { ServiceId } from '../ui/serviceTheme';
import { SERVICE_GROUPS, SERVICE_PITCH, STAGE_RANGE } from './serviceCopy';

/**
 * The landing page: the one place that says what the whole product is.
 *
 * It used to be a chooser — six cards under a headline — which answered
 * "which service" for someone who already knew what the services were, and
 * gave a first-time visitor no wordmark, no proof and no action above the
 * fold. It now reads in the order a stranger needs: what this is, one thing
 * to do about it, why the numbers can be believed, then the six services,
 * then who can see a child's records.
 *
 * Three rules the page keeps:
 *
 * - One primary action per state. Signed out it is sign-in, with the nursing
 *   room map as the way in for someone not ready to hand over an account.
 *   Signed in it is the child's own service, and the pitch below it is gone:
 *   a returning parent came to record something, not to be sold to.
 * - Every service has exactly one card, and the whole card is the tap target.
 *   This page is the only route to the sibling services.
 * - No number is typed here. The proof strip reads `COVERAGE`, the card lines
 *   read `serviceCopy.ts`, and both are held against the data by tests.
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
}

/**
 * The radar's count is left out of the strip. Its dataset is refreshed by a
 * job that needs a Taiwan-routed runner, and when that job falls behind the
 * board says so itself; a headline number here would promise more than the
 * board below it can show.
 */
const PROOF = COVERAGE.filter((item) => item.unit !== '種傳染病');

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
}: HubLandingProps) {
  const signedIn = Boolean(user);

  return (
    <div className="screen-body-wide space-y-10">
      <motion.section
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="pt-4 sm:pt-10 sm:text-center"
      >
        {signedIn ? (
          <SignedInHero
            childName={childName}
            currentService={currentService}
            onContinue={onContinue}
            onAddChild={onAddChild}
          />
        ) : (
          <>
            {/* Chinese has no word breaks, so a narrow screen would split the
                headline mid-phrase. Each phrase is its own inline-block and
                the line can only break between them. */}
            <motion.h1 variants={listItem} className="text-3xl sm:text-4xl text-ink">
              <span className="inline-block">從懷孕到三歲，</span>
              <span className="inline-block">該記的都在這裡</span>
            </motion.h1>
            <motion.p
              variants={listItem}
              className="mt-3 text-base text-ink-muted leading-relaxed max-w-xl sm:mx-auto"
            >
              產檢、疫苗、里程碑照時程排好，每天的餵奶和睡眠記在同一份檔案。
            </motion.p>

            {onSignIn && (
              <motion.div
                variants={listItem}
                className="mt-6 flex flex-col gap-3 sm:max-w-sm sm:mx-auto"
              >
                <button type="button" onClick={onSignIn} className="btn-primary w-full">
                  使用 Google 帳號開始記錄
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('babyoasis')}
                  className="btn-secondary w-full"
                >
                  先不登入，找最近的哺乳室
                </button>
                <p className="text-xs text-ink-muted">
                  目前免費，一個帳號最多記錄 {MAX_CHILDREN} 個寶寶。知識內容與地圖不需要帳號。
                </p>
              </motion.div>
            )}
          </>
        )}
      </motion.section>

      {!signedIn && (
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          aria-label="資料涵蓋範圍"
          className="space-y-1 sm:text-center"
        >
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-4">
            {PROOF.map((item) => (
              // Number first on screen, label first in the markup: a `dt`
              // must precede its `dd`, and the number is what the eye wants.
              <div key={item.unit} className="flex flex-col-reverse">
                <dt className="text-xs text-ink-muted">{item.unit}</dt>
                <dd className="text-2xl font-bold text-ink tabular-nums">
                  {item.value.toLocaleString('en-US')}
                </dd>
              </div>
            ))}
          </dl>
          <p className="text-sm text-ink-muted">來自國健署、社家署、疾管署與 WHO 的公開資料。</p>
          <p>
            <a
              href="/about"
              onClick={(event) => {
                event.preventDefault();
                goTo('about');
              }}
              className="inline-flex items-center min-h-tap text-sm font-medium text-primary-dark"
            >
              看每個數字的出處
            </a>
          </p>
        </motion.section>
      )}

      {SERVICE_GROUPS.map((group) => (
        <section key={group.title} className="space-y-3">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <h2 className="text-ink">{group.title}</h2>
            <p className="text-sm text-ink-muted mt-1">{group.note}</p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-3"
          >
            {group.ids.map((id) => {
              const theme = SERVICE_THEME[id];
              const range = (STAGE_RANGE as Partial<Record<ServiceId, string>>)[id];

              return (
                <motion.div
                  key={id}
                  variants={listItem}
                  {...pressable(() => onNavigate(id))}
                  className="card-tap"
                >
                  {/* The role leads, not the wordmark: the suite and the
                      0-12 month service are both called LittleSteps, and
                      「寶寶成長」 is the name that tells them apart. The
                      labels stay outside the h3 so its accessible name is
                      exactly the role. */}
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h3 className={theme.ink}>{theme.role}</h3>
                    {range && <span className="text-xs text-ink-muted">{range}</span>}
                    {id === currentService && (
                      <span className={`tag ${theme.tint} ${theme.ink}`}>目前階段</span>
                    )}
                  </div>
                  <p className="text-xs text-ink-faint">{theme.name}</p>
                  <p className={`text-sm ${theme.body} leading-relaxed mt-2`}>
                    {SERVICE_PITCH[id]}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      ))}

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
          <p className="text-sm text-ink-faint">
            內容整理自政府與 WHO 的公開資料，不是醫療建議，不能取代醫師的判斷。
          </p>
          <p className="text-sm font-medium text-primary-dark">
            看完整說明：資料存在哪裡、每個數字從哪來
          </p>
        </motion.section>
      )}

      <footer className="text-center text-xs text-ink-faint space-y-1">
        <p>
          <a
            href="/about"
            onClick={(event) => {
              event.preventDefault();
              goTo('about');
            }}
            className="inline-flex items-center min-h-tap px-2 text-ink-muted underline underline-offset-2"
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

function SignedInHero({
  childName,
  currentService,
  onContinue,
  onAddChild,
}: Pick<HubLandingProps, 'childName' | 'currentService' | 'onContinue' | 'onAddChild'>) {
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
        <motion.div variants={listItem} className="mt-5 sm:max-w-sm sm:mx-auto">
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
        <motion.div variants={listItem} className="mt-5 sm:max-w-sm sm:mx-auto">
          <button type="button" onClick={onAddChild} className="btn-primary w-full">
            新增寶寶
          </button>
        </motion.div>
      )}
    </>
  );
}
