import { describe, expect, it } from 'vitest';
import { inAppBrowser, withOpenExternalBrowser } from './inAppBrowser';

describe('inAppBrowser', () => {
  it('tells LINE apart from the other webviews and from a real browser', () => {
    expect(inAppBrowser('Mozilla/5.0 (Linux; Android 14; wv) Chrome/130.0 Mobile Safari/537.36 Line/14.1.0')).toBe('line');
    expect(inAppBrowser('Mozilla/5.0 (iPhone) Mobile/15E148 [FBAN/FBIOS;FBAV/480.0]')).toBe('other');
    expect(inAppBrowser('Mozilla/5.0 (iPhone) Mobile/15E148 Instagram 300.0')).toBe('other');
    expect(inAppBrowser('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Version/17.0 Mobile/15E148 Safari/604.1')).toBeNull();
    expect(inAppBrowser('Mozilla/5.0 (Linux; Android 14; Pixel 8) Chrome/130.0 Mobile Safari/537.36')).toBeNull();
  });
});

describe('withOpenExternalBrowser', () => {
  it('adds the parameter LINE reads, keeping the path, the other parameters and the hash', () => {
    expect(withOpenExternalBrowser('https://example.com/littleguard?d=flu#top')).toBe(
      'https://example.com/littleguard?d=flu&openExternalBrowser=1#top',
    );
  });
});
