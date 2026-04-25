import { initializeApp } from 'firebase/app';
import { getAnalytics, Analytics, logEvent as firebaseLogEvent } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser environment)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Realtime Database
export const database = getDatabase(app, import.meta.env.VITE_FIREBASE_DATABASE_URL);

// Export analytics instance
export { analytics };

// Helper function to log events safely
export const logEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (analytics) {
    firebaseLogEvent(analytics, eventName, eventParams);
  }
};

// Pre-defined event helpers
export const logPageView = (pageName: string) => {
  // Determine app category and page details
  const getPageMetadata = (page: string) => {
    // Determine which app
    let app = 'main';
    let section = 'home';
    let feature = page;

    if (page === 'home') {
      app = 'main';
      section = 'landing';
      feature = 'main-entry';
    } else if (page === 'littlebloom') {
      app = 'littlebloom';
      section = 'wip';
      feature = 'pregnancy-companion';
    } else if (page.startsWith('littlesteps')) {
      app = 'littlesteps';
      const parts = page.split('/');
      feature = parts[1] || 'home';

      // Categorize by section
      if (feature === 'dashboard' || feature === 'daily-log' || feature === 'growth-charts' || feature === 'sleep-analysis') {
        section = 'data-tracking';
      } else if (feature === 'milestones' || feature === 'vaccine-tracking') {
        section = 'development';
      } else if (feature === 'complementary-food' || feature === 'sleep-training') {
        section = 'nutrition-sleep';
      } else if (feature === 'care-guide') {
        section = 'education';
      } else {
        section = 'landing';
      }
    }

    return { app, section, feature };
  };

  const metadata = getPageMetadata(pageName);

  logEvent('page_view', {
    page_name: pageName,
    page_path: window.location.hash || '/',
    page_location: window.location.href,
    page_title: document.title,
    // Custom dimensions for better segmentation
    app_name: metadata.app,           // main | littlesteps | littlebloom
    app_section: metadata.section,    // landing | data-tracking | development | etc.
    app_feature: metadata.feature,    // specific feature name
  });
};

export const logMilestoneToggle = (milestoneId: string, achieved: boolean) => {
  logEvent('milestone_toggle', {
    milestone_id: milestoneId,
    achieved: achieved
  });
};

export const logVaccineToggle = (vaccineId: string, doseNumber: number, administered: boolean) => {
  logEvent('vaccine_toggle', {
    vaccine_id: vaccineId,
    dose_number: doseNumber,
    administered: administered
  });
};

export const logChildProfileAction = (action: 'create' | 'update' | 'delete' | 'switch') => {
  logEvent('child_profile_action', { action });
};

export const logAuthEvent = (action: 'login' | 'logout' | 'login_failed') => {
  logEvent('auth_action', { action });
};

export default app;
