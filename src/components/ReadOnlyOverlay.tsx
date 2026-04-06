import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface ReadOnlyOverlayProps {
  children: ReactNode;
  isReadOnly: boolean;
  message?: string;
  onSignIn: () => void;
  showPrompt?: boolean; // Whether to show the login prompt overlay
}

/**
 * ReadOnlyOverlay - Wraps interactive elements and shows overlay when read-only
 *
 * @param children - The interactive elements to wrap
 * @param isReadOnly - Whether to show the read-only overlay
 * @param message - Custom message (default: "登入後即可記錄")
 * @param onSignIn - Callback for sign in action
 * @param showPrompt - If true, shows full overlay with login button (default: true)
 */
export default function ReadOnlyOverlay({
  children,
  isReadOnly,
  message = "登入後即可記錄",
  onSignIn,
  showPrompt = true
}: ReadOnlyOverlayProps) {
  if (!isReadOnly) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Original content with disabled state */}
      <div className="pointer-events-none opacity-60 select-none">
        {children}
      </div>

      {/* Overlay */}
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl"
        >
          <div className="text-center px-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#7EC8E3] shadow-soft mb-3">
              <Lock className="w-6 h-6 text-white" />
            </div>

            <p className="text-gray-700 font-medium mb-3">
              {message}
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={async (e) => {
                e.stopPropagation();
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
              className="px-6 py-2 rounded-full bg-[#7EC8E3] hover:bg-[#6BB8D3] text-white text-sm font-semibold shadow-soft hover:shadow-soft-lg transition-all"
            >
              立即登入
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
