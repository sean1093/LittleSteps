import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import { ChildProfile } from '../types';
import { User } from 'firebase/auth';

interface FamilyData {
  name: string;
  createdBy: string;
  createdAt: string;
  members: Record<string, FamilyMember>;
  children: Record<string, ChildProfile>;
  currentChildId: string | null;
  updatedAt: string;
}

interface FamilyMember {
  role: 'admin' | 'member' | 'viewer';
  displayName: string;
  joinedAt: string;
}

export function useFirebaseFamily(user: User | null) {
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [familyData, setFamilyData] = useState<FamilyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFamilyId(null);
      setFamilyData(null);
      setLoading(false);
      return;
    }

    // 1. 監聽用戶的 currentFamilyId
    const userRef = ref(database, `users/${user.uid}/currentFamilyId`);
    const unsubscribeUser = onValue(userRef, (snapshot) => {
      const currentFamilyId = snapshot.val();
      setFamilyId(currentFamilyId);
    });

    return () => unsubscribeUser();
  }, [user]);

  useEffect(() => {
    if (!familyId) {
      setFamilyData(null);
      setLoading(false);
      return;
    }

    // 開始載入家庭資料
    setLoading(true);

    // 2. 監聽家庭資料（即時同步）
    const familyRef = ref(database, `families/${familyId}`);
    const unsubscribeFamily = onValue(familyRef, (snapshot) => {
      const data = snapshot.val();
      setFamilyData(data);
      setLoading(false);
    });

    return () => unsubscribeFamily();
  }, [familyId]);

  return {
    familyId,
    familyData,
    loading,
  };
}
