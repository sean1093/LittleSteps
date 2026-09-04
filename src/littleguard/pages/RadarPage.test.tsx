import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { RadarCell, RadarData } from '../../types';
import { DISEASE_PART_OF } from '../data/diseases';
import { STATUS_COPY } from '../utils/radar';
import RadarPage from './RadarPage';

function cell(overrides: Partial<RadarCell> = {}): RadarCell {
  return {
    rate: 100,
    trendBase: 100,
    ratio: 1,
    geoRatio: 1,
    visits: 20,
    denom: 2000,
    reliability: 'ok',
    spark: [10, 20, 30, 40, 50, 60, 70, 100],
    ...overrides,
  };
}

const DISEASES = ['腸病毒', '手足口病', '疱疹性咽峽炎', '類流感', '腹瀉', '水痘'];

/** 板上那四列：上游六支 dataset 減掉收在腸病毒底下的兩種表現。 */
const BOARD = DISEASES.filter((name) => !(name in DISEASE_PART_OF));

/** 九個狀態的文案，從 STATUS_COPY 取——之後多一個狀態，這裡自動跟著守。 */
const STATUS_LABELS = Object.values(STATUS_COPY).map((entry) => entry.label);

const perDisease = (factory: (name: string) => RadarCell): Record<string, RadarCell> =>
  Object.fromEntries(DISEASES.map((name) => [name, factory(name)]));

/** 全國那一層只有 rate，不是完整的 RadarCell（src/types/index.ts:731）。 */
const nationalBand = (): Record<string, { rate: number | null }> =>
  Object.fromEntries(DISEASES.map((name) => [name, { rate: 100 }]));

/**
 * 刻意不放台北市：RadarPage 的預設縣市是台北市，這份 fixture 就順便守住
 * 「預設縣市不在資料裡時退到第一個縣市，而不是整頁變成錯誤畫面」。
 */
function fixture(weekStart = '2026-08-23', weekEnd = '2026-08-29'): RadarData {
  return {
    week: '2026-W34',
    weekStart,
    weekEnd,
    generatedAt: '2026-09-03T01:00:00.000Z',
    verifiedOn: '2026-09-03',
    source: '衛生福利部疾病管制署 健保門診及住院就診人次統計',
    sourceUrls: DISEASES.map((_, i) => `https://od.cdc.gov.tw/eic/NHI_${i}.csv`),
    license: '政府資料開放授權條款-第1版',
    diseases: DISEASES,
    ageBands: ['0~2', '3~6', '7~12'],
    calibration: { trendP25: 0.78, trendP75: 1.26, trendP90: 1.77, sampleSize: 48725 },
    national: { '0~2': nationalBand(), '3~6': nationalBand(), '7~12': nationalBand() },
    counties: {
      花蓮縣: {
        '0~2': perDisease(() => cell()),
        // 腸病毒 ratio 2.13 → 最近變多；水痘基線為零 → 最近沒有個案
        '3~6': perDisease((name) =>
          name === '腸病毒'
            ? cell({ rate: 169, trendBase: 79.4, ratio: 2.13, visits: 35 })
            : name === '水痘'
              ? cell({ rate: 0, trendBase: 0, ratio: null, visits: 0 })
              : cell(),
        ),
        '7~12': perDisease(() => cell()),
      },
      連江縣: {
        '0~2': perDisease(() =>
          cell({
            rate: null,
            trendBase: null,
            ratio: null,
            visits: 0,
            denom: 11,
            reliability: 'insufficient',
          }),
        ),
        '3~6': perDisease(() => cell({ denom: 500, reliability: 'small' })),
        '7~12': perDisease(() => cell()),
      },
    },
  };
}

function mockFetch(data: RadarData | null) {
  vi.stubGlobal(
    'fetch',
    vi.fn(() =>
      data
        ? Promise.resolve({ ok: true, json: () => Promise.resolve(data) })
        : Promise.resolve({ ok: false, status: 404 }),
    ),
  );
}

/** 板上的四列，照 DOM 順序。 */
const renderedDiseases = () =>
  screen
    .getAllByRole('button')
    .map((button) => BOARD.find((name) => (button.textContent ?? '').startsWith(name)))
    .filter((name): name is string => name !== undefined);

const user = () => userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

async function renderReady(data: RadarData = fixture()) {
  mockFetch(data);
  render(<RadarPage />);
  await waitFor(() => expect(screen.getByText('腸病毒')).toBeInTheDocument());
  return user();
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(new Date('2026-09-03T00:00:00Z'));
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('疫情雷達板', () => {
  it('四列都在，順序固定不隨狀態重排', async () => {
    // 水痘（清單最後一個）最吵、腸病毒（第一個）最安靜。若有人把「變多」的
    // 排到最前面，這一條就會爆：那會讓每次打開都像在看壞消息排行榜。
    const data = fixture();
    data.counties['花蓮縣']['0~2'] = perDisease((name) =>
      name === '水痘'
        ? cell({ rate: 169, trendBase: 79.4, ratio: 2.13, visits: 35 })
        : name === '腸病毒'
          ? cell({ rate: 40, trendBase: 100, ratio: 0.4 })
          : cell(),
    );
    await renderReady(data);
    expect(renderedDiseases()).toEqual(BOARD);
    expect(screen.getByText('最近變多，多留意')).toBeInTheDocument();
  });

  it('腸病毒只佔一列，兩種表現寫在它自己底下', async () => {
    // 上游腸病毒那一支就是手足口病加疱疹性咽峽炎；三列並排等於把同一批就診人
    // 次數三次。收起來之後，那兩個名字還是要看得到，否則家長會以為漏了。
    await renderReady();
    expect(renderedDiseases()).toHaveLength(4);
    expect(screen.queryByText('手足口病')).not.toBeInTheDocument();
    expect(screen.getByText('含手足口病、疱疹性咽峽炎')).toBeInTheDocument();
  });

  it('顯示疫情週的日期區間而不是週號', async () => {
    await renderReady();
    expect(screen.getByText(/8\/23–8\/29/)).toBeInTheDocument();
    expect(screen.queryByText(/第 ?34 ?週/)).not.toBeInTheDocument();
    expect(document.body.textContent ?? '').not.toContain('2026-W34');
  });

  it('資料還沒到時說在載入，不會先端出一塊空板', () => {
    // 永遠不 settle。用 executor 形式而不是 Promise.withResolvers，因為
    // tsconfig 的 lib 停在 ES2020（比照 BabyOasisPage.test.tsx:121）。
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => {})),
    );
    render(<RadarPage />);
    expect(screen.getByText('載入中')).toBeInTheDocument();
    expect(screen.queryByText('腸病毒')).not.toBeInTheDocument();
    expect(screen.queryByText(/現在抓不到資料/)).not.toBeInTheDocument();
  });
});

describe('怎麼看這個板', () => {
  it('第一次打開就有一段話說明這些數字是什麼', async () => {
    await renderReady();
    expect(screen.getByRole('heading', { name: '怎麼看這個板' })).toBeInTheDocument();
    expect(screen.getByText(/選你住的縣市和孩子的年齡/)).toBeInTheDocument();
  });

  it('說明在縣市籤之前——先知道自己在看什麼，再選縣市', async () => {
    await renderReady();
    const body = document.body.textContent ?? '';
    expect(body.indexOf('怎麼看這個板')).toBeGreaterThan(-1);
    expect(body.indexOf('怎麼看這個板')).toBeLessThan(body.indexOf('花蓮縣'));
  });
});

describe('一句話總結', () => {
  it('有病種比平常多就點名，不用家長自己讀四列', async () => {
    const it = await renderReady();
    await it.click(screen.getByRole('button', { name: '3-6 歲' }));
    expect(screen.getByText('這一週腸病毒比平常多，其他沒有變多。')).toBeInTheDocument();
  });

  it('沒事的那一週也把話說完整，不是留白', async () => {
    await renderReady();
    expect(screen.getByText('這一週沒有哪一種比平常明顯多。')).toBeInTheDocument();
  });

  it('資料過期就不給這句話——它跟狀態一樣是撐不起來的判斷', async () => {
    await renderReady(fixture('2026-06-28', '2026-07-04'));
    expect(screen.queryByText(/沒有哪一種比平常明顯多/)).not.toBeInTheDocument();
    expect(screen.queryByText(/比平常多，其他沒有變多/)).not.toBeInTheDocument();
  });
});

describe('縣市與年齡層', () => {
  it('預設看台北市', async () => {
    const data = fixture();
    data.counties['台北市'] = data.counties['花蓮縣'];
    await renderReady(data);
    expect(screen.getByRole('button', { name: '台北市' })).toHaveClass('chip-on');
    expect(screen.getByRole('button', { name: '花蓮縣' })).not.toHaveClass('chip-on');
  });

  it('資料裡沒有預設縣市時退到第一個縣市，而不是整頁錯誤', async () => {
    // fixture 只有花蓮縣與連江縣。上游哪天把「台北市」改成「臺北市」，家長看到
    // 的應該是別的縣市的板，不是一片「現在抓不到資料」。
    await renderReady();
    expect(screen.getByRole('button', { name: '花蓮縣' })).toHaveClass('chip-on');
    expect(screen.queryByText(/現在抓不到資料/)).not.toBeInTheDocument();
  });

  it('切換年齡層會換掉狀態文案', async () => {
    const it = await renderReady();
    await it.click(screen.getByRole('button', { name: '3-6 歲' }));
    expect(screen.getByText('最近變多，多留意')).toBeInTheDocument();
    expect(screen.getByText('最近沒有個案')).toBeInTheDocument();
  });

  it('切換縣市會換掉整塊板', async () => {
    const it = await renderReady();
    expect(screen.getAllByText('跟平常差不多').length).toBe(4);
    await it.click(screen.getByRole('button', { name: '連江縣' }));
    expect(screen.queryByText('跟平常差不多')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '連江縣' })).toHaveClass('chip-on');
  });

  it('三個年齡層都選得到，選中的那顆標出來', async () => {
    const it = await renderReady();
    ['0-2 歲', '3-6 歲', '7-12 歲'].forEach((label) => {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: '0-2 歲' })).toHaveClass('chip-on');
    await it.click(screen.getByRole('button', { name: '7-12 歲' }));
    expect(screen.getByRole('button', { name: '7-12 歲' })).toHaveClass('chip-on');
    expect(screen.getByRole('button', { name: '0-2 歲' })).not.toHaveClass('chip-on');
  });

  it('樣本偏小與資料不足都據實顯示', async () => {
    const it = await renderReady();
    await it.click(screen.getByRole('button', { name: '連江縣' }));
    expect(screen.getAllByText('資料不足').length).toBe(4);
    await it.click(screen.getByRole('button', { name: '3-6 歲' }));
    expect(screen.getAllByText('樣本偏小，僅供參考').length).toBe(4);
  });
});

describe('資料新舊', () => {
  it('一週前的資料照常顯示，不加任何但書', async () => {
    await renderReady();
    expect(screen.queryByText(/有點舊了/)).not.toBeInTheDocument();
    expect(screen.queryByText(/超過一個月沒更新/)).not.toBeInTheDocument();
    expect(screen.getAllByText('跟平常差不多').length).toBe(4);
  });

  it('兩週以上沒更新就說一聲，但板照常顯示', async () => {
    await renderReady(fixture('2026-08-09', '2026-08-15'));
    expect(screen.getByText(/有點舊了/)).toBeInTheDocument();
    // 加一行但書而已，狀態與數字都還在。
    expect(screen.getAllByText('跟平常差不多').length).toBe(4);
    expect(renderedDiseases()).toEqual(BOARD);
  });

  it('資料超過一個月就收起狀態，只留數字', async () => {
    await renderReady(fixture('2026-06-28', '2026-07-04'));
    expect(screen.getByText(/超過一個月沒更新/)).toBeInTheDocument();
    expect(screen.queryByText('跟平常差不多')).not.toBeInTheDocument();
    // 數字還在，六列也還在——收起的是可能已經錯的判斷，不是整塊板。
    expect(renderedDiseases()).toEqual(BOARD);
    expect(screen.getAllByText('20 人次').length).toBe(4);
  });

  it('過期時抽屜裡也不顯示狀態，板收了抽屜就得跟著收', async () => {
    // 分層一致性的回歸：板收了、抽屜沒收的話，家長從板上看不到判斷，點進去卻
    // 又看到一個可能已經錯的，比不收更糟。
    const it = await renderReady(fixture('2026-06-28', '2026-07-04'));
    await it.click(screen.getByRole('button', { name: /腸病毒/ }));
    const dialog = screen.getByRole('dialog');
    STATUS_LABELS.forEach((label) => {
      expect(screen.queryByText(label)).not.toBeInTheDocument();
      expect(dialog).not.toHaveTextContent(label);
    });
    // 收起的是判斷，不是數字：率、人次、分母照給，也還連得出疾管署那一頁。
    expect(dialog).toHaveTextContent('100.0/萬');
    expect(dialog).toHaveTextContent('2,000 次門診');
    expect(screen.getByRole('link', { name: /疾管署的腸病毒說明/ })).toBeInTheDocument();
  });

  it('過期時給得出去哪裡看最新的', async () => {
    await renderReady(fixture('2026-06-28', '2026-07-04'));
    expect(screen.getByRole('link', { name: '疾管署' })).toHaveAttribute(
      'href',
      'https://nidss.cdc.gov.tw/',
    );
  });
});

describe('抓不到資料', () => {
  it('抓不到資料時給得出下一步，不是空白', async () => {
    mockFetch(null);
    render(<RadarPage />);
    await waitFor(() => expect(screen.getByText(/現在抓不到資料/)).toBeInTheDocument());
    expect(screen.queryByText('腸病毒')).not.toBeInTheDocument();
  });

  it('那個下一步真的連得到疾管署', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    mockFetch(null);
    render(<RadarPage />);
    const action = await screen.findByRole('button', { name: '前往疾管署' });
    await user().click(action);
    expect(open).toHaveBeenCalledWith('https://nidss.cdc.gov.tw/', '_blank', 'noreferrer');
  });
});

describe('語氣', () => {
  it('畫面上沒有箭頭或驚嘆號', async () => {
    mockFetch(fixture());
    const { container } = render(<RadarPage />);
    await waitFor(() => expect(screen.getByText('腸病毒')).toBeInTheDocument());
    expect(container.textContent ?? '').not.toMatch(/[↑↓→←!！⚠]/);
  });

  it('沒有用到全 app 最強的那個紅', async () => {
    mockFetch(fixture());
    const { container } = render(<RadarPage />);
    await waitFor(() => expect(screen.getByText('腸病毒')).toBeInTheDocument());
    expect(container.innerHTML).not.toContain('primary-dark');
    expect(container.innerHTML).not.toContain('text-red');
  });

  it('說清楚這不是確診數，也不預言你的孩子會生病', async () => {
    await renderReady();
    expect(screen.getByText(/不是確診數/)).toBeInTheDocument();
    expect(screen.getByText(/身體不舒服請看醫生/)).toBeInTheDocument();
  });

  it('數字沒有被放大成頭條', async () => {
    await renderReady();
    const row = screen.getAllByRole('button').find((b) => (b.textContent ?? '').startsWith('腸病毒'));
    expect(row).toBeDefined();
    expect(row?.innerHTML ?? '').not.toMatch(/text-(lg|xl|2xl|3xl|4xl)/);
  });
});

describe('抽屜', () => {
  it('先給可以做什麼，再給數字', async () => {
    const it = await renderReady();
    await it.click(screen.getByRole('button', { name: /腸病毒/ }));
    const body = screen.getByRole('dialog').textContent ?? '';
    expect(body.indexOf('可以做什麼')).toBeGreaterThan(-1);
    expect(body.indexOf('可以做什麼')).toBeLessThan(body.indexOf('統計基數'));
  });

  it('連得出疾管署', async () => {
    const it = await renderReady();
    await it.click(screen.getByRole('button', { name: /腸病毒/ }));
    expect(screen.getByRole('link', { name: /疾管署的腸病毒說明/ })).toHaveAttribute(
      'href',
      'https://www.cdc.gov.tw/Disease/SubIndex/m3zdUk3u9GJVvddeSnhkiA',
    );
  });

  it('板上放不下的分母在抽屜裡補上', async () => {
    // 卡片只放得下率與人次；分母是這一格可不可信的關鍵，落點在抽屜。
    const it = await renderReady();
    await it.click(screen.getByRole('button', { name: /腸病毒/ }));
    const body = screen.getByRole('dialog').textContent ?? '';
    expect(body).toContain('100.0/萬');
    expect(body).toContain('20 人次');
    expect(body).toContain('2,000 次門診');
  });

  it('關掉之後就不在了', async () => {
    const it = await renderReady();
    await it.click(screen.getByRole('button', { name: /腸病毒/ }));
    await it.click(screen.getByRole('button', { name: '關閉' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('打開的是當下那個縣市與年齡層的格子', async () => {
    // 3-6 歲的水痘基線為零，抽屜裡的狀態要跟著換，不能還停在 0-2 歲那一格。
    const it = await renderReady();
    await it.click(screen.getByRole('button', { name: '3-6 歲' }));
    await it.click(screen.getByRole('button', { name: /水痘/ }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveTextContent('最近沒有個案');
    expect(dialog).toHaveTextContent('0 人次');
  });

  it('資料不足的格子照樣打得開，據實說算不出來', async () => {
    const it = await renderReady();
    await it.click(screen.getByRole('button', { name: '連江縣' }));
    await it.click(screen.getByRole('button', { name: /腸病毒/ }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveTextContent('資料不足');
    expect(dialog).toHaveTextContent('11 次門診');
    expect(dialog).toHaveTextContent(/容易上下跳動/);
    // 算不出來的率不編一個數字；人次與分母是實際數到的，照實給。
    expect(dialog).toHaveTextContent('—（0 人次）');
  });

  it('抽屜裡也沒有箭頭、驚嘆號或最強的那個紅', async () => {
    const it = await renderReady();
    await it.click(screen.getByRole('button', { name: /腸病毒/ }));
    const dialog = screen.getByRole('dialog');
    expect(dialog.textContent ?? '').not.toMatch(/[↑↓→←!！⚠]/);
    expect(dialog.innerHTML).not.toContain('primary-dark');
  });
});
