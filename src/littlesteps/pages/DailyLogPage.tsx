import { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from 'firebase/auth';
import { ChildProfile, DailyLog } from '../../types';
import { useDailyLogs } from '../hooks/useDailyLogs';
import { useFirebaseChildren } from '../../common/hooks/useFirebaseChildren';
import { isSameDay } from '../../common/utils/dateHelpers';
import QuickLogButtons from '../components/dailylog/QuickLogButtons';
import LogEntryModal from '../components/dailylog/LogEntryModal';
import LogTimeline from '../components/dailylog/LogTimeline';
import EmptyState from '../../common/ui/EmptyState';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { stagger, listItem } from '../../common/ui/motion';
import { useToast } from '../../common/ui/toast';

interface DailyLogPageProps {
  currentChild?: ChildProfile | null;
  user: User | null;
}

export default function DailyLogPage({ currentChild, user }: DailyLogPageProps) {
  const toast = useToast();
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
      toast.show('請先選擇寶寶');
      return;
    }

    try {
      const completeLogData = {
        ...logData,
        childId: currentChild.id,
        // 編輯時保留原本的記錄者：改一筆別人記的紀錄不該把它變成自己記的。
        ...(editingLog
          ? {}
          : {
              createdBy: user?.uid,
              createdByName: user?.displayName ?? undefined,
            }),
      };

      if (editingLog) {
        await firebaseChildren.updateDailyLog(currentChild.id, editingLog.id, completeLogData);
      } else {
        await firebaseChildren.addDailyLog(currentChild.id, completeLogData);
      }

      setShowModal(false);
      setEditingLog(null);
    } catch (error) {
      console.error('保存日誌失敗:', error);
      toast.show(error instanceof Error ? error.message : '保存失敗，請稍後再試');
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
      await firebaseChildren.deleteDailyLog(currentChild.id, logId);
    } catch (error) {
      console.error('刪除日誌失敗:', error);
      toast.show(error instanceof Error ? error.message : '刪除失敗，請稍後再試');
    }
  };

  // No child selected
  if (!currentChild) {
    return (
      <div className="screen">
        <div className="screen-body">
          <EmptyState
            theme={SERVICE_THEME.littlesteps}
            title="還沒有選擇寶寶"
            description="請先在側邊欄選擇或新增寶寶"
          />
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="screen">
        <div className="screen-body flex justify-center py-16">
          <div className="w-40 h-1 rounded-full bg-primary-light overflow-hidden" role="status">
            <div className="h-full w-1/3 rounded-full bg-primary-dark animate-[loading_1.2s_ease-in-out_infinite]" />
            <span className="sr-only">載入中</span>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: '餵奶', count: feedingCount },
    { label: '睡眠', count: sleepCount },
    { label: '尿布', count: diaperCount },
  ];

  return (
    <div className="screen">
      <motion.div
        className="screen-body"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={listItem} className="card mb-6">
          <h2 className="mb-3">今日統計</h2>
          <div className="flex justify-around">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-primary-dark">{stat.count}</div>
                <div className="text-sm text-ink-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={listItem} className="mb-6">
          <h2 className="mb-3">快速記錄</h2>
          <QuickLogButtons onLogClick={handleQuickLog} />
        </motion.div>

        <motion.div variants={listItem}>
          <h2 className="mb-3">今日記錄</h2>
          <LogTimeline
            logs={logs}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentUserId={user?.uid}
          />
        </motion.div>

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
      </motion.div>
    </div>
  );
}
