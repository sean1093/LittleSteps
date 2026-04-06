import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import { ChildProfile } from '../types';
import { User } from 'firebase/auth';

interface UserData {
  currentChildId: string | null;
  children: Record<string, ChildProfile>;
}

export function useUserChildren(user: User | null) {
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [currentChildId, setCurrentChildId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setChildren([]);
      setCurrentChildId(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    // 監聽用戶資料（即時同步）
    const userRef = ref(database, `users/${user.uid}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val() as UserData | null;

      if (data) {
        const childrenArray = data.children ? Object.values(data.children) : [];
        setChildren(childrenArray);
        setCurrentChildId(data.currentChildId || null);
      } else {
        setChildren([]);
        setCurrentChildId(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return {
    children,
    currentChildId,
    loading,
  };
}
