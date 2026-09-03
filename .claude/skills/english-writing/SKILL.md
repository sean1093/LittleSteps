---
name: english-writing
description: Write commit messages, branch names, PR text and Markdown docs in English in this repo, keep README.md / README.zh-TW.md in sync, and leave the Traditional Chinese product copy alone. Use before committing, before opening or reviewing a PR, and whenever adding or editing documentation.
---

# English is the authoring language

The product is Traditional Chinese. The repo is not. Everything a contributor
writes *about* the code is English; everything a parent reads *in* the app stays
Traditional Chinese. The two never mix in one place.

## English — no exceptions

| Surface | Example |
|---|---|
| Commit subject and body | `fix: keep the drawer status text collapsed when data is stale` |
| Branch names | `fix/disease-radar-timeout` |
| PR title, body, review comments | see `pr-self-merge` |
| Markdown under `docs/`, `.claude/`, `README.md` | this file |
| Names in code — variables, functions, files, types | already true — keep it true |
| New files: their comments, console output and test names | `.github/workflows/refresh-disease-radar.yml` |

## Code comments: match the file you are in

`src/**` and `scripts/**` are commented in Traditional Chinese today, and those
comments carry the reasoning that makes the code readable. They are not a
migration target.

- Editing a few lines inside a Chinese-commented file → write those lines in the
  file's language. Half a file in each language is worse than either.
- Creating a file, or rewriting one wholesale → English throughout, console
  output and test names included.
- Never translate comments as a drive-by change. It buries the real diff.

## Traditional Chinese — never translate

- Strings rendered to a user: JSX copy, `aria-label`, `alt`, placeholders, toast
  and error text shown in the UI.
- Content data: `src/*/data/**`, `public/data/*.json`, wiki articles, milestone
  and vaccine names, county and disease names.
- Anything quoted from a Taiwanese source where the original wording is the
  evidence (a MOHW field name, a licence title, a dataset column header).

Translating any of those is a product change, not a language cleanup. Do not.

## Commit messages

Conventional commits, imperative mood, one concern per commit:

```
<type>: <what changes, imperative, lower case, no full stop, <= 72 chars>

<why it changes, what breaks without it, what you verified — wrap at 72>
```

`feat:` `fix:` `refactor:` `style:` `docs:` `test:` `chore:` `ci:`. A scope is
optional and is the service or subsystem: `fix(littleguard): ...`.

Good:

```
fix: fail fast when the CDC host is unreachable

GitHub-hosted runners cannot open a TCP connection to od.cdc.gov.tw, so each
of the six downloads sat in connect for 2m17s before the job died with a bare
ETIMEDOUT. A 20s idle timeout turns that into one actionable line.
```

Bad, and why:

- `fix: 修正抽屜文案` — not English.
- `update stuff` — no type, says nothing.
- `feat: add drawer, fix radar colours, bump deps` — three concerns, so it
  cannot be reverted or deployed on its own.

Each commit must build, typecheck and pass tests on its own. When a type
contract spans several areas, the contract change and its call sites are one
commit.

## Documentation

- `README.md` is the canonical document and is English.
- `README.zh-TW.md` is its Traditional Chinese mirror, for parents and
  contributors who read Chinese first. It is a translation, never a fork: same
  sections in the same order, same numbers, same code blocks.
- **Change one, change the other in the same commit.** A mirror that drifts is
  worse than no mirror, because a reader cannot tell which one is stale. If a
  change is too large to translate in the same sitting, it is too large to
  land — split it.
- Both files carry the language switcher line directly under the title:
  `**English** · [繁體中文](README.zh-TW.md)`. That link text is the one place a
  Han character belongs in an English document.
- `.claude/CLAUDE.md` (agent guide) and `.claude/skills/**` are English only and
  have no mirror.
- `docs/superpowers/**` holds dated design specs and implementation plans. They
  are a historical record of what was decided on a given day: **do not
  retranslate or edit them.** Write new ones in English.

## Check before you commit

```bash
# Han characters in the English surface — must print nothing. Three exclusions:
# the Chinese mirror, the dated records, and this file (its examples are Chinese
# on purpose). The `next` skips the switcher link, the one Han string that
# belongs in an English document.
git diff --cached --name-only -- '*.md' .claude docs \
  | grep -v -e '^README\.zh-TW\.md$' -e '^docs/superpowers/' \
            -e '^\.claude/skills/english-writing/SKILL\.md$' \
  | xargs perl -CSD -ne 'next if m{README\.zh-TW\.md}; print "$ARGV:$.: $_" if /\p{Han}/'

# The commit message itself
git log -1 --pretty=%B | perl -CSD -ne 'print "non-English: $_" if /\p{Han}/'
```

Both silent means the change is ready for `pr-self-merge`.
