# User test round 1 — findings, panel decisions, backlog

Date: 2026-11-26. Status: decided; implementation tracked in issues #145–#158.

## How this round was run, and what it is not

Six parent personas were played by three tester agents. This was **simulated
user research**, not sessions with real families. Treat the findings as a
heuristic walk-through from six realistic points of view, each one checked
against the source. A real-device round with real parents is still owed. See
"Open questions".

- **Public pages:** exercised live in Chromium against `vite` at 390px, and at
  320px for grids. The dummy Firebase config from `playwright.config.ts` was
  injected, because the dev server renders a blank page without one.
- **Gated pages:** assessed from source. Every finding below is marked or
  traceable to a file and line.
- **Before any finding reached the backlog,** the PM re-checked the headline
  findings in source, and the panel re-checked all of them. Three were
  corrected or dropped.

| Persona | Situation | Score |
|---|---|---|
| 林小姐 | 31, first pregnancy, week 20, reads on the MRT at night | 7/10 |
| 陳先生 | 34, her partner, will do night feeds, skims | 5/10 |
| 王太太 | 29, 4-month-old, mostly breastfed, back to work in 3 weeks | 7/10 |
| 王阿嬤 | 62, grandmother on weekdays, LINE is her main app | 4/10 |
| 張媽媽 | 36, a 2-year-old and a 2-month-old, plans rainy weekends | 6/10 |
| 李爸爸 | 33, son born at 32 weeks, now 7 months | 5/10 signed out, 7/10 signed in |

## What testers valued (keep)

- **The public calculators.** The checkup schedule with its ICS export (20
  events, each with a 7-day alarm), and the vaccine schedule by birthday.
- **Article quality.** The 就醫警訊 sections and per-article verification dates.
  The About page is candid about who can technically reach the data.
- **Quick log.** Large labelled buttons, time and amount presets, per-child
  prefill, one-tap repeat with a toast, and "logged by X" on each entry.
- **Places.** BabyOasis's MRT-station search with distances in metres, and
  LittleOuting's per-county family-centre booking rules.
- **Corrected age for prematurity,** once signed in.

## Findings

Each finding is marked by how it was checked: **verified** means confirmed in
source by the PM or the panel; **corrected** and **dropped** mean the panel
rejected the tester's claim, in part or in full.

1. **Sharing promises more than it does** (verified). The landing, intro and
   About pages promise any member can be removed. The share sheet excludes the
   creator, removes all-or-nothing, and never lists members
   (`ShareChildUuidModal.tsx:37-43,201-206`). The rules allow removing the
   creator; the UI chooses not to (`useFirebaseChildren.ts:390-407`).
2. **LittleGuard data is 89 days old** (verified). The banner says "over a
   month" at any age (`RadarPage.tsx:208`). The expired drawer still says
   "this week" (`radar.ts:215-227`).
   - Hiding the numbers on expiry was rejected on purpose by spec §7 of
     `2026-09-03-littleguard-disease-radar-design.md`. The panel kept that
     decision.
3. **Sign-in from LINE dead-ends** (verified). LINE is detected
   (`AuthContext.tsx:40-55`) and sign-in falls back to a redirect, but Google
   refuses OAuth in embedded webviews. Nothing tells the parent to open a real
   browser.
4. **A partner cannot join from LittleBloom** (verified). The empty state
   offers only "create" (`LittleBloomPage.tsx:147-162`,
   `AddPregnancyModal.tsx:27`). That produces duplicate pregnancy profiles,
   which also consume one of the two free slots. The share copy says "baby
   code" for a pregnancy.
5. **Preterm** (corrected; one part added by the panel).
   - The public growth calculator *does* tell parents to use corrected age
     (`GrowthPercentileToolPage.tsx:98-100`), but it makes them compute it.
     A 32-weeker entered at 7 months scores P1 three times.
   - Milestones silently use the corrected band
     (`MilestonesPage.tsx:50` → `ageDefaults.ts:27-35`).
   - Added by the panel: alerts use chronological age
     (`DashboardPage.tsx:84-91`).
6. **Night feeding** (verified).
   - The last breast side is not shown.
   - Save scrolls out of reach in the feeding sheet: `ModalFrame.tsx:50-52`
     makes the header sticky, not the footer.
   - Daily stats show counts only: no wet-diaper split and no bottle total.
   - There is no dark theme.
7. **"Is baby eating enough?" goes unanswered** (verified). The wiki searches
   for 吃不夠, 喝多少, 睡眠倒退 and 夜醒 all return zero articles.
8. **The clinic summary has no development section** (verified), and its notes
   are not saved (`ClinicSummaryPage.tsx:400`).
9. **Pregnancy** (verified in part; one claim corrected).
   - The week 20-27 movement warning assumes a baseline a first-time mother
     does not have yet, and is an uncited string, while weeks 28+ use the cited
     `REDUCED_MOVEMENT` constant.
   - The checkup footnote always names the last period as the basis, even when
     a due date was entered.
   - The pregnancy wiki's closing note sends parents to a sign-in for what the
     public checkup calculator already does (`SuiteNote.tsx:54-59`).
   - Corrected: "past items listed as upcoming" was a misread. Items whose
     window is still open are rightly listed; only the label mixes them.
10. **Content gaps** (verified).
    - Nothing on the first two weeks: jaundice, the stool-colour card, newborn
      screening.
    - No postpartum warning signs.
    - No newborn-preparation checklist.
    - No 4-month sleep-regression article.
11. **Rotavirus funding** (added by the panel, verified).
    - Five rows flip to publicly funded on 2027-01-01, and the date test turns
      red that day, blocking every PR.
    - `isScheduledDose` does not know the 2-dose and 3-dose series are
      alternatives, so after the flip five doses would count as owed.
12. **BabyOasis** (verified).
    - The build script never de-duplicates rooms; there are about 7 duplicate
      pairs.
    - The locate button (`BabyOasisPage.tsx:146`, `z-[1000]`) covers the
      station picker.
13. **Cross-service** (verified; not in this round's backlog).
    - The child switcher appears only on three LittleSteps pages.
    - Family-centre cards link neither to nearby nursing rooms nor to booking
      sites.
    - There is no "rainy day / indoor" entry point.
    - LittleGuard spells 台北市, while the other services use 臺北市.
14. **Dropped.** "234 centres on the landing page vs 247 in the tab" is not a
    bug: 247 is the 234 centres plus Taipei's 13 rooms, a split the README
    documents.

## Panel

**Seats:** a Taiwanese paediatrician, an IBCLC lactation consultant, an
early-intervention specialist, an obstetric nurse-midwife, a senior engineer, an
engineering hiring manager and a UX lead. The PM chaired.

### Decisions

| Theme | Decision | Why |
|---|---|---|
| Sharing copy vs behaviour | Change the copy now, then build the member list | A trust promise the UI breaks is a P0; per-member removal is the real fix |
| LittleGuard staleness | Keep spec §7; fix the wording; add a staleness alarm | The process gap is the defect, not the decision to keep the numbers |
| Sign-in from LINE | Interstitial with `openExternalBrowser=1` / copy link | The main way family arrives; the detection already exists |
| Join by link | Accept, gated | Must be an explicit confirm, code in the fragment, `joinOpen` still decides |
| Last breast side | Show it; do **not** auto-flip | IBCLC: start on the fuller breast, alternation is a rule of thumb |
| "Enough milk" | Wet diapers and weight gain, in sourced content; a bottle-only ml total | An ml target by age pushes overfeeding and cannot measure breastfeeding |
| Preterm | Birth-week input on the calculator; label corrected age wherever it applies; correct the alerts | The false alarm hits the most anxious parents |
| Movement warning | Reword with a cited HPA source; do not remove it | Paediatrician and midwife agreed on rewording, not removal |
| Breastfeeding timer | Deferred | IBCLC: "watch the baby, not the clock" |
| Dark mode | Deferred | Every token is a single hex and the map tiles are light; a half-done theme reads worse than none |

### Rejected

- **A public read-only link to a child's log for grandparents.** Any URL that
  reads records without membership widens the only real authorisation
  boundary, `database.rules.json`.
- **A "try it without an account" LocalStorage mode.** CLAUDE.md forbids a
  guest mode and any client-side storage of child data.
- **Age-based millilitre targets.** Rejected on clinical grounds; see above.
- **A GitHub cron that fetches CDC data.** `od.cdc.gov.tw` refuses
  GitHub-hosted runners. The alarm reads only the committed `weekEnd`.

### Hiring manager's read of the repo

- **Strong signals:**
  - rules tested against the real emulator;
  - a bundle E2E proving public pages never load the database SDK;
  - copy held to data by tests.
- **Weak signals:**
  - a public page with three-month-old outbreak data;
  - a date-based test about to block every PR;
  - `catch (error: any)` under strict TypeScript (`AuthContext.tsx:72,109`);
  - a 920-line README.
- **Advice:** fix the stale page and the time bomb before adding anything new.
  Scope discipline is the impressive part.

## Backlog

Land the P0s first. #145 has a hard deadline of 2027-01-01.

| Priority | Issue | Title |
|---|---|---|
| P0 | #145 | Flip rotavirus to publicly funded and treat the two products as alternatives |
| P0 | #146 | Make the sharing copy match what the share sheet can do |
| P0 | #147 | LittleGuard: name the week once expired, state the real age, alert when stale |
| P0 | #148 | Send in-app-browser users to a real browser before Google refuses them |
| P0 | #149 | Preterm: birth weeks on the calculator, label on milestones, corrected alerts |
| P1 | #150 | Let a partner join from LittleBloom and from a share link |
| P1 | #151 | List members by name and allow removing any one of them |
| P1 | #152 | Daily log: last breast side, reachable Save, wet diapers and bottle ml |
| P1 | #153 | Clinic summary: a development section |
| P1 | #154 | LittleBloom: movement warning, checkup footnote, correct call to action |
| P1 | #155 | BabyOasis: de-duplicate rooms, locate button below the picker |
| P2 | #156 | First-two-weeks and gap-filling articles, all sourced |
| P2 | #157 | A public weekly pregnancy guide by due date |
| P2 | #158 | Share today's summary as text |

Each issue carries its evidence, code locations, acceptance criteria, guard-test
requirement where one applies, and a "Do NOT" list.

## Open questions

1. **Creator deletion.** When other members exist, should the creator's
   "delete" become "leave"? Today it wipes the record for everyone
   (`useFirebaseChildren.ts:277`).
2. **Stool colour in the diaper log.** Clinically valuable, but it needs a
   rules change and permission to reuse the HPA card's colour scale.
3. **Dark mode.** A full token re-map, or a night variant of the log screen
   only?
4. **The 2-child limit** (`childLimits.ts:12`). Should joined children count
   toward it? Grandparents with three grandchildren are blocked today.
5. **Real-device checks.** LINE sign-in after #148 on iOS and Android, and
   whether the non-ASCII ICS filename keeps its `.ics` extension on phones.
6. **Who owns the LittleGuard refresh?** Options: a weekly owner, a self-hosted
   runner in Taiwan, or hiding the board from the landing page while its data
   has expired.
7. **A real user round.** Run this round's tasks with five real parents
   (including one grandparent and one preterm family) before the P1s ship.
