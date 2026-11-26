import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ServiceIntro from './ServiceIntro';
import { SERVICE_INTRO, SHARING_REMOVAL, STAGE_RANGE, STAGED_SERVICES } from './serviceCopy';
import { MAX_CHILDREN } from '../childLimits';
import { requiresAuth, serviceOf, SERVICE_HOME } from '../routePolicy';
import { SERVICE_THEME } from '../ui/serviceTheme';
import { ROUTE_PATH, type Page } from '../../types/routes';

/**
 * Every gated service must be able to introduce itself to someone with no
 * account, at the URL they asked for. All three share one template, so every
 * case below runs for each of them.
 */
describe.each(STAGED_SERVICES)('ServiceIntro: %s', (service) => {
  const theme = SERVICE_THEME[service];
  const intro = SERVICE_INTRO[service];

  it('names the service by role and age range, not by an English sub-brand', () => {
    const { container } = render(<ServiceIntro service={service} onSignIn={vi.fn()} />);

    expect(screen.getByRole('heading', { level: 1, name: theme.role })).toBeInTheDocument();
    expect(screen.getByText(STAGE_RANGE[service])).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/LittleBloom|LittleExplorer|LittleSteps/);
    expect(screen.getByText(intro.promise)).toBeInTheDocument();
  });

  it('starts sign-in from its one primary button', async () => {
    const user = userEvent.setup();
    const onSignIn = vi.fn(async () => {});
    render(<ServiceIntro service={service} onSignIn={onSignIn} />);

    await user.click(screen.getByRole('button', { name: /^使用 Google 登入/ }));
    expect(onSignIn).toHaveBeenCalledTimes(1);
  });

  it('says what signing in unlocks, item by item', () => {
    render(<ServiceIntro service={service} onSignIn={vi.fn()} />);
    expect(intro.features.length).toBeGreaterThan(0);
    for (const feature of intro.features) {
      expect(screen.getByText(feature.title)).toBeInTheDocument();
      expect(screen.getByText(feature.detail)).toBeInTheDocument();
    }
  });

  /**
   * Which pages belong under "readable without an account" is not this
   * page's call. The rule is `routePolicy`: every public page of the service
   * other than its home. Deriving the list means a page dropped from the copy
   * turns this red, which a hand-copied list of titles would not.
   */
  it('lists every page of the service that needs no account, and only those', () => {
    const readable = (Object.keys(ROUTE_PATH) as Page[]).filter(
      (page) =>
        serviceOf(page) === service && page !== SERVICE_HOME[service] && !requiresAuth(page),
    );
    expect(intro.publicContent.map((item) => item.page).sort()).toEqual([...readable].sort());
  });

  it('takes each of those links to its own page without asking for sign-in', async () => {
    const user = userEvent.setup();
    const onSignIn = vi.fn(async () => {});
    render(<ServiceIntro service={service} onSignIn={onSignIn} />);

    for (const item of intro.publicContent) {
      window.history.replaceState(null, '', ROUTE_PATH[SERVICE_HOME[service]]);
      await user.click(screen.getByRole('button', { name: new RegExp(`^${item.title}`) }));
      expect(window.location.pathname, item.title).toBe(ROUTE_PATH[item.page]);
    }
    expect(onSignIn).not.toHaveBeenCalled();
  });

  it('leads back to the landing page, the only route to the other services', async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', ROUTE_PATH[SERVICE_HOME[service]]);
    render(<ServiceIntro service={service} onSignIn={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: '所有服務' }));
    expect(window.location.pathname).toBe('/');
  });

  /**
   * This page returns before the shell in `App.tsx` supplies any landmark, so
   * it owes both. The banner holds a labelled link, which is why it is a
   * landmark worth having; an icon-only button there named nothing.
   */
  it('renders exactly one main and one banner', () => {
    render(<ServiceIntro service={service} onSignIn={vi.fn()} />);
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getAllByRole('banner')).toHaveLength(1);
  });

  it('never says "free" without the child limit beside it', () => {
    render(<ServiceIntro service={service} onSignIn={vi.fn()} />);
    const mentions = screen.getAllByText(/免費/);
    expect(mentions.length).toBeGreaterThan(0);
    for (const mention of mentions) {
      expect(mention.textContent).toContain(`${MAX_CHILDREN} 個寶寶`);
    }
  });

  /**
   * Access hangs on `children/$childId/members`: the record belongs to the
   * family and members are equals. The page once said 「僅限本人存取」, the
   * opposite of the database rules, on the paragraph a parent decides by.
   */
  it('describes shared family access and claims nothing the rules do not grant', async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', ROUTE_PATH[SERVICE_HOME[service]]);
    const { container } = render(<ServiceIntro service={service} onSignIn={vi.fn()} />);

    expect(container.textContent).not.toMatch(/僅限本人存取|永久免費|企業級加密/);
    const link = screen.getByRole('link', { name: /這份紀錄屬於你們家/ });
    expect(link).toHaveTextContent('分享代碼');
    // The same promise the share sheet makes, read from the one shared sentence.
    expect(link).toHaveTextContent(SHARING_REMOVAL);

    await user.click(link);
    expect(window.location.pathname).toBe('/about');
  });
});
