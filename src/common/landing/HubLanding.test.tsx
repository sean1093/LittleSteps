import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HubLanding from './HubLanding';
import { SHARING_REMOVAL } from './serviceCopy';
import {
  ANYTIME_SERVICES,
  CALCULATORS,
  CALCULATORS_HEADING,
  GUIDE_LINKS,
  SERVICE_GROUPS,
  SERVICE_PITCH,
  STAGE_RANGE,
  STAGED_SERVICES,
  TOOL_FIGURE,
  WIKI_LINKS,
} from './serviceCopy';
import { ROUTE_PATH } from '../../types/routes';
import { MAX_CHILDREN } from '../childLimits';
import { requiresAuth } from '../routePolicy';
import { SERVICE_ORDER, SERVICE_THEME } from '../ui/serviceTheme';

/**
 * The landing page is the only place a parent can discover the other
 * services: no sub-app links to a sibling, and the LittleSteps sidebar is
 * scoped to LittleSteps routes by type. An entry that goes missing here makes
 * that service unreachable without hand-editing the URL.
 */

const SIGNED_IN = { uid: 'u1' } as never;

/**
 * Each service is one link, and the whole entry is the link: the heading that
 * names it sits inside the anchor.
 */
function entryOf(role: string): HTMLAnchorElement {
  const link = screen.getByRole('heading', { name: role }).closest('a');
  expect(link, `the ${role} entry is not a link`).not.toBeNull();
  return link as HTMLAnchorElement;
}

const ENGLISH_NAMES = /LittleBloom|LittleExplorer|BabyOasis|LittleOuting|LittleGuard/;

describe('HubLanding: the six services', () => {
  it('groups cover every service exactly once', () => {
    const grouped = SERVICE_GROUPS.flatMap((group) => group.ids);
    expect([...grouped].sort()).toEqual([...SERVICE_ORDER].sort());
    expect(new Set(grouped).size, 'a service is listed in two groups').toBe(grouped.length);
  });

  it('gives every service an entry that names it and says what it does', () => {
    render(<HubLanding onNavigate={vi.fn()} />);
    for (const id of SERVICE_ORDER) {
      expect(entryOf(SERVICE_THEME[id].role), id).toHaveTextContent(SERVICE_PITCH[id]);
    }
  });

  it('names a service by what it does, not by an English sub-brand', () => {
    // The pages these entries open are titled by role as well; a name here
    // that the destination never repeats is a name the parent has to map.
    const { container } = render(<HubLanding onNavigate={vi.fn()} user={null} onSignIn={vi.fn()} />);
    expect(container.textContent).not.toMatch(ENGLISH_NAMES);
  });

  it('makes every entry a real link to that service', () => {
    render(<HubLanding onNavigate={vi.fn()} />);
    for (const id of SERVICE_ORDER) {
      expect(entryOf(SERVICE_THEME[id].role), id).toHaveAttribute('href', ROUTE_PATH[id]);
    }
  });

  it('opens the service wherever in the entry the tap lands', async () => {
    const user = userEvent.setup();
    for (const id of SERVICE_ORDER) {
      const onNavigate = vi.fn();
      const { unmount } = render(<HubLanding onNavigate={onNavigate} />);

      // The description line: the part of the entry furthest from its heading.
      await user.click(screen.getByText(SERVICE_PITCH[id]));
      expect(onNavigate, id).toHaveBeenCalledWith(id);

      unmount();
    }
  });

  it('leaves a new-tab click to the browser', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<HubLanding onNavigate={onNavigate} />);

    await user.keyboard('{Control>}');
    await user.click(entryOf(SERVICE_THEME.babyoasis.role));
    await user.keyboard('{/Control}');

    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('puts no second way in inside an entry', () => {
    render(<HubLanding onNavigate={vi.fn()} />);
    for (const id of SERVICE_ORDER) {
      expect(entryOf(SERVICE_THEME[id].role).querySelectorAll('button, a').length, id).toBe(0);
    }
  });

  it('tells the three staged services apart by age range, in the order a child passes through them', () => {
    // 「寶寶成長」 and 「幼兒期陪伴」 alone cannot place a fifteen-month-old.
    render(<HubLanding onNavigate={vi.fn()} />);
    for (const id of STAGED_SERVICES) {
      expect(entryOf(SERVICE_THEME[id].role), id).toHaveTextContent(STAGE_RANGE[id]);
    }

    const sequence = screen.getAllByRole('list').find((list) => list.tagName === 'OL');
    expect(sequence, 'the stages are not an ordered list').toBeDefined();
    const roles = within(sequence as HTMLElement)
      .getAllByRole('heading', { level: 3 })
      .map((node) => node.textContent);
    expect(roles).toEqual(STAGED_SERVICES.map((id) => SERVICE_THEME[id].role));
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

  it('marks the current stage on one entry only, and on none without a child', () => {
    const { unmount } = render(<HubLanding onNavigate={vi.fn()} currentService="littlesteps" />);
    expect(entryOf(SERVICE_THEME.littlesteps.role)).toHaveTextContent('目前階段');
    expect(screen.getAllByText('目前階段')).toHaveLength(1);
    unmount();

    render(<HubLanding onNavigate={vi.fn()} />);
    expect(screen.queryByText('目前階段')).not.toBeInTheDocument();
  });
});

describe('HubLanding: signed out', () => {
  it('makes the same sharing promise the share sheet makes', () => {
    render(<HubLanding onNavigate={vi.fn()} user={null} onSignIn={vi.fn()} />);
    expect(screen.getByText(SHARING_REMOVAL, { exact: false })).toBeInTheDocument();
  });

  it('has exactly one h1', () => {
    render(<HubLanding onNavigate={vi.fn()} user={null} onSignIn={vi.fn()} />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('offers sign-in as the one button in the hero', async () => {
    const user = userEvent.setup();
    const onSignIn = vi.fn(async () => {});
    render(<HubLanding onNavigate={vi.fn()} user={null} onSignIn={onSignIn} />);

    await user.click(screen.getByRole('button', { name: '用 Google 登入，開始記錄' }));
    expect(onSignIn).toHaveBeenCalledTimes(1);

    // The trust panel is the only other thing with a button role, and it is
    // far below. A second button beside sign-in is what was cut.
    const buttons = screen.getAllByRole('button').map((node) => node.getAttribute('aria-label') ?? node.textContent);
    expect(buttons).toHaveLength(2);
  });

  it('puts what needs no account before what does, and it really needs none', () => {
    render(<HubLanding onNavigate={vi.fn()} user={null} onSignIn={vi.fn()} />);

    const headings = screen.getAllByRole('heading', { level: 2 }).map((node) => node.textContent);
    const [tools, staged] = SERVICE_GROUPS;
    expect(headings[0]).toBe(tools.title);
    expect(headings[0]).toContain('不用登入');
    // The calculators need no account either, so they also come before the
    // services that do.
    expect(headings.indexOf(CALCULATORS_HEADING.title)).toBeLessThan(headings.indexOf(staged.title));
    expect(headings.indexOf(tools.title)).toBeLessThan(headings.indexOf(CALCULATORS_HEADING.title));

    for (const id of ANYTIME_SERVICES) {
      expect(requiresAuth(id), `${id} would bounce to an intro page`).toBe(false);
    }
  });

  it('sets each public tool under the one number it stands on', () => {
    // The numbers used to sit in a strip of their own and again in the cards.
    // serviceCopy.test.ts holds each figure against its dataset.
    render(<HubLanding onNavigate={vi.fn()} user={null} onSignIn={vi.fn()} />);
    for (const id of ANYTIME_SERVICES) {
      expect(entryOf(SERVICE_THEME[id].role), id).toHaveTextContent(TOOL_FIGURE[id]);
      expect(screen.getAllByText(TOOL_FIGURE[id]), id).toHaveLength(1);
    }
    expect(screen.queryByRole('region', { name: '資料涵蓋範圍' })).not.toBeInTheDocument();
  });

  it('links straight to the three knowledge bases, with their real article counts', async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', '/');
    render(<HubLanding onNavigate={vi.fn()} user={null} onSignIn={vi.fn()} />);

    expect(WIKI_LINKS).toHaveLength(3);
    for (const { page, title, count } of WIKI_LINKS) {
      expect(requiresAuth(page), `${page} is behind sign-in`).toBe(false);
      const link = screen.getByRole('link', { name: `${title} ${count} 篇` });
      expect(link).toHaveAttribute('href', ROUTE_PATH[page]);
    }

    const [first] = WIKI_LINKS;
    await user.click(screen.getByRole('link', { name: `${first.title} ${first.count} 篇` }));
    expect(window.location.pathname).toBe(ROUTE_PATH[first.page]);
    window.history.replaceState(null, '', '/');
  });

  it('offers each calculator as a link to a page that really needs no account', async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', '/');
    render(<HubLanding onNavigate={vi.fn()} user={null} onSignIn={vi.fn()} />);

    expect(CALCULATORS.length).toBeGreaterThan(0);
    for (const { page, title, line } of CALCULATORS) {
      // The section says "no sign-in"; a calculator behind the gate would make it a lie.
      expect(requiresAuth(page), `${page} is behind sign-in`).toBe(false);
      const link = screen.getByRole('heading', { name: title }).closest('a');
      expect(link, title).toHaveAttribute('href', ROUTE_PATH[page]);
      expect(link, title).toHaveTextContent(line);
    }

    const [first] = CALCULATORS;
    await user.click(screen.getByText(first.line));
    expect(window.location.pathname).toBe(ROUTE_PATH[first.page]);
    window.history.replaceState(null, '', '/');
  });

  it('links to the public guides beside the knowledge bases', () => {
    render(<HubLanding onNavigate={vi.fn()} user={null} onSignIn={vi.fn()} />);

    for (const { page, title } of GUIDE_LINKS) {
      expect(requiresAuth(page), `${page} is behind sign-in`).toBe(false);
      expect(screen.getByRole('link', { name: title })).toHaveAttribute('href', ROUTE_PATH[page]);
    }
  });

  it('says the staged services need an account', () => {
    render(<HubLanding onNavigate={vi.fn()} user={null} onSignIn={vi.fn()} />);
    expect(screen.getByText(/^需要登入。/)).toBeInTheDocument();
  });

  it('tells a second carer there is a way in for them', () => {
    render(<HubLanding onNavigate={vi.fn()} user={null} onSignIn={vi.fn()} />);
    expect(screen.getByText(/登入後用代碼加入/)).toBeInTheDocument();
  });

  it('never says "free" without the child limit beside it', () => {
    render(<HubLanding onNavigate={vi.fn()} user={null} onSignIn={vi.fn()} />);
    const mentions = screen.getAllByText(/免費/);
    expect(mentions.length).toBeGreaterThan(0);
    for (const mention of mentions) {
      expect(mention.textContent).toContain(`${MAX_CHILDREN} 個寶寶`);
    }
  });

  it('does not claim the radar is current, only what it covers', () => {
    // Its dataset can be weeks behind; "seven diseases" is true on that day too.
    render(<HubLanding onNavigate={vi.fn()} user={null} onSignIn={vi.fn()} />);
    expect(entryOf(SERVICE_THEME.littleguard.role).textContent).not.toMatch(/這週|本週|最新|即時/);
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

  it('says "not medical advice" once, not in every section', () => {
    render(<HubLanding onNavigate={vi.fn()} user={null} onSignIn={vi.fn()} />);
    expect(screen.getAllByText(/不能取代醫師的判斷/)).toHaveLength(1);
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

  it('drops the pitch: no sign-in, no sign-in note, no trust panel', () => {
    render(
      <HubLanding
        onNavigate={vi.fn()}
        user={SIGNED_IN}
        onSignIn={vi.fn()}
        childName="小米"
        onContinue={vi.fn()}
      />,
    );

    expect(screen.queryByRole('button', { name: /Google/ })).not.toBeInTheDocument();
    expect(screen.queryByText(/^需要登入。/)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /孩子的紀錄誰看得到/ })).not.toBeInTheDocument();
    // The six services are still all there.
    for (const id of SERVICE_ORDER) entryOf(SERVICE_THEME[id].role);
  });

  it('keeps the about page reachable from the footer', async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', '/');
    render(<HubLanding onNavigate={vi.fn()} user={SIGNED_IN} childName="小米" onContinue={vi.fn()} />);

    await user.click(screen.getByRole('link', { name: '關於資料與來源' }));
    expect(window.location.pathname).toBe('/about');
  });
});
