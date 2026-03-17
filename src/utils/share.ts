export async function shareMilestone(title: string): Promise<boolean> {
  const url = window.location.href;
  const text = `我的寶貝達成了【${title}】里程碑了！推薦給新手父母的育兒神器：`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'LittleSteps - 育兒里程碑',
        text,
        url,
      });
      return true;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('分享失敗:', error);
      }
      return false;
    }
  } else {
    // Fallback: 複製到剪貼簿
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      alert('已複製到剪貼簿！');
      return true;
    } catch (error) {
      console.error('複製失敗:', error);
      return false;
    }
  }
}
