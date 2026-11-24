/**
 * 寶寶百科（0-12 個月）— LittleSteps
 *
 * 內容查證日期：2026-11-24
 *
 * 本檔案 15 篇的 causes / solutions / warningSignals 皆逐篇對照實際開啟閱讀的官方頁面，
 * 未依記憶填寫；查不到出處的數字（室溫、濕度、天數、毫升數等）已刪除。
 * 各篇引用的來源標於該篇物件上方。
 *
 * 來源機關：
 * - 衛生福利部國民健康署 孕產兒關懷網站 https://mammy.hpa.gov.tw/
 * - 衛生福利部疾病管制署 https://www.cdc.gov.tw/
 * - 衛生福利部 https://www.mohw.gov.tw/
 * - 美國兒科學會（AAP）家長衛教網站 https://www.healthychildren.org/
 *
 * 官方來源彼此不一致的三處（發燒溫水擦拭、鼻塞墊高上半身、長牙給硬蔬果），
 * 一律採較保守、與安全睡眠及哽塞預防一致的說法，並在該篇上方註明。
 */

import { BabyWikiArticle, WikiCategory, WikiCategoryColors } from '../../types';

export const wikiCategoryLabels: Record<WikiCategory, string> = {
  skin: '皮膚問題',
  oral: '口腔與長牙',
  motor: '動作發展',
  digestive: '腸胃與排便',
  fever: '發燒與感冒',
  sleep: '睡眠問題',
  daily: '日常照顧',
};

export const babyWikiCategoryColors: Record<WikiCategory, WikiCategoryColors> = {
  skin: { bg: 'bg-pink-50', text: 'text-pink-700', pill: 'bg-pink-100 text-pink-700' },
  oral: { bg: 'bg-sky-50', text: 'text-sky-700', pill: 'bg-sky-100 text-sky-700' },
  motor: { bg: 'bg-emerald-50', text: 'text-emerald-700', pill: 'bg-emerald-100 text-emerald-700' },
  digestive: { bg: 'bg-amber-50', text: 'text-amber-700', pill: 'bg-amber-100 text-amber-700' },
  fever: { bg: 'bg-red-50', text: 'text-red-700', pill: 'bg-red-100 text-red-700' },
  sleep: { bg: 'bg-indigo-50', text: 'text-indigo-700', pill: 'bg-indigo-100 text-indigo-700' },
  daily: { bg: 'bg-teal-50', text: 'text-teal-700', pill: 'bg-teal-100 text-teal-700' },
};

export const babyWikiArticles: BabyWikiArticle[] = [
  // ── 皮膚問題 ──

  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「Drooling Baby? Here’s Why Spit Happens」
  // https://www.healthychildren.org/English/ages-stages/baby/teething-tooth-care/Pages/Drooling-and-Your-Baby.aspx
  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「Teething Pain Relief: How to Soothe Your Baby's Discomfort」
  // https://www.healthychildren.org/English/ages-stages/baby/teething-tooth-care/Pages/Teething-Pain.aspx
  {
    id: 'drool-rash',
    title: '口水疹',
    summary: '寶寶流口水導致嘴巴周圍皮膚紅疹。口水約從 2-3 個月起變多，可持續到 1 歲半左右。',
    category: 'skin',
    causes: [
      '口水長時間接觸皮膚造成刺激',
      '唾液腺約 2-3 個月起分泌變多，但吞嚥口水的肌肉還沒發育好，皮膚長期處於潮濕狀態',
      '頻繁擦拭導致皮膚屏障受損',
    ],
    solutions: [
      { step: '保持乾燥', detail: '使用柔軟紗布巾輕輕沾乾（非擦拭）口水，減少摩擦刺激。' },
      { step: '塗抹保護層', detail: '可請兒科醫師建議適合塗在臉上的隔離乳膏或軟膏，隔開口水與皮膚。' },
      { step: '使用圍兜', detail: '替寶寶戴上柔軟、吸水的棉質圍兜，濕了就換。睡覺（包含小睡）前一定要取下圍兜。' },
      { step: '溫和清潔', detail: '用軟布沾清水輕輕清潔，避免使用含酒精或香精的濕紙巾與清潔產品。' },
    ],
    warningSignals: [
      '口水突然變多，而且寶寶看起來生病、發燒或吞嚥困難：請就醫',
      '突然流口水，同時發不出聲音、疑似哽到或呼吸困難：立即撥打 119',
    ],
    relatedArticleIds: ['teething', 'atopic-dermatitis'],
    icon: 'Droplets',
  },

  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「Common Diaper Rashes & Treatments」
  // https://www.healthychildren.org/English/ages-stages/baby/diapers-clothing/Pages/Diaper-Rash.aspx
  // 來源（2026-11-24 查證）：國民健康署 孕產兒關懷網站「用心呵護寶寶的嬌嫩屁屁！如何預防尿布疹的發生？」
  // https://mammy.hpa.gov.tw/Home/NewsKBContent?id=3597&type=01
  {
    id: 'diaper-rash',
    title: '尿布疹',
    summary: '寶寶臀部、腹股溝出現紅疹或破皮，是嬰兒最常見的皮膚問題之一。',
    category: 'skin',
    causes: [
      '尿液與糞便中的刺激物質長時間接觸皮膚',
      '尿布包覆導致悶熱潮濕，皮膚無法透氣',
      '開始吃副食品後排便的次數與成分改變，增加刺激性',
    ],
    solutions: [
      { step: '勤換尿布', detail: '至少每 2 小時檢查、更換一次，大便後立即更換。' },
      { step: '溫水清洗', detail: '每次換尿布時用溫水沖洗臀部，避免使用含酒精或香精的濕紙巾。' },
      { step: '充分晾乾', detail: '清洗後讓臀部完全自然風乾，再包上新尿布。每天安排「光屁股時間」。' },
      { step: '塗抹護臀膏', detail: '使用含氧化鋅的護臀膏或凡士林，厚厚塗一層形成隔離保護層。' },
      { step: '選擇適合尿布', detail: '選擇透氣性好、吸收力強的尿布，避免包太緊。' },
      { step: '不要自行用藥', detail: '不要自行購買成藥或抗生素藥膏來擦尿布疹，有些成分反而會讓皮膚更刺激；需要用藥時請醫師開立。' },
    ],
    warningSignals: [
      '紅疹出現水泡、膿瘡、脫皮或滲液結痂',
      '紅疹擴散到尿布區域以外',
      '照顧 2-3 天仍未改善，或越來越嚴重',
      '寶寶出現發燒症狀',
    ],
    relatedArticleIds: ['drool-rash', 'atopic-dermatitis'],
    icon: 'Baby',
  },

  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「How to Treat & Control Eczema (Atopic Dermatitis) Rashes in Children」
  // https://www.healthychildren.org/English/health-issues/conditions/skin/Pages/How-to-Treat-and-Control-Eczema-Rashes-in-Children.aspx
  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「Eczema in Babies and Children: Symptoms and Causes」
  // https://www.healthychildren.org/English/health-issues/conditions/skin/Pages/Eczema.aspx
  // 來源（2026-11-24 查證）：國民健康署 孕產兒關懷網站「孩子被診斷為異位性皮膚炎怎麼辦？從病因、診斷、治療到日常照護全解析」
  // https://mammy.hpa.gov.tw/Home/NewsKBContent?id=3650&type=01
  {
    id: 'atopic-dermatitis',
    title: '異位性皮膚炎',
    summary: '反覆發作的慢性皮膚過敏症狀，皮膚乾燥、搔癢、紅疹，好發於臉頰與四肢關節處。',
    category: 'skin',
    causes: [
      '遺傳體質（父母有過敏史則風險較高）',
      '皮膚屏障功能不全，水分容易散失',
      '塵蟎、汗水、毛料衣物、香精等可能誘發或加重；少數孩子的症狀會因特定食物加重',
    ],
    solutions: [
      { step: '加強保濕', detail: '每天 1-2 次，洗澡後趁皮膚還微濕時立刻全身塗抹無香精的保濕乳霜或軟膏（例如凡士林）；乳液較稀、效果較差。疹子退了也要繼續擦。' },
      { step: '溫和洗澡', detail: '用微溫的水洗 5-10 分鐘，使用無香精的低敏清潔用品，洗完用毛巾輕輕按乾。' },
      { step: '避免刺激物', detail: '穿著純棉衣物，避免羊毛或合成纖維。使用無香精洗衣精。' },
      { step: '環境控管', detail: '保持涼爽、減少流汗，定期清洗寢具與環境以減少塵蟎。' },
      { step: '遵醫囑用藥', detail: '急性期依醫師指示使用外用類固醇藥膏，切勿自行停藥或增減劑量。' },
      { step: '不要自行限制飲食', detail: '食物本身不會造成異位性皮膚炎。懷疑某種食物讓症狀加重時，先和醫師討論，不要自行讓寶寶忌口。' },
    ],
    warningSignals: [
      '皮膚滲液、出現黃色結痂、水泡或膿疱（可能感染）',
      '搔癢嚴重影響寶寶睡眠與進食',
      '照平常的方式照顧與用藥仍沒有改善',
    ],
    relatedArticleIds: ['drool-rash', 'diaper-rash'],
    icon: 'Shield',
  },

  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「Roseola in Babies and Toddlers: Symptoms, Causes & When to Call the Doctor」
  // https://www.healthychildren.org/English/health-issues/conditions/skin/Pages/Roseola-Infantum.aspx
  // 來源（2026-11-24 查證）：國民健康署 孕產兒關懷網站「寶寶篇 第34週：舒緩寶寶的長牙不適」（玫瑰疹段落）
  // https://mammy.hpa.gov.tw/Home/NewsKBContent?id=1602&type=01
  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「Fever: When to Call the Pediatrician」
  // https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/When-to-Call-the-Pediatrician.aspx
  {
    id: 'roseola',
    title: '玫瑰疹',
    summary: '好發於 6 個月至 2 歲嬰幼兒，先高燒 3-5 天，退燒後全身出現粉紅色斑丘疹。',
    category: 'skin',
    causes: [
      '人類疱疹病毒第 6 型（HHV-6）或第 7 型感染',
      '經由咳嗽、打噴嚏的飛沫傳染',
      '多數嬰幼兒在 2 歲前會感染過一次',
    ],
    solutions: [
      { step: '先讓醫師看過', detail: '玫瑰疹要等退燒、出疹後才能確定，發燒期間不能當作玫瑰疹自行觀察。請配合兒科醫師的檢查與追蹤。' },
      { step: '退燒處理', detail: '寶寶因發燒不舒服時，依醫師指示使用退燒藥，並補充水分。' },
      { step: '觀察精神狀態', detail: '高燒期間觀察寶寶活動力、食慾與尿量。多數寶寶精神還不錯，但仍要留意下方的就醫警訊。' },
      { step: '皮膚護理', detail: '出疹後不需特別處理，疹子通常不會癢，1-4 天內自行消退。' },
      { step: '居家休養', detail: '發燒期間讓寶寶充分休息，穿著寬鬆透氣衣物。' },
    ],
    warningSignals: [
      '未滿 2 歲發燒超過 24 小時，或體溫反覆超過 40°C：請就醫，不要等出疹才確認',
      '出現熱性痙攣（抽搐）',
      '非常嗜睡、不容易叫醒：立即就醫',
      '不肯喝、濕尿布明顯變少',
      '疹子變成水泡或破皮，或長到嘴唇、口腔內',
    ],
    relatedArticleIds: ['fever-assessment', 'enterovirus'],
    icon: 'Flower2',
  },

  // ── 口腔與長牙 ──

  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「Teething Pain Relief: How to Soothe Your Baby's Discomfort」
  // https://www.healthychildren.org/English/ages-stages/baby/teething-tooth-care/Pages/Teething-Pain.aspx
  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「When Does Teething Start?」
  // https://www.healthychildren.org/English/ages-stages/baby/teething-tooth-care/Pages/Teething-4-to-7-Months.aspx
  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「Fever and Your Baby」
  // https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/Fever-and-Your-Baby.aspx
  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「Choking Prevention for Babies & Children: What Every Parent Needs to Know」
  // https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Choking-Prevention.aspx
  // ——國健署「寶寶篇 第34週」建議給蘋果、芭樂磨牙；AAP 把生的硬蔬果列為哽塞風險食物，本篇採 AAP。
  {
    id: 'teething',
    title: '長牙不適',
    summary: '寶寶約 4-10 個月開始長牙，可能出現牙齦腫脹、流口水增加、情緒不安等症狀。',
    category: 'oral',
    causes: [
      '牙齒穿破牙齦時造成的壓力與不適感',
      '長牙過程中牙齦腫脹、觸痛',
      '口水分泌增加但吞嚥能力尚未成熟',
    ],
    solutions: [
      { step: '冰涼固齒器', detail: '將固齒器放入冰箱冷藏（非冷凍），冰涼感可舒緩牙齦腫脹。' },
      { step: '清潔紗布按摩', detail: '用乾淨濕紗布輕輕按摩寶寶牙齦，減輕不適感。' },
      { step: '提供咬的東西', detail: '給冷藏過的固齒器，或打結後冰過的濕紗布巾。不要給生的硬蔬菜棒（例如紅蘿蔔條），有哽噎的風險。' },
      { step: '轉移注意力', detail: '用遊戲、音樂等方式分散寶寶對牙齦不適的注意力。' },
      { step: '不要用長牙凝膠與項鍊', detail: '不要使用含麻醉成分（benzocaine、lidocaine）的長牙凝膠，也不要讓寶寶戴琥珀或矽膠長牙項鍊，有中毒、哽塞與勒住脖子的風險。' },
    ],
    warningSignals: [
      '體溫 38°C 以上：長牙不會造成發燒，應視為生病，請就醫',
      '哭鬧明顯比平常多，或腹瀉超過一天：不是長牙造成的，請就醫',
    ],
    relatedArticleIds: ['drool-rash', 'nursing-strike'],
    icon: 'Smile',
  },

  // ── 腸胃與排便 ──

  // 來源（2026-11-24 查證）：國民健康署 孕產兒關懷網站「寶寶篇 第17週：如何分辦寶寶穿得夠暖嗎？」（厭奶期段落）
  // https://mammy.hpa.gov.tw/Home/NewsKBContent?id=1575&type=01
  // 來源（2026-11-24 查證）：國民健康署 孕產兒關懷網站「營養小常識-副食品添加原則」
  // https://mammy.hpa.gov.tw/Home/NewsKBContent?id=3628&type=01
  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「Signs of Dehydration in Infants & Children」
  // https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/dehydration.aspx
  // ——官方來源對厭奶期只有一段說明；查不到出處的月齡、持續週數與餵法已刪除，不依記憶補寫。
  {
    id: 'nursing-strike',
    title: '厭奶期',
    summary: '寶寶喝奶忽多忽少，有時甚至不想喝，常見於 4 個月前後。先確認寶寶沒有生病。',
    category: 'digestive',
    causes: [
      '寶寶開始對外界好奇，注意力分散，不專心喝奶',
      '要先排除生病：沒有生病或其他原因的喝奶變少才算厭奶期',
    ],
    solutions: [
      { step: '營造安靜環境', detail: '找一處沒有太多干擾的地方餵奶，讓寶寶可以專心喝。' },
      { step: '少量多餐', detail: '調整餵奶次數、平均分攤奶量；這一餐喝得少，可以在下一餐補回。' },
      { step: '增加活動量', detail: '寶寶體力比剛出生時好，白天多活動可以提升飢餓感。' },
      { step: '鼓勵取代強迫', detail: '不要強迫寶寶喝完，讓喝奶沒有壓力。滿 4 個月後仍持續厭奶，可以和兒科醫師討論是否開始添加副食品。' },
    ],
    warningSignals: [
      '尿量明顯減少（一天少於 6 次濕尿布）、嘴巴很乾、哭的時候眼淚變少：請立即就醫',
      '精神活力變差、發燒或看起來生病：不要等，請就醫',
      '體重持續下降或生長曲線明顯偏離',
    ],
    relatedArticleIds: ['teething', 'colic'],
    icon: 'MilkOff',
  },

  // 來源（2026-11-24 查證）：國民健康署 孕產兒關懷網站「健康小常識-腸絞痛」
  // https://mammy.hpa.gov.tw/Home/NewsKBContent?id=3640&type=01
  // 來源（2026-11-24 查證）：國民健康署 孕產兒關懷網站「常見的嬰兒健康問題及處理方法」
  // https://mammy.hpa.gov.tw/Home/NewsKBContent?id=2491&type=01
  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「Colic Relief Tips for Parents」
  // https://www.healthychildren.org/English/ages-stages/baby/crying-colic/Pages/Colic.aspx
  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「How to Calm a Fussy Baby: Tips for Parents & Caregivers」
  // https://www.healthychildren.org/English/ages-stages/baby/crying-colic/Pages/Calming-A-Fussy-Baby.aspx
  {
    id: 'colic',
    title: '腸絞痛',
    summary: '常見於出生 10 天到 3 個月大的嬰兒，多在傍晚或半夜哭鬧、很難安撫，一天可能長達 3 小時。',
    category: 'digestive',
    causes: [
      '原因不明，可能與寶寶神經系統尚未發育成熟、不容易自我安撫有關',
      '少數與牛奶蛋白過敏，或對母乳媽媽飲食中的某些食物敏感有關',
      '要先排除發燒、疝氣等需要治療的疾病，才能當作腸絞痛',
    ],
    solutions: [
      { step: '趴在大人腿上', detail: '讓寶寶趴著橫跨在大人雙腿上（或飛機抱），輕拍背部，腹部受壓會比較舒服。寶寶睡著後要放回嬰兒床仰睡。' },
      { step: '腹部按摩', detail: '在寶寶腹部輕輕按摩，並把寶寶抱直，幫助腸胃把氣體排出。' },
      { step: '不要過量餵奶', detail: '餵太多會讓寶寶不舒服，兩次餵奶的間隔盡量拉長到至少 2-2.5 小時。' },
      { step: '白噪音安撫', detail: '輕搖寶寶，或讓他聽吹風機、電風扇、洗衣機等規律低沉的聲音。' },
      { step: '奶嘴與包巾', detail: '寶寶願意的話可以給奶嘴；用薄的大包巾包起來能增加安全感，但要避免遮住口鼻或過熱。' },
      { step: '大人輪流休息', detail: '再怎麼哭都不可以搖晃寶寶。撐不住時把寶寶仰躺放回嬰兒床，離開房間幾分鐘，或請家人接手。' },
    ],
    warningSignals: [
      '發燒：未滿 3 個月體溫 38°C 以上要立即就醫',
      '伴隨嘔吐、腹瀉',
      '體重沒有增加或下降',
      '哭鬧的樣子和平常不同、越來越嚴重：需請醫師排除疝氣等急症',
      '腸絞痛通常在 3-4 個月大時開始消失，最晚到 6 個月；超過這個月齡仍持續請就醫',
    ],
    relatedArticleIds: ['constipation', 'nursing-strike'],
    icon: 'Frown',
  },

  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「How Can I Tell If My Baby is Constipated?」
  // https://www.healthychildren.org/English/ages-stages/baby/diapers-clothing/Pages/Infant-Constipation.aspx
  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「Choosing a Baby Formula」
  // https://www.healthychildren.org/English/ages-stages/baby/formula-feeding/Pages/Choosing-an-Infant-Formula.aspx
  // 來源（2026-11-24 查證）：國民健康署 孕產兒關懷網站「寶寶篇 第18週：寶寶便祕了！注意飲食攝取」
  // https://mammy.hpa.gov.tw/Home/NewsKBContent?id=1576&type=01
  // 來源（2026-11-24 查證）：國民健康署 孕產兒關懷網站「寶寶篇 第33週：如何與33週寶寶親子共讀？」（兩餐之間喝白開水）
  // https://mammy.hpa.gov.tw/Home/NewsKBContent?id=1601&type=01
  {
    id: 'constipation',
    title: '便秘',
    summary: '大便又乾又硬、排便次數明顯變少才是便秘；寶寶排便時用力、臉紅甚至哭，光是這樣不算。常見於換奶或開始添加副食品後。',
    category: 'digestive',
    causes: [
      '副食品添加初期膳食纖維攝取不足',
      '水分攝取不夠，尤其是開始吃副食品後',
      '母奶轉換配方奶時，可能對成分不適應或腸胃功能尚未成熟（配方奶裡的鐵不會造成便秘）',
    ],
    solutions: [
      { step: '增加水分', detail: '開始吃副食品後，可以在兩餐奶之間給寶寶喝一點白開水，不要給糖水或含糖飲料。' },
      { step: '高纖食物', detail: '在副食品中加入蔬菜與水果，例如黑棗泥、梨子泥、地瓜泥，並以果泥取代過濾果汁。' },
      { step: '換奶前先問醫師', detail: '懷疑和配方奶有關時，先和兒科醫師討論需不需要換奶，不要自行換成低鐵配方。' },
      { step: '調整後沒改善就看醫師', detail: '調整飲食後仍然便秘，請帶寶寶就醫，不要自行使用通便藥物。' },
    ],
    warningSignals: [
      '大便異常乾硬，或因大便太硬而帶血',
      '用力超過 10 分鐘仍解不出來',
      '比平常更煩躁，或溢吐奶明顯變多',
      '未滿 1 個月的新生兒每天排便不到一次：可能是吃得不夠，請就醫',
    ],
    relatedArticleIds: ['colic', 'nursing-strike'],
    icon: 'Gauge',
  },

  // ── 發燒與感冒 ──

  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「How to Care for Your Child’s Cold」
  // https://www.healthychildren.org/English/health-issues/conditions/flu/Pages/caring-for-Your-childs-cold-or-flu.aspx
  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「Children & Colds (Upper Respiratory Infections)」
  // https://www.healthychildren.org/English/health-issues/conditions/ear-nose-throat/Pages/Children-and-Colds.aspx
  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「Fever and Your Baby」
  // https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/Fever-and-Your-Baby.aspx
  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「How to Keep Your Sleeping Baby Safe: AAP Policy Explained」
  // https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/A-Parents-Guide-to-Safe-Sleep.aspx
  // 來源（2026-11-24 查證）：國民健康署 孕產兒關懷網站「寶寶篇 第39週：舒緩鼻塞這樣做」（只引用 2 歲以下不用薄荷油）
  // https://mammy.hpa.gov.tw/Home/NewsKBContent?id=1607&type=01
  // ——同一頁建議「睡覺時墊高上半身」，與 AAP 安全睡眠「平坦、不傾斜」相反，本篇採 AAP，不引用那一句。
  {
    id: 'nasal-congestion',
    title: '鼻塞處理',
    summary: '嬰兒鼻腔狹窄，鼻塞是常見困擾，影響喝奶與睡眠品質。',
    category: 'fever',
    causes: [
      '上呼吸道感染（感冒）導致鼻黏膜腫脹',
      '空氣乾燥使鼻腔分泌物變乾結塊',
      '過敏原（塵蟎、花粉）刺激鼻腔黏膜',
    ],
    solutions: [
      { step: '生理食鹽水滴鼻', detail: '用嬰兒專用生理食鹽水各滴 1-2 滴到鼻孔，軟化鼻屎後再清理。' },
      { step: '吸鼻器清理', detail: '使用嬰兒吸鼻器輕柔吸出鼻涕，每次使用前後要清潔。' },
      { step: '提高濕度', detail: '可以在房間使用加濕器，放在寶寶拿不到的地方，並依說明書經常清洗。' },
      { step: '睡前先清鼻', detail: '睡前用生理食鹽水與吸鼻器把鼻子清乾淨。睡覺仍要仰睡在平坦、堅固的床面，不要墊高床墊，也不要用傾斜的睡墊。' },
      { step: '不要自行給感冒藥', detail: '4 歲以下不可自行使用市售的止咳、感冒藥；未滿 1 歲不可吃蜂蜜；2 歲以下不建議使用薄荷油等涼感產品。' },
    ],
    warningSignals: [
      '呼吸急促、出現喘鳴聲，或呼吸時鼻翼搧動、肋骨間凹陷',
      '嘴唇或指甲發紫（缺氧徵兆）',
      '鼻涕持續超過 10-14 天',
      '3 個月以下：一有感冒症狀就聯絡醫師，體溫 38°C 以上要立即就醫',
      '3-6 個月體溫 38.3°C 以上、6 個月以上 39.4°C 以上：請就醫',
    ],
    relatedArticleIds: ['fever-assessment', 'enterovirus'],
    icon: 'Wind',
  },

  // 來源（2026-11-24 查證）：國民健康署 孕產兒關懷網站「健康小常識-發燒的正確處置」（兒童衛教手冊 2024 年 7 月版）
  // https://mammy.hpa.gov.tw/Home/NewsKBContent?id=3642&type=01
  // 來源（2026-11-24 查證）：國民健康署 孕產兒關懷網站「常見的嬰兒健康問題及處理方法」（腋溫換算）
  // https://mammy.hpa.gov.tw/Home/NewsKBContent?id=2491&type=01
  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「Fever: When to Call the Pediatrician」
  // https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/When-to-Call-the-Pediatrician.aspx
  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「Fever Without Fear: Information for Parents」
  // https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/Fever-Without-Fear.aspx
  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「Acetaminophen Dosing Tables for Fever and Pain in Children」
  // https://www.healthychildren.org/English/safety-prevention/at-home/medication-safety/Pages/Acetaminophen-for-Fever-and-Pain.aspx
  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「Ibuprofen Dosing Table for Fever and Pain」
  // https://www.healthychildren.org/English/safety-prevention/at-home/medication-safety/Pages/Ibuprofen-for-Fever-and-Pain.aspx
  // ——「常見的嬰兒健康問題及處理方法」建議溫水擦拭；兒童衛教手冊與 AAP 都說沒有退燒效果、不建議，本篇採後者。
  {
    id: 'fever-assessment',
    title: '發燒判斷',
    summary: '了解嬰幼兒發燒的正確量測方式、處理原則與何時需要就醫。',
    category: 'fever',
    causes: [
      '病毒或細菌感染（最常見原因）',
      '預防接種後的正常免疫反應',
      '穿太多衣物或環境過於悶熱',
    ],
    solutions: [
      { step: '正確量體溫', detail: '使用耳溫槍或肛溫計。耳溫 ≥ 38°C、肛溫 ≥ 38°C 即為發燒。3 個月以下耳溫不準，以肛溫或腋溫為準。腋溫平均比中心體溫低約 0.8°C，腋溫超過 37.2°C 即視為發燒。未滿 1 個月的新生兒不適合量肛溫與耳溫，改量腋溫或背溫。' },
      { step: '不要穿太多', detail: '不要穿太多、不要包太緊，穿一層衣服即可。不建議溫水拭浴、冰枕或酒精擦拭：這些方法沒有退燒效果，反而增加寶寶的負擔；只有穿太多或中暑這類散熱失調，物理降溫才有幫助。' },
      { step: '適時用退燒藥', detail: '退燒藥是為了讓寶寶舒服，不是把數字壓下來；體溫沒超過 39°C、寶寶也沒有不舒服時不必急著退燒。未滿 3 個月發燒不要自行給藥，直接就醫；未滿 2 歲用藥前先問醫師劑量；布洛芬（ibuprofen）未滿 6 個月不可使用；兒童不可使用阿斯匹靈。' },
      { step: '補充水分', detail: '發燒時水分流失增加，頻繁少量哺乳；是否需要電解質液請問醫師。' },
      { step: '持續觀察記錄', detail: '定時量體溫並記錄，觀察精神活力、進食與尿量。體溫高低不一定代表疾病嚴重程度，退燒後精神仍然不好也要就醫。' },
    ],
    warningSignals: [
      '未滿 3 個月的嬰兒體溫 38°C 以上（立即就醫，不要先觀察）',
      '呼吸困難、呼吸很快或很費力',
      '精神萎靡、持續嗜睡、無法喚醒',
      '出現熱性痙攣（抽搐、眼睛上翻）',
      '脖子僵硬，或身上出現按壓不會消退的紫紅色斑點',
      '尿量明顯減少、哭沒有眼淚、嘴巴很乾（脫水）',
      '體溫反覆超過 40°C',
      '未滿 2 歲發燒超過 24 小時；2 歲以上發燒超過 3 天',
    ],
    relatedArticleIds: ['roseola', 'enterovirus', 'nasal-congestion'],
    icon: 'Thermometer',
  },

  // 來源（2026-11-24 查證）：疾病管制署「腸病毒感染併發重症」
  // https://www.cdc.gov.tw/Disease/SubIndex/m3zdUk3u9GJVvddeSnhkiA
  // 來源（2026-11-24 查證）：疾病管制署「腸病毒感染併發重症－疾病介紹」（流行季、潛伏期、預防與消毒方法）
  // https://www.cdc.gov.tw/Category/Page/FgfRlDl6XxDkuqaOghuNfQ
  // 來源（2026-11-24 查證）：疾病管制署「腸病毒Q&A」
  // https://www.cdc.gov.tw/Category/QAPage/uWGc1UXjKbX7uC1uTG5_2Q
  // 來源（2026-11-24 查證）：國民健康署 孕產兒關懷網站「健康小常識-不和腸病毒打交道」
  // https://mammy.hpa.gov.tw/Home/NewsKBContent?id=3641&type=01
  // ——「疾病介紹」頁的治療照護段寫「5天內」，主頁與 Q&A 寫 7 天、一週，本篇採 7 天。
  {
    id: 'enterovirus',
    title: '腸病毒注意事項',
    summary: '台灣全年都有腸病毒病例：每年約 3 月下旬開始上升，5 月底至 6 月中達到高峰，9 月開學後再出現一波。5 歲以下幼兒為重症高危險群，需特別留意。',
    category: 'fever',
    causes: [
      '腸病毒經由糞口、飛沫或接觸傳染',
      '潛伏期 2-10 天（平均 3-5 天），發病前幾天就有傳染力，發病後一週內傳染力最強',
      '台灣高溫潮濕氣候有利病毒存活與傳播',
    ],
    solutions: [
      { step: '勤洗手', detail: '外出返家、飯前飯後、換尿布後，以肥皂正確洗手。大人外出返家先更衣、洗手，再抱或餵寶寶。' },
      { step: '環境消毒', detail: '酒精殺不死腸病毒，要用稀釋的含氯漂白水：門把、玩具等一般環境用 500ppm；沾到分泌物、嘔吐物或排泄物的物品用 1000ppm。玩具要經常清洗、消毒。' },
      { step: '避免群聚', detail: '流行期間減少出入人多擁擠、空氣不流通的場所，避免接觸生病的兒童。' },
      { step: '生病在家休息', detail: '感染後請假在家休息至少一週，避免傳染給其他孩子。' },
      { step: '居家觀察', detail: '發病後 7 天內特別留意。出現下面任何一項重症前兆，立即送大醫院，不要等。' },
    ],
    warningSignals: [
      '持續嘔吐、嗜睡、意識不清',
      '肌躍型抽搐（類似受到驚嚇的突發性全身肌肉收縮動作）',
      '持續發燒、活動力下降、手腳無力',
      '沒有發燒時呼吸急促或心跳加快',
      '新生兒出現發燒、活力不佳、喝奶量變少：儘速送醫院',
    ],
    relatedArticleIds: ['fever-assessment', 'roseola'],
    icon: 'Bug',
  },

  // ── 動作發展 ──

  // 來源（2026-11-24 查證）：國民健康署 孕產兒關懷網站「寶寶開始翻身、學坐了！爸媽要注意哪些事＆怎麼協助？」
  // https://mammy.hpa.gov.tw/Home/NewsKBContent?id=3657&type=01
  // 來源（2026-11-24 查證）：衛生福利部「兒童健康手冊 爸媽的好幫手~寶貝的成長發展紀錄 為您的孩子健康把關」
  // https://www.mohw.gov.tw/cp-16-58340-1.html
  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「Developmental Milestones: 7 Months」
  // https://www.healthychildren.org/English/ages-stages/baby/Pages/Developmental-Milestones-7-Months.aspx
  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「Concussions in Babies: What to Do If Your Infant or Toddler Hits Their Head」
  // https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/concussions-in-babies-what-to-do-if-your-infant-or-toddler-hits-their-head.aspx
  // 來源（2026-11-24 查證）：國民健康署 孕產兒關懷網站「寶寶摔落跌倒了怎麼辦？」
  // https://mammy.hpa.gov.tw/Home/NewsKBContent?id=1829&type=01
  // 來源（2026-11-24 查證）：國民健康署 孕產兒關懷網站「嬰幼兒意外事故防制與居家安全」
  // https://mammy.hpa.gov.tw/Home/NewsKBContent?id=1830&type=01
  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「How to Keep Your Sleeping Baby Safe: AAP Policy Explained」（想翻身就停用包巾）
  // https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/A-Parents-Guide-to-Safe-Sleep.aspx
  {
    id: 'rolling-safety',
    title: '翻身安全',
    summary: '寶寶約 4-6 個月開始練習翻身，需注意居家安全防護，避免墜落意外。',
    category: 'motor',
    causes: [
      '寶寶肌肉力量發展到可以翻身的階段',
      '翻身是大動作發展的重要里程碑',
      '好奇心驅使寶寶嘗試改變身體姿勢',
    ],
    solutions: [
      { step: '床鋪防護', detail: '寶寶睡在有圍欄的嬰兒床裡；護欄的間隙要小於 6 公分，床邊地板鋪軟墊。不要把寶寶單獨留在大人床或沙發上。' },
      { step: '不離開視線', detail: '在換尿布台、沙發等高處時，一隻手要隨時扶著寶寶。' },
      { step: '移除危險物品', detail: '確保翻身範圍內沒有軟墊、枕頭、塑膠袋等窒息危險物。' },
      { step: '練習安全空間', detail: '在地墊上提供安全的翻身練習空間，鼓勵發展但確保安全。' },
      { step: '停用包巾', detail: '寶寶一出現想翻身的跡象，就不要再用包巾包著睡。' },
    ],
    warningSignals: [
      '6 個月大仍不會翻身（建議評估發展）',
      '身體非常僵硬，或軟趴趴像布娃娃',
      '跌落或撞到頭後，出現以下任一項立即送急診：曾失去意識（即使很短）、抽搐、反覆嘔吐、哭不停無法安撫、不肯喝奶、昏睡叫不醒、臉色蒼白',
      '跌落後 2-3 天內都要持續觀察上面這些症狀',
    ],
    relatedArticleIds: ['crawling-safety', 'sids-prevention'],
    icon: 'RotateCcw',
  },

  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「Movement Milestones in Babies 8 to 12 Months Old」
  // https://www.healthychildren.org/English/ages-stages/baby/Pages/Movement-8-to-12-Months.aspx
  // 來源（2026-11-24 查證）：國民健康署 孕產兒關懷網站「寶寶篇 第35週：寶寶爬行環境的佈置」
  // https://mammy.hpa.gov.tw/Home/NewsKBContent?id=1603&type=01
  // 來源（2026-11-24 查證）：國民健康署 孕產兒關懷網站「寶寶篇 第29週：寶寶會爬時～家人應多注意環境安全」
  // https://mammy.hpa.gov.tw/Home/NewsKBContent?id=1591&type=01
  // 來源（2026-11-24 查證）：國民健康署 孕產兒關懷網站「嬰幼兒意外事故防制與居家安全」
  // https://mammy.hpa.gov.tw/Home/NewsKBContent?id=1830&type=01
  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「AHA, AAP Update CPR Guidelines To Help Save Young Lives」（未滿 1 歲哽塞處理）
  // https://www.healthychildren.org/English/news/Pages/AHA-and-AAP-release-update-CPR-guidelines-to-help-save-young-lives.aspx
  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「How Small Batteries Can Become Dangerous to Children」
  // https://www.healthychildren.org/English/safety-prevention/at-home/Pages/Button-Battery-Injuries-in-Children-A-Growing-Risk.aspx
  // ——求救電話 119 為台灣的緊急救護號碼；上列來源寫的是當地號碼。
  {
    id: 'crawling-safety',
    title: '爬行安全',
    summary: '寶寶約 7-10 個月開始爬行，活動範圍大增，居家安全防護需全面升級。',
    category: 'motor',
    causes: [
      '上肢與核心肌群發展成熟，足以支撐爬行動作',
      '寶寶強烈的探索慾望驅動移動需求',
      '從匍匐前進到手膝爬行是漸進的發展過程',
    ],
    solutions: [
      { step: '插座保護', detail: '所有低處插座加裝安全蓋，電線收納固定避免寶寶拉扯。' },
      { step: '尖角防護', detail: '桌角、櫃角貼上防撞角或防撞條，降低碰傷風險。' },
      { step: '門檔安全門', detail: '在樓梯口上下、廚房門口安裝安全門，限制寶寶活動範圍。' },
      { step: '地面清潔', detail: '保持地面清潔無小物件（硬幣、鈕扣、鈕扣電池、氣球碎片），避免寶寶撿拾異物放入口中。' },
      { step: '鎖定櫥櫃', detail: '低矮櫥櫃安裝兒童安全鎖，特別是放有清潔劑、藥品的櫃子。' },
    ],
    warningSignals: [
      '9 個月還不會自己坐，或完全沒有用任何方式移動的意願（有些寶寶不爬，改用屁股挪或肚子貼地滑，只要兩側手腳用得一樣多就不必擔心）',
      '爬行姿勢異常（如只用單側手腳）',
      '哽到而無法哭、咳或呼吸：立刻請人撥打 119，未滿 1 歲用 5 次拍背、5 次胸部按壓交替，不要用腹部擠壓法',
      '懷疑吞下鈕扣電池：即使沒有症狀也立即送急診',
    ],
    relatedArticleIds: ['rolling-safety', 'walking-safety'],
    icon: 'Snail',
  },

  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「Movement Milestones in Babies 8 to 12 Months Old」
  // https://www.healthychildren.org/English/ages-stages/baby/Pages/Movement-8-to-12-Months.aspx
  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「Shoes for Active Toddlers」
  // https://www.healthychildren.org/English/ages-stages/toddler/Pages/Shoes-for-Active-Toddlers.aspx
  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「Developmental Milestones: 2 Year Olds」
  // https://www.healthychildren.org/English/ages-stages/toddler/Pages/Developmental-Milestones-2-Year-Olds.aspx
  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「Baby Walkers: A Dangerous Choice」
  // https://www.healthychildren.org/English/safety-prevention/at-home/Pages/Baby-Walkers-A-Dangerous-Choice.aspx
  // 來源（2026-11-24 查證）：國民健康署 孕產兒關懷網站「寶寶篇 第44週：赤腳走路訓練抓地力」
  // https://mammy.hpa.gov.tw/Home/NewsKBContent?id=1623&type=01
  // 來源（2026-11-24 查證）：國民健康署 孕產兒關懷網站「寶寶篇 1歲7~8週：寶寶愛踮腳尖!?」
  // https://mammy.hpa.gov.tw/Home/NewsKBContent?id=1616&type=01
  // 來源（2026-11-24 查證）：國民健康署 孕產兒關懷網站「嬰幼兒意外事故防制與居家安全」（學步車）
  // https://mammy.hpa.gov.tw/Home/NewsKBContent?id=1830&type=01
  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「Concussions in Babies: What to Do If Your Infant or Toddler Hits Their Head」
  // https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/concussions-in-babies-what-to-do-if-your-infant-or-toddler-hits-their-head.aspx
  {
    id: 'walking-safety',
    title: '學步注意事項',
    summary: '寶寶約 10-18 個月開始學走路，跌倒頻繁是正常現象，但需做好安全防護。',
    category: 'motor',
    causes: [
      '下肢肌力與平衡感發展至可嘗試站立行走',
      '每個寶寶發展速度不同，許多寶寶在 1 歲前後踏出第一步，早一點或晚一點都算正常',
      '學步初期重心不穩，跌倒是學習過程的一部分',
    ],
    solutions: [
      { step: '赤腳學步', detail: '在安全的室內環境讓寶寶赤腳學步，可訓練腳的抓地力與足踝的平衡反應。' },
      { step: '避免學步車', detail: '國民健康署建議讓寶寶自行學走，不使用學步車（螃蟹車）：容易造成跌落等頭部傷害，也不會讓寶寶比較快學會走。' },
      { step: '適當輔助', detail: '可扶著穩固、沒有尖角的家具練習站立與側行，或牽著寶寶雙手引導前行。' },
      { step: '選擇合適鞋子', detail: '到戶外走路時才需要穿鞋，選擇柔軟好彎、鞋底防滑的鞋子；室內盡量赤腳。' },
    ],
    warningSignals: [
      '15 個月還沒有任何準備走路的跡象，或 18 個月還不會獨立行走（請安排發展評估）',
      '只用腳尖走路，或 2 歲後仍常踮腳尖走',
      '跌倒撞到頭後，出現以下任一項立即送急診：曾失去意識（即使很短）、抽搐、反覆嘔吐、哭不停無法安撫、不肯吃喝、昏睡叫不醒、臉色蒼白；之後 2-3 天都要持續觀察',
    ],
    relatedArticleIds: ['crawling-safety', 'rolling-safety'],
    icon: 'Footprints',
  },

  // ── 睡眠問題 ──

  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「How to Keep Your Sleeping Baby Safe: AAP Policy Explained」
  // https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/A-Parents-Guide-to-Safe-Sleep.aspx
  // 來源（2026-11-24 查證）：國民健康署 孕產兒關懷網站「營造安全睡眠環境-預防嬰兒猝死症」
  // https://mammy.hpa.gov.tw/Home/NewsKBContent?id=1828&type=01
  // 來源（2026-11-24 查證）：國民健康署 孕產兒關懷網站「生活小常識-培養良好的睡眠習慣、嬰兒猝死症預防有訣竅」
  // https://mammy.hpa.gov.tw/Home/NewsKBContent?id=3626&type=01
  // 來源（2026-11-24 查證）：美國兒科學會（AAP）「When Your Child Needs Emergency Medical Services」
  // https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/When-Your-Child-Needs-Emergency-Medical-Services.aspx
  // ——求救電話 119 為台灣的緊急救護號碼；AAP 頁面寫的是當地號碼。
  {
    id: 'sids-prevention',
    title: '嬰兒猝死症預防',
    summary: '嬰兒猝死症（SIDS）是 1 歲以下嬰兒的主要死因之一，可透過安全睡眠環境大幅降低風險。',
    category: 'sleep',
    causes: [
      '確切原因不明；部分嬰兒在睡夢中驚醒的反應較差，口鼻被蓋住時不容易自己移開',
      '趴睡、側睡或不當睡眠環境增加窒息風險',
      '早產、低出生體重嬰兒風險較高；家人抽菸、照顧者喝酒或服用影響清醒的藥物也會提高風險',
    ],
    solutions: [
      { step: '一律仰睡', detail: '每次睡覺（包含午睡）都讓寶寶仰睡，側睡也不安全。會翻身後仍以仰睡放下；還不會兩個方向自己翻身的寶寶翻成趴睡時，把他翻回仰躺。' },
      { step: '堅固平坦床面', detail: '使用符合安全標準的嬰兒床，床墊需堅固且貼合床框。' },
      { step: '淨空睡眠區', detail: '床上不放枕頭、棉被、填充玩偶、防撞墊等軟物。' },
      { step: '同室不同床', detail: '與父母同房但各自睡在獨立的嬰兒床中，至少至 6 個月大。絕對不要抱著寶寶在沙發或扶手椅上睡著。' },
      { step: '不要過熱', detail: '只比大人多穿一層；寶寶流汗、胸口發燙表示太熱。用防踢被或睡袋取代蓋被子，不要用加重型的睡袋或包巾。' },
    ],
    warningSignals: [
      '寶寶沒有呼吸，或臉色、嘴唇發紫：立即撥打 119 並開始急救',
      '曾出現呼吸暫停：即使已恢復也要儘速就醫',
      '使用非嬰兒專用的睡眠空間（如成人床、沙發）',
    ],
    relatedArticleIds: ['rolling-safety'],
    icon: 'ShieldCheck',
  },
];
