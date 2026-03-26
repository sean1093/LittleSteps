import { initializeApp } from 'firebase/app';
import { getAnalytics, Analytics, logEvent as firebaseLogEvent } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "REMOVED_EXPOSED_KEY",
  authDomain: "littlesteps-c6ab6.firebaseapp.com",
  projectId: "littlesteps-c6ab6",
  storageBucket: "littlesteps-c6ab6.firebasestorage.app",
  messagingSenderId: "452108618411",
  appId: "1:452108618411:web:d418089cc6bd02fc7005ee",
  measurementId: "G-KKNCMS67JD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser environment)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

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

export default app;
