# Firebase Integration Patterns for LittleSteps

## Architecture Overview

LittleSteps uses **dual-mode architecture** to support both:
1. **Guest Mode**: LocalStorage for unauthenticated users
2. **Authenticated Mode**: Firebase Realtime Database for logged-in users

### Database: Firebase Realtime Database (asia-southeast1)

**Why Realtime Database (not Firestore)?**
- Real-time synchronization across devices
- Simpler data model for hierarchical data
- Lower cost for small-scale apps
- Offline support built-in

---

## Database Structure

```
families/
  {familyId}/                    # Auto-generated family ID
    createdAt: "2024-03-15T..."
    updatedAt: "2024-03-15T..."
    currentChildId: "child_123"   # Currently selected child
    children/
      {childId}/
        id: "child_123"
        name: "小寶"
        birthday: "2024-01-15"
        createdAt: "2024-01-15T..."
        milestoneProgress/
          {milestoneId}/
            achieved: true
            achievedDate: "2024-03-15"
        vaccineProgress/
          {vaccineId}/
            doses/
              1/
                administered: true
                administeredDate: "2024-02-01"
              2/
                administered: false
        dailyLogs/
          {logId}/
            id: "log_1234567890"
            childId: "child_123"
            type: "feeding"
            timestamp: "2024-03-15T10:30:00+08:00"
            data:
              feedingType: "breast_left"
              duration: 15
            createdAt: "2024-03-15T10:30:00+08:00"
    members/
      {uid}: true                # Future: family member UIDs
```

### Design Principles

1. **Denormalization**: Store child data directly under family (not separate collection)
2. **Timestamps**: Always include `createdAt`, `updatedAt` (ISO 8601 format)
3. **IDs**: Use descriptive prefixes (`child_`, `log_`) for debugging
4. **Null Safety**: Handle missing fields with `|| {}` or `?? []`

---

## Authentication

### Setup (lib/firebase.ts)

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL, // Regional DB URL
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();
```

**Important:**
- All config values from environment variables (`.env`)
- Use regional database URL for better performance
- Never commit `.env` to git

### Auth Context (contexts/AuthContext.tsx)

```typescript
import { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

---

## Dual-Mode Pattern

### Reading Data

```typescript
// In App.tsx or page components
const { user } = useAuth();
const { familyId, familyData } = useFirebaseFamily(user);
const firebaseChildren = useFirebaseChildren(familyId);

// LocalStorage state
const [localChildProfiles, setLocalChildProfiles] = useLocalStorage<ChildProfile[]>('child-profiles', []);

// Conditional data source
const childProfiles = user && familyData
  ? Object.values(familyData.children || {})
  : localChildProfiles;

const currentChildId = user && familyData
  ? familyData.currentChildId
  : localCurrentChildId;
```

**Pattern:**
- If `user` exists → use Firebase data
- If no `user` → use LocalStorage data

### Writing Data

```typescript
const addChild = async (name: string, birthday: string) => {
  if (user) {
    // Firebase mode
    await firebaseChildren.addChild(name, birthday, user.uid, childProfiles.length);
  } else {
    // LocalStorage mode
    const newChild: ChildProfile = {
      id: Date.now().toString(),
      name,
      birthday,
      milestoneProgress: {},
      vaccineProgress: {},
      createdAt: new Date().toISOString(),
    };
    setLocalChildProfiles(prev => [...prev, newChild]);
  }
};
```

**Pattern:**
- Check `if (user)` before branching
- Firebase: use hook methods
- LocalStorage: directly update state

---

## Firebase Hooks

### useFirebaseFamily Hook

**Purpose:** Manage family data (top-level container)

```typescript
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

    // Find or create family for this user
    const familiesRef = ref(database, 'families');
    const familyQuery = query(familiesRef, orderByChild('createdBy'), equalTo(user.uid));

    const unsubscribe = onValue(familyQuery, async (snapshot) => {
      const families = snapshot.val();

      if (!families) {
        // Create new family
        const newFamilyId = `family_${Date.now()}`;
        await set(ref(database, `families/${newFamilyId}`), {
          createdBy: user.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          currentChildId: null,
          children: {},
        });
        setFamilyId(newFamilyId);
      } else {
        // Use existing family
        const [id, data] = Object.entries(families)[0];
        setFamilyId(id);
        setFamilyData(data as FamilyData);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { familyId, familyData, loading };
}
```

### useFirebaseChildren Hook

**Purpose:** CRUD operations for child profiles, milestones, vaccines, logs

```typescript
export function useFirebaseChildren(familyId: string | null) {
  const addChild = async (name: string, birthday: string, uid: string, order: number) => {
    if (!familyId) throw new Error('No family selected');

    const childId = `child_${Date.now()}`;
    const childRef = ref(database, `families/${familyId}/children/${childId}`);

    await set(childRef, {
      id: childId,
      name,
      birthday,
      order,
      createdAt: new Date().toISOString(),
      milestoneProgress: {},
      vaccineProgress: {},
    });

    // Update family's updatedAt
    await update(ref(database, `families/${familyId}`), {
      updatedAt: new Date().toISOString(),
      currentChildId: childId, // Auto-select new child
    });

    return childId;
  };

  const updateMilestoneProgress = async (childId: string, milestoneId: string, achieved: boolean) => {
    if (!familyId) throw new Error('No family selected');

    const progressRef = ref(database, `families/${familyId}/children/${childId}/milestoneProgress/${milestoneId}`);
    await set(progressRef, {
      achieved,
      achievedDate: achieved ? new Date().toISOString().split('T')[0] : undefined,
    });

    await update(ref(database, `families/${familyId}`), {
      updatedAt: new Date().toISOString(),
    });
  };

  const addDailyLog = async (childId: string, log: Omit<DailyLog, 'id'>) => {
    if (!familyId) throw new Error('No family selected');

    const logId = `log_${Date.now()}`;
    const logRef = ref(database, `families/${familyId}/children/${childId}/dailyLogs/${logId}`);

    await set(logRef, { ...log, id: logId });

    await update(ref(database, `families/${familyId}`), {
      updatedAt: new Date().toISOString(),
    });

    return logId;
  };

  return {
    addChild,
    updateChild,
    deleteChild,
    setCurrentChild,
    updateMilestoneProgress,
    updateVaccineProgress,
    addDailyLog,
    updateDailyLog,
    deleteDailyLog,
  };
}
```

### useDailyLogs Hook

**Purpose:** Real-time listener for daily logs

```typescript
export function useDailyLogs(childId: string | null, user: User | null, familyId: string | null) {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!childId) {
      setLogs([]);
      setLoading(false);
      return;
    }

    if (user && familyId) {
      // Firebase mode: real-time listener
      const logsRef = ref(database, `families/${familyId}/children/${childId}/dailyLogs`);

      const unsubscribe = onValue(logsRef, (snapshot) => {
        const data = snapshot.val();
        setLogs(data ? Object.values(data) : []);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // LocalStorage mode
      const storageKey = `daily-logs-${childId}`;
      const storedLogs = localStorage.getItem(storageKey);
      setLogs(storedLogs ? JSON.parse(storedLogs) : []);
      setLoading(false);
    }
  }, [childId, user, familyId]);

  return { logs, loading };
}
```

---

## Data Migration

### LocalStorage → Firebase

When a user signs in, migrate their LocalStorage data:

```typescript
// utils/migration.ts
export async function migrateLocalDataToFirebase(
  user: User,
  familyId: string,
  firebaseChildren: ReturnType<typeof useFirebaseChildren>
): Promise<void> {
  // Migrate child profiles
  const localProfiles = localStorage.getItem('child-profiles');
  if (!localProfiles) return;

  const profiles: ChildProfile[] = JSON.parse(localProfiles);

  for (const profile of profiles) {
    // Add child to Firebase
    const childId = await firebaseChildren.addChild(
      profile.name,
      profile.birthday,
      user.uid,
      profiles.indexOf(profile)
    );

    // Migrate milestones
    for (const [milestoneId, progress] of Object.entries(profile.milestoneProgress || {})) {
      await firebaseChildren.updateMilestoneProgress(childId, milestoneId, progress.achieved);
    }

    // Migrate vaccines
    for (const [vaccineId, vaccine] of Object.entries(profile.vaccineProgress || {})) {
      for (const [doseNum, dose] of Object.entries(vaccine.doses)) {
        await firebaseChildren.updateVaccineProgress(childId, vaccineId, Number(doseNum), dose.administered);
      }
    }

    // Migrate daily logs
    const logsKey = `daily-logs-${profile.id}`;
    const logsJson = localStorage.getItem(logsKey);
    if (logsJson) {
      const logs: DailyLog[] = JSON.parse(logsJson);
      for (const log of logs) {
        await firebaseChildren.addDailyLog(childId, log);
      }
    }
  }

  // Mark as migrated
  localStorage.setItem('migrated', 'true');
}
```

**Call in AuthContext after login:**

```typescript
useEffect(() => {
  const handleAuth = async (user: User | null) => {
    if (user && familyId && !localStorage.getItem('migrated')) {
      await migrateLocalDataToFirebase(user, familyId, firebaseChildren);
    }
  };
  // ...
}, [user, familyId]);
```

---

## Error Handling

### Try-Catch Pattern

```typescript
const updateData = async () => {
  try {
    await firebaseChildren.updateChild(childId, name, birthday);
    logAction('update');
  } catch (error: any) {
    console.error('Update failed:', error);
    alert(error.message || 'Operation failed, please try again');
  }
};
```

**Rules:**
- Always wrap async Firebase calls in try-catch
- Log errors to console
- Show user-friendly message with alert (or toast)
- Type error as `any` to access `.message`

### Network Errors

Firebase SDK handles offline mode automatically:
- Writes are queued when offline
- Data is cached locally
- Automatically syncs when back online

**No special handling needed** - it just works!

---

## Security Rules

```json
{
  "rules": {
    "families": {
      "$familyId": {
        ".read": "auth != null && (data.child('createdBy').val() === auth.uid || data.child('members').child(auth.uid).exists())",
        ".write": "auth != null && (data.child('createdBy').val() === auth.uid || data.child('members').child(auth.uid).exists())"
      }
    }
  }
}
```

**Rules:**
- Only authenticated users can read/write
- Users can only access their own family data
- Future: support multiple family members via `members/{uid}`

---

## Analytics

### Event Logging (lib/firebase.ts)

```typescript
import { logEvent } from 'firebase/analytics';
import { analytics } from './firebase';

export const logPageView = (page: string) => {
  logEvent(analytics, 'page_view', { page_name: page });
};

export const logMilestoneToggle = (milestoneId: string, achieved: boolean) => {
  logEvent(analytics, 'milestone_toggle', { milestone_id: milestoneId, achieved });
};

export const logChildProfileAction = (action: 'create' | 'update' | 'delete' | 'switch') => {
  logEvent(analytics, 'child_profile_action', { action });
};
```

**Where to log:**
- Page navigation: `navigateToPage`
- User actions: add/edit/delete child, toggle milestone/vaccine
- Feature usage: daily log, share button

---

## Best Practices

### ✅ Do:

- Use hooks for Firebase operations (don't call Firebase directly in components)
- Always include `createdAt` and `updatedAt` timestamps
- Handle loading states (`loading` from hooks)
- Use real-time listeners (`onValue`) for data that changes
- Provide fallback values (`|| {}`, `?? []`) for null safety
- Update family's `updatedAt` on every change
- Test both Firebase and LocalStorage modes

### ❌ Don't:

- Call Firebase methods directly in render
- Forget to unsubscribe from listeners (causes memory leaks)
- Store large files in Realtime Database (use Storage instead)
- Hardcode Firebase config (use environment variables)
- Skip error handling for async operations
- Forget to update `updatedAt` timestamp

---

## Common Patterns

### Conditional Hook Usage

```typescript
const { familyId } = useFirebaseFamily(user);
const firebaseChildren = useFirebaseChildren(familyId);

// Only call Firebase methods if user is logged in
if (user) {
  await firebaseChildren.addChild(...);
} else {
  setLocalChildProfiles(...);
}
```

### Real-time Listener with Cleanup

```typescript
useEffect(() => {
  if (!user || !familyId) return;

  const dataRef = ref(database, `families/${familyId}/children`);
  const unsubscribe = onValue(dataRef, (snapshot) => {
    const data = snapshot.val();
    setData(data ? Object.values(data) : []);
  });

  return () => unsubscribe(); // Cleanup
}, [user, familyId]);
```

### Null Safety

```typescript
// Always handle potentially null/undefined values
const childProfiles = familyData?.children ? Object.values(familyData.children) : [];
const currentChild = childProfiles.find(c => c.id === currentChildId) || null;
const milestoneProgress = currentChild?.milestoneProgress || {};
```

---

## Testing Considerations

### Test Both Modes

1. **Guest Mode:**
   - Open in incognito window
   - Add child, toggle milestones
   - Verify LocalStorage updates

2. **Authenticated Mode:**
   - Sign in with Google
   - Verify data migrates from LocalStorage
   - Add/edit data, verify Firebase updates
   - Open in another browser, verify sync

3. **Cross-Device:**
   - Sign in on Device A
   - Add data
   - Sign in on Device B with same account
   - Verify data appears immediately

---

## Environment Variables

### Required in .env

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
VITE_FIREBASE_DATABASE_URL=https://littlesteps-xxxxx-asia-southeast1.firebasedatabase.app
```

### GitHub Secrets (for CI/CD)

Add all `VITE_FIREBASE_*` variables to GitHub Secrets for deployment.
