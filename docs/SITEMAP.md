# LittleSteps - Site Map & Feature Architecture

## Overview

LittleSteps is a comprehensive baby care companion that provides milestone tracking, vaccine scheduling, daily care logging, and parenting guidance. The application operates in two modes: **Guest Mode** (LocalStorage-based) and **Authenticated Mode** (Firebase cloud sync).

---

## Page Hierarchy

```
Root (#/)
├── Landing Page (Guest users)
│   └── Authentication → Dashboard
├── Dashboard (#/dashboard) [Logged-in users with children]
│   ├── → Milestones Page
│   ├── → Vaccine Tracking Page
│   ├── → Daily Log Page
│   ├── → Care Guide Page
│   └── → Complementary Food Page
├── Milestones (#/milestones)
├── Care Guide (#/care-guide)
├── Vaccine Tracking (#/vaccine-tracking)
├── Complementary Food (#/complementary-food)
└── Daily Log (#/daily-log)
```

---

## Pages & Features

### 1. Landing Page (`/#/`)

**Route:** `/#/`
**Audience:** Unauthenticated users or users without children
**Purpose:** Introduction to the app and authentication entry point

#### Features
- **Hero Section**
  - App introduction and value proposition
  - Feature highlights with icons
  - Google Sign-In button (prominent CTA)
- **Feature Showcase**
  - Milestone Tracking preview
  - Vaccine Schedule preview
  - Daily Log preview
  - Care Guidelines preview
  - Complementary Food Guide preview
- **Mobile-First Design**
  - Gradient backgrounds
  - Smooth animations
  - Touch-friendly buttons

#### Navigation
- **Sign In** → Dashboard (if children exist)
- **Sign In** → Landing Page (if no children, prompts to add child)
- **Sidebar Menu** → Access to all feature pages (works in guest mode)

#### Data Flow
- No persistent data
- Authentication state managed by Firebase Auth
- Upon sign-in: triggers data migration from LocalStorage to Firebase

---

### 2. Dashboard (`/#/dashboard`)

**Route:** `/#/dashboard`
**Audience:** Authenticated users with at least one child profile
**Purpose:** Centralized overview of baby's growth and development

#### Features
- **Baby Info Card**
  - Current child's name and photo placeholder
  - Birthday and age (calculated in years/months/days)
  - Quick child switcher (if multiple children)

- **Milestone Summary Card**
  - Achievement rate (X/Y milestones achieved)
  - Progress bar visualization
  - Recent achievements (last 3 milestones with dates)
  - Click → Navigate to Milestones Page

- **Vaccine Summary Card**
  - Administration rate (X/Y doses completed)
  - Progress bar visualization
  - Next vaccine due (name, dose number, timing)
  - Click → Navigate to Vaccine Tracking Page

- **Daily Log Summary Card**
  - Today's statistics:
    - Feeding count and total amount
    - Sleep count and total duration
    - Diaper count (pee/poop breakdown)
  - Click → Navigate to Daily Log Page

- **Quick Navigation Buttons**
  - Milestones (pink gradient)
  - Vaccine Tracking (green gradient)
  - Complementary Food (orange gradient)
  - Care Guide (blue gradient)

#### Navigation
- Entry: Automatic redirect after sign-in (if children exist)
- Exit: Click any summary card or navigation button → Feature page
- Sidebar: Access to all pages

#### Data Flow
- **Input:**
  - Current child profile (from Firebase or LocalStorage)
  - Milestone progress data
  - Vaccine progress data
  - Daily logs (today's entries)
- **Processing:**
  - `useChildSummary` hook calculates all statistics
  - `calculateMilestoneSummary` computes achievement rate
  - `calculateVaccineSummary` computes next vaccine
  - `calculateDailySummary` aggregates today's logs
- **Output:** Visual summaries with drill-down navigation

#### Relationships
- **Consumes data from:**
  - Milestones Page (milestone progress)
  - Vaccine Tracking Page (vaccine progress)
  - Daily Log Page (today's logs)
- **Links to:** All feature pages
- **Updates when:** Child profile changes, milestones achieved, vaccines recorded, logs added

---

### 3. Milestones Page (`/#/milestones`)

**Route:** `/#/milestones`
**Purpose:** Track developmental milestones from 0-12+ months

#### Features
- **Milestone Database**
  - 30+ developmental milestones
  - Categories: Physical (🏃), Motor (✋), Cognitive (🧠), Feeding (🍼)
  - Age ranges: 0-2, 3-4, 5-6, 7-9, 10-12, 12+ months

- **Filters**
  - Category filter (Physical, Motor, Cognitive, Feeding, All)
  - Age range picker (Month selection)

- **Milestone Cards**
  - Title and category icon
  - Age range indicator
  - Achievement status (achieved/not achieved)
  - Click → Opens detail modal

- **Milestone Detail Modal**
  - Full description and tips
  - Achievement date picker
  - Mark as achieved/not achieved
  - Save changes

#### Navigation
- Entry: From Dashboard summary card or sidebar menu
- Within: Filter by category/age, click cards for details
- Exit: Sidebar menu to other pages

#### Data Flow
- **Input:**
  - Static milestone data (`data/milestones.ts`)
  - Current child's `milestoneProgress` object
- **Processing:**
  - Filter milestones by category and age
  - Merge static data with user progress
  - Calculate achievement count for Dashboard
- **Output:**
  - Updated `milestoneProgress` in child profile
  - Triggers Dashboard summary update
- **Storage:**
  - Guest: LocalStorage (`children-${childId}`)
  - Logged-in: Firebase (`families/{familyId}/children/{childId}/milestoneProgress`)

#### Relationships
- **Feeds Dashboard:** Achievement rate, recent milestones
- **Related to Care Guide:** Age-appropriate care tips align with milestone ages
- **Related to Complementary Food:** Feeding milestones correlate with weaning stages

---

### 4. Vaccine Tracking Page (`/#/vaccine-tracking`)

**Route:** `/#/vaccine-tracking`
**Purpose:** Manage vaccination schedules from birth to 6 years

#### Features
- **Vaccine Schedule Database**
  - 30+ vaccines (public funded & private)
  - Multi-dose tracking (e.g., Hepatitis B: 3 doses)
  - Age grouping (0M, 1M, 2M, 4M, 6M, 12M, etc.)

- **Filters**
  - Funding type (Public 公費 / Private 自費 / All)
  - Age filter (0-6M, 7-12M, 1-2Y, 2-6Y, All)

- **Vaccine Cards**
  - Vaccine name and type
  - Number of doses
  - Recommended timing
  - Administration status per dose
  - Click → Opens detail modal

- **Vaccine Detail Modal**
  - Full information (purpose, dosage)
  - Side effects guide
  - Emergency response guidelines
  - Contraindications
  - Dose tracking (checkboxes + date pickers)

- **Progress Overview**
  - Total doses administered / total doses
  - Visual progress bar

#### Navigation
- Entry: From Dashboard vaccine summary or sidebar menu
- Within: Filter by type/age, click cards for details
- Exit: Sidebar menu to other pages

#### Data Flow
- **Input:**
  - Static vaccine data (`data/vaccines.ts`)
  - Current child's `vaccineProgress` object
- **Processing:**
  - Filter vaccines by funding type and age
  - Merge static data with user progress
  - Calculate next vaccine due for Dashboard
- **Output:**
  - Updated `vaccineProgress` with dose dates
  - Triggers Dashboard summary update
- **Storage:**
  - Guest: LocalStorage (`children-${childId}`)
  - Logged-in: Firebase (`families/{familyId}/children/{childId}/vaccineProgress`)

#### Relationships
- **Feeds Dashboard:** Administration rate, next vaccine due
- **Related to Care Guide:** Post-vaccination care tips in safety guidelines
- **Indirect to Daily Log:** Parents may log fever/reactions after vaccination

---

### 5. Daily Log Page (`/#/daily-log`)

**Route:** `/#/daily-log`
**Purpose:** Quick recording of daily care activities (feeding, sleep, diaper)

#### Features
- **Quick Log Buttons** (80x80px minimum)
  - 🍼 Feeding Button
    - Single tap: Record with current timestamp
    - Opens modal for detailed entry
  - 💤 Sleep Button
    - Single tap: Start sleep timer
    - Opens modal for start/end time editing
  - 💩 Diaper Button
    - Single tap: Record diaper change
    - Opens modal for type selection (pee/poop/both)

- **Log Entry Modal** (Dynamic based on type)
  - **Feeding:**
    - Type: Breast Left/Right/Both, Formula, Solid
    - Amount (ml)
    - Duration (minutes)
    - Notes
  - **Sleep:**
    - Start time
    - End time (optional, auto-calculate duration)
    - Duration display
    - Notes
  - **Diaper:**
    - Type: Pee/Poop/Both
    - Consistency: Normal/Soft/Hard
    - Notes

- **Today's Timeline**
  - Chronological list (newest first)
  - Time, type icon, and brief details
  - Edit/delete actions
  - Visual timeline with connecting lines

- **Statistics Summary** (Today)
  - Total feeding count and amount
  - Total sleep duration
  - Diaper change count

#### Navigation
- Entry: From Dashboard daily log card or sidebar menu
- Within: Add/edit/delete logs, scroll timeline
- Exit: Sidebar menu to other pages

#### Data Flow
- **Input:**
  - User actions (button taps, form submissions)
  - Current timestamp
- **Processing:**
  - `useDailyLogs` hook manages CRUD operations
  - `calculateDailySummary` aggregates today's stats
  - Auto-calculate sleep duration from start/end times
- **Output:**
  - New `DailyLog` entries with timestamps
  - Triggers Dashboard summary update (today's count)
- **Storage:**
  - Guest: LocalStorage (`daily-logs-${childId}`)
  - Logged-in: Firebase (`families/{familyId}/children/{childId}/dailyLogs/{logId}`)
- **Migration:**
  - On sign-in: LocalStorage logs migrate to Firebase
  - Marked with `migrated-logs-${childId}` to prevent duplicates

#### Relationships
- **Feeds Dashboard:** Today's feeding/sleep/diaper statistics
- **Related to Complementary Food:** Feeding logs correlate with food introduction
- **Related to Milestones:** Feeding patterns relate to feeding milestones
- **Cross-Device Sync:** Real-time updates when logged in (e.g., both parents can see logs)

---

### 6. Care Guide Page (`/#/care-guide`)

**Route:** `/#/care-guide`
**Purpose:** Provide age-appropriate care instructions and safety guidelines

#### Features
- **General Safety Guidelines**
  - 6 essential safety tips (applicable to all ages)
  - Icon-based visual hierarchy

- **Monthly Care Guidelines** (0-12 months)
  - Age-specific care instructions
  - Categories:
    - 🏥 Physiological: Physical development, health checks
    - 🍼 Feeding: Nutrition, feeding schedules
    - 🛡️ Safety: Age-specific safety precautions

- **Filters**
  - Category filter (Physiological, Feeding, Safety, All)
  - Age filter (0M, 1M, 2M, ..., 12M)

- **Care Cards**
  - Age indicator
  - Category badge
  - Title and detailed description
  - Visual icons for quick scanning

#### Navigation
- Entry: From Dashboard quick navigation or sidebar menu
- Within: Filter by category/age, scroll through cards
- Exit: Sidebar menu to other pages

#### Data Flow
- **Input:**
  - Static care guide data (`data/careGuides.ts`)
  - Current child's age (for highlighting relevant tips)
- **Processing:**
  - Filter by category and age
  - Sort by age (ascending)
- **Output:**
  - Display filtered/sorted care tips
- **No storage:** Static content only, no user data persistence

#### Relationships
- **Related to Milestones:** Care tips align with developmental stages
- **Related to Vaccines:** Post-vaccination care and safety precautions
- **Related to Complementary Food:** Feeding guidelines reference weaning stages
- **Complements Daily Log:** Care tips inform feeding/sleep routines

---

### 7. Complementary Food Page (`/#/complementary-food`)

**Route:** `/#/complementary-food`
**Purpose:** Guide parents through introducing solid foods (4-12 months)

#### Features
- **Overview Tab**
  - Introduction to complementary feeding
  - General principles
  - Age-appropriate food texture progression

- **Stages Tab** (Three-stage system)
  - **Stage 1 (4-6 months):**
    - Texture: Smooth purees
    - Frequency: 1-2 times/day
    - Food examples
  - **Stage 2 (7-9 months):**
    - Texture: Mashed/minced
    - Frequency: 2-3 times/day
    - Food examples
  - **Stage 3 (10-12 months):**
    - Texture: Chopped/soft chunks
    - Frequency: 3 times/day + snacks
    - Food examples

- **Menu Tab** (Monthly suggestions)
  - Sample food menus for each month (4M-12M)
  - Food combinations and recipes
  - Portion size guidance

- **Safety Tab**
  - **4x3 Allergy Testing Method**
    - Modern approach to introducing allergens
    - Schedule and guidelines
  - **Forbidden Foods**
    - Honey (< 1 year)
    - High-sodium foods
    - Choking hazards (nuts, grapes, etc.)
  - **BLW (Baby-Led Weaning) Guidelines**
    - Finger food introduction
    - Safety precautions
    - Suitable foods

#### Navigation
- Entry: From Dashboard quick navigation or sidebar menu
- Within: Switch between tabs (Overview, Stages, Menu, Safety)
- Exit: Sidebar menu to other pages

#### Data Flow
- **Input:**
  - Static food guide data (`data/complementaryFood.ts`)
  - Current child's age (for stage recommendations)
- **Processing:**
  - Determine appropriate stage based on age
  - Filter menu suggestions by month
- **Output:**
  - Display stage-appropriate guidance
- **No storage:** Static content only, no user data persistence

#### Relationships
- **Related to Milestones:** Feeding milestones indicate readiness for solids
- **Related to Daily Log:** Feeding logs track solid food introduction
- **Related to Care Guide:** Feeding guidelines reference age-appropriate nutrition
- **Complements Dashboard:** Parents track feeding progress via logs

---

## Cross-Cutting Features

### 1. Multi-Child Profile Management

**Location:** Accessible from Sidebar (all pages)

#### Features
- **Child Switcher**
  - Dropdown showing all child profiles
  - Click to switch current child
  - Each child has independent data

- **Add Child Modal**
  - Name input
  - Birthday date picker
  - Photo upload (future)
  - Create new child profile

- **Edit Child**
  - Update name, birthday
  - Delete child (with confirmation)

- **Limitations**
  - Free tier: Up to 2 children
  - Premium tier (future): Unlimited children

#### Data Flow
- **Storage:**
  - Guest: LocalStorage (`child-profiles`)
  - Logged-in: Firebase (`families/{familyId}/children/{childId}`)
- **Switching:**
  - Updates `currentChildId` in state
  - Triggers re-fetch of all child-specific data
  - Dashboard, Milestones, Vaccines, Daily Log refresh automatically

#### Relationships
- **Affects all pages:** Current child determines which data is displayed
- **Feeds Dashboard:** Child info card shows current child details
- **Each child has separate:**
  - Milestone progress
  - Vaccine progress
  - Daily logs

---

### 2. Authentication & Cloud Sync

**Location:** Firebase Authentication (triggered from Landing Page)

#### Features
- **Google Sign-In**
  - OAuth 2.0 via Firebase Auth
  - Single sign-on

- **User State**
  - `user` object (email, displayName, photoURL)
  - `familyId` assigned on first sign-in

- **Multi-Device Sync**
  - Real-time Firebase Realtime Database
  - Automatic sync across devices
  - Offline support (pending writes queued)

#### Data Flow
- **Sign-In Process:**
  1. User clicks "Sign in with Google" on Landing Page
  2. Firebase Auth popup → Google OAuth
  3. `onAuthStateChanged` triggers in `AuthContext`
  4. Check if `familyId` exists in user metadata
  5. If new user: Create `familyId`, create family node
  6. Migrate LocalStorage data to Firebase
  7. Redirect to Dashboard

- **Sign-Out Process:**
  1. User clicks "Sign Out" in Sidebar
  2. Firebase Auth sign out
  3. Clear Firebase listeners
  4. Redirect to Landing Page
  5. Data persists in LocalStorage for guest mode

#### Relationships
- **Affects all pages:** Determines storage mode (LocalStorage vs Firebase)
- **Triggers Dashboard:** Automatic redirect on sign-in (if children exist)
- **Enables sync:** Daily logs, milestones, vaccines sync in real-time

---

### 3. Sidebar Navigation

**Location:** All pages (hamburger menu)

#### Features
- **Menu Items:**
  - 🏠 Dashboard
  - 📊 Milestones
  - 💉 Vaccine Tracking
  - 📝 Daily Log
  - 🛡️ Care Guide
  - 🥄 Complementary Food

- **User Section:**
  - User profile (if logged in)
  - Child switcher
  - Add child button
  - Sign out button

- **Guest Mode:**
  - "Sign In" button
  - All features still accessible (LocalStorage)

#### Navigation
- Click menu item → Navigate to page
- Active page highlighted
- Auto-close on mobile after selection

---

## Data Relationships

### Primary Data Entities

```
Family
├── familyId (unique identifier)
└── children[]
    ├── Child 1
    │   ├── id, name, birthday
    │   ├── milestoneProgress{}
    │   ├── vaccineProgress{}
    │   └── dailyLogs[]
    └── Child 2
        ├── id, name, birthday
        ├── milestoneProgress{}
        ├── vaccineProgress{}
        └── dailyLogs[]
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Firebase / LocalStorage             │
│  families/{familyId}/children/{childId}/                │
│    - profile (name, birthday)                           │
│    - milestoneProgress                                  │
│    - vaccineProgress                                    │
│    - dailyLogs                                          │
└────────────┬────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│                    Hooks Layer                          │
│  - useFirebaseFamily (family & children CRUD)           │
│  - useFirebaseChildren (milestone/vaccine updates)     │
│  - useDailyLogs (daily log CRUD)                        │
│  - useChildSummary (calculate statistics)               │
└────────────┬────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│                  Component Layer                        │
│                                                         │
│  Dashboard ──────┐                                      │
│    │             │                                      │
│    ├─ MilestoneSummaryCard ──► Milestones Page         │
│    ├─ VaccineSummaryCard ────► Vaccine Tracking Page   │
│    └─ DailyLogSummaryCard ───► Daily Log Page          │
│                                                         │
│  Milestones Page ─────► milestoneProgress              │
│  Vaccine Page ────────► vaccineProgress                │
│  Daily Log Page ──────► dailyLogs                      │
│  Care Guide ───────────► Static data only              │
│  Complementary Food ───► Static data only              │
└─────────────────────────────────────────────────────────┘
```

---

## User Journeys

### Journey 1: New Parent (First-Time User)

```
1. Visit site → Landing Page
2. Read feature descriptions
3. Click "Sign in with Google" → Authenticate
4. No children exist → Still on Landing Page
5. Click hamburger menu → "Add Child"
6. Enter baby's name and birthday → Save
7. Automatically redirect to Dashboard
8. See empty milestone/vaccine/log summaries
9. Click "Milestones" → Start tracking milestones
10. Mark first milestone → Dashboard updates in real-time
```

### Journey 2: Daily Care Logging

```
1. Parent wakes up for night feeding (3 AM)
2. Open app → Dashboard (already logged in)
3. Click "Daily Log" quick nav or sidebar
4. Tap 🍼 Feeding button
5. Current time auto-recorded (3:15 AM)
6. Select "Breast Left", enter duration "15 min"
7. Save → Timeline shows new entry
8. Feed baby, return to sleep
9. Morning: Check Dashboard → "Today: 🍼 3 times" updated
```

### Journey 3: Multi-Device Sync

```
1. Mother adds milestone on her phone
   - Dashboard → Milestones → Mark "First Smile" achieved

2. Father checks app on his tablet (same account)
   - Dashboard updates automatically (Firebase real-time sync)
   - Milestone summary shows "12/45 achieved" (was 11/45)

3. Both parents see consistent data across devices
```

### Journey 4: Vaccine Appointment Preparation

```
1. Parent checks Dashboard
2. Vaccine Summary shows "Next: Hepatitis B, Dose 2, at 1 month"
3. Click vaccine card → Vaccine Tracking Page
4. Find Hepatitis B → Click card
5. Read side effects and contraindications
6. Mark Dose 2 as administered with today's date
7. Dashboard updates: "Next: DTaP, Dose 1, at 2 months"
```

---

## Feature Integration Matrix

| Feature              | Dashboard | Milestones | Vaccines | Daily Log | Care Guide | Food Guide |
|----------------------|-----------|------------|----------|-----------|------------|------------|
| **Dashboard**        | -         | Consumes   | Consumes | Consumes  | Links to   | Links to   |
| **Milestones**       | Feeds     | -          | -        | -         | Related    | Related    |
| **Vaccines**         | Feeds     | -          | -        | Indirect  | Related    | -          |
| **Daily Log**        | Feeds     | -          | Indirect | -         | Informs    | Related    |
| **Care Guide**       | -         | Related    | Related  | Informs   | -          | Related    |
| **Food Guide**       | -         | Related    | -        | Related   | Related    | -          |

**Legend:**
- **Feeds:** Provides data to (e.g., Daily Log feeds stats to Dashboard)
- **Consumes:** Receives data from (e.g., Dashboard consumes milestone data)
- **Related:** Thematic connection (e.g., Care Guide relates to Milestones by age)
- **Links to:** Navigation connection only
- **Informs:** Provides context (e.g., Care Guide informs feeding routines in Daily Log)
- **Indirect:** Loose connection (e.g., parents might log reactions after vaccine)

---

## Technical Architecture

### Routing System (Hash-based)

| URL                         | Page                  | Auth Required | Children Required |
|-----------------------------|-----------------------|---------------|-------------------|
| `/#/`                       | Landing / Dashboard   | No            | For Dashboard     |
| `/#/dashboard`              | Dashboard             | No*           | Yes               |
| `/#/milestones`             | Milestones            | No            | No**              |
| `/#/vaccine-tracking`       | Vaccine Tracking      | No            | No**              |
| `/#/daily-log`              | Daily Log             | No            | No**              |
| `/#/care-guide`             | Care Guide            | No            | No                |
| `/#/complementary-food`     | Complementary Food    | No            | No                |

*Works in guest mode, but data only persists locally
**Prompts to add child if none exist

### Data Persistence Modes

| Mode          | Technology       | Sync          | Offline | Multi-Device | Data Limit    |
|---------------|------------------|---------------|---------|--------------|---------------|
| **Guest**     | LocalStorage     | No            | Yes     | No           | ~5MB          |
| **Logged-In** | Firebase RTDB    | Real-time     | Pending | Yes          | Generous      |

### State Management

- **Global:** `AuthContext` (user, familyId, sign-in/out)
- **Local:** React `useState` (UI state, modals)
- **Persistent:** Firebase Realtime Database or LocalStorage
- **Computed:** `useMemo` hooks (summaries, filtered lists)

---

## Future Enhancements

### Planned Features
1. **Growth Charts** - Weight, height, head circumference tracking with percentile curves
2. **Photo Gallery** - Attach photos to milestones and daily logs
3. **Export Reports** - PDF summaries for pediatrician visits
4. **Medication Tracker** - Log medications and dosages
5. **Appointment Calendar** - Schedule and reminders for checkups
6. **Parent Community** - Forums and Q&A
7. **Multilingual** - English, Simplified Chinese support
8. **Dark Mode** - Eye-friendly night mode
9. **Premium Tier** - Unlimited children, advanced analytics

### Integration Opportunities
- **Growth Charts ↔ Dashboard:** Visual trend graphs
- **Photo Gallery ↔ Milestones:** Photo proof of achievements
- **Medication Tracker ↔ Daily Log:** Unified timeline view
- **Appointment Calendar ↔ Vaccines:** Auto-schedule vaccine appointments

---

## Accessibility & Responsiveness

- **Mobile-First:** All features optimized for one-handed operation
- **Touch Targets:** Minimum 44x44px (WCAG 2.1 AAA)
- **Responsive Breakpoints:**
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- **Keyboard Navigation:** All interactive elements keyboard-accessible
- **Screen Reader Support:** Semantic HTML, ARIA labels
- **Color Contrast:** WCAG AA compliant

---

## Analytics & Monitoring

### Firebase Analytics Events

| Event                  | Triggered When                        | Related Pages      |
|------------------------|---------------------------------------|--------------------|
| `page_view`            | Page navigation                       | All                |
| `sign_in`              | Google authentication success         | Landing            |
| `sign_out`             | User signs out                        | All                |
| `child_added`          | New child profile created             | All (via sidebar)  |
| `milestone_achieved`   | Milestone marked as achieved          | Milestones         |
| `vaccine_administered` | Vaccine dose recorded                 | Vaccine Tracking   |
| `daily_log_action`     | Log created/updated/deleted           | Daily Log          |

---

## Summary

LittleSteps provides a cohesive ecosystem of features centered around baby care tracking:

- **Dashboard** serves as the central hub, aggregating data from Milestones, Vaccines, and Daily Log
- **Milestones, Vaccines, Daily Log** are data-generating features that feed the Dashboard
- **Care Guide and Complementary Food** are informational resources that complement tracking features
- **Multi-Child Management** allows families to track multiple children with isolated data
- **Dual-Mode Architecture** enables both guest and authenticated experiences
- **Real-Time Sync** keeps families coordinated across devices when logged in

All features are interconnected through a unified data model and consistent UI patterns, creating a seamless parenting companion experience.
