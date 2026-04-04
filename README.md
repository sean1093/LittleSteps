# 🍼 LittleSteps - Comprehensive Baby Care Companion

> A mobile-first Progressive Web App providing professional parenting guidance, milestone tracking, vaccine schedules, and complementary food guides for new parents

<div align="center">

[![Deploy to Firebase Hosting](https://github.com/sean1093/LittleSteps/actions/workflows/firebase-hosting-merge.yml/badge.svg)](https://github.com/sean1093/LittleSteps/actions/workflows/firebase-hosting-merge.yml)

[🌐 Live Demo](https://littlesteps-c6ab6.web.app) | [📝 Report Issues](https://github.com/sean1093/LittleSteps/issues)

**Website**: https://littlesteps-c6ab6.web.app

</div>

---

## 🌟 Overview

LittleSteps is a comprehensive digital parenting companion designed to support new parents through the first year of their baby's life. Built with modern web technologies, it provides a seamless experience across all devices while maintaining professional medical accuracy.

## ✨ Core Features

### 🏠 Landing Page
- **Welcoming Introduction** - Warm, supportive messaging for new parents
- **Feature Highlights** - Visual overview of all available tools
- **Google Sign-In** - Prominent login button for cloud sync
- **Modern Design** - Gradient backgrounds, smooth animations, and intuitive navigation

### 🔐 Authentication & Sync
- **Google Sign-In** - Secure authentication via Firebase
- **Multi-Device Sync** - Access your data across all devices in real-time
- **Dual-Mode Support** - Works offline (guest mode) or with cloud sync (logged in)
- **Automatic Migration** - LocalStorage data automatically syncs when you sign in

### 📊 Dashboard
- **Growth Overview** - Visual summary of baby's development progress
- **Milestone Summary** - Achievement rate with recent milestones
- **Vaccine Summary** - Vaccination progress and next dose due
- **Daily Log Summary** - Today's feeding, sleep, and diaper statistics (coming soon)
- **Quick Navigation** - Fast access to all features from one place

### 👶 Multi-Child Profile Management
- **Multiple Profiles** - Track up to 2 babies (free tier)
- **Individual Records** - Each child has their own milestone progress and data
- **Easy Switching** - Quick toggle between different children's profiles
- **CRUD Operations** - Add, edit, and delete child profiles with ease
- **Cloud Backup** - All data automatically backed up to Firebase when logged in

### 📊 Milestone Tracking
- **Comprehensive Database** - 30+ developmental milestones from 0-12 months
- **Four Categories** - Physical, Motor, Cognitive, and Feeding development
- **Month-by-Month** - Organized by age range (0-2, 3-4, 5-6, 7-9, 10-12, 12+ months)
- **Progress Recording** - Track achievement status and dates for each milestone
- **Detailed Information** - Full descriptions, tips, and guidance for each milestone

### 🛡️ Care Guide
- **General Safety** - 6 essential safety guidelines for all ages
- **Monthly Care** - Detailed care instructions for each month (0-12 months)
- **Category Filtering** - Filter by physiological, feeding, or safety concerns
- **Visual Hierarchy** - Easy-to-scan format with icons and color coding

### 💉 Vaccine Tracking
- **Complete Schedule** - 30+ vaccines from birth to 6 years
- **Public & Private** - Clear distinction between funded and self-paid vaccines
- **Month Grouping** - Vaccines organized by age in months
- **Dual Filters** - Filter by funding type and age
- **Side Effects Guide** - Comprehensive information on potential reactions
- **Emergency Guidelines** - Clear instructions for concerning symptoms
- **Contraindications** - Important safety information and precautions

### 🥄 Complementary Food Guide
- **Three-Stage System** - Level 1-3 progression (4-12 months)
- **Food Progression** - Texture and frequency guidelines by age
- **4x3 Allergy Testing** - Modern approach to introducing allergens
- **Monthly Menus** - Sample food suggestions for each month
- **Finger Food Guide** - BLW (Baby-Led Weaning) guidelines
- **Safety Warnings** - Critical information about forbidden foods (honey, choking hazards)
- **Multiple Views** - Overview, stages, menu, and safety tabs

## 🛠️ Technical Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5.x
- **Styling**: Tailwind CSS with custom theme
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks + Context API

### Backend & Services
- **Authentication**: Firebase Authentication (Google Sign-In)
- **Database**: Firebase Realtime Database (asia-southeast1)
- **Analytics**: Firebase Analytics
- **Storage**: Dual-mode (LocalStorage for guests, Firebase for authenticated users)

### Development
- **TypeScript**: Full type safety with strict mode
- **ESLint**: Code quality enforcement
- **Vite PWA**: Progressive Web App capabilities
- **GitHub Actions**: Automated deployment

### Deployment
- **Hosting**: Firebase Hosting
- **CI/CD**: GitHub Actions with automated deployment
- **Production**: Auto-deploy on push to master
- **Preview**: Auto-generated preview URLs for pull requests
- **Environment Variables**: Managed via GitHub Secrets

## 🎨 Design System

### Color Palette
- **Primary Pink**: `#F472B6` - Warm, nurturing primary color
- **Secondary Blue**: `#60A5FA` - Calm, trustworthy accent
- **Warm White**: `#FAFAF9` - Soft background color
- **Gradients**: Subtle gradients for visual depth

### UI Principles
- **Mobile-First**: Optimized for one-handed operation
- **Rounded Corners**: Extensive use of `rounded-2xl` for softness
- **Soft Shadows**: Gentle shadows for subtle depth
- **Touch-Friendly**: All interactive elements sized for easy tapping
- **Responsive**: Seamless experience across all screen sizes

## 📱 Progressive Web App

### PWA Features
- ✅ Installable on home screen
- ✅ Offline functionality with service worker
- ✅ Native app-like experience
- ✅ Automatic updates
- ✅ Optimized caching strategy

### Installation Instructions

**iOS (Safari)**:
1. Open the website in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Confirm the installation

**Android (Chrome)**:
1. Open the website in Chrome
2. Tap the menu (three dots)
3. Select "Install app" or "Add to Home Screen"
4. Confirm the installation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/sean1093/LittleSteps.git

# Navigate to project directory
cd LittleSteps

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root with your Firebase configuration:

```bash
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_FIREBASE_DATABASE_URL=https://your-project-asia-southeast1.firebasedatabase.app
```

**Note**: Never commit `.env` to version control. See `.env.example` for template.

### Development

```bash
# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Deployment to Firebase Hosting

The project is configured for automatic deployment to Firebase Hosting via GitHub Actions:

**Automatic Deployment**:
- Push to `master` branch → Automatically deploys to production
- Create Pull Request → Automatically generates preview URL

**Manual Deployment** (optional):
```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

**Production URLs**:
- Primary: https://littlesteps-c6ab6.web.app
- Alternative: https://littlesteps-c6ab6.firebaseapp.com

## 📂 Project Structure

```
LittleSteps/
├── .claude/                  # AI assistant configuration
│   ├── CLAUDE.md                   # Project overview and skill usage guide
│   └── skills/                     # Development guidelines and patterns
│       ├── component-patterns.md   # React component structure
│       ├── firebase-integration.md # Firebase & dual-mode patterns
│       ├── styling-guide.md        # Tailwind & design system
│       ├── typescript-conventions.md # TypeScript best practices
│       └── ux-design.md            # UI/UX patterns & animations
├── src/
│   ├── components/           # React components
│   │   ├── AddChildModal.tsx       # Child profile modal
│   │   ├── CategoryFilter.tsx      # Milestone category filter
│   │   ├── DailyLogSummaryCard.tsx # Daily log summary card
│   │   ├── DashboardCard.tsx       # Reusable dashboard card
│   │   ├── MilestoneCard.tsx       # Milestone card component
│   │   ├── MilestoneModal.tsx      # Milestone detail modal
│   │   ├── MilestoneSummaryCard.tsx # Milestone summary card
│   │   ├── MonthPicker.tsx         # Month range selector
│   │   ├── Sidebar.tsx             # Navigation sidebar
│   │   └── VaccineSummaryCard.tsx  # Vaccine summary card
│   ├── contexts/             # React contexts
│   │   └── AuthContext.tsx         # Authentication context
│   ├── data/                 # Application data
│   │   ├── careGuides.ts           # Care guide data
│   │   ├── complementaryFood.ts    # Food guide data
│   │   ├── milestones.ts           # Milestone data
│   │   └── vaccines.ts             # Vaccine schedule data
│   ├── hooks/                # Custom React hooks
│   │   ├── useChildSummary.ts      # Dashboard statistics hook
│   │   ├── useDailyLogs.ts         # Daily logs management hook
│   │   ├── useFirebaseChildren.ts  # Firebase children CRUD hook
│   │   ├── useFirebaseFamily.ts    # Firebase family management hook
│   │   └── useLocalStorage.ts      # LocalStorage hook
│   ├── lib/                  # Third-party configurations
│   │   └── firebase.ts             # Firebase initialization & config
│   ├── pages/                # Page components
│   │   ├── CareGuidePage.tsx       # Care guide page
│   │   ├── ComplementaryFoodPage.tsx # Food guide page
│   │   ├── DashboardPage.tsx       # Dashboard page
│   │   ├── LandingPage.tsx         # Home/landing page
│   │   ├── MilestonesPage.tsx      # Milestone tracking page
│   │   └── VaccineTrackingPage.tsx # Vaccine schedule page
│   ├── types/                # TypeScript definitions
│   │   └── index.ts                # Type definitions
│   ├── utils/                # Utility functions
│   │   ├── logHelpers.ts           # Daily log utility functions
│   │   ├── migration.ts            # LocalStorage to Firebase migration
│   │   ├── share.ts                # Web Share API utils
│   │   └── summaryCalculator.ts    # Statistics calculation utils
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Application entry
│   └── index.css             # Global styles
├── public/                   # Static assets
│   └── manifest.webmanifest  # PWA manifest
├── .github/workflows/        # CI/CD configuration
│   ├── firebase-hosting-merge.yml        # Production deployment
│   └── firebase-hosting-pull-request.yml # PR preview deployment
├── .env.example              # Environment variables template
├── firebase.json             # Firebase Hosting config
├── .firebaserc               # Firebase project config
└── vite.config.ts            # Vite configuration
```

## 🔗 URL Routing

The application uses hash-based routing for shareable URLs:

- **Home**: `/#/` (Landing Page for guests, Dashboard for logged-in users)
- **Dashboard**: `/#/dashboard` (Growth overview)
- **Milestones**: `/#/milestones` (Milestone tracking)
- **Care Guide**: `/#/care-guide` (Care guidelines)
- **Vaccines**: `/#/vaccine-tracking` (Vaccine schedule)
- **Food Guide**: `/#/complementary-food` (Complementary food guide)
- **Daily Log**: `/#/daily-log` (Coming soon)

## 💾 Data Persistence

LittleSteps uses a **dual-mode architecture** for maximum flexibility:

### Guest Mode (Not Logged In)
- Data stored locally in browser's LocalStorage
- Works completely offline
- No account required
- Data stays on your device only

### Authenticated Mode (Logged In)
- Data stored in Firebase Realtime Database
- Automatic multi-device synchronization
- Real-time updates across devices
- Secure cloud backup
- LocalStorage data automatically migrates on first sign-in

**Privacy**:
- Guest mode: No data sent to servers
- Logged-in mode: Data encrypted and secured by Firebase
- You control your data - sign out anytime to return to guest mode

## 🌐 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Safari 14+
- ✅ Firefox 88+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📖 Documentation

### Milestone Categories
- **Physical Development** (🏃): Rolling, sitting, crawling, standing, walking
- **Motor Skills** (✋): Grasping, transferring, fine motor control
- **Cognitive** (🧠): Recognition, problem-solving, communication
- **Feeding** (🍼): Sucking, solid foods, self-feeding

### Vaccine Information
Based on Taiwan's Ministry of Health and Welfare vaccination schedule:
- Public funded vaccines (公費)
- Private self-paid vaccines (自費)
- Detailed side effect information
- Emergency response guidelines

### Care Guide Categories
- **Physiological**: Physical development and health
- **Feeding**: Nutrition and feeding schedules
- **Safety**: Important safety precautions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Medical information based on Taiwan's Ministry of Health and Welfare guidelines
- Designed with input from pediatric professionals
- Built with love for new parents everywhere

---

<div align="center">

Made with ❤️ for new parents

🤖 Generated with [Claude Code](https://claude.com/claude-code)

</div>
