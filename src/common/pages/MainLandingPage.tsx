import { motion } from 'framer-motion';
import { Baby, Flower2, Heart, Sparkles, ArrowRight, Sun, MapPin } from 'lucide-react';

/**
 * MainLandingPage - Entry point for LittleSteps, LittleBloom, and BabyOasis apps
 *
 * Provides warm, inviting introduction to all applications
 */

interface MainLandingPageProps {
  onNavigate: (page: 'littlesteps' | 'littlebloom' | 'babyoasis') => void;
}

export default function MainLandingPage({ onNavigate }: MainLandingPageProps) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-white via-white to-warm-cream relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.03, 0.05, 0.03]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-primary rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.03, 0.05, 0.03]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-bloom-sage rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 py-16 max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="text-center mb-20"
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="inline-block"
            >
              <Heart className="w-20 h-20 text-primary mx-auto mb-4 fill-primary/20" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-bloom-dusty-rose bg-clip-text text-transparent mb-4">
              用愛陪伴，溫柔守護
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              從懷孕到育兒，每個階段都值得被用心記錄
              <br />
              讓我們陪伴你走過這段珍貴的旅程
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex items-center justify-center gap-2 text-gray-500">
            <Sparkles className="w-5 h-5" />
            <p className="text-sm">為台灣新手爸媽與準媽媽量身打造</p>
            <Sparkles className="w-5 h-5" />
          </motion.div>
        </motion.div>

        {/* Two App Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          {/* LittleBloom Card */}
          <motion.div variants={fadeInUp}>
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('littlebloom')}
              className="bg-white rounded-3xl p-8 shadow-soft hover:shadow-soft-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-bloom-dusty-rose/30 h-full"
            >
              {/* Icon Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-bloom-dusty-rose/20 to-bloom-mauve/20 flex items-center justify-center">
                  <Flower2 className="w-9 h-9 text-bloom-dusty-rose" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-bloom-stone mb-1">
                    LittleBloom
                  </h2>
                  <p className="text-sm text-bloom-stone/60">孕期陪伴</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <p className="text-bloom-stone/80 leading-relaxed mb-4">
                  專為準媽媽設計的溫柔陪伴空間，用心記錄每一個孕期時刻
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-bloom-stone/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-bloom-dusty-rose" />
                    <span>孕期追蹤與產檢規劃</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-bloom-stone/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-bloom-sage" />
                    <span>專業孕期知識與營養指南</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-bloom-stone/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-bloom-mauve" />
                    <span>身心紀錄與情緒日記</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-6">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-bloom-dusty-rose/10 text-bloom-dusty-rose text-xs font-medium">
                  <Sparkles className="w-3 h-3" />
                  即將推出
                </span>
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ x: 4 }}
                className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-gradient-to-r from-bloom-dusty-rose to-bloom-mauve text-white font-medium shadow-soft hover:shadow-soft-lg transition-all"
              >
                <span>進入孕期陪伴</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* LittleSteps Card */}
          <motion.div variants={fadeInUp}>
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('littlesteps')}
              className="bg-white rounded-3xl p-8 shadow-soft hover:shadow-soft-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/30 h-full"
            >
              {/* Icon Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Baby className="w-9 h-9 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    LittleSteps
                  </h2>
                  <p className="text-sm text-gray-500">寶寶成長追蹤</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  完整記錄寶寶的每個成長瞬間，讓珍貴的回憶不再錯過
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>里程碑追蹤與發展紀錄</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span>疫苗接種時程管理</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    <span>快速日誌與睡眠分析</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-6">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  立即可用
                </span>
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ x: 4 }}
                className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-medium shadow-soft hover:shadow-soft-lg transition-all"
              >
                <span>開始記錄成長</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* BabyOasis Card - Standalone Feature */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('babyoasis')}
            className="bg-white rounded-3xl p-8 shadow-soft hover:shadow-soft-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-400/30 max-w-3xl mx-auto"
          >
            {/* Icon Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                <MapPin className="w-9 h-9 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  BabyOasis
                </h2>
                <p className="text-sm text-gray-500">哺乳室地圖</p>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                立即可用
              </span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                找到最近的哺乳室，讓外出育兒更輕鬆自在。改善政府地圖的使用體驗，提供更友善的搜尋與導航功能。
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span>定位最近哺乳室</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>詳細設施資訊</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  <span>一鍵導航</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  <span>評分與評論</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ x: 4 }}
              className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium shadow-soft hover:shadow-soft-lg transition-all"
            >
              <span>探索附近哺乳室</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Journey Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-soft"
        >
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
            陪伴你的育兒旅程
          </h3>
          <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-white/80 transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-bloom-dusty-rose/20 to-bloom-mauve/20 flex items-center justify-center">
                <Flower2 className="w-7 h-7 text-bloom-dusty-rose" />
              </div>
              <span className="text-sm font-medium text-bloom-stone">孕期</span>
              <span className="text-xs text-gray-500">0-40 週</span>
            </motion.div>

            <div className="hidden md:block w-12 h-0.5 bg-gradient-to-r from-bloom-dusty-rose to-primary" />

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-white/80 transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Baby className="w-7 h-7 text-primary" />
              </div>
              <span className="text-sm font-medium text-gray-800">新生兒</span>
              <span className="text-xs text-gray-500">0-12 月</span>
            </motion.div>

            <div className="hidden md:block w-12 h-0.5 bg-gradient-to-r from-primary to-secondary" />

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-white/80 transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                <Sun className="w-7 h-7 text-secondary" />
              </div>
              <span className="text-sm font-medium text-gray-800">幼兒期</span>
              <span className="text-xs text-gray-500">1-3 歲</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 text-sm mb-2">
            ✨ 用心陪伴每個家庭的珍貴時光 ✨
          </p>
          <p className="text-gray-400 text-xs">
            © 2026 LittleSteps & LittleBloom - Made with ❤️ in Taiwan
          </p>
        </motion.div>
      </div>
    </div>
  );
}
