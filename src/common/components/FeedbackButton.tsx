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

  const handleSubmit = async (title: string, content: string) => {
    if (!user) {
      throw new Error('請先登入');
    }

    await firebaseChildren.submitFeedback({
      title,
      content,
      userId: user.uid,
      userEmail: user.email || '',
      userName: user.displayName || '匿名用戶',
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
