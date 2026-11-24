import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import ChoiceChips from './ChoiceChips';

const OPTIONS = [
  { value: 'pee', label: '小便' },
  { value: 'poop', label: '大便' },
  { value: 'both', label: '大小便' },
] as const;

type Kind = (typeof OPTIONS)[number]['value'];

function Field({ onChange = vi.fn(), disabled = false }) {
  const [value, setValue] = useState<Kind>('pee');
  return (
    <ChoiceChips
      label="類型"
      value={value}
      options={OPTIONS}
      disabled={disabled}
      onChange={(next) => {
        setValue(next);
        onChange(next);
      }}
    />
  );
}

describe('ChoiceChips', () => {
  it('is one named group with every option visible, exactly one checked', () => {
    render(<Field />);

    const group = screen.getByRole('radiogroup', { name: '類型' });
    const radios = within(group).getAllByRole('radio');
    expect(radios.map((node) => node.textContent)).toEqual(['小便', '大便', '大小便']);
    expect(radios.filter((node) => node.getAttribute('aria-checked') === 'true')).toHaveLength(1);
    expect(screen.getByRole('radio', { name: '小便' })).toBeChecked();
  });

  it('chooses with one tap and moves the check with it', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Field onChange={onChange} />);

    await user.click(screen.getByRole('radio', { name: '大小便' }));

    expect(onChange).toHaveBeenCalledWith('both');
    expect(screen.getByRole('radio', { name: '大小便' })).toBeChecked();
    expect(screen.getByRole('radio', { name: '小便' })).not.toBeChecked();
  });

  it('does not submit the form it sits in', async () => {
    // The chips are buttons inside a form; a tap must choose, not save.
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Field />
      </form>,
    );

    await user.click(screen.getByRole('radio', { name: '大便' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('ignores taps while disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Field onChange={onChange} disabled />);

    await user.click(screen.getByRole('radio', { name: '大便' }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
