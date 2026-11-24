import { afterEach, describe, expect, it } from 'vitest';
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

const card = (title: string) =>
  screen.getByRole('heading', { name: title }).closest('[role="button"]') as HTMLElement;

describe('WikiBrowser: an open article', () => {
  it('puts the see-a-doctor signs before causes and steps', async () => {
    const user = renderBrowser();
    await user.click(card('發燒判斷'));

    const headings = within(card('發燒判斷'))
      .getAllByRole('heading', { level: 4 })
      .map((node) => node.textContent);
    expect(headings.indexOf('就醫警訊')).toBe(0);
    expect(headings.indexOf('就醫警訊')).toBeLessThan(headings.indexOf('處理方式'));
  });

  it('names its related articles and leaves out ids that resolve to nothing', async () => {
    const user = renderBrowser();
    await user.click(card('發燒判斷'));

    const related = within(card('發燒判斷')).getAllByRole('button');
    expect(related.map((node) => node.textContent)).toEqual(['尿布疹']);
  });

  it('opens a related article in place, without collapsing into a dead end', async () => {
    const user = renderBrowser();
    await user.click(card('發燒判斷'));
    await user.click(within(card('發燒判斷')).getByRole('button', { name: '尿布疹' }));

    expect(card('尿布疹')).toHaveAttribute('aria-expanded', 'true');
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

    await user.click(card('發燒判斷'));
    await user.click(within(card('發燒判斷')).getByRole('button', { name: '尿布疹' }));

    expect(card('尿布疹')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: '全部' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows no related section for an article that points nowhere', async () => {
    const user = renderBrowser();
    await user.click(card('尿布疹'));
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

    expect(card('尿布疹')).toHaveAttribute('aria-expanded', 'true');
    expect(card('發燒判斷')).toHaveAttribute('aria-expanded', 'false');
  });

  it('puts the article in the address bar when it is opened, and takes it out when closed', async () => {
    at('/littlesteps/baby-wiki');
    const user = renderBrowser(WIKI);

    await user.click(card('發燒判斷'));
    expect(here()).toBe('/littlesteps/baby-wiki/fever');

    await user.click(card('發燒判斷'));
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

    await user.click(card('發燒判斷'));
    await user.click(card('尿布疹'));

    expect(window.history.length).toBe(before);
  });

  it('shows the whole list for an id that is not an article, and cleans the URL', async () => {
    at('/littlesteps/baby-wiki/no-such-article');
    renderBrowser(WIKI);

    expect(card('發燒判斷')).toHaveAttribute('aria-expanded', 'false');
    expect(card('尿布疹')).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() => expect(here()).toBe('/littlesteps/baby-wiki'));
  });

  it('keeps a search in progress when an article is closed', async () => {
    at('/littlesteps/baby-wiki?q=%E9%AB%94%E6%BA%AB');
    const user = renderBrowser(WIKI);

    await user.click(card('發燒判斷'));
    await user.click(card('發燒判斷'));

    expect(window.location.pathname).toBe('/littlesteps/baby-wiki');
    expect(screen.getByRole('searchbox')).toHaveValue('體溫');
  });

  it('leaves the address bar alone when the page did not say which wiki it is', async () => {
    at('/somewhere');
    const user = renderBrowser();

    await user.click(card('發燒判斷'));

    expect(here()).toBe('/somewhere');
  });
});
