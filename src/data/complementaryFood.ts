import {
  FoodStage,
  FoodProgressionByAge,
  FoodAllergyLevel,
  MonthlyFoodMenu,
  FingerFoodGuideline,
  FoodPrinciple,
  FoodWarning,
  FeedingPrinciple,
  CookingTipCategory,
  FoodHandlingCategory,
  FoodRestrictionCategory,
  FoodQAItem
} from '../types';

// 副食品與奶量轉換三階段
export const foodStages: FoodStage[] = [
  {
    level: 1,
    name: "吞嚥期",
    ageRange: "4-6個月",
    milkRatio: "70-90%",
    foodRatio: "10-30%",
    mealsPerDay: "一天1餐副食，4-5餐奶",
    texture: "10倍粥米湯、米糊，進階7倍粥打泥",
    keyPoints: [
      "每餐副食量約15-60ml",
      "從10倍粥（米:水=1:10）的米湯、米糊開始",
      "食材皆須打成泥狀或糊狀",
      "加菜後可進階成7倍粥打泥",
      "奶水仍是主要營養來源",
      "練習吞嚥與多樣化試敏"
    ],
    warnings: []
  },
  {
    level: 2,
    name: "壓碎與咀嚼期",
    ageRange: "7-9個月",
    milkRatio: "60-70%",
    foodRatio: "30-40%",
    mealsPerDay: "一天2餐副食，3-4餐奶",
    texture: "7倍粥進階到5倍粥，粥與蔬菜可不打泥",
    keyPoints: [
      "每餐量約60-250ml，總奶量維持500cc以上",
      "可先嘗試一半打泥、一半不打泥",
      "觀察吞嚥狀況後慢慢調整成「粥不打泥」",
      "腸胃消化功能提升，可「開葷」加入蛋白質",
      "可加入雞、豬、牛、魚、蛋黃、豆腐",
      "可開始使用高湯熬粥",
      "為好消化，一歲前肉類仍建議打泥"
    ],
    warnings: [
      "嚴禁餵食蜂蜜（有肉毒桿菌風險）",
      "嚴禁整顆硬堅果（有噎到風險）"
    ]
  },
  {
    level: 3,
    name: "用力咀嚼期",
    ageRange: "10-12個月",
    milkRatio: "30-40%",
    foodRatio: "60-70%",
    mealsPerDay: "一天3餐副食，2餐奶",
    texture: "4倍粥、軟飯、乾飯或麵類",
    keyPoints: [
      "每餐量約250-300ml，總奶量維持400cc",
      "可吃4倍粥、軟飯、乾飯",
      "可替換成麵線、義大利麵、吐司、饅頭、煎餅",
      "蔬菜以切碎取代打泥",
      "肉類若牙齒長較多可打碎",
      "若寶寶開始挑嘴，可添加少量鹽巴",
      "可使用蔥、薑、蒜、香菜、芹菜、九層塔調味",
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

// 蔬菜類過敏等級表
export const vegetableAllergyLevels: FoodAllergyLevel[] = [
  {
    level: "low",
    ageRange: "6個月起",
    foods: [
      "白蘿蔔 (6m+)",
      "油菜 (6m+)",
      "大白菜 (6m+)",
      "胡蘿蔔 (6m+)",
      "菜花/花椰菜 (6m+)",
      "南瓜 (6m+)"
    ]
  },
  {
    level: "medium",
    ageRange: "7-8個月起",
    foods: [
      "秋葵 (7m+)",
      "蓮藕 (7m+)",
      "絲瓜 (8m+)",
      "芹菜 (8m+)",
      "蘑菇 (8m+)",
      "韭菜 (18m+)"
    ]
  },
  {
    level: "high",
    ageRange: "6-8個月起（需觀察）",
    foods: [
      "山藥 (6m+)",
      "番茄 (7m+)",
      "芋頭 (7m+)",
      "豌豆 (7m+)",
      "菠菜 (7m+)",
      "茄子 (8m+)"
    ]
  }
];

// 水果類過敏等級表
export const fruitAllergyLevels: FoodAllergyLevel[] = [
  {
    level: "low",
    ageRange: "6個月起",
    foods: [
      "蘋果 (6m+)",
      "梨 (6m+)",
      "藍莓 (6m+)",
      "葡萄 (6m+)",
      "棗 (6m+)",
      "李子 (10m+)"
    ]
  },
  {
    level: "medium",
    ageRange: "7-9個月起",
    foods: [
      "香蕉 (7m+)",
      "甜瓜 (7m+)",
      "石榴 (7m+)",
      "櫻桃 (7m+)",
      "草莓 (9m+)",
      "西瓜 (9m+)"
    ]
  },
  {
    level: "high",
    ageRange: "6-12個月起（需觀察）",
    foods: [
      "牛油果/酪梨 (6m+)",
      "桃子 (8m+)",
      "奇異果/獼猴桃 (8m+)",
      "柑橘類 (8m+)",
      "芒果 (12m+)",
      "鳳梨/菠蘿 (12m+)"
    ]
  }
];

// 試敏菜單與月份推薦
export const monthlyFoodMenus: MonthlyFoodMenu[] = [
  {
    month: "4個月",
    focus: "初期入門食材（根莖菜葉與溫和水果）",
    foods: [
      "白米（十倍粥/米湯）", "小米粥", "藜麥", "紅藜",
      "紅蘿蔔", "花椰菜", "高麗菜", "南瓜", "地瓜", "地瓜葉",
      "青江菜", "小松菜", "油菜", "莧菜", "大白菜", "小白菜",
      "大陸妹", "美生菜", "芥蘭菜", "空心菜", "冬瓜", "白蘿蔔",
      "豆薯", "甜椒", "馬鈴薯", "洋蔥",
      "蘋果", "梨子", "火龍果", "西洋梨", "青棗", "葡萄", "香蕉", "酪梨（高敏）"
    ]
  },
  {
    month: "5個月",
    focus: "增加部分豆類與蔬菜",
    foods: [
      "玉米筍", "玉米", "黑木耳", "蘆筍", "皇宮菜", "豌豆苗", "綠豆芽",
      "柿子", "蓮霧"
    ]
  },
  {
    month: "6個月",
    focus: "嘗試不同質地與微量辛香料",
    foods: [
      "米豆",
      "甜菜根", "茭白筍", "菠菜（高敏）", "茄子（高敏）", "蕃茄（高敏）",
      "芭樂", "香瓜", "蜜李", "木瓜（高敏）",
      "蔬菜高湯", "青蔥", "大蒜", "薑（高敏）"
    ]
  },
  {
    month: "7個月",
    focus: "正式開葷（肉類、高湯與蛋白質）",
    foods: [
      "雞肉", "白肉魚片（鯛魚、比目魚、鱸魚）", "猪肉", "牛肉", "豆腐（高敏）", "蛋黃（高敏）",
      "芹菜", "山芹菜", "韭黃", "韭菜", "絲瓜", "瓠瓜", "大黃瓜", "小黃瓜",
      "菱角", "秋葵", "苦瓜", "毛豆（高敏）", "皇帝豆（高敏）", "豌豆仁（高敏）",
      "雞骨高湯", "魚骨高湯", "猪骨高湯", "蒜頭雞湯",
      "草莓"
    ]
  },
  {
    month: "8個月",
    focus: "進階五穀雜糧與藥膳食材",
    foods: [
      "黑米粥", "燕麥粥", "紅棗粥", "蓮子粥", "紫米粥（高敏）", "紅豆粥（高敏）", "黑芝麻（高敏）",
      "蓮藕", "山藥（高敏）", "枸杞", "白木耳"
    ]
  },
  {
    month: "9個月",
    focus: "豐富的菇類與海藻",
    foods: [
      "蘑菇", "鮮香菇", "金針菇", "杏鮑菇", "鴻喜菇",
      "海帶芽", "起司（高敏）",
      "昆布高湯", "蘑菇高湯"
    ]
  },
  {
    month: "10個月以上",
    focus: "多元口感與易過敏水果",
    foods: [
      "核桃（高敏）", "雪蓮子/鷹嘴豆（高敏）", "百合（高敏）", "栗子（高敏）",
      "芋頭（高敏）", "竹筍（高敏）", "牛蒡（高敏）", "蝦子（高敏）",
      "鳳梨（高敏）", "水蜜桃（高敏）", "芒果（高敏）", "檸檬（高敏）", "奇異果（高敏）", "柳丁（高敏）"
    ]
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

// 副食品添加基本原則
export const feedingPrinciples: FeedingPrinciple[] = [
  {
    title: "單一食材原則",
    description: "每次只能加一種新食材，至少試3~5天（72小時觀察期），若無過敏反應即可再試下一種"
  },
  {
    title: "奶為主食原則",
    description: "一歲前還是以奶為主食，10個月前盡量多喝奶，不要因為副食品而提早斷奶"
  },
  {
    title: "低敏優先原則",
    description: "只要是低敏食材一歲前都能試；高敏食材則依寶寶體質斟酌添加（高低敏僅為統計值，因人而異）"
  },
  {
    title: "添加植物油",
    description: "開始加菜後，可於副食品中滴入1~3滴植物油（如橄欖油、亞麻仁油等）幫助腸胃蠕動、預防便祕"
  }
];

// 烹調與保存技巧
export const cookingTips: CookingTipCategory[] = [
  {
    category: "冰磚製作",
    tips: [
      {
        title: "新舊食材分開煮",
        description: "試新食材時必須自己單獨蒸煮，確認不過敏後，下一餐才能跟「安全的舊食材」混在一起做冰磚"
      }
    ]
  },
  {
    category: "葉菜處理",
    tips: [
      {
        title: "汆燙優於蒸煮",
        description: "葉菜類含有較多農藥與硝酸鹽，建議用滾水汆燙60-90秒後撈起打泥，且燙青菜的水千萬不可重複利用或打泥"
      }
    ]
  },
  {
    category: "高湯熬煮",
    tips: [
      {
        title: "蔬菜高湯",
        description: "選擇會釋放甜味的食材（洋蔥、玉米、蘋果），避開會讓湯頭混濁的南瓜、馬鈴薯，且絕對不要用青菜熬湯"
      },
      {
        title: "大骨/肉類高湯",
        description: "骨頭或排骨必須從冷水下鍋開始汆燙，才能慢慢將骨頭內部的血水逼出"
      }
    ]
  },
  {
    category: "肉泥製作",
    tips: [
      {
        title: "熟肉泥 vs 生肉泥",
        description: "熟肉泥是蒸熟後打泥，口感較乾柴；生肉泥是將生肉剁碎分裝，要吃時加水調勻，淋入熱粥裡悶熟，口感較滑嫩"
      }
    ]
  }
];

// 食材特殊處理
export const foodHandlingTips: FoodHandlingCategory[] = [
  {
    category: "發芽處理",
    items: [
      {
        food: "馬鈴薯",
        canEat: false,
        note: "發芽會產生「龍葵鹼」毒素，加熱也無法破壞，只要發芽必須整顆丟棄"
      },
      {
        food: "地瓜",
        canEat: true,
        note: "發芽挖掉芽眼即可，只是澱粉下降口感變差"
      },
      {
        food: "洋蔥、蒜頭",
        canEat: true,
        note: "發芽仍可食用，只是較不甜"
      }
    ]
  },
  {
    category: "變色問題",
    items: [
      {
        food: "紅蘿蔔、南瓜、地瓜",
        canEat: true,
        note: "吃太多會因「胡蘿蔔素」使皮膚染黃，停吃即可消退，對健康無礙"
      },
      {
        food: "蓮藕、地瓜",
        canEat: true,
        note: "削皮後易氧化變黑，處理後可泡水隔絕空氣"
      }
    ]
  },
  {
    category: "特殊處理技巧",
    items: [
      {
        food: "蓮藕",
        canEat: true,
        note: "必須冷水下鍋煮開才會鬆軟，千萬不能等水滾才下鍋，也絕對不能加醋（會變脆）"
      },
      {
        food: "芋頭、山藥",
        canEat: true,
        note: "含刺激性植物鹼，處理時可戴手套；若發癢可用火微烤雙手或用熱水、醋水、檸檬汁清洗"
      },
      {
        food: "苦瓜",
        canEat: true,
        note: "可先冰鎮後再汆燙去苦味"
      }
    ]
  }
];

// 嬰幼兒飲食禁忌
export const infantFoodRestrictions: FoodRestrictionCategory[] = [
  {
    category: "絕對禁止",
    items: [
      {
        food: "蜂蜜",
        ageLimit: "1歲前",
        reason: "含有肉毒桿菌孢子，可能對嬰兒造成致命威脅"
      },
      {
        food: "半熟蛋、糖心蛋",
        ageLimit: "1歲前",
        reason: "寶寶一歲前只能吃全熟蛋，也不建議吃茶葉蛋或滷蛋"
      },
      {
        food: "未成熟的綠色蕃茄",
        ageLimit: "任何年齡",
        reason: "含有龍葵鹼，不可生食"
      }
    ]
  },
  {
    category: "需注意事項",
    items: [
      {
        food: "葡萄",
        ageLimit: "任何年齡",
        reason: "吃完葡萄後不要立刻喝水或牛奶，以免與葡萄發酵引發腹瀉"
      },
      {
        food: "鹽巴調味",
        ageLimit: "1歲前不建議",
        reason: "10個月前若厭食，可先調整粥的濃稠度或添加蔥、薑、蒜等天然辛香料提味"
      }
    ]
  }
];

// 副食品常見問答
export const foodQA: FoodQAItem[] = [
  {
    question: "什麼時候開始給副食品？",
    answer: "除非厭奶嚴重經醫師指示，否則皆應從4個月大開始給予副食品。打預防針後或正在換奶時，應避免測試新食材"
  },
  {
    question: "餵食方式與順序？",
    answer: "必須使用「湯匙」餵食以訓練吞嚥，絕對不能用奶瓶餵米湯或米糊。母奶寶寶可先喝奶再吃副食，或在兩餐奶中間給予，重點是選在寶寶精神好且「不會太餓」的時候餵"
  },
  {
    question: "吃不完的副食品可以留到下一餐嗎？",
    answer: "沾過口水的副食品不可留到下一餐；若加熱到一半寶寶睡著，放保溫電鍋超過1小時就應倒掉，以免變質"
  },
  {
    question: "需要額外喝水嗎？",
    answer: "吃副食後應觀察便便，若無硬便不喝水也無妨；開始吃副食就要記錄排便次數"
  },
  {
    question: "便便變得很奇怪是正常的嗎？",
    answer: "吃副食後便便次數增加1-2次且呈糊泥狀屬正常腸胃適應；若一天排出「水便」超過6次，且伴隨排氣水聲，則可能是腸胃型病毒感染，需帶尿布就醫。紅蘿蔔、金針菇等富含纖維的食材，隔天隨便便原封不動排出是正常的"
  },
  {
    question: "豆腐如何保存？",
    answer: "傳統豆腐含鈣量高於盒裝豆腐。買回家後需泡在開水中並放入冰箱冷藏，每天必須換水，最好5天內吃完以免變酸腐壞"
  }
];
