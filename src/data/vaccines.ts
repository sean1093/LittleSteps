import { VaccineSchedule, VaccineSideEffect, VaccineEmergency } from '../types';

// 疫苗接種時程表
export const vaccineSchedules: VaccineSchedule[] = [
  // 公費疫苗
  {
    id: "hepb-birth",
    name: "B型肝炎疫苗 第1劑",
    timing: "出生24小時內",
    fundingType: "public",
    ageInMonths: 0,
    ageLabel: "出生",
    doses: 3,
    currentDose: 1,
    sideEffects: ["注射部位紅腫", "輕微發燒", "嘔吐"],
    notes: "出生後儘速接種。孕婦若為高傳染性帶原者（表面抗原RPHA效價≧1:2560），嬰兒需另注射B型肝炎免疫球蛋白"
  },
  {
    id: "rsv-birth",
    name: "RSV長效單株抗體",
    timing: "出生穩定後即可施打",
    fundingType: "private",
    ageInMonths: 0,
    ageLabel: "出生",
    doses: 1,
    currentDose: 1,
    sideEffects: ["注射部位紅腫", "輕微發燒"],
    notes: "自費疫苗。適用於早產兒、先天性心臟病、免疫不全等高風險寶寶",
    priceRange: "$16,000~$17,000",
    recommendation: "高風險寶寶建議",
    features: "長效型抗體，一劑保護整個流行季（約5-6個月），預防RSV引起的嚴重下呼吸道感染",
    ageLimit: "建議在RSV流行季前施打（通常10月至隔年3月）",
    diseasesPrevented: ["呼吸道融合病毒感染", "細支氣管炎", "肺炎"]
  },
  {
    id: "hepb-1m",
    name: "B型肝炎疫苗 第2劑",
    timing: "出生滿1個月",
    fundingType: "public",
    ageInMonths: 1,
    ageLabel: "1個月",
    doses: 3,
    currentDose: 2,
    sideEffects: ["注射部位紅腫", "輕微發燒"]
  },
  {
    id: "hepb-6m",
    name: "B型肝炎疫苗 第3劑",
    timing: "出生滿6個月",
    fundingType: "public",
    ageInMonths: 6,
    ageLabel: "6個月",
    doses: 3,
    currentDose: 3,
    sideEffects: ["注射部位紅腫", "輕微發燒"]
  },
  {
    id: "pentavalent-2m",
    name: "五合一疫苗 第1劑",
    timing: "出生滿2個月",
    fundingType: "public",
    ageInMonths: 2,
    ageLabel: "2個月",
    doses: 4,
    currentDose: 1,
    sideEffects: ["發燒", "注射部位腫脹", "煩躁不安", "食慾下降"],
    notes: "含白喉、破傷風、百日咳、小兒麻痺、b型嗜血桿菌"
  },
  {
    id: "pneumococcal-2m",
    name: "13價肺炎鏈球菌疫苗 第1劑",
    timing: "出生滿2個月",
    fundingType: "public",
    ageInMonths: 2,
    ageLabel: "2個月",
    doses: 4,
    currentDose: 1,
    sideEffects: ["發燒", "注射部位紅腫疼痛", "煩躁", "嗜睡"]
  },
  {
    id: "rotavirus-2m",
    name: "口服輪狀病毒疫苗 第1劑",
    timing: "出生滿2個月",
    fundingType: "private",
    ageInMonths: 2,
    ageLabel: "2個月",
    doses: 2,
    currentDose: 1,
    sideEffects: ["輕微腹瀉", "嘔吐", "煩躁"],
    notes: "自費疫苗，須在6個月前完成。口服後一週內，寶寶糞便中可能帶有病毒，更換尿布後務必徹底洗手。",
    priceRange: "$1,900~$2,700",
    recommendation: "必打等級",
    features: "分2劑與3劑型，保護力相似，能大幅降低因脫水住院的機率",
    ageLimit: "須在6個月前完成",
    diseasesPrevented: ["病毒性腸胃炎", "嚴重嘔吐水瀉"]
  },
  {
    id: "pentavalent-4m",
    name: "五合一疫苗 第2劑",
    timing: "出生滿4個月",
    fundingType: "public",
    ageInMonths: 4,
    ageLabel: "4個月",
    doses: 4,
    currentDose: 2,
    sideEffects: ["發燒", "注射部位腫脹", "煩躁不安", "食慾下降"]
  },
  {
    id: "pneumococcal-4m",
    name: "13價肺炎鏈球菌疫苗 第2劑",
    timing: "出生滿4個月",
    fundingType: "public",
    ageInMonths: 4,
    ageLabel: "4個月",
    doses: 4,
    currentDose: 2,
    sideEffects: ["發燒", "注射部位紅腫疼痛", "煩躁", "嗜睡"]
  },
  {
    id: "rotavirus-4m",
    name: "口服輪狀病毒疫苗 第2劑",
    timing: "出生滿4個月",
    fundingType: "private",
    ageInMonths: 4,
    ageLabel: "4個月",
    doses: 2,
    currentDose: 2,
    sideEffects: ["輕微腹瀉", "嘔吐", "煩躁"],
    notes: "自費疫苗"
  },
  {
    id: "menb-2m",
    name: "B型流行性腦脊髓膜炎疫苗 第1劑",
    timing: "出生滿2個月起",
    fundingType: "private",
    ageInMonths: 2,
    ageLabel: "2個月起",
    doses: 2,
    currentDose: 1,
    sideEffects: ["發燒", "注射部位腫脹疼痛", "煩躁不安", "嗜睡"],
    notes: "自費疫苗，間隔至少1個月接種第2劑。建議在流行季節前完成接種",
    priceRange: "$6,000~$6,500",
    recommendation: "建議施打",
    features: "預防B型腦膜炎雙球菌，保護力可達90%以上，特別適合免疫力較弱的寶寶",
    ageLimit: "適用於2個月大以上",
    diseasesPrevented: ["B型流行性腦脊髓膜炎", "敗血症", "腦膜炎"]
  },
  {
    id: "menb-4m",
    name: "B型流行性腦脊髓膜炎疫苗 第2劑",
    timing: "第1劑後至少1個月",
    fundingType: "private",
    ageInMonths: 4,
    ageLabel: "4個月",
    doses: 2,
    currentDose: 2,
    sideEffects: ["發燒", "注射部位腫脹疼痛", "煩躁不安", "嗜睡"],
    notes: "自費疫苗，與第1劑間隔至少1個月"
  },
  {
    id: "bcg-5m",
    name: "卡介苗",
    timing: "出生滿5-8個月",
    fundingType: "public",
    ageInMonths: 5,
    ageLabel: "5個月",
    doses: 1,
    currentDose: 1,
    sideEffects: ["接種後7-14天紅色小結節", "4-6週膿泡或潰瘍", "2-3個月自然癒合", "可能形成疤痕"],
    notes: "預防結核病，建議接種時間為出生滿5-8個月，寶寶體重需達2500公克以上"
  },
  {
    id: "pentavalent-6m",
    name: "五合一疫苗 第3劑",
    timing: "出生滿6個月",
    fundingType: "public",
    ageInMonths: 6,
    ageLabel: "6個月",
    doses: 4,
    currentDose: 3,
    sideEffects: ["發燒", "注射部位腫脹", "煩躁不安", "食慾下降"]
  },
  {
    id: "hexavalent-6m",
    name: "六合一疫苗 第3劑（升級版）",
    timing: "出生滿6個月",
    fundingType: "private",
    ageInMonths: 6,
    ageLabel: "6個月",
    doses: 4,
    currentDose: 3,
    sideEffects: ["發燒", "注射部位腫脹", "煩躁不安", "食慾下降"],
    notes: "自費疫苗，為五合一疫苗的升級版，額外包含B型肝炎疫苗，一針抵兩針",
    priceRange: "$2,100",
    recommendation: "建議施打",
    features: "六合一=五合一+B肝，減少寶寶挨針次數，含白喉、破傷風、百日咳、小兒麻痺、b型嗜血桿菌、B型肝炎",
    diseasesPrevented: ["白喉", "破傷風", "百日咳", "小兒麻痺", "b型嗜血桿菌", "B型肝炎"]
  },
  {
    id: "pneumococcal-15v-6m",
    name: "15價肺炎鏈球菌疫苗（加強版）",
    timing: "出生滿6個月起",
    fundingType: "private",
    ageInMonths: 6,
    ageLabel: "6個月起",
    doses: 1,
    currentDose: 1,
    sideEffects: ["發燒", "注射部位紅腫疼痛", "煩躁", "嗜睡"],
    notes: "自費疫苗，為13價肺炎鏈球菌的升級版，額外保護2種血清型（22F, 33F），提供更全面的保護力",
    priceRange: "$3,800~$4,000",
    recommendation: "建議施打",
    features: "15價=13價+2種額外血清型（22F, 33F），提供更廣泛的保護力，特別適合高風險族群",
    diseasesPrevented: ["肺炎鏈球菌感染", "肺炎", "腦膜炎", "敗血症", "中耳炎"]
  },
  {
    id: "pneumococcal-12m",
    name: "13價肺炎鏈球菌疫苗 第3劑",
    timing: "出生滿12個月",
    fundingType: "public",
    ageInMonths: 12,
    ageLabel: "12個月",
    doses: 4,
    currentDose: 3,
    sideEffects: ["發燒", "注射部位紅腫疼痛", "煩躁", "嗜睡"]
  },
  {
    id: "mmr-12m",
    name: "麻疹腮腺炎德國麻疹混合疫苗 第1劑",
    timing: "出生滿12個月",
    fundingType: "public",
    ageInMonths: 12,
    ageLabel: "12個月",
    doses: 2,
    currentDose: 1,
    sideEffects: ["接種後5-12天可能發燒", "出疹", "咳嗽", "鼻炎", "注射部位腫痛"],
    notes: "可能在接種後5-12天出現發燒或出疹"
  },
  {
    id: "varicella-12m",
    name: "水痘疫苗 第1劑",
    timing: "出生滿12個月",
    fundingType: "public",
    ageInMonths: 12,
    ageLabel: "12個月",
    doses: 1,
    currentDose: 1,
    sideEffects: ["輕微發燒", "注射部位紅疹"],
    notes: "保護力約85%"
  },
  {
    id: "hepa-12m",
    name: "A型肝炎疫苗 第1劑",
    timing: "出生滿12個月",
    fundingType: "public",
    ageInMonths: 12,
    ageLabel: "12個月",
    doses: 2,
    currentDose: 1,
    sideEffects: ["注射部位疼痛", "疲倦", "輕微發燒"]
  },
  {
    id: "flu-1y",
    name: "流感疫苗",
    timing: "滿6個月以上，每年接種",
    fundingType: "public",
    ageInMonths: 6,
    ageLabel: "6個月起",
    doses: 1,
    sideEffects: ["注射部位痠痛", "輕微發燒", "疲倦", "頭痛", "肌肉痠痛"],
    notes: "每年10月開始接種。8歲以下初次接種需接種2劑，間隔4週以上"
  },
  {
    id: "pentavalent-18m",
    name: "五合一疫苗 第4劑",
    timing: "出生滿18個月",
    fundingType: "public",
    ageInMonths: 18,
    ageLabel: "18個月",
    doses: 4,
    currentDose: 4,
    sideEffects: ["發燒", "注射部位腫脹", "煩躁不安", "食慾下降"]
  },
  {
    id: "hexavalent-18m",
    name: "六合一疫苗 第4劑（升級版）",
    timing: "出生滿18個月",
    fundingType: "private",
    ageInMonths: 18,
    ageLabel: "18個月",
    doses: 4,
    currentDose: 4,
    sideEffects: ["發燒", "注射部位腫脹", "煩躁不安", "食慾下降"],
    notes: "自費疫苗，為五合一疫苗的升級版，額外包含B型肝炎疫苗",
    priceRange: "$2,100",
    recommendation: "建議施打",
    features: "六合一=五合一+B肝，減少寶寶挨針次數",
    diseasesPrevented: ["白喉", "破傷風", "百日咳", "小兒麻痺", "b型嗜血桿菌", "B型肝炎"]
  },
  {
    id: "hepa-18m",
    name: "A型肝炎疫苗 第2劑",
    timing: "出生滿18-21個月",
    fundingType: "public",
    ageInMonths: 18,
    ageLabel: "18個月",
    doses: 2,
    currentDose: 2,
    sideEffects: ["注射部位疼痛", "疲倦", "輕微發燒"],
    notes: "與第一劑至少間隔6個月"
  },
  {
    id: "je-15m",
    name: "日本腦炎疫苗 第1劑",
    timing: "出生滿15個月",
    fundingType: "public",
    ageInMonths: 15,
    ageLabel: "15個月",
    doses: 3,
    currentDose: 1,
    sideEffects: ["發燒", "注射部位紅腫", "頭痛"],
    notes: "間隔2週接種第2劑"
  },
  {
    id: "je-15m-2",
    name: "日本腦炎疫苗 第2劑",
    timing: "第1劑後2週",
    fundingType: "public",
    ageInMonths: 15.5,
    ageLabel: "15個月後2週",
    doses: 3,
    currentDose: 2,
    sideEffects: ["發燒", "注射部位紅腫", "頭痛"],
    notes: "間隔2週接種"
  },
  {
    id: "je-27m",
    name: "日本腦炎疫苗 第3劑",
    timing: "出生滿27個月",
    fundingType: "public",
    ageInMonths: 27,
    ageLabel: "27個月",
    doses: 3,
    currentDose: 3,
    sideEffects: ["發燒", "注射部位紅腫", "頭痛"],
    notes: "與第一劑至少間隔12個月"
  },
  {
    id: "pneumococcal-2y",
    name: "13價肺炎鏈球菌疫苗 第4劑",
    timing: "2-5歲補接種",
    fundingType: "public",
    ageInMonths: 24,
    ageLabel: "2歲",
    doses: 4,
    currentDose: 4,
    sideEffects: ["發燒", "注射部位紅腫疼痛", "煩躁", "嗜睡"],
    notes: "高風險幼兒追加"
  },
  {
    id: "mmr-5y",
    name: "麻疹腮腺炎德國麻疹混合疫苗 第2劑",
    timing: "滿5歲至入小學前",
    fundingType: "public",
    ageInMonths: 60,
    ageLabel: "5歲",
    doses: 2,
    currentDose: 2,
    sideEffects: ["發燒", "出疹", "注射部位腫痛"]
  },
  {
    id: "varicella-5y",
    name: "水痘疫苗 第2劑",
    timing: "滿4歲至6歲",
    fundingType: "private",
    ageInMonths: 48,
    ageLabel: "4歲",
    doses: 2,
    currentDose: 2,
    sideEffects: ["輕微發燒", "注射部位紅疹", "疲倦"],
    notes: "自費疫苗。第1劑（12個月）保護力約85%，接種第2劑可將保護力提升至95%以上",
    priceRange: "$1,400~$2,000",
    recommendation: "建議施打",
    features: "第2劑可大幅提升保護力至95%以上，有效預防水痘及帶狀皰疹",
    ageLimit: "適用於4歲至6歲",
    diseasesPrevented: ["水痘", "帶狀皰疹"]
  },
  {
    id: "tdap-5y",
    name: "減量破傷風白喉非細胞性百日咳及不活化小兒麻痺混合疫苗",
    timing: "滿5歲至入小學前",
    fundingType: "public",
    ageInMonths: 60,
    ageLabel: "5歲",
    doses: 1,
    sideEffects: ["注射部位痠痛腫脹", "疲倦", "輕微發燒"],
    notes: "俗稱四合一疫苗"
  },
  {
    id: "je-5y",
    name: "日本腦炎疫苗 第4劑",
    timing: "滿5歲至入小學前",
    fundingType: "public",
    ageInMonths: 60,
    ageLabel: "5歲",
    doses: 4,
    currentDose: 4,
    sideEffects: ["發燒", "注射部位紅腫", "頭痛"]
  },
  // 自費疫苗
  {
    id: "enterovirus",
    name: "腸病毒71型疫苗 第1劑",
    timing: "出生滿2個月至6歲",
    fundingType: "private",
    ageInMonths: 2,
    ageLabel: "2個月起",
    doses: 2,
    currentDose: 1,
    sideEffects: ["注射部位紅腫", "輕微發燒", "煩躁"],
    notes: "自費疫苗，間隔2個月接種第2劑。建議在6歲前完成接種，提早接種提早保護",
    priceRange: "$4,000~$4,300",
    recommendation: "建議施打",
    features: "預防腸病毒71型引起的重症，特別是在流行季節（4-9月）前完成接種",
    ageLimit: "適用於2個月至6歲",
    diseasesPrevented: ["腸病毒71型重症", "手足口病嚴重併發症"]
  },
  {
    id: "enterovirus-2",
    name: "腸病毒71型疫苗 第2劑",
    timing: "第1劑後2個月",
    fundingType: "private",
    ageInMonths: 4,
    ageLabel: "4個月",
    doses: 2,
    currentDose: 2,
    sideEffects: ["注射部位紅腫", "輕微發燒", "煩躁"],
    notes: "自費疫苗，與第1劑間隔至少2個月"
  }
];

// 疫苗副作用與處理
export const vaccineSideEffects: VaccineSideEffect[] = [
  {
    category: "常見輕微反應",
    icon: "Thermometer",
    reactions: [
      {
        symptom: "發燒（<38.5°C）",
        severity: "mild",
        response: "多喝水、穿著輕薄衣物、溫水擦拭身體"
      },
      {
        symptom: "注射部位紅腫疼痛",
        severity: "mild",
        response: "冰敷15-20分鐘，避免搓揉"
      },
      {
        symptom: "食慾不振、煩躁不安",
        severity: "mild",
        response: "少量多餐、多安撫、觀察1-2天"
      },
      {
        symptom: "嗜睡",
        severity: "mild",
        response: "讓寶寶充分休息，但需定時確認反應"
      }
    ]
  },
  {
    category: "需密切觀察",
    icon: "AlertCircle",
    reactions: [
      {
        symptom: "持續高燒（≥38.5°C超過24小時）",
        severity: "moderate",
        response: "使用退燒藥（依醫囑），若超過48小時未退燒需就醫"
      },
      {
        symptom: "注射部位硬塊（>2公分）",
        severity: "moderate",
        response: "溫熱敷、輕柔按摩，若持續擴大需回診"
      },
      {
        symptom: "輕微出疹（麻疹、水痘疫苗）",
        severity: "moderate",
        response: "保持皮膚清潔乾燥，避免抓破，5-7天內會消退"
      }
    ]
  },
  {
    category: "立即就醫",
    icon: "AlertTriangle",
    reactions: [
      {
        symptom: "高燒不退（>39°C）伴隨抽搐",
        severity: "severe",
        response: "立即送急診，保持呼吸道暢通"
      },
      {
        symptom: "呼吸困難、臉色蒼白、嘴唇發紫",
        severity: "severe",
        response: "疑似過敏性休克，立即叫救護車"
      },
      {
        symptom: "持續嘔吐、嚴重腹瀉（輪狀病毒疫苗）",
        severity: "severe",
        response: "可能腸套疊，立即就醫"
      },
      {
        symptom: "活動力極差、不吃不喝超過8小時",
        severity: "severe",
        response: "立即就醫檢查"
      }
    ]
  }
];

// 緊急狀況指南
export const vaccineEmergencies: VaccineEmergency[] = [
  {
    id: "seizure",
    symptom: "抽搐或痙攣",
    icon: "Zap",
    action: "保持側臥、移除周圍危險物品、記錄時間長度、立即送急診"
  },
  {
    id: "anaphylaxis",
    symptom: "全身起疹、呼吸困難、嘴唇腫脹",
    icon: "AlertOctagon",
    action: "疑似過敏性休克，立即撥打119並平躺抬高雙腳"
  },
  {
    id: "intussusception",
    symptom: "嚴重腹痛、血便、果醬狀大便",
    icon: "Activity",
    action: "可能腸套疊（輪狀病毒疫苗罕見併發症），立即急診"
  },
  {
    id: "high-fever",
    symptom: "持續高燒>40°C",
    icon: "Flame",
    action: "冰枕降溫、給予退燒藥後立即就醫"
  },
  {
    id: "lethargy",
    symptom: "極度嗜睡、無法喚醒",
    icon: "Moon",
    action: "立即送急診，可能有神經系統反應"
  }
];

// 接種禁忌與注意事項
export const vaccineContraindications = [
  {
    title: "暫緩接種",
    items: [
      "正在發燒（體溫≥38°C）",
      "中重度急性疾病",
      "正在使用免疫抑制劑",
      "近期接受過輸血或免疫球蛋白",
      "孕婦（針對活性減毒疫苗）"
    ]
  },
  {
    title: "絕對禁忌",
    items: [
      "曾對該疫苗成分產生嚴重過敏",
      "接種後曾發生過敏性休克",
      "免疫不全者不可接種活性減毒疫苗（麻疹、水痘、卡介苗、日本腦炎嵌合疫苗、口服輪狀病毒）",
      "嚴重營養不良者不應接種活性減毒疫苗"
    ]
  },
  {
    title: "接種後注意",
    items: [
      "留院觀察至少30分鐘，確認無立即過敏反應",
      "24小時內避免劇烈運動",
      "注射部位保持清潔乾燥，可正常洗澡",
      "記錄接種日期與疫苗批號",
      "接種後應坐著接種，不可平躺"
    ]
  },
  {
    title: "可以接種的情況",
    items: [
      "有咳嗽、流鼻水等呼吸道症狀已有一段時間",
      "正接受抗生素治療",
      "感染症的恢復期",
      "一般感冒症狀（但發高燒除外）"
    ]
  }
];

// 疫苗種類
export const vaccineTypes = [
  {
    type: "非活性疫苗",
    description: "只含病原的部分抗原或已經被去除活性的病原",
    examples: [
      "A型肝炎疫苗",
      "B型肝炎疫苗",
      "白喉類毒素",
      "破傷風類毒素",
      "百日咳疫苗",
      "b型嗜血桿菌疫苗",
      "注射小兒麻痺疫苗",
      "流感疫苗",
      "肺炎鏈球菌疫苗",
      "人類乳突病毒疫苗",
      "腦膜炎球菌疫苗"
    ]
  },
  {
    type: "活性減毒疫苗",
    description: "含有毒性減弱的病原",
    examples: [
      "卡介苗",
      "麻疹疫苗",
      "腮腺炎疫苗",
      "德國麻疹疫苗",
      "水痘疫苗",
      "日本腦炎嵌合疫苗",
      "口服輪狀病毒疫苗"
    ],
    notes: "活性減毒疫苗如不能同時接種，至少需間隔28天"
  }
];

// 疫苗接種重要須知
export const vaccineGuidelines = [
  {
    title: "接種前準備",
    items: [
      "接種應坐著進行，不可平躺",
      "可同時接種多種疫苗於不同部位，數目無上限",
      "活性減毒疫苗若不同時接種，需間隔至少28天"
    ]
  },
  {
    title: "接種後處理",
    items: [
      "注射後在接種單位觀察至少30分鐘",
      "不必特意揉注射部位",
      "可以正常作息，包括洗澡",
      "局部紅腫不可熱敷，冰敷可稍微止痛",
      "注射部位紅腫直徑偶爾可超過10公分，是正常強烈免疫反應"
    ]
  },
  {
    title: "副作用處理",
    items: [
      "發燒反應通常在接種後24小時內發生，不會持續超過24小時",
      "有必要時可給予退燒藥（但預防性退燒藥可能稍微降低免疫效果）",
      "注意補充水分以免脫水",
      "3-5歲以下兒童發燒可能引起熱痙攣，通常不超過15-20分鐘",
      "局部紅腫超過2-3天還擴大，應就醫檢查是否感染",
      "如出現咳嗽、流鼻水、腹瀉等症狀，宜由兒科醫師診治"
    ]
  }
];
