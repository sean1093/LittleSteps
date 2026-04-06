import { motion } from 'framer-motion';
import { Baby, Heart, Sparkles, ArrowRight, Calendar, Shield, UtensilsCrossed, Syringe } from 'lucide-react';
import { User } from 'firebase/auth';

interface LandingPageProps {
  onNavigate: (page: 'milestones' | 'care-guide' | 'vaccine-tracking' | 'complementary-food') => void;
  user: User | null;
  onSignIn: () => Promise<void>;
}

export default function LandingPage({ onNavigate, user, onSignIn }: LandingPageProps) {
  const features = [
    {
      id: 'milestones',
      icon: Baby,
      title: '里程碑追蹤',
      description: '記錄寶寶每個珍貴的成長時刻，從第一個微笑到第一步，見證每個里程碑的達成',
      color: 'from-pink-400 to-pink-600',
      bgColor: 'bg-pink-50',
      page: 'milestones' as const
    },
    {
      id: 'care-guide',
      icon: Shield,
      title: '照顧重點',
      description: '各階段專業照護建議，從生理發展到安全注意事項，給您最完整的育兒指南',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      page: 'care-guide' as const
    },
    {
      id: 'vaccine',
      icon: Syringe,
      title: '疫苗追蹤',
      description: '完整的疫苗接種時程表，詳細記錄公費自費項目，掌握每一劑接種時機',
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      page: 'vaccine-tracking' as const
    },
    {
      id: 'food',
      icon: UtensilsCrossed,
      title: '副食品指南',
      description: '科學的副食品添加方法，從4個月到1歲的完整攻略，讓寶寶吃得健康又安心',
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-50',
      page: 'complementary-food' as const
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-white via-pink-50/30 to-blue-50/30">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 px-4 py-16"
      >
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Logo & Title */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-soft">
              <Baby className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              LittleSteps
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-xl md:text-2xl text-gray-700 mb-4 font-medium"
          >
            陪伴您與寶寶的每一小步
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            成為新手父母是一段充滿驚喜與挑戰的旅程。LittleSteps 在這裡，
            為您提供專業的育兒指南、貼心的成長記錄，讓您在育兒路上更加從容自信。
          </motion.p>

          {/* CTA Badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-soft">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-gray-700">專業育兒知識</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-soft">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">完全免費使用</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-soft">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">即時追蹤記錄</span>
            </div>
          </motion.div>

          {/* Sign In Button */}
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex flex-col items-center gap-4 mb-8"
            >
              <p className="text-sm text-gray-600 font-medium">
                登入以保存您的寶寶成長記錄
              </p>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={async () => {
                  try {
                    await onSignIn();
                  } catch (error: any) {
                    // User cancelled the login popup - ignore the error
                    if (error?.code === 'auth/popup-closed-by-user') {
                      return;
                    }
                    // Log other errors
                    console.error('登入失敗:', error);
                  }
                }}
                className="group relative flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white shadow-soft-lg hover:shadow-xl transition-all overflow-hidden"
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

                <div className="relative flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <img
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="Google"
                      className="w-6 h-6"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-lg leading-tight">使用 Google 登入</span>
                    <span className="text-xs text-white/90 leading-tight">跨裝置同步，永久保存</span>
                  </div>
                </div>
              </motion.button>
            </motion.div>
          )}

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-sm text-gray-500">探索功能</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowRight className="w-5 h-5 text-primary rotate-90" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-4 py-16"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            完整的育兒工具箱
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            從寶寶出生到一歲，我們為您準備了所有必要的追蹤與指南工具
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="cursor-pointer"
                onClick={() => onNavigate(feature.page)}
              >
                <div className={`card h-full ${feature.bgColor} border-2 border-transparent hover:border-primary/20 transition-all`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-soft flex-shrink-0`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-primary font-medium text-sm group">
                    <span>立即開始使用</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Testimonial / Support Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <Heart className="w-8 h-8 text-red-400" />
            <Heart className="w-6 h-6 text-red-300" />
            <Heart className="w-4 h-4 text-red-200" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            您不是一個人在奮鬥
          </h3>
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto mb-6">
            育兒之路充滿挑戰，但也充滿喜悅。LittleSteps 致力於成為您最可靠的數位育兒夥伴，
            提供科學實用的建議，讓您在陪伴寶寶成長的每一步都更加安心與自信。
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span>✨ 基於最新兒科醫學建議</span>
            <span>•</span>
            <span>🛡️ 重視寶寶健康安全</span>
            <span>•</span>
            <span>💙 支持新手父母成長</span>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Baby className="w-5 h-5 text-primary" />
            <span className="font-semibold text-gray-800">LittleSteps</span>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} LittleSteps • 陪伴寶貝每一步成長
          </p>
        </div>
      </div>
    </div>
  );
}
