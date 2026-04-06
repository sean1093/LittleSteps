import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

export default function DailyLogPage() {
  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Main Card */}
        <div className="card text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#E8F4F8] mb-6"
          >
            <Icons.Construction className="w-12 h-12 text-[#7EC8E3]" />
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl font-bold text-gray-800 mb-3"
          >
            功能開發中
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-600 leading-relaxed mb-6"
          >
            快速日誌功能正在努力開發中，敬請期待！
            <br />
            我們將提供便捷的餵奶、睡眠、尿布記錄功能。
          </motion.p>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-[#E8F4F8]/50 rounded-3xl p-4 mb-6"
          >
            <h3 className="text-sm font-semibold text-gray-800 mb-3">即將推出的功能</h3>
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Icons.Milk className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>餵奶記錄（母乳/配方奶/副食品）</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Icons.Moon className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <span>睡眠追蹤（開始/結束時間）</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Icons.Baby className="w-4 h-4 text-pink-500 flex-shrink-0" />
                <span>尿布更換記錄（大便/小便）</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Icons.LineChart className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>每日統計與時間軸檢視</span>
              </div>
            </div>
          </motion.div>

          {/* Animation Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex items-center justify-center gap-2 text-sm text-gray-500"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-2 h-2 rounded-full bg-blue-500"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2
              }}
              className="w-2 h-2 rounded-full bg-purple-500"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4
              }}
              className="w-2 h-2 rounded-full bg-pink-500"
            />
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-gray-500">
            💡 目前您可以使用其他功能，如里程碑追蹤、疫苗記錄、睡眠訓練指南等
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
