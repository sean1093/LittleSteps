/**
 * 刪除前的確認。
 *
 * 原本五個刪除點各寫一句，五種說法：「確定要刪除此記錄嗎？」、「確定要刪除
 * 這筆記錄嗎？」、「刪除這則紀錄？刪除後無法復原。」、「確定要刪除這位寶寶的
 * 資料嗎？所有里程碑進度也將一併刪除。」、還有一句會帶食物名字。量詞、用字、
 * 有沒有講「不可復原」全都不一樣，而其中三句沒講。
 *
 * 一個刪除確認要回答兩件事：刪的是什麼，還有回不回來。兩件都講，每次都講。
 *
 * 沿用 window.confirm 而不是換成自訂對話框：它會真的擋住流程，這正是刪除
 * 需要的。toast 那套是用來通知的，攔不住任何事。
 *
 * 用字跟著 app 現有的多數：「記錄」111 處、「紀錄」52 處，所以是「記錄」。
 */
export function confirmDelete(what: string, alsoRemoved?: string): boolean {
  const cascade = alsoRemoved ? `${alsoRemoved}也會一併刪除。` : '';

  return window.confirm(`確定要刪除${what}嗎？${cascade}刪除後無法復原。`);
}
