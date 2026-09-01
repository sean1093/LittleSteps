import { motion } from 'framer-motion';
import { User } from 'firebase/auth';
import AppHomeButton from '../components/AppHomeButton';
import { fadeInUp, hoverLift, listItem, stagger, tap } from '../ui/motion';

interface StepsLandingProps {
  /** 只能指向 LittleSteps 免登入的內容；功能頁要先登入，導過去只會退回這一頁。 */
  onNavigate: (page: 'littlesteps/baby-wiki' | 'littlesteps/care-guide' | 'littlesteps/sleep-training') => void;
  user: User | null;
  onSignIn: () => Promise<void>;
}

/** 各段落共用的欄寬與上下節奏，取代原本每段各自寫一份 px-4 py-16。 */
const SECTION = 'screen-body-wide py-10 sm:py-14';

/** 段標題只有一個尺度，從手機起跳。 */
const SECTION_HEADING = 'text-xl sm:text-2xl text-ink';

const WHY_CHOOSE = [
  {
    title: '看見成長的軌跡',
    detail:
      '不用再翻找兒童手冊，輸入身高體重，我們自動對標 WHO 標準，讓你一眼看見寶寶長大的證據',
  },
  {
    // 這一格原本講的是相簿分類標籤，但這個 app 從來沒有照片功能——那還只是
    // 未來規劃。換成真的做得到的事：疫苗健檢時程、副食品試敏、看診摘要。
    title: '該打的、該吃的，都不會漏',
    detail:
      '公費疫苗與兒童健檢依出生日自動排好時程，副食品一樣一樣試、過敏反應一筆一筆記；下次看診前一鍵整理成摘要，不用再憑印象回答醫師',
  },
  {
    title: '育兒路上，你不孤單',
    detail: '整合最新睡眠與成長知識，根據寶寶的月齡，提供最貼心的發展建議',
  },
];

const QUICK_FEATURES = [
  { title: '照顧重點', desc: '各階段專業照護建議', open: 'littlesteps/care-guide' as const },
  { title: '寶寶百科', desc: '常見照顧問題與處理方式', open: 'littlesteps/baby-wiki' as const },
  { title: '里程碑追蹤', desc: '記錄寶寶每個珍貴的成長時刻' },
  { title: '疫苗追蹤', desc: '完整的疫苗接種時程表' },
  { title: '副食品指南', desc: '科學的副食品添加方法' },
];

/**
 * LittleSteps 未登入時的介紹頁。登入後要去哪由 LandingPage 統一決定——
 * 這裡原本也有一份 useEffect 會在登入瞬間跳去儀表板，但它不看使用者有沒有
 * 孩子，剛註冊的人會落在空的儀表板上。
 */
export default function StepsLanding({ onNavigate, user, onSignIn }: StepsLandingProps) {
  return (
    <div className="min-h-dscreen bg-warm-white">
      {/*
        沒登入時，任何需要登入的 LittleSteps 路由都會落到這一頁——登出後、
        從書籤進入、瀏覽器還原分頁都算。少了這顆按鈕，這裡就是死路：頁面
        完全沒提到另外三個服務，也沒有回服務集合首頁的路，只能手動改網址。
        LittleBloom 與 LittleExplorer 的介紹頁一直都有（ServiceLandingPage）。
      */}
      <div className="max-w-4xl mx-auto px-4 pt-4 flex justify-end">
        <AppHomeButton />
      </div>

      {/* Hero */}
      <section className={`${SECTION} pt-6 text-center`}>
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.h1
            variants={listItem}
            className="text-3xl sm:text-4xl md:text-5xl text-ink mb-5 leading-tight"
          >
            從第一次翻身到第一聲爸媽，
            <br />
            <span className="text-primary-dark">LittleSteps 陪你見證</span>
            <br />
            每一公分的感動
          </motion.h1>

          <motion.p
            variants={listItem}
            className="text-base sm:text-lg text-ink-muted max-w-2xl mx-auto leading-relaxed"
          >
            那些轉瞬即逝的小日子，我們幫你好好收著
          </motion.p>

          {!user && (
            <motion.div variants={listItem} className="mt-8 flex flex-col items-center gap-4">
              <motion.button
                type="button"
                whileHover={hoverLift}
                whileTap={tap}
                onClick={onSignIn}
                className="btn-primary"
              >
                {/* 這裡原本掛一張 gstatic.com 的 Google 圖示。離線或被擋下時，
                    已安裝的 PWA 的第一個畫面就會出現破圖——為了一個裝飾去依賴
                    外部網域不值得，其他三處登入按鈕也都只有文字。 */}
                <span>開始記錄寶寶的每一步</span>
              </motion.button>
              <p className="text-sm text-ink-faint">完全免費 • 跨裝置同步 • 隱私安全</p>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Why Choose LittleSteps */}
      <section className="bg-white">
        <div className={SECTION}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-8"
          >
            <h2 className={`${SECTION_HEADING} mb-2`}>為什麼選擇 LittleSteps？</h2>
            <p className="text-ink-muted max-w-2xl mx-auto">
              我們懂新手爸媽的不安與期待，用溫暖的科技陪伴你們
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid sm:grid-cols-3 gap-6"
          >
            {WHY_CHOOSE.map((feature) => (
              <motion.div key={feature.title} variants={listItem}>
                <h3 className="text-ink mb-2">{feature.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{feature.detail}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Sleep Guide CTA */}
      <section className="bg-secondary-light">
        <div className={SECTION}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="panel"
          >
            <h2 className={`${SECTION_HEADING} mb-2`}>今晚，讓全家人都好眠</h2>
            <p className="text-ink-muted mb-5 leading-relaxed">
              整理自衛生福利部與各界育兒專家，給新手爸媽的睡眠救星
            </p>
            <motion.button
              type="button"
              whileHover={hoverLift}
              whileTap={tap}
              onClick={() => onNavigate('littlesteps/sleep-training')}
              className="btn-primary bg-secondary-dark w-full sm:w-auto"
            >
              查看 0-3 歲科學睡眠指南
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Quick Features Grid */}
      <section className={SECTION}>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className={`${SECTION_HEADING} mb-6 text-center`}
        >
          完整的育兒工具箱
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid sm:grid-cols-2 gap-4"
        >
          {QUICK_FEATURES.map((feature) => (
            <motion.button
              key={feature.title}
              type="button"
              variants={listItem}
              whileHover={hoverLift}
              whileTap={tap}
              // 免登入的內容直接帶過去；需要孩子資料的才先請使用者登入。
              onClick={() => (feature.open ? onNavigate(feature.open) : onSignIn())}
              className="panel-tap text-left"
            >
              <h3 className="text-ink mb-1">{feature.title}</h3>
              <p className="text-sm text-ink-muted mb-3">{feature.desc}</p>
              <p className="text-sm font-medium text-primary-dark">
                {feature.open ? '直接閱讀，不用登入' : '登入後開始使用'}
              </p>
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* Trust & Security */}
      <section className="bg-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className={`${SECTION} text-center`}
        >
          <h2 className={`${SECTION_HEADING} mb-3`}>你的珍貴數據，我們比你更在意</h2>
          <p className="text-ink-muted leading-relaxed max-w-2xl mx-auto mb-6">
            採用 Firebase 加密存儲與安全驗證技術，確保寶寶的成長數據只屬於你的家庭，隱私無虞
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-ink-muted">
            <span>企業級加密</span>
            <span>僅限本人存取</span>
            <span>永久免費</span>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-ink/5">
        <div className={`${SECTION} text-center`}>
          <h3 className="text-ink mb-2">LittleSteps</h3>
          <p className="text-ink-muted mb-5 max-w-md mx-auto leading-relaxed">
            育兒很累，但回憶很甜。
            <br />
            LittleSteps 紀錄你的每一點小進步。
          </p>
          <p className="text-sm text-ink-faint">
            © {new Date().getFullYear()} LittleSteps • 陪伴寶貝每一步成長
          </p>
        </div>
      </footer>
    </div>
  );
}
