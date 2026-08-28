import { ROUTE_HASH, type Page } from '../types/routes';

/**
 * 換頁。
 *
 * App.tsx 監聽 hashchange，所以只要改 hash 畫面就會跟著換——元件不需要
 * 拿到任何 callback 就能導向別的服務。
 *
 * 存在的理由是型別：以前每個呼叫點都自己寫 '#/littlesteps/vaccine-tracking'
 * 這種字串，打錯不會有任何錯誤訊息，只會靜靜地掉回首頁。改成吃 Page 之後，
 * 打錯就是編譯失敗。
 */
export function goTo(page: Page): void {
  window.location.hash = ROUTE_HASH[page];
}
