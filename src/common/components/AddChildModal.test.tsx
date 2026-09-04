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

    expect(onSave).toHaveBeenCalledWith('小明', '2026-01-15', 'male', undefined, undefined, undefined);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onSave when required fields are empty', () => {
    const onSave = vi.fn();
    render(<AddChildModal isOpen onClose={vi.fn()} onSave={onSave} />);

    const form = screen.getByRole('button', { name: '新增寶寶' }).closest('form');
    fireEvent.submit(form as HTMLFormElement);

    expect(onSave).not.toHaveBeenCalled();
  });

  it('沒填出生週數時不送早產資料，足月寶寶不必理這一格', async () => {
    const onSave = vi.fn();
    render(<AddChildModal isOpen onClose={vi.fn()} onSave={onSave} />);

    await userEvent.type(screen.getByLabelText('寶寶姓名'), '小明');
    fireEvent.change(screen.getByLabelText('寶寶生日'), { target: { value: '2026-01-15' } });
    await userEvent.click(screen.getByRole('button', { name: '新增寶寶' }));

    expect(onSave).toHaveBeenCalledWith('小明', '2026-01-15', undefined, undefined, undefined, undefined);
  });

  it('送出填好的出生週數與天數', async () => {
    const onSave = vi.fn();
    render(<AddChildModal isOpen onClose={vi.fn()} onSave={onSave} />);

    await userEvent.type(screen.getByLabelText('寶寶姓名'), '小早');
    fireEvent.change(screen.getByLabelText('寶寶生日'), { target: { value: '2026-01-15' } });
    fireEvent.change(screen.getByLabelText('出生時的週數（選填）'), { target: { value: '32' } });
    fireEvent.change(screen.getByLabelText('出生時的天數'), { target: { value: '3' } });
    await userEvent.click(screen.getByRole('button', { name: '新增寶寶' }));

    expect(onSave).toHaveBeenCalledWith('小早', '2026-01-15', undefined, undefined, undefined, {
      weeks: 32,
      days: 3,
    });
  });

  it('只填週數時天數當 0', async () => {
    const onSave = vi.fn();
    render(<AddChildModal isOpen onClose={vi.fn()} onSave={onSave} />);

    await userEvent.type(screen.getByLabelText('寶寶姓名'), '小早');
    fireEvent.change(screen.getByLabelText('寶寶生日'), { target: { value: '2026-01-15' } });
    fireEvent.change(screen.getByLabelText('出生時的週數（選填）'), { target: { value: '28' } });
    await userEvent.click(screen.getByRole('button', { name: '新增寶寶' }));

    expect(onSave).toHaveBeenCalledWith('小早', '2026-01-15', undefined, undefined, undefined, {
      weeks: 28,
      days: 0,
    });
  });

  // 靜靜存一個算不出矯正年齡的數字，比擋下來糟：家長以為自己填了，畫面上卻
  // 沒有任何矯正。真實瀏覽器會先用 min/max 擋住，這裡驗的是最終結果：不會有
  // 一個帶著無效週數的孩子被建立。
  it('週數超出合理範圍時不會建立寶寶', async () => {
    const onSave = vi.fn();
    render(<AddChildModal isOpen onClose={vi.fn()} onSave={onSave} />);

    await userEvent.type(screen.getByLabelText('寶寶姓名'), '小明');
    fireEvent.change(screen.getByLabelText('寶寶生日'), { target: { value: '2026-01-15' } });
    fireEvent.change(screen.getByLabelText('出生時的週數（選填）'), { target: { value: '12' } });
    await userEvent.click(screen.getByRole('button', { name: '新增寶寶' }));

    expect(onSave).not.toHaveBeenCalled();
  });

  it('編輯既有寶寶時把出生週數帶進表單', () => {
    render(
      <AddChildModal
        isOpen
        onClose={vi.fn()}
        onSave={vi.fn()}
        editingChild={{
          id: 'c1',
          name: '小早',
          birthday: '2026-01-15',
          gestationalAgeWeeks: 30,
          gestationalAgeDays: 5,
          milestoneProgress: {},
          vaccineProgress: {},
          createdAt: '2026-01-15T00:00:00.000Z',
          createdBy: 'u1',
          members: { u1: true },
        }}
      />,
    );

    expect(screen.getByLabelText('出生時的週數（選填）')).toHaveValue(30);
    expect(screen.getByLabelText('出生時的天數')).toHaveValue(5);
  });

  it('renders nothing when closed', () => {
    const { container } = render(<AddChildModal isOpen={false} onClose={vi.fn()} onSave={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });
});
