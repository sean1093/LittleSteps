import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { User } from 'firebase/auth';
import { fadeInUp, hoverLift, listItem, stagger, tap } from '../ui/motion';
import { pressable } from '../ui/pressable';
import { SERVICE_ORDER, SERVICE_THEME } from '../ui/serviceTheme';
import type { ServiceId } from '../ui/serviceTheme';

/**
 * HubLanding - Entry point for all five services
 *
 * Public: reachable without signing in, so a first-time visitor can see what
 * the collection offers before deciding to hand over an account.
 *
 * 這一頁是選擇器，不是五份疊起來的產品首頁。原本一張卡片高約 300px：名稱、
 * 中文角色、一句行銷介紹、三到四條項目符號，再加一顆只是把標題重講一遍的
 * 全寬按鈕（LittleBloom 的按鈕寫「進入孕期陪伴」）。五張疊起來 2,161px，
 * 而畫面只有 844px 高——最後一個服務要滑過兩個螢幕才看得到。
 *
 * 現在一張卡就是一列：圖示、名稱與角色、一行「做得到什麼」。整列自己就是
 * 點擊區（pressable 讓鍵盤也進得去），所以那顆按鈕不必存在。名稱、角色與
 * 配色全部來自 SERVICE_THEME，這裡只剩各服務真正不同的那一行。
 */

interface HubLandingProps {
  onNavigate: (page: ServiceId) => void;
  user?: User | null;
  onSignIn?: () => Promise<void>;
  /**
   * 目前孩子所在階段對應的服務。沒有孩子（含未登入）時省略，這一頁就和以前
   * 完全一樣——入口頁是公開的，不能因為新增了這個標記而對訪客改變。
   */
  currentService?: ServiceId;
}

/**
 * 每個服務做得到什麼。
 *
 * 這幾條是整頁唯一回答「這個服務跟另外四個差在哪」的文字，所以原字不動，
 * 只從項目符號清單改成一行併排——清單的行距與縮排是卡片高度的大宗，而讀者
 * 在選服務時要的是一眼掃過去，不是逐條讀完。想看完整說明的人按進去就有：
 * 每個服務自己的首頁本來就會把同樣的能力再展開講一次。
 *
 * 數字都對得上真實資料，serviceCopy.test.ts 會逐條比對，不要憑印象改。
 */
const SERVICE_FEATURES: Record<ServiceId, string[]> = {
  littlebloom: [
    '孕期追蹤與產檢規劃',
    '專業孕期知識與營養指南',
    '14 次公費產檢時程與完成紀錄',
  ],
  littlesteps: ['里程碑追蹤與發展紀錄', '疫苗接種時程管理', '快速日誌與睡眠分析'],
  littleexplorer: ['12-36 個月成長檢核', '健檢、疫苗與塗氟提醒', '幼兒百科與成長日記'],
  littleouting: [
    '全台 234 間親子館，依縣市與年齡查',
    '免費、需不需要預約、幾歲能去',
    '精選親子餐廳與出發前檢查清單',
  ],
  babyoasis: ['定位最近哺乳室', '詳細設施資訊', '一鍵導航', '全台 22 縣市、3,852 處'],
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

export default function HubLanding({
  onNavigate,
  user,
  onSignIn,
  currentService,
}: HubLandingProps) {
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

      {/* Service cards：一列一個服務 */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {SERVICE_ORDER.map((id) => {
          const theme = SERVICE_THEME[id];
          const Icon = theme.icon;

          return (
            <motion.div
              key={id}
              variants={listItem}
              {...pressable(() => onNavigate(id))}
              className="card-tap flex items-start gap-3"
            >
              <Icon className={`w-5 h-5 shrink-0 mt-1 ${theme.ink}`} aria-hidden="true" />

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  {/* 角色標籤放在 h2 外面：標題的可及名稱要正好是服務名。 */}
                  <h2 className={theme.ink}>{theme.name}</h2>
                  <span className={`text-xs ${theme.muted}`}>{theme.role}</span>
                  {/* 五個服務並列時，家長第一個問題是「哪一個是我的」。
                      標記回答它；順序刻意不動，見 serviceForStage。 */}
                  {id === currentService && <span className="tag">目前階段</span>}
                </div>
                <p className={`text-sm ${theme.body} leading-snug mt-1`}>
                  {SERVICE_FEATURES[id].join(' · ')}
                </p>
              </div>

              <ChevronRight
                className="w-5 h-5 shrink-0 mt-1 text-ink-faint"
                aria-hidden="true"
              />
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
