import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import { DailyLog } from '../types';
import { User } from 'firebase/auth';

/**
 * 管理寶寶日誌資料的 Hook
 * 支援 Firebase (已登入) 和 LocalStorage (未登入) 雙模式
 */
export function useDailyLogs(
  childId: string | null,
  user: User | null,
  familyId: string | null
) {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!childId) {
      setLogs([]);
      setLoading(false);
      return;
    }

    if (user && familyId) {
      // Firebase 模式: 即時監聽
      setLoading(true);

      const logsRef = ref(database, `families/${familyId}/children/${childId}/dailyLogs`);
      const unsubscribe = onValue(logsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Convert object to array
          const logsArray = Object.values(data) as DailyLog[];
          setLogs(logsArray);
        } else {
          setLogs([]);
        }
        setLoading(false);
      }, (error) => {
        console.error('Error fetching daily logs:', error);
        setLogs([]);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // LocalStorage 模式
      const storageKey = `daily-logs-${childId}`;
      const storedLogs = localStorage.getItem(storageKey);

      if (storedLogs) {
        try {
          const parsedLogs = JSON.parse(storedLogs) as DailyLog[];
          setLogs(parsedLogs);
        } catch (error) {
          console.error('Error parsing stored logs:', error);
          setLogs([]);
        }
      } else {
        setLogs([]);
      }

      setLoading(false);
    }
  }, [childId, user, familyId]);

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

    if (user && familyId) {
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

    if (user && familyId) {
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

    if (user && familyId) {
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
