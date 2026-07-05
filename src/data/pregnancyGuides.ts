export interface PregnancyGuide {
  week: number;
  title: string;
  summary: string;
  tips: string[];
  warningSignals: string[];
}

export const pregnancyGuides: PregnancyGuide[] = [
  {
    week: 1,
    title: '懷孕第 1 週：準備懷孕',
    summary: '身體正在準備迎接新生命，開始補充葉酸。',
    tips: ['補充葉酸', '停止菸酒', '規律作息'],
    warningSignals: []
  },
  {
    week: 2,
    title: '懷孕第 2 週：排卵期',
    summary: '進入受孕關鍵期，保持輕鬆心情。',
    tips: ['測量基礎體溫', '保持心情愉快', '適度運動'],
    warningSignals: []
  },
  {
    week: 3,
    title: '懷孕第 3 週：受精卵著床',
    summary: '受精卵正在找尋合適的著床位置。',
    tips: ['避免劇烈運動', '攝取營養均衡', '充足睡眠'],
    warningSignals: ['陰道異常出血', '劇烈腹痛']
  },
  {
    week: 4,
    title: '懷孕第 4 週：確認懷孕',
    summary: '月經推遲，這時可以用驗孕棒確認。',
    tips: ['驗孕確認', '預約婦產科', '減少咖啡因攝取'],
    warningSignals: ['嚴重下腹痛']
  },
  // ... 其他週數可依此擴充
];
