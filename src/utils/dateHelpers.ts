/**
 * 日期時間工具函數
 * 用於快速日誌功能的日期處理
 */

/**
 * 判斷兩個日期是否在同一天
 */
export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  const d1 = new Date(date1).toISOString().split('T')[0];
  const d2 = new Date(date2).toISOString().split('T')[0];
  return d1 === d2;
}

/**
 * 計算時間差（分鐘）
 */
export function calculateDuration(startTime: string, endTime: string): number {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return Math.floor((end - start) / (1000 * 60));
}

/**
 * 格式化時間顯示（HH:MM）
 */
export function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * 格式化時長顯示
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0 && mins > 0) {
    return `${hours}小時${mins}分鐘`;
  } else if (hours > 0) {
    return `${hours}小時`;
  } else {
    return `${mins}分鐘`;
  }
}

/**
 * 取得當前時間的 ISO 字串（用於 datetime-local input）
 * 格式: YYYY-MM-DDTHH:mm
 */
export function getCurrentDateTimeLocal(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * 將 datetime-local 格式轉換為 ISO 字串
 */
export function dateTimeLocalToISO(dateTimeLocal: string): string {
  return new Date(dateTimeLocal).toISOString();
}
