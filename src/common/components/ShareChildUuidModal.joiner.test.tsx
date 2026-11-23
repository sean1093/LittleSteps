import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ShareChildUuidModal from './ShareChildUuidModal';
import type { ChildProfile } from '../../types';

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
});
