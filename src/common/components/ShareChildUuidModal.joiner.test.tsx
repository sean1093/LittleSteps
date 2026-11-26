import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ShareChildUuidModal from './ShareChildUuidModal';
import type { ChildProfile } from '../../types';
import { SHARING_REMOVAL } from '../landing/serviceCopy';

/**
 * The share window as seen by someone who JOINED a record their partner
 * created. The data layer never removes the creator, so the window must not
 * offer to.
 */
vi.mock('../../contexts/AuthContext', () => ({
  useOptionalAuth: () => ({ user: { uid: 'joiner' } }),
}));

const child = (members: Record<string, true>): ChildProfile =>
  ({
    id: 'child-1',
    name: '小豆',
    birthday: '2025-02-27',
    milestoneProgress: {},
    vaccineProgress: {},
    createdAt: '2025-02-27T00:00:00.000Z',
    createdBy: 'creator',
    members,
  }) as ChildProfile;

const renderModal = (members: Record<string, true>) =>
  render(
    <ShareChildUuidModal
      isOpen
      onClose={vi.fn()}
      child={child(members)}
      revokeOtherMembers={vi.fn()}
      setJoinOpen={vi.fn()}
    />,
  );

describe('ShareChildUuidModal, as a member who did not create the record', () => {
  it('does not offer to remove the creator, and says why nothing can be removed', () => {
    // Two accounts: the creator and me. The button used to read "remove 1
    // other account", ran without error, and removed nobody.
    renderModal({ creator: true, joiner: true });

    expect(screen.queryByRole('button', { name: /移除其他/ })).not.toBeInTheDocument();
    expect(screen.getByText(/建立這份紀錄的人，不能從這裡移除/)).toBeInTheDocument();
    // The count of who can see the record is still the truth: two.
    expect(screen.getByText(/目前有 2 個帳號/)).toBeInTheDocument();
  });

  it('counts only the accounts it will actually remove', () => {
    // Creator, me, and a grandmother: one removable, not two.
    renderModal({ creator: true, joiner: true, grandma: true });

    expect(screen.getByRole('button', { name: '移除其他 1 個帳號的存取權' })).toBeInTheDocument();
    expect(screen.queryByText(/不能從這裡移除/)).not.toBeInTheDocument();
  });

  it('makes the sharing promise, and the promise keeps the creator the sheet cannot remove', () => {
    // The landing page, the intro pages and the about page all read this
    // sentence. Seen by a member who joined, the sheet offers to remove the
    // grandmother but not the creator — so a promise that "any member can be
    // removed" would be a claim the sheet cannot keep.
    renderModal({ creator: true, joiner: true, grandma: true });

    expect(screen.getByText(SHARING_REMOVAL, { exact: false })).toBeInTheDocument();
    const removable = Number(
      screen.getByRole('button', { name: /移除其他 \d+ 個帳號/ }).textContent?.match(/\d+/)?.[0],
    );
    const othersOnList = 2;
    expect(removable).toBeLessThan(othersOnList);
    // One of the others is out of reach, and the promise names who.
    expect(SHARING_REMOVAL).toMatch(/建立這份紀錄的人不會被移除/);
  });
});
