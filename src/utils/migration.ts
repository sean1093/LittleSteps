import { ref, set, get } from 'firebase/database';
import { database } from '../lib/firebase';
import { ChildProfile } from '../types';
import { User } from 'firebase/auth';

export async function migrateLocalStorageToFirebase(user: User): Promise<void> {
  // 1. 讀取 LocalStorage 資料
  const localProfiles = localStorage.getItem('child-profiles');
  const localCurrentChildId = localStorage.getItem('current-child-id');

  // 2. 檢查用戶是否已有資料
  const userRef = ref(database, `users/${user.uid}`);
  const snapshot = await get(userRef);
  if (snapshot.exists() && snapshot.val().children) {
    // 已有資料，不需遷移
    console.log('✅ 用戶已有 Firebase 資料，跳過遷移');
    return;
  }

  // 3. 準備用戶資料
  const userData: any = {
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    createdAt: new Date().toISOString(),
    currentChildId: null,
    children: {},
  };

  // 4. 如果有 LocalStorage 資料，遷移到 Firebase
  if (localProfiles) {
    const childProfiles: ChildProfile[] = JSON.parse(localProfiles);

    // 上傳所有孩子資料
    const children: Record<string, ChildProfile> = {};
    childProfiles.forEach((child) => {
      children[child.id] = child;
    });
    userData.children = children;

    // 設定 currentChildId
    if (localCurrentChildId) {
      const currentId = JSON.parse(localCurrentChildId);
      if (children[currentId]) {
        userData.currentChildId = currentId;
      }
    }

    // 如果沒有 currentChildId，設為第一個孩子
    if (!userData.currentChildId && Object.keys(children).length > 0) {
      userData.currentChildId = Object.keys(children)[0];
    }

    console.log(`✅ 遷移 ${childProfiles.length} 個寶寶資料到 Firebase`);
  }

  // 5. 寫入 Firebase
  await set(userRef, userData);

  // 6. 標記已遷移（避免重複遷移）
  localStorage.setItem('migrated-to-firebase', 'true');

  console.log('✅ LocalStorage 資料已成功遷移到 Firebase');
}
