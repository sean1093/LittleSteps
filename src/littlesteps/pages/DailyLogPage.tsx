import { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from 'firebase/auth';
import { ChildProfile, DailyLog, SleepData } from '../../types';
import { useDailyLogs } from '../hooks/useDailyLogs';
import { useFirebaseChildren } from '../../common/hooks/useFirebaseChildren';
import { calculateDuration, isSameDay } from '../../common/utils/dateHelpers';
import {
  findLastLog,
  findOpenSleep,
  isIntakeFeedingLog,
  isPumpingLog,
  isStaleOpenSleep,
} from '../utils/logHelpers';
import QuickLogButtons, { type SleepMode } from '../components/dailylog/QuickLogButtons';
import LogEntryModal from '../components/dailylog/LogEntryModal';
import LogTimeline from '../components/dailylog/LogTimeline';
import DaySelector from '../components/dailylog/DaySelector';
import OpenSleepCard from '../components/dailylog/OpenSleepCard';
import NightWakingsPrompt from '../components/dailylog/NightWakingsPrompt';
import ChildSwitcher from '../../common/components/ChildSwitcher';
import RepeatLastLog from '../components/dailylog/RepeatLastLog';
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
  /**
   * 剛剛用「醒了」關掉的那一段。只活在這一次操作裡：想回答夜醒次數的人多按
   * 一下，直接走開的人什麼也沒記——而「沒記」跟「記了 0 次」本來就不一樣。
   *
   * 存的是寫進去的那份快照，不是 id：從 logs 重查會拿到監聽器還沒更新的舊值，
   * 而接著補夜醒次數的那一筆會把整個 data 寫回去，剛設好的結束時間就沒了。
   */
  const [justClosedSleep, setJustClosedSleep] = useState<DailyLog | null>(null);

  // Load data
  const { logs, loading, error } = useDailyLogs(currentChild?.id || null, user);
  const firebaseChildren = useFirebaseChildren(user?.uid || null);

  const isToday = isSameDay(selectedDate, new Date());
  const todayLogs = logs.filter((log) => isSameDay(log.timestamp, selectedDate));
  // 擠奶是產出，不是餵了一餐——這個數字要跟摘要卡說同一件事。
  const feedingCount = todayLogs.filter(isIntakeFeedingLog).length;
  // 忘了按「醒了」的那一筆不是一段睡眠，是一個待補的欄位；它有自己的卡片。
  const sleepCount = todayLogs.filter((l) => l.type === 'sleep' && !isStaleOpenSleep(l)).length;
  const diaperCount = todayLogs.filter((l) => l.type === 'diaper').length;

  const openSleep = findOpenSleep(logs);
  /*
    還在睡的那一段跨得過午夜，所以看今天時一定要看得到它，即使是昨晚入睡的。
    翻到過去的某一天時，只有那天入睡的才顯示。
  */
  const showOpenSleep =
    openSleep !== null && (isToday || isSameDay((openSleep.data as SleepData).startTime, selectedDate));
  const sleepMode: SleepMode = !isToday ? 'log' : openSleep ? 'sleeping' : 'start';

  /*
    預填與「再記一次」都讀這個孩子自己的紀錄——logs 本來就只有他一個人的。
    絕對不能改成 localStorage：孩子的資料不放在裝置上，而且一位有兩個孩子的
    家長，一個喝配方奶一個親餵，共用一份記憶只會讓兩張表都填錯。
  */
  const lastFeeding = findLastLog(logs, isIntakeFeedingLog);
  const lastPumping = findLastLog(logs, isPumpingLog);
  const lastDiaper = findLastLog(logs, (log) => log.type === 'diaper');
  /*
    表單沿用的是「上一筆同類型的紀錄」，擠奶也算——剛擠完的人多半是要再擠一次。
    「再記一次」則把兩者拆開：擠奶不是一餐，也不該擋住「再餵一次上次那餐」。
  */
  const lastFeedingForm = findLastLog(logs, (log) => log.type === 'feeding');
  const lastLogForForm =
    modalType === 'diaper' ? lastDiaper : modalType === 'feeding' ? lastFeedingForm : null;

  // Handlers
  const openLogForm = (type: 'feeding' | 'sleep' | 'diaper') => {
    setModalType(type);
    setEditingLog(null);
    setShowModal(true);
  };

  const reportWriteFailure = (error: unknown, fallback: string) => {
    console.error(fallback, error);
    toast.show(error instanceof Error ? error.message : fallback);
  };

  /**
   * 一鍵開始一段睡眠。同時只能有一段沒關的睡眠：第二次按下去要被擋住並說明
   * 原因，悄悄蓋掉前一段的話，家長會以為剛剛那覺沒記到。
   */
  const handleSleepQuickLog = async () => {
    if (!currentChild) return;

    if (!isToday) {
      openLogForm('sleep'); // 補記過去的睡眠沒有「現在開始」可言
      return;
    }

    if (openSleep) {
      toast.show(
        isStaleOpenSleep(openSleep)
          ? '上一段睡眠還沒有結束時間，先補上才能開始新的一段。'
          : '寶寶還在睡。先按「醒了」結束這一段，才能開始新的一段。',
      );
      return;
    }

    const startedAt = new Date().toISOString();
    const sleepData: SleepData = { startTime: startedAt };
    try {
      await firebaseChildren.addDailyLog(currentChild.id, {
        childId: currentChild.id,
        type: 'sleep',
        timestamp: startedAt,
        data: sleepData,
        createdAt: startedAt,
        createdBy: user?.uid,
        createdByName: user?.displayName ?? undefined,
      });
      setJustClosedSleep(null);
      setSelectedDate(new Date(startedAt));
    } catch (error) {
      reportWriteFailure(error, '開始睡眠記錄失敗，請稍後再試');
    }
  };

  /** 一鍵重複：內容照抄上一筆，時間是現在，不開表單。 */
  const handleRepeat = async (log: DailyLog) => {
    if (!currentChild) return;

    const now = new Date().toISOString();
    try {
      await firebaseChildren.addDailyLog(currentChild.id, {
        childId: currentChild.id,
        type: log.type,
        timestamp: now,
        // 備註屬於上一次那件事，不跟著複製。
        data: { ...log.data, notes: undefined },
        createdAt: now,
        createdBy: user?.uid,
        createdByName: user?.displayName ?? undefined,
      });
      setSelectedDate(new Date(now));
    } catch (error) {
      reportWriteFailure(error, '記錄失敗，請稍後再試');
    }
  };

  const handleQuickLog = (type: 'feeding' | 'sleep' | 'diaper') => {
    if (type === 'sleep') {
      void handleSleepQuickLog();
      return;
    }
    openLogForm(type);
  };

  /** 一鍵結束：結束時間就是現在，時長跟著算出來，不開任何表單。 */
  const handleWake = async (log: DailyLog) => {
    if (!currentChild) return;

    const endTime = new Date().toISOString();
    const closed: DailyLog = {
      ...log,
      data: {
        ...(log.data as SleepData),
        endTime,
        duration: calculateDuration((log.data as SleepData).startTime, endTime),
      },
    };
    try {
      await firebaseChildren.updateDailyLog(currentChild.id, log.id, { data: closed.data });
      setJustClosedSleep(closed);
    } catch (error) {
      reportWriteFailure(error, '結束睡眠記錄失敗，請稍後再試');
    }
  };

  const handleRecordNightWakings = async (log: DailyLog, nightWakings: number) => {
    if (!currentChild) return;

    try {
      await firebaseChildren.updateDailyLog(currentChild.id, log.id, {
        data: { ...(log.data as SleepData), nightWakings },
      });
      setJustClosedSleep(null);
    } catch (error) {
      reportWriteFailure(error, '記錄夜醒次數失敗，請稍後再試');
    }
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
      // 剛關掉的那一段被刪了，就不該再問它的夜醒次數。
      if (justClosedSleep?.id === logId) setJustClosedSleep(null);
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
        <ChildSwitcher service="littlesteps" className="mb-4" />

        <motion.div variants={listItem} className="card mb-4">
          <DaySelector
            value={selectedDate}
            onChange={(date) => {
              setJustClosedSleep(null);
              setSelectedDate(date);
            }}
          />
        </motion.div>

        {showOpenSleep && openSleep && (
          <motion.div variants={listItem} className="mb-4">
            <OpenSleepCard log={openSleep} onWake={handleWake} onFixEndTime={handleEdit} />
          </motion.div>
        )}

        {justClosedSleep && (
          <motion.div variants={listItem} className="mb-4">
            <NightWakingsPrompt
              log={justClosedSleep}
              onRecord={handleRecordNightWakings}
              onOpenForm={(log) => {
                setJustClosedSleep(null);
                handleEdit(log);
              }}
              onDismiss={() => setJustClosedSleep(null)}
            />
          </motion.div>
        )}

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
          <QuickLogButtons onLogClick={handleQuickLog} sleepMode={sleepMode} />
          {isToday && (
            <div className="mt-3">
              <RepeatLastLog
                lastFeeding={lastFeeding}
                lastPumping={lastPumping}
                lastDiaper={lastDiaper}
                onRepeat={handleRepeat}
              />
            </div>
          )}
          {/* 今天的睡眠鍵是「現在開始睡」，所以事後補一段完整睡眠需要自己的入口。 */}
          {isToday && (
            <div className="mt-2 flex justify-center">
              <button type="button" onClick={() => openLogForm('sleep')} className="btn-ghost text-sm">
                手動輸入睡眠時間
              </button>
            </div>
          )}
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
            lastLog={lastLogForForm}
          />
        )}
      </motion.div>
    </div>
  );
}
