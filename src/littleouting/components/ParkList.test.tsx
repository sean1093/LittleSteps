import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { ToastProvider } from '../../common/ui/toast';
import type { ParkData, ParkFilter } from '../parks';
import ParkList from './ParkList';

/**
 * The park list answers "which park" two ways — by county, largest first, or
 * by distance from where the parent is standing — and says only what the map
 * states. These cases hold both orders and the wording around what the map
 * does not know.
 */

const ALL = 'all';
const CITY_ORDER = ['臺北市', '新北市', '臺中市'];

const DATA: ParkData = {
  attribution: '© OpenStreetMap 貢獻者，依 ODbL 授權',
  builtOn: '2026-11-23',
  venues: [
    // Taipei: one large with playgrounds, one small without.
    { id: 'w1', kind: 'park', name: '大安森林公園', city: '臺北市', lat: 25.03, lng: 121.535, areaM2: 260000, playgrounds: 2 },
    { id: 'w2', kind: 'park', name: '巷口小公園', city: '臺北市', lat: 25.04, lng: 121.55, areaM2: 800, playgrounds: 0 },
    // New Taipei, just across the river from the Taipei test position.
    { id: 'w3', kind: 'park', name: '板橋河濱公園', city: '新北市', lat: 25.02, lng: 121.47, areaM2: 9000, playgrounds: 0 },
    { id: 'n4', kind: 'playground', name: '中和兒童遊戲場', city: '新北市', lat: 24.99, lng: 121.5 },
    { id: 'w5', kind: 'park', name: '臺中中央公園', city: '臺中市', lat: 24.18, lng: 120.65, areaM2: 670000, playgrounds: 1 },
  ],
};

const fetchMock = vi.fn();

function Harness({ city = ALL, filter = 'any' as ParkFilter }) {
  const [picked, setPicked] = useState(city);
  const [chosen, setChosen] = useState<ParkFilter>(filter);
  return (
    <ToastProvider>
      <ParkList
        cityOrder={CITY_ORDER}
        pickedCity={picked}
        allCities={ALL}
        onChooseCity={setPicked}
        filter={chosen}
        onChooseFilter={setChosen}
      />
    </ToastProvider>
  );
}

async function renderLoaded(props: { city?: string; filter?: ParkFilter } = {}) {
  fetchMock.mockResolvedValue({ ok: true, status: 200, json: async () => DATA });
  const user = userEvent.setup();
  render(<Harness {...props} />);
  await screen.findByText(/^共 \d+ 處/);
  return user;
}

const names = () => screen.getAllByRole('heading', { level: 3 }).map((node) => node.textContent);

/** Stands the parent at a point; `null` makes the browser refuse. */
function standAt(position: { lat: number; lng: number } | null) {
  vi.stubGlobal('navigator', {
    ...navigator,
    geolocation: {
      getCurrentPosition: (ok: PositionCallback, fail: PositionErrorCallback) =>
        position
          ? ok({ coords: { latitude: position.lat, longitude: position.lng } } as GeolocationPosition)
          : fail({ code: 1 } as GeolocationPositionError),
    },
  });
}

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  fetchMock.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('ParkList: by county', () => {
  it('lists every venue, largest park first', async () => {
    await renderLoaded();
    expect(names()).toEqual([
      '臺中中央公園',
      '大安森林公園',
      '板橋河濱公園',
      '巷口小公園',
      '中和兒童遊戲場',
    ]);
  });

  it('narrows to one county and back', async () => {
    const user = await renderLoaded();

    await user.click(screen.getByRole('button', { name: '新北市' }));
    expect(names()).toEqual(['板橋河濱公園', '中和兒童遊戲場']);

    await user.click(screen.getByRole('button', { name: '全部縣市' }));
    expect(names()).toHaveLength(DATA.venues.length);
  });

  it('offers only the counties the data has', async () => {
    await renderLoaded();
    const row = screen.getByTestId('scroll-row-outing-park-cities');
    expect(within(row).getAllByRole('button').map((node) => node.textContent)).toEqual([
      '全部縣市',
      '臺北市',
      '新北市',
      '臺中市',
    ]);
  });

  it('treats a remembered county the data lacks as all counties', async () => {
    await renderLoaded({ city: '澎湖縣' });
    expect(screen.getByRole('button', { name: '全部縣市' })).toHaveAttribute('aria-pressed', 'true');
    expect(names()).toHaveLength(DATA.venues.length);
  });
});

describe('ParkList: what a stage asks of a park', () => {
  it('"有遊戲場" keeps parks with one mapped, and playgrounds themselves', async () => {
    await renderLoaded({ filter: 'playground' });
    expect(names()).toEqual(['臺中中央公園', '大安森林公園', '中和兒童遊戲場']);
  });

  it('"1 公頃以上" keeps only parks that large', async () => {
    // 板橋河濱公園 is 9,000 m²: just under, and left out.
    await renderLoaded({ filter: 'large' });
    expect(names()).toEqual(['臺中中央公園', '大安森林公園']);
  });

  it('switching the filter on the page changes the list', async () => {
    const user = await renderLoaded();
    await user.click(screen.getByRole('button', { name: '有遊戲場' }));
    expect(names()).not.toContain('巷口小公園');
  });

  it('says so when nothing matches, instead of an empty list', async () => {
    // New Taipei has no park over a hectare in this sample.
    const user = await renderLoaded({ filter: 'large' });
    await user.click(screen.getByRole('button', { name: '新北市' }));

    expect(screen.getByText('找不到符合的公園')).toBeInTheDocument();
    expect(screen.queryAllByRole('heading', { level: 3 })).toEqual([]);
  });
});

describe('ParkList: what a card says', () => {
  it('states area and mapped playgrounds, and nothing about a park with none mapped', async () => {
    await renderLoaded();

    const big = screen.getByRole('heading', { name: '大安森林公園' }).closest('li') as HTMLElement;
    expect(big).toHaveTextContent('約 26 公頃');
    expect(big).toHaveTextContent('地圖上標了 2 處遊戲場');

    // "No playground mapped" is not "no playground": the card stays silent.
    const small = screen.getByRole('heading', { name: '巷口小公園' }).closest('li') as HTMLElement;
    expect(small).toHaveTextContent('約 800 平方公尺');
    expect(small.textContent).not.toMatch(/遊戲場/);
  });

  it('links each card to its own coordinates', async () => {
    await renderLoaded();
    const card = screen.getByRole('heading', { name: '板橋河濱公園' }).closest('li') as HTMLElement;
    const link = within(card).getByRole('link', { name: '地圖與導航' });
    expect(link).toHaveAttribute('href', expect.stringContaining('query=25.02,121.47'));
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('credits OpenStreetMap, dates the data and says what the map does not know', async () => {
    await renderLoaded();
    const note = screen.getByText(/OpenStreetMap 貢獻者/);
    expect(note).toHaveTextContent('ODbL');
    expect(note).toHaveTextContent('2026-11-23');
    expect(note).toHaveTextContent('沒有標出遊戲場不代表沒有');
  });
});

describe('ParkList: nearest to me', () => {
  it('re-sorts by distance and shows it, ignoring the county chip', async () => {
    // Standing in Taipei's west end. The nearest park is across the river in
    // New Taipei, which a Taipei-only list would never show.
    standAt({ lat: 25.025, lng: 121.48 });
    const user = await renderLoaded({ city: '臺北市' });
    expect(names()).toEqual(['大安森林公園', '巷口小公園']);

    await user.click(screen.getByRole('button', { name: '用我的位置找最近的' }));

    expect(names()[0]).toBe('板橋河濱公園');
    expect(names()).toHaveLength(DATA.venues.length);
    const nearest = screen.getByRole('heading', { name: '板橋河濱公園' }).closest('li') as HTMLElement;
    expect(nearest).toHaveTextContent(/公里|公尺/);
    // Taichung is some 130 km off; it is last.
    expect(names()[names().length - 1]).toBe('臺中中央公園');
  });

  it('keeps the stage filter while sorting by distance', async () => {
    standAt({ lat: 25.025, lng: 121.48 });
    const user = await renderLoaded({ filter: 'playground' });
    await user.click(screen.getByRole('button', { name: '用我的位置找最近的' }));
    expect(names()).toEqual(['中和兒童遊戲場', '大安森林公園', '臺中中央公園']);
  });

  it('goes back to counties on request', async () => {
    standAt({ lat: 25.025, lng: 121.48 });
    const user = await renderLoaded({ city: '臺北市' });
    await user.click(screen.getByRole('button', { name: '用我的位置找最近的' }));
    await user.click(screen.getByRole('button', { name: '改用縣市' }));

    expect(names()).toEqual(['大安森林公園', '巷口小公園']);
    expect(screen.getByRole('button', { name: '臺北市' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('says so when the position is refused, and leaves the county list alone', async () => {
    standAt(null);
    const user = await renderLoaded({ city: '臺北市' });
    await user.click(screen.getByRole('button', { name: '用我的位置找最近的' }));

    expect(await screen.findByText('沒辦法取得位置，請直接選縣市')).toBeInTheDocument();
    expect(names()).toEqual(['大安森林公園', '巷口小公園']);
  });
});

describe('ParkList: loading', () => {
  it('says the data failed to load rather than that there are no parks', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock.mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });
    render(<Harness />);

    expect(await screen.findByText('公園資料載入失敗')).toBeInTheDocument();
    expect(screen.queryByText('找不到符合的公園')).not.toBeInTheDocument();
  });

  it('does not report "none found" while the file is still on its way', () => {
    fetchMock.mockReturnValue(new Promise(() => {}));
    render(<Harness />);

    expect(screen.getByText('正在載入公園資料…')).toBeInTheDocument();
    expect(screen.queryByText('找不到符合的公園')).not.toBeInTheDocument();
    expect(screen.queryByText(/^共 \d+ 處/)).not.toBeInTheDocument();
  });
});
