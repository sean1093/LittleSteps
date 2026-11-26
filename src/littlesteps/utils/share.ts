import { shareText, type ShareOutcome } from '../../common/share';
import { SITE_ORIGIN } from '../../common/seo/pageMeta';

// 分享本身搬到 common/share：百科文章也要用，而它不屬於任何一個服務。
export { shareText, type ShareOutcome };

/**
 * 分享一個里程碑。
 *
 * 連結給的是首頁，不是目前這一頁：里程碑頁要登入，收到連結的人點開只會看到
 * 介紹頁。文案原本寫「推薦給新手父母的育兒神器」，那是內容農場的口吻，這個站
 * 其他地方都不這樣講話。
 */
export async function shareMilestone(title: string): Promise<ShareOutcome> {
  return shareText(
    'LittleSteps - 育兒里程碑',
    `我的寶貝會【${title}】了！我用 LittleSteps 記錄寶寶的里程碑：`,
    SITE_ORIGIN,
  );
}
