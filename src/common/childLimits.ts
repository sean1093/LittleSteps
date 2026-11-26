/**
 * 一個帳號最多能追蹤幾個孩子。
 *
 * 這個數字原本寫死在三個地方（useChildStore、useFirebaseChildren、
 * AccountSheet），改一處另外兩處就對不上——最糟的組合是 UI 還讓你按，
 * 資料層卻擋下來。
 *
 * 訊息也集中在這裡，因為原本四個地方都寫著「請升級付費會員」，而這個 app
 * 沒有付費方案。對著存放孩子健康紀錄的產品講一個不存在的升級路徑，家長
 * 照做只會撲空；限制是真的，付費選項不是。
 */
export const MAX_CHILDREN = 2;

export const CHILD_LIMIT_MESSAGE = `目前一個帳號最多可以追蹤 ${MAX_CHILDREN} 個寶寶`;

/**
 * 帳號滿了的時候，接在 CHILD_LIMIT_MESSAGE 後面的那一句：怎麼空出位置。
 *
 * 加入別人的紀錄也算一份，所以保母或有三個孩子的家庭最常撞到這裡；只說
 * 「滿了」，家長看到的是一條死路。離開（分享視窗）或刪除（編輯視窗）任一份
 * 就會空出位置——這是真的辦得到的事，不是升級。
 */
export const CHILD_LIMIT_FREE_SLOT = '離開或刪除其中一份紀錄，就能空出一個位置。';
