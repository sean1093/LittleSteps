import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Flower2, LogIn, Sun } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AppHomeButton from '../components/AppHomeButton';

type IntroService = 'littlebloom' | 'littleexplorer';

interface ServiceIntro {
  icon: LucideIcon;
  name: string;
  chineseName: string;
  tagline: string;
  features: { title: string; detail: string }[];
  /** 不需登入就能看的內容入口 */
  publicLink: { label: string; hash: string };
  theme: {
    pageBg: string;
    iconBg: string;
    iconText: string;
    heading: string;
    body: string;
    bullet: string;
    cta: string;
    ghost: string;
  };
}

/**
 * 未登入時，各服務用來自我介紹的首頁。
 *
 * LittleSteps 有自己一頁手寫的 LandingPage，內容比這裡豐富得多，故不改用這支；
 * 這支服務的是 LittleBloom 與 LittleExplorer，兩者共用同一套版型以維持一致。
 */
const SERVICE_INTRO: Record<IntroService, ServiceIntro> = {
  littlebloom: {
    icon: Flower2,
    name: 'LittleBloom',
    chineseName: '孕期陪伴',
    tagline: '從第一次心跳到見面那天，替妳記住每一週的變化。',
    features: [
      { title: '每週孕期指南', detail: '依懷孕週數顯示這一週的身體變化與該注意的事。' },
      { title: '產檢時程', detail: '記錄每次產檢的日期與院所，不再翻媽媽手冊找。' },
      { title: '孕期知識庫', detail: '常見孕期狀況的成因、處理方式與就醫時機。' },
    ],
    publicLink: { label: '先看孕期知識庫', hash: '#/littlebloom/wiki' },
    theme: {
      pageBg: 'bg-bloom-cream',
      iconBg: 'bg-gradient-to-br from-bloom-dusty-rose/20 to-bloom-mauve/20',
      iconText: 'text-bloom-dusty-rose',
      heading: 'text-bloom-stone',
      body: 'text-bloom-stone/70',
      bullet: 'bg-bloom-dusty-rose',
      cta: 'bg-gradient-to-r from-bloom-dusty-rose to-bloom-mauve',
      ghost: 'text-bloom-dusty-rose hover:bg-bloom-dusty-rose/10',
    },
  },
  littleexplorer: {
    icon: Sun,
    name: 'LittleExplorer',
    chineseName: '幼兒期陪伴',
    tagline: '1 到 3 歲什麼都想自己來。陪你看懂他正在學會什麼。',
    features: [
      { title: '成長檢核', detail: '12-36 個月分五個階段，看孩子這個年紀會了什麼、還在練什麼。' },
      { title: '照護提醒', detail: '健檢、疫苗、塗氟依出生日自動排程，可一鍵匯出到行事曆。' },
      { title: '幼兒百科', detail: '如廁、語言、情緒、挑食、生病，44 篇對照官方指引的照顧指南。' },
      { title: '成長日記', detail: '記下那些不會出現在數據裡的時刻。' },
    ],
    publicLink: { label: '先看幼兒百科', hash: '#/littleexplorer/wiki' },
    theme: {
      pageBg: 'bg-explorer-sand',
      iconBg: 'bg-gradient-to-br from-explorer-sunbeam/20 to-explorer-meadow/20',
      iconText: 'text-explorer-sunbeam-dark',
      heading: 'text-explorer-bark',
      body: 'text-explorer-bark/70',
      bullet: 'bg-explorer-sunbeam',
      cta: 'bg-gradient-to-r from-explorer-sunbeam to-explorer-meadow',
      ghost: 'text-explorer-sunbeam-dark hover:bg-explorer-sunbeam/15',
    },
  },
};

interface ServiceLandingPageProps {
  service: IntroService;
  onSignIn: () => Promise<void>;
}

export default function ServiceLandingPage({ service, onSignIn }: ServiceLandingPageProps) {
  const intro = SERVICE_INTRO[service];
  const Icon = intro.icon;
  const { theme } = intro;

  return (
    <div className={`min-h-screen ${theme.pageBg} px-4 py-8`}>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-end mb-4">
          <AppHomeButton className="bg-white/70 hover:bg-white text-gray-700" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-soft p-8"
        >
          <div className={`w-16 h-16 rounded-2xl ${theme.iconBg} flex items-center justify-center mb-6`}>
            <Icon className={`w-9 h-9 ${theme.iconText}`} />
          </div>

          <h1 className={`text-3xl font-bold ${theme.heading} mb-1`}>{intro.name}</h1>
          <p className={`text-sm ${theme.body} mb-4`}>{intro.chineseName}</p>
          <p className={`${theme.body} leading-relaxed mb-8`}>{intro.tagline}</p>

          <ul className="space-y-4 mb-8">
            {intro.features.map((feature) => (
              <li key={feature.title} className="flex gap-3">
                <span className={`w-1.5 h-1.5 rounded-full ${theme.bullet} mt-2 shrink-0`} />
                <div>
                  <p className={`font-semibold ${theme.heading}`}>{feature.title}</p>
                  <p className={`text-sm ${theme.body} leading-relaxed`}>{feature.detail}</p>
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={onSignIn}
            className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl ${theme.cta} text-white font-semibold shadow-soft hover:shadow-soft-lg transition-all`}
          >
            <LogIn className="w-5 h-5" />
            使用 Google 登入開始使用
          </button>

          <p className={`text-xs ${theme.body} text-center mt-3`}>
            記錄功能需要登入才能跨裝置同步，知識內容不需登入即可閱讀。
          </p>

          <button
            type="button"
            onClick={() => {
              window.location.hash = intro.publicLink.hash;
            }}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 mt-4 rounded-2xl font-medium transition-colors ${theme.ghost}`}
          >
            <BookOpen className="w-5 h-5" />
            {intro.publicLink.label}
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
