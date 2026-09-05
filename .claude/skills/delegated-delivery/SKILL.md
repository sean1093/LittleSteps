---
name: delegated-delivery
description: Run a body of work through subagents with two gates on every pull request — a verification pass and a code review — merging only when both are green. Use when a task is large enough to split across several agents, when work is being delegated and the results have to be trusted, or when a plan needs breaking into issues that agents will implement unsupervised.
---

# Delegating work you will be held responsible for

The loop is: **plan → issues → implementers → PR → verify + review → merge**,
with fixes re-entering at "verify + review" until both are green.

That shape is easy. What makes it work is a handful of things this repo learned
by getting them wrong, each of which cost a cycle. They are the body of this
document; the loop itself is four lines.

`pr-self-merge` covers shipping one change you wrote yourself. This covers
shipping work other agents wrote, which fails differently.

---

## 1. Write the plan first, and have it reviewed as a document

Agents implement from the plan literally. A sentence that is wrong about the
codebase becomes a spec that cannot pass, and the agent will either invent the
missing feature or quietly weaken the test.

Two review rounds on one 500-line planning document found **eighteen** false
claims about this codebase — cases describing UI that does not exist, a default
branch named wrongly in the exit criteria, a group of tests that would have
gone red five weeks after every data refresh. Every one would have been paid
for by an implementer downstream.

So: before cutting a single issue, have a subagent verify the plan **against
the source**, with the instruction to check claims rather than read prose.

## 2. Review the fixes, not just the original

This is the one that surprises people.

After round one's twelve findings were fixed, round two — pointed at the
*corrections* — found that **five of the fixes had traded one wrong claim for
another**, plus a formatting defect that silently deleted the justification for
three cases from the rendered table.

A fix is new work. It gets the same scrutiny as the thing it replaces.

## 3. "Never been run" is not "verified"

A CI workflow that has not executed is a hypothesis. Say so in the PR body, and
treat its first run as part of the change rather than as a follow-up.

The harness PR here reasoned carefully about its workflow and was wrong: `vite
preview` binds the *hostname* `localhost`, and inside the CI container
`/etc/hosts` maps `::1 localhost`, so the server listened on IPv6 while the
test poller used the IPv4 literal. Three minutes of timeout, on a config that
passed on every developer machine.

Corollary: **local green and CI green are different facts.** Ask for both.

## 4. A passing test can be passing for the wrong reason

Green is not proof. Two examples from one afternoon:

- A load-failure test blocked a dataset with `page.route` and asserted the
  error state. It passed locally and failed in CI. The file was in the PWA
  precache, so once the service worker claimed the page the fetch never reached
  the network and the route handler was bypassed entirely — `routeHits=0`.
  Whether it passed was a race the CI container won consistently and a laptop
  usually lost.
- The sibling PR had the identical defect and was **green**. It was winning the
  same race. It would have flaked later, on someone else's unrelated PR.

A third, found by review rather than by CI: a layout test opened a modal and
asserted a button was on screen. The invariant it named was a `max-height` cap
that only binds when content overflows — and the modal it opened was half the
height of the cap. **Deleting the cap left the test green.**

When a test asserts a failure path or a guard, ask what would happen if the
thing it protects were deleted. Then make someone answer it with evidence:

> **Acceptance criterion for a guard test: delete the guard, watch it go red,
> put the guard back, and report what you saw.**

That turns "I believe this test works" into a fact. It caught the modal case
in both directions — removing the cap and removing the scroll produced two
different failure messages, which is also how you learn the test says
something useful when it fails.

A test that cannot fail is worse than a missing one, because nobody looks at
it again.

## 5. Verify what an agent tells you before you act on it

Agents report in good faith and are sometimes wrong about each other.

One agent reported that a sibling had committed a local workaround to a shared
config. Checking `git diff --name-only origin/master origin/<branch>` took ten
seconds and showed the sibling had touched only its own two files. Relaying
that unchecked would have sent someone to fix nothing.

The check cuts the other way just as often. Another agent reported that a
*sibling's already-green* test was passing only by winning a race. Two greps —
the build config and the generated service worker — confirmed it in under a
minute, and that PR was fixed before it landed instead of flaking on somebody
else's unrelated change weeks later. Verifying is cheap; both outcomes are
worth the minute.

The same applies to their successes. When an agent says twelve screenshots are
identical, recompute the hashes. When it says a command passed, look at the
output it pasted.

## 6. Tell implementers what NOT to build

The most valuable line in an issue is often a prohibition, because an agent
that needs a feature to exist will build it.

State plainly: *if you find yourself needing a feature to exist for a test to
pass, the test is wrong — report it, do not build the feature.* Then enumerate
the specific traps: this list has no toggles; that card has no detail view;
this assertion was deleted on purpose and must not be resurrected.

Also give them permission to disagree, and mean it. *"If you think a finding is
wrong, say so with evidence rather than complying"* produces better work than
obedience.

It gets used. Told to demote a redundant assertion to a cheaper check, one
agent deleted it instead and explained why: another spec already covered the
same button on the same component, so keeping a second copy would have been a
second vocabulary — the exact defect the surrounding work existed to remove.
That was a better answer than the instruction.

## 7. Isolate parallel agents, or they will collide

Two failure modes, both observed:

- **Shared working tree.** Four agents each running `git checkout -B` in one
  directory overwrite each other. Give every parallel agent its own git
  worktree.
- **A worktree isolates the directory, not the branch.** Two worktrees cannot
  have the same branch checked out, and if you check out an agent's branch in
  the main tree to resolve a conflict, its next `git checkout` is refused and
  your working files go stale the moment it pushes. Get off the shared branch
  as soon as you are done with it.
- **Shared ports.** The Playwright config hardcodes a preview port with
  `reuseExistingServer`, so concurrent suites fight over one server. The
  symptoms — `ERR_CONNECTION_REFUSED` mid-run, lazy chunks failing, the app
  rendering its error boundary — look exactly like product bugs. Warn every
  agent in advance what a collision looks like, or they will file one.

## 8. Do not let parallel agents edit shared files

Four branches all correcting the same document produces four conflicts and
three wasted efforts. Tell agents to **report** problems in shared surfaces
rather than fix them, and collect the corrections into one integration pass
after the branches land.

Check overlap before merging:

```bash
for b in <branches>; do echo "--- $b"; git diff --name-only origin/master origin/$b; done
```

Merge in dependency order and reconcile duplicated files deliberately, rather
than letting whichever lands second win.

## 9. Match the gate to the change

"Verify + review" is two gates, and the verification gate takes a different
shape depending on what changed:

| Change | What the verification gate should actually do |
|---|---|
| UI | Screenshots at 390px and 320px, **before and after**, from a `git worktree` of the base branch. Identical hashes are stronger evidence than prose. |
| Tests | Run the suite; confirm the tests fail when they should. A test-only PR has nothing to photograph. |
| Docs | No verification gate. Say so rather than inventing one. |
| Config / CI | The first real run **is** the gate. |

Do not perform a ritual that produces no evidence. Screenshotting a
documentation change wastes a cycle and teaches the next agent that the gate is
theatre.

## 10. Deleting a case is a legitimate outcome

One layout assertion in the plan failed on `master` on the day it was written,
and its oracle would have flagged deliberate markup as violations. The right
answer was to delete it and file the underlying inversion as a product issue —
not to weaken it until it passed, and not to keep it as a known-failing test
the flake policy forbids skipping.

If a case is wrong, say so and remove it. Narrowing a test until it passes is
the one thing this repo's conventions explicitly call incorrect.

---

## Running the loop

**Plan.** Write it. Have a subagent verify it against the source. Fix. Have a
subagent verify the fixes (§2). Land it.

**Issues.** One per coherent area, sized so one agent can finish it. Put the
traps in the issue text (§6) — the prohibitions, the load-bearing details, the
things earlier rounds got wrong. Mark what blocks what; land the foundational
issue alone before fanning out.

**Implementers.** One agent per issue, each in its own worktree (§7). Tell them
to commit and push but **not** to open the PR — you open it, because you are
the one accountable for what the PR claims. Require the real output of every
command they ran.

**Gates.** Open the PR, then run verification and review in parallel. Post both
to the PR, including the findings you are about to fix — a review that only
ever says "looks good" is not a review.

**Fix and re-gate.** Send findings back to the implementer that has the
context, not to a fresh agent. Re-run the gates on the fix (§2). Repeat until
green.

**Merge.** Only when CI is green on the actual head, the review has no
unresolved findings, and the verification gate passed. Then confirm the linked
issues actually closed.

## What to write in the PR

The findings, the corrections, and **what remains unverified**. A PR body that
says "the CI workflow in this change has never executed; this run is its first"
is worth more than one that reads clean, because it tells the reviewer where to
look. Every significant problem in this project's rollout was found by someone
following exactly such a sentence.
