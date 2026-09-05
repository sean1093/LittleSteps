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
| NAV-01 | P1 | Deep-link directly to each of the nine public paths | Page boots on that route and the URL is unchanged after load. Oracle is `document.title`, set per-route at runtime by `useDocumentMeta` from `pageMeta.ts` — this is hydration, not the prerendered file, which is SEO-03's separate concern. Do **not** assert `SERVICE_THEME[id].name`: only LittleOuting, BabyOasis and LittleGuard pass it to their `AppBar`; the hub has no `AppBar`, the LittleSteps wikis get theirs from `App.tsx`'s `getPageTitle()`, and the two other wikis use their own shells |
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
| AUTH-02 | P0 | Signed out, on each gated route, assert absence of child data | Two-sided oracle, because "no child data" alone has no locator: (a) the service's intro heading **is** present, and (b) a fixed list of gated-content locators matches **zero** elements — the daily-log timeline rows, the growth chart `svg`, the vaccine dose controls, the milestone checkboxes |
| AUTH-03 | P0 | Signed out, visit every public route | The real page renders — not the intro page. Guards against the allowlist being narrowed by accident, which would hide the wikis from parents without accounts |
| AUTH-04 | P1 | The set of routes reachable signed-out equals the set where `requiresAuth` is false | Derived by importing `requiresAuth` and iterating `ROUTE_PATH`, not hard-coded: adding a route without classifying it fails this case. (`PUBLIC_PAGES` itself is module-private — import the function, not the constant) |

> AUTH-04 imports `requiresAuth` and iterates `ROUTE_PATH` rather than listing
> paths, per the plan's §6 rule against a second vocabulary. This works cleanly:
> `routePolicy.ts` and `types/routes.ts` use `import type` exclusively, so both
> compile to modules with zero runtime imports — no React, no CSS — and can be
> imported straight into a spec.

## GUARD — LittleGuard disease radar

Fully public, no Firebase, real data loaded at runtime. Covers plan §1 row 3.

> **The whole group fixes the clock**, not just the freshness cases. Trend
> status is gated on freshness (`freshnessOf(data.weekEnd)`, with `stale` at 14
> days and `expired` at 35), and `public/data/diseaseRadar.json` is refreshed by
> a *manual local* command — `refresh-disease-radar.yml` documents that
> `od.cdc.gov.tw` blocks GitHub-hosted runners. A suite that does not pin time
> goes red roughly five weeks after every refresh, for no product reason. Pin
> the clock relative to the fixture's own `weekEnd`.

| ID | Pri | Case | Expected |
|---|---|---|---|
| GUARD-01 | P0 | Board renders for the default county (台北市) and default age band, clock pinned inside the fresh window | Disease rows present with counts and trend indicators; no empty state |
| GUARD-02 | P0 | Fresh data | The week range matches the fixture; **no** freshness banner renders — the banner exists only for stale and expired |
| GUARD-03 | P0 | Stale data (clock >14 days past `weekEnd` — `freshnessOf` is strictly greater-than, so +14 exactly is still fresh) | The stale banner renders; rows still show status |
| GUARD-04 | P0 | Expired data (clock >35 days past `weekEnd`; +35 exactly is still stale) | The expired banner renders, row status is suppressed (`showStatus={false}`) and the board summary is hidden. This is the state real users hit most often given how the data is refreshed, and it is untested at any level today |
| GUARD-05 | P1 | Switch county via `CountyPicker` | Board reloads for the new county; `aria-pressed` moves to the chosen chip; the selection survives a reload |
| GUARD-06 | P1 | Switch age band | Rows change; the age label reflects the chosen band |
| GUARD-07 | P1 | Open a disease drawer from a row | Drawer opens with that disease's detail and closes back to the board |
| GUARD-08 | P0 | Radar data fails to load (route-blocked) | The "現在抓不到資料" empty state renders — never a blank board that reads as "no disease about" |
| GUARD-09 | P2 | County chip row at 320px | The row scrolls horizontally within its own container; the page body does not scroll horizontally |

## OASIS — BabyOasis nursing-room map

3,852 rows, a Leaflet map, and the access-label invariant that issue #38 was
about.

| ID | Pri | Case | Expected |
|---|---|---|---|
| OASIS-01 | P1 | Search by venue name, address and district | Results list appears with a count; the header states the cap when results exceed it |
| OASIS-02 | P0 | Access tag matches the report claim for the same room | For an internal venue **and** a staff-help venue, the list tag and the report sheet's 使用條件 agree. Labels imported from `ACCESS_LABEL`, never retyped. Walk-in is deliberately excluded — it has no list tag by design, and OASIS-03 owns it |
| OASIS-03 | P0 | A walk-in room shows no tag in the list but is named in the report | Absence asserted explicitly in the list — an unmarked row is the design's way of saying "just walk in" — while the sheet's 使用條件 reads `ACCESS_LABEL.open`, because a blank report field reads as "no data" |
| OASIS-04 | P1 | Category chips and 排除內部場所 filter | Start from a district filter so a list already exists — pressing 排除內部場所 from nothing is what *creates* the list, so there is no prior count to compare against. Then the count changes, `aria-pressed` reflects state, and pressing again clears it |
| OASIS-05 | P1 | Open a room's detail sheet and the report form | Sheet opens with address and facilities; the report button opens the form while signed out |
| OASIS-06 | P1 | Map container renders with tiles route-blocked | Leaflet mounts and markers/clusters are present; the blocked tiles are declared, not discovered as a timeout |
| OASIS-07 | P0 | `nursingRooms.json` fails to load (route-blocked) | `LoadState` goes to `failed` and the 哺乳室資料載入失敗 empty state renders with its 重新載入 action, while the AppBar subtitle switches to 資料載入失敗 — never an empty map that reads as "no nursing rooms near you". 1.1 MB, deliberately excluded from the PWA precache and fetched on first map visit, so this is the one dataset whose delivery depends on runtime caching |
| OASIS-08 | P2 | Long venue name beside a tag at 320px | Name truncates, tag keeps full width, tag's left edge is at or after the name's right edge |

## OUTING — LittleOuting venues

| ID | Pri | Case | Expected |
|---|---|---|---|
| OUTING-01 | P1 | Switch between 親子館 and 親子餐廳 views | Search `aria-label` and placeholder change with the view; results change |
| OUTING-02 | P1 | Search and clear | Results filter; the clear button restores the full list |
| OUTING-03 | P0 | Selecting a city chip on 親子館 renders that city's access panel | A city with verified 使用規則 shows them; a city without shows `CENTRE_ACCESS_UNVERIFIED` instead. Never verified-looking copy for a city nobody checked — this is public-service information a parent plans a trip around |
| OUTING-04 | P0 | `familyCentres.json` fails to load (route-blocked) | The 親子館資料載入失敗 empty state renders rather than an empty list that reads as "no venues near you" |
| OUTING-05 | P2 | Outing checklist renders | The 出發前 tab renders **every** item in `outingChecklist` with its question and its rationale. Two things not to assert: there are no toggles (`ChecklistItem` carries no state and the page renders static cards), and there is no per-venue filtering — the tab maps the list unfiltered and `appliesTo` is unused outside its own module |

## WIKI — the three knowledge bases

85 articles across three services, all public, all loaded from real data.

| ID | Pri | Case | Expected |
|---|---|---|---|
| WIKI-01 | P0 | Each of the three wikis lists articles | A non-empty list renders. An empty wiki is the "no data where there is data" failure |
| WIKI-02 | P1 | Expand and collapse an article | Sections render in place; collapsing restores the list; **the URL is unchanged throughout**. Articles are an accordion (`expandedId` state), not routes — do not assert a history entry or a back-button return |
| WIKI-03 | P1 | Wiki search or category filter narrows the list | Result set changes and an empty query restores it |
| WIKI-04 | P1 | Care guide and sleep guide render signed out | Both are on the allowlist; both must render real content |
| WIKI-05 | P1 | Cross-wiki search | Search in one wiki, follow a `CrossWikiResults` hit into another wiki, and land with the keyword pre-filled. `WikiBrowser` seeds its query from `queryFromLocation(window.location.search)` and `goTo(page, { search })` carries it, so this exercises the path parser, the query string and a lazy chunk in one navigation — none of which a component test touches |

## RWD — layout invariants

Per plan §7. These assert measurements, never images. Each runs at 390px and
320px.

| ID | Pri | Case | Expected |
|---|---|---|---|
| RWD-01 | P1 | No horizontal page scroll on every public route | `body.scrollWidth <= body.clientWidth`; deliberate scrollers exempted by asserting on their own container, selected by `data-testid` |
| RWD-02 | P1 | Tap targets on every public route | Every enabled control **the design system owns** — `button`, `input`, `[role=button]`, links styled as buttons — is ≥44px in its smaller dimension. Inline links in prose and Leaflet's attribution chrome are excluded by the plan's §7; including them yields only false positives |
| RWD-03 | P1 | An open modal's submit control is inside the viewport | Guards `max-h-[85vh] overflow-y-auto`, which exists so the submit button is reachable with the keyboard open |

## SEO — the crawl boundary over gated routes

**The largest untested blast radius in the repo.** `src/common/seo/` has no test
files at all. `pageMeta.ts` derives `noindex` and `INDEXABLE_PAGES` from
`requiresAuth` — fail-closed by construction, with a comment saying a
hand-written version would be fail-open — but the *artifacts* are emitted by a
`closeBundle` hook in `vite.config.ts` that nothing verifies. If that hook
silently no-ops, the site ships with no `robots.txt`, every gated child-health
route becomes crawlable, and nothing anywhere goes red.

This plan already builds and serves `dist/`, so the check is nearly free.

| ID | Pri | Case | Expected |
|---|---|---|---|
| SEO-01 | P0 | `GET /robots.txt` on the built app | Returns 200 and disallows every path where `requiresAuth` is true. Derived from `requiresAuth`, like AUTH-04 — not a hard-coded list. Note that `renderRobotsTxt` anchors the three service roots (`Disallow: /littlesteps$`), so assert containment per route rather than line-exact equality |
| SEO-02 | P0 | `GET /sitemap.xml` on the built app | Returns 200 and lists exactly `INDEXABLE_PAGES` — no gated route present, no public route missing |
| SEO-03 | P1 | Prerendered `<title>` and meta per route | The prerender hook emits one `index.html` per public page, but **`vite preview` serves the root `index.html` for every extensionless path**, so requesting `/littleouting` returns the *home* title. Request the directory-index form (`/littleouting/`) and say why: production serves the prerendered file because `firebase.json` sets `cleanUrls: true`. Asserts the served HTML before any JavaScript runs — a different mechanism from NAV-01 |

## PWA — shell and service worker

| ID | Pri | Case | Expected |
|---|---|---|---|
| PWA-01 | P1 | Manifest is served and parses | `manifest.webmanifest` returns 200 with a name, icons and a start URL |
| PWA-02 | P1 | Service worker registers on the built app | Registration resolves; no console error |
| PWA-03 | P2 | No uncaught console errors on any public route | Collected per route and asserted empty, with a declared allowlist naming **every** host the harness route-blocks: map tiles, `firebase.googleapis.com` and `*.google-analytics.com` (plan §5). An aborted route produces a console error, so a blocklist that outgrows this allowlist turns PWA-03 red for no product reason |

---

## Phase 2 — authenticated journeys (not yet scheduled)

Listed so the IDs are reserved and the shape is agreed. These need the Firebase
Auth and Database emulators (plan §5) and must not be started before Phase 1 is
green on `master`.

| ID | Pri | Case | Note |
|---|---|---|---|
| A-LOG-01 | P0 | Create a feeding log and see it in the timeline with the canonical labels | |
| A-LOG-02 | P0 | Repeat-last-log writes a new record without opening the form | |
| A-LOG-03 | P0 | Two members editing the same log | The concurrent-write behaviour issue #42 is about |
| A-CHILD-01 | P0 | Create a child, switch children, and confirm per-child data isolation | |
| A-CHILD-02 | P0 | Share code join and revoke, end to end against the emulator | |
| A-CHILD-03 | P0 | Delete a child and confirm the single root fan-out leaves nothing behind | |
| A-GROWTH-01 | P1 | Record a growth measurement and see it plotted | |
| A-VAX-01 | P1 | Toggle a vaccine dose and see the next-dose card update | |
| A-REPORT-01 | P1 | The report reflects logs written in the same session | |
| A-ISO-01 | P0 | Signed in as user B, deep-link to a `childId` belonging to user A | The gate renders, not the record. This is the sentence the risk model leads with — "a parent is shown another family's data" — and nothing else in the catalogue attempts it |
| A-ISO-02 | P0 | After revocation, a previously-shared child is gone from B's list on the next load | The revocable half of the share code, end to end |
| A-OFFLINE-01 | P1 | `context.setOffline(true)` on an authenticated route | The 連不上伺服器 empty state renders — after 10s, or immediately when `navigator.onLine` is false. The one failure mode a PWA has that a website does not: RTDB's `onValue` never calls back and the page would otherwise spin forever |

---

## Coverage of the plan's six gaps

| Plan §1 gap | Covered by |
|---|---|
| Routing and deep links | NAV-01…07, WIKI-05 |
| The auth gate | AUTH-01…04, SEO-01/02, Phase 2 (A-ISO-01/02) |
| Real data files | GUARD-01…04/08, OASIS-01/07, OUTING-03/04, WIKI-01 |
| Lazy chunks and the PWA | NAV-01, NAV-07, WIKI-05, PWA-01…03, SEO-03 |
| Layout at 390px and 320px | RWD-01…03, GUARD-09, OASIS-08 |
| Third-party rendering | OASIS-06 |

## Case count

Phase 1: **47** cases — NAV 7, AUTH 4, GUARD 9, OASIS 8, OUTING 5, WIKI 5,
RWD 3, SEO 3, PWA 3. Phase 2: **12** reserved IDs.
