import { BabyWikiArticle } from '../../types';

// Extend WikiCategory if necessary or just use existing ones if suitable, 
// but user requested separation. Let's keep the WikiCategory type but use a new data file.

export const pregnancyWikiArticles: BabyWikiArticle[] = [
  {
    id: 'prenatal-nutrition',
    title: '孕期營養攝取',
    summary: '孕期均衡飲食對胎兒發育至關重要，葉酸、鐵質、鈣質是關鍵營養素。',
    category: 'daily', // Reusing a category to fit existing type or need to expand WikiCategory
    causes: [],
    solutions: [
      { step: '補充葉酸', detail: '懷孕初期應額外補充葉酸，預防胎兒神經管缺陷。' },
      { step: '鐵質與鈣質', detail: '多攝取深綠色蔬菜、瘦肉及乳製品，滿足胎兒骨骼與血液發育需求。' },
    ],
    warningSignals: ['嚴重營養不良', '持續性劇烈嘔吐無法進食'],
    relatedArticleIds: [],
    icon: 'Apple',
  },
];
