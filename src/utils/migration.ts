import { ref, set, get } from 'firebase/database';
import { database } from '../lib/firebase';
import { ChildProfile } from '../types';
import { User } from 'firebase/auth';

export async function migrateLocalStorageToFirebase(user: User): Promise<string> {
  // 1. 讀取 LocalStorage 資料
  const localProfiles = localStorage.getItem('child-profiles');
  if (!localProfiles) {
    // 沒有資料，建立空白家庭
    return await createEmptyFamily(user);
  }

  const childProfiles: ChildProfile[] = JSON.parse(localProfiles);

  // 2. 檢查用戶是否已有家庭
  const userRef = ref(database, `users/${user.uid}`);
  const snapshot = await get(userRef);
  if (snapshot.exists() && snapshot.val().currentFamilyId) {
    // 已有家庭，不需遷移
    return snapshot.val().currentFamilyId;
  }

  // 3. 建立新家庭
  const familyId = `family_${Date.now()}`;
  const familyData = {
    name: `${user.displayName || user.email || '我'}的家庭`,
    createdBy: user.uid,
    createdAt: new Date().toISOString(),
    members: {
      [user.uid]: {
        role: 'admin',
        displayName: user.displayName || user.email || '我',
        joinedAt: new Date().toISOString(),
      },
    },
    children: {} as Record<string, ChildProfile & { createdBy: string }>,
    currentChildId: null as string | null,
    updatedAt: new Date().toISOString(),
  };

  // 4. 上傳所有孩子資料
  const children: Record<string, ChildProfile & { createdBy: string }> = {};
  childProfiles.forEach((child) => {
    children[child.id] = {
      ...child,
      createdBy: user.uid,
    };
  });
  familyData.children = children;

  // 5. 設定 currentChildId（從 LocalStorage 讀取）
  const localCurrentChildId = localStorage.getItem('current-child-id');
  if (localCurrentChildId) {
    const currentId = JSON.parse(localCurrentChildId);
    if (children[currentId]) {
      familyData.currentChildId = currentId;
    }
  }

  // 如果沒有 currentChildId，設為第一個孩子
  if (!familyData.currentChildId && Object.keys(children).length > 0) {
    familyData.currentChildId = Object.keys(children)[0];
  }

  // 6. 寫入 Firebase
  await set(ref(database, `families/${familyId}`), familyData);

  // 7. 更新用戶資料
  await set(ref(database, `users/${user.uid}`), {
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    currentFamilyId: familyId,
    families: {
      [familyId]: {
        role: 'admin',
        joinedAt: new Date().toISOString(),
      },
    },
    createdAt: new Date().toISOString(),
  });

  // 8. 標記已遷移（避免重複遷移）
  localStorage.setItem('migrated-to-firebase', 'true');

  console.log('✅ LocalStorage 資料已成功遷移到 Firebase');
  return familyId;
}

async function createEmptyFamily(user: User): Promise<string> {
  const familyId = `family_${Date.now()}`;

  await set(ref(database, `families/${familyId}`), {
    name: `${user.displayName || user.email || '我'}的家庭`,
    createdBy: user.uid,
    createdAt: new Date().toISOString(),
    members: {
      [user.uid]: {
        role: 'admin',
        displayName: user.displayName || user.email || '我',
        joinedAt: new Date().toISOString(),
      },
    },
    children: {},
    currentChildId: null,
    updatedAt: new Date().toISOString(),
  });

  await set(ref(database, `users/${user.uid}`), {
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    currentFamilyId: familyId,
    families: {
      [familyId]: {
        role: 'admin',
        joinedAt: new Date().toISOString(),
      },
    },
    createdAt: new Date().toISOString(),
  });

  return familyId;
}
