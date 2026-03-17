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
    sideEffects: ["注射部位紅腫", "輕微發燒"],
    notes: "出生後儘速接種"
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
    notes: "自費疫苗，須在6個月前完成"
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
    id: "bcg-5m",
    name: "卡介苗",
    timing: "出生滿5個月",
    fundingType: "public",
    ageInMonths: 5,
    ageLabel: "5個月",
    doses: 1,
    currentDose: 1,
    sideEffects: ["注射部位紅腫結痂", "可能形成疤痕"],
    notes: "預防結核病"
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
    sideEffects: ["發燒", "出疹", "注射部位腫痛"],
    notes: "可能在接種後5-12天出現發燒"
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
    sideEffects: ["注射部位痠痛", "輕微發燒", "疲倦"],
    notes: "每年10月開始接種"
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
    id: "hepa-18m",
    name: "A型肝炎疫苗 第2劑",
    timing: "出生滿18個月",
    fundingType: "public",
    ageInMonths: 18,
    ageLabel: "18個月",
    doses: 2,
    currentDose: 2,
    sideEffects: ["注射部位疼痛", "疲倦", "輕微發燒"]
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
    sideEffects: ["發燒", "注射部位紅腫", "頭痛"]
  },
  {
    id: "je-27m",
    name: "日本腦炎疫苗 第3劑",
    timing: "第1劑後12個月",
    fundingType: "public",
    ageInMonths: 27,
    ageLabel: "27個月",
    doses: 3,
    currentDose: 3,
    sideEffects: ["發燒", "注射部位紅腫", "頭痛"]
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
    name: "腸病毒71型疫苗",
    timing: "出生滿2個月起",
    fundingType: "private",
    ageInMonths: 2,
    ageLabel: "2個月起",
    doses: 2,
    sideEffects: ["注射部位紅腫", "輕微發燒", "煩躁"],
    notes: "自費疫苗，間隔2個月接種"
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
      "近期接受過輸血或免疫球蛋白"
    ]
  },
  {
    title: "絕對禁忌",
    items: [
      "曾對該疫苗成分產生嚴重過敏",
      "接種後曾發生過敏性休克",
      "免疫不全者不可接種活性減毒疫苗（麻疹、水痘、卡介苗）"
    ]
  },
  {
    title: "接種後注意",
    items: [
      "留院觀察30分鐘，確認無立即過敏反應",
      "24小時內避免劇烈運動",
      "注射部位保持清潔乾燥",
      "記錄接種日期與疫苗批號"
    ]
  }
];
