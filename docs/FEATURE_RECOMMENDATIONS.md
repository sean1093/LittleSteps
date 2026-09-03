# LittleSteps Feature Recommendation Report
> Based on research into online parenting forums and analysis of what parents actually need

## 📋 Executive Summary

**Current positioning**: an educational reference tool (milestones, vaccines, weaning guide)
**Recommended shift**: a hybrid educational + daily-logging tool

**Key findings**:
- ✅ The existing educational content is excellent (milestones, vaccines, complementary food)
- ❌ The "daily log" feature parents reach for most is missing
- 🎯 Recommendation: keep the educational features, add lightweight daily logging

---

## 🎯 Feature Recommendations (by priority)

### 🔥 Priority 1: Quick log (Daily Log)

#### What it does
A single-page rapid logging screen; an entry takes under 3 seconds

#### Core tracked items
1. **Feeding**
   - Type: breast milk (left / right / both), formula, complementary food
   - Recorded: time, amount (ml), duration (minutes)
   - Timer: keeps running in the background (parents can close the app)

2. **Sleep**
   - Start / end time
   - Total duration calculated automatically
   - Shows "last sleep was 2 hours ago"

3. **Diaper change**
   - Type: stool / urine / both
   - Stool consistency (optional): normal / loose / hard
   - Time logged

4. **Quick buttons**
   ```
   [🍼 Feed]  [💤 Sleep]  [💩 Diaper]  [🌡️ Other]

   Tapping logs the current time immediately
   Long-pressing opens detailed editing
   ```

#### UX design priorities
- ✅ Large buttons (at least 60x60px) suited to one-handed use
- ✅ Smart default values (for example, the previous feed's amount)
- ✅ Quick correction (for an entry just logged wrongly)
- ✅ Timeline view (every entry from today)

#### Technical implementation
```typescript
interface DailyLog {
  id: string;
  childId: string;
  type: 'feeding' | 'sleep' | 'diaper' | 'health';
  timestamp: string; // ISO
  data: FeedingData | SleepData | DiaperData | HealthData;
}

interface FeedingData {
  feedingType: 'breast_left' | 'breast_right' | 'breast_both' | 'formula' | 'solid';
  amount?: number; // ml
  duration?: number; // minutes
  notes?: string;
}
```

**Sources**:
- [Best Baby Tracker Apps 2026](https://medium.com/@muharremyurtsever/best-baby-tracker-apps-in-2026-an-honest-comparison-from-a-parent-who-tried-them-all-8fa1f738c681) - "speed is what matters; parents need to finish an entry within 3 seconds"
- [Taiwanese parenting app roundup](https://www.sundaykiss.com/%E5%AC%B0%E5%85%92/%E8%82%B2%E5%85%92app-%E8%A8%98%E9%8C%84-%E6%88%90%E9%95%B7%E9%80%B2%E5%BA%A6-%E6%96%B0%E6%89%8B%E5%AA%BD%E5%AA%BD-%E5%AF%A6%E7%94%A8-sk07-512968/) - "breastfeeding and feeding logs, sleep times, bowel-movement logs"

---

### 🌟 Priority 2: Growth charts (Growth Chart)

#### What it does
Visualises the baby's growth data against the WHO growth curves

#### Core features
1. **Data entry**
   - Weight (kg)
   - Height / length (cm)
   - Head circumference (cm)
   - Date of the measurement

2. **Visual chart**
   - WHO reference curves (3rd, 15th, 50th, 85th, 97th percentile)
   - The baby's own curve
   - Percentile readout (for example, "weight is in the 45th percentile")

3. **Smart reminders**
   - Check-up reminders (1 month, 2 months, 4 months, ...)
   - Anomaly warnings (a sudden drop out of the normal range)

#### UX reference
```
📊 Growth curve
┌───────────────────────────┐
│ [Weight] [Height] [Head]  │  ← tab switch
│                           │
│       📈 chart area       │
│                           │
│ Latest: 9.5kg (↑0.5kg)    │
│ Percentile: 45th          │
│ Last measured: 7 days ago │
└───────────────────────────┘
[+ Add a measurement]
```

**Sources**:
- [Taiwanese mothers' forum](https://www.mababy.com/knowledge-detail?id=9781) - "logging a child's height and weight, a growth record"
- [Consumer Reports](https://www.consumerreports.org/babies-kids/baby-tracking-apps/best-baby-tracking-apps-a6067862820/) - "Growth tracking with WHO curves"

---

### 📊 Priority 3: Charts and trends (Analytics)

#### What it does
Generates daily and weekly statistics automatically, so parents can see the baby's rhythm

#### What is visualised
1. **Today's overview card**
   ```
   Today's statistics (2026/03/27)
   🍼 Feeds: 8 (720ml total)
   💤 Sleeps: 6 (14 hours total)
   💩 Diapers: 7 (3 stool, 4 urine)
   ```

2. **Weekly trend chart**
   - Feeding-frequency curve
   - Sleep-duration trend
   - Predicted time of the next feed

3. **Pattern recognition**
   - "The baby usually sleeps longer after a feed between 21:00 and 22:00"
   - "Over the past 3 days, the baby has woken fewer times at night"

**Sources**:
- [Best Baby Tracking Apps](https://www.slashgear.com/1864409/best-baby-tracking-apps-parents-2025/) - "the app compiles feeds, sleep, bowel movements and temperature into weekly charts automatically"
- [Medium Review](https://medium.com/@muharremyurtsever/best-baby-tracker-apps-in-2026-an-honest-comparison-from-a-parent-who-tried-them-all-8fa1f738c681) - "Predictive 'what's next' windows based on history"

---

### 🌙 Priority 4: Dark mode (Dark Mode)

#### What it does
An eye-friendly mode for feeds in the small hours

#### Implementation priorities
- Pure black OLED background (#000000)
- Less blue light (warm tones)
- Automatic switching (22:00-06:00)
- Manual toggle button

**Sources**:
- [Reddit Parents Discussion](https://medium.com/@social.devonwheels/top-5-baby-tracking-apps-in-2025-ecbfa428535b) - "OLED dark mode for 3 AM feeds"

---

### 👥 Priority 5: Multi-caregiver sync (Coming Soon)

#### What it does
Partners and grandparents can view and log in sync

#### Technical challenges
- Today: LocalStorage (single device)
- Later: needs a backend service (Firebase Firestore)
- Permissions: Admin / Caregiver / Viewer

**Staged recommendation**:
1. **Phase 1** (now): export / import (JSON file)
2. **Phase 2** (later): cloud sync (needs a backend)

**Sources**:
- [Le Baby App](https://www.lebaby.app/a-baby-tracker-to-share-with-your-partner) - "A baby tracker to share with your partner"
- [Taiwanese parenting apps](https://www.mababy.com/knowledge-detail?id=9781) - "partners can share parenting records in sync"

---

## 🎨 UX Improvement Recommendations

### 1. Redesign the home screen

#### The problem today
- The home screen is a landing page (right for new users)
- Returning users have to pick a feature every time they open the app

#### Suggested improvement
```
Child profile exists → home becomes a "Today overview" dashboard
  ├─ Quick-log buttons for today
  ├─ Timeline of the 3 most recent entries
  ├─ Quick navigation (milestones, vaccines, complementary food)
  └─ Daily statistics card

No child profile → show the landing page
```

### 2. Bottom navigation bar (Tab Bar)

```
┌───────────────────────────────────────────┐
│               Content Area                │
│                                           │
└───────────────────────────────────────────┘
┌───────────────────────────────────────────┐
│ [🏠 Home] [📝 Log] [📊 Milestones] [More] │
└───────────────────────────────────────────┘
```

**Advantages**:
- Matches mobile app conventions
- Easy to reach with one thumb
- Fewer taps

### 3. Gestures

- **Pull to refresh**: updates the timeline
- **Swipe left to delete**: removes a log entry
- **Long press**: enters edit mode

**Sources**:
- [Best Baby Tracker App Review](https://www.bestbabytracker.com/) - "One-hand operation is critical"

---

## 🚀 Implementation Roadmap

### Phase 1: quick-logging MVP (2-3 weeks)
- [ ] Add a "Today's log" page
- [ ] Implement feeding, sleep and diaper logging
- [ ] LocalStorage persistence
- [ ] Timeline view
- [ ] Basic statistics (today's overview)

### Phase 2: growth and visualisation (2 weeks)
- [ ] Growth charts (WHO reference)
- [ ] Weekly statistics charts
- [ ] Trend analysis

### Phase 3: experience polish (1-2 weeks)
- [ ] Dark mode
- [ ] Home dashboard
- [ ] Bottom navigation bar
- [ ] Gestures

### Phase 4: advanced features (later)
- [ ] Smart reminders
- [ ] Health records (temperature, medication)
- [ ] Export / import
- [ ] Cloud sync (needs a backend)

---

## 📊 Competitor Reference

From the 2026 market survey:

1. **Baby Tracker** - minimalist, a 3-second entry
2. **Huckleberry** - AI prediction of the next sleep window
3. **Baby Connect** - the most complete feature set, but a complex interface
4. **Dr.B** (Taiwan) - well localised in Chinese, has reminders

**How LittleSteps differentiates**:
- ✅ Localised for Taiwan (vaccine schedule, complementary food)
- ✅ Expert educational content (milestones, care guides)
- ✅ A PWA: nothing to install, cross-platform
- ✅ Privacy first (LocalStorage, no sign-up)

**Where it should be strengthened**:
- ❌ Daily logging (the biggest gap today)
- ❌ Visual charts
- ❌ Predictions and reminders

---

## 💰 Business Model Recommendations (for later consideration)

Today: a free tool
Possible later:
1. **Freemium**
   - Free: basic logging + educational content
   - Paid: advanced charts, AI predictions, cloud sync

2. **Advertising**
   - Mother-and-baby product recommendations (non-intrusive)

3. **Data analysis** (anonymised)
   - Helping research institutions understand infant growth trends in Taiwan

---

## 📚 References

### Online forum research
- [Best Baby Tracker Apps 2026 - Medium](https://medium.com/@muharremyurtsever/best-baby-tracker-apps-in-2026-an-honest-comparison-from-a-parent-who-tried-them-all-8fa1f738c681)
- [Taiwanese parenting app roundup - Sundaykiss](https://www.sundaykiss.com/%E5%AC%B0%E5%85%92/%E8%82%B2%E5%85%92app-%E8%A8%98%E9%8C%84-%E6%88%90%E9%95%B7%E9%80%B2%E5%BA%A6-%E6%96%B0%E6%89%8B%E5%AA%BD%E5%AA%BD-%E5%AF%A6%E7%94%A8-sk07-512968/)
- [Parenting app roundup - Mababy](https://www.mababy.com/knowledge-detail?id=9781)
- [Pregnancy & parenting apps - Mombaby](https://www.mombaby.com.tw/articles/9917972)
- [Consumer Reports Review](https://www.consumerreports.org/babies-kids/baby-tracking-apps/best-baby-tracking-apps-a6067862820/)
- [SlashGear - Best Apps 2025](https://www.slashgear.com/1864409/best-baby-tracking-apps-parents-2025/)

### Technical references
- WHO Growth Charts API
- React + TypeScript + Vite
- Chart.js / Recharts for visualisation
- Framer Motion for animation

---

**Report generated**: 2026-03-27
**Analysis tooling**: Claude Code + Web Research
**Valid for**: 6 months (re-assess market needs every six months)
