import { motion } from 'framer-motion';
import { Lock, LogIn } from 'lucide-react';

interface LoginPromptProps {
  message?: string;
  onSignIn: () => void;
  compact?: boolean; // For smaller inline prompts
}

/**
 * LoginPrompt - Displays a login prompt overlay or inline message
 *
 * @param message - Custom message to display (default: "登入後即可使用此功能")
 * @param onSignIn - Callback for sign in action
 * @param compact - If true, shows a compact inline version
 */
export default function LoginPrompt({
  message = "登入後即可使用此功能",
  onSignIn,
  compact = false
}: LoginPromptProps) {
  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
        <Lock className="w-4 h-4 text-blue-600" />
        <span className="text-sm text-blue-700">{message}</span>
        <button
          onClick={onSignIn}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 underline"
        >
          立即登入
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-soft border border-blue-100"
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center mb-4 shadow-soft">
          <Lock className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-2">
          需要登入
        </h3>

        <p className="text-gray-600 mb-4 max-w-sm">
          {message}
        </p>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSignIn}
          className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-soft hover:shadow-soft-lg transition-all"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5 bg-white rounded p-0.5"
          />
          <span className="font-semibold">使用 Google 登入</span>
          <LogIn className="w-5 h-5" />
        </motion.button>

        <p className="text-xs text-gray-500 mt-4">
          登入後可同步資料至雲端，多裝置共享
        </p>
      </div>
    </motion.div>
  );
}
