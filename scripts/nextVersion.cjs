'use strict';

/**
 * Works out the next version number. Every merge to master is tagged, and the
 * tag is the only answer to "which version is live" — package.json's version is
 * never published and nothing reads it, so the tag is the source of truth.
 *
 * Getting this wrong costs one of two things, and neither of them throws: a
 * version that climbs too fast, so nobody can tell later which release actually
 * added something; or a breaking change printed as a patch, so upgrading looks
 * safe when it is not.
 *
 * The size of the bump comes from the squash commit's subject, because this
 * repo squash-merges and the subject is therefore the pull request title,
 * written as a conventional commit (see .claude/skills/english-writing).
 *
 * CommonJS, alongside diffDiseaseRadar.cjs and for the same reason: scripts/ is
 * outside tsc's include and inside eslint's ignorePatterns.
 */

/** A `type(scope)!: description` subject. Only the `!` before the colon counts. */
const SUBJECT = /^(?<type>[A-Za-z]+)(?:\((?<scope>[^)]*)\))?(?<breaking>!)?:/;

/**
 * The footer form that declares a breaking change: at the start of a line,
 * anywhere in the message.
 *
 * An earlier version restricted this to the last paragraph, on the theory that
 * the spec puts it in the footer and that a squash body — which is the pull
 * request description — might discuss the rule in prose. That was wrong here,
 * and provably so: every commit in this repo ends with a `Co-Authored-By:` /
 * `Claude-Session:` trailer block, and every pull request body ends with the
 * Claude Code attribution footer. The last paragraph is therefore *always* one
 * of those, so a real declaration above it became unreachable.
 *
 * Stripping trailing trailer-looking paragraphs was the obvious repair and is
 * worse: `Verified: 46 script tests pass.` is indistinguishable from a trailer,
 * and so is most of the last line of a commit here.
 *
 * So: the line-start anchor, which is what the spec's rule actually is. The
 * residual risk is a body that begins a line with `BREAKING CHANGE:` while only
 * talking about it — that scores a major it did not ask for. The alternative
 * missed every real one, which is the worse of the two by a distance: a
 * spurious bump is visible in the tag list, a missed one is silent.
 */
const BREAKING_FOOTER = /^BREAKING[ -]CHANGE:/m;

/**
 * The bump one commit asks for.
 *
 * `feat` is a minor and everything else is a patch, docs and chore included.
 * There is no "no release this time": one merge is one deploy — the Firebase
 * hosting workflow fires on push to master — and a deploy should have a name.
 */
function bumpOfCommit(message) {
  // `git log -z` hands over a message with surrounding whitespace; the subject
  // is the first line of what is left, not of the raw string.
  const trimmed = message.trim();
  const subject = trimmed.split('\n', 1)[0];
  const match = SUBJECT.exec(subject);

  if (match?.groups?.breaking || BREAKING_FOOTER.test(trimmed)) return 'major';
  if (match?.groups?.type?.toLowerCase() === 'feat') return 'minor';
  return 'patch';
}

const RANK = { patch: 0, minor: 1, major: 2 };

/** The largest bump in a batch. An empty batch is a patch: a merge is a version. */
function bumpOf(messages) {
  return messages.reduce((highest, message) => {
    const bump = bumpOfCommit(message);
    return RANK[bump] > RANK[highest] ? bump : highest;
  }, 'patch');
}

/** The first version, when no tag exists yet. 0.x says no stability is promised. */
const FIRST_VERSION = '0.1.0';

const TAG = /^v(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*)$/;

/**
 * Applies the bump to the previous tag.
 *
 * While the major is still 0, a breaking change bumps the minor rather than
 * reaching 1.0.0. Semver says 0.x may change at any time, and moving to 1.0.0
 * declares stability — a product decision, not one a commit message should make
 * on someone's behalf.
 */
function nextVersion(latestTag, messages) {
  if (!latestTag) return FIRST_VERSION;

  const match = TAG.exec(latestTag);
  if (!match) throw new Error(`not a version tag: ${latestTag}`);

  const major = Number(match.groups.major);
  const minor = Number(match.groups.minor);
  const patch = Number(match.groups.patch);

  let bump = bumpOf(messages);
  if (bump === 'major' && major === 0) bump = 'minor';

  if (bump === 'major') return `${major + 1}.0.0`;
  if (bump === 'minor') return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

module.exports = { bumpOfCommit, bumpOf, nextVersion, FIRST_VERSION };

/*
  CLI: `git log -z --format=%B <range> | node scripts/nextVersion.cjs <latestTag|"">`

  Messages arrive NUL-separated because a commit message contains newlines.
  `git log -z` is required rather than `--format=%B%x00`: the latter terminates
  every entry with a newline of its own, so each message after the first would
  arrive with a leading blank line and its subject would read as empty.
*/
if (require.main === module) {
  const latestTag = process.argv[2] || '';
  const stdin = require('node:fs').readFileSync(0, 'utf8');
  const messages = stdin.split('\0').filter((message) => message.trim() !== '');

  process.stdout.write(nextVersion(latestTag, messages));
}
