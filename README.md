# LittleSteps

**English** · [繁體中文](README.zh-TW.md)

> Six services for Taiwanese parents, from pregnancy through the toddler years.
> A mobile-first PWA covering pregnancy, the first year, the toddler years,
> finding somewhere to feed the baby when you are out, and what is going around
> in your county this week.

<div align="center">

[![Deploy to Firebase Hosting](https://github.com/sean1093/LittleSteps/actions/workflows/firebase-hosting-merge.yml/badge.svg)](https://github.com/sean1093/LittleSteps/actions/workflows/firebase-hosting-merge.yml)

[Live app](https://littlesteps-c6ab6.web.app) · [Issues](https://github.com/sean1093/LittleSteps/issues)

</div>

---

## The six services

One entry point at `/#/` lists six services. They share a design system, an
auth model and a data layer; each keeps its own palette and its own navigation
shape.

| | Service | Stage | Navigation |
|---|---|---|---|
| 🌸 | **LittleBloom** | Pregnancy · weeks 0-40 | hub + back button |
| 🍼 | **LittleSteps** | Newborn · 0-12 months | sidebar, 12 routes |
| ☀️ | **LittleExplorer** | Toddler · 1-3 years | 4 bottom tabs |
| 🌳 | **LittleOuting** | any | 3 in-page tabs |
| 📍 | **BabyOasis** | any | full-screen map |
| 🛡️ | **LittleGuard** | any | single board + drawer |

### LittleBloom — pregnancy companion
- **Weekly pregnancy guide** — week-by-week body changes and what to watch for
- **Prenatal schedule** — the 14 government-funded prenatal checkups, with dates and clinics recorded
- **Pregnancy knowledge base** — 24 articles: causes, what to do, when to see a doctor
- **Birth registration** — converts a pregnancy profile into a baby profile, which is what moves a family from LittleBloom to LittleSteps

### LittleSteps — baby growth tracking
- **Growth overview** — one screen summarising milestones, vaccines, sleep, nappies and food
- **Milestone tracking** — 33 milestones across physical, motor, cognitive and feeding
- **Vaccine tracking** — 32 doses on Taiwan's MOHW schedule (21 government-funded, 11 self-paid), with side-effect and emergency guidance
- **Quick log** — feeding, sleep and nappies in a couple of taps
- **Sleep analysis** — patterns, quality scoring and advice from the logs
- **Sleep guide** — sleep needs from 0 to 3 years, safety rules and training methods
- **Growth charts** — WHO curves (P3/P15/P50/P85/P97) for weight, height and head circumference
- **Weaning guide** — stage-based weaning plus the 4×3 allergen-introduction method and a per-food trial log
- **Care guide** — age-appropriate care and safety
- **Baby wiki** — 15 common health issues
- **Clinic summary** — generates a summary to hand to a paediatrician
- **Weekly / monthly report** — trends and development insight

### LittleExplorer — toddler companion
- **Development checks** — 30 checks over 12-36 months in five stages, plus a primary-teeth chart
- **Care reminders** — health checks, vaccines and fluoride varnish scheduled from the birth date, exportable to a calendar
- **Growth diary** — free-text entries with a mood, for the things that never show up in data
- **Toddler wiki** — 45 articles on toilet training, language, emotions, fussy eating, illness
  and what to keep in the medicine cabinet, filtered by the child's age stage

### LittleOuting — places to take a child
- **234 public family centres across all 22 counties**, built by a committed
  script from the national list published by the MOHW Social and Family Affairs
  Administration, plus Taipei's 13 parenting-friendly rooms kept separate
  because they are a different programme
- Per-county access rules — free or paid, eligible ages, how to book, household
  registration limits — each with its own source and verification date, and an
  explicit "not verified" for the 18 counties whose rules are not published
- **12 family-friendly restaurants**, hand-verified and labelled as a sample
  rather than a directory: Taiwan has no official dataset of family-friendly
  restaurants and no certification scheme, and the Tourism Administration's
  national restaurant feed has a Kids-Friendly field that is empty in all 3,632
  records
- A before-you-go checklist — the eleven questions that decide whether a trip out works
- No map, on purpose: no official family-centre source carries coordinates, and
  geocoding Taiwanese street addresses was tested and rejected (see below)

### BabyOasis — nursing-room map
- **3,852 nursing rooms across all 22 counties**, from MOHW open data
- Locate-me search returning the nearest 8 within 10 km, with real distances
- County, then district, each district carrying its own room count: the 3,852
  rooms sit in 364 districts, so one flat list would be 364 chips
- Six venue-type chips: malls, stations and airports, hospitals and clinics,
  parks and outdoor spaces, libraries and exhibition halls, family centres and
  social welfare
- **2,792 of the 3,852 rooms are on the statutory public-venue list**; the other
  1,060 were provided voluntarily. The dataset carries no venue type and both
  kinds look identical on the map, so that list is the only source-backed way
  to tell a shopping centre from a factory canteen
- 474 rooms read as staff-or-student-only — 228 workplaces and 246 campuses,
  none of them on the statutory list. They are labelled as internal venues
  rather than hidden, because the venue type is inferred from the registered
  name and hiding a real room by default is the worse error. One tap on the
  exclude-internal-venues chip removes all 474
- 973 rooms whose remarks require a service desk are labelled as such, so a
  parent asks at the desk rather than looking for a door that is locked
- Facilities, opening hours, phone, and a one-tap Google Maps handoff
- Clustered markers with a spatial index, so the national dataset stays usable at any zoom

### LittleGuard — disease radar
- **Six infectious diseases common in children**, one upstream dataset each (enterovirus, hand-foot-and-mouth disease, herpangina, influenza-like illness, diarrhoea, chickenpox): weekly outpatient visits, split across the 22 counties and three age bands (0-2 / 3-6 / 7-12)
- **Four rows on the board, not six**: hand-foot-and-mouth disease and herpangina are the two clinical presentations of an enterovirus infection, and the upstream enterovirus dataset is exactly their sum — equal in all 66 cells (22 counties × 3 age bands), for visits, for rates and for each of the 8 sparkline weeks. Three rows side by side counted the same outpatient visits three times, so the board lists enterovirus once and breaks the two forms out inside its drawer, and a contract test goes red if upstream ever stops being an exact partition
- Status compares a county with **its own previous 8 weeks**, not with the same week in earlier years: the 2020-2022 control measures nearly erased enterovirus, so a five-year same-week baseline makes every week look abnormal
- Thresholds are percentiles of the measured distribution (P25 0.78 / P75 1.26 / P90 1.77, n=48,725), recomputed into the JSON on every rebuild, so a test goes red when the constants in code drift away from the data
- Nine statuses, with `noBaseline` (not enough data to compare) deliberately separate from `none` (no recent cases): "the previous 8 weeks cannot produce a baseline" and "the baseline really is zero" are different things, and only the second one supports "this week it starts appearing"
- A cell whose denominator is too small says "small sample" or "not enough data" instead of being given an invented status — weekly visits for ages 0-2 in Lienchiang and Kinmen are two-digit numbers
- The tone is deliberately restrained: notice this, do not panic about it. Every "more than usual" comes with something a parent can do, and the strongest colour it reaches is `butter-dark`

---

## Accounts and data

**Signing in is required for anything that reads or writes a child's records.**
Knowledge content is not.

`src/common/routePolicy.ts` holds a **public allowlist**, deliberately not a
"needs auth" blocklist: this app stores children's health data, so forgetting to
mark a new page should fail closed. Public pages are the entry point, the three
knowledge bases, the care guide, the sleep guide, LittleOuting, BabyOasis and
LittleGuard. Everything else needs an account.

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
regenerated by `scripts/buildNursingRooms.cjs`; the family-centre list is
`public/data/familyCentres.json` from `scripts/buildFamilyCentres.cjs`. It is excluded from the PWA
precache and fetched on first visit to the map instead — 1.1 MB should not be
downloaded by someone who never opens BabyOasis.

Disease radar data lives at `public/data/diseaseRadar.json`, aggregated by
`scripts/buildDiseaseRadar.cjs` from six Taiwan CDC CSV files (~47 MB) down to
68.5 KB. That is 14.7 KB gzipped, so it stays inside the PWA precache and the
board opens offline. The certificate chain served by `od.cdc.gov.tw` is
incomplete, so the script carries the two TWCA certificates under
`scripts/data/`; do not "fix" that by turning off TLS verification.

**Updating is manual, once a week.** Taiwan CDC publishes the previous week
early on Monday or Tuesday, so run this from Wednesday onwards:

```bash
node scripts/buildDiseaseRadar.cjs   # rebuild
node scripts/diffDiseaseRadar.cjs    # 0 same data / 1 changed / 2 cannot compare
```

Only exit 1 earns `git add public/data/diseaseRadar.json` and a commit. On exit
0 run `git checkout -- public/data/diseaseRadar.json` to drop the timestamps the
rebuild just wrote. The comparison strips `generatedAt` and `verifiedOn` first,
because they change on every run and would otherwise produce a weekly commit
that changes no data. Exit 2 means the comparison itself failed: stop and look,
never treat it as a 1.

`.github/workflows/refresh-disease-radar.yml` carries the same logic but is
**manual only, and only useful on a runner with a Taiwan route**.
`od.cdc.gov.tw` is unreachable from GitHub-hosted runners: two dispatches both
died with `connect ETIMEDOUT 35.229.205.172:443` without completing a TCP
handshake, while the same IP answers from a machine in Taiwan and resolves to
the same address from both, so this is the source IP being blocked and not DNS
geo-splitting. Dispatched on `ubuntu-latest` it now stops after about 20 seconds
with that explanation instead of hanging for over two minutes; dispatch it with
the `runner` input pointed at a self-hosted runner in Taiwan and the rest of the
job works unchanged.

Forgetting to update is safe: the board shows which week the data covers, and
once that is over a month old it says so and collapses every status line,
leaving only the numbers.

---

## Project structure

```
src/
├── common/                  shared across all six services
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
├── littleouting/            venue page + card, centre + restaurant data, checklist
├── babyoasis/               map page, spatial index, data
├── littleguard/             radar page, disease row + drawer, sparkline,
│                            status thresholds, county centroids
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
`littleouting`, `babyoasis`, `littleguard`.

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

1. Read `.claude/CLAUDE.md` and the skills in `.claude/skills/`. Two of them are
   process, not code: `english-writing` (commit messages, PR text and docs are
   English; `README.md` and `README.zh-TW.md` change together) and
   `pr-self-merge` (branch, open a PR, review your own diff in writing, fix what
   it finds, merge it).
2. Follow the design system above. Adding a second way to draw a card is the
   main thing to avoid.
3. Conventional commits: `feat:` `fix:` `refactor:` `style:` `docs:` `test:`
   `chore:`.
4. CI only builds the PR and deploys a preview, so run `npm run build`,
   `npm run lint` and `npx vitest run` yourself — and look at the change on a
   390px viewport — before opening the PR.

## Roadmap

- **Now** — all six services live, multi-device sync, feedback reporting
- **Next** — premium tier, richer analytics, LittleBloom weekly content depth
- **Later** — milestone photos, community, English and Simplified Chinese, dark mode

## Acknowledgments

Medical and schedule information follows Taiwan Ministry of Health and Welfare
guidance; growth curves are the WHO Child Growth Standards; nursing-room data is
Taiwan government open data. Content is reference material and does not replace
a doctor.

MIT licensed.
