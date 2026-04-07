import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import { ChildProfile } from '../types';
import { User } from 'firebase/auth';

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

    // 監聽用戶的 childrenIds 和 currentChildId
    const userRef = ref(database, `users/${user.uid}`);
    const unsubscribeUser = onValue(userRef, (snapshot) => {
      const userData = snapshot.val();

      if (userData) {
        setCurrentChildId(userData.currentChildId || null);

        // Get childrenIds (stored as { uuid1: true, uuid2: true })
        const childrenIds: string[] = userData.childrenIds
          ? Object.keys(userData.childrenIds)
          : [];

        if (childrenIds.length === 0) {
          setChildren([]);
          setLoading(false);
          return;
        }

        // Track loaded children and subscriptions
        const loadedChildren: Record<string, ChildProfile> = {};
        const childUnsubscribes: (() => void)[] = [];
        let loadedCount = 0;

        // Listen to each child's data
        childrenIds.forEach((childId) => {
          const childRef = ref(database, `children/${childId}`);
          const unsubChild = onValue(childRef, (childSnapshot) => {
            if (childSnapshot.exists()) {
              loadedChildren[childId] = childSnapshot.val() as ChildProfile;
            } else {
              // Child doesn't exist anymore, remove from loaded
              delete loadedChildren[childId];
            }

            loadedCount++;

            // Update state when all children are loaded
            if (loadedCount >= childrenIds.length) {
              const childrenArray = Object.values(loadedChildren);
              setChildren(childrenArray);
              setLoading(false);
            }
          });

          childUnsubscribes.push(unsubChild);
        });

        // Return cleanup function for child subscriptions
        return () => {
          childUnsubscribes.forEach((unsub) => unsub());
        };
      } else {
        // No user data exists yet
        setChildren([]);
        setCurrentChildId(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeUser();
    };
  }, [user]);

  return {
    children,
    currentChildId,
    loading,
  };
}
