# E2E test case catalogue

Companion to `docs/E2E_TEST_PLAN.md`. That document says why these cases exist
and what may not be written; this one is the work list.

**IDs are stable and permanent.** A spec file names the IDs it covers, and
every ID here must have a spec once its phase lands. Renumbering breaks that
link — retire an ID rather than reusing it.

Priorities are assigned by the risk model in §3 of the plan: **P0** = a parent
is shown wrong, missing, or someone else's data with nothing throwing; **P1** =
a core journey is unreachable or unusable on a phone; **P2** = cosmetic.

Traditional Chinese appears in this English document only where a string is the
literal UI copy a test must match — a button's accessible name, an empty
state's title, a default value. Translating those would describe a selector
that does not exist. Everything else here is English, per
`.claude/skills/english-writing`.

Unless a case says otherwise, every case runs at **390px** and **320px**, and
"signed out" is the only state available in Phase 1.

---

## NAV — routing, deep links, lazy chunks

Covers plan §1 rows 1 and 4. Nothing here can be a unit test: they all need the
address bar and the real chunk loader.

| ID | Pri | Case | Expected |
|---|---|---|---|
| NAV-01 | P1 | Deep-link directly to each of the eight public paths | Page boots on that route, its `AppBar` title matches `SERVICE_THEME[id].name`, and the URL is unchanged after load |
| NAV-02 | P1 | Deep-link to a gated path (`/littlesteps/daily-log`) while signed out | See AUTH-01; asserted here only for "the URL does not change" |
| NAV-03 | P1 | Navigate to an unknown path (`/nope`, `/littlesteps/nope`) | The hub landing renders; no blank page, no thrown error in the console |
| NAV-04 | P1 | Legacy hash link (`/#/littleexplorer/wiki`) | `redirectLegacyHash()` lands on the path route, and the hash is gone from the URL |
| NAV-05 | P1 | From the hub, open each of the six services and return via "所有服務" | Each round trip ends back on the hub with all six services listed |
| NAV-06 | P0 | Browser back/forward across three routes | History restores the right page each step — a SPA that only pushes state strands a parent on the browser's back button |
| NAV-07 | P2 | Reload on a deep route | Same page re-renders; the `vite preview` rewrite serves `index.html` rather than a 404 |

## AUTH — the public allowlist

Covers plan §1 row 2. **The highest-value group in Phase 1**: this is child
health data, and `routePolicy.ts` is deliberately a fail-closed allowlist.

| ID | Pri | Case | Expected |
|---|---|---|---|
| AUTH-01 | P0 | Signed out, visit every gated route in `ROUTE_PATH` | That service's intro page renders **at the same URL** — no redirect, no history entry — and the page shows a sign-in path |
| AUTH-02 | P0 | Signed out, on each gated route, assert absence of child data | No child name, no log row, no growth figure, no vaccine checkbox is present in the DOM. Absence is the assertion; a blank region is not enough |
| AUTH-03 | P0 | Signed out, visit every public route | The real page renders — not the intro page. Guards against the allowlist being narrowed by accident, which would hide the wikis from parents without accounts |
| AUTH-04 | P1 | The set of routes reachable signed-out equals `PUBLIC_PAGES` | Derived from `routePolicy`, not hard-coded: adding a route without classifying it fails this case |

> AUTH-04 imports `requiresAuth` and iterates `ROUTE_PATH` rather than listing
> paths, per the plan's §6 rule against a second vocabulary.

## GUARD — LittleGuard disease radar

Fully public, no Firebase, real data loaded at runtime. Covers plan §1 row 3.

| ID | Pri | Case | Expected |
|---|---|---|---|
| GUARD-01 | P0 | Board renders for the default county (台北市) with the default age band | Disease rows are present with counts and trend indicators; no empty state |
| GUARD-02 | P0 | Data freshness is stated, with the clock fixed | The week range and freshness wording match the fixed date. A radar quietly showing last month's outbreak is the P0 failure this group exists for |
| GUARD-03 | P1 | Switch county via `CountyPicker` | Board reloads for the new county; `aria-pressed` moves to the chosen chip; the selection survives a reload |
| GUARD-04 | P1 | Switch age band | Rows change; the age label reflects the chosen band |
| GUARD-05 | P1 | Open a disease drawer from a row | Drawer opens with that disease's detail and closes back to the board |
| GUARD-06 | P0 | Radar data fails to load (route-blocked) | The "現在抓不到資料" empty state renders — never a blank board that reads as "no disease about" |
| GUARD-07 | P2 | County chip row at 320px | Row scrolls horizontally within `.row-bleed`; page body does not scroll horizontally |

## OASIS — BabyOasis nursing-room map

3,852 rows, a Leaflet map, and the access-label invariant that issue #38 was
about.

| ID | Pri | Case | Expected |
|---|---|---|---|
| OASIS-01 | P1 | Search by venue name, address and district | Results list appears with a count; the header states the cap when results exceed it |
| OASIS-02 | P0 | Access tag matches the report claim for the same room | For an internal venue, a staff-help venue and a walk-in venue, the list tag and the report sheet's 使用條件 agree. Labels imported from `ACCESS_LABEL`, never retyped |
| OASIS-03 | P1 | A walk-in room shows no tag | Absence asserted explicitly — an unmarked row is the design's way of saying "just walk in" |
| OASIS-04 | P1 | Category chips and 排除內部場所 filter | Result count changes; `aria-pressed` reflects state; pressing again clears it |
| OASIS-05 | P1 | Open a room's detail sheet and the report form | Sheet opens with address and facilities; the report button opens the form while signed out |
| OASIS-06 | P1 | Map container renders with tiles route-blocked | Leaflet mounts and markers/clusters are present; the blocked tiles are declared, not discovered as a timeout |
| OASIS-07 | P2 | Long venue name beside a tag at 320px | Name truncates, tag keeps full width, tag's left edge is at or after the name's right edge |

## OUTING — LittleOuting venues

| ID | Pri | Case | Expected |
|---|---|---|---|
| OUTING-01 | P1 | Switch between 親子館 and 親子餐廳 views | Search `aria-label` and placeholder change with the view; results change |
| OUTING-02 | P1 | Search and clear | Results filter; the clear button restores the full list |
| OUTING-03 | P1 | Venue card opens its detail | Detail renders the venue's access and tag information |
| OUTING-04 | P2 | Outing checklist renders and toggles | Items toggle and the state is visible |

## WIKI — the three knowledge bases

85 articles across three services, all public, all loaded from real data.

| ID | Pri | Case | Expected |
|---|---|---|---|
| WIKI-01 | P0 | Each of the three wikis lists articles | A non-empty list renders. An empty wiki is the "no data where there is data" failure |
| WIKI-02 | P1 | Open an article and return to the list | Article body renders with its sections; back returns to the list with the browser's back button |
| WIKI-03 | P1 | Wiki search or category filter narrows the list | Result set changes and an empty query restores it |
| WIKI-04 | P1 | Care guide and sleep guide render signed out | Both are on the allowlist; both must render real content |

## RWD — layout invariants

Per plan §7. These assert measurements, never images. Each runs at 390px and
320px.

| ID | Pri | Case | Expected |
|---|---|---|---|
| RWD-01 | P1 | No horizontal page scroll on every public route | `body.scrollWidth <= body.clientWidth`; deliberate `.row-bleed` scrollers exempted by asserting on their own container |
| RWD-02 | P1 | Tap targets on every public route | Every enabled control is ≥44px in its smaller dimension |
| RWD-03 | P1 | An open modal's submit control is inside the viewport | Guards `max-h-[85vh] overflow-y-auto`, which exists so the submit button is reachable with the keyboard open |
| RWD-04 | P2 | Headings do not invert in size | No heading is visually smaller than one nested beneath it |

## PWA — shell and service worker

| ID | Pri | Case | Expected |
|---|---|---|---|
| PWA-01 | P1 | Manifest is served and parses | `manifest.webmanifest` returns 200 with a name, icons and a start URL |
| PWA-02 | P1 | Service worker registers on the built app | Registration resolves; no console error |
| PWA-03 | P2 | No uncaught console errors on any public route | Collected per route and asserted empty, with a declared allowlist for the blocked tile requests |

---

## Phase 2 — authenticated journeys (not yet scheduled)

Listed so the IDs are reserved and the shape is agreed. These need the Firebase
Auth and Database emulators (plan §5) and must not be started before Phase 1 is
green on `main`.

| ID | Pri | Case |
|---|---|---|
| A-LOG-01 | P0 | Create a feeding log and see it in the timeline with the canonical labels |
| A-LOG-02 | P0 | Repeat-last-log writes a new record without opening the form |
| A-LOG-03 | P0 | Two members editing the same log — the concurrent-write behaviour issue #42 is about |
| A-CHILD-01 | P0 | Create a child, switch children, and confirm per-child data isolation |
| A-CHILD-02 | P0 | Share code join and revoke, end to end against the emulator |
| A-CHILD-03 | P0 | Delete a child and confirm the single root fan-out leaves nothing behind |
| A-GROWTH-01 | P1 | Record a growth measurement and see it plotted |
| A-VAX-01 | P1 | Toggle a vaccine dose and see the next-dose card update |
| A-REPORT-01 | P1 | The report reflects logs written in the same session |

---

## Coverage of the plan's six gaps

| Plan §1 gap | Covered by |
|---|---|
| Routing and deep links | NAV-01…07 |
| The auth gate | AUTH-01…04, Phase 2 |
| Real data files | GUARD-01/06, OASIS-01, WIKI-01 |
| Lazy chunks and the PWA | NAV-01, NAV-07, PWA-01…03 |
| Layout at 390px and 320px | RWD-01…04, GUARD-07, OASIS-07 |
| Third-party rendering | OASIS-06 |
