import { BabyWikiArticle, WikiCategory } from '../../types';

export const wikiCategoryLabels: Record<WikiCategory, string> = {
  skin: '皮膚問題',
  oral: '口腔與長牙',
  motor: '動作發展',
  digestive: '腸胃與排便',
  fever: '發燒與感冒',
  sleep: '睡眠問題',
  daily: '日常照顧',
  pregnancy: '孕期照護',
};

export const babyWikiArticles: BabyWikiArticle[] = [
  // ── 孕期照護 ──
  {
    id: 'prenatal-nutrition',
    title: '孕期營養攝取',
    summary: '孕期均衡飲食對胎兒發育至關重要，葉酸、鐵質、鈣質是關鍵營養素。',
    category: 'pregnancy',
    causes: [],
    solutions: [
      { step: '補充葉酸', detail: '懷孕初期應額外補充葉酸，預防胎兒神經管缺陷。' },
      { step: '鐵質與鈣質', detail: '多攝取深綠色蔬菜、瘦肉及乳製品，滿足胎兒骨骼與血液發育需求。' },
      { step: '少量多餐', detail: '若有孕吐困擾，採取少量多餐方式減少胃部壓力。' },
    ],
    warningSignals: ['嚴重營養不良', '持續性劇烈嘔吐無法進食'],
    relatedArticleIds: [],
    icon: 'Apple',
  },
  {
    id: 'prenatal-exercise',
    title: '孕期運動建議',
    summary: '適度運動有助於控制體重、緩解下背痛並增加順產機率。',
    category: 'pregnancy',
    causes: [],
    solutions: [
      { step: '選擇合適運動', detail: '孕婦瑜伽、散步、游泳是相對安全的運動選擇。' },
      { step: '注意強度', detail: '運動時以感覺稍微喘但仍可對話為原則。' },
    ],
    warningSignals: ['運動時出現腹部疼痛', '陰道出血'],
    relatedArticleIds: [],
    icon: 'Activity',
  },
  // ... (keep existing articles)
  {
    id: 'drool-rash',
    title: '口水疹',
    summary: '寶寶流口水導致嘴巴周圍皮膚紅疹，常見於 3-6 個月大量分泌口水的時期。',
    category: 'skin',
    causes: [
      '口水中的消化酵素長時間刺激皮膚',
      '長牙期口水分泌增加，皮膚長期處於潮濕狀態',
      '頻繁擦拭導致皮膚屏障受損',
    ],
    solutions: [
      { step: '保持乾燥', detail: '使用柔軟紗布巾輕輕沾乾（非擦拭）口水，減少摩擦刺激。' },
      { step: '塗抹保護層', detail: '在嘴巴周圍塗上凡士林或含氧化鋅的護膚膏，形成防水屏障。' },
      { step: '使用圍兜', detail: '替寶寶戴上吸水力好的圍兜，減少口水接觸皮膚的時間。' },
      { step: '溫和清潔', detail: '每日用溫水輕洗患處，避免使用含香精的清潔產品。' },
    ],
    warningSignals: [
      '皮膚出現水泡、流膿或破皮感染跡象',
      '紅疹範圍持續擴大且未改善超過一週',
      '寶寶因疼痛而拒絕進食',
    ],
    relatedArticleIds: ['teething', 'atopic-dermatitis'],
    icon: 'Droplets',
  },
  {
    id: 'diaper-rash',
    title: '尿布疹',
    summary: '寶寶臀部、腹股溝出現紅疹或破皮，是嬰兒最常見的皮膚問題之一。',
    category: 'skin',
    causes: [
      '尿液與糞便中的刺激物質長時間接觸皮膚',
      '尿布包覆導致悶熱潮濕，皮膚無法透氣',
      '更換副食品後糞便成分改變，增加刺激性',
    ],
    solutions: [
      { step: '勤換尿布', detail: '每 2-3 小時檢查並更換一次，大便後立即更換。' },
      { step: '溫水清洗', detail: '每次換尿布時用溫水沖洗臀部，避免使用含酒精的濕紙巾。' },
      { step: '充分晾乾', detail: '清洗後讓臀部完全自然風乾，再包上新尿布。每天安排「光屁股時間」。' },
      { step: '塗抹護臀膏', detail: '使用含氧化鋅的護臀膏或凡士林，形成隔離保護層。' },
      { step: '選擇適合尿布', detail: '選擇透氣性好、吸收力強的尿布，避免包太緊。' },
    ],
    warningSignals: [
      '紅疹出現水泡、膿瘡或出血',
      '紅疹擴散到尿布區域以外',
      '使用護臀膏三天仍未改善',
      '寶寶出現發燒症狀',
    ],
    relatedArticleIds: ['drool-rash', 'atopic-dermatitis'],
    icon: 'Baby',
  },
  {
    id: 'atopic-dermatitis',
    title: '異位性皮膚炎',
    summary: '反覆發作的慢性皮膚過敏症狀，皮膚乾燥、搔癢、紅疹，好發於臉頰與四肢關節處。',
    category: 'skin',
    causes: [
      '遺傳體質（父母有過敏史則風險較高）',
      '皮膚屏障功能不全，水分容易散失',
      '環境過敏原（塵蟎、花粉）或食物過敏誘發',
    ],
    solutions: [
      { step: '加強保濕', detail: '每日至少塗抹 2-3 次無香精保濕乳液，洗澡後 3 分鐘內擦最佳。' },
      { step: '溫和洗澡', detail: '水溫控制在 37°C 以下，使用低敏沐浴乳，洗澡時間不超過 10 分鐘。' },
      { step: '避免刺激物', detail: '穿著純棉衣物，避免羊毛或合成纖維。使用無香精洗衣精。' },
      { step: '環境控管', detail: '保持室溫 24-26°C、濕度 50-60%，定期清潔避免塵蟎。' },
      { step: '遵醫囑用藥', detail: '急性期依醫師指示使用外用類固醇藥膏，切勿自行停藥或增減劑量。' },
    ],
    warningSignals: [
      '皮膚大面積滲液、結痂或感染',
      '搔癢嚴重影響寶寶睡眠與進食',
      '反覆發作無法控制，需評估過敏原',
    ],
    relatedArticleIds: ['drool-rash', 'diaper-rash'],
    icon: 'Shield',
  },
  {
    id: 'roseola',
    title: '玫瑰疹',
    summary: '好發於 6 個月至 2 歲嬰幼兒，先高燒 3-5 天，退燒後全身出現粉紅色斑丘疹。',
    category: 'skin',
    causes: [
      '人類疱疹病毒第 6 型（HHV-6）感染',
      '經由飛沫或接觸傳染，潛伏期約 5-15 天',
      '多數嬰幼兒在 2 歲前會感染過一次',
    ],
    solutions: [
      { step: '退燒處理', detail: '體溫超過 38.5°C 可使用醫師開立的退燒藥，並補充水分。' },
      { step: '觀察精神狀態', detail: '高燒期間觀察寶寶活動力與食慾，精神好則不需過度擔心。' },
      { step: '皮膚護理', detail: '出疹後不需特別處理，疹子通常 1-3 天內自行消退且不留疤。' },
      { step: '居家休養', detail: '發燒期間讓寶寶充分休息，穿著寬鬆透氣衣物。' },
    ],
    warningSignals: [
      '高燒超過 40°C 或持續超過 5 天',
      '出現熱性痙攣（抽搐）',
      '寶寶精神萎靡、持續哭鬧不安',
      '退燒後皮疹持續超過一週',
    ],
    relatedArticleIds: ['fever-assessment', 'enterovirus'],
    icon: 'Flower2',
  },

  // ── 口腔與長牙 ──
  {
    id: 'teething',
    title: '長牙不適',
    summary: '寶寶約 4-10 個月開始長牙，可能出現牙齦腫脹、流口水增加、情緒不安等症狀。',
    category: 'oral',
    causes: [
      '牙齒穿破牙齦時造成的壓力與不適感',
      '長牙過程中牙齦充血腫脹，刺激神經末梢',
      '口水分泌增加但吞嚥能力尚未成熟',
    ],
    solutions: [
      { step: '冰涼固齒器', detail: '將固齒器放入冰箱冷藏（非冷凍），冰涼感可舒緩牙齦腫脹。' },
      { step: '清潔紗布按摩', detail: '用乾淨濕紗布輕輕按摩寶寶牙齦，減輕不適感。' },
      { step: '提供咬食物品', detail: '給予適齡的磨牙餅乾或冰涼的蔬菜棒（如紅蘿蔔條）讓寶寶啃咬。' },
      { step: '轉移注意力', detail: '用遊戲、音樂等方式分散寶寶對牙齦不適的注意力。' },
    ],
    warningSignals: [
      '發燒超過 38.5°C 持續超過 24 小時（可能非長牙引起）',
      '牙齦嚴重紅腫、化膿或出血不止',
      '寶寶完全拒絕進食超過一天',
    ],
    relatedArticleIds: ['drool-rash', 'nursing-strike'],
    icon: 'Smile',
  },

  // ── 腸胃與排便 ──
  {
    id: 'nursing-strike',
    title: '厭奶期',
    summary: '寶寶突然對奶量明顯減少或拒絕喝奶，常見於 3-4 個月與 6-8 個月。',
    category: 'digestive',
    causes: [
      '生理性厭奶：寶寶開始對環境好奇，注意力分散不專心喝奶',
      '長牙、鵝口瘡等口腔不適導致喝奶疼痛',
      '副食品添加後味覺改變，對單調奶味興趣下降',
    ],
    solutions: [
      { step: '營造安靜環境', detail: '在安靜、光線柔和的環境中餵奶，減少外界干擾。' },
      { step: '少量多餐', detail: '不強迫寶寶一次喝完，改為少量多次餵食。' },
      { step: '調整餵食時機', detail: '在寶寶半睡半醒或剛睡醒時餵奶，此時較不抗拒。' },
      { step: '耐心等待', detail: '生理性厭奶通常持續 1-4 週會自然恢復，不需過度焦慮。' },
    ],
    warningSignals: [
      '體重持續下降或生長曲線明顯偏離',
      '尿量明顯減少（一天少於 6 次濕尿布）',
      '厭奶超過一個月且精神活力下降',
    ],
    relatedArticleIds: ['teething', 'colic'],
    icon: 'MilkOff',
  },
  {
    id: 'colic',
    title: '腸絞痛',
    summary: '好發於 2 週至 4 個月大的嬰兒，每天固定時段（多在傍晚）持續哭鬧超過 3 小時。',
    category: 'digestive',
    causes: [
      '腸道神經系統發育未成熟，腸道蠕動不規律',
      '喝奶時吞入過多空氣，造成脹氣不適',
      '對配方奶蛋白質或母乳中某些成分敏感',
    ],
    solutions: [
      { step: '飛機抱姿勢', detail: '讓寶寶趴在前臂上（飛機抱），腹部受壓有助排氣。' },
      { step: '順時針腹部按摩', detail: '以肚臍為中心，用指腹順時針輕輕畫圓按摩，幫助腸道蠕動。' },
      { step: '充分拍嗝', detail: '每次餵奶中途與餵完後都要拍嗝，減少腹脹。' },
      { step: '白噪音安撫', detail: '使用吹風機聲、流水聲等白噪音，模擬子宮內環境安撫寶寶。' },
      { step: '注意奶瓶選擇', detail: '使用防脹氣奶瓶，確保奶嘴孔大小合適，減少吞入空氣。' },
    ],
    warningSignals: [
      '伴隨嘔吐、腹瀉、血便等症狀',
      '哭鬧時腹部明顯鼓脹且僵硬',
      '超過 4 個月仍未改善',
      '體重增長停滯',
    ],
    relatedArticleIds: ['constipation', 'nursing-strike'],
    icon: 'Frown',
  },
  {
    id: 'constipation',
    title: '便秘',
    summary: '寶寶排便困難、大便乾硬，排便時會用力哭鬧，常見於開始添加副食品後。',
    category: 'digestive',
    causes: [
      '副食品添加初期膳食纖維攝取不足',
      '水分攝取不夠，尤其是開始吃副食品後',
      '配方奶中的鐵質可能使大便較硬',
    ],
    solutions: [
      { step: '增加水分', detail: '開始吃副食品後，餐間額外補充適量開水（每日約 30-60ml）。' },
      { step: '高纖食物', detail: '在副食品中加入黑棗泥、梨子泥、地瓜泥等富含纖維的食材。' },
      { step: '腹部按摩', detail: '每日在寶寶腹部做順時針按摩，每次 5-10 分鐘，促進腸胃蠕動。' },
      { step: '被動運動', detail: '讓寶寶仰躺，握住雙腳做踩腳踏車的動作，幫助腸道排氣。' },
    ],
    warningSignals: [
      '大便帶血或黏液',
      '超過 5 天未排便且腹脹明顯',
      '寶寶因排便疼痛而持續哭鬧不安',
      '伴隨嘔吐或食慾明顯下降',
    ],
    relatedArticleIds: ['colic', 'nursing-strike'],
    icon: 'Gauge',
  },

  // ── 發燒與感冒 ──
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
      { step: '吸鼻器清理', detail: '使用嬰兒吸鼻器輕柔吸出鼻涕，每次使用前後要清潔消毒。' },
      { step: '提高濕度', detail: '在房間使用加濕器，維持濕度 50-60%，減少鼻腔乾燥。' },
      { step: '墊高頭部', detail: '睡覺時可在床墊下方墊高（非枕頭），讓頭部稍微抬高幫助呼吸。' },
    ],
    warningSignals: [
      '呼吸急促或出現喘鳴聲',
      '嘴唇或指甲發紫（缺氧徵兆）',
      '鼻涕持續黃綠色超過 10 天',
      '伴隨高燒超過 38.5°C',
    ],
    relatedArticleIds: ['fever-assessment', 'enterovirus'],
    icon: 'Wind',
  },
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
      { step: '正確量體溫', detail: '使用耳溫槍或肛溫計。耳溫 ≥ 38°C、肛溫 ≥ 38°C 即為發燒。腋溫需加 0.5°C。' },
      { step: '物理降溫', detail: '減少衣物、開冷氣維持室溫 24-26°C、用溫水擦拭身體散熱。' },
      { step: '適時用退燒藥', detail: '體溫超過 38.5°C 且寶寶不舒服時，依體重給予醫師開立的退燒藥。' },
      { step: '補充水分', detail: '發燒時水分流失增加，頻繁少量哺乳或補充電解質液。' },
      { step: '持續觀察記錄', detail: '每 4 小時量一次體溫並記錄，觀察精神活力與進食狀況。' },
    ],
    warningSignals: [
      '3 個月以下嬰兒發燒超過 38°C（需立即就醫）',
      '高燒超過 41°C 或持續超過 48 小時',
      '出現熱性痙攣（抽搐、眼睛上翻）',
      '精神萎靡、持續嗜睡、無法喚醒',
    ],
    relatedArticleIds: ['roseola', 'enterovirus', 'nasal-congestion'],
    icon: 'Thermometer',
  },
  {
    id: 'enterovirus',
    title: '腸病毒注意事項',
    summary: '台灣每年 4-9 月為腸病毒流行期，5 歲以下幼兒為重症高危險群，需特別留意。',
    category: 'fever',
    causes: [
      '腸病毒經由糞口、飛沫或接觸傳染',
      '潛伏期 3-5 天，發病前後均具傳染力',
      '台灣高溫潮濕氣候有利病毒存活與傳播',
    ],
    solutions: [
      { step: '勤洗手', detail: '外出返家、飯前飯後、換尿布後，以肥皂搓洗至少 20 秒。' },
      { step: '環境消毒', detail: '使用稀釋漂白水（500ppm）擦拭門把、玩具等常接觸物品。' },
      { step: '注意飲食衛生', detail: '食物充分加熱、飲水煮沸。避免與他人共用餐具。' },
      { step: '避免群聚', detail: '流行期間減少出入人多擁擠的場所，避免接觸生病的兒童。' },
      { step: '居家觀察', detail: '感染後在家休息，觀察是否出現重症前兆。' },
    ],
    warningSignals: [
      '持續嘔吐、嗜睡、意識不清',
      '肌躍型抽搐（類似受到驚嚇的突發性全身肌肉收縮動作）',
      '持續發燒、活動力下降、手腳無力',
      '呼吸急促、心跳加速、臉色蒼白',
    ],
    relatedArticleIds: ['fever-assessment', 'roseola'],
    icon: 'Bug',
  },

  // ── 動作發展 ──
  {
    id: 'rolling-safety',
    title: '翻身安全',
    summary: '寶寶約 3-5 個月學會翻身，需注意居家安全防護，避免墜落意外。',
    category: 'motor',
    causes: [
      '寶寶肌肉力量發展到可以翻身的階段',
      '翻身是大動作發展的重要里程碑',
      '好奇心驅使寶寶嘗試改變身體姿勢',
    ],
    solutions: [
      { step: '床鋪防護', detail: '在床邊加裝安全護欄，或讓寶寶睡在地墊上的嬰兒床中。' },
      { step: '不離開視線', detail: '在換尿布台、沙發等高處時，一隻手要隨時扶著寶寶。' },
      { step: '移除危險物品', detail: '確保翻身範圍內沒有軟墊、枕頭、塑膠袋等窒息危險物。' },
      { step: '練習安全空間', detail: '在地墊上提供安全的翻身練習空間，鼓勵發展但確保安全。' },
    ],
    warningSignals: [
      '7 個月以上仍完全無法翻身（建議評估發展）',
      '翻身後頭部受到撞擊，出現嘔吐或嗜睡',
      '只能往單側翻身，可能有肌肉張力問題',
    ],
    relatedArticleIds: ['crawling-safety', 'sids-prevention'],
    icon: 'RotateCcw',
  },
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
      { step: '門檔安全門', detail: '在樓梯口、廚房門口安裝安全門，限制寶寶活動範圍。' },
      { step: '地面清潔', detail: '保持地面清潔無小物件，避免寶寶撿拾異物放入口中。' },
      { step: '鎖定櫥櫃', detail: '低矮櫥櫃安裝兒童安全鎖，特別是放有清潔劑、藥品的櫃子。' },
    ],
    warningSignals: [
      '10 個月以上完全無爬行跡象（建議發展評估）',
      '爬行姿勢異常（如只用單側手腳）',
      '寶寶誤食異物出現嗆咳或嘔吐',
    ],
    relatedArticleIds: ['rolling-safety', 'walking-safety'],
    icon: 'Snail',
  },
  {
    id: 'walking-safety',
    title: '學步注意事項',
    summary: '寶寶約 10-18 個月開始學走路，跌倒頻繁是正常現象，但需做好安全防護。',
    category: 'motor',
    causes: [
      '下肢肌力與平衡感發展至可嘗試站立行走',
      '每個寶寶發展速度不同，10-18 個月學會走路都算正常',
      '學步初期重心不穩，跌倒是學習過程的一部分',
    ],
    solutions: [
      { step: '赤腳學步', detail: '在安全的室內環境讓寶寶赤腳學步，有助腳底感覺發展與抓地力。' },
      { step: '避免學步車', detail: '台灣兒科醫學會建議不使用學步車（螃蟹車），可能造成意外且影響正常發展。' },
      { step: '適當輔助', detail: '可扶著家具邊緣練習站立與側行，或牽著寶寶雙手引導前行。' },
      { step: '選擇合適鞋子', detail: '外出時穿著軟底、防滑的學步鞋，室內盡量赤腳或穿防滑襪。' },
    ],
    warningSignals: [
      '18 個月仍完全無法獨立站立（建議發展評估）',
      '走路時持續踮腳尖',
      '跌倒後出現嘔吐、嗜睡等頭部受傷徵兆',
    ],
    relatedArticleIds: ['crawling-safety', 'rolling-safety'],
    icon: 'Footprints',
  },

  // ── 睡眠問題 ──
  {
    id: 'sids-prevention',
    title: '嬰兒猝死症預防',
    summary: '嬰兒猝死症（SIDS）是 1 歲以下嬰兒的主要死因之一，可透過安全睡眠環境大幅降低風險。',
    category: 'sleep',
    causes: [
      '嬰兒腦幹呼吸中樞發育未成熟',
      '趴睡或不當睡眠環境增加窒息風險',
      '早產、低出生體重嬰兒風險較高',
    ],
    solutions: [
      { step: '仰睡為主', detail: '每次睡覺（包含午睡）都讓寶寶仰睡。會翻身後仍以仰睡放下。' },
      { step: '堅固平坦床面', detail: '使用符合安全標準的嬰兒床，床墊需堅固且貼合床框。' },
      { step: '淨空睡眠區', detail: '床上不放枕頭、棉被、填充玩偶、防撞墊等軟物。' },
      { step: '同室不同床', detail: '與父母同房但各自睡在獨立的嬰兒床中，至少至 6 個月大。' },
      { step: '適當溫度', detail: '室溫維持 22-26°C，穿著防踢被或睡袋取代蓋被子。' },
    ],
    warningSignals: [
      '寶寶趴睡後無法自行翻回仰躺',
      '發現寶寶呼吸暫停或臉色發紫',
      '使用非嬰兒專用的睡眠空間（如成人床、沙發）',
    ],
    relatedArticleIds: ['rolling-safety'],
    icon: 'ShieldCheck',
  },

  // ── 日常照顧 ──
  // (也可歸到此類別以豐富 daily 分類)
];
