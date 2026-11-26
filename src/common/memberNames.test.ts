import { describe, expect, it } from 'vitest';
import { MEMBER_NAME_MAX, memberRows, toMemberName, UNNAMED_MEMBER } from './memberNames';
import type { ChildProfile } from '../types';

describe('toMemberName', () => {
  it('trims, and gives nothing rather than an empty string the rules would refuse', () => {
    expect(toMemberName('  外婆 ')).toBe('外婆');
    expect(toMemberName('   ')).toBeUndefined();
    expect(toMemberName(null)).toBeUndefined();
    expect(toMemberName(undefined)).toBeUndefined();
  });

  it('cuts a long display name to what the rules accept, never splitting an emoji', () => {
    // The rules count UTF-16 code units. A surrogate pair cut in half would be
    // an invalid string the parent never typed.
    const long = `${'a'.repeat(MEMBER_NAME_MAX - 1)}😀😀`;
    const name = toMemberName(long);
    expect(name).toBe('a'.repeat(MEMBER_NAME_MAX - 1));
    expect(name!.length).toBeLessThanOrEqual(MEMBER_NAME_MAX);
  });
});

describe('memberRows', () => {
  const child = {
    createdBy: 'c',
    members: { b: true, c: true, a: true, d: true },
    memberNames: { a: '爸爸', c: '媽媽', d: '外婆' },
  } as unknown as ChildProfile;

  it('lists every member, named or not, me first and then the creator', () => {
    const rows = memberRows(child, 'a');
    expect(rows.slice(0, 2).map((row) => row.uid)).toEqual(['a', 'c']);
    expect(rows[0]).toMatchObject({ uid: 'a', label: '爸爸', isMe: true });
    expect(rows[1]).toMatchObject({ uid: 'c', label: '媽媽', isCreator: true });
    expect(rows).toHaveLength(4);
    expect(rows.find((row) => row.uid === 'b')).toMatchObject({ label: UNNAMED_MEMBER, unnamed: true });
  });

  it('keeps a member whose name is set but who is no longer on the list off it', () => {
    // A name outliving its membership must not put a former member back on
    // the sheet: the list is the member map, the names only label it.
    const stale = { ...child, memberNames: { ...child.memberNames, gone: '前保母' } } as ChildProfile;
    expect(memberRows(stale, 'a').map((row) => row.label)).not.toContain('前保母');
  });
});
