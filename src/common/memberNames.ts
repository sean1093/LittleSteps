import type { ChildProfile } from '../types';

/**
 * The names on a child's member list.
 *
 * `children/$childId/memberNames/$uid` holds the name each member goes by on
 * the share sheet, so a parent can tell the daycare worker from grandma
 * before removing one of them. The rules accept only a member's own name, a
 * string of 1-40 characters, and only once that member is on the list; see
 * `database.rules.json` and `scripts/testRules.cjs`.
 *
 * It is a name, never an account identifier: no email, no uid. When a member
 * creates or joins a record the name starts as their sign-in display name,
 * and they can change it on the share sheet.
 */

/** The rules' ceiling, in UTF-16 code units, which is what `.length` counts there. */
export const MEMBER_NAME_MAX = 40;

/**
 * A display name cut to what the rules accept, or undefined when nothing is
 * left — an empty string would be refused, and a refused name would take the
 * membership written beside it down with it.
 */
export function toMemberName(raw: string | null | undefined): string | undefined {
  const trimmed = (raw ?? '').trim();
  if (!trimmed) return undefined;
  // Cut by code point so an emoji is never split in half, then stop before the
  // code-unit ceiling.
  let name = '';
  for (const char of Array.from(trimmed)) {
    if (name.length + char.length > MEMBER_NAME_MAX) break;
    name += char;
  }
  return name.trim() || undefined;
}

export interface MemberRow {
  uid: string;
  /** What the sheet prints for this member. */
  label: string;
  /** The member has not written a name yet. */
  unnamed: boolean;
  isMe: boolean;
  isCreator: boolean;
}

/** Shown for a member who joined before names existed or never set one. */
export const UNNAMED_MEMBER = '還沒取名字的家人';

/**
 * The member list as the share sheet shows it: me first, then everyone else
 * in a stable order. The order of a Firebase map is not something a parent
 * should see rows jump around by.
 */
export function memberRows(child: ChildProfile, myUid: string | null): MemberRow[] {
  const names = child.memberNames ?? {};
  return Object.keys(child.members)
    .map((uid) => {
      const name = names[uid];
      return {
        uid,
        label: name || UNNAMED_MEMBER,
        unnamed: !name,
        isMe: uid === myUid,
        isCreator: uid === child.createdBy,
      };
    })
    .sort((a, b) => {
      if (a.isMe !== b.isMe) return a.isMe ? -1 : 1;
      if (a.isCreator !== b.isCreator) return a.isCreator ? -1 : 1;
      return a.label.localeCompare(b.label, 'zh-Hant') || a.uid.localeCompare(b.uid);
    });
}
