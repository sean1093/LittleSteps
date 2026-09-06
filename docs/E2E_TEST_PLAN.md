# End-to-end test plan

Owner: QA · Status: adopted · Applies to: `master` and every pull request

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
request. P2 runs on every push to `master` (§10). There is no nightly workflow,
and none is needed while the whole suite finishes in minutes.

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
- **One way `vite preview` is not production.** The build prerenders one
  `index.html` per public page, but `preview` serves the *root* `index.html`
  for any extensionless path, so `/littleouting` returns the home page's
  prerendered `<title>` while `/littleouting/` returns the right one. In
  production `firebase.json` sets `cleanUrls: true` and the correct file is
  served either way. Only SEO-03 can see the difference — every other case
  asserts what the browser shows after hydration — but it must request the
  directory-index form and say why, or it fails at exactly the canonical URLs
  `renderSitemap` emits.

## 5. Environment and the auth decision

The app calls `initializeApp()` at module load with `VITE_FIREBASE_*` values.
With those unset it throws `auth/invalid-api-key` and renders a blank page — so
**there is no such thing as running this app with no Firebase configuration at
all.** Every E2E environment must supply values.

We adopt a **two-phase** strategy.

### Phase 1 — public routes, dummy credentials (no production code changes)

`routePolicy.ts` makes ten pages public: the hub, the about page, the three
wikis, the care guide, the sleep guide, LittleOuting, BabyOasis and LittleGuard. None of them
reads a child's record, so dummy `VITE_FIREBASE_*` values are enough to get the
app to boot and **no child's record is ever requested**: both `useUserChildren`
and `useFirebaseCollection` early-return on a null user, so no database listener
ever attaches.

Two calls do still leave for Google, and both must be handled explicitly rather
than discovered as a console error.

**Analytics.** `App.tsx` calls `logPageView()` on every in-app navigation, which
dynamically imports `firebase/analytics` and fetches a web config from
`firebase.googleapis.com`. With dummy credentials that request fails and retries
with backoff, producing console errors — which is precisely what PWA-03 asserts
against.

**The sign-in iframe.** `getAuth()` runs at module load on every route, and
`AuthImpl._initializeWithPersistence` then initialises the popup/redirect
resolver up front whenever `_shouldInitProactively` — `_isMobileBrowser() ||
_isSafari() || _isIOS()` — is true, which it is for the `Pixel 5` UA the suite
runs. That loads `apis.google.com/js/api.js`. It is not `getRedirectResult()`:
with no redirect pending that resolves `null` without touching the network.

The harness therefore route-blocks `firebase.googleapis.com`,
`*.google-analytics.com` and `apis.google.com` the same way, and for the same
reason, that it blocks map tiles (§8): declare the boundary rather than
discover it as a timeout.

Two things whoever supplies the dummy values needs to know: the SDK rejects an
`apiKey` containing `:`, and `VITE_FIREBASE_DATABASE_URL` must be set or
`getDatabase()` throws. Note that `firebase-hosting-pull-request.yml` omits that
variable — an E2E job copy-pasted from it renders a blank page.

This buys the whole of §1 except the authenticated half of the auth gate, and
it needs **no change to production initialisation** — an important property for
the first Playwright PRs, which should be judged on the harness, not on a change
to how the app boots.

It does need a small, enumerated set of `data-testid` attributes, under the §6
rule-3 exception: the Leaflet map container and its cluster layer (built
imperatively by `react-leaflet-cluster`, with no accessible name to select by)
and the deliberately-scrolling `.row-bleed` chip rows. That list is fixed in the
harness PR and does not grow without a reason written in the diff.

Phase 1 still covers the *signed-out* half of the gate, which is the P0 half:
a gated URL must show the intro page and no child data.

### Phase 2 — Firebase emulators (authenticated journeys)

The authenticated core — daily log, growth charts, vaccine tracking, milestones,
the report — is where this product's value and its risk both live, and Phase 1
cannot reach it. Phase 2 connects the app to the **Auth and Database
emulators**. Only the Database emulator exists today: `firebase.json` declares a
`database` emulator on port 9000 and nothing else, and `npm run test:rules` runs
`emulators:exec --only database`. Phase 2 must therefore *add* an `auth`
emulator block to `firebase.json` and a second `--only` target — this is setup
work, not reuse.

This requires one env-gated hook in `src/lib/firebase.ts`
(`VITE_USE_FIREBASE_EMULATOR`) that calls `connectAuthEmulator` and
`connectDatabaseEmulator`. That is a production-code change and must be
reviewed as one: it has to be impossible to enable in a deployed build, and the
gate belongs in a single place with a comment saying why.

Phase 2 is **not** in the initial issue breakdown. It is opened once Phase 1 is
green on `master`, so that an emulator problem is never confused with a harness
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
bound to them fails on a refactor that changed nothing a parent can see. That
includes `.row-bleed`: where §7 needs to assert on a deliberately-scrolling row,
it selects the enumerated `data-testid` from §5, not the class.

**Product copy is Traditional Chinese and tests assert it directly.** Where a
string has a canonical source (`ACCESS_LABEL`, `getDiaperTypeLabel`,
`CATEGORY_LABEL`), import it rather than retyping it — a test that hard-codes a
label it does not own becomes a second vocabulary, which is the exact defect
issues #48 and #38 were opened about.

## 7. Layout assertions without pixel baselines

`.claude/CLAUDE.md` mandates 390px, and 320px for anything in a grid. The suite
encodes that as two viewport projects and asserts *invariants*, not images:

- **No horizontal overflow of the page body:** `scrollWidth <= clientWidth` on
  `body` at both widths. Intentionally scrolling rows are asserted on their own
  container instead, selected by the `data-testid` §5 enumerates: that the row
  is a scroll container and is no wider than the viewport. Not that it
  overflows — whether three chips fit at 320px is a property of the content on
  the day, and asserting it fails a row that is behaving.
- **Tap targets:** every enabled control **the design system owns** —
  `button`, `input`, `[role=button]`, and links styled as buttons — is at least
  44px in its smaller dimension. Inline links inside prose (the 疾管署 citation,
  a `tel:` link) are excluded, and so is **everything Leaflet draws**, not only
  its attribution: Leaflet marks its interactive markers `role="button"`, so on
  BabyOasis the 32px and 40px icons of a 3,852-room map are otherwise the
  entire output of this assertion. The exclusion is `.leaflet-container`, and
  its residual risk is that an app-owned control placed inside a Leaflet popup
  would escape the size check silently; nothing does that today. What is left
  is compliant by construction: `.chip`, `.btn-primary`, `.btn-secondary` and
  `.btn-ghost` all carry `min-h-tap`, and `.btn-icon` is `w-tap h-tap`.

  This assertion is also the **one carve-out from §6's ban on class
  selectors**: `a.btn-primary` and its siblings are how the scope "links styled
  as buttons" is expressed, because nothing else distinguishes such a link from
  one inside a paragraph. Know the failure mode — renaming the token makes the
  check quietly stop covering those links rather than fail — so a rename
  updates the helper in the same commit.
- **No content spill out of a non-wrapping box:** for every element that
  cannot wrap and does not clip or scroll, the content is drawn inside the
  element's own padding box. This is the per-element half of the first
  assertion, and it is not redundant with it: a flex item's `min-width: auto`
  floors it at its min-content width, so an over-wide `nowrap` row normally
  widens the page and the body check fires — but a row that overrides that
  floor with an explicit `min-width` squeezes a chip below its own text
  instead, and because `.chip` is `nowrap` with `overflow: visible` the label
  spills over its neighbours inside a row that still fits. That is issue #52's
  defect, shipped in PR #40: the body never widened and every chip was exactly
  44px, so both of the assertions above stayed green while three pills read as
  one illegible run at 320px.

  Measured with a `Range` over the element's contents rather than with
  `scrollWidth`. `scrollWidth` reports the *scrolling* area, which for a
  left-to-right box includes overflow past the right edge and excludes overflow
  past the left, so it sees only half the class; the comparison is restricted
  to elements whose content is entirely inline, because a `Range` around block
  children measures their margin boxes rather than the text.

  The candidate set is derived from the hazard — cannot wrap, does not clip —
  and not from a list of classes, so it covers a recipe nobody has written yet.
  An ellipsising row is excluded by construction, since `text-overflow` needs
  `overflow: hidden` and truncation is a decision rather than an accident.
- **No visual overlap** between a truncating name and the tag beside it: the
  tag's left edge is at or after the name's right edge.
- **Modal reachability:** the submit control of an open modal is inside the
  viewport.

These hold across restyling and fail loudly on the things that actually break.

**On CLAUDE.md's "do not test styling".** That rule exists to stop tests
asserting class names and colour tokens, which is exactly what §6 forbids. The
RWD and PWA groups assert *measured consequences* a parent experiences — a page
that scrolls sideways, a button under the fold, a control too small to hit —
which no restyle changes unless it genuinely broke something. A future reviewer
will raise the tension; this paragraph is the answer.

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
- **Flake policy — this plan's own rule.** A failing test is never skipped,
  disabled, quarantined, or retried into passing. `retries: 0` everywhere,
  including CI: a retry that turns a job green *is* retrying into passing, and
  a suite that does it stops being a signal. Flake detection, if we want it,
  belongs in a separate non-blocking job using `--repeat-each`. (CLAUDE.md's
  test rules say not to narrow a test to make it pass; the skip/quarantine/retry
  prohibition is ours, stated here rather than borrowed.)

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

Priority is encoded as a **`@p0` / `@p1` / `@p2` tag in the test title** and
selected with `--grep`. Name the mechanism here so that specs do not each invent
one.

`.github/workflows/ci.yml` runs two jobs. **`lint-and-unit` runs
`npm run lint` and the unit suite**; the E2E job `needs:` it, so a browser
failure is never mistaken for a logic failure. That ordering was the reason the
lint and unit job had to exist at all — before it, nothing ran either on a
pull request, and a Playwright job alone would have made the browser suite this
repo's first CI signal.

On a pull request the E2E job runs the merge-blocking `@p0|@p1` subset. **On a
push to `master` it runs everything, `@p2` included** — a case that runs
nowhere is a case nobody maintains, and this is where the plan's "P2 runs on
`master`" actually happens.

On failure the job uploads the Playwright HTML report, traces and screenshots
as artifacts. It does not download browsers (§4).

## 11. Exit criteria for Phase 1

1. Every P0 case in the catalogue is implemented and green on three consecutive
   `master` runs.
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
