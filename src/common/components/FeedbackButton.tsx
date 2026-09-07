import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { User } from 'firebase/auth';
import FeedbackModal from './FeedbackModal';
import { useFirebaseChildren } from '../hooks/useFirebaseChildren';
import { fadeInUp, hoverLift, tap } from '../ui/motion';

interface FeedbackButtonProps {
  user: User | null;
}

export default function FeedbackButton({ user }: FeedbackButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const firebaseChildren = useFirebaseChildren(user?.uid || null);

  // Only show for logged-in users
  if (!user) return null;

  const handleSubmit = async (title: string, content: string, shareContact: boolean) => {
    if (!user) {
      throw new Error('請先登入');
    }

    await firebaseChildren.submitFeedback({
      title,
      content,
      userId: user.uid,
      /*
        沒勾就連鍵都不出現，而不是送一個空字串：規則把這兩個欄位當選填，''
        照樣是它收得下、也會存進收件匣的字串，那等於沒問就送。userId 才是回報
        和帳號的關聯，這兩個欄位只為了「回得了信」而存在。
      */
      ...(shareContact && user.email ? { userEmail: user.email } : {}),
      ...(shareContact && user.displayName ? { userName: user.displayName } : {}),
    });
  };

  return (
    <>
      {/* 浮動回報鍵：圖示就是這顆按鈕的全部標籤，故留著。 */}
      <motion.button
        type="button"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        whileHover={hoverLift}
        whileTap={tap}
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-secondary-dark text-white rounded-full shadow-soft hover:shadow-soft-lg transition-shadow z-40 flex items-center justify-center"
        title="問題回報"
        aria-label="問題回報"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        userName={user.displayName || '用戶'}
      />
    </>
  );
}
