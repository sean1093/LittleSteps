import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { User } from 'firebase/auth';
import FeedbackButton from './FeedbackButton';
import { FEEDBACK_FAILED_MESSAGE } from '../feedbackMessages';

/**
 * The code that writes a feedback row is fetched when the form is sent, so
 * that the database SDK stays off pages that never write. That makes "the
 * chunk did not load" a new way for sending to fail, and the browser's own
 * message for it is an English sentence with a hashed file name in it.
 */

vi.mock('../feedbackSubmit', () => {
  throw new Error('Failed to fetch dynamically imported module: /assets/feedbackSubmit-abc.js');
});

const account = { uid: 'parent-1', email: 'parent@example.com', displayName: 'Parent' } as User;

describe('sending feedback when its code will not load', () => {
  it('tells the parent it failed in the form’s own words', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton user={account} />);
    await user.click(screen.getByRole('button', { name: '問題回報' }));
    await user.type(screen.getByLabelText(/標題/), 'title');
    await user.type(screen.getByLabelText(/詳細內容/), 'enough detail to pass the form');

    await user.click(screen.getByRole('button', { name: '送出回報' }));

    expect(await screen.findByText(FEEDBACK_FAILED_MESSAGE)).toBeInTheDocument();
    expect(screen.queryByText(/dynamically imported/)).toBeNull();
  });
});
