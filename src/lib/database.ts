import { getDatabase } from 'firebase/database';
import { app } from './firebase';

/**
 * The Realtime Database instance, in a module of its own so that importing
 * `lib/firebase` does not import the database SDK.
 *
 * `lib/firebase` runs on every route: it holds Auth, which the entry page
 * needs before it can render, and Analytics. The database SDK was the largest
 * single thing in the first load, and the public pages (the wikis, the guides,
 * LittleOuting, BabyOasis, LittleGuard, the about page) never read a byte from
 * it. Those are the pages a search engine indexes and the first thing a parent
 * without an account sees.
 *
 * So nothing on the entry's static import path may import this file, directly
 * or through a hook that does. The data hooks are reached through the lazy
 * bridges in `common/contexts/ChildStoreBridge` and `common/ChildRecordsBridge`,
 * which mount only once someone is signed in. `e2e/specs/bundle.spec.ts` walks
 * the built output and fails if the database chunk becomes reachable from
 * `index.html` without a dynamic import.
 *
 * App Check stays in `lib/firebase`. It is initialised for the app, not for the
 * database, and Auth requests carry its token too; the database picks the token
 * up whenever it starts (see the note on delayed initialisation there).
 */
export const database = getDatabase(app, import.meta.env.VITE_FIREBASE_DATABASE_URL);
