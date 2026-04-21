# LittleSteps GitHub Issues - Task Breakdown

This document contains detailed specifications for all planned features and enhancements. Each issue is ready to be created on GitHub with complete implementation details.

---

## P0 - Critical Priority (Core Features)

### Issue #1: [Feature] Implement Sleep Analysis Page

**Labels:** `feature`, `sleep-tracking`, `data-analysis`, `P0`

**Background**

The Sleep Analysis feature has been planned and designed but not yet implemented. This feature will analyze baby's sleep patterns from daily logs and provide actionable recommendations based on age-appropriate sleep requirements.

**Requirements**

Core Features:
1. **Sleep Statistics Dashboard**
   - Display daily average sleep duration (not total for week/month)
   - Show sleep count and average duration per sleep session
   - Display night sleep vs daytime nap breakdown
   - Calculate sleep regularity score (0-100)

2. **Visual Charts**
   - Bar chart: Actual vs Recommended sleep duration comparison
   - Bar chart: Night sleep vs Daytime naps comparison
   - Timeline chart: 7-day sleep pattern visualization (like Gantt chart)

3. **Age-based Recommendations**
   - Compare actual sleep with age-appropriate guidelines from `src/data/sleep.ts`
   - Provide categorized advice (✅ good / ⚠️ attention / 🔧 improve)
   - Suggest specific actionable improvements

4. **Period Filters**
   - Today: Show today's total sleep
   - This Week: Show daily average
   - This Month: Show daily average

**Technical Specifications**

New Files to Create:

1. `src/utils/sleepAnalysis.ts`
   ```typescript
   export interface SleepStats {
     totalDuration: number;        // Total sleep in minutes
     sleepCount: number;            // Number of sleep sessions
     averageDuration: number;       // Average per session
     nightSleep: number;            // Night sleep duration (18:00-06:00)
     daytimeNaps: number;           // Daytime nap duration
     nightSleepCount: number;       // Number of night sleeps
     napCount: number;              // Number of naps
     dailyAverage: number;          // Daily average for week/month
     dayCount: number;              // Number of days in period
   }

   export interface SleepRegularity {
     bedtimeRegularity: number;     // 0-100 score
     wakeTimeRegularity: number;    // 0-100 score
     averageBedtime: string;        // "21:30"
     averageWakeTime: string;       // "07:00"
   }

   export interface SleepAdvice {
     category: 'good' | 'attention' | 'improve';
     title: string;
     description: string;
     suggestions: string[];
   }

   // Functions to implement
   calculateSleepStats(logs: DailyLog[], period: 'today' | 'week' | 'month'): SleepStats
   calculateSleepRegularity(logs: DailyLog[]): SleepRegularity
   getSleepRecommendation(ageInMonths: number): SleepRequirement
   generateSleepAdvice(stats: SleepStats, ageInMonths: number): SleepAdvice[]
   isNightSleep(startTime: string): boolean
   ```

2. `src/components/SimpleBarChart.tsx`
   ```typescript
   interface SimpleBarChartProps {
     data: Array<{
       label: string;
       value: number;
       max: number;
       color: string;
     }>;
     height?: number;
   }
   ```
   - CSS-based implementation (no external chart library)
   - Animated bars with Framer Motion
   - Show value labels

3. `src/components/SleepTimelineChart.tsx`
   ```typescript
   interface SleepTimelineChartProps {
     weekLogs: DailyLog[];  // Last 7 days of sleep logs
   }
   ```
   - X-axis: 24 hours (0-24)
   - Y-axis: 7 days
   - Night sleep: darker color
   - Daytime naps: lighter color

4. `src/pages/SleepAnalysisPage.tsx`
   - Period selector buttons
   - Statistics cards (grid layout)
   - Charts section
   - Regularity scoring with star rating
   - Advice cards with color coding

**Implementation Steps**

Step 1: Create Sleep Analysis Utilities
- [ ] Create `src/utils/sleepAnalysis.ts`
- [ ] Implement `calculateAge(birthday: string): number`
- [ ] Implement `calculateSleepStats(logs, period)` with daily average calculation
- [ ] Implement `calculateSleepRegularity(logs)` using standard deviation
- [ ] Implement `getSleepRecommendation(ageInMonths)`
- [ ] Implement `generateSleepAdvice(stats, ageInMonths)` with logic:
  - Total duration check (sufficient/insufficient/excessive)
  - Night sleep ratio check (should be 65-75% for 3+ months)
  - Sleep count check (too fragmented)
- [ ] Implement `isNightSleep(startTime)` - returns true if 18:00-06:00
- [ ] Implement `parseHourRange(rangeString: string): [number, number]`

Step 2: Create Chart Components
- [ ] Create `src/components/SimpleBarChart.tsx`
  - Render horizontal bars with CSS
  - Add Framer Motion animations
  - Show percentage and absolute values
- [ ] Create `src/components/SleepTimelineChart.tsx`
  - Calculate sleep blocks positioning
  - Render 7-day timeline with time labels
  - Color code night vs day sleep
- [ ] Test components with mock data

Step 3: Create Sleep Analysis Page
- [ ] Create `src/pages/SleepAnalysisPage.tsx`
- [ ] Add props interface matching DailyLogPage pattern
- [ ] Implement period selector (today/week/month) with state
- [ ] Filter sleep logs from daily logs
- [ ] Calculate statistics using utilities
- [ ] Render statistics cards:
  - For "today": show total duration
  - For "week/month": show daily average
- [ ] Render comparison charts
- [ ] Render regularity section with star rating (1-5 stars based on score)
- [ ] Render advice cards:
  - Green background for "good"
  - Yellow background for "attention"
  - Red background for "improve"
- [ ] Handle empty states:
  - No child selected
  - No sleep logs
  - Insufficient data (< 3 logs)

Step 4: Testing & Refinement
- [ ] Test with real sleep data
- [ ] Verify daily average calculations
- [ ] Test period switching
- [ ] Verify age-based recommendations accuracy
- [ ] Test regularity scoring algorithm
- [ ] Verify advice generation logic
- [ ] Test empty states
- [ ] Test responsive design on mobile
- [ ] Run `npm run build`

**Acceptance Criteria**

- [ ] Page correctly shows daily average (not total) for week/month periods
- [ ] Night sleep is correctly identified (18:00-06:00 start time)
- [ ] Regularity score accurately reflects consistency
- [ ] Age-based recommendations match sleep.ts data
- [ ] Advice categories are correctly assigned based on actual sleep
- [ ] Charts animate smoothly
- [ ] Period switching updates all sections
- [ ] Empty states guide users to record sleep data
- [ ] No TypeScript compilation errors
- [ ] Mobile responsive (works on 375px width)

**Design Reference**

Complete specifications in `/Users/sean_chou/.claude/plans/witty-painting-dragon.md`

**Related Files**
- `src/hooks/useDailyLogs.ts` - Already provides sleep data
- `src/data/sleep.ts` - Sleep requirements by age
- `src/types/index.ts` - SleepData interface
- `src/utils/dateHelpers.ts` - Date utilities

---

### Issue #2: [Feature] Add Growth Chart Data Input

**Labels:** `feature`, `growth-tracking`, `P0`

**Background**

The Growth Charts page currently only displays a placeholder message when gender/birthday is not set. It should allow parents to record baby's weight and height measurements and visualize growth over time against WHO standards.

**Requirements**

1. **Data Input Interface**
   - Record date, weight (kg), and height (cm)
   - Validate measurements (reasonable ranges by age)
   - Edit/delete existing measurements
   - Sort by date (newest first)

2. **Data Visualization**
   - Plot measurements on WHO growth charts
   - Show percentile curves (3rd, 15th, 50th, 85th, 97th)
   - Display trend line for baby's growth
   - Support both weight and height charts

3. **Data Storage**
   - Store in `children/{childId}/growthRecords`
   - Support dual-mode (Firebase + LocalStorage)
   - Sync across devices for logged-in users

**Technical Specifications**

New Types (add to `src/types/index.ts`):
```typescript
export interface GrowthRecord {
  id: string;
  childId: string;
  date: string;              // YYYY-MM-DD
  ageInMonths: number;       // Calculated from birthday
  weight?: number;           // in kg
  height?: number;           // in cm
  headCircumference?: number; // in cm (optional)
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}
```

New Hook: `src/hooks/useGrowthRecords.ts`
```typescript
export function useGrowthRecords(childId: string | null, user: User | null) {
  const [records, setRecords] = useState<GrowthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener for Firebase
  // LocalStorage for guest mode

  return {
    records,
    loading,
    addRecord,
    updateRecord,
    deleteRecord
  };
}
```

Files to Modify:
- `src/pages/GrowthChartsPage.tsx` - Add data input and chart visualization
- `src/hooks/useFirebaseChildren.ts` - Add growth record CRUD methods

WHO Growth Standards Data:
- Use WHO Child Growth Standards (0-60 months)
- Gender-specific percentile curves
- Store as JSON data files or use calculation formulas

**Implementation Steps**

- [ ] Add GrowthRecord type to `src/types/index.ts`
- [ ] Create `src/hooks/useGrowthRecords.ts` with dual-mode support
- [ ] Add growth record methods to `useFirebaseChildren.ts`
- [ ] Update Firebase security rules for `growthRecords` path
- [ ] Create data input modal component
- [ ] Create growth record list component
- [ ] Implement WHO growth chart visualization (consider using recharts or custom SVG)
- [ ] Add data validation (reasonable weight/height ranges)
- [ ] Implement edit/delete functionality
- [ ] Add empty state prompting to record first measurement
- [ ] Test dual-mode functionality
- [ ] Test chart rendering with various data points

**Acceptance Criteria**

- [ ] Parents can add weight/height measurements with date
- [ ] Measurements are plotted on WHO growth charts
- [ ] Percentile curves are displayed correctly by gender
- [ ] Data persists in Firebase for logged-in users
- [ ] Data persists in LocalStorage for guest mode
- [ ] Edit and delete work correctly
- [ ] Reasonable validation prevents invalid entries
- [ ] Charts are responsive on mobile

**Resources**
- WHO Growth Standards: https://www.who.int/tools/child-growth-standards

---

### Issue #3: [Enhancement] Complete LocalStorage Mode Support for Daily Logs

**Labels:** `enhancement`, `data-persistence`, `P0`

**Background**

Daily Log feature currently only supports Firebase mode. Guest users (not logged in) cannot create, update, or delete daily logs. This breaks the dual-mode architecture principle of the app.

**Current Problem**

In `src/pages/DailyLogPage.tsx`:
```typescript
if (user) {
  await firebaseChildren.addDailyLog(currentChild.id, completeLogData);
} else {
  throw new Error('LocalStorage create not supported yet');
}
```

**Requirements**

Implement full LocalStorage CRUD operations for daily logs to match the pattern used in milestones and vaccines.

**Technical Specifications**

Files to Modify:

1. `src/hooks/useDailyLogs.ts`
   - Remove `throw new Error()` in addLog, updateLog, deleteLog
   - Implement actual LocalStorage operations
   - Follow pattern from `src/hooks/useMilestones.ts`

2. `src/pages/DailyLogPage.tsx`
   - Remove error handling for "not supported yet"
   - Use `useDailyLogs` hook methods directly for guest mode

**Implementation Steps**

- [ ] Review `src/hooks/useMilestones.ts` for reference pattern
- [ ] Implement `addLog` in `useDailyLogs.ts`:
  - Generate unique ID
  - Add to logs array
  - Save to localStorage with key `daily-logs-${childId}`
  - Update state
- [ ] Implement `updateLog` in `useDailyLogs.ts`:
  - Find log by ID
  - Apply updates
  - Save to localStorage
  - Update state
- [ ] Implement `deleteLog` in `useDailyLogs.ts`:
  - Filter out deleted log
  - Save to localStorage
  - Update state
- [ ] Update `DailyLogPage.tsx` to use hook methods for guest mode
- [ ] Test create, read, update, delete in guest mode
- [ ] Test data persistence across page reloads
- [ ] Verify no regression in Firebase mode

**Acceptance Criteria**

- [ ] Guest users can create daily logs (feeding, sleep, diaper)
- [ ] Guest users can edit existing logs
- [ ] Guest users can delete logs
- [ ] Data persists in LocalStorage across sessions
- [ ] Today's timeline updates immediately after CRUD operations
- [ ] Firebase mode continues to work as before
- [ ] No console errors in guest mode

---

## P1 - High Priority (Important Enhancements)

### Issue #4: [DevOps] Setup Pre-commit Hook for Build Validation

**Labels:** `devops`, `ci-cd`, `P1`

**Background**

TypeScript compilation errors are only caught during `npm run build`, which happens after code is committed and pushed. This wastes time and creates broken commits in git history.

**Requirements**

Automatically run `npm run build` before every commit to catch TypeScript errors early.

**Technical Specifications**

Use Husky to manage git hooks:

```json
// package.json
{
  "scripts": {
    "prepare": "husky install"
  },
  "devDependencies": {
    "husky": "^8.0.0"
  }
}
```

Pre-commit hook:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run build
```

**Implementation Steps**

- [ ] Install husky: `npm install --save-dev husky`
- [ ] Add prepare script to package.json
- [ ] Run `npx husky install`
- [ ] Create pre-commit hook: `npx husky add .husky/pre-commit "npm run build"`
- [ ] Test hook by making a commit with TypeScript error
- [ ] Verify hook prevents commit when build fails
- [ ] Verify hook allows commit when build succeeds
- [ ] Update .gitignore if needed
- [ ] Commit husky configuration files

**Acceptance Criteria**

- [ ] Husky is installed and configured
- [ ] Pre-commit hook runs `npm run build` automatically
- [ ] Commits are blocked if build fails
- [ ] Commits proceed if build succeeds
- [ ] All team members get the hook after `npm install`

---

### Issue #5: [Enhancement] Add Global Error Boundary

**Labels:** `enhancement`, `error-handling`, `P1`

**Background**

The app currently has no global error handling. Runtime errors cause the entire app to crash with a blank white screen, providing poor user experience.

**Requirements**

Implement React Error Boundary to catch runtime errors and display a friendly fallback UI.

**Technical Specifications**

Create Error Boundary Component:

```typescript
// src/components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to analytics service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

Fallback UI:
- Friendly error message in Traditional Chinese
- "Reload Page" button
- "Report Issue" button (opens GitHub issue)
- Maintains app styling (warm colors, rounded corners)

**Implementation Steps**

- [ ] Create `src/components/ErrorBoundary.tsx`
- [ ] Create `src/components/ErrorFallback.tsx`
- [ ] Wrap `<App />` with ErrorBoundary in `src/main.tsx`
- [ ] Add error logging (console for now, Firebase Analytics later)
- [ ] Design friendly error UI with LittleSteps branding
- [ ] Add "重新載入" (Reload) button
- [ ] Add "回報問題" (Report Issue) button linking to GitHub
- [ ] Test with intentional errors
- [ ] Test reload functionality

**Acceptance Criteria**

- [ ] Runtime errors don't crash the app
- [ ] Users see friendly error message instead of blank screen
- [ ] Reload button successfully resets the app
- [ ] Report Issue button opens GitHub issue form
- [ ] Error details are logged to console
- [ ] Error boundary doesn't interfere with normal app operation

---

### Issue #6: [Enhancement] Implement Loading States & Skeleton Screens

**Labels:** `enhancement`, `ux`, `P1`

**Background**

Most pages show a generic spinner while loading. This creates poor perceived performance and doesn't give users context about what's loading.

**Requirements**

Replace loading spinners with skeleton screens that match the actual content layout.

**Technical Specifications**

Create Skeleton Components:

1. `src/components/skeletons/CardSkeleton.tsx`
   - Animated placeholder for card components
   - Match rounded-2xl and shadow-soft styling

2. `src/components/skeletons/ListItemSkeleton.tsx`
   - For milestone/vaccine list items
   - Include icon placeholder and text lines

3. `src/components/skeletons/DashboardSkeleton.tsx`
   - Statistics cards skeleton
   - Chart placeholders

Use CSS animations:
```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 0px,
    #f8f8f8 40px,
    #f0f0f0 80px
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

**Pages to Update**

- [ ] DashboardPage
- [ ] MilestonesPage
- [ ] VaccineTrackingPage
- [ ] GrowthChartsPage
- [ ] DailyLogPage
- [ ] SleepAnalysisPage (when implemented)

**Implementation Steps**

- [ ] Create skeleton component library
- [ ] Add shimmer animation to Tailwind config or global CSS
- [ ] Replace spinners in DashboardPage with DashboardSkeleton
- [ ] Replace spinners in list pages with ListItemSkeleton
- [ ] Test loading states with slow network throttling
- [ ] Ensure skeletons match actual content layout
- [ ] Verify animations are smooth
- [ ] Test on mobile devices

**Acceptance Criteria**

- [ ] All major pages use skeleton screens instead of spinners
- [ ] Skeletons match actual content layout
- [ ] Shimmer animation is smooth
- [ ] Loading feels faster (perceived performance)
- [ ] No layout shift when content loads
- [ ] Works well on slow connections

---

### Issue #7: [Enhancement] Food Tracking Enhancements

**Labels:** `enhancement`, `food-tracking`, `P1`

**Background**

Current food tracking only records food introduction dates. Parents need to track allergic reactions and food diary with photos.

**Requirements**

1. **Allergy Reaction Tracking**
   - Record allergic symptoms (rash, vomiting, diarrhea, etc.)
   - Severity level (mild, moderate, severe)
   - Associated foods
   - Date and notes

2. **Food Diary with Photos**
   - Capture photos of meals
   - Add notes and time
   - Link to specific foods
   - View timeline of meals

**Technical Specifications**

New Types:
```typescript
export interface AllergyReaction {
  id: string;
  childId: string;
  date: string;
  foodName: string;
  symptoms: string[];      // ['rash', 'vomiting', 'diarrhea']
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
  createdAt: string;
}

export interface FoodDiaryEntry {
  id: string;
  childId: string;
  timestamp: string;
  foodNames: string[];     // Foods in this meal
  photoUrl?: string;       // Firebase Storage URL or base64 for LocalStorage
  notes?: string;
  createdAt: string;
}
```

New Components:
- `AllergyReactionModal.tsx` - Record allergy incident
- `FoodDiaryModal.tsx` - Add food diary entry with photo
- `AllergyReactionsList.tsx` - Display allergy history
- `FoodDiaryTimeline.tsx` - Photo timeline of meals

Storage:
- Firebase Storage for photos (logged-in users)
- Base64 encoding in LocalStorage (guest users)
- Keep photo size limits (max 2MB)

**Implementation Steps**

- [ ] Add new types to `src/types/index.ts`
- [ ] Create allergy reaction recording modal
- [ ] Create food diary entry modal with photo upload
- [ ] Implement photo upload to Firebase Storage
- [ ] Implement photo storage in LocalStorage (base64)
- [ ] Add allergy reactions list to ComplementaryFoodPage
- [ ] Add food diary timeline view
- [ ] Add photo compression before upload
- [ ] Add photo preview and deletion
- [ ] Update Firebase security rules for storage
- [ ] Test with various image formats and sizes
- [ ] Test dual-mode support

**Acceptance Criteria**

- [ ] Parents can record allergy reactions with symptoms and severity
- [ ] Parents can add food diary entries with photos
- [ ] Photos are uploaded to Firebase Storage for logged-in users
- [ ] Photos are stored as base64 in LocalStorage for guest users
- [ ] Photo size is limited and validated
- [ ] Timeline displays food diary entries chronologically
- [ ] Allergy history is easily reviewable
- [ ] Works in both Firebase and LocalStorage modes

---

### Issue #8: [Enhancement] Vaccine Tracking Enhancements

**Labels:** `enhancement`, `vaccine-tracking`, `P1`

**Background**

Current vaccine tracking only marks vaccines as completed. Parents need to track side effects and get reminders for upcoming vaccines.

**Requirements**

1. **Side Effects Tracking**
   - Record side effects after vaccination (fever, soreness, irritability)
   - Severity and duration
   - Notes and interventions

2. **Vaccine Reminders** (Future enhancement)
   - Notifications for upcoming vaccines
   - Calendar integration
   - Configurable reminder timing

**Technical Specifications**

New Type:
```typescript
export interface VaccineSideEffect {
  id: string;
  childId: string;
  vaccineId: string;        // Which vaccine
  date: string;             // When side effect occurred
  symptoms: string[];       // ['fever', 'soreness', 'irritability']
  severity: 'mild' | 'moderate' | 'severe';
  duration: number;         // Duration in hours
  interventions?: string;   // What was done (e.g., "给了退烧药")
  notes?: string;
  createdAt: string;
}
```

Storage:
- `children/{childId}/vaccineSideEffects`

New Components:
- `VaccineSideEffectModal.tsx` - Record side effects
- `VaccineSideEffectsList.tsx` - Display side effect history

**Implementation Steps**

Phase 1: Side Effects Tracking
- [ ] Add VaccineSideEffect type to `src/types/index.ts`
- [ ] Create side effect recording modal
- [ ] Add side effects section to VaccineTrackingPage
- [ ] Implement CRUD operations for side effects
- [ ] Link side effects to specific vaccines
- [ ] Add dual-mode support (Firebase + LocalStorage)
- [ ] Test side effect recording and display

Phase 2: Reminders (Future)
- [ ] Research browser notification APIs
- [ ] Implement notification permission request
- [ ] Calculate upcoming vaccine dates
- [ ] Schedule notifications
- [ ] Add notification settings

**Acceptance Criteria**

Phase 1:
- [ ] Parents can record side effects for each vaccine
- [ ] Side effects are linked to specific vaccines
- [ ] Severity and duration are tracked
- [ ] History is viewable per vaccine
- [ ] Works in dual-mode

Phase 2 (Future):
- [ ] Browser notifications work for upcoming vaccines
- [ ] Users can configure reminder timing
- [ ] Notifications are accurate and timely

---

## P2 - Medium Priority (Experience Improvements)

### Issue #9: [Feature] Data Export (PDF/CSV)

**Labels:** `feature`, `data-export`, `P2`

**Background**

Parents may need to share growth data with pediatricians or keep backups. Exporting data to PDF or CSV provides flexibility and data ownership.

**Requirements**

1. **PDF Report Export**
   - Growth summary report
   - Include growth charts
   - Include milestone achievements
   - Include vaccination history
   - Professional medical document styling

2. **CSV Data Export**
   - Export growth measurements
   - Export daily logs
   - Export milestone progress
   - Comma-separated format for Excel/Sheets

**Technical Specifications**

Libraries:
- `jspdf` - PDF generation
- `jspdf-autotable` - Tables in PDF
- `html2canvas` - Chart screenshots

Export Formats:
```typescript
interface ExportOptions {
  type: 'pdf' | 'csv';
  data: 'growth' | 'milestones' | 'vaccines' | 'dailyLogs' | 'all';
  dateRange?: { start: string; end: string };
}
```

**Implementation Steps**

- [ ] Install jspdf and dependencies
- [ ] Create PDF export utility functions
- [ ] Create CSV export utility functions
- [ ] Add "Export Data" button to Dashboard
- [ ] Create export options modal
- [ ] Implement growth report PDF generation
- [ ] Implement milestone report PDF generation
- [ ] Implement CSV export for all data types
- [ ] Add date range filter for exports
- [ ] Test PDF generation with Chinese characters
- [ ] Test CSV import into Excel/Google Sheets
- [ ] Optimize file sizes

**Acceptance Criteria**

- [ ] PDF exports include all selected data
- [ ] PDF reports are professionally formatted
- [ ] Charts are included as images in PDF
- [ ] Chinese characters display correctly in PDF
- [ ] CSV files import correctly into spreadsheet software
- [ ] Users can select date ranges for export
- [ ] File downloads work on mobile browsers

---

### Issue #10: [Performance] Optimize Bundle Size with Code Splitting

**Labels:** `performance`, `optimization`, `P2`

**Background**

Current bundle size is 1.5MB (346KB gzipped), which is quite large. Vite build warns about chunks larger than 500KB. This impacts initial load time, especially on slow connections.

**Current Problem**

All routes and components are bundled together, including:
- All pages loaded upfront
- Firebase SDK (~400KB)
- Framer Motion (~100KB)
- Heavy data files (vaccines, food categories)

**Requirements**

Reduce initial bundle size to < 500KB through code splitting and lazy loading.

**Technical Specifications**

Techniques:
1. **Route-based code splitting**
   ```typescript
   const DashboardPage = lazy(() => import('./pages/DashboardPage'));
   ```

2. **Dynamic imports for heavy libraries**
   ```typescript
   // Import Firebase only when needed
   const { signInWithPopup } = await import('firebase/auth');
   ```

3. **Lazy load data files**
   ```typescript
   const vaccines = await import('./data/vaccines.json');
   ```

4. **Manual chunks configuration**
   ```typescript
   // vite.config.ts
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/database'],
           'vendor-ui': ['framer-motion', 'lucide-react'],
           'data': ['./src/data/vaccines', './src/data/milestones']
         }
       }
     }
   }
   ```

**Implementation Steps**

- [ ] Analyze current bundle with `vite-bundle-visualizer`
- [ ] Implement route-based code splitting
- [ ] Wrap route components with React.lazy and Suspense
- [ ] Configure manual chunks in vite.config.ts
- [ ] Lazy load Firebase SDK
- [ ] Lazy load data files
- [ ] Add loading fallbacks for lazy components
- [ ] Test that all routes load correctly
- [ ] Measure bundle size reduction
- [ ] Test loading performance on slow 3G
- [ ] Optimize further if needed

**Acceptance Criteria**

- [ ] Initial bundle size < 500KB (gzipped)
- [ ] Each route lazy loads only required code
- [ ] No blank screens during lazy loading
- [ ] Loading states are smooth
- [ ] No regression in functionality
- [ ] Lighthouse performance score improves

**Resources**
- Vite Code Splitting: https://vitejs.dev/guide/features.html#code-splitting
- React Lazy: https://react.dev/reference/react/lazy

---

### Issue #11: [Feature] Dark Mode Support

**Labels:** `feature`, `theme`, `P2`

**Background**

Many parents use the app during late-night feedings or when baby is sleeping. Dark mode reduces eye strain and saves battery on OLED screens.

**Requirements**

1. **Theme Toggle**
   - Light and dark mode options
   - System preference detection
   - Persistent user preference

2. **Dark Theme Styling**
   - Maintain warm, friendly aesthetic
   - Adjust all colors for dark background
   - Ensure sufficient contrast (WCAG AA)
   - Update gradients and shadows

**Technical Specifications**

Use Tailwind's dark mode with class strategy:

```typescript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#1a1a1a',
          card: '#2d2d2d',
          text: '#e5e5e5',
          // ... more colors
        }
      }
    }
  }
}
```

Theme Context:
```typescript
const ThemeContext = createContext<{
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}>();
```

**Implementation Steps**

- [ ] Configure Tailwind dark mode
- [ ] Define dark theme color palette
- [ ] Create ThemeContext and provider
- [ ] Create theme toggle button component
- [ ] Add theme toggle to Sidebar
- [ ] Apply dark mode classes to all components
- [ ] Update gradients for dark mode
- [ ] Update shadows for dark mode
- [ ] Test contrast ratios with WebAIM
- [ ] Store theme preference in localStorage
- [ ] Implement system preference detection
- [ ] Test on iOS/Android devices
- [ ] Ensure smooth theme transitions

**Acceptance Criteria**

- [ ] Theme toggle switches between light and dark modes
- [ ] System preference is detected on first visit
- [ ] Theme preference persists across sessions
- [ ] All components look good in dark mode
- [ ] Contrast ratios meet WCAG AA standards
- [ ] Gradients and shadows are adapted for dark mode
- [ ] Theme transitions are smooth
- [ ] Battery usage is reduced on OLED screens

---

### Issue #12: [Feature] Multilingual Support (English + Simplified Chinese)

**Labels:** `feature`, `i18n`, `P2`

**Background**

Currently the app is only in Traditional Chinese. Supporting English and Simplified Chinese expands the user base to international families and mainland China users.

**Requirements**

1. **Language Switcher**
   - Language selection in settings/sidebar
   - Persist language preference
   - Support 3 languages: 繁體中文 / English / 简体中文

2. **Translation Coverage**
   - All UI text
   - Data content (milestones, vaccines, care guides)
   - Error messages
   - Date/time formatting

**Technical Specifications**

Use i18next for React:

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'zh-TW': { translation: zhTW },
      'en': { translation: en },
      'zh-CN': { translation: zhCN }
    },
    lng: 'zh-TW',
    fallbackLng: 'zh-TW',
    interpolation: { escapeValue: false }
  });
```

Translation Files Structure:
```
src/locales/
  ├── zh-TW/
  │   ├── common.json
  │   ├── milestones.json
  │   ├── vaccines.json
  │   └── care-guide.json
  ├── en/
  │   └── ...
  └── zh-CN/
      └── ...
```

**Implementation Steps**

- [ ] Install i18next and react-i18next
- [ ] Setup i18n configuration
- [ ] Extract all UI strings from components
- [ ] Create translation files for zh-TW (baseline)
- [ ] Translate UI to English
- [ ] Translate UI to Simplified Chinese
- [ ] Translate data files (milestones, vaccines, care guides)
- [ ] Create language switcher component
- [ ] Add language switcher to Sidebar
- [ ] Implement date/time locale formatting
- [ ] Test all pages in all 3 languages
- [ ] Store language preference in localStorage
- [ ] Verify text doesn't overflow in any language

**Acceptance Criteria**

- [ ] Users can switch between 3 languages
- [ ] Language preference persists across sessions
- [ ] All UI text is translated
- [ ] All data content is translated
- [ ] Dates and times format according to locale
- [ ] No layout breaks due to text length
- [ ] Translations are accurate and natural
- [ ] Language switching is instant (no page reload)

**Resources**
- i18next: https://www.i18next.com/
- React i18next: https://react.i18next.com/

---

## P3 - Low Priority (Future Enhancements)

### Issue #13: [Feature] Photo Gallery for Milestones

**Labels:** `feature`, `photos`, `P3`

**Background**

Parents want to attach photos to milestone achievements to preserve memories and visualize baby's growth journey.

**Requirements**

1. **Photo Upload**
   - Attach photos to milestones
   - Support multiple photos per milestone
   - Photo compression before upload
   - Preview before saving

2. **Photo Gallery View**
   - Timeline view of milestone photos
   - Full-screen photo viewer
   - Swipe navigation
   - Download photos

**Technical Specifications**

Storage:
- Firebase Storage (logged-in users)
- LocalStorage with base64 (guest users, with size limits)

New Type:
```typescript
export interface MilestonePhoto {
  id: string;
  milestoneId: string;
  childId: string;
  photoUrl: string;        // Firebase Storage URL or base64
  uploadedAt: string;
}
```

Libraries:
- `react-image-crop` - Crop photos
- `browser-image-compression` - Compress before upload

**Implementation Steps**

- [ ] Add MilestonePhoto type
- [ ] Create photo upload component
- [ ] Implement Firebase Storage upload
- [ ] Implement LocalStorage base64 storage
- [ ] Add photo compression
- [ ] Create photo gallery component
- [ ] Create full-screen photo viewer
- [ ] Add swipe gestures for photo navigation
- [ ] Implement photo download
- [ ] Add photo deletion
- [ ] Update milestone cards to show photos
- [ ] Test upload with various image sizes
- [ ] Test on mobile devices

**Acceptance Criteria**

- [ ] Users can upload photos to milestones
- [ ] Photos are compressed before upload
- [ ] Gallery displays milestone photos chronologically
- [ ] Full-screen viewer works smoothly
- [ ] Photos can be downloaded
- [ ] Works in both Firebase and LocalStorage modes
- [ ] Mobile performance is good

---

### Issue #14: [Testing] Implement E2E Tests with Playwright

**Labels:** `testing`, `quality`, `P3`

**Background**

Currently there's no automated end-to-end testing. Manual testing is time-consuming and error-prone. E2E tests ensure critical user flows work correctly.

**Requirements**

Implement Playwright tests for critical user journeys:

1. **Guest User Journey**
   - Add baby profile
   - Record milestone
   - Mark vaccine as completed
   - Browse care guides

2. **Authenticated User Journey**
   - Sign in with Google (mock)
   - Add baby with sync
   - Record daily log
   - View dashboard
   - Sign out

3. **Sleep Analysis Journey**
   - Record multiple sleep logs
   - Navigate to sleep analysis
   - Verify statistics calculation
   - Check advice generation

**Technical Specifications**

Setup:
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  }
});
```

Test Structure:
```
e2e/
├── guest-user.spec.ts
├── auth-user.spec.ts
├── sleep-analysis.spec.ts
├── fixtures/
│   └── test-data.ts
└── helpers/
    └── test-helpers.ts
```

**Implementation Steps**

- [ ] Install Playwright
- [ ] Setup Playwright configuration
- [ ] Create test data fixtures
- [ ] Write guest user journey tests
- [ ] Write authenticated user journey tests (mock Firebase Auth)
- [ ] Write sleep analysis tests
- [ ] Setup CI/CD integration (GitHub Actions)
- [ ] Add test commands to package.json
- [ ] Document how to run tests
- [ ] Setup test reporting
- [ ] Run tests in CI pipeline

**Acceptance Criteria**

- [ ] E2E tests cover critical user journeys
- [ ] Tests run reliably without flakiness
- [ ] Tests run in CI on every PR
- [ ] Test failures block merging
- [ ] Screenshots/videos captured on failure
- [ ] Test coverage documented

**Resources**
- Playwright: https://playwright.dev/

---

### Issue #15: [Enhancement] PWA Offline Support & Push Notifications

**Labels:** `enhancement`, `pwa`, `P3`

**Background**

App has basic PWA setup (manifest, service worker) but doesn't work offline. True PWA should cache assets and data for offline use, and support push notifications for vaccine reminders.

**Requirements**

1. **Offline Functionality**
   - Cache app shell
   - Cache static assets
   - Sync data when back online
   - Show offline indicator

2. **Push Notifications**
   - Vaccine due date reminders
   - Milestone suggestions based on age
   - Daily log reminders

**Technical Specifications**

Use Workbox for advanced service worker:

```typescript
// vite-plugin-pwa config
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/firebasedatabase\.googleapis\.com\/.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'firebase-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 // 24 hours
          }
        }
      }
    ]
  }
})
```

Push Notifications:
- Request permission
- Subscribe to Firebase Cloud Messaging
- Send scheduled notifications
- Handle notification clicks

**Implementation Steps**

Phase 1: Offline Support
- [ ] Configure Workbox caching strategies
- [ ] Implement network-first for API calls
- [ ] Implement cache-first for static assets
- [ ] Add background sync for writes
- [ ] Create offline indicator component
- [ ] Test offline functionality
- [ ] Test sync when back online

Phase 2: Push Notifications
- [ ] Request notification permission
- [ ] Setup Firebase Cloud Messaging
- [ ] Create notification scheduler
- [ ] Implement vaccine reminders
- [ ] Implement milestone suggestions
- [ ] Handle notification clicks (deep links)
- [ ] Add notification settings
- [ ] Test on iOS and Android

**Acceptance Criteria**

Phase 1:
- [ ] App loads when offline
- [ ] Cached data is available offline
- [ ] Changes sync when back online
- [ ] Offline indicator shows connection status

Phase 2:
- [ ] Users can opt-in to notifications
- [ ] Vaccine reminders are timely
- [ ] Notifications open relevant pages
- [ ] Users can disable notifications

---

### Issue #16: [Feature] Parent Community Features

**Labels:** `feature`, `community`, `P3`

**Background**

New parents often seek advice and support from other parents. A simple community feature can provide peer support within the app.

**Requirements**

1. **Discussion Forum**
   - Topic-based discussions (feeding, sleep, development)
   - Post questions and answers
   - Upvote helpful responses
   - Report inappropriate content

2. **Milestone Sharing** (Optional)
   - Share baby's milestone achievements
   - Like and comment on others' milestones
   - Privacy controls (public/friends only)

**Technical Specifications**

This is a major feature requiring:
- Real-time database structure for posts/comments
- User authentication and profiles
- Content moderation system
- Notification system
- Privacy and safety features

**Implementation Steps**

This requires detailed planning and is marked as P3 (low priority). Should be planned as a separate epic with multiple sub-issues.

**Acceptance Criteria**

TBD - Requires detailed planning phase

---

## Summary

Total Issues: 16

**By Priority:**
- P0 (Critical): 3 issues
- P1 (High): 5 issues
- P2 (Medium): 4 issues
- P3 (Low): 4 issues

**By Type:**
- Features: 8 issues
- Enhancements: 6 issues
- DevOps: 1 issue
- Testing: 1 issue

**Estimated Effort:**
- Small (< 1 day): 3 issues (#3, #4, #5)
- Medium (1-3 days): 7 issues (#1, #2, #6, #7, #8, #9, #11)
- Large (> 3 days): 6 issues (#10, #12, #13, #14, #15, #16)

**Recommended Implementation Order:**
1. Issue #4 - Pre-commit Hook (quick win)
2. Issue #3 - LocalStorage Daily Logs (blocking dual-mode)
3. Issue #1 - Sleep Analysis Page (core feature, already planned)
4. Issue #5 - Error Boundary (improves stability)
5. Issue #2 - Growth Chart Input (completes growth tracking)
6. Issue #6 - Loading States (improves UX)
7. Rest based on user feedback and priorities
