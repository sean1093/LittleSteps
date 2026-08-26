import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddChildModal from './AddChildModal';

describe('AddChildModal', () => {
  it('submits the create form with name, birthday and gender, then closes', async () => {
    const onSave = vi.fn();
    const onClose = vi.fn();
    render(<AddChildModal isOpen onClose={onClose} onSave={onSave} />);

    await userEvent.type(screen.getByLabelText('寶寶姓名'), '小明');
    fireEvent.change(screen.getByLabelText('寶寶生日'), { target: { value: '2026-01-15' } });
    fireEvent.change(screen.getByLabelText('寶寶性別'), { target: { value: 'male' } });

    await userEvent.click(screen.getByRole('button', { name: '新增寶寶' }));

    expect(onSave).toHaveBeenCalledWith('小明', '2026-01-15', 'male');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onSave when required fields are empty', () => {
    const onSave = vi.fn();
    render(<AddChildModal isOpen onClose={vi.fn()} onSave={onSave} />);

    const form = screen.getByRole('button', { name: '新增寶寶' }).closest('form');
    fireEvent.submit(form as HTMLFormElement);

    expect(onSave).not.toHaveBeenCalled();
  });

  it('renders nothing when closed', () => {
    const { container } = render(<AddChildModal isOpen={false} onClose={vi.fn()} onSave={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });
});
