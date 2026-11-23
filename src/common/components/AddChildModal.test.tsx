import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddChildModal from './AddChildModal';
import { CHILD_NAME_LIMIT } from '../recordLimits';
import { ChildJoinError } from '../childJoinError';

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

describe('欄位上限', () => {
  // children/$childId/name 的規則有長度上限；兩張表（寶寶、孕期）都寫這個欄位。
  // 超過時回來的是 PERMISSION_DENIED，表單會說「請確認網路」。
  it('寶寶姓名的上限就是規則的上限', () => {
    render(<AddChildModal isOpen onClose={vi.fn()} onSave={vi.fn()} />);
    expect(screen.getByLabelText('寶寶姓名')).toHaveAttribute('maxlength', String(CHILD_NAME_LIMIT));
  });

  it('孕期檔案的小名也用同一個上限', async () => {
    render(
      <AddChildModal isOpen onClose={vi.fn()} onSave={vi.fn()} modes={['create', 'pregnancy']} />,
    );
    await userEvent.click(screen.getByRole('button', { name: '懷孕中' }));
    expect(screen.getByLabelText(/寶寶小名/)).toHaveAttribute('maxlength', String(CHILD_NAME_LIMIT));
  });
});

/**
 * Joining a family's record. The data layer knows exactly why a join failed,
 * and that reason is what the parent has to see.
 */
describe('用代碼加入', () => {
  const openJoin = async (onJoin: (uuid: string) => Promise<void>) => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<AddChildModal isOpen onClose={onClose} onSave={vi.fn()} onJoin={onJoin} initialMode="join" />);
    await user.type(screen.getByLabelText('寶寶代碼'), 'abc-123');
    return { user, onClose };
  };

  it('initialMode="join" 直接開在加入那一頁，拿著代碼來的人不必先找分頁', () => {
    render(<AddChildModal isOpen onClose={vi.fn()} onSave={vi.fn()} onJoin={vi.fn()} initialMode="join" />);
    expect(screen.getByLabelText('寶寶代碼')).toBeInTheDocument();
    expect(screen.queryByLabelText('寶寶姓名')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '加入寶寶', pressed: true })).toBeInTheDocument();
  });

  it('沒給 initialMode 時照舊開在新增寶寶', () => {
    render(<AddChildModal isOpen onClose={vi.fn()} onSave={vi.fn()} onJoin={vi.fn()} />);
    expect(screen.getByLabelText('寶寶姓名')).toBeInTheDocument();
  });

  it('加入失敗時說出真正的原因，而不是叫人檢查網路', async () => {
    // 女兒把分享關掉了。阿嬤該看到的是「請對方打開」，不是 Wi-Fi。
    const reason = '這個寶寶目前未開放加入。請對方在分享視窗打開「開放用代碼加入」，再試一次';
    const { user, onClose } = await openJoin(async () => {
      throw new ChildJoinError(reason);
    });
    await user.click(document.querySelector('button[type="submit"]')!);

    expect(await screen.findByRole('alert')).toHaveTextContent(reason);
    expect(screen.getByRole('alert')).not.toHaveTextContent('網路');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('不是寫給家長看的錯誤，仍然用通用的那一句，不把 SDK 的訊息貼出來', async () => {
    const { user } = await openJoin(async () => {
      throw new Error('PERMISSION_DENIED: Permission denied');
    });
    await user.click(document.querySelector('button[type="submit"]')!);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('儲存失敗，請確認網路後再試一次。');
    expect(alert).not.toHaveTextContent('PERMISSION_DENIED');
  });

  it('加入成功就關掉視窗，並把去掉前後空白的代碼交出去', async () => {
    const onJoin = vi.fn(async () => {});
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<AddChildModal isOpen onClose={onClose} onSave={vi.fn()} onJoin={onJoin} initialMode="join" />);
    await user.type(screen.getByLabelText('寶寶代碼'), '  abc-123  ');
    await user.click(document.querySelector('button[type="submit"]')!);

    await vi.waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(onJoin).toHaveBeenCalledWith('abc-123');
  });
});
