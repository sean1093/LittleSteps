import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ServiceLandingPage from './ServiceLandingPage';

/**
 * Every service must be able to introduce itself to someone with no account.
 * Before this page existed, a logged-out visitor hit one blanket wall showing
 * LittleSteps' landing no matter which service they had asked for.
 */
describe('ServiceLandingPage', () => {
  const SERVICES = [
    { id: 'littlebloom', name: 'LittleBloom', publicLink: '先看孕期知識庫', hash: '#/littlebloom/wiki' },
    { id: 'littleexplorer', name: 'LittleExplorer', publicLink: '先看幼兒百科', hash: '#/littleexplorer/wiki' },
  ] as const;

  it.each(SERVICES)('$name 介紹自己並提供登入', async ({ id, name }) => {
    const user = userEvent.setup();
    const onSignIn = vi.fn(async () => {});
    render(<ServiceLandingPage service={id} onSignIn={onSignIn} />);

    expect(screen.getByRole('heading', { name })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /使用 Google 登入開始使用/ }));
    expect(onSignIn).toHaveBeenCalled();
  });

  it.each(SERVICES)('$name 提供不需登入就能看的內容入口', async ({ id, publicLink, hash }) => {
    const user = userEvent.setup();
    window.location.hash = '#/';
    render(<ServiceLandingPage service={id} onSignIn={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: new RegExp(publicLink) }));

    expect(window.location.hash).toBe(hash);
  });

  it.each(SERVICES)('$name 可回到服務集合的進入點', async ({ id }) => {
    const user = userEvent.setup();
    window.location.hash = '#/littleexplorer';
    render(<ServiceLandingPage service={id} onSignIn={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: '所有服務' }));

    expect(window.location.hash).toBe('#/');
  });

  it('說明哪些功能需要登入，哪些不用', () => {
    render(<ServiceLandingPage service="littleexplorer" onSignIn={vi.fn()} />);
    expect(
      screen.getByText(/記錄功能需要登入才能跨裝置同步，知識內容不需登入即可閱讀/),
    ).toBeInTheDocument();
  });
});
