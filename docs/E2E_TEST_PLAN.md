# End-to-end test plan

Owner: QA · Status: adopted · Applies to: `main` and every pull request

This plan covers browser-level end-to-end (E2E) testing with Playwright. It
says what E2E is *for* in this repository, what it must not duplicate, how the
environment is stood up, and how a test earns its place in the suite.

`docs/E2E_TEST_CASES.md` holds the case catalogue. This document holds the
reasoning; that one holds the work.

---

## 1. Why E2E, given 1,684 unit tests already pass

The existing Vitest suite is good and it is not the thing that is missing. It
renders components in happy-dom with fabricated props and asserts behaviour.
What it structurally cannot see:

| Gap | Why only a browser catches it |
|---|---|
| **Routing and deep links** | `ROUTE_PATH` is typed, but nothing proves that typing `/littlesteps/daily-log` into the address bar boots the app on that page. Component tests mount a page directly; they never exercise the path parser, the lazy chunk, or the history API. |
| **The auth gate** | `routePolicy.ts` is a public allowlist, and this app stores children's health data. A unit test asserts the predicate. Only a browser proves that a signed-out visitor at a gated URL sees the intro page **and no child data**, at the same URL, with no redirect. |
| **Real data files** | The wikis, the venue registers, the nursing-room dataset and the disease radar load real JSON/TS data at runtime — 3,852 nursing rooms, 85 wiki articles. A malformed or missing data file passes typecheck and breaks the page. |
| **Lazy chunks and the PWA** | `App.tsx` lazy-loads every page. A broken dynamic import, a stale service worker precache or a bad manifest is invisible until a real navigation happens. |
| **Layout at 390px and 320px** | `.claude/CLAUDE.md` requires every change to be checked at 390px, and at 320px for anything in a grid. happy-dom has no layout engine: it cannot tell you that a chip row overflows or that a tag wraps. |
| **Third-party rendering** | Leaflet draws the BabyOasis map imperatively into a real DOM with real sizing. There is no meaningful jsdom assertion about it. |

E2E exists for exactly those six. **A behaviour that a unit test can assert
belongs in a unit test** — E2E is an order of magnitude slower and flakier per
assertion, so every case in the catalogue must justify itself against this
table.

## 2. What E2E must not become

- **Not a second unit suite.** No E2E case may assert a pure function's output,
  a label string in isolation, or a component's internal state. If a case can
  be written against `logHelpers` or a single component, write it there.
- **Not a screenshot-diff wall.** Pixel baselines on a Tailwind app churn on
  every token change and train people to accept diffs. Layout is asserted with
  *measurements and invariants* (see §7), not with golden images. Screenshots
  are captured as **evidence for humans**, never as an oracle.
- **Not a coverage target.** There is no E2E coverage percentage. The suite is
  sized by risk (§3), and a case is deleted when the risk it covers is gone.

## 3. Risk model — what decides priority

Priority is assigned by *how badly a silent failure hurts a parent*, not by how
much code a test touches.

| Priority | Meaning | Examples |
|---|---|---|
| **P0** | A parent is shown another family's data, no data where there is data, or wrong medical information — and nothing throws. | Auth gate leaking a gated page; the disease radar showing stale or wrong counts; a wiki article failing to load. |
| **P1** | A core journey is unreachable or unusable on a phone. | Deep link 404s; BabyOasis search returns nothing; a control is unreachable at 320px; a modal's submit button sits under the keyboard. |
| **P2** | Cosmetic or convenience degradation with an obvious workaround. | A chip row scrolls where it used to fit; a tag wraps to a second line. |

P0 cases run on every pull request and block merge. P1 runs on every pull
request. P2 runs on `main` and nightly.

## 4. Tooling and constraints

- **Playwright** (`@playwright/test`), pinned to an exact version. It is the
  only browser-automation dependency; no Cypress, no Selenium, no second
  runner.
- **Chromium only, to begin with.** Cross-browser is deferred until the suite
  is stable and green; adding WebKit/Firefox before then multiplies flake
  investigation for a mobile-first PWA whose audience is overwhelmingly mobile
  Chrome and Safari. WebKit is the first addition when we do expand, because
  iOS Safari is the single most-used engine we do not currently test.
- **Browsers are not downloaded in CI or in agent sandboxes.** Chromium is
  pre-installed at `/opt/pw-browsers`. Respect `PLAYWRIGHT_BROWSERS_PATH` and
  `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`; never run `playwright install` in a
  script or a workflow.
- **Test against the production build**, not the dev server: `vite build` then
  `vite preview`. The dev server does not exercise the lazy-chunk split, the
  PWA service worker or minification, and three of the six gaps in §1 live
  precisely there. `webServer` in the Playwright config owns start-up and
  teardown.

## 5. Environment and the auth decision

The app calls `initializeApp()` at module load with `VITE_FIREBASE_*` values.
With those unset it throws `auth/invalid-api-key` and renders a blank page — so
**there is no such thing as running this app with no Firebase configuration at
all.** Every E2E environment must supply values.

We adopt a **two-phase** strategy.

### Phase 1 — public routes, dummy credentials (no production code changes)

`routePolicy.ts` makes eight pages public: the hub, the three wikis, the care
guide, the sleep guide, LittleOuting, BabyOasis and LittleGuard. None of them
reads a child's record, so dummy `VITE_FIREBASE_*` values are enough to get the
app to boot; nothing ever authenticates and no network call reaches Google.

This buys the whole of §1 except the authenticated half of the auth gate, and
it costs **zero changes to `src/`** — an important property for the first
Playwright PRs, which should be judged on the harness, not on a change to
production initialisation.

Phase 1 still covers the *signed-out* half of the gate, which is the P0 half:
a gated URL must show the intro page and no child data.

### Phase 2 — Firebase emulators (authenticated journeys)

The authenticated core — daily log, growth charts, vaccine tracking, milestones,
the report — is where this product's value and its risk both live, and Phase 1
cannot reach it. Phase 2 connects the app to the **Auth and Database
emulators**, which this repository already depends on: `npm run test:rules`
runs `firebase emulators:exec --only database` against the real rules today.

This requires one env-gated hook in `src/lib/firebase.ts`
(`VITE_USE_FIREBASE_EMULATOR`) that calls `connectAuthEmulator` and
`connectDatabaseEmulator`. That is a production-code change and must be
reviewed as one: it has to be impossible to enable in a deployed build, and the
gate belongs in a single place with a comment saying why.

Phase 2 is **not** in the initial issue breakdown. It is opened once Phase 1 is
green on `main`, so that an emulator problem is never confused with a harness
problem.

### Never

- No real Firebase project, ever, from a test.
- No real Google sign-in. Phase 2 mints tokens against the Auth emulator.
- No test writes to `database.rules.json` behaviour — that is `test:rules`'
  job, and it already does it better, against the real rules engine.

## 6. Selector policy

In priority order:

1. **Role + accessible name** — `getByRole('button', { name: '排除內部場所' })`.
   This is the default and should cover most cases. It asserts accessibility
   and behaviour at once.
2. **Label, placeholder or text** for content assertions.
3. **`data-testid`** only where no accessible name can exist (a Leaflet layer,
   a decorative container). Adding one is a change to `src/` and needs a
   comment saying why a role was not usable.

Forbidden: CSS class selectors, Tailwind utilities, `nth-child`, and XPath.
`.card`, `.chip` and `.tag` are design-system tokens that get restyled; a test
bound to them fails on a refactor that changed nothing a parent can see.

**Product copy is Traditional Chinese and tests assert it directly.** Where a
string has a canonical source (`ACCESS_LABEL`, `getDiaperTypeLabel`,
`CATEGORY_LABEL`), import it rather than retyping it — a test that hard-codes a
label it does not own becomes a second vocabulary, which is the exact defect
issues #48 and #38 were opened about.

## 7. Layout assertions without pixel baselines

`.claude/CLAUDE.md` mandates 390px, and 320px for anything in a grid. The suite
encodes that as two viewport projects and asserts *invariants*, not images:

- **No horizontal overflow of the page body:** `scrollWidth <= clientWidth` on
  `body` at both widths. Intentionally scrolling rows (`.row-bleed`) are
  asserted on their own container instead.
- **Tap targets:** every enabled control matched by the case is at least 44px
  in its smaller dimension.
- **No visual overlap** between a truncating name and the tag beside it: the
  tag's left edge is at or after the name's right edge.
- **Modal reachability:** the submit control of an open modal is inside the
  viewport.

These hold across restyling and fail loudly on the things that actually break.

## 8. Determinism

- **No `waitForTimeout`.** Wait on a role, a URL, or a response. A sleep in a
  test is a bug report about a missing signal.
- **Fix time** for anything date-dependent (the radar's week ranges, "today" in
  the daily log, age calculations) with `page.clock` or an injected date.
  A suite that fails on the first of the month is not a suite.
- **Third-party network is blocked, deliberately.** OpenStreetMap tiles do not
  load in CI or in agent sandboxes. Tests route-block tile requests explicitly
  so the failure mode is *declared* rather than discovered as a timeout; the
  map's own markers and overlays are still asserted.
- **Flake policy is CLAUDE.md's policy**: a failing test is never skipped,
  disabled, quarantined, or retried into passing. `retries: 0` locally.
  CI allows one retry solely to *label* a flake in the report; a test that
  needs it is fixed or deleted in the same week, not left annotated.

## 9. Layout of the suite

```
e2e/
├── fixtures/       shared test fixtures, viewport projects, clock helpers
├── pages/          page objects — one per route under test
├── specs/          the cases, named after the catalogue IDs they cover
└── README.md       how to run it, and how to add a case
playwright.config.ts
```

Page objects hold *selectors and navigation only*. Assertions live in specs, so
a reader can see what is being claimed without following a second file.

## 10. Scripts and CI

```bash
npm run test:e2e              # headless, both viewports
npm run test:e2e -- --ui      # local debugging
npm run test:e2e:p0           # the merge-blocking subset
```

CI runs the P0+P1 subset on every pull request as a separate job from the unit
suite, so a browser failure is never mistaken for a logic failure. On failure
the job uploads the Playwright HTML report, traces and screenshots as
artifacts. The job does not download browsers (§4).

## 11. Exit criteria for Phase 1

1. Every P0 case in the catalogue is implemented and green on three consecutive
   `main` runs.
2. The suite completes in under five minutes on CI.
3. Zero skipped, `fixme`, or conditionally-disabled tests.
4. `e2e/README.md` tells a new contributor how to run it and how to add a case.

## 12. Maintenance

- A test that fails for a real product change is **updated in the same PR** as
  that change, never after it.
- A case whose risk no longer exists is **deleted**, not left passing. Deleting
  a test that asserts deleted behaviour is correct; narrowing a test to make it
  pass is not.
- The catalogue and the specs share IDs. A spec without a catalogue entry, or
  an entry with no spec, is a defect in the suite.

## 13. Out of scope

Performance budgets and Lighthouse; visual regression baselines; accessibility
auditing beyond the role-based selectors the suite already forces;
cross-browser beyond Chromium (§4); load testing; anything touching a real
Firebase project or the real CDC endpoint.
