import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { RadarCell, RadarData } from '../../types';
import { DISEASE_INFO } from '../data/diseases';
import { FORBIDDEN_WORDS, STATUS_COPY, type RadarStatus } from '../utils/radar';
import DiseaseDrawer from './DiseaseDrawer';

const DISEASES = ['腸病毒', '手足口病', '疱疹性咽峽炎', '類流感', '腹瀉', '水痘'];

function cell(overrides: Partial<RadarCell> = {}): RadarCell {
  return {
    rate: 169,
    trendBase: 79.4,
    ratio: 2.13,
    geoRatio: 1.4,
    visits: 35,
    denom: 2071,
    reliability: 'ok',
    spark: [70, 74, 79, 81, 88, 104, 132, 169],
    ...overrides,
  };
}

/** statusOf 的九個分支各自對得上一顆格子。狀態文案一律從 STATUS_COPY 取。 */
const CELL_BY_STATUS: Record<RadarStatus, RadarCell> = {
  risingStrong: cell({ ratio: 2.13 }),
  rising: cell({ ratio: 1.4 }),
  steady: cell({ ratio: 1.01 }),
  falling: cell({ ratio: 0.5 }),
  noBaseline: cell({ trendBase: null, ratio: null }),
  none: cell({ rate: 0, trendBase: 0, ratio: null, visits: 0 }),
  emerged: cell({ rate: 12, trendBase: 0, ratio: null, visits: 3 }),
  smallSample: cell({ denom: 640, reliability: 'small' }),
  insufficient: cell({
    rate: null,
    trendBase: null,
    ratio: null,
    visits: 0,
    denom: 42,
    reliability: 'insufficient',
    spark: new Array(8).fill(null),
  }),
};

function data(): RadarData {
  const national = Object.fromEntries(DISEASES.map((name) => [name, { rate: 128.5 }]));
  return {
    week: '2026-W34',
    weekStart: '2026-08-23',
    weekEnd: '2026-08-29',
    generatedAt: '2026-09-03T01:00:00.000Z',
    verifiedOn: '2026-09-03',
    source: '衛生福利部疾病管制署 健保門診及住院就診人次統計',
    sourceUrls: ['https://od.cdc.gov.tw/eic/NHI_Enterovirus.csv'],
    license: '政府資料開放授權條款-第1版',
    diseases: DISEASES,
    ageBands: ['0~2', '3~6', '7~12'],
    calibration: { trendP25: 0.78, trendP75: 1.26, trendP90: 1.77, sampleSize: 48725 },
    national: { '0~2': national, '3~6': national, '7~12': national },
    counties: {},
  };
}

const noop = () => {};

function open(disease = '腸病毒', overrides: Partial<RadarCell> = {}, onClose = noop) {
  return render(
    <DiseaseDrawer
      disease={disease}
      cell={cell(overrides)}
      data={data()}
      age="3~6"
      onClose={onClose}
    />,
  );
}

const bodyText = () => screen.getByRole('dialog').textContent ?? '';

describe('抽屜的順序', () => {
  it('先說這個名字在資料裡是什麼，再給可以做的事，數字放最後', () => {
    // 反過來的話家長會先被數字嚇一跳，才知道自己能做什麼。
    open();
    const body = bodyText();
    const order = [
      DISEASE_INFO['腸病毒'].meaning.slice(0, 8),
      '可以做什麼',
      '什麼情況要看醫生',
      '最近 8 週',
      '這一週',
    ].map((needle) => body.indexOf(needle));
    order.forEach((at) => expect(at).toBeGreaterThan(-1));
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  it('可以做什麼一定在數字之前', () => {
    open();
    const body = bodyText();
    expect(body.indexOf('可以做什麼')).toBeGreaterThan(-1);
    expect(body.indexOf('可以做什麼')).toBeLessThan(body.indexOf('這一週'));
  });
});

describe('抽屜的內容', () => {
  it('六種病都打得開，說明、行動、就醫時機三塊都在', () => {
    DISEASES.forEach((disease) => {
      const view = open(disease);
      const body = bodyText();
      const info = DISEASE_INFO[disease];
      expect(body).toContain(info.meaning);
      expect(body).toContain(info.seeDoctor);
      info.actions.forEach((action) => expect(body).toContain(action));
      view.unmount();
    });
  });

  it('行動是逐條列出來的清單，不是一坨字', () => {
    open();
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(DISEASE_INFO['腸病毒'].actions.length);
    expect(items[0]).toHaveTextContent(DISEASE_INFO['腸病毒'].actions[0]);
  });

  it('率、人次、分母三個都給，數字才讀得懂', () => {
    // 只給「169.0/萬」的話沒人知道那是幾個人；只給「35 人次」的話沒人知道
    // 是幾個人裡的 35 個。分母是這一格數字的可信度本身。
    open();
    const body = bodyText();
    expect(body).toContain('169.0/萬');
    expect(body).toContain('35 人次');
    expect(screen.getByText('統計基數')).toBeInTheDocument();
    expect(body).toContain('2,071 次門診');
  });

  it('說清楚「/萬」跟統計基數是什麼意思', () => {
    open();
    expect(screen.getByText(/每一萬次健保門診/)).toBeInTheDocument();
  });

  it('前 8 週中位數與全國同一週都拿得到，才比得出來', () => {
    open();
    const body = bodyText();
    expect(screen.getByText('前 8 週中位數')).toBeInTheDocument();
    expect(body).toContain('79.4/萬');
    expect(screen.getByText('全國同一週')).toBeInTheDocument();
    expect(body).toContain('128.5/萬');
  });

  it('全國那一層抓不到就顯示破折號，不留空格也不編一個數字', () => {
    const bare = data();
    bare.national = {};
    render(
      <DiseaseDrawer disease="腸病毒" cell={cell()} data={bare} age="3~6" onClose={noop} />,
    );
    expect(screen.getByText('全國同一週').parentElement).toHaveTextContent('—');
  });

  it('連得出疾管署，而且是新分頁開', () => {
    open();
    const link = screen.getByRole('link', { name: /疾管署的腸病毒說明/ });
    expect(link).toHaveAttribute('href', DISEASE_INFO['腸病毒'].sourceUrl);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
  });

  it.each(DISEASES)('%s 的連結指向自己那一頁', (disease) => {
    const view = open(disease);
    expect(screen.getByRole('link', { name: new RegExp(`疾管署的${disease}說明`) })).toHaveAttribute(
      'href',
      DISEASE_INFO[disease].sourceUrl,
    );
    view.unmount();
  });

  it('關得掉', async () => {
    const onClose = vi.fn();
    open('腸病毒', {}, onClose);
    await userEvent.setup().click(screen.getByRole('button', { name: '關閉' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('抽屜的狀態與樣本', () => {
  it.each(Object.keys(CELL_BY_STATUS) as RadarStatus[])(
    '%s 的文案與色階都從 STATUS_COPY 取',
    (status) => {
      const view = render(
        <DiseaseDrawer
          disease="腸病毒"
          cell={CELL_BY_STATUS[status]}
          data={data()}
          age="3~6"
          onClose={noop}
        />,
      );
      const copy = screen.getByText(STATUS_COPY[status].label);
      expect(copy).toHaveClass(STATUS_COPY[status].tone);
      view.unmount();
    },
  );

  it('樣本夠的時候不加但書', () => {
    open();
    expect(screen.queryByText(/容易上下跳動/)).not.toBeInTheDocument();
  });

  it.each(['small', 'insufficient'] as const)('樣本是 %s 就說一聲', (reliability) => {
    const view = open('腸病毒', { reliability, denom: 300 });
    expect(screen.getByText(/容易上下跳動/)).toBeInTheDocument();
    view.unmount();
  });

  it('資料不足的那一格不畫線，也不假裝算得出比率', () => {
    const { container } = render(
      <DiseaseDrawer
        disease="腸病毒"
        cell={CELL_BY_STATUS.insufficient}
        data={data()}
        age="3~6"
        onClose={noop}
      />,
    );
    expect(container.querySelector('svg[role="img"]')).toBeNull();
    expect(screen.getByText('資料不足')).toBeInTheDocument();
    // 率與中位數都算不出來；人次與分母是實際數到的，照實給。
    expect(screen.getByText('這一週').parentElement).toHaveTextContent('—（0 人次）');
    expect(bodyText()).toContain('42 次門診');
  });

  it('點夠多的時候畫得出 8 週折線', () => {
    open();
    expect(screen.getByRole('img', { name: /腸病毒最近 8 週/ })).toBeInTheDocument();
  });
});

describe('抽屜的語氣', () => {
  it('沒有用到禁用詞', () => {
    DISEASES.forEach((disease) => {
      const view = open(disease);
      const body = bodyText();
      FORBIDDEN_WORDS.forEach((word) => expect(body).not.toContain(word));
      view.unmount();
    });
  });

  it('沒有箭頭也沒有驚嘆號', () => {
    open();
    expect(bodyText()).not.toMatch(/[↑↓→←!！⚠]/);
  });

  it('沒有用到全 app 最強的那個紅', () => {
    // 顏色最強只到 butter-dark。primary-dark 用在「比平常多一點」上會讀成急診警報。
    const { container } = open('腸病毒', { ratio: 2.13 });
    expect(container.innerHTML).not.toContain('primary-dark');
    expect(container.innerHTML).not.toContain('text-red');
  });

  it('數字沒有被放大成頭條', () => {
    open();
    const numbers = screen.getByText('統計基數').closest('dl');
    expect(numbers?.innerHTML ?? '').not.toMatch(/text-(lg|xl|2xl|3xl|4xl)/);
  });

  it('className 裡沒有 hex 色碼', () => {
    const { container } = open();
    container.querySelectorAll('[class]').forEach((node) => {
      expect(node.getAttribute('class') ?? '').not.toMatch(/#[0-9a-fA-F]{3,6}/);
    });
  });
});
