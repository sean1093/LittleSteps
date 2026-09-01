# LittleSteps

> 從懷孕到幼兒，五個服務陪台灣爸媽走過每個階段。
> A mobile-first PWA covering pregnancy, the first year, the toddler years, and
> finding somewhere to feed the baby when you are out.

<div align="center">

[![Deploy to Firebase Hosting](https://github.com/sean1093/LittleSteps/actions/workflows/firebase-hosting-merge.yml/badge.svg)](https://github.com/sean1093/LittleSteps/actions/workflows/firebase-hosting-merge.yml)

[Live app](https://littlesteps-c6ab6.web.app) · [Issues](https://github.com/sean1093/LittleSteps/issues)

</div>

---

## The five services

One entry point at `/#/` lists five services. They share a design system, an
auth model and a data layer; each keeps its own palette and its own navigation
shape.

| | Service | Stage | Navigation |
|---|---|---|---|
| 🌸 | **LittleBloom** | 孕期 · 0-40 週 | hub + back button |
| 🍼 | **LittleSteps** | 新生兒 · 0-12 月 | sidebar, 12 routes |
| ☀️ | **LittleExplorer** | 幼兒期 · 1-3 歲 | 4 bottom tabs |
| 🌳 | **LittleOuting** | any | 3 in-page tabs |
| 📍 | **BabyOasis** | any | full-screen map |

### LittleBloom — 孕期陪伴
- **每週孕期指南** — week-by-week body changes and what to watch for
- **產檢時程** — the 14 government-funded prenatal checkups, with dates and clinics recorded
- **孕期知識庫** — 24 articles: causes, what to do, when to see a doctor
- **登記出生** — converts a pregnancy profile into a baby profile, which is what moves a family from LittleBloom to LittleSteps

### LittleSteps — 寶寶成長追蹤
- **成長總覽** — one screen summarising milestones, vaccines, sleep, nappies and food
- **里程碑追蹤** — 33 milestones across 體格 / 動作 / 認知 / 餵食
- **疫苗追蹤** — 32 doses on Taiwan's MOHW schedule (21 公費, 11 自費), with side-effect and emergency guidance
- **快速日誌** — feeding, sleep and nappies in a couple of taps
- **睡眠分析** — patterns, quality scoring and advice from the logs
- **睡眠指南** — 0-3 歲 sleep needs, safety rules and training methods
- **成長曲線圖** — WHO curves (P3/P15/P50/P85/P97) for weight, height and head circumference
- **副食品指南** — stage-based weaning plus the 4×3 allergen-introduction method and a per-food trial log
- **照顧重點** — age-appropriate care and safety
- **寶寶百科** — 15 common health issues
- **看診摘要** — generates a summary to hand to a paediatrician
- **週報 / 月報** — trends and development insight

### LittleExplorer — 幼兒期陪伴
- **成長檢核** — 30 checks over 12-36 months in five stages, plus a primary-teeth chart
- **照護提醒** — health checks, vaccines and fluoride varnish scheduled from the birth date, exportable to a calendar
- **成長日記** — free-text entries with a mood, for the things that never show up in data
- **幼兒百科** — 45 articles on toilet training, language, emotions, fussy eating, illness
  and what to keep in the medicine cabinet, filtered by the child's age stage

### LittleOuting — 親子好去處
- **234 公立親子館 across all 22 counties**, built from 衛福部社家署's national
  list by a committed script, plus Taipei's 13 育兒友善園 kept separate because
  they are a different programme
- Per-county access rules — 免費與否、年齡對象、預約方式、戶籍限制 — each with
  its own source and 查證日期, and an explicit "not verified" for the 18 counties
  whose rules are not published
- **12 親子餐廳**, hand-verified and labelled as a sample rather than a
  directory: Taiwan has no official 親子餐廳 dataset and no certification
  scheme, and the Tourism Administration's national restaurant feed has a
  Kids-Friendly field that is empty in all 3,632 records
- 出發前檢查清單 — the eleven questions that decide whether a trip out works
- No map, on purpose: no official 親子館 source carries coordinates, and
  geocoding Taiwanese street addresses was tested and rejected (see below)

### BabyOasis — 哺乳室地圖
- **3,852 nursing rooms across all 22 counties**, from MOHW open data
- Locate-me search returning the nearest 8 within 10 km, with real distances
- Facilities, opening hours, phone, and a one-tap Google Maps handoff
- Clustered markers with a spatial index, so the national dataset stays usable at any zoom

---

## Accounts and data

**Signing in is required for anything that reads or writes a child's records.**
Knowledge content is not.

`src/common/routePolicy.ts` holds a **public allowlist**, deliberately not a
"needs auth" blocklist: this app stores children's health data, so forgetting to
mark a new page should fail closed. Public pages are the entry point, the three
knowledge bases, 照顧重點, 睡眠指南, LittleOuting and BabyOasis. Everything else
needs an account.

A signed-out visitor hitting a private route gets that service's intro page at
the same URL — the path is preserved, so after signing in they land where they
were going.

- **Auth**: Firebase Authentication, Google sign-in
- **Database**: Firebase Realtime Database (asia-southeast1)
- **Sync**: real-time across devices
- **Sharing**: a child profile is shared with family via a unique code, and the
  sharing is revocable — see below
- **Limit**: 2 children per account on the free tier

### Sharing, and taking it back

Membership lives in `children/$childId/members`, inside the child rather than
inside each account. That is the whole point of it: an existing member can
remove another member. `joinOpen` decides separately whether a holder of the
code may add themselves, so a code that has been passed around can be closed
without disturbing anyone already in.

What that adds up to, asserted by `npm run test:rules` against the emulator:

- an existing member can remove another member
- a removed member cannot re-add themselves while `joinOpen` is `false`
- the `createdBy` user's own membership cannot be deleted at all — that is what
  keeps a child node from ending up with no members and unreachable by anyone
- any member is effectively an owner. Realtime Database cannot revoke a write
  granted at an ancestor node, so a member can write anything under the child,
  the member list included. This is a deliberate trade-off: two parents who can
  each take the other off a shared record is worth more here than a hierarchy
  of roles neither of them asked for.

### Database shape

```
users/$uid                 email, displayName, childrenIds, currentChildId
                           childrenIds is only this account's list of children
                           to subscribe to — authorisation is members, below
children/$childId          id, name, birthday, gender, createdAt, createdBy,
                           isPregnancy, pregnancyData
                           members/$uid: true      authorisation
                           joinOpen                may a code holder join?
                           milestoneProgress, vaccineProgress, toothProgress,
                           developmentProgress, prenatalProgress,
                           careTaskProgress, foodTrackingProgress
childRecords/$childId      dailyLogs/$logId        type (feeding|sleep|diaper),
                                                   timestamp, details
                           diaryEntries/$entryId   date, content, mood
                           growthRecords/$recordId date, weight, height,
                                                   percentile
childIndex/$childId        true — public existence index, so joining by code
                           never has to read a stranger's child node
feedbacks/$feedbackId      title, content, userId, timestamp
```

The child node holds who the child is, plus progress against fixed lists — 33
milestones, 32 vaccine doses, 30 development checks — so it is bounded. The
three collections under `childRecords` are not: they grow by one row per nappy,
forever. They sit in a sibling subtree because the child listener subscribes to
the whole `children/$childId` node, so with the logs inside it one nappy change
re-downloaded the child's entire history to every family member.

Access is enforced by `database.rules.json` — `childRecords/$childId` and
`childIndex/$childId` both through `children/$childId/members`. See that file
for the authoritative rules and `scripts/testRules.cjs` for what they are
asserted to do.

---

## Design system

Everything visual comes from one place. The rule that matters most:

> **Pastel shades are fills. Text takes the ramp's readable partner: `-dark` in
> the four base ramps, `-ink` in `bloom.*` / `explorer.*` / `outing.*`.**

The pastels sit at roughly 2:1 against white. Used as text or as a bed for
white text they are unreadable, which is what they were before this was written
down — the primary buttons were the least legible text on screen.

`bloom.*` and `explorer.*` are the trap: there `-dark` is a *deeper fill* for
hover and borders and measures 2.44–3.72:1 on white (`explorer-sunbeam-dark`
2.44, `bloom-dusty-rose-dark` 2.98, `bloom-sage-dark` 3.01), so text in those
two palettes always takes `-ink`.

### Palette — `tailwind.config.js`

| Ramp | Fill (decoration, never text) | Text (≥4.5:1) | Used for |
|---|---|---|---|
| `primary` | `#FF9B9B` | `primary-dark` `#B84A50` | LittleSteps, and the app's own brand |
| `secondary` | `#7EC8E3` | `secondary-dark` `#2A7288` | BabyOasis, informational accents |
| `mint` | `#81C784` | `mint-dark` `#3F7D43` | vaccines, "done" and "safe" |
| `butter` | `#F0B357` | `butter-dark` `#9A6212` | food, nappies, gentle warnings |
| `bloom.*` | Morandi shades **and every `-dark`** | `*-ink` (`bloom-dusty-rose-ink` `#855F5F`), `*-deep` | LittleBloom |
| `outing.*` | `#5FC0B5` | `outing-ink` `#1F7A70`, `outing-deep` `#14655C` | LittleOuting |
| `explorer.*` | bright shades **and every `-dark`** | `*-ink`, `bark` | LittleExplorer |

`ink` / `ink-muted` / `ink-faint` are body, secondary and caption copy — warmer
than `gray-*` against the `warm-white` (`#FDFBF7`) background, which is the one
page background.

### Shared classes — `src/index.css`

- `.card` — a row in a list · `.panel` — a section of a page · `.card-tap` / `.panel-tap` for the interactive versions
- `.screen` + `.screen-body` / `.screen-body-wide` — page shell and column width
- `.btn-primary` / `.btn-secondary` / `.btn-ghost` / `.btn-icon` — all ≥44px
- `.chip` + `.chip-on` — filter chips, ≥44px
- `.tag`, `.row-bleed`, `.scrollbar-hide`, `.min-h-dscreen`
- `h1`–`h4` have base sizes, because Preflight resets headings to `inherit`

Two shadows (`shadow-soft`, `shadow-soft-lg`) and two radii (`rounded-2xl`,
`rounded-3xl`). If you need a third of either, the design is wrong.

### Shared components — `src/common/ui/`

| File | Purpose |
|---|---|
| `serviceTheme.ts` | `SERVICE_THEME[id]` — the only thing that varies per service |
| `AppBar.tsx` | the one page header, fixed `h-16`; stick things below it at `top-16` |
| `EmptyState.tsx` | the one "nothing here yet" block; draws **no icon** unless the moment earns one |
| `motion.ts` | `stagger` `listItem` `fadeInUp` `sheet` `backdrop` `collapse` `tap` `hoverLift` |

### Principles

- **Mobile-first.** Scale up from a phone; never write a desktop size as the base.
- **44px minimum** for anything tappable. No small target nested inside a large one.
- **Icons must earn their place.** An icon that repeats the adjacent text is noise. Keep them for buttons, nav destinations, toggles, status, and per-row markers in long lists. Do not put one beside a heading.
- **Type and spacing carry hierarchy**, not colour blocks and not badges.
- **Motion is felt, not watched.** Short entrances, small offsets, nothing looping. `prefers-reduced-motion` is honoured globally.
- **No hex literals in components.** If a colour isn't a token, add a token.

---

## Tech stack

**Frontend** — React 18, TypeScript (strict), Vite 5, Tailwind CSS, Framer
Motion, Lucide icons, React Hooks + Context, Leaflet with clustering.

**Backend** — Firebase Authentication, Realtime Database and Analytics.

**Tooling** — Vitest + Testing Library, ESLint, Husky pre-commit,
`vite-plugin-pwa`, GitHub Actions.

---

## Getting started

Requires Node 18+.

```bash
git clone https://github.com/sean1093/LittleSteps.git
cd LittleSteps
npm install
```

Create `.env` (see `.env.example`; never commit it):

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_FIREBASE_DATABASE_URL=
```

```bash
npm run dev            # http://localhost:5173
npm run build          # tsc && vite build
npm run preview
npm run lint
npm run test           # watch
npm run test:coverage
npm run test:rules     # database.rules.json against the Database emulator
```

`npm run test:rules` runs `scripts/testRules.cjs` against the Database emulator
via `firebase emulators:exec`, so it needs a JDK: `brew install openjdk`, and
because that formula is keg-only, `/opt/homebrew/opt/openjdk/bin` has to be on
`PATH` or the emulator will not find `java`. Run it after every change to
`database.rules.json` — it is the only way to find out that you have just cut a
family off from a child's health record, or opened one to a stranger.

The nursing-room dataset lives at `public/data/nursingRooms.json` and is
regenerated by `scripts/buildNursingRooms.cjs`; the 親子館 list is
`public/data/familyCentres.json` from `scripts/buildFamilyCentres.cjs`. It is excluded from the PWA
precache and fetched on first visit to the map instead — 1.1 MB should not be
downloaded by someone who never opens BabyOasis.

---

## Project structure

```
src/
├── common/                  shared across all five services
│   ├── ui/                  design system: serviceTheme, AppBar, EmptyState, motion
│   ├── components/          Sidebar, ModalFrame, modals, AppHomeButton, wiki browser
│   ├── landing/             entry point + per-service intro pages
│   ├── hooks/               useChildStore and the Firebase child hooks
│   ├── utils/               dates, summaries
│   ├── routePolicy.ts       the public allowlist
│   └── pregnancy.ts
├── littlesteps/             pages, components/{milestone,vaccine,sleep,growth,
│                            dailylog,food,dashboard,report,shared}, hooks, data
├── littlebloom/             pages, components (BloomShell), data, utils
├── littleexplorer/          pages, components (ExplorerShell, ExplorerTabBar,
│                            ToothChart, AgeBandPicker), hooks, data, utils
├── littleouting/            venue page + card, 親子館/親子餐廳 data, checklist
├── babyoasis/               map page, spatial index, data
├── contexts/                AuthContext
├── lib/                     Firebase init
├── types/                   shared types and route unions
├── App.tsx                  routing, shell, lazy page loading
└── index.css                design tokens as classes
```

Routing is path-based (History API, with a SPA rewrite in `firebase.json`) so
every screen is shareable and crawlable. Sub-routes:
`littlesteps/{dashboard,milestones,vaccine-tracking,daily-log,growth-charts,sleep-training,sleep-analysis,complementary-food,care-guide,baby-wiki,clinic-summary,report}`,
`littlebloom/{prenatal,wiki}`, `littleexplorer/{reminders,diary,wiki}`,
`littleouting`, `babyoasis`.

---

## PWA

Installable, works offline, updates itself. Brand assets are generated from
`public/favicon.svg` — one source for the favicon, the Apple touch icon, the
192/512 PWA icons, a separate maskable icon (launchers crop to a circle) and the
1200×630 share card.

**iOS** — Safari → Share → Add to Home Screen.
**Android** — Chrome → menu → Install app.

---

## Deployment

Push to `master` deploys to Firebase Hosting via GitHub Actions; pull requests
get a preview URL. Environment variables come from GitHub Secrets.

```bash
npm run build && firebase deploy --only hosting   # manual
```

### Migrating a deployed database

`scripts/migrateChildRecords.cjs` is the one-shot migration that moved
authorisation into `children/$childId/members` and the three growing
collections out to `childRecords/$childId`. It reads the whole database and
writes `backups/rtdb-<timestamp>.json` (gitignored, mode 600) before touching
anything, and refuses to go on if that file cannot be written. Each child's
`members` is computed from whichever accounts hold the child in `childrenIds`;
each collection is copied, read back, compared to the source, re-checked that
the source has not changed underneath, and only then deleted. It will not
invent a member for a child that nobody has — that child is reported as an
orphan needing a human decision and skipped — and it will not overwrite a
`members` list that already exists, because recomputing that from `childrenIds`
would resurrect access somebody had revoked.

```bash
node scripts/migrateChildRecords.cjs           # dry run: every write it would make
node scripts/migrateChildRecords.cjs --apply   # writes
```

It is re-runnable. A child that already has `members` and no legacy collections
is reported as done and skipped, so an interrupted run is finished by running
the same command again.

The order matters:

```bash
node scripts/migrateChildRecords.cjs             # 0. dry run, read the output
firebase deploy --only database                  # 1. rules
node scripts/migrateChildRecords.cjs --apply     # 2. migrate
npm run build && firebase deploy --only hosting  # 3. app
```

Read the dry run before deploying the rules, because step 1 starts a window in
which nothing works: no child has a `members` list yet, so until step 2 writes
one the deployed app can neither read a child nor add one. Step 2 has to come
before step 3 because new code reading `childRecords` before the move finds no
logs at all, and step 3 has to follow immediately because a still-open old tab
writes logs back into `children/$childId`, where the new app does not look.
Running the migration once more after the deploy sweeps up whatever an old tab
wrote during the cutover; that is what being re-runnable is for.

One thing the new shape demands of the client: deleting a child MUST be a
single root fan-out update, with `children/<id>`, `childRecords/<id>`,
`childIndex/<id>` and `users/<uid>/childrenIds/<id>` all set to `null` in one
write. `childRecords` is authorised through `children/<id>/members`, and `root`
in a rules expression is the database *before* the write, so deleting the child
node in its own write leaves the records permanently unauthorised — unreadable
and undeletable. That the sequential order fails is a case in
`scripts/testRules.cjs`.

---

## Contributing

1. Read `.claude/CLAUDE.md` and the relevant file in `.claude/skills/`.
2. Follow the design system above. Adding a second way to draw a card is the
   main thing to avoid.
3. Conventional commits: `feat:` `fix:` `refactor:` `style:` `docs:` `test:`
   `chore:`.
4. `npm run build` and `npm run test` must pass. Check your change on a 390px
   viewport before opening a PR.

## Roadmap

- **Now** — all five services live, multi-device sync, feedback reporting
- **Next** — premium tier, richer analytics, LittleBloom weekly content depth
- **Later** — milestone photos, community, English and Simplified Chinese, dark mode

## Acknowledgments

Medical and schedule information follows Taiwan Ministry of Health and Welfare
guidance; growth curves are the WHO Child Growth Standards; nursing-room data is
Taiwan government open data. Content is reference material and does not replace
a doctor.

MIT licensed.
