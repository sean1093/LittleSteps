import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import AppHomeButton from '../components/AppHomeButton';
import { fadeInUp, tap } from '../ui/motion';
import { SERVICE_THEME } from '../ui/serviceTheme';
import { goTo } from '../navigate';
import type { Page } from '../../types/routes';

type IntroService = 'littlebloom' | 'littleexplorer';

interface ServiceIntro {
  tagline: string;
  features: { title: string; detail: string }[];
  /** 不需登入就能看的內容入口 */
  publicLink: { label: string; page: Page };
}

/**
 * 未登入時，各服務用來自我介紹的首頁。
 *
 * LittleSteps 有自己一頁手寫的 StepsLanding，內容比這裡豐富得多，故不改用這支；
 * 這支服務的是 LittleBloom 與 LittleExplorer，兩者共用同一套版型以維持一致。
 *
 * 名稱、中文角色、配色與識別圖示都來自 SERVICE_THEME；這裡只留各服務真正不同
 * 的文案。原本每個服務在這裡另寫一份 theme 物件，於是同一個服務的顏色有兩份
 * 定義。
 */
const SERVICE_INTRO: Record<IntroService, ServiceIntro> = {
  littlebloom: {
    tagline: '從第一次心跳到見面那天，替妳記住每一週的變化。',
    features: [
      { title: '每週孕期指南', detail: '依懷孕週數顯示這一週的身體變化與該注意的事。' },
      { title: '產檢時程', detail: '記錄每次產檢的日期與院所，不再翻媽媽手冊找。' },
      { title: '孕期知識庫', detail: '常見孕期狀況的成因、處理方式與就醫時機。' },
    ],
    publicLink: { label: '先看孕期知識庫', page: 'littlebloom/wiki' },
  },
  littleexplorer: {
    tagline: '1 到 3 歲什麼都想自己來。陪你看懂他正在學會什麼。',
    features: [
      { title: '成長檢核', detail: '12-36 個月分五個階段，看孩子這個年紀會了什麼、還在練什麼。' },
      { title: '照護提醒', detail: '健檢、疫苗、塗氟依出生日自動排程，可一鍵匯出到行事曆。' },
      { title: '幼兒百科', detail: '如廁、語言、情緒、挑食、生病，45 篇對照官方指引的照顧指南。' },
      { title: '成長日記', detail: '記下那些不會出現在數據裡的時刻。' },
    ],
    publicLink: { label: '先看幼兒百科', page: 'littleexplorer/wiki' },
  },
};

interface ServiceLandingProps {
  service: IntroService;
  onSignIn: () => Promise<void>;
}

export default function ServiceLanding({ service, onSignIn }: ServiceLandingProps) {
  const intro = SERVICE_INTRO[service];
  const theme = SERVICE_THEME[service];
  const Icon = theme.icon;

  return (
    <div className={`min-h-dscreen ${theme.pageBg}`}>
      <div className="screen-body">
        <div className="flex justify-end mb-2">
          <AppHomeButton />
        </div>

        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="panel">
          {/* 全 app 唯一保留的識別圖示：這是第一次看到這個服務的人唯一的自我介紹頁。 */}
          <Icon className={`w-8 h-8 mb-4 ${theme.ink}`} aria-hidden="true" />

          <h1 className={`sm:text-3xl ${theme.ink}`}>{theme.name}</h1>
          <p className={`text-sm ${theme.muted} mb-4`}>{theme.role}</p>
          <p className={`${theme.body} leading-relaxed mb-8`}>{intro.tagline}</p>

          <ul className="space-y-4 mb-8">
            {intro.features.map((feature) => (
              <li key={feature.title}>
                <p className={`font-semibold ${theme.body}`}>{feature.title}</p>
                <p className={`text-sm ${theme.muted} leading-relaxed`}>{feature.detail}</p>
              </li>
            ))}
          </ul>

          <motion.button
            type="button"
            whileTap={tap}
            onClick={onSignIn}
            className={`btn-primary w-full ${theme.fill} ${theme.fillText}`}
          >
            使用 Google 登入開始使用
          </motion.button>

          <p className={`text-xs ${theme.muted} text-center mt-3`}>
            記錄功能需要登入才能跨裝置同步，知識內容不需登入即可閱讀。
          </p>

          <motion.button
            type="button"
            whileTap={tap}
            onClick={() => {
              goTo(intro.publicLink.page);
            }}
            className={`btn-ghost w-full mt-3 ${theme.ink}`}
          >
            {intro.publicLink.label}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
