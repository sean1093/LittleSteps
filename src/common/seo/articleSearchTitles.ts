/**
 * 百科文章在搜尋結果上的標題。
 *
 * 文章自己的標題是名詞：「發燒判斷」「便秘」「厭奶期」。家長在 Google 打的是
 * 問句：「寶寶發燒幾度要看醫生」。這張表只換 <title> 與分享預覽上的那一行，
 * 頁面上的標題、結構化資料的 headline 都維持文章原本的名字——那是內容，這是
 * 讓人找得到內容的那一行。
 *
 * 規則：
 * - 標題裡的每一個承諾，文章裡都要真的有答案。寫「會發燒嗎」，文章就要講
 *   長牙與發燒的關係；不能為了搜尋量寫一個點進來找不到的問題。
 * - 加上「｜寶寶百科｜LittleSteps」之後不超過約 30 個全形字，超過會被截斷。
 * - 沒列在這裡的文章用自己的標題。幼兒百科多數標題本來就是問句，不必列。
 *
 * 鍵是文章代號。三個知識庫的代號沒有重複（routes.test.ts 檢查每篇網址唯一，
 * articleSearchTitles.test.ts 檢查這裡的每個鍵都對得到一篇文章）。
 */
export const ARTICLE_SEARCH_TITLE: Record<string, string> = {
  // 寶寶百科
  'fever-assessment': '寶寶發燒幾度要看醫生？量法與退燒藥',
  roseola: '玫瑰疹症狀：高燒幾天、退燒後出疹',
  colic: '嬰兒腸絞痛怎麼辦？症狀與安撫方法',
  constipation: '寶寶便秘怎麼辦？怎樣才算便秘',
  'nursing-strike': '寶寶厭奶怎麼辦？厭奶期與就醫警訊',
  enterovirus: '腸病毒症狀、重症前兆與消毒方法',
  'diaper-rash': '寶寶尿布疹怎麼辦？處理與就醫時機',
  teething: '寶寶長牙症狀：幾個月長牙、會發燒嗎',
  'sids-prevention': '嬰兒猝死症預防：安全睡眠怎麼做',
  'nasal-congestion': '寶寶鼻塞怎麼辦？睡不好、喝奶困難',
  // 孕期知識庫
  'checkup-gestational-diabetes': '妊娠糖尿病篩檢：喝糖水標準值與週數',
  'nutrition-foods-to-avoid': '懷孕不能吃什麼？孕婦飲食禁忌整理',
  'checkup-down-screening': '唐氏症篩檢怎麼選：初唐、二唐、NIPT',
  'symptoms-morning-sickness': '孕吐什麼時候結束？嚴重孕吐何時就醫',
  // 幼兒百科
  'toilet-readiness': '戒尿布幾歲開始？如廁訓練準備訊號',
};
