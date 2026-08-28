import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { DailyLog } from '../../../types';
import LogTimeline from './LogTimeline';

/**
 * 餵奶、睡眠、換尿布本來就是兩個人輪流做的事，孩子也可以用 joinChild 共享，
 * 但先前沒有一筆紀錄留下是誰記的——「上一餐誰餵的」在 app 裡問不出答案。
 *
 * 只標別人記的那幾筆：一個人自己用的時候，每一列都掛上自己的名字只是噪音。
 */

const log = (over: Partial<DailyLog> = {}): DailyLog =>
  ({
    id: 'l1',
    childId: 'c1',
    type: 'feeding',
    timestamp: new Date().toISOString(),
    data: { method: 'formula', amount: 120 },
    createdAt: new Date().toISOString(),
    ...over,
  }) as DailyLog;

const noop = () => {};

describe('LogTimeline 的記錄者', () => {
  it('別人記的會標出是誰', () => {
    render(
      <LogTimeline
        logs={[log({ createdBy: 'partner', createdByName: '爸爸' })]}
        onEdit={noop}
        onDelete={noop}
        currentUserId="me"
      />,
    );

    expect(screen.getByText('由 爸爸 記錄')).toBeInTheDocument();
  });

  it('自己記的不標——每一列都寫自己的名字只是噪音', () => {
    render(
      <LogTimeline
        logs={[log({ createdBy: 'me', createdByName: '媽媽' })]}
        onEdit={noop}
        onDelete={noop}
        currentUserId="me"
      />,
    );

    expect(screen.queryByText(/記錄$/)).toBeNull();
  });

  it('舊紀錄沒有這個欄位時什麼都不猜', () => {
    // 加這個欄位之前寫進去的紀錄不帶 createdBy，不能因為缺值就當成別人記的。
    render(<LogTimeline logs={[log()]} onEdit={noop} onDelete={noop} currentUserId="me" />);

    expect(screen.queryByText(/記錄$/)).toBeNull();
  });

  it('只有 uid 沒有名字時也不顯示——顯示一串 uid 對家長毫無意義', () => {
    render(
      <LogTimeline
        logs={[log({ createdBy: 'partner' })]}
        onEdit={noop}
        onDelete={noop}
        currentUserId="me"
      />,
    );

    expect(screen.queryByText(/記錄$/)).toBeNull();
  });
});

describe('編輯別人的紀錄', () => {
  it('不會把記錄者換成自己', () => {
    // handleSave 只在新增時蓋上記錄者；改一筆別人記的紀錄不該把它變成自己記的。
    const onEdit = vi.fn();
    const partnerLog = log({ createdBy: 'partner', createdByName: '爸爸' });
    render(
      <LogTimeline logs={[partnerLog]} onEdit={onEdit} onDelete={noop} currentUserId="me" />,
    );

    screen.getByLabelText(/編輯/).click();
    expect(onEdit).toHaveBeenCalledWith(
      expect.objectContaining({ createdBy: 'partner', createdByName: '爸爸' }),
    );
  });
});
