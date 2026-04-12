# LittleSteps - AI Assistant Guide

## Project Overview

**LittleSteps** is a baby milestone tracking web application designed for new parents in Taiwan. It helps parents track their baby's growth milestones, vaccine schedules, daily care logs, and provides comprehensive parenting guidance.

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Backend**: Firebase (Realtime Database, Authentication, Analytics, Hosting)
- **State Management**: React Hooks + Context API
- **Icon Library**: Lucide React

### Key Features

1. **Milestone Tracking** - Record baby's developmental milestones (0-12+ months)
2. **Vaccine Tracking** - Manage vaccination schedules (public & private vaccines)
3. **Daily Care Logs** - Quick logging for feeding, sleep, and diaper changes
4. **Care Guidelines** - Age-appropriate care tips and safety information
5. **Complementary Food Guide** - Comprehensive weaning food introduction guide
6. **Dashboard** - Visual summary of baby's growth progress
7. **Multi-Baby Support** - Track up to 2 babies (free tier)
8. **Dual-Mode** - Works offline (LocalStorage) or with cloud sync (Firebase)

### Project Structure

```
LittleSteps/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page-level components (routing)
│   ├── hooks/          # Custom React hooks
│   ├── contexts/       # React context providers
│   ├── utils/          # Utility functions
│   ├── lib/            # Third-party configs (Firebase)
│   ├── data/           # Static data (milestones, vaccines)
│   └── types/          # TypeScript type definitions
├── public/             # Static assets
├── .claude/            # AI assistant configuration
│   ├── CLAUDE.md       # This file
│   └── skills/         # Development guidelines
└── firebase.json       # Firebase hosting config
```

---

## Development Guidelines

This project follows specific patterns and conventions documented in the **skills** directory. When working on this codebase, you should:

### 1. Read Relevant Skills First

Before making changes, consult the appropriate skill documents:

- **UX Design** - UI/UX patterns, animations, component design
- **Styling** - Tailwind usage, colors, spacing, typography
- **Components** - Component structure, props patterns, organization
- **Firebase** - Database structure, authentication, dual-mode architecture
- **TypeScript** - Type safety, interfaces, null handling

### 2. Skill Usage Patterns

#### When Adding New Features

```bash
# 1. Read relevant skills
claude: Read skills/component-patterns.md
claude: Read skills/firebase-integration.md

# 2. Plan implementation following patterns
# 3. Write code adhering to guidelines
# 4. Test both LocalStorage and Firebase modes
```

#### When Styling Components

```bash
claude: Read skills/ux-design.md
claude: Read skills/styling-guide.md
# Follow color palette, spacing system, and animation patterns
```

#### When Working with Data

```bash
claude: Read skills/firebase-integration.md
# Understand dual-mode architecture, hooks, and data flow
```

---

## Available Skills

### [ux-design.md](skills/ux-design.md)
**Purpose:** UX/UI design principles and patterns

**Topics:**
- Design philosophy (3-second rule, one-handed operation)
- Animation patterns (Framer Motion usage)
- Component design (cards, buttons, icons, progress bars)
- Layout & spacing guidelines
- Responsive design principles
- Accessibility standards

**When to use:**
- Designing new components
- Adding animations
- Creating layouts
- Ensuring consistent user experience

---

### [styling-guide.md](skills/styling-guide.md)
**Purpose:** Styling conventions and Tailwind usage

**Topics:**
- Color palette (primary, secondary, warm colors)
- Gradients (backgrounds, buttons, text)
- Shadows (soft, soft-lg)
- Border radius (rounded-2xl standard)
- Spacing system (padding, margins, gaps)
- Typography (font sizes, weights, responsive)
- Transitions and animations

**When to use:**
- Applying styles to components
- Choosing colors
- Setting up spacing
- Creating gradients
- Working with shadows

---

### [component-patterns.md](skills/component-patterns.md)
**Purpose:** React component structure and patterns

**Topics:**
- File organization
- Component structure template
- Props patterns
- State management (local, context, persistent)
- Event handlers
- Conditional rendering
- Custom hooks
- Form patterns
- List rendering
- Performance optimization

**When to use:**
- Creating new components
- Refactoring components
- Implementing forms
- Managing state
- Writing custom hooks

---

### [firebase-integration.md](skills/firebase-integration.md)
**Purpose:** Firebase integration and dual-mode architecture

**Topics:**
- Database structure (Realtime Database)
- Authentication (Google Sign-In)
- Dual-mode pattern (Firebase + LocalStorage)
- Firebase hooks (useFirebaseFamily, useFirebaseChildren, useDailyLogs)
- Data migration
- Error handling
- Security rules
- Analytics

**When to use:**
- Working with authentication
- Reading/writing data
- Implementing new data features
- Handling user data
- Testing cross-device sync

---

### [typescript-conventions.md](skills/typescript-conventions.md)
**Purpose:** TypeScript best practices and patterns

**Topics:**
- Type definitions (interfaces, types, generics)
- Null safety (optional chaining, nullish coalescing)
- Function types (event handlers, async)
- Component props types
- Generic hooks
- Type guards
- Utility types (Partial, Omit, Pick)
- Error handling types

**When to use:**
- Defining new types
- Fixing TypeScript errors
- Creating interfaces
- Handling nullable values
- Writing type-safe code

---

## Workflow Examples

### Example 1: Adding a New Feature (Quick Daily Log Page)

1. **Read skills:**
   ```bash
   Read skills/component-patterns.md     # Component structure
   Read skills/firebase-integration.md   # Data handling
   Read skills/ux-design.md              # UX patterns
   ```

2. **Plan implementation:**
   - Create types in `src/types/index.ts`
   - Create hook `src/hooks/useDailyLogs.ts` (follow Firebase dual-mode pattern)
   - Create page `src/pages/DailyLogPage.tsx` (follow component template)
   - Create components (QuickLogButtons, LogTimeline)
   - Add route in `src/App.tsx`

3. **Follow guidelines:**
   - Use 80x80px buttons (ux-design: single-hand operation)
   - Use `rounded-2xl`, `shadow-soft` (styling-guide)
   - Implement dual-mode data (firebase-integration)
   - Add TypeScript interfaces (typescript-conventions)

4. **Test both modes:**
   - Test guest mode (LocalStorage)
   - Test authenticated mode (Firebase)
   - Test cross-device sync

---

### Example 2: Styling a New Component

1. **Read skills:**
   ```bash
   Read skills/styling-guide.md
   Read skills/ux-design.md
   ```

2. **Apply patterns:**
   ```tsx
   // Follow color palette
   className="bg-white rounded-2xl p-6 shadow-soft"

   // Use gradient for primary button
   className="bg-gradient-to-r from-primary to-secondary"

   // Add animation
   whileHover={{ scale: 1.05, y: -2 }}
   whileTap={{ scale: 0.98 }}
   ```

---

### Example 3: Fixing TypeScript Errors

1. **Read skill:**
   ```bash
   Read skills/typescript-conventions.md
   ```

2. **Common fixes:**
   ```typescript
   // TS2322: Type not assignable
   // Before: const name: string = currentChild?.name;
   // After:
   const name: string = currentChild?.name || '';

   // TS6133: Unused variable
   // Remove or use the variable

   // TS2339: Property does not exist
   // Define proper interface for the object
   ```

---

## Best Practices Summary

### Always:
- ✅ Read relevant skills before coding
- ✅ Follow existing patterns and conventions
- ✅ Use TypeScript strictly (no `any` except error handling)
- ✅ Test both Firebase and LocalStorage modes
- ✅ Add animations to interactive elements
- ✅ Use centralized types from `src/types/index.ts`
- ✅ Handle null/undefined explicitly
- ✅ Run `npm run build` before committing

### Never:
- ❌ Hardcode colors or spacing (use Tailwind)
- ❌ Skip animations on interactive elements
- ❌ Forget to handle loading/error states
- ❌ Commit `.env` or sensitive data
- ❌ Ignore TypeScript errors
- ❌ Mix different border radius sizes
- ❌ Use Tailwind default shadows (use `shadow-soft`)

---

## Post-Implementation Workflow

**CRITICAL: After completing any code changes, you MUST follow this workflow:**

### 1. Test Your Changes

**Manual Testing:**
```bash
# Start dev server and manually test
npm run dev

# Test both modes:
# - Guest mode (without login)
# - Authenticated mode (with Google login)

# Test all affected features:
# - Click through all UI elements
# - Test edge cases (empty states, errors, loading)
# - Test on different screen sizes (mobile, tablet, desktop)
```

**Automated Testing (if applicable):**
```bash
# Run existing tests
npm run test

# Run Playwright E2E tests (if available)
npx playwright test

# Check for TypeScript errors
npm run build
```

### 2. Organize Commits

**Guidelines:**
- **One commit per logical change** - Don't mix unrelated changes
- **Descriptive commit messages** - Follow conventional commits format
- **Commit types:**
  - `feat:` - New feature
  - `fix:` - Bug fix
  - `refactor:` - Code refactoring
  - `style:` - Styling changes
  - `docs:` - Documentation
  - `test:` - Test changes
  - `chore:` - Build/config changes

**Example workflow:**
```bash
# Check status
git status

# Stage files by logical groups
git add src/utils/newFeature.ts src/components/NewComponent.tsx
git commit -m "feat: add new feature with component and utils

Detailed description of what was added and why.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"

# Stage bug fix separately
git add src/hooks/useBuggyHook.ts
git commit -m "fix: resolve issue with buggy hook

Description of the bug and how it was fixed.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

### 3. Push to Remote

**Always push after committing:**
```bash
git push origin master
```

**IMPORTANT:** Do NOT skip this step. Every commit should be pushed to ensure:
- Code is backed up
- Team members have access to latest changes
- CI/CD pipeline can run
- GitHub Actions can deploy

### 4. Complete Workflow Example

```bash
# 1. Test changes
npm run dev
# (manually test all affected features)

# 2. Build to check for errors
npm run build

# 3. Check git status
git status

# 4. Stage and commit by logical groups
git add src/pages/NewPage.tsx src/components/NewComponent.tsx
git commit -m "feat: add new page with component

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"

# 5. Push to remote
git push origin master
```

### 5. Automated Testing with Playwright (Future)

**When Playwright tests are available:**
```bash
# Run all E2E tests
npx playwright test

# Run specific test file
npx playwright test tests/sleep-analysis.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug
```

**Note:** Playwright tests are not yet implemented. When adding new features, consider writing E2E tests for critical user flows.

---

## Environment Setup

### Required Environment Variables (.env)

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_FIREBASE_DATABASE_URL=https://your-project-asia-southeast1.firebasedatabase.app
```

### Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## Deployment

### Firebase Hosting

The project is automatically deployed via GitHub Actions when pushing to `master` branch.

**Manual deployment:**
```bash
npm run build
firebase deploy --only hosting
```

**GitHub Secrets Required:**
- All `VITE_FIREBASE_*` environment variables

---

## Target Audience

- New parents in Taiwan
- Primary language: Traditional Chinese (繁體中文)
- Device: Primarily mobile (responsive design)
- Age group: Parents of babies 0-12+ months

---

## Design Principles

1. **3-Second Rule** - Critical actions must complete in 3 seconds
2. **Single-Hand Operation** - Large touch targets (80x80px minimum)
3. **Visual Hierarchy** - Important info first, using size/color/contrast
4. **Reduced Cognitive Load** - Icons over text, visual feedback
5. **Warm & Friendly** - Pink/blue gradients, soft shadows, warm tones

---

## Future Enhancements

- Premium tier (unlimited babies, advanced analytics)
- Growth charts (weight, height tracking)
- Photo gallery for milestones
- Parent community features
- Multilingual support (English, Simplified Chinese)
- Dark mode
- PWA (offline support, install to home screen)

---

## Support

For questions or issues:
- GitHub Issues: https://github.com/sean1093/LittleSteps/issues
- Documentation: See skills/ directory
- Firebase Console: Check deployment logs
