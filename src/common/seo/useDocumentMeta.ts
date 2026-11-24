import { useEffect, useSyncExternalStore } from 'react';
import type { Page } from '../../types/routes';
import { metaFor, type ResolvedMeta } from './pageMeta';

/**
 * 把 <head> 的內容換成目前這一頁的。
 *
 * SPA 只有一份 index.html，換頁不會換標題。結果是分享任何一頁到 LINE，
 * 預覽都寫「LittleSteps - 孕期到幼兒的育兒陪伴」，瀏覽器分頁與書籤也全部同名。
 *
 * 用直接操作 DOM 而不是引入 helmet 之類的套件：要做的事就是設幾個屬性，
 * 為此多背一個相依套件不划算。
 */
function upsertMeta(selector: string, create: () => HTMLMetaElement | HTMLLinkElement) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
}

function setMetaContent(attr: 'name' | 'property', key: string, content: string) {
  const el = upsertMeta(`meta[${attr}="${key}"]`, () => {
    const meta = document.createElement('meta');
    meta.setAttribute(attr, key);
    return meta;
  });
  el.setAttribute('content', content);
}

/**
 * 頁面裡的某個東西要暫時接管 <head>：目前只有知識庫，打開一篇文章時標題與
 * canonical 要換成那一篇的。
 *
 * 用一個共用的值而不是讓知識庫自己去改 DOM：App 的 effect 和知識庫的 effect
 * 誰先誰後取決於它們是不是在同一次 commit 掛載（子元件先跑），自己改 DOM 的
 * 話，按瀏覽器「上一頁」回到文章網址時，App 會在後面把標題蓋回知識庫的。
 * 這樣寫就只有一個地方在寫 <head>，順序不再有意義。
 */
let override: ResolvedMeta | null = null;
const listeners = new Set<() => void>();

export function setDocumentMetaOverride(meta: ResolvedMeta | null): void {
  if (override === meta) return;
  override = meta;
  listeners.forEach((notify) => notify());
}

function subscribeToOverride(notify: () => void): () => void {
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
  };
}

const currentOverride = () => override;

function applyMeta(meta: ResolvedMeta): void {
  document.title = meta.title;
  setMetaContent('name', 'description', meta.description);

  // og:url 與 canonical 指向同一個網址，否則社群分享與搜尋引擎會各自
  // 認一個版本，權重被拆成兩份。
  setMetaContent('property', 'og:title', meta.title);
  setMetaContent('property', 'og:description', meta.description);
  setMetaContent('property', 'og:url', meta.canonical);
  setMetaContent('property', 'twitter:title', meta.title);
  setMetaContent('property', 'twitter:description', meta.description);
  setMetaContent('property', 'twitter:url', meta.canonical);

  // 需登入的頁面讀的是某一個家庭的健康資料。就算爬蟲看到的是登入前的
  // 空殼，也不該讓這些網址進搜尋結果。
  setMetaContent('name', 'robots', meta.noindex ? 'noindex, follow' : 'index, follow');

  const canonical = upsertMeta('link[rel="canonical"]', () => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    return link;
  });
  canonical.setAttribute('href', meta.canonical);
}

export function useDocumentMeta(page: Page): void {
  const overriding = useSyncExternalStore(subscribeToOverride, currentOverride);

  useEffect(() => {
    applyMeta(overriding ?? metaFor(page));
  }, [page, overriding]);
}
