import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../lib/firebase';
import { User } from 'firebase/auth';
import { PregnancyData } from '../../types';

/**
 * Hook for managing pregnancy data
 */
export function usePregnancyData(
  childId: string | null,
  user: User | null
) {
  const [pregnancyData, setPregnancyData] = useState<PregnancyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!childId) {
      setPregnancyData(null);
      setLoading(false);
      return;
    }

    if (user) {
      setLoading(true);
      const pregnancyRef = ref(database, `children/${childId}/pregnancyData`);
      const unsubscribe = onValue(pregnancyRef, (snapshot) => {
        const data = snapshot.val();
        setPregnancyData(data || null);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // LocalStorage implementation for guest mode (simplified for now)
      const stored = localStorage.getItem(`pregnancy-${childId}`);
      if (stored) {
        setPregnancyData(JSON.parse(stored));
      }
      setLoading(false);
    }
  }, [childId, user]);

  return {
    pregnancyData,
    loading
  };
}
