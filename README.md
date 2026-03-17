# 🍼 LittleSteps - Baby Milestone Tracker

> A mobile-first Progressive Web App to help new parents track their baby's developmental milestones

<div align="center">

[![Deploy to GitHub Pages](https://github.com/sean1093/LittleSteps/actions/workflows/deploy.yml/badge.svg)](https://github.com/sean1093/LittleSteps/actions/workflows/deploy.yml)

[Live Demo](https://sean1093.github.io/LittleSteps/) | [Report Issues](https://github.com/sean1093/LittleSteps/issues)

**Website URL**: https://sean1093.github.io/LittleSteps/

</div>

## ✨ Features

- 📱 **Mobile-First Design** - Optimized for one-handed thumb operation
- 🎨 **Warm & Friendly UI** - Pastel color scheme with rounded corners
- ⏱️ **Dual-Axis Navigation** - Month range timeline + category filters
- ✅ **Progress Tracking** - Persistent milestone completion state via LocalStorage
- 🔗 **One-Tap Sharing** - Web Share API integration for sharing achievements
- 💫 **Smooth Animations** - Powered by Framer Motion
- 📲 **PWA Support** - Installable on home screen, works offline
- 🚀 **Zero Backend** - Pure static frontend, lightning fast

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **PWA**: vite-plugin-pwa
- **Deployment**: GitHub Pages + GitHub Actions

## 📦 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📂 Project Structure

```
LittleSteps/
├── src/
│   ├── components/        # React components
│   │   ├── MonthPicker.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── MilestoneCard.tsx
│   │   └── MilestoneModal.tsx
│   ├── data/             # Milestone data
│   │   └── milestones.ts
│   ├── hooks/            # Custom React hooks
│   │   └── useLocalStorage.ts
│   ├── types/            # TypeScript definitions
│   │   └── index.ts
│   ├── utils/            # Utility functions
│   │   └── share.ts
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # App entry point
│   └── index.css         # Global styles
├── public/               # Static assets
└── index.html            # HTML template
```

## 🎯 Milestone Categories

- 🏃 **Physical Development** - Rolling, sitting, crawling, walking
- ✋ **Fine Motor Skills** - Grasping, transferring objects
- 🧠 **Cognitive & Language** - Vocalizing, understanding, speaking
- 🍼 **Feeding & Nutrition** - Sucking, solid foods, self-feeding

## 🎨 Design Philosophy

- **Warm Color Palette** - Pink #F472B6, Sky Blue #60A5FA
- **Rounded Design** - Extensive use of rounded-2xl for softness
- **Subtle Shadows** - Gentle shadow-soft for depth
- **Touch-Friendly** - Button sizes optimized for thumb reach

## 📱 PWA Features

LittleSteps is a Progressive Web App with:

1. Add to home screen capability
2. Offline browsing
3. Native app-like experience
4. Automatic updates

### Installation

**iOS (Safari)**:
1. Tap the share button
2. Select "Add to Home Screen"

**Android (Chrome)**:
1. Tap the menu
2. Select "Install app"

## 📄 License

MIT License

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
