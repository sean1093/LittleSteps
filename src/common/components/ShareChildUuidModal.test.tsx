import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShareChildUuidModal from './ShareChildUuidModal';
import type { ChildProfile } from '../../types';

vi.mock('../../contexts/AuthContext', () => ({
  useOptionalAuth: () => ({ user: { uid: 'u1' } }),
}));

/**
 * 代碼一旦傳出去就收不回來，除非這扇窗能移除成員並關掉加入。這組測試釘住
 * 那條路：家長看得到名單上是誰、關得掉加入、一次移掉一個人，而且寫入失敗時
 * 窗不會關、也不會假裝成功。
 */

const makeChild = (overrides: Partial<ChildProfile> = {}): ChildProfile => ({
  id: 'child-1',
  name: '小豆',
  birthday: '2025-02-27',
  milestoneProgress: {},
  vaccineProgress: {},
  createdAt: '2025-02-27T00:00:00.000Z',
  createdBy: 'u1',
  members: { u1: true },
  ...overrides,
});

const renderModal = (child: ChildProfile, handlers: {
  removeMember?: (childId: string, memberUid: string) => Promise<void>;
  setMemberName?: (childId: string, name: string) => Promise<void>;
  setJoinOpen?: (childId: string, open: boolean) => Promise<void>;
} = {}) => {
  // setup() 會換掉 navigator.clipboard，所以剪貼簿的 spy 只能掛在它之後。
  const user = userEvent.setup();
  const writeText = vi.spyOn(navigator.clipboard, 'writeText');
  const removeMember = vi.fn(handlers.removeMember ?? (async () => {}));
  const setMemberName = vi.fn(handlers.setMemberName ?? (async () => {}));
  const setJoinOpen = vi.fn(handlers.setJoinOpen ?? (async () => {}));
  const onClose = vi.fn();

  render(
    <ShareChildUuidModal
      isOpen
      onClose={onClose}
      child={child}
      removeMember={removeMember}
      setMemberName={setMemberName}
      setJoinOpen={setJoinOpen}
    />,
  );

  return { removeMember, setMemberName, setJoinOpen, onClose, writeText, user };
};

beforeEach(() => {
  vi.clearAllMocks();
  // happy-dom 沒有實作 window.confirm，所以是指派而不是 spyOn。
  window.confirm = vi.fn(() => true);
});

describe('看得到的人有幾個', () => {
  it('說出帳號數量，而不是列出沒有意義的 uid', () => {
    const child = makeChild({ members: { u1: true, u2: true } });
    renderModal(child);

    expect(screen.getByText('目前有 2 個帳號可以看到小豆的紀錄（包含你）')).toBeInTheDocument();
    expect(screen.queryByText(/u2/)).toBeNull();
  });
});

describe('名單：看得到是誰，一次移除一個', () => {
  const family = () =>
    makeChild({
      members: { u1: true, u2: true, u3: true },
      memberNames: { u1: '媽媽', u2: '外婆', u3: '托嬰中心' },
    });

  it('用每個人自己取的名字列出名單，不印 uid', () => {
    renderModal(family());

    const list = screen.getByRole('list', { name: '誰看得到' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(3);
    expect(within(list).getByText('媽媽（你）')).toBeInTheDocument();
    expect(within(list).getByText('外婆')).toBeInTheDocument();
    expect(within(list).getByText('托嬰中心')).toBeInTheDocument();
    expect(screen.queryByText(/u2|u3/)).toBeNull();
  });

  it('只移除按下的那一位，外婆留著', async () => {
    // 王太太要請托嬰中心離開，不是連外婆一起。
    const { removeMember, user } = renderModal(family());

    await user.click(screen.getByRole('button', { name: '移除托嬰中心' }));

    expect(removeMember).toHaveBeenCalledTimes(1);
    expect(removeMember).toHaveBeenCalledWith('child-1', 'u3');
  });

  it('確認之後才移除', async () => {
    window.confirm = vi.fn(() => false);
    const { removeMember, user } = renderModal(family());

    await user.click(screen.getByRole('button', { name: '移除外婆' }));

    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('外婆的存取權'));
    expect(removeMember).not.toHaveBeenCalled();
  });

  it('自己那一列是「離開」，離開成功就關窗', async () => {
    const { removeMember, onClose, user } = renderModal(family());

    await user.click(screen.getByRole('button', { name: '離開這份紀錄' }));

    expect(removeMember).toHaveBeenCalledWith('child-1', 'u1');
    expect(onClose).toHaveBeenCalled();
  });

  it('只剩自己一個時沒有任何移除或離開——名單不能空掉', () => {
    renderModal(makeChild({ memberNames: { u1: '媽媽' } }));

    expect(screen.queryByRole('button', { name: /移除|離開/ })).toBeNull();
  });

  it('寫入被拒時留在原地、只講一次，名單上還是那三個人', async () => {
    const { onClose, user } = renderModal(family(), {
      removeMember: () => Promise.reject(new Error('permission denied')),
    });

    await user.click(screen.getByRole('button', { name: '移除外婆' }));

    expect(await screen.findAllByRole('alert')).toHaveLength(1);
    expect(screen.getByRole('alert')).toHaveTextContent('移除沒有成功，對方仍然看得到');
    expect(onClose).not.toHaveBeenCalled();
    expect(within(screen.getByRole('list', { name: '誰看得到' })).getAllByRole('listitem')).toHaveLength(3);
  });

  it('離開被拒時說的是自己還在名單上，窗不關', async () => {
    const { onClose, user } = renderModal(family(), {
      removeMember: () => Promise.reject(new Error('permission denied')),
    });

    await user.click(screen.getByRole('button', { name: '離開這份紀錄' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('離開沒有成功，你仍然在名單上');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('還沒取名字的人照樣列出、照樣移除得掉，並說怎麼補上名字', async () => {
    // 名字這個欄位出現之前就加入的人沒有名字；他們不能因此從名單上消失。
    const { removeMember, user } = renderModal(
      makeChild({ members: { u1: true, u2: true }, memberNames: { u1: '媽媽' } }),
    );

    expect(screen.getByText('還沒取名字的家人')).toBeInTheDocument();
    expect(screen.getByText(/請對方打開這扇分享視窗/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '移除還沒取名字的家人' }));
    expect(removeMember).toHaveBeenCalledWith('child-1', 'u2');
  });

  it('改得了自己的名字，存的是輸入的那一個', async () => {
    const { setMemberName, user } = renderModal(family());

    await user.click(screen.getByRole('button', { name: '改名字' }));
    const input = screen.getByLabelText('你在名單上的名字');
    expect(input).toHaveValue('媽媽');
    await user.clear(input);
    await user.type(input, '小豆媽');
    await user.click(screen.getByRole('button', { name: '儲存' }));

    expect(setMemberName).toHaveBeenCalledWith('child-1', '小豆媽');
    expect(screen.queryByLabelText('你在名單上的名字')).toBeNull();
  });

  it('名字沒存到時輸入框留著、打的字也留著', async () => {
    const { user } = renderModal(family(), {
      setMemberName: () => Promise.reject(new Error('offline')),
    });

    await user.click(screen.getByRole('button', { name: '改名字' }));
    await user.type(screen.getByLabelText('你在名單上的名字'), '2');
    await user.click(screen.getByRole('button', { name: '儲存' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('名字沒有存到');
    expect(screen.getByLabelText('你在名單上的名字')).toHaveValue('媽媽2');
  });
});

describe('開放用代碼加入', () => {
  it('新的寶寶預設是關的，打開時寫入 true', async () => {
    const { setJoinOpen, user } = renderModal(makeChild());

    const toggle = screen.getByRole('switch', { name: '開放用代碼加入' });
    expect(toggle).toHaveAttribute('aria-checked', 'false');

    await user.click(toggle);

    expect(setJoinOpen).toHaveBeenCalledWith('child-1', true);
  });

  it('已經開著時關掉它', async () => {
    const { setJoinOpen, user } = renderModal(makeChild({ joinOpen: true }));

    await user.click(screen.getByRole('switch', { name: '開放用代碼加入' }));

    expect(setJoinOpen).toHaveBeenCalledWith('child-1', false);
  });

  it('寫入被拒時開關不會移動到資料庫沒有的位置', async () => {
    const { onClose, user } = renderModal(makeChild(), {
      setJoinOpen: () => Promise.reject(new Error('offline')),
    });

    await user.click(screen.getByRole('switch', { name: '開放用代碼加入' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('設定沒有存到，開關維持原本的狀態');
    expect(screen.getByRole('switch', { name: '開放用代碼加入' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('複製代碼', () => {
  it('關著的時候先開放加入再複製，家長手上不會有加不進來的代碼', async () => {
    const { setJoinOpen, writeText, user } = renderModal(makeChild());

    await user.click(screen.getByRole('button', { name: '開放加入並複製代碼' }));

    // 按鈕改口說「已複製」是家長唯一看得到的成功訊號，等到它出現才問剪貼簿。
    expect(await screen.findByRole('button', { name: '已複製代碼' })).toBeInTheDocument();
    expect(setJoinOpen).toHaveBeenCalledWith('child-1', true);
    expect(writeText).toHaveBeenCalledWith('child-1');
  });

  it('開放加入失敗就不複製，並且說代碼還不能用', async () => {
    const { writeText, user } = renderModal(makeChild(), {
      setJoinOpen: () => Promise.reject(new Error('offline')),
    });

    await user.click(screen.getByRole('button', { name: '開放加入並複製代碼' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('代碼現在還不能用');
    expect(writeText).not.toHaveBeenCalled();
  });
});

describe('資料怎麼被保護', () => {
  it('把代碼交出去的這扇窗，連得到關於頁，並且先把自己關掉', async () => {
    window.history.replaceState(null, '', '/');
    const { onClose, user } = renderModal(makeChild());

    await user.click(screen.getByRole('button', { name: '看看孩子的紀錄怎麼被保護' }));

    expect(onClose).toHaveBeenCalled();
    expect(window.location.pathname).toBe('/about');
  });
});
