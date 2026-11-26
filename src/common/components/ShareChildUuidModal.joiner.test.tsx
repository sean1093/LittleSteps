import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ShareChildUuidModal from './ShareChildUuidModal';
import type { ChildProfile } from '../../types';
import { SHARING_REMOVAL } from '../landing/serviceCopy';

/**
 * The share window as seen by someone who JOINED a record their partner
 * created. The landing page, the intro pages and the about page promise that
 * anyone on the list can be removed, the creator included; this is where that
 * promise has to hold.
 */
vi.mock('../../contexts/AuthContext', () => ({
  useOptionalAuth: () => ({ user: { uid: 'joiner' } }),
}));

const child = (members: Record<string, true>, memberNames: Record<string, string>): ChildProfile =>
  ({
    id: 'child-1',
    name: '小豆',
    birthday: '2025-02-27',
    milestoneProgress: {},
    vaccineProgress: {},
    createdAt: '2025-02-27T00:00:00.000Z',
    createdBy: 'creator',
    members,
    memberNames,
  }) as ChildProfile;

const renderModal = (members: Record<string, true>, memberNames: Record<string, string>) =>
  render(
    <ShareChildUuidModal
      isOpen
      onClose={vi.fn()}
      child={child(members, memberNames)}
      removeMember={vi.fn()}
      setMemberName={vi.fn()}
      setJoinOpen={vi.fn()}
    />,
  );

describe('ShareChildUuidModal, as a member who did not create the record', () => {
  it('offers to remove every other member, the creator included', () => {
    // The button used to read "remove 1 other account", ran without error,
    // and removed nobody: the creator was silently kept.
    renderModal({ creator: true, joiner: true }, { creator: '媽媽', joiner: '爸爸' });

    expect(screen.getByText('建立這份紀錄')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '移除媽媽' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '離開這份紀錄' })).toBeInTheDocument();
    expect(screen.getByText(/目前有 2 個帳號/)).toBeInTheDocument();
  });

  it('makes the sharing promise, and claims no more than the remove buttons reach', () => {
    renderModal(
      { creator: true, joiner: true, grandma: true },
      { creator: '媽媽', joiner: '爸爸', grandma: '外婆' },
    );

    expect(screen.getByText(SHARING_REMOVAL, { exact: false })).toBeInTheDocument();
    // The promise says anyone on the list, the creator included, can go. Each
    // other member therefore needs a remove button of their own.
    expect(SHARING_REMOVAL).toMatch(/任何一位移除，包括建立這份紀錄的人/);
    const removeButtons = screen.getAllByRole('button', { name: /^移除/ });
    expect(removeButtons.map((button) => button.getAttribute('aria-label')).sort()).toEqual(
      ['移除外婆', '移除媽媽'].sort(),
    );
  });
});
