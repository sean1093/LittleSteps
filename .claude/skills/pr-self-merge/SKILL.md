---
name: pr-self-merge
description: Ship a finished change through a pull request — branch, push, open the PR with gh, post a written self-review, fix everything it finds, then merge the PR yourself without waiting for a human. Use whenever work is complete and ready to land on master.
---

# Open a PR, review your own diff, fix it, merge it

There is one reviewer on this repo and it is you. The PR is not a request for
permission — it is the place where the review is written down, and where CI
builds a preview before the change reaches parents. Do the review honestly and
then merge; do not park a finished PR waiting for a human.

**Merging is deploying.** `firebase-hosting-merge.yml` fires on every push to
`master`: it builds, deploys to the live Firebase Hosting channel and deploys
`database.rules.json`. There is no staging step between your merge and a family
opening the app.

## 1. Branch and commit

```bash
git switch -c <type>/<slug>          # fix/disease-radar-timeout
```

Never commit to `master` directly. Commit messages follow `english-writing`:
conventional, English, one concern each, each commit independently deployable.
The pre-commit hook runs `npm run build`, so a broken build cannot be committed.

## 2. Run the gates locally — CI does not

The PR workflow only builds and deploys a preview. Lint, unit tests and the
database-rules tests run **nowhere** unless you run them:

```bash
npm run build      # tsc && vite build
npm run lint       # zero warnings allowed
npx vitest run     # one pass, not watch mode
npm run test:rules # only when database.rules.json changed — needs a JDK
```

For any visible change, look at it at **390px** before pushing. Type-checking
is not verification for UI work.

## 3. Open the PR

```bash
git push -u origin HEAD
gh pr create --base master --title "<type>: <same voice as a commit subject>" --body "$(cat <<'EOF'
## What
One paragraph: the change and why it exists.

## Verification
- npm run build / npm run lint / npx vitest run — all pass
- <the actual thing you exercised: the page at 390px, the script you ran, the reproduction that no longer reproduces>

## Risk
What could break, and what to look at first if something does. "None" is an
answer only when it is true.
EOF
)"
```

English title and body. If the change is user-visible, say what a parent sees
differently.

## 4. Write the self-review on the PR

Read the diff as if someone else wrote it and you are looking for the reason to
reject it:

```bash
gh pr diff
```

Walk the checklist. Every line is something this repo has actually got wrong
before:

**Correctness**
- Every callsite of a changed exported symbol updated (check with the LSP, not
  by eye).
- Deleting a child is still one root fan-out — `children/<id>`,
  `childRecords/<id>`, `childIndex/<id>`, `users/<uid>/childrenIds/<id>` set to
  `null` in a single `update()`.
- A new page is classified in `src/common/routePolicy.ts`. The allowlist is
  public-by-exception: unlisted means private, and that must be the correct
  answer for a page showing a child's health data.
- No LocalStorage fallback for child data. No guest mode.
- Nothing in the diff sends the whole `children/$childId` node down a
  high-frequency write path.

**Design system**
- No hex literal in a `className`. If the colour is not a token, add a token.
- Text takes `-dark` / `-ink`; pastel shades are fills only.
- No third card recipe, shadow, radius or container width.
- Tap targets ≥ 44px, and no small target nested in a large one doing the same
  thing.
- Icons only where an icon carries the meaning — not beside a heading, not in an
  empty state, not one per row of a short list.
- Motion imported from `common/ui/motion`, no local variants.

**Hygiene**
- No debug logging, commented-out code, `TODO` placeholder or dead export left
  behind.
- No secret, token or `.env` value in the diff.
- Tests assert observable behaviour, not source text or styling.
- Docs updated: `README.md` **and** `README.zh-TW.md` together when the change
  alters what either describes.
- English everywhere the `english-writing` skill requires it.

Post the result as a PR comment, including the findings you are about to fix —
a self-review that only ever says "looks good" is not a review:

```bash
gh pr comment --body "$(cat <<'EOF'
## Self-review

Read the full diff against the checklist in `.claude/skills/pr-self-merge`.

**Findings**
1. <file:line> — <what is wrong> → fixed in <sha or "next push">
2. ...

**Checked and clean**: routePolicy classification, no hex literals, 44px
targets, README mirror in sync.
EOF
)"
```

## 5. Fix, push, re-run the gates

Fix every finding on the same branch. Fixes are ordinary commits with real
messages (`fix: ...`), not `wip` or `address review`. Re-run the gates the fix
could affect, and note in the PR that the findings are resolved.

## 6. Merge

```bash
gh pr checks --watch     # green before anything else
gh pr merge --squash --delete-branch
git switch master && git pull
```

- `--squash` when the PR is one logical change (the usual case).
- `--rebase` when the PR is several commits that are each independently
  deployable and worth keeping apart. History stays linear.
- Never `--merge`; this repo has no merge commits.

Then confirm the deploy that your merge triggered actually succeeded:

```bash
gh run list --workflow=firebase-hosting-merge.yml --limit 1
```

A red deploy is your problem, immediately, not tomorrow's.

## When not to self-merge

Stop and ask the user instead:

- A check is red, or `gh pr checks` shows a check that never ran.
- A self-review finding you did not fix, for any reason.
- `database.rules.json` changed and `npm run test:rules` did not pass on your
  machine — that file is the only real authorisation boundary in the product.
- The change runs a migration against the deployed database, deletes user data,
  or widens who can read a child's records.
- The user asked to look at it before it lands.
