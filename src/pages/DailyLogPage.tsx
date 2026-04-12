import { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from 'firebase/auth';
import { ChildProfile, DailyLog } from '../types';
import { useDailyLogs } from '../hooks/useDailyLogs';
import { useFirebaseChildren } from '../hooks/useFirebaseChildren';
import { isSameDay } from '../utils/dateHelpers';
import QuickLogButtons from '../components/QuickLogButtons';
import LogEntryModal from '../components/LogEntryModal';
import LogTimeline from '../components/LogTimeline';

interface DailyLogPageProps {
  currentChild?: ChildProfile | null;
  user: User | null;
}

export default function DailyLogPage({ currentChild, user }: DailyLogPageProps) {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'feeding' | 'sleep' | 'diaper' | null>(null);
  const [editingLog, setEditingLog] = useState<DailyLog | null>(null);

  // Load data
  const { logs, loading } = useDailyLogs(currentChild?.id || null, user);
  const firebaseChildren = useFirebaseChildren(user?.uid || null);

  // Calculate today's statistics
  const todayLogs = logs.filter((log) => isSameDay(log.timestamp, new Date()));
  const feedingCount = todayLogs.filter((l) => l.type === 'feeding').length;
  const sleepCount = todayLogs.filter((l) => l.type === 'sleep').length;
  const diaperCount = todayLogs.filter((l) => l.type === 'diaper').length;

  // Handlers
  const handleQuickLog = (type: 'feeding' | 'sleep' | 'diaper') => {
    setModalType(type);
    setEditingLog(null);
    setShowModal(true);
  };

  const handleSave = async (logData: Omit<DailyLog, 'id'>) => {
    if (!currentChild) {
      alert('請先選擇寶寶');
      return;
    }

    try {
      const completeLogData = {
        ...logData,
        childId: currentChild.id,
      };

      if (editingLog) {
        // Update existing log
        if (user) {
          await firebaseChildren.updateDailyLog(currentChild.id, editingLog.id, completeLogData);
        } else {
          // LocalStorage mode - handled by useDailyLogs
          throw new Error('LocalStorage update not supported yet');
        }
      } else {
        // Create new log
        if (user) {
          await firebaseChildren.addDailyLog(currentChild.id, completeLogData);
        } else {
          // LocalStorage mode - handled by useDailyLogs
          throw new Error('LocalStorage create not supported yet');
        }
      }

      setShowModal(false);
      setEditingLog(null);
    } catch (error: any) {
      console.error('保存日誌失敗:', error);
      alert(error.message || '保存失敗，請稍後再試');
    }
  };

  const handleEdit = (log: DailyLog) => {
    setEditingLog(log);
    setModalType(log.type);
    setShowModal(true);
  };

  const handleDelete = async (logId: string) => {
    if (!currentChild) return;

    try {
      if (user) {
        await firebaseChildren.deleteDailyLog(currentChild.id, logId);
      } else {
        // LocalStorage mode - handled by useDailyLogs
        throw new Error('LocalStorage delete not supported yet');
      }
    } catch (error: any) {
      console.error('刪除日誌失敗:', error);
      alert(error.message || '刪除失敗，請稍後再試');
    }
  };

  // No child selected
  if (!currentChild) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center max-w-md"
        >
          <p className="text-gray-600">請先在側邊欄選擇或新增寶寶</p>
        </motion.div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {currentChild.name}的快速日誌
          </h1>
          <p className="text-sm text-gray-600">今日記錄</p>
        </motion.div>

        {/* Today's Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-soft p-4 mb-6"
        >
          <h2 className="text-sm font-semibold text-gray-700 mb-3">今日統計</h2>
          <div className="flex justify-around">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{feedingCount}</div>
              <div className="text-xs text-gray-600">🍼 餵奶</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{sleepCount}</div>
              <div className="text-xs text-gray-600">💤 睡眠</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">{diaperCount}</div>
              <div className="text-xs text-gray-600">💩 尿布</div>
            </div>
          </div>
        </motion.div>

        {/* Quick Log Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-sm font-semibold text-gray-700 mb-3">快速記錄</h2>
          <QuickLogButtons onLogClick={handleQuickLog} />
        </motion.div>

        {/* Log Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-sm font-semibold text-gray-700 mb-3">今日記錄</h2>
          <LogTimeline logs={logs} onEdit={handleEdit} onDelete={handleDelete} />
        </motion.div>

        {/* Log Entry Modal */}
        {modalType && (
          <LogEntryModal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setEditingLog(null);
            }}
            onSave={handleSave}
            logType={modalType}
            editingLog={editingLog}
          />
        )}
      </div>
    </div>
  );
}
