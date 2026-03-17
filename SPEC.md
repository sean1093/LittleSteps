# SPEC: LittleSteps - Baby Milestone Tracker for New Parents

## 1. Project Overview

* **Goal**: Build a mobile-first static web app to help new parents easily track their baby's developmental milestones at each stage.
* **Core Values**: Warm, bright, professional, stress-free.
* **Design Principles**:
    * **Visual Style**: Warm color palette, pastel colors, rounded corners (rounded-2xl), and soft shadows.
    * **Interaction Logic**: Optimized for one-handed operation, navigation at the bottom, swipeable content areas.

## 2. Tech Stack

* **Framework**: React 18 + TypeScript (built with Vite)
* **Styling**: Tailwind CSS (custom theme for warm aesthetics)
* **Icons**: Lucide React (clean lines, modern feel)
* **State Management**: React Hooks (useState, useEffect) + LocalStorage (for tracking progress)
* **Deployment**: GitHub Pages (with GitHub Actions for automated deployment)
* **PWA**: vite-plugin-pwa (supports "Add to Home Screen" functionality)

## 3. Functional Requirements

### A. Dual-Axis Navigation System

1. **Horizontal Month Picker (Top Timeline)**:
   * Display month ranges: 0-2m, 3-4m, 5-6m, 7-9m, 10-12m, 1y+
   * Smooth transition when clicking to switch displayed milestone data

2. **Category Filter**:
   * Provide category tags: Physical Development, Fine Motor Skills, Cognitive & Language, Feeding & Nutrition

### B. Milestone Management

1. **Card-Based List**:
   * Display milestone title and brief description
   * Clicking a card opens a Modal/Expand view with detailed information and practice tips

2. **Progress Saving**:
   * User's completion status must be permanently saved in browser LocalStorage

### C. Sharing & Interaction

1. **Milestone Sharing**:
   * Use Web Share API to share milestone title + website link
   * Default share text example: "My baby achieved the [Rolling Over] milestone! Recommended parenting tool for new parents: [URL]"

### D. PWA Support

1. **Manifest Configuration**: Set proper App Icon and theme color to ensure installable experience on iOS/Android

## 4. Data Schema Definition

Data should be stored in `src/data/milestones.ts`:

```ts
export interface Milestone {
  id: string;
  monthRange: "0-2" | "3-4" | "5-6" | "7-9" | "10-12" | "12+";
  category: "physical" | "motor" | "cognitive" | "feeding";
  title: string;
  summary: string;
  details: string;
  tips: string[]; // Practice tips for parents
}
```

## 5. UI Specification Details

**Color Scheme:**

- Background: #FAFAF9 (warm white)
- Primary: #F472B6 (pink) or #60A5FA (sky blue)
- Card: #FFFFFF (pure white with subtle shadow)

**Component Spacing:** Use Tailwind's p-4 to p-6 consistently to avoid clutter.

**Typography:** Prioritize system fonts for readability on mobile devices.

## 6. Implementation Roadmap

- **Phase 1**: Initialize Vite + Tailwind and configure PWA environment
- **Phase 2**: Implement static data layer (fill with developmental milestone content)
- **Phase 3**: Develop main page UI (timeline and card list)
- **Phase 4**: Add LocalStorage logic and Web Share functionality
- **Phase 5**: Configure GitHub Actions and deploy

## 7. Optional Enhancements

* **Animations & Micro-interactions**:
  - Use `framer-motion` for card enter/exit animations
  - Apply Layout Animation when filtering lists for smooth visuals

* **SEO Optimization**:
  - Ensure complete Open Graph (OG) tags for proper preview when sharing on LINE/FB with warm color scheme

* **Empty State Design**:
  - Display a warm illustration to guide parents to start tracking if no items are checked for a given month range
