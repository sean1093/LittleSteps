import { motion } from 'framer-motion';
import type { User } from 'firebase/auth';
import { fadeInUp, hoverLift, listItem, stagger, tap } from '../ui/motion';
import { SERVICE_ORDER, SERVICE_THEME } from '../ui/serviceTheme';
import type { ServiceId } from '../ui/serviceTheme';

/**
 * HubLanding - Entry point for all five services
 *
 * Public: reachable without signing in, so a first-time visitor can see what
 * the collection offers before deciding to hand over an account.
 *
 * 名稱、中文角色與配色全部來自 SERVICE_THEME，因此四張卡片只剩下真正不同的
 * 東西：一句介紹、三到四條功能、以及進入按鈕的說法。原本是四段幾乎一樣的
 * 手寫區塊，差異只有 hover 邊框顏色與漸層。
 */

interface HubLandingProps {
  onNavigate: (page: ServiceId) => void;
  user?: User | null;
  onSignIn?: () => Promise<void>;
}

const SERVICE_CARD: Record<ServiceId, { blurb: string; features: string[]; cta: string }> = {
  littlebloom: {
    blurb: '專為準媽媽設計的溫柔陪伴空間，用心記錄每一個孕期時刻',
    features: [
      '孕期追蹤與產檢規劃',
      '專業孕期知識與營養指南',
      '14 次公費產檢時程與完成紀錄',
    ],
    cta: '進入孕期陪伴',
  },
  littlesteps: {
    blurb: '完整記錄寶寶的每個成長瞬間，讓珍貴的回憶不再錯過',
    features: ['里程碑追蹤與發展紀錄', '疫苗接種時程管理', '快速日誌與睡眠分析'],
    cta: '開始記錄成長',
  },
  littleexplorer: {
    blurb: '1-3 歲什麼都想自己來，陪你看懂他的每一步',
    features: ['12-36 個月成長檢核', '健檢、疫苗與塗氟提醒', '幼兒百科與成長日記'],
    cta: '進入幼兒期',
  },
  littleouting: {
    blurb: '下雨天、放假日，帶孩子能去哪？公立親子館免費又有教玩具，先查清楚再出門。',
    features: [
      '全台 234 間親子館，依縣市與年齡查',
      '免費、需不需要預約、幾歲能去',
      '精選親子餐廳與出發前檢查清單',
    ],
    cta: '找親子好去處',
  },
  babyoasis: {
    blurb:
      '找到最近的哺乳室，讓外出育兒更輕鬆自在。改善政府地圖的使用體驗，提供更友善的搜尋與導航功能。',
    features: ['定位最近哺乳室', '詳細設施資訊', '一鍵導航', '全台 22 縣市、3,852 處'],
    cta: '探索附近哺乳室',
  },
};

/**
 * 「孕期 → 新生兒 → 幼兒期」原本是三顆圓形圖示節點，用的正是上面卡片已經用過
 * 的同三個圖示——同一頁出現兩次。這裡只留這條時間軸真正在講的事：階段名稱、
 * 年齡區間，以及三者相連。
 */
const JOURNEY: { id: ServiceId; label: string; range: string }[] = [
  { id: 'littlebloom', label: '孕期', range: '0-40 週' },
  { id: 'littlesteps', label: '新生兒', range: '0-12 月' },
  { id: 'littleexplorer', label: '幼兒期', range: '1-3 歲' },
];

export default function HubLanding({ onNavigate, user, onSignIn }: HubLandingProps) {
  return (
    <div className="screen-body-wide space-y-10">
      {/* Hero */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="text-center pt-6"
      >
        <motion.h1
          variants={listItem}
          className="text-3xl sm:text-4xl md:text-5xl text-ink mb-3"
        >
          用愛陪伴，溫柔守護
        </motion.h1>

        <motion.p
          variants={listItem}
          className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-2xl mx-auto"
        >
          從懷孕到育兒，每個階段都值得被用心記錄
          <br />
          讓我們陪伴你走過這段珍貴的旅程
        </motion.p>

        <motion.p variants={listItem} className="text-sm text-ink-faint mt-4">
          為台灣新手爸媽與準媽媽量身打造
        </motion.p>

        {/* 未登入時，進入點本身就要給得出登入；否則訪客得先挑一個服務才找得到入口。 */}
        {!user && onSignIn && (
          <motion.div variants={listItem} className="mt-8">
            <motion.button
              type="button"
              whileHover={hoverLift}
              whileTap={tap}
              onClick={onSignIn}
              className="btn-primary"
            >
              使用 Google 登入
            </motion.button>
            <p className="text-xs text-ink-faint mt-3">
              知識內容不需登入即可閱讀；記錄功能登入後才能跨裝置同步
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Service cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {SERVICE_ORDER.map((id) => {
          const theme = SERVICE_THEME[id];
          const card = SERVICE_CARD[id];

          return (
            <motion.div key={id} variants={listItem} className="h-full">
              <motion.div
                whileHover={hoverLift}
                whileTap={tap}
                onClick={() => onNavigate(id)}
                className="panel-tap h-full flex flex-col"
              >
                <h2 className={theme.ink}>{theme.name}</h2>
                <p className={`text-sm ${theme.muted} mb-3`}>{theme.role}</p>
                <p className={`${theme.body} leading-relaxed mb-4`}>{card.blurb}</p>

                <ul
                  className={`list-disc list-outside pl-5 space-y-1 text-sm ${theme.muted} mb-5`}
                >
                  {card.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                {/* 卡片本身就是點擊區；這顆按鈕靠冒泡觸發，同時讓鍵盤也進得去。 */}
                <button type="button" className={`btn-primary w-full mt-auto ${theme.fill} ${theme.fillText}`}>
                  {card.cta}
                </button>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Journey */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="panel"
      >
        <h2 className="text-center mb-4 text-ink">陪伴你的育兒旅程</h2>
        <ol className="flex items-center justify-center">
          {JOURNEY.map((step, index) => (
            <li key={step.id} className="flex items-center">
              {index > 0 && (
                <span className="w-4 sm:w-10 h-px bg-ink/15 shrink-0" aria-hidden="true" />
              )}
              <button
                type="button"
                onClick={() => onNavigate(step.id)}
                className="min-h-tap px-3 rounded-2xl text-center hover:bg-ink/5 transition-colors"
              >
                <span className={`block text-sm font-semibold ${SERVICE_THEME[step.id].ink}`}>
                  {step.label}
                </span>
                <span className="block text-xs text-ink-faint">{step.range}</span>
              </button>
            </li>
          ))}
        </ol>
      </motion.div>

      <motion.p
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="text-center text-xs text-ink-faint"
      >
        © {new Date().getFullYear()} LittleBloom · LittleSteps · LittleExplorer · BabyOasis
      </motion.p>
    </div>
  );
}
