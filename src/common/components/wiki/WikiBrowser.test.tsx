import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { WikiArticle, WikiCategoryColors } from '../../../types';
import { SERVICE_THEME } from '../../ui/serviceTheme';
import WikiBrowser from './WikiBrowser';
import type { WikiPage } from '../../../types/routes';

/**
 * What a parent meets when they open an article: whether to go to hospital
 * comes first, and the articles it points to can be opened from there.
 */

type Category = 'fever' | 'skin';

const COLORS: Record<Category, WikiCategoryColors> = {
  fever: { pill: 'bg-primary-light text-primary-dark', text: 'text-primary-dark' },
  skin: { pill: 'bg-mint-light text-mint-dark', text: 'text-mint-dark' },
} as Record<Category, WikiCategoryColors>;

const ARTICLES: WikiArticle<Category>[] = [
  {
    id: 'fever',
    title: '發燒判斷',
    summary: '怎麼量、什麼時候就醫。',
    category: 'fever',
    causes: ['病毒感染'],
    solutions: [{ step: '量體溫', detail: '用耳溫槍或肛溫計。' }],
    warningSignals: ['未滿 3 個月體溫 38°C 以上'],
    relatedArticleIds: ['rash', 'gone'],
    icon: 'Thermometer',
  },
  {
    id: 'rash',
    title: '尿布疹',
    summary: '屁股紅。',
    category: 'skin',
    causes: ['潮濕'],
    solutions: [{ step: '保持乾爽', detail: '勤換尿布。' }],
    warningSignals: ['破皮滲液'],
    relatedArticleIds: [],
    icon: 'Baby',
  },
];

function renderBrowser(wikiPage?: WikiPage) {
  const user = userEvent.setup();
  render(
    <WikiBrowser
      wikiPage={wikiPage}
      articles={ARTICLES}
      categoryLabels={{ fever: '發燒與感冒', skin: '皮膚問題' }}
      categoryColors={COLORS}
      searchPlaceholder="搜尋"
      theme={SERVICE_THEME.littlesteps}
    />,
  );
  return user;
}

/** The whole article: its header row and, once open, everything under it. */
const card = (title: string) => screen.getByRole('article', { name: title });

/**
 * The disclosure button inside the article's title heading: the only control
 * that opens and closes the article.
 */
const header = (title: string) =>
  within(screen.getByRole('heading', { level: 3, name: title })).getByRole('button');

describe('WikiBrowser: an open article', () => {
  it('puts the see-a-doctor signs before causes and steps', async () => {
    const user = renderBrowser();
    await user.click(header('發燒判斷'));

    const headings = within(card('發燒判斷'))
      .getAllByRole('heading', { level: 4 })
      .map((node) => node.textContent);
    expect(headings.indexOf('就醫警訊')).toBe(0);
    expect(headings.indexOf('就醫警訊')).toBeLessThan(headings.indexOf('處理方式'));
  });

  it('names its related articles and leaves out ids that resolve to nothing', async () => {
    const user = renderBrowser();
    await user.click(header('發燒判斷'));

    const section = within(card('發燒判斷')).getByRole('heading', { name: '相關文章' })
      .parentElement as HTMLElement;
    const related = within(section).getAllByRole('button');
    expect(related.map((node) => node.textContent)).toEqual(['尿布疹']);
  });

  it('opens a related article in place, without collapsing into a dead end', async () => {
    const user = renderBrowser();
    await user.click(header('發燒判斷'));
    await user.click(within(card('發燒判斷')).getByRole('button', { name: '尿布疹' }));

    expect(header('尿布疹')).toHaveAttribute('aria-expanded', 'true');
    expect(within(card('尿布疹')).getByText('破皮滲液')).toBeInTheDocument();
  });

  it('reaches a related article even when the current filter would hide it', async () => {
    const user = renderBrowser();
    // Narrow to a category the target is not in, then follow the link.
    await user.click(screen.getByRole('button', { name: '發燒與感冒' }));
    // The filtered-out card animates away, so wait for it to be gone.
    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: '尿布疹' })).not.toBeInTheDocument(),
    );

    await user.click(header('發燒判斷'));
    await user.click(within(card('發燒判斷')).getByRole('button', { name: '尿布疹' }));

    expect(header('尿布疹')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: '全部' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows no related section for an article that points nowhere', async () => {
    const user = renderBrowser();
    await user.click(header('尿布疹'));
    expect(within(card('尿布疹')).queryByRole('heading', { name: '相關文章' })).not.toBeInTheDocument();
  });

  it('finds an article from two words typed with a space', async () => {
    const user = renderBrowser();
    await user.type(screen.getByRole('searchbox'), '體溫 病毒');

    expect(screen.getByRole('heading', { name: '發燒判斷' })).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: '尿布疹' })).not.toBeInTheDocument(),
    );
  });
});

/**
 * Every article has a URL. The one a parent has open is the one in the address
 * bar, so it can be sent to someone else and opened again.
 */
describe('WikiBrowser: an article has its own URL', () => {
  const WIKI: WikiPage = 'littlesteps/baby-wiki';
  const at = (path: string) => window.history.replaceState(null, '', path);
  const here = () => `${window.location.pathname}${window.location.search}`;

  afterEach(() => at('/'));

  it('opens the article the URL names', () => {
    at('/littlesteps/baby-wiki/rash');
    renderBrowser(WIKI);

    expect(header('尿布疹')).toHaveAttribute('aria-expanded', 'true');
    expect(header('發燒判斷')).toHaveAttribute('aria-expanded', 'false');
  });

  it('puts the article in the address bar when it is opened, and takes it out when closed', async () => {
    at('/littlesteps/baby-wiki');
    const user = renderBrowser(WIKI);

    await user.click(header('發燒判斷'));
    expect(here()).toBe('/littlesteps/baby-wiki/fever');

    await user.click(header('發燒判斷'));
    expect(here()).toBe('/littlesteps/baby-wiki');
  });

  it('follows a related article to that article\'s URL', async () => {
    at('/littlesteps/baby-wiki/fever');
    const user = renderBrowser(WIKI);

    await user.click(within(card('發燒判斷')).getByRole('button', { name: '尿布疹' }));

    expect(here()).toBe('/littlesteps/baby-wiki/rash');
  });

  it('does not pile up history entries while a parent flips through articles', async () => {
    at('/littlesteps/baby-wiki');
    const before = window.history.length;
    const user = renderBrowser(WIKI);

    await user.click(header('發燒判斷'));
    await user.click(header('尿布疹'));

    expect(window.history.length).toBe(before);
  });

  it('shows the whole list for an id that is not an article, and cleans the URL', async () => {
    at('/littlesteps/baby-wiki/no-such-article');
    renderBrowser(WIKI);

    expect(header('發燒判斷')).toHaveAttribute('aria-expanded', 'false');
    expect(header('尿布疹')).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() => expect(here()).toBe('/littlesteps/baby-wiki'));
  });

  it('keeps a search in progress when an article is closed', async () => {
    at('/littlesteps/baby-wiki?q=%E9%AB%94%E6%BA%AB');
    const user = renderBrowser(WIKI);

    await user.click(header('發燒判斷'));
    await user.click(header('發燒判斷'));

    expect(window.location.pathname).toBe('/littlesteps/baby-wiki');
    expect(screen.getByRole('searchbox')).toHaveValue('體溫');
  });

  it('leaves the address bar alone when the page did not say which wiki it is', async () => {
    at('/somewhere');
    const user = renderBrowser();

    await user.click(header('發燒判斷'));

    expect(here()).toBe('/somewhere');
  });
});

/**
 * An open article is something a parent reads for a minute or two, often
 * one-handed. It must not close under their thumb, and it should be easy to
 * pass on.
 */
describe('WikiBrowser: reading an open article', () => {
  const at = (path: string) => window.history.replaceState(null, '', path);

  afterEach(() => at('/'));

  it('stays open when the text is tapped', async () => {
    const user = renderBrowser();
    await user.click(header('發燒判斷'));

    await user.click(within(card('發燒判斷')).getByText('用耳溫槍或肛溫計。'));

    expect(header('發燒判斷')).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes from the button at the end, where the reader finishes', async () => {
    const user = renderBrowser();
    await user.click(header('發燒判斷'));

    await user.click(within(card('發燒判斷')).getByRole('button', { name: '收起' }));

    expect(header('發燒判斷')).toHaveAttribute('aria-expanded', 'false');
  });

  it('shares the article by its own URL, not the knowledge base', async () => {
    const share = vi.fn(async () => {});
    Object.defineProperty(navigator, 'share', { value: share, configurable: true });
    at('/littlesteps/baby-wiki');
    const user = renderBrowser('littlesteps/baby-wiki');
    await user.click(header('發燒判斷'));

    await user.click(within(card('發燒判斷')).getByRole('button', { name: '分享這篇' }));

    expect(share).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '發燒判斷',
        url: expect.stringMatching(/\/littlesteps\/baby-wiki\/fever$/),
      }),
    );
    Reflect.deleteProperty(navigator, 'share');
  });

  it('offers no share button where the article has no URL to share', async () => {
    const user = renderBrowser();
    await user.click(header('發燒判斷'));

    expect(within(card('發燒判斷')).queryByRole('button', { name: '分享這篇' })).not.toBeInTheDocument();
  });
});

/**
 * A screen-reader user moves through the list by heading and hears each
 * article's name, not its whole summary (#167).
 */
describe('WikiBrowser: headings and the disclosure', () => {
  it('exposes every article title as a level-3 heading under a level-2 one', () => {
    renderBrowser();

    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(
      screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent),
    ).toEqual(['發燒判斷', '尿布疹']);
  });

  it('names each toggle by the title alone and keeps the summary out of it', () => {
    renderBrowser();

    const toggle = screen.getByRole('button', { name: '發燒判斷', expanded: false });
    expect(toggle).toBe(header('發燒判斷'));
    expect(toggle).not.toHaveTextContent('怎麼量、什麼時候就醫。');
    expect(within(card('發燒判斷')).getByText('怎麼量、什麼時候就醫。')).toBeInTheDocument();
  });

  it('labels the opened body with the heading and points the toggle at it', async () => {
    const user = renderBrowser();
    await user.click(header('發燒判斷'));

    const body = screen.getByRole('region', { name: '發燒判斷' });
    expect(header('發燒判斷')).toHaveAttribute('aria-controls', body.id);
    expect(within(body).getByRole('heading', { name: '處理方式' })).toBeInTheDocument();
  });

  it('opens and closes from the keyboard with Enter and Space', async () => {
    const user = renderBrowser();
    header('發燒判斷').focus();

    await user.keyboard('{Enter}');
    expect(header('發燒判斷')).toHaveAttribute('aria-expanded', 'true');

    header('發燒判斷').focus();
    await user.keyboard(' ');
    expect(header('發燒判斷')).toHaveAttribute('aria-expanded', 'false');
  });

  it('puts no second control inside the toggle', () => {
    renderBrowser();

    for (const title of ['發燒判斷', '尿布疹']) {
      expect(within(header(title)).queryAllByRole('button')).toHaveLength(0);
    }
  });
});
