import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

/**
 * 這個 app 原本沒有任何 error boundary，所以 render 期間丟一次例外，整棵樹
 * 就被卸載成一片白——今天實際遇到三次。這組測試釘住「壞掉的是一頁，不是
 * 整個 app」，以及錯誤仍然會被記錄下來。
 */

const Boom = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) throw new Error('壞掉了');
  return <p>正常內容</p>;
};

let consoleError: MockInstance<typeof console.error>;

beforeEach(() => {
  // React 會把攔下來的例外原樣印到 console.error，測試輸出會很吵。
  consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ErrorBoundary', () => {
  it('沒有錯誤時完全不介入', () => {
    render(
      <ErrorBoundary scope="test">
        <Boom shouldThrow={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('正常內容')).toBeInTheDocument();
  });

  it('子樹爆掉時顯示可以往下走的畫面，而不是空白', () => {
    render(
      <ErrorBoundary scope="test">
        <Boom shouldThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('heading', { name: '這一頁出了點問題' })).toBeInTheDocument();
    // 家長最需要知道的是「資料還在」，其次才是怎麼繼續。
    expect(screen.getByText(/你的紀錄都還在/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /重新載入/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '回所有服務' })).toBeInTheDocument();
  });

  it('ownsMain 時，錯誤畫面自己就是那一頁的 <main>', () => {
    render(
      <ErrorBoundary scope="littleguard" ownsMain>
        <Boom shouldThrow />
      </ErrorBoundary>,
    );

    // 自帶版面的路由，<main> 是頁面自己畫的，而壞掉的正是那個頁面：
    // 少了這一層，錯誤畫面會是一頁沒有任何地標可以跳的內容。
    expect(screen.getAllByRole('main')).toHaveLength(1);
  });

  it('外框已經提供 <main> 時不再多一個', () => {
    render(
      <ErrorBoundary scope="littlesteps/report">
        <Boom shouldThrow />
      </ErrorBoundary>,
    );

    // 巢狀的兩個 main 和一個都沒有一樣是錯的。
    expect(screen.queryAllByRole('main')).toHaveLength(0);
  });

  it('把錯誤記下來，而不是安靜吞掉', () => {
    render(
      <ErrorBoundary scope="littlesteps/clinic-summary">
        <Boom shouldThrow />
      </ErrorBoundary>,
    );

    // 線上的白畫面沒有人會回報，只會被關掉；沒有這行就永遠查不到。
    expect(
      consoleError.mock.calls.some((call) =>
        String(call[0]).includes('littlesteps/clinic-summary'),
      ),
    ).toBe(true);
  });

  it('換頁後不會被困在錯誤畫面——key 一變就重新掛載', () => {
    const { rerender } = render(
      <ErrorBoundary key="page-a" scope="page-a">
        <Boom shouldThrow />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('heading', { name: '這一頁出了點問題' })).toBeInTheDocument();

    rerender(
      <ErrorBoundary key="page-b" scope="page-b">
        <Boom shouldThrow={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('正常內容')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '這一頁出了點問題' })).toBeNull();
  });

  describe('離線或 chunk 沒載進來', () => {
    // Vite 的動態 import 失敗時 Chrome 丟的就是這一句。
    const ChunkBoom = () => {
      throw new TypeError(
        'Failed to fetch dynamically imported module: https://example.test/assets/Page-abc.js',
      );
    };
    const OFFLINE_COPY = '現在沒有網路，這一頁還沒存在手機上。連上網路後再開一次。';

    it('chunk 沒載進來：說沒有網路，不提紀錄', () => {
      render(
        <ErrorBoundary scope="littlebloom/wiki">
          <ChunkBoom />
        </ErrorBoundary>,
      );

      expect(screen.getByText(OFFLINE_COPY)).toBeInTheDocument();
      // 未登入的訪客也會看到這一頁；「你的紀錄都還在」對他沒有意義。
      expect(screen.queryByText(/紀錄/)).toBeNull();
      expect(screen.queryByRole('heading', { name: '這一頁出了點問題' })).toBeNull();
    });

    it('裝置知道自己離線時不叫人重新載入：離線重新載入會把整個 app 弄丟', () => {
      vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(false);
      window.history.replaceState(null, '', '/littlebloom/wiki');

      render(
        <ErrorBoundary scope="littlebloom/wiki">
          <ChunkBoom />
        </ErrorBoundary>,
      );

      expect(screen.getByText(OFFLINE_COPY)).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /重新載入/ })).toBeNull();

      // 回所有服務是 app 內換頁（離線時整頁重新載入就回不來了）。
      fireEvent.click(screen.getByRole('button', { name: '回所有服務' }));
      expect(window.location.pathname).toBe('/');
    });

    it('離線時其他錯誤也用同一段說明', () => {
      vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(false);

      render(
        <ErrorBoundary scope="test">
          <Boom shouldThrow />
        </ErrorBoundary>,
      );

      expect(screen.getByText(OFFLINE_COPY)).toBeInTheDocument();
      expect(screen.queryByText(/你的紀錄都還在/)).toBeNull();
    });

    it('連著網路時 chunk 沒載進來，仍然留著重新載入：剛部署完的舊分頁要靠它', () => {
      render(
        <ErrorBoundary scope="littlebloom/wiki">
          <ChunkBoom />
        </ErrorBoundary>,
      );

      expect(screen.getByRole('button', { name: /重新載入/ })).toBeInTheDocument();
    });
  });
});
