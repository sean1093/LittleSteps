import { DailyLog } from '../../types';
import { User } from 'firebase/auth';
import { useDualModeCollection } from '../../common/hooks/useDualModeCollection';

/**
 * 管理寶寶日誌資料的 Hook
 * 支援 Firebase (已登入) 和 LocalStorage (未登入) 雙模式
 */
export function useDailyLogs(
  childId: string | null,
  user: User | null
) {
  const { data: logs, setData: setLogs, loading } = useDualModeCollection<DailyLog[]>(
    childId,
    user,
    {
      firebasePath: `children/${childId}/dailyLogs`,
      storageKey: `daily-logs-${childId}`,
      empty: [],
      fromFirebase: (data) => (data ? (Object.values(data) as DailyLog[]) : []),
      errorLabel: 'Error fetching daily logs:',
    },
  );

  /**
   * 新增日誌
   */
  const addLog = async (logData: Omit<DailyLog, 'id'>): Promise<string> => {
    if (!childId) {
      throw new Error('No child selected');
    }

    const logId = `log_${Date.now()}`;
    const newLog: DailyLog = {
      ...logData,
      id: logId,
      childId,
    };

    if (user) {
      // Firebase 模式 - 由 useFirebaseChildren 處理
      // 這裡只是 placeholder，實際會在組件中使用 firebaseChildren.addDailyLog
      throw new Error('Use firebaseChildren.addDailyLog for Firebase mode');
    } else {
      // LocalStorage 模式
      const storageKey = `daily-logs-${childId}`;
      const updatedLogs = [...logs, newLog];
      localStorage.setItem(storageKey, JSON.stringify(updatedLogs));
      setLogs(updatedLogs);
    }

    return logId;
  };

  /**
   * 更新日誌
   */
  const updateLog = async (logId: string, updates: Partial<DailyLog>): Promise<void> => {
    if (!childId) {
      throw new Error('No child selected');
    }

    if (user) {
      // Firebase 模式
      throw new Error('Use firebaseChildren.updateDailyLog for Firebase mode');
    } else {
      // LocalStorage 模式
      const storageKey = `daily-logs-${childId}`;
      const updatedLogs = logs.map(log =>
        log.id === logId
          ? { ...log, ...updates, updatedAt: new Date().toISOString() }
          : log
      );
      localStorage.setItem(storageKey, JSON.stringify(updatedLogs));
      setLogs(updatedLogs);
    }
  };

  /**
   * 刪除日誌
   */
  const deleteLog = async (logId: string): Promise<void> => {
    if (!childId) {
      throw new Error('No child selected');
    }

    if (user) {
      // Firebase 模式
      throw new Error('Use firebaseChildren.deleteDailyLog for Firebase mode');
    } else {
      // LocalStorage 模式
      const storageKey = `daily-logs-${childId}`;
      const updatedLogs = logs.filter(log => log.id !== logId);
      localStorage.setItem(storageKey, JSON.stringify(updatedLogs));
      setLogs(updatedLogs);
    }
  };

  return {
    logs,
    loading,
    addLog,
    updateLog,
    deleteLog,
  };
}
