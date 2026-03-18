import {
  FoodStage,
  FoodProgressionByAge,
  FoodAllergyLevel,
  MonthlyFoodMenu,
  FingerFoodGuideline,
  FoodPrinciple,
  FoodWarning
} from '../types';

// 副食品與奶量轉換三階段
export const foodStages: FoodStage[] = [
  {
    level: 1,
    name: "啟蒙期",
    ageRange: "4-6個月",
    milkRatio: "70-90%",
    foodRatio: "10-30%",
    mealsPerDay: "一天一餐",
    texture: "壓爛或剪碎",
    keyPoints: [
      "以嘗試少量多樣化的天然食材為主",
      "食物需壓爛或剪碎",
      "不加重鹹糖味",
      "奶水仍是主要營養來源",
      "練習吞嚥與多樣化試敏"
    ],
    warnings: []
  },
  {
    level: 2,
    name: "探索期",
    ageRange: "7-9個月",
    milkRatio: "60-70%",
    foodRatio: "30-40%",
    mealsPerDay: "一天至少兩餐",
    texture: "泥狀、糊狀到軟塊狀",
    keyPoints: [
      "讓寶寶體驗不同質地的食物",
      "鍛鍊咀嚼力",
      "副食品比例提高",
      "補充鐵質"
    ],
    warnings: [
      "嚴禁餵食蜂蜜（有肉毒桿菌風險）",
      "嚴禁整顆硬堅果（有噎到風險）"
    ]
  },
  {
    level: 3,
    name: "進階期",
    ageRange: "10-12個月",
    milkRatio: "30-40%",
    foodRatio: "60-70%",
    mealsPerDay: "一天三餐起跳",
    texture: "更多樣形狀（如長條形）",
    keyPoints: [
      "提供好抓握的食物",
      "練習精細動作",
      "副食品比重開始超過奶量",
      "奶水轉變為點心性質",
      "把主導權還給孩子，不強迫餵食"
    ],
    warnings: []
  }
];

// 循序漸進：質地與頻率轉變
export const foodProgression: FoodProgressionByAge[] = [
  {
    ageRange: "4-6個月",
    texture: "極稀流質/泥狀（十倍粥、十倍粥泥）",
    frequency: "1天1次（少量1-2匙開始）",
    purpose: "練習舌頭後推與吞嚥"
  },
  {
    ageRange: "7-9個月",
    texture: "濃稠泥/小顆粒粥（七倍粥、剁碎蔬菜）",
    frequency: "1天2次（逐漸取代一餐奶）",
    purpose: "練習用舌頭與牙齦壓碎食物"
  },
  {
    ageRange: "10-12個月",
    texture: "軟塊/手指食物（五倍粥、軟飯、丁狀肉）",
    frequency: "1天3次（與成人用餐同步）",
    purpose: "練習咀嚼能力與手眼協調"
  }
];

// 食物過敏程度與推薦月份
export const foodAllergyLevels: FoodAllergyLevel[] = [
  {
    level: "low",
    ageRange: "4-6個月開始",
    foods: [
      "白米",
      "南瓜",
      "地瓜",
      "胡蘿蔔",
      "高麗菜",
      "蘋果",
      "香蕉"
    ]
  },
  {
    level: "medium",
    ageRange: "7-9個月開始",
    foods: [
      "蛋黃（先）",
      "豆腐",
      "白肉魚（鱈魚、鯛魚）",
      "雞肉",
      "大麥",
      "燕麥"
    ]
  },
  {
    level: "high",
    ageRange: "10個月+ 或少量嘗試",
    foods: [
      "全蛋（蛋白）",
      "帶殼海鮮（蝦蟹）",
      "花生醬（需稀釋）",
      "奇異果",
      "草莓",
      "番茄"
    ]
  }
];

// 試敏菜單與月份推薦
export const monthlyFoodMenus: MonthlyFoodMenu[] = [
  {
    month: "4-5個月",
    focus: "澱粉、根莖",
    foods: ["十倍粥泥", "地瓜泥", "南瓜泥", "紅蘿蔔泥"]
  },
  {
    month: "6個月",
    focus: "葉菜、基本水果",
    foods: ["青江菜泥", "高麗菜泥", "蘋果泥", "香蕉泥"]
  },
  {
    month: "7-8個月",
    focus: "植物與禽類蛋白",
    foods: ["蛋黃泥", "豆腐泥", "雞肉泥", "燕麥粥"]
  },
  {
    month: "9-10個月",
    focus: "魚類、紅肉、全蛋",
    foods: ["鮭魚碎肉", "牛肉泥", "全蛋（蒸蛋）", "細麵"]
  },
  {
    month: "11-12個月",
    focus: "多樣化成人食材",
    foods: ["軟飯", "小餛飩", "起司", "優格", "剪碎的家常菜"]
  }
];

// 手指食物挑選指南
export const fingerFoodGuidelines: FingerFoodGuideline[] = [
  {
    category: "蔬菜類",
    examples: [
      "蒸熟的紅蘿蔔條",
      "綠花椰菜（帶梗方便抓）",
      "南瓜塊",
      "玉米筍（煮極軟）"
    ]
  },
  {
    category: "水果類",
    examples: [
      "香蕉段（切半）",
      "酪梨條",
      "去皮切片的軟柿或水蜜桃"
    ]
  },
  {
    category: "澱粉類",
    examples: [
      "烤過的吐司條（去邊）",
      "軟質飯糰",
      "煮軟的螺旋麵"
    ]
  },
  {
    category: "蛋白類",
    examples: [
      "漢堡排（碎肉壓製）",
      "厚片蛋餅"
    ]
  }
];

// 副食品添加三大原則
export const foodPrinciples: FoodPrinciple[] = [
  {
    id: "early-start",
    title: "四個月就可以開始吃副食品",
    description: "把握4-9個月免疫耐受性黃金時期，及早接觸反而能降低過敏機率",
    icon: "Calendar"
  },
  {
    id: "no-delay",
    title: "父母有過敏體質也不需延後",
    description: "現代醫學已證實，太晚給副食品非但不能減少過敏，反而可能提高",
    icon: "ShieldCheck"
  },
  {
    id: "natural-foods",
    title: "一歲前除蜂蜜外都可嘗試",
    description: "什麼天然食物都可以添加，除非吃了產生過敏症狀。少量多樣化最重要",
    icon: "Leaf"
  }
];

// 專業提醒與禁忌
export const foodWarnings: FoodWarning[] = [
  {
    id: "honey",
    title: "1歲前嚴禁蜂蜜",
    description: "含有肉毒桿菌孢子，可能對嬰兒造成致命威脅",
    icon: "AlertOctagon",
    severity: "danger"
  },
  {
    id: "choking-hazards",
    title: "避開窒息風險食物",
    description: "整顆葡萄、硬堅果、麻糬等黏性強或圓形硬物絕對禁止",
    icon: "AlertTriangle",
    severity: "danger"
  },
  {
    id: "no-seasoning",
    title: "不額外加鹽糖",
    description: "寶寶腎臟尚未發育完全，且要培養天然口味，避免未來挑食或重口味",
    icon: "XCircle",
    severity: "warning"
  },
  {
    id: "iron-supplement",
    title: "補鐵是關鍵",
    description: "6個月後母乳鐵質不足，應優先提供蛋黃、紅肉、豬肝泥或強化鐵質的米精",
    icon: "Droplet",
    severity: "info"
  },
  {
    id: "water",
    title: "水分補充",
    description: "開始副食品後可給予少量飲水（一次30-50ml），主要是為了漱口與習慣味道",
    icon: "Droplets",
    severity: "info"
  }
];

// 4x3 試敏法
export const allergyTestingMethod = {
  name: "4x3 試敏法",
  description: "早期接觸（4-9個月內）反而能建立免疫耐受性，降低未來過敏機率",
  steps: [
    {
      step: 1,
      title: "小量試3天",
      description: "第一天給一小口，觀察是否有紅疹、腹瀉、嘔吐"
    },
    {
      step: 2,
      title: "增量試3天",
      description: "若無反應，第二天增加份量，持續觀察"
    },
    {
      step: 3,
      title: "觀察3天",
      description: "停止新食材，觀察是否有延遲性過敏"
    }
  ],
  principle: "每次只試「一種」新食材，若發生過敏，記錄並暫停該食材1-2個月再試"
};

// 手指食物挑選3大原則
export const fingerFoodPrinciples = {
  title: "手指食物（BLW）挑選3大原則",
  ageRange: "7-8個月起",
  principles: [
    {
      name: "尺寸",
      description: "長度約為寶寶握緊拳頭後露出2-3公分（像粗薯條），方便抓握"
    },
    {
      name: "硬度",
      description: "父母用大拇指與食指能輕易壓碎的程度（如煮熟的紅蘿蔔）"
    },
    {
      name: "安全性",
      description: "絕對避開圓形（整顆葡萄）、硬殼（堅果）、黏性強（麻糬、蛋黃乾吃）的食物"
    }
  ]
};

// 常見副食品餵食法
export const feedingMethods = [
  {
    id: "puree",
    name: "食物泥",
    description: "將食材打成泥狀，適合初期嘗試"
  },
  {
    id: "traditional",
    name: "傳統泥粥漸進法",
    description: "從十倍粥開始，逐步增加濃稠度"
  },
  {
    id: "blw",
    name: "BLW（寶寶主導式離乳法）",
    description: "提供手指食物，讓寶寶自己抓取進食"
  },
  {
    id: "follow-parents",
    name: "少量多樣化，跟著大人吃",
    description: "最推薦的方法，與家人同步用餐，培養良好飲食習慣"
  }
];

// 開始副食品的時機
export const startingSignals = [
  "寶寶滿四個月大",
  "寶寶會對大人食物睜大眼睛",
  "開始表現出對大人食物感興趣",
  "脖子能撐住、能坐穩",
  "出現咀嚼動作"
];
