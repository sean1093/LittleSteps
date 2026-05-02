# 🍼 LittleSteps - Comprehensive Family Care Platform

> A mobile-first Progressive Web App providing comprehensive pregnancy and baby care solutions, including milestone tracking, nursing room maps, and professional parenting guidance for expecting and new parents in Taiwan

<div align="center">

[![Deploy to Firebase Hosting](https://github.com/sean1093/LittleSteps/actions/workflows/firebase-hosting-merge.yml/badge.svg)](https://github.com/sean1093/LittleSteps/actions/workflows/firebase-hosting-merge.yml)

[🌐 Live Demo](https://littlesteps-c6ab6.web.app) | [📝 Report Issues](https://github.com/sean1093/LittleSteps/issues)

**Website**: https://littlesteps-c6ab6.web.app

</div>

---

## 🌟 Overview

LittleSteps is a comprehensive digital family care platform designed to support parents from pregnancy through their baby's early years. Built with modern web technologies, it provides three integrated modules with seamless cross-device synchronization.

## 🎯 Platform Modules

### 🍼 LittleSteps - Baby Tracking & Care
Comprehensive tracking and guidance for babies 0-12+ months:
- **Dashboard** - Visual overview of baby's growth and daily activities
- **Milestone Tracking** - 30+ developmental milestones across physical, motor, cognitive, and feeding categories
- **Vaccine Tracking** - Complete Taiwan vaccination schedule with public and private vaccines
- **Daily Log** - Quick logging for feeding, sleep, and diaper changes
- **Sleep Training & Analysis** - Sleep pattern tracking with visual analytics
- **Growth Charts** - WHO standard growth curves with percentile tracking
- **Complementary Food Guide** - Stage-based weaning guide with 4x3 allergy testing approach
- **Care Guide** - Age-appropriate safety and care instructions
- **Baby Wiki** - Common health issues with causes, solutions, and warning signs
- **Clinic Summary** - One-click generation of medical visit summaries
- **Weekly/Monthly Reports** - Data trends and development insights

### 🗺️ BabyOasis - Nursing Room Locator
Interactive map for finding nursing rooms and baby-friendly facilities:
- **Interactive Map** - Real-time location-based search using Leaflet
- **Facility Information** - Amenities, photos, and ratings
- **Taiwan Coverage** - Comprehensive database of nursing rooms nationwide
- **Cluster View** - Grouped markers for better map navigation

### 🌸 LittleBloom - Pregnancy Companion (Coming Soon)
Dedicated module for expecting mothers:
- **Pregnancy Tracking** - Week-by-week development and information
- **Health & Wellness** - Nutrition, exercise, and self-care guidance
- **Emotional Journal** - Mood and experience tracking
- **Reminders** - Medical appointments and daily tips

## ✨ Key Features

### 🔐 Authentication & Sync
- **Google Sign-In** - Secure authentication via Firebase
- **Multi-Device Sync** - Real-time data synchronization across all devices
- **Dual-Mode Support** - Works offline (guest mode) or with cloud sync (authenticated)
- **Automatic Migration** - LocalStorage data automatically syncs when signing in
- **Privacy-First** - Guest mode keeps all data local, no server communication

### 👶 Multi-Child Profile Management
- **Multiple Profiles** - Track up to 2 babies (free tier)
- **Individual Records** - Separate milestone progress, logs, and data per child
- **Family Sharing** - Share child profiles with family members via unique codes
- **Easy Switching** - Quick toggle between different children's profiles
- **CRUD Operations** - Add, edit, and delete child profiles
- **Cloud Backup** - Automatic Firebase backup when authenticated

### 📊 Advanced Analytics
- **Sleep Analytics** - Daily, weekly patterns with visual charts
- **Growth Tracking** - WHO percentile charts for weight, height, head circumference
- **Development Progress** - Milestone achievement rates and trends
- **Food Tracking** - Allergen introduction and reaction monitoring
- **Clinic Reports** - Comprehensive summaries for pediatrician visits

### 💬 User Feedback System
- **In-App Reporting** - Floating feedback button for logged-in users
- **Issue Tracking** - Title and detailed content submission
- **Firebase Integration** - Direct storage for team review

## 🛠️ Technical Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5.x
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React
- **State Management**: React Hooks + Context API
- **Maps**: Leaflet with React-Leaflet and clustering support

### Backend & Services
- **Authentication**: Firebase Authentication (Google Sign-In)
- **Database**: Firebase Realtime Database (asia-southeast1)
- **Analytics**: Firebase Analytics
- **Storage**: Dual-mode (LocalStorage for guests, Firebase for authenticated users)

### Development
- **TypeScript**: Full type safety with strict mode
- **ESLint**: Code quality enforcement
- **Vitest**: Unit testing framework
- **Vite PWA**: Progressive Web App capabilities
- **GitHub Actions**: Automated CI/CD pipeline

### Deployment
- **Hosting**: Firebase Hosting
- **CI/CD**: GitHub Actions with automated deployment
- **Production**: Auto-deploy on push to master
- **Preview**: Auto-generated preview URLs for pull requests
- **Environment**: Managed via GitHub Secrets

## 🎨 Design System

### Color Palette
- **Primary Pink**: `#F472B6` - Warm, nurturing primary color
- **Secondary Blue**: `#60A5FA` - Calm, trustworthy accent
- **Warm White**: `#FAFAF9` - Soft background color
- **Gradients**: Subtle gradients for visual depth and hierarchy

### Bloom Color Palette (LittleBloom Module)
- **Dusty Rose**: Feminine and soft primary
- **Sage Green**: Calming and natural
- **Mauve**: Gentle and supportive
- **Terracotta**: Warm and earthy
- **Cream**: Soft neutral background

### UI Principles
- **Mobile-First**: Optimized for one-handed operation
- **Touch-Friendly**: 80x80px minimum touch targets
- **3-Second Rule**: Critical actions complete within 3 seconds
- **Visual Hierarchy**: Size, color, and contrast for information priority
- **Reduced Cognitive Load**: Icons over text, immediate visual feedback
- **Soft Aesthetics**: Rounded corners (`rounded-2xl`), soft shadows, warm tones

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

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Deployment to Firebase Hosting

The project uses automated deployment via GitHub Actions:

**Automatic Deployment**:
- Push to `master` branch → Automatically deploys to production
- Create Pull Request → Automatically generates preview URL

**Manual Deployment** (optional):
```bash
# Install Firebase CLI
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
│   ├── CLAUDE.md            # Project overview and guidelines
│   └── skills/              # Development patterns and conventions
├── src/
│   ├── babyoasis/           # Nursing room map module
│   │   ├── pages/           # BabyOasis pages
│   │   └── data/            # Nursing room data
│   ├── littlebloom/         # Pregnancy tracking module (WIP)
│   │   └── pages/           # LittleBloom pages
│   ├── littlesteps/         # Baby tracking module
│   │   ├── pages/           # Feature pages
│   │   ├── components/      # Feature-specific components
│   │   │   ├── milestone/   # Milestone tracking components
│   │   │   ├── vaccine/     # Vaccine tracking components
│   │   │   ├── sleep/       # Sleep analysis components
│   │   │   ├── growth/      # Growth chart components
│   │   │   ├── dailylog/    # Daily logging components
│   │   │   ├── food/        # Food tracking components
│   │   │   ├── dashboard/   # Dashboard components
│   │   │   ├── wiki/        # Baby wiki components
│   │   │   ├── report/      # Report components
│   │   │   └── shared/      # Shared utility components
│   │   ├── hooks/           # Feature-specific hooks
│   │   └── data/            # Static data (milestones, vaccines, etc.)
│   ├── common/              # Shared resources
│   │   ├── components/      # Reusable components
│   │   ├── hooks/           # Common hooks
│   │   └── pages/           # Landing and auth pages
│   ├── contexts/            # React contexts
│   ├── lib/                 # Third-party configurations
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Application entry
│   └── index.css            # Global styles
├── public/                  # Static assets
├── .github/workflows/       # CI/CD configuration
├── firebase.json            # Firebase Hosting config
└── vite.config.ts           # Vite configuration
```

## 🔗 URL Routing

The application uses hash-based routing for shareable URLs:

### Main Routes
- **Home**: `/#/` - Main landing page with module selection

### LittleSteps Routes
- **LittleSteps Home**: `/#/littlesteps` - Baby tracking landing
- **Dashboard**: `/#/littlesteps/dashboard` - Growth overview
- **Milestones**: `/#/littlesteps/milestones` - Milestone tracking
- **Vaccines**: `/#/littlesteps/vaccine-tracking` - Vaccine schedule
- **Daily Log**: `/#/littlesteps/daily-log` - Quick daily logging
- **Sleep Training**: `/#/littlesteps/sleep-training` - Sleep timer tools
- **Sleep Analysis**: `/#/littlesteps/sleep-analysis` - Sleep pattern analytics
- **Growth Charts**: `/#/littlesteps/growth-charts` - WHO growth curves
- **Care Guide**: `/#/littlesteps/care-guide` - Age-based care instructions
- **Food Guide**: `/#/littlesteps/complementary-food` - Weaning guide
- **Baby Wiki**: `/#/littlesteps/baby-wiki` - Common health issues
- **Clinic Summary**: `/#/littlesteps/clinic-summary` - Medical visit summaries
- **Reports**: `/#/littlesteps/report` - Weekly/monthly insights

### Other Modules
- **BabyOasis**: `/#/babyoasis` - Nursing room map
- **LittleBloom**: `/#/littlebloom` - Pregnancy module (WIP)

## 💾 Data Architecture

LittleSteps uses a **dual-mode architecture** for maximum flexibility:

### Guest Mode (Not Logged In)
- Data stored in browser's LocalStorage
- Works completely offline
- No account required
- Data stays on device only
- Perfect for privacy-conscious users

### Authenticated Mode (Logged In)
- Data stored in Firebase Realtime Database
- Automatic multi-device synchronization
- Real-time updates across devices
- Secure cloud backup
- Family sharing capabilities
- LocalStorage data automatically migrates on first sign-in

### Firebase Database Structure
```
{
  "users": {
    "$userId": {
      "email": "user@example.com",
      "displayName": "User Name",
      "childrenIds": { "$childId": true },
      "currentChildId": "$childId",
      "families": { "$familyId": { "role": "admin" } }
    }
  },
  "children": {
    "$childId": {
      "name": "Baby Name",
      "birthday": "2024-01-01",
      "gender": "male",
      "uuid": "unique-share-code",
      "milestoneProgress": {},
      "vaccineProgress": {},
      "growthRecords": [],
      "foodTrials": []
    }
  },
  "dailyLogs": {
    "$childId": {
      "$logId": {
        "type": "feeding|sleep|diaper",
        "timestamp": "2024-01-01T10:00:00Z",
        "details": {}
      }
    }
  },
  "feedbacks": {
    "$feedbackId": {
      "title": "Feedback title",
      "content": "Feedback content",
      "userId": "$userId",
      "timestamp": "2024-01-01T10:00:00Z"
    }
  }
}
```

**Privacy & Security**:
- Guest mode: No data sent to servers
- Authenticated mode: Data encrypted and secured by Firebase
- Security rules enforce user-only access
- Optional family sharing via unique codes

## 🌐 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Safari 14+
- ✅ Firefox 88+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📖 Feature Documentation

### Milestone Categories
- **Physical Development** 🏃: Rolling, sitting, crawling, standing, walking
- **Motor Skills** ✋: Grasping, transferring, fine motor control
- **Cognitive** 🧠: Recognition, problem-solving, communication
- **Feeding** 🍼: Sucking, solid foods, self-feeding

### Vaccine Information
Based on Taiwan's Ministry of Health and Welfare vaccination schedule:
- **Public Funded** (公費): Free government-provided vaccines
- **Self-Paid** (自費): Optional private vaccines
- **Detailed Information**: Side effects, contraindications, emergency guidelines
- **Scheduling**: Age-based organization with dose tracking

### Complementary Food Stages
- **Stage 1** (4-6 months): Purées, single ingredients
- **Stage 2** (6-9 months): Mashed textures, combinations
- **Stage 3** (9-12 months): Chopped foods, finger foods
- **4x3 Method**: Modern allergen introduction approach

### Growth Chart Standards
- **WHO Standards**: International growth reference
- **Metrics**: Weight, height, head circumference
- **Percentiles**: P3, P15, P50, P85, P97 curves
- **Gender-Specific**: Separate curves for boys and girls

## 🧪 Testing

The project includes testing infrastructure:

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

**Testing Stack**:
- **Framework**: Vitest
- **DOM Testing**: @testing-library/react
- **User Events**: @testing-library/user-event
- **Assertions**: @testing-library/jest-dom

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Follow the coding guidelines in `.claude/skills/`
4. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

### Commit Convention
Follow conventional commits format:
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `style:` - Styling changes
- `docs:` - Documentation updates
- `test:` - Test changes
- `chore:` - Build/config changes

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Medical Information**: Taiwan Ministry of Health and Welfare guidelines
- **Growth Standards**: WHO Child Growth Standards
- **Nursing Room Data**: Taiwan government open data
- **Design**: Inspired by modern parenting apps with Taiwanese localization
- **Built with**: React, TypeScript, Firebase, Tailwind CSS

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ LittleSteps core features
- ✅ BabyOasis nursing room map
- ✅ Multi-device sync
- ✅ Feedback system

### Phase 2 (In Progress)
- 🚧 LittleBloom pregnancy tracking
- 🚧 Premium tier features
- 🚧 Enhanced analytics

### Phase 3 (Planned)
- 📋 Photo gallery for milestones
- 📋 Parent community features
- 📋 Multilingual support (English, Simplified Chinese)
- 📋 Dark mode
- 📋 Advanced PWA features

---

<div align="center">

Made with ❤️ for families in Taiwan

🤖 Built with [Claude Code](https://claude.com/claude-code)

</div>
