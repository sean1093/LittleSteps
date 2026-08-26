import type { PregnancyWikiArticle, PregnancyWikiCategory, WikiCategoryColors } from '../../types';

export const pregnancyWikiCategoryLabels: Record<PregnancyWikiCategory, string> = {
  nutrition: '孕期營養',
  health: '健康照護',
  symptoms: '身體變化',
  checkup: '產檢須知',
  lifestyle: '生活作息',
};

export const pregnancyWikiCategoryColors: Record<PregnancyWikiCategory, WikiCategoryColors> = {
  nutrition: { bg: 'bg-rose-50', text: 'text-rose-700', pill: 'bg-rose-100 text-rose-700' },
  health: { bg: 'bg-emerald-50', text: 'text-emerald-700', pill: 'bg-emerald-100 text-emerald-700' },
  symptoms: { bg: 'bg-amber-50', text: 'text-amber-700', pill: 'bg-amber-100 text-amber-700' },
  checkup: { bg: 'bg-sky-50', text: 'text-sky-700', pill: 'bg-sky-100 text-sky-700' },
  lifestyle: { bg: 'bg-violet-50', text: 'text-violet-700', pill: 'bg-violet-100 text-violet-700' },
};

export const pregnancyWikiArticles: PregnancyWikiArticle[] = [
  {
    id: 'prenatal-nutrition',
    title: '孕期營養攝取',
    summary: '孕期均衡飲食對胎兒發育至關重要，葉酸、鐵質、鈣質是關鍵營養素。',
    category: 'nutrition',
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
