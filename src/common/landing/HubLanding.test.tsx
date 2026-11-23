import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HubLanding from './HubLanding';
import { SERVICE_GROUPS, SERVICE_PITCH, STAGE_RANGE, STAGED_SERVICES } from './serviceCopy';
import { COVERAGE } from '../about/dataSources';
import { MAX_CHILDREN } from '../childLimits';
import { requiresAuth } from '../routePolicy';
import { SERVICE_ORDER, SERVICE_THEME } from '../ui/serviceTheme';

/**
 * The landing page is the only place a parent can discover the other
 * services: no sub-app links to a sibling, and the LittleSteps sidebar is
 * scoped to LittleSteps routes by type. A card that goes missing here makes
 * that service unreachable without hand-editing the URL.
 */

const SIGNED_IN = { uid: 'u1' } as never;

/**
 * The whole card is the tap target, so the way in is the `role="button"`
 * around the heading and not a button inside the card.
 */
function cardOf(role: string): HTMLElement {
  const card = screen.getByRole('heading', { name: role }).closest('[role="button"]');
  expect(card, `the ${role} card is not a tap target`).not.toBeNull();
  return card as HTMLElement;
}

describe('HubLanding: the six services', () => {
  it('groups cover every service exactly once', () => {
    const grouped = SERVICE_GROUPS.flatMap((group) => group.ids);
    expect([...grouped].sort()).toEqual([...SERVICE_ORDER].sort());
    expect(new Set(grouped).size, 'a service is listed in two groups').toBe(grouped.length);
  });

  it('gives every service a card that names it and says what it does', () => {
    render(<HubLanding onNavigate={vi.fn()} />);
    for (const id of SERVICE_ORDER) {
      const theme = SERVICE_THEME[id];
      const card = cardOf(theme.role);
      // The role leads, but the wordmark a parent may have heard of is there too.
      expect(card, id).toHaveTextContent(theme.name);
      expect(card, id).toHaveTextContent(SERVICE_PITCH[id]);
    }
  });

  it('opens the service wherever on the card the tap lands', async () => {
    const user = userEvent.setup();
    for (const id of SERVICE_ORDER) {
      const onNavigate = vi.fn();
      const { unmount } = render(<HubLanding onNavigate={onNavigate} />);

      // The description line: the part of the card furthest from its heading.
      await user.click(screen.getByText(SERVICE_PITCH[id]));
      expect(onNavigate, id).toHaveBeenCalledWith(id);

      unmount();
    }
  });

  it('lets the keyboard into a card with Enter or Space', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<HubLanding onNavigate={onNavigate} />);

    for (const id of SERVICE_ORDER) {
      expect(cardOf(SERVICE_THEME[id].role), id).toHaveAttribute('tabindex', '0');
    }

    const card = cardOf(SERVICE_THEME.babyoasis.role);
    card.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onNavigate.mock.calls).toEqual([['babyoasis'], ['babyoasis']]);
  });

  it('puts no second way in inside a card', () => {
    render(<HubLanding onNavigate={vi.fn()} />);
    for (const id of SERVICE_ORDER) {
      expect(cardOf(SERVICE_THEME[id].role).querySelectorAll('button, a').length, id).toBe(0);
    }
  });

  it('tells the three staged services apart by age range', () => {
    // 「寶寶成長」 and 「幼兒期陪伴」 alone cannot place a fifteen-month-old.
    render(<HubLanding onNavigate={vi.fn()} />);
    for (const id of STAGED_SERVICES) {
      expect(cardOf(SERVICE_THEME[id].role), id).toHaveTextContent(STAGE_RANGE[id]);
    }
  });

  it('only promises "no sign-in" for services routePolicy really leaves public', () => {
    // The heading is a promise. The day a service in that group moves behind
    // sign-in, the landing page would be lying.
    const promising = SERVICE_GROUPS.filter((group) => group.title.includes('不用登入'));
    expect(promising, 'no group promises this any more; update the rule').toHaveLength(1);
    for (const id of promising[0].ids) {
      expect(requiresAuth(id), `${id} needs sign-in but its group says it does not`).toBe(false);
    }
  });

  it('marks the current stage on one card only, and on none without a child', () => {
    const { unmount } = render(<HubLanding onNavigate={vi.fn()} currentService="littlesteps" />);
    expect(cardOf(SERVICE_THEME.littlesteps.role)).toHaveTextContent('目前階段');
    expect(screen.getAllByText('目前階段')).toHaveLength(1);
    unmount();

    render(<HubLanding onNavigate={vi.fn()} />);
    expect(screen.queryByText('目前階段')).not.toBeInTheDocument();
  });
});

describe('HubLanding: signed out', () => {
  it('has exactly one h1', () => {
    render(<HubLanding onNavigate={vi.fn()} user={null} onSignIn={vi.fn()} />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('offers sign-in as the primary action', async () => {
    const user = userEvent.setup();
    const onSignIn = vi.fn(async () => {});
    render(<HubLanding onNavigate={vi.fn()} user={null} onSignIn={onSignIn} />);

    await user.click(screen.getByRole('button', { name: /使用 Google 帳號開始記錄/ }));
    expect(onSignIn).toHaveBeenCalledTimes(1);
  });

  it('offers a way in that needs no account, and it really needs none', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<HubLanding onNavigate={onNavigate} user={null} onSignIn={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /先不登入/ }));

    expect(onNavigate).toHaveBeenCalledTimes(1);
    const [destination] = onNavigate.mock.calls[0];
    expect(requiresAuth(destination), `${destination} would bounce to an intro page`).toBe(false);
  });

  it('never says "free" without the child limit beside it', () => {
    render(<HubLanding onNavigate={vi.fn()} user={null} onSignIn={vi.fn()} />);
    const mentions = screen.getAllByText(/免費/);
    expect(mentions.length).toBeGreaterThan(0);
    for (const mention of mentions) {
      expect(mention.textContent).toContain(`${MAX_CHILDREN} 個寶寶`);
    }
  });

  it('shows coverage numbers that come from the checked list, not typed ones', () => {
    render(<HubLanding onNavigate={vi.fn()} user={null} onSignIn={vi.fn()} />);
    const strip = screen.getByRole('region', { name: '資料涵蓋範圍' });

    const shown = within(strip)
      .getAllByRole('definition')
      .map((node) => Number(node.textContent?.replace(/,/g, '')));
    expect(shown.length).toBeGreaterThanOrEqual(4);
    // `dataSources.test.ts` holds every COVERAGE value against its dataset.
    const checked = COVERAGE.map((item) => item.value as number);
    for (const value of shown) expect(checked).toContain(value);
  });

  it('does not headline the radar, whose dataset can be weeks behind', () => {
    render(<HubLanding onNavigate={vi.fn()} user={null} onSignIn={vi.fn()} />);
    const strip = screen.getByRole('region', { name: '資料涵蓋範圍' });
    expect(strip).not.toHaveTextContent('傳染病');
  });

  it('makes the whole trust panel the way into the about page', async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', '/');
    render(<HubLanding onNavigate={vi.fn()} user={null} onSignIn={vi.fn()} />);

    const panel = screen.getByRole('button', { name: /孩子的紀錄誰看得到/ });
    expect(panel).toHaveAttribute('tabindex', '0');
    // What the database rules actually grant: the family, not one person.
    expect(panel).toHaveTextContent('你邀請的人');
    expect(panel.textContent).not.toMatch(/僅限本人|永久免費|企業級加密/);

    await user.click(panel);
    expect(window.location.pathname).toBe('/about');
  });
});

describe('HubLanding: signed in', () => {
  it('leads with the child and opens their records in one tap', async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();
    render(
      <HubLanding
        onNavigate={vi.fn()}
        user={SIGNED_IN}
        onSignIn={vi.fn()}
        currentService="littleexplorer"
        childName="小米"
        onContinue={onContinue}
      />,
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('小米');
    await user.click(screen.getByRole('button', { name: '打開紀錄' }));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('asks for a first child instead when there is none', async () => {
    const user = userEvent.setup();
    const onAddChild = vi.fn();
    render(
      <HubLanding onNavigate={vi.fn()} user={SIGNED_IN} onSignIn={vi.fn()} onAddChild={onAddChild} />,
    );

    expect(screen.queryByRole('button', { name: '打開紀錄' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '新增寶寶' }));
    expect(onAddChild).toHaveBeenCalledTimes(1);
  });

  it('drops the pitch: no sign-in, no proof strip, no trust panel', () => {
    render(
      <HubLanding
        onNavigate={vi.fn()}
        user={SIGNED_IN}
        onSignIn={vi.fn()}
        childName="小米"
        onContinue={vi.fn()}
      />,
    );

    expect(screen.queryByRole('button', { name: /使用 Google 帳號開始記錄/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: '資料涵蓋範圍' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /孩子的紀錄誰看得到/ })).not.toBeInTheDocument();
    // The six services are still all there.
    for (const id of SERVICE_ORDER) cardOf(SERVICE_THEME[id].role);
  });

  it('keeps the about page reachable from the footer', async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', '/');
    render(<HubLanding onNavigate={vi.fn()} user={SIGNED_IN} childName="小米" onContinue={vi.fn()} />);

    await user.click(screen.getByRole('link', { name: '關於資料與來源' }));
    expect(window.location.pathname).toBe('/about');
  });
});
