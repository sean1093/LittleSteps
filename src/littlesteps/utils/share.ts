/**
 * 分享結果。
 *
 * 這是一個純函式，拿不到 toast 的 hook，所以它只回報發生了什麼，由呼叫端
 * 決定要不要說話——原本它自己 alert('已複製到剪貼簿！')，等於一個 util
 * 直接接管了畫面。
 */
export type ShareOutcome = 'shared' | 'copied' | 'failed';

export async function shareMilestone(title: string): Promise<ShareOutcome> {
  const url = window.location.href;
  const text = `我的寶貝達成了【${title}】里程碑了！推薦給新手父母的育兒神器：`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'LittleSteps - 育兒里程碑',
        text,
        url,
      });
      return 'shared';
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('分享失敗:', error);
      }
      return 'failed';
    }
  } else {
    // Fallback: 複製到剪貼簿
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      return 'copied';
    } catch (error) {
      console.error('複製失敗:', error);
      return 'failed';
    }
  }
}
