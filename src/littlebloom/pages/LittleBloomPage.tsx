import { motion } from 'framer-motion';
import { Flower2, Sparkles, Heart, Calendar, Book, Bell } from 'lucide-react';

/**
 * LittleBloomPage - WIP placeholder for pregnancy companion app
 *
 * Design: Morandi color palette with earthy, feminine aesthetics
 * Target: Expecting mothers (pregnancy tracking and information)
 */

function LittleBloomPage() {
  const upcomingFeatures = [
    {
      icon: Calendar,
      title: '孕期追蹤',
      description: '週數計算、寶寶發展進度、產檢時程規劃',
      color: 'bloom-dusty-rose'
    },
    {
      icon: Book,
      title: '孕期知識',
      description: '孕期營養、運動建議、身心照護指南',
      color: 'bloom-sage'
    },
    {
      icon: Heart,
      title: '身心紀錄',
      description: '情緒日記、身體變化記錄、睡眠品質追蹤',
      color: 'bloom-mauve'
    },
    {
      icon: Bell,
      title: '貼心提醒',
      description: '產檢提醒、營養補充提示、每日小貼士',
      color: 'bloom-terracotta'
    }
  ];

  return (
    <div className="min-h-screen bg-bloom-cream">
      {/* Header */}
      <header className="bg-gradient-to-r from-bloom-dusty-rose to-bloom-mauve shadow-soft">
        <div className="px-4 py-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Flower2 className="w-16 h-16 text-white mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-white mb-2">
              LittleBloom
            </h1>
            <p className="text-white/90 text-lg">
              為準媽媽打造的溫柔陪伴
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 max-w-4xl mx-auto">
        {/* WIP Notice */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-soft mb-8 text-center"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <Sparkles className="w-20 h-20 text-bloom-dusty-rose mx-auto mb-4" />
          </motion.div>

          <h2 className="text-2xl font-bold text-bloom-stone mb-3">
            精心籌備中
          </h2>
          <p className="text-bloom-stone/70 text-lg leading-relaxed mb-4">
            我們正在用心打造一個專屬於準媽媽的溫暖空間
          </p>
          <p className="text-bloom-stone/60 text-base">
            敬請期待 Coming Soon
          </p>
        </motion.div>

        {/* Upcoming Features Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-bloom-stone mb-6 text-center">
            即將推出的功能
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-xl bg-${feature.color}/10 flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}`} />
                </div>
                <h4 className="text-lg font-bold text-bloom-stone mb-2">
                  {feature.title}
                </h4>
                <p className="text-bloom-stone/70 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Vision Statement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-gradient-to-br from-bloom-sage/20 to-bloom-dusty-blue/20 rounded-2xl p-8 text-center"
        >
          <p className="text-bloom-stone/80 text-lg leading-relaxed italic">
            「每一位準媽媽都值得被溫柔以待，
            <br />
            LittleBloom 將陪伴妳走過這段珍貴的旅程」
          </p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-bloom-stone/50 text-sm">
        <p>LittleBloom © 2026 - 用心陪伴每一位準媽媽</p>
      </footer>
    </div>
  );
}

export default LittleBloomPage;
