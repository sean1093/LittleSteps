import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { RadarCell } from '../../types';
import { STATUS_COPY } from '../utils/radar';
import DiseaseRow from './DiseaseRow';

function cell(overrides: Partial<RadarCell> = {}): RadarCell {
  return {
    rate: 12.3,
    trendBase: 12,
    ratio: 1.02,
    geoRatio: 1,
    visits: 20,
    denom: 2000,
    reliability: 'ok',
    spark: [10, 11, 12, 12, 11, 12, 12, 12.3],
    ...overrides,
  };
}

const noop = () => {};

describe('DiseaseRow', () => {
  it('病名、比率、人次都在同一列上', () => {
    render(<DiseaseRow disease="腸病毒" cell={cell()} showStatus onOpen={noop} />);
    const row = screen.getByRole('button');
    expect(row).toHaveTextContent('腸病毒');
    expect(row).toHaveTextContent('12.3/萬');
    expect(row).toHaveTextContent('20 人次');
  });

  it('狀態文案與顏色一律取自 STATUS_COPY，不自己判斷', () => {
    // 這一條是為了讓 radar.ts 之後新增狀態時 UI 不用跟著改：只要 STATUS_COPY
    // 有那一格，這裡就顯示得出來。
    render(
      <DiseaseRow
        disease="腸病毒"
        cell={cell({ trendBase: 79.4, ratio: 2.13, rate: 169 })}
        showStatus
        onOpen={noop}
      />,
    );
    const label = screen.getByText(STATUS_COPY.risingStrong.label);
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass(STATUS_COPY.risingStrong.tone);
  });

  it('showStatus 為 false 時收起狀態，數字照留', () => {
    render(<DiseaseRow disease="腸病毒" cell={cell()} showStatus={false} onOpen={noop} />);
    expect(screen.queryByText(STATUS_COPY.steady.label)).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('12.3/萬');
    expect(screen.getByRole('button')).toHaveTextContent('20 人次');
  });

  it('算不出比率時寫破折號，不寫 0', () => {
    render(
      <DiseaseRow
        disease="水痘"
        cell={cell({ rate: null, trendBase: null, ratio: null, visits: 0 })}
        showStatus
        onOpen={noop}
      />,
    );
    const row = screen.getByRole('button');
    expect(row).toHaveTextContent('—');
    expect(row).not.toHaveTextContent('0.0/萬');
  });

  it('整列可點，點下去把病名交回去', async () => {
    const onOpen = vi.fn();
    const user = userEvent.setup();
    render(<DiseaseRow disease="類流感" cell={cell()} showStatus onOpen={onOpen} />);
    await user.click(screen.getByRole('button'));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('可點區域至少 44px，整列都是同一顆按鈕', () => {
    const { container } = render(
      <DiseaseRow disease="腹瀉" cell={cell()} showStatus onOpen={noop} />,
    );
    expect(container.querySelectorAll('button')).toHaveLength(1);
    expect(screen.getByRole('button').className).toContain('min-h-tap');
  });

  it('沒有箭頭、驚嘆號，也沒有最強的那個紅', () => {
    const { container } = render(
      <DiseaseRow
        disease="腸病毒"
        cell={cell({ trendBase: 79.4, ratio: 2.13, rate: 169 })}
        showStatus
        onOpen={noop}
      />,
    );
    expect(container.textContent ?? '').not.toMatch(/[↑↓→←!！⚠]/);
    expect(container.innerHTML).not.toContain('primary-dark');
    expect(container.querySelector('svg')).toBeNull();
  });
});
