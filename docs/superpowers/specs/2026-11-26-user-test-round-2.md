# User test round 2: findings and backlog

Date: 2026-11-26. Status: decided; implementation tracked in issues #161–#174.

## How this round was run

The users in this round were **simulated**, as in round 1
(`2026-11-26-user-test-round-1.md`): three tester agents played nine parent
personas against master at 827f19c, after PR #160.

- **Public pages** were exercised live in Chromium at 390px, plus 320px and
  200% text. The dev server ran with the E2E dummy Firebase config.
- **Gated pages** were assessed from source and tests.
- **Slow networks** were tested with CDP throttling at 400 kbps / 400 ms.
- **Accessibility** was checked with the accessibility tree and computed
  contrast.
- **Verification:** the PM checked the headline claims in source before cutting
  issues.
- **Real families:** a round with real families is still owed. It remains open
  question 7 of round 1.

| Persona | Situation | Score |
|---|---|---|
| 王阿嬤 (returning) | grandmother, opens the share link in LINE | 6/10 (was 4) |
| 李爸爸 (returning) | son born at 32 weeks, 7 months | 7/10 |
| 林小姐 (returning) | first pregnancy, week 20 | 7/10 |
| 阮氏芳 | Vietnamese new immigrant, reads Chinese slowly, baby 2 months | 6/10 |
| 陳先生 | low vision, screen reader, 200% text | 5/10 |
| 黃爸爸 | twins at 2 months, plus an older sibling | 6/10 |
| 蔡保母 | licensed home nanny, three babies from three families | 3/10 |
| 吳小姐 | 38, second pregnancy, high risk, week 26 | 6/10 |
| 阿明 | rural Hualien, slow and often offline network | 5/10 |

## What round 1 fixed, confirmed by the returning personas

- **Join from LINE:**
  - the sheet appears;
  - 用瀏覽器開啟 keeps the code across the jump;
  - the code and the LINE parameter are stripped on load.
- **Growth calculator with birth weeks:** a 32-weeker reads P11/P15/P29 instead
  of P2/P1/P5.
- **Corrected age on signed-in screens:** the milestones label, the clinic
  development section and the alerts all use it.
- **Pregnancy wording:**
  - the movement warning wording is fixed;
  - the checkup footnote follows the input;
  - the 現在可以做 split works.
- **New articles:** found by their search terms and reachable by deep link.
- **Regressions:** none observed from PR #160.

## Findings that became issues

| # | Finding | Evidence |
|---|---|---|
| #161 | The checkup calculator and the weekly guide give different weeks for the same due date (20 vs 21) | observed; `CheckupScheduleToolPage.tsx:53,87` vs `WeeklyGuideToolPage.tsx` |
| #162 | Signed in and offline, every page, public ones included, is replaced by the loading or "cannot connect" screen | `App.tsx:300,327-346` |
| #163 | The when-to-go-now article mentions waters breaking only "near the due date" | `wiki.ts:729` vs `wiki.ts:926` |
| #164 | Search misses 台 vs 臺, a missing space (4個月) and spelling variants (子癇/子癲) | observed: 台中 23 rooms vs 臺中 390 |
| #165 | Calculator results are not announced; the growth result renders below the fold with focus unchanged | observed |
| #166 | LittleBloom and LittleExplorer muted text is 3.7:1 and 3.2:1 | computed |
| #167 | A wiki card is one button wrapping its heading, so the titles vanish from heading navigation | accessibility tree |
| #168 | A full account greys out 新增寶寶 with the reason only in a `title`; join-by-code sits behind that same button | `AccountSheet.tsx:330-339` |
| #169 | The one-tap repeat toast does not say which child | `DailyLogPage.tsx:198` |
| #170 | At 200% text the AppBar title truncates to one character | observed |
| #171 | Sleep advice and bands use actual age for a preterm baby | `DashboardPage.tsx:85-89`, `SleepAnalysisPage.tsx` |
| #172 | In LINE the join intro still leads with Google sign-in; success reads like an error; a raw code is shown | observed + `JoinPage.tsx` |
| #173 | The new articles are not linked from where the question arises; the shared summary drops notes | `DailyLogPage.tsx`, `dailyLogShare.ts` |
| #174 | Offline chunk failure says "your records are fine, reload"; 公費 and 自費 are unexplained; 性狀 is jargon; map clusters have no noun | observed |

## Open questions

1. **Should joined records count toward the two-child limit?** A home nanny
   cannot take a third family today (`childLimits.ts`). #168 makes the limit
   visible but deliberately does not change it.
2. **Twins at birth registration.** Registration converts one pregnancy into one
   baby, so the second twin is added by hand. There is no issue yet.
3. **Offline map.** OSM tiles are never cached, so offline BabyOasis shows a
   grey map with a working list.
4. **Precache size.** It is about 780 kB gzipped, all-or-nothing, which is a
   long first install on a slow mountain connection.
5. **Caregiver disclosure.** A caregiver member can export and remove like any
   member. The join copy does not say so to the parents who invite a nanny.
