import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { User } from 'firebase/auth';
import FeedbackModal from './FeedbackModal';
import { useFirebaseChildren } from '../hooks/useFirebaseChildren';

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
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow z-40 flex items-center justify-center"
        title="問題回報"
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
