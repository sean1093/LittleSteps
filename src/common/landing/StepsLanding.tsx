import { motion } from 'framer-motion';
import { Baby, Heart, Sparkles, ArrowRight, Moon, TrendingUp, Shield, Lock, BookOpen, Camera } from 'lucide-react';
import { User } from 'firebase/auth';
import AppHomeButton from '../components/AppHomeButton';

interface StepsLandingProps {
  /** 未登入時唯一能去的 LittleSteps 內容；其餘功能都要先登入。 */
  onNavigate: (page: 'littlesteps/baby-wiki') => void;
  user: User | null;
  onSignIn: () => Promise<void>;
}

/**
 * LittleSteps 未登入時的介紹頁。登入後要去哪由 LandingPage 統一決定——
 * 這裡原本也有一份 useEffect 會在登入瞬間跳去儀表板，但它不看使用者有沒有
 * 孩子，剛註冊的人會落在空的儀表板上。
 */
export default function StepsLanding({ onNavigate, user, onSignIn }: StepsLandingProps) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/*
        沒登入時，任何需要登入的 LittleSteps 路由都會落到這一頁——登出後、
        從書籤進入、瀏覽器還原分頁都算。少了這顆按鈕，這裡就是死路：頁面
        完全沒提到另外三個服務，也沒有回服務集合首頁的路，只能手動改網址。
        LittleBloom 與 LittleExplorer 的介紹頁一直都有（ServiceLandingPage）。
      */}
      <div className="max-w-4xl mx-auto px-4 pt-6 flex justify-end">
        <AppHomeButton className="bg-white/70 hover:bg-white text-gray-700" />
      </div>

      {/* Hero Section */}
      <section className="relative px-4 pt-10 pb-20 md:pt-14 md:pb-28 overflow-hidden">
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#FFE5E5] mb-6">
              <Baby className="w-10 h-10 text-[#FF9B9B]" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              從第一次翻身到第一聲爸媽，
              <br />
              <span className="text-[#FF9B9B]">LittleSteps 陪你見證</span>
              <br />
              每一公分的感動
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            那些轉瞬即逝的小日子，我們幫你好好收著
          </motion.p>

          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col items-center gap-6"
            >
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSignIn}
                className="flex items-center gap-3 px-8 py-4 rounded-full bg-[#FF9B9B] text-white shadow-lg hover:shadow-xl transition-all"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-5 h-5 bg-white rounded-full p-0.5"
                />
                <span className="font-semibold">開始記錄寶寶的每一步</span>
              </motion.button>
              <p className="text-sm text-gray-500">完全免費 • 跨裝置同步 • 隱私安全</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Why Choose LittleSteps */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              為什麼選擇 LittleSteps？
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              我們懂新手爸媽的不安與期待，用溫暖的科技陪伴你們
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <motion.div variants={fadeInUp} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8F4F8] mb-6">
                <TrendingUp className="w-8 h-8 text-[#7EC8E3]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">看見成長的軌跡</h3>
              <p className="text-gray-600 leading-relaxed">
                不用再翻找兒童手冊，輸入身高體重，我們自動對標 WHO 標準，讓你一眼看見寶寶長大的證據
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={fadeInUp} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FFE5E5] mb-6">
                <Camera className="w-8 h-8 text-[#FF9B9B]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">別讓精彩的回憶<br />淹沒在混亂的相簿裡</h3>
              <p className="text-gray-600 leading-relaxed">
                專門為育兒設計的分類標籤，無論是第一次吃副食品還是第一步走動，都能在秒速間找回那天的感動
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={fadeInUp} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8F5E9] mb-6">
                <Heart className="w-8 h-8 text-[#81C784]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">育兒路上，你不孤單</h3>
              <p className="text-gray-600 leading-relaxed">
                整合最新睡眠與成長知識，根據寶寶的月齡，提供最貼心的發展建議
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Sleep Guide CTA */}
      <section className="px-4 py-16 bg-[#E8F4F8]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-[#E8F4F8] flex items-center justify-center">
                  <Moon className="w-12 h-12 text-[#7EC8E3]" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                  今晚，讓全家人都好眠
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  整理自衛生福利部與各界育兒專家，給新手爸媽的睡眠救星
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('littlesteps/baby-wiki')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#7EC8E3] text-white font-semibold hover:bg-[#6BB8D3] transition-colors"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>先逛逛寶寶百科，不用登入</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Quick Features Grid */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center"
          >
            完整的育兒工具箱
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6"
          >
            {[
              { title: '里程碑追蹤', desc: '記錄寶寶每個珍貴的成長時刻', bg: 'bg-[#FFE5E5]', icon: '👶' },
              { title: '疫苗追蹤', desc: '完整的疫苗接種時程表', bg: 'bg-[#E8F5E9]', icon: '💉' },
              { title: '副食品指南', desc: '科學的副食品添加方法', bg: 'bg-[#FFF3E0]', icon: '🍽️' },
              { title: '照顧重點', desc: '各階段專業照護建議', bg: 'bg-[#E8F4F8]', icon: '🛡️' },
            ].map((feature) => (
              <motion.button
                key={feature.title}
                type="button"
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                onClick={() => onSignIn()}
                className={`${feature.bg} rounded-3xl p-6 text-left w-full transition-all hover:shadow-lg`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{feature.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{feature.desc}</p>
                    <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                      <span>登入後開始使用</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="px-4 py-16 bg-[#F5F1E8]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-6">
            <Lock className="w-8 h-8 text-[#81C784]" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            你的珍貴數據，我們比你更在意
          </h3>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
            採用 Firebase 加密存儲與安全驗證技術，確保寶寶的成長數據只屬於你的家庭，隱私無虞
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#81C784]" />
              <span>企業級加密</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#81C784]" />
              <span>僅限本人存取</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#81C784]" />
              <span>永久免費</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FFE5E5] mb-4">
            <Baby className="w-6 h-6 text-[#FF9B9B]" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">LittleSteps</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
            育兒很累，但回憶很甜。<br />
            LittleSteps 紀錄你的每一點小進步。
          </p>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} LittleSteps • 陪伴寶貝每一步成長
          </p>
        </div>
      </footer>
    </div>
  );
}
