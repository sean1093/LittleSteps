import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeedbackModal from './FeedbackModal';

/**
 * The rules cap `feedbacks/$feedbackId/content` at 5000 characters, and a
 * `.validate` failure reaches the client as the same PERMISSION_DENIED as a
 * throttle refusal. The form is the only place that can keep the two apart:
 * if the field cannot exceed the limit, a denial can only mean "too soon".
 */
describe('the general feedback form', () => {
  it('caps the content field at the limit the rules enforce', () => {
    render(
      <FeedbackModal isOpen onClose={vi.fn()} onSubmit={vi.fn()} userName="媽媽" />,
    );

    expect(screen.getByLabelText(/詳細內容/)).toHaveAttribute('maxlength', '5000');
  });
});
