import { initializeApp } from 'firebase/app';
import { getAnalytics, Analytics, logEvent as firebaseLogEvent } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

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
  logEvent('page_view', { page_name: pageName });
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
