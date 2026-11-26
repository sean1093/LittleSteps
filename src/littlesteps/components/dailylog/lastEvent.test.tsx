import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import type { DailyLog } from '../../../types';
import { formatTimeAgo } from './lastEvent';
import LastEventLines from './LastEventLines';

const NOW = new Date('2026-06-15T04:00:00.000Z');
const ago = (minutes: number, seconds = 0) =>
  new Date(NOW.getTime() - minutes * 60_000 - seconds * 1000).toISOString();

describe('formatTimeAgo', () => {
  it('不滿一分鐘是「剛剛」，不是「0 分鐘前」', () => {
    expect(formatTimeAgo(ago(0), NOW)).toBe('剛剛');
    expect(formatTimeAgo(ago(0, 59), NOW)).toBe('剛剛');
  });

  it('另一支手機的時鐘快了幾秒，也還是「剛剛」', () => {
    expect(formatTimeAgo(ago(-2), NOW)).toBe('剛剛');
  });

  it('一小時內印分鐘', () => {
    expect(formatTimeAgo(ago(1), NOW)).toBe('1 分鐘前');
    expect(formatTimeAgo(ago(50), NOW)).toBe('50 分鐘前');
    expect(formatTimeAgo(ago(59, 59), NOW)).toBe('59 分鐘前');
  });

  it('一天內印小時加分鐘，整點不拖一個「0 分鐘」', () => {
    expect(formatTimeAgo(ago(60), NOW)).toBe('1 小時前');
    expect(formatTimeAgo(ago(130), NOW)).toBe('2 小時 10 分鐘前');
    expect(formatTimeAgo(ago(23 * 60 + 59), NOW)).toBe('23 小時 59 分鐘前');
  });

  it('過了一天只印天數', () => {
    expect(formatTimeAgo(ago(24 * 60), NOW)).toBe('1 天前');
    expect(formatTimeAgo(ago(47 * 60 + 59), NOW)).toBe('1 天前');
    expect(formatTimeAgo(ago(48 * 60), NOW)).toBe('2 天前');
  });

  it('讀不懂的時間不硬湊一句話', () => {
    expect(formatTimeAgo('not a date', NOW)).toBe('');
  });
});

describe('LastEventLines', () => {
  afterEach(() => vi.useRealTimers());

  const feed = (minutes: number, feedingType: 'breast_left' | 'formula' = 'breast_left'): DailyLog => ({
    id: 'f1',
    childId: 'c1',
    type: 'feeding',
    timestamp: ago(minutes),
    data: { feedingType },
    createdAt: ago(minutes),
  });
  const diaper = (minutes: number): DailyLog => ({
    id: 'd1',
    childId: 'c1',
    type: 'diaper',
    timestamp: ago(minutes),
    data: { type: 'pee' },
    createdAt: ago(minutes),
  });

  it('說出上次餵奶多久以前、是哪一邊，以及上次換尿布', () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    const { container } = render(<LastEventLines lastFeeding={feed(130)} lastDiaper={diaper(50)} />);

    const lines = Array.from(container.querySelectorAll('p')).map((p) => p.textContent);
    expect(lines).toEqual(['上次餵奶 2 小時 10 分鐘前 · 母乳（左）', '上次換尿布 50 分鐘前']);
  });

  it('沒有那種紀錄就不畫那一行', () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    const { container, rerender } = render(<LastEventLines lastFeeding={null} lastDiaper={diaper(5)} />);

    expect(container.textContent).toBe('上次換尿布 5 分鐘前');

    rerender(<LastEventLines lastFeeding={null} lastDiaper={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('不用重新整理，讀數自己往前走', () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    render(<LastEventLines lastFeeding={feed(0, 'formula')} lastDiaper={null} />);
    expect(screen.getByText('剛剛')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2 * 60_000);
    });

    expect(screen.getByText('2 分鐘前')).toBeInTheDocument();
  });
});
