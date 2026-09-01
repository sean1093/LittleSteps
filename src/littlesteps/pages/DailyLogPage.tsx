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
import DaySelector from '../components/dailylog/DaySelector';
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
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  // Load data
  const { logs, loading, error } = useDailyLogs(currentChild?.id || null, user);
  const firebaseChildren = useFirebaseChildren(user?.uid || null);

  const isToday = isSameDay(selectedDate, new Date());
  const todayLogs = logs.filter((log) => isSameDay(log.timestamp, selectedDate));
  const feedingCount = todayLogs.filter((l) => l.type === 'feeding').length;
  const sleepCount = todayLogs.filter((l) => l.type === 'sleep').length;
  const diaperCount = todayLogs.filter((l) => l.type === 'diaper').length;

  // Handlers
  const handleQuickLog = (type: 'feeding' | 'sleep' | 'diaper') => {
    setModalType(type);
    setEditingLog(null);
    setShowModal(true);
  };

  /*
    失敗時不接住：訊息與「表單留在原地、家長剛打的內容還在」都由 LogEntryModal
    自己處理，這裡再 toast 一次就是同一件事講兩遍。關閉與清掉 editingLog 也是
    它的 onClose，只有成功才會走到。
  */
  const handleSave = async (logData: Omit<DailyLog, 'id'>) => {
    if (!currentChild) {
      throw new Error('請先選擇寶寶');
    }

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

    // 補記昨天的餵奶時，紀錄不會落在目前這一天。跳到它真正落在的日子，
    // 不然使用者剛存的東西會憑空消失。
    setSelectedDate(new Date(completeLogData.timestamp));
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
        <motion.div variants={listItem} className="card mb-4">
          <DaySelector value={selectedDate} onChange={setSelectedDate} />
        </motion.div>

        <motion.div variants={listItem} className="card mb-6">
          <h2 className="mb-3">{isToday ? '今日統計' : '這天的統計'}</h2>
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
          <h2 className="mb-3">{isToday ? '今日記錄' : '這天的記錄'}</h2>
          {/*
            讀取失敗時 logs 是空的，時間軸會說「今天還沒有記錄」——把「讀不到」
            講成「還沒記」，家長會以為剛剛存的東西不見了。
          */}
          {error ? (
            <div className="card">
              <p className="text-sm text-ink-muted">讀不到日常記錄，請確認網路後重新載入</p>
            </div>
          ) : (
            <LogTimeline
              logs={logs}
              onEdit={handleEdit}
              onDelete={handleDelete}
              currentUserId={user?.uid}
              date={selectedDate}
            />
          )}
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
