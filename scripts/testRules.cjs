#!/usr/bin/env node
/**
 * database.rules.json 的行為測試，跑在 Firebase 的 Realtime Database 模擬器上。
 *
 * 為什麼要有這一支：規則是這個 app 唯一真正的授權邊界。孩子的健康紀錄能不能
 * 被別人讀到、分享出去的代碼能不能收回，都只由 database.rules.json 決定，而
 * 那份檔案沒有型別、沒有編譯器、部署錯了也不會有人叫你。用真的模擬器跑真的
 * 規則，是唯一能證明它照著設計走的方法——重寫一份 JS 版的規則來測，測到的
 * 只會是那份重寫。
 *
 * 執行：npm run test:rules（由 firebase emulators:exec 起停模擬器）
 * 需要 Java。模擬器的 REST 介面用未簽名的 JWT 假冒不同使用者（見下面的
 * tokenFor）；鋪測試資料則用 `Authorization: Bearer owner`，那是模擬器認得的
 * 專案擁有者身分（見 admin）。
 */

const host = process.env.FIREBASE_DATABASE_EMULATOR_HOST || '127.0.0.1:9000';

/**
 * namespace 必須是模擬器真的載入了規則的那一個。名字對不上時，模擬器會臨時
 * 開一個全新的 namespace，而那一個沒有規則、一律放行——於是整份測試會全部
 * 「通過」，包括「別人讀不到你的帳號」。這比沒有測試更糟。
 */
const project = process.env.GCLOUD_PROJECT || 'demo-littlesteps';
const NS = `${project}-default-rtdb`;

/**
 * 假冒使用者用「未簽名的 JWT」，不是 auth_variable_override。
 *
 * 那個 query 參數在 Database 模擬器上不生效（實測回 401），而不帶任何憑證的
 * 請求也不是 admin——同樣被規則擋下。模擬器接受 alg=none 的 token 並直接讀
 * 裡面的 sub，所以這是唯一能在 REST 上切換身分的辦法。
 */
const base64url = (value) => Buffer.from(value).toString('base64url');

const tokenFor = (uid) => {
  const header = base64url(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const payload = base64url(
    JSON.stringify({
      sub: uid,
      user_id: uid,
      iss: `https://securetoken.google.com/${project}`,
      aud: project,
      auth_time: 1756000000,
      iat: 1756000000,
      exp: 1900000000,
      firebase: { identities: {}, sign_in_provider: 'custom' },
    }),
  );
  return `${header}.${payload}.`;
};

/**
 * 鋪測試資料用的擁有者身分。模擬器把 `Authorization: Bearer owner` 當成專案
 * 擁有者、不套規則——firebase-tools 自己的 database:set 就是這樣打進模擬器
 * 的（實測：query 參數 auth=owner 與不帶憑證都回 401，只有這個 header 放行）。
 * 只用來擺出規則本身寫不出來的狀態，例如一分鐘前的回饋戳記；驗行為一律用
 * 假冒的使用者。
 */
const OWNER = Symbol('owner');

const url = (path, uid) => {
  const query = uid === OWNER ? `ns=${NS}` : `ns=${NS}&auth=${tokenFor(uid)}`;
  return `http://${host}/${path}.json?${query}`;
};

async function req(method, path, uid, body) {
  const headers = uid === OWNER ? { Authorization: 'Bearer owner' } : {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const res = await fetch(url(path, uid), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: res.status, text: await res.text() };
}

const as = (uid) => ({
  get: (path) => req('GET', path, uid),
  put: (path, body) => req('PUT', path, uid, body),
  patch: (path, body) => req('PATCH', path, uid, body),
  del: (path) => req('DELETE', path, uid),
});

let passed = 0;
const failures = [];

async function expectAllowed(label, promise) {
  const { status, text } = await promise;
  if (status >= 200 && status < 300) {
    passed += 1;
    console.log(`  \u2713 ${label}`);
  } else {
    failures.push(`${label} — 應該允許，卻回 ${status} ${text.slice(0, 160)}`);
    console.log(`  \u2717 ${label} (${status})`);
  }
}

async function expectDenied(label, promise) {
  const { status, text } = await promise;
  if (status === 401 || status === 403) {
    passed += 1;
    console.log(`  \u2713 ${label}`);
  } else {
    failures.push(`${label} — 應該拒絕，卻回 ${status} ${text.slice(0, 160)}`);
    console.log(`  \u2717 ${label} (${status})`);
  }
}

const alice = as('alice');
const mallory = as('mallory');
const admin = as(OWNER);

const childProfile = (overrides = {}) => ({
  id: 'c1',
  name: '小豆',
  birthday: '2026-02-01',
  createdAt: '2026-02-01T00:00:00.000Z',
  createdBy: 'alice',
  members: { alice: true },
  joinOpen: false,
  milestoneProgress: {},
  vaccineProgress: {},
  ...overrides,
});

const ISO = '2026-09-01T08:00:00.000Z';

/** 一筆合法的餵奶紀錄，欄位形狀照 src/types 的 DailyLog。 */
const dailyLog = (overrides = {}) => ({
  id: 'log1',
  childId: 'c1',
  type: 'feeding',
  timestamp: ISO,
  data: { feedingType: 'formula', amount: 120, duration: 15 },
  createdAt: ISO,
  createdBy: 'alice',
  createdByName: '小豆媽',
  ...overrides,
});

const diaryEntry = (overrides = {}) => ({
  id: 'd1',
  childId: 'c1',
  date: '2026-09-01',
  content: '第一次翻身',
  mood: 'proud',
  createdAt: ISO,
  ...overrides,
});

const growthRecord = (overrides = {}) => ({
  id: 'g1',
  childId: 'c1',
  date: '2026-09-01',
  weight: 4.2,
  height: 52,
  headCircumference: 36.5,
  percentile: { weight: 45.3, height: 50.1, headCircumference: 48.9 },
  ...overrides,
});

const DATE = '2026-09-01';

/** 一筆合法的副食品紀錄，欄位形狀照 src/types 的 FoodTrialRecord。 */
const foodTrial = (overrides = {}) => ({
  id: 'f1',
  foodName: '蘋果泥',
  category: '水果',
  firstTriedDate: DATE,
  trialDates: [DATE, '2026-09-02'],
  hasAllergy: true,
  allergyReactions: [{ type: 'rash', severity: 'mild', description: '嘴邊有點紅', date: DATE }],
  preference: 'like',
  notes: '第一次吃',
  createdAt: ISO,
  ...overrides,
});

async function main() {
  // emulators:exec 每次都起一台乾淨的模擬器，所以不需要先清空。

  console.log('\n建立與讀取');
  await expectAllowed(
    '建立者把自己寫進 members，才建得起來',
    alice.put('children/c1', childProfile()),
  );
  await expectDenied(
    '沒把自己寫進 members 的建立被擋下（否則任何人都能在任意 id 塞資料）',
    alice.put('children/c2', childProfile({ id: 'c2', members: { bob: true } })),
  );
  await expectAllowed('成員讀得到孩子的資料', alice.get('children/c1'));
  await expectDenied('非成員讀不到孩子的資料', mallory.get('children/c1'));

  console.log('\n用代碼加入：joinOpen 是開關');
  await expectDenied(
    '分享沒開時，拿著代碼也加不進來',
    mallory.put('children/c1/members/mallory', true),
  );
  await expectAllowed('成員可以打開分享', alice.put('children/c1/joinOpen', true));
  await expectAllowed(
    '分享開著時，拿著代碼的人把自己加進來',
    mallory.put('children/c1/members/mallory', true),
  );
  await expectAllowed('加入之後讀得到', mallory.get('children/c1'));

  console.log('\n紀錄與索引');
  await expectAllowed(
    '成員寫得進 childRecords',
    mallory.put('childRecords/c1/dailyLogs/log1', dailyLog()),
  );
  await expectDenied('非成員讀不到 childRecords', as('stranger').get('childRecords/c1'));
  await expectDenied(
    '非成員寫不進 childRecords',
    as('stranger').put('childRecords/c1/dailyLogs/log2', dailyLog()),
  );
  await expectAllowed('任何登入者查得到代碼存不存在', mallory.get('childIndex/c1'));
  await expectAllowed('成員補得上索引', alice.put('childIndex/c1', true));
  await expectDenied('非成員寫不了索引', as('stranger').put('childIndex/c1', true));

  console.log('\n收回存取權');
  await expectAllowed(
    '成員可以移除另一個成員',
    alice.put('children/c1/members/mallory', null),
  );
  await expectDenied('被移除之後就讀不到了', mallory.get('children/c1'));
  await expectAllowed('關掉分享', alice.put('children/c1/joinOpen', false));
  await expectDenied(
    '關掉之後，手上還有代碼的人也回不來',
    mallory.put('children/c1/members/mallory', true),
  );
  await expectDenied(
    '非成員動不了別人的成員資格',
    mallory.put('children/c1/members/alice', null),
  );
  await expectDenied(
    '建立者的成員資格刪不掉——刪得掉就會留下一份沒有人碰得到的健康紀錄',
    alice.put('children/c1/members/alice', null),
  );

  console.log('\n欄位驗證');
  await expectAllowed(
    '部分更新不必重送整份資料',
    alice.patch('children/c1', { name: '小豆豆' }),
  );
  await expectAllowed(
    '寫進度不會被上層的 validate 擋住',
    alice.put('children/c1/milestoneProgress/m1', { achieved: true }),
  );
  await expectDenied(
    '整份覆寫時少了 createdBy 就不給寫',
    alice.put('children/c1', { name: '小豆', members: { alice: true } }),
  );
  await expectDenied(
    '成員資格只能是 true',
    alice.put('children/c1/members/bob', 'yes'),
  );

  console.log('\n意見回饋');
  // feedbacks 是唯一「任何登入者都寫得進去」的節點，而登入對每一個 Google 帳號
  // 開放：一筆最多 5.6 KB，用迴圈寫就能把 Spark 方案的儲存額度吃光，而且
  // 沒有人讀得到，所以不會有人發現。規則的解法是每個帳號一分鐘一則：回饋
  // 與 users/$uid/lastFeedbackAt 必須同一筆 multi-path 更新，戳記必須是
  // 伺服器的 now，而且要比上一次晚 60 秒以上。
  /** submitFeedback 寫出來的形狀。 */
  const feedback = (id, overrides = {}) => ({
    id,
    title: '很好用',
    content: '謝謝',
    userId: 'alice',
    userEmail: 'a@example.com',
    userName: '小豆媽',
    timestamp: ISO,
    createdAt: ISO,
    ...overrides,
  });
  /**
   * submitFeedback 的寫法：回饋與自己的 lastFeedbackAt 同一筆 root 更新。
   * SDK 的 serverTimestamp() 在 REST 上寫成 { '.sv': 'timestamp' }，規則裡
   * 讀到的就是 now。
   */
  const SERVER_NOW = { '.sv': 'timestamp' };
  const sendFeedback = (who, uid, id, stamp = SERVER_NOW) =>
    who.patch('', {
      [`feedbacks/${id}`]: feedback(id, { userId: uid }),
      [`users/${uid}/lastFeedbackAt`]: stamp,
    });
  /** 把 alice 上一次回饋的時間擺到一分鐘以前——模擬器的 now 是真的時間，不用等。 */
  const seedLastFeedback = (msAgo) =>
    admin.put('users/alice/lastFeedbackAt', Date.now() - msAgo);

  await expectAllowed(
    '寫自己的回饋：回饋與 lastFeedbackAt 同一筆寫入',
    sendFeedback(alice, 'alice', 'f1'),
  );
  // 第一次登入就送回饋的帳號，users/$uid 還不存在。上面那一則也是這個狀況，
  // 但只因為套件裡沒有任何更早的步驟寫過 users/alice——順序一調就悄悄漏掉。
  // 這裡用一個從沒寫過任何東西的身分把它釘住。
  await expectAllowed(
    '從沒寫過任何東西的新帳號，第一則回饋直接寫得進去',
    sendFeedback(as('newcomer'), 'newcomer', 'f-newcomer'),
  );
  await expectDenied(
    '一分鐘內的第二則被擋下',
    sendFeedback(alice, 'alice', 'f2'),
  );
  await seedLastFeedback(61000);
  await expectAllowed(
    '距上一則超過一分鐘就又寫得進去',
    sendFeedback(alice, 'alice', 'f3'),
  );
  await expectDenied(
    '同一筆更新裡沒帶 lastFeedbackAt 的回饋寫不進去（迴圈灌回饋的寫法）',
    alice.patch('', { 'feedbacks/f4': feedback('f4') }),
  );
  // validate 不會對刪除跑，所以戳記的 60 秒規則擋不住「先把戳記刪掉」。能不能
  // 刪只看 .write：users/$uid 若整個節點都是本人可寫，迴圈就從一個請求變成
  // 兩個——刪戳記、再送一則。
  await expectDenied(
    '自己也刪不掉自己的 lastFeedbackAt',
    alice.del('users/alice/lastFeedbackAt'),
  );
  await expectDenied(
    '刪掉戳記再送一則，一分鐘內照樣被擋（審查時抓到的繞法，整段照做一次）',
    (async () => {
      // 中間每一步的狀態碼都要看：req 不會丟例外，只看最後一則的話，前面哪一步
      // 沒照劇本走（例如第一則就被擋）都會靜靜地變成「通過」。
      const zed = as('zed');
      const first = await sendFeedback(zed, 'zed', 'f-zed-1');
      if (first.status !== 200) return first;
      const second = await sendFeedback(zed, 'zed', 'f-zed-2');
      if (second.status !== 401) return { status: 200, text: `第二則應被擋，卻回 ${second.status}` };
      const removed = await zed.del('users/zed/lastFeedbackAt');
      if (removed.status === 200) return removed;
      return sendFeedback(zed, 'zed', 'f-zed-3');
    })(),
  );
  await seedLastFeedback(61000);
  await expectDenied(
    '戳記是客戶端自己填的數字、不是伺服器的 now，就不給寫（否則填個未來的時間就能一直寫）',
    sendFeedback(alice, 'alice', 'f5', Date.now() + 600000),
  );
  await seedLastFeedback(61000);
  await expectDenied(
    '不能冒用別人的 userId',
    alice.patch('', {
      'feedbacks/f6': feedback('f6', { userId: 'mallory' }),
      'users/alice/lastFeedbackAt': SERVER_NOW,
    }),
  );
  await expectDenied(
    '塞不認識的欄位進來會被擋',
    alice.patch('', {
      'feedbacks/f7': feedback('f7', { payload: 'x'.repeat(50) }),
      'users/alice/lastFeedbackAt': SERVER_NOW,
    }),
  );
  await expectDenied('回饋沒有人讀得到', alice.get('feedbacks/f1'));

  console.log('\n紀錄的形狀與大小');
  // childRecords 是唯一沒有上限的子樹，而每一位成員都寫得進去。這裡驗的是
  // 「寫進來的東西長得像 src/types 裡的那一份」：型別、枚舉值、字串長度、
  // 數值範圍，以及沒有不認識的欄位。
  await expectAllowed(
    '完整的餵奶紀錄寫得進去',
    alice.put('childRecords/c1/dailyLogs/log-feed', dailyLog({ id: 'log-feed' })),
  );
  await expectAllowed(
    '睡眠紀錄連夜醒次數與備註一起寫得進去',
    alice.put(
      'childRecords/c1/dailyLogs/log-sleep',
      dailyLog({
        id: 'log-sleep',
        type: 'sleep',
        data: {
          startTime: ISO,
          endTime: '2026-09-01T10:00:00.000Z',
          duration: 120,
          nightWakings: 1,
          notes: '睡前哭了一下',
        },
      }),
    ),
  );
  await expectAllowed(
    '尿布紀錄寫得進去',
    alice.put(
      'childRecords/c1/dailyLogs/log-diaper',
      dailyLog({ id: 'log-diaper', type: 'diaper', data: { type: 'poop', consistency: 'soft' } }),
    ),
  );
  await expectDenied(
    'type 不是 feeding／sleep／diaper 就不給寫',
    alice.put('childRecords/c1/dailyLogs/log-bad', dailyLog({ id: 'log-bad', type: 'bath' })),
  );
  await expectDenied(
    'childId 指向別的孩子就不給寫',
    alice.put('childRecords/c1/dailyLogs/log-bad', dailyLog({ id: 'log-bad', childId: 'c2' })),
  );
  await expectDenied(
    'timestamp 不是字串就不給寫',
    alice.put('childRecords/c1/dailyLogs/log-bad', dailyLog({ id: 'log-bad', timestamp: 1 })),
  );
  await expectDenied(
    '紀錄少了 data 就不給寫',
    alice.put('childRecords/c1/dailyLogs/log-bad', dailyLog({ id: 'log-bad', data: undefined })),
  );
  await expectDenied(
    '紀錄本身不是物件就不給寫',
    alice.put('childRecords/c1/dailyLogs/log-bad', 'x'.repeat(50)),
  );
  await expectDenied(
    '紀錄上塞不認識的欄位會被擋',
    alice.put('childRecords/c1/dailyLogs/log-bad', dailyLog({ id: 'log-bad', payload: 'x'.repeat(50) })),
  );
  await expectDenied(
    'data 裡塞不認識的欄位會被擋',
    alice.put(
      'childRecords/c1/dailyLogs/log-bad',
      dailyLog({ id: 'log-bad', data: { feedingType: 'formula', payload: 'x'.repeat(50) } }),
    ),
  );
  await expectDenied(
    'feedingType 不在清單裡就不給寫',
    alice.put('childRecords/c1/dailyLogs/log-bad', dailyLog({ id: 'log-bad', data: { feedingType: 'juice' } })),
  );
  await expectDenied(
    'amount 不是數字就不給寫',
    alice.put(
      'childRecords/c1/dailyLogs/log-bad',
      dailyLog({ id: 'log-bad', data: { feedingType: 'formula', amount: '120' } }),
    ),
  );
  await expectDenied(
    '備註超過 2000 字就不給寫',
    alice.put(
      'childRecords/c1/dailyLogs/log-bad',
      dailyLog({ id: 'log-bad', data: { feedingType: 'formula', notes: 'x'.repeat(2001) } }),
    ),
  );
  await expectAllowed(
    '只改一個欄位的部分更新照樣可以（編輯時間）',
    alice.patch('childRecords/c1/dailyLogs/log-feed', {
      timestamp: '2026-09-01T09:00:00.000Z',
      updatedAt: ISO,
    }),
  );
  await expectAllowed(
    '只換掉 data 的部分更新照樣可以（按「醒了」結束睡眠）',
    alice.patch('childRecords/c1/dailyLogs/log-sleep', {
      data: { startTime: ISO, endTime: '2026-09-01T11:00:00.000Z', duration: 180 },
      updatedAt: ISO,
    }),
  );
  await expectDenied(
    '部分更新塞進不合法的值一樣被擋',
    alice.patch('childRecords/c1/dailyLogs/log-feed', { type: 'bath', updatedAt: ISO }),
  );
  // 舊紀錄未必長得像今天的型別：早期的 key 是 `${prefix}_${Date.now()}`，而
  // 沒有搬遷過的紀錄可能缺 childId、記錄者，連 createdAt 也未必有（LogEntryModal
  // 補 createdAt 的 fallback 就是為了它們）。規則只在寫入時跑，而且部分更新時
  // 上層的 .validate 照樣會跑——拿「既有資料 + 這次的 patch」合併後的結果檢
  // 查，跳過的只是沒被寫到的兄弟欄位。所以 hasChildren 裡要求的每一個欄位，
  // 一條舊紀錄只要缺了，那一筆就永遠改不動：2025 年的一則日記打錯字，家長就
  // 再也修不了。這裡用擁有者身分鋪一筆最瘦的舊紀錄，再用 app 實際送的形狀改它。
  await admin.put('childRecords/c1/dailyLogs/log_1700000000000', {
    id: 'log_1699999999999',
    type: 'sleep',
    timestamp: ISO,
    data: { startTime: ISO },
  });
  await expectAllowed(
    '舊形狀的日誌（key 不等於 id、沒有 childId、沒有 createdAt）照樣改得動（handleWake 的寫法）',
    alice.patch('childRecords/c1/dailyLogs/log_1700000000000', {
      data: { startTime: ISO, endTime: '2026-09-01T10:00:00.000Z', duration: 120 },
      updatedAt: ISO,
    }),
  );
  await admin.put('childRecords/c1/dailyLogs/log-no-type', { timestamp: ISO, data: { type: 'pee' } });
  await expectDenied(
    '部分更新也會用合併後的資料檢查 hasChildren：少了 type 的紀錄改不動',
    alice.patch('childRecords/c1/dailyLogs/log-no-type', { data: { type: 'poop' }, updatedAt: ISO }),
  );

  await expectAllowed(
    '完整的日記寫得進去',
    alice.put('childRecords/c1/diaryEntries/d1', diaryEntry({ linkedCheckItemId: 'check-1' })),
  );
  await expectDenied(
    '日記內容超過 5000 字就不給寫',
    alice.put('childRecords/c1/diaryEntries/d-bad', diaryEntry({ id: 'd-bad', content: 'x'.repeat(5001) })),
  );
  await expectDenied(
    '日期不是 YYYY-MM-DD 就不給寫',
    alice.put('childRecords/c1/diaryEntries/d-bad', diaryEntry({ id: 'd-bad', date: '2026/09/01' })),
  );
  await expectDenied(
    'mood 不在清單裡就不給寫',
    alice.put('childRecords/c1/diaryEntries/d-bad', diaryEntry({ id: 'd-bad', mood: 'angry' })),
  );
  await expectDenied(
    '日記上塞不認識的欄位會被擋',
    alice.put('childRecords/c1/diaryEntries/d-bad', diaryEntry({ id: 'd-bad', payload: 'x'.repeat(50) })),
  );
  await expectAllowed(
    '只改內容的部分更新照樣可以',
    alice.patch('childRecords/c1/diaryEntries/d1', { content: '第一次翻身！', updatedAt: ISO }),
  );
  await admin.put('childRecords/c1/diaryEntries/diary_1700000000000', {
    date: '2025-03-01',
    content: '第一次叫媽媽',
  });
  await expectAllowed(
    '舊形狀的日記（沒有 id、childId、createdAt）照樣改得動（updateDiaryEntry 的寫法）',
    alice.patch('childRecords/c1/diaryEntries/diary_1700000000000', {
      date: '2025-03-01',
      content: '第一次叫媽媽！',
      mood: 'happy',
      updatedAt: ISO,
    }),
  );

  await expectAllowed(
    '完整的成長紀錄寫得進去',
    alice.put('childRecords/c1/growthRecords/g1', growthRecord({ notes: '健兒門診量的' })),
  );
  await expectDenied(
    '體重 900 公斤就不給寫',
    alice.put('childRecords/c1/growthRecords/g-bad', growthRecord({ id: 'g-bad', weight: 900 })),
  );
  await expectDenied(
    '體重是字串就不給寫',
    alice.put('childRecords/c1/growthRecords/g-bad', growthRecord({ id: 'g-bad', weight: 'abc' })),
  );
  await expectDenied(
    '百分位超過 100 就不給寫',
    alice.put(
      'childRecords/c1/growthRecords/g-bad',
      growthRecord({ id: 'g-bad', percentile: { weight: 150 } }),
    ),
  );
  await expectDenied(
    'percentile 裡塞不認識的欄位會被擋',
    alice.put(
      'childRecords/c1/growthRecords/g-bad',
      growthRecord({ id: 'g-bad', percentile: { bmi: 50 } }),
    ),
  );
  await expectDenied(
    '成長紀錄上塞不認識的欄位會被擋',
    alice.put('childRecords/c1/growthRecords/g-bad', growthRecord({ id: 'g-bad', payload: 'x'.repeat(50) })),
  );
  // 編輯只寫改到的欄位：兩位照顧者一個補身高、一個補頭圍，各自的 leaf 才合得
  // 起來。上層的 hasChildren(['date']) 拿合併後的結果檢查，所以不帶 date 也過。
  await expectAllowed(
    '只改一個欄位的部分更新可以（updateRecord 的寫法）',
    alice.patch('childRecords/c1/growthRecords/g1', { height: 53, notes: null }),
  );
  // 寫入端已經不存百分位，但舊紀錄裡存著的那一份得留得住、改得動。
  await expectAllowed(
    '整筆重送、連舊的百分位一起，照樣可以',
    alice.put('childRecords/c1/growthRecords/g1', growthRecord({ weight: 4.4, percentile: {} })),
  );

  await expectDenied(
    'childRecords 底下只有三個集合，別的名字不給寫',
    alice.put('childRecords/c1/notes/n1', { text: 'x'.repeat(50) }),
  );

  console.log('\n帳號節點');
  // users/$uid 只有本人寫得動，但本人也只該寫得進 app 會寫的兩個欄位：
  // childrenIds/$childId 一律是 true，currentChildId 是一個孩子的 id。
  await expectAllowed(
    '把孩子加進自己的名單（joinChild 的寫法）',
    alice.put('users/alice/childrenIds/c1', true),
  );
  await expectAllowed(
    '從名單裡拿掉一個孩子（useUserChildren 清掉讀不到的 id）',
    alice.del('users/alice/childrenIds/c1'),
  );
  await expectAllowed(
    '切換目前選取的孩子（setCurrentChild 的寫法）',
    alice.patch('users/alice', { currentChildId: 'c1' }),
  );
  await expectAllowed(
    '清掉目前選取的孩子是寫 null，不會被 validate 擋（useUserChildren 的自癒）',
    alice.del('users/alice/currentChildId'),
  );
  await expectDenied('名單裡的值只能是 true', alice.put('users/alice/childrenIds/c9', false));
  await expectDenied(
    'currentChildId 不是字串就不給寫',
    alice.put('users/alice/currentChildId', 123),
  );
  await expectDenied(
    'currentChildId 超過 64 字就不給寫',
    alice.put('users/alice/currentChildId', 'x'.repeat(65)),
  );
  await expectDenied(
    '帳號節點塞不認識的欄位會被擋（沒有任何地方寫 email）',
    alice.put('users/alice/email', 'a@example.com'),
  );

  console.log('\n孩子節點：建立與編輯');
  // 孩子本體是一個 listener 訂閱整份的節點，README 說它有上限是因為進度都對著
  // 固定清單；這裡驗的是每個欄位與每個子樹都長得像 src/types 的 ChildProfile，
  // 而且沒有不認識的鍵。寫法照 useFirebaseChildren 裡每一個寫入點。
  const pregnancy = childProfile({
    id: 'c4',
    name: '小芽',
    birthday: '2027-03-15',
    isPregnancy: true,
    pregnancyData: { childId: 'c4', dueDate: '2027-03-15', lastPeriodDate: '2026-06-08', status: 'active' },
  });
  await expectAllowed(
    'addChild 的整筆 fan-out：孩子本體（含空的進度物件）、名單、選取狀態一起寫',
    alice.patch('', {
      'children/c4': pregnancy,
      'users/alice/childrenIds/c4': true,
      'users/alice/currentChildId': 'c4',
    }),
  );
  await expectAllowed(
    'updateChild 的寫法：改預產期時一併改 pregnancyData 的兩個日期',
    alice.patch('children/c4', {
      name: '小芽',
      birthday: '2027-03-20',
      gestationalAgeWeeks: null,
      gestationalAgeDays: null,
      'pregnancyData/dueDate': '2027-03-20',
      'pregnancyData/lastPeriodDate': '2026-06-13',
    }),
  );
  await expectAllowed(
    'recordBirth 的寫法：出生日、性別、isPregnancy=false、pregnancyData/status 一起改',
    alice.patch('children/c4', {
      birthday: '2027-03-18',
      gender: 'female',
      isPregnancy: false,
      'pregnancyData/status': 'archived',
    }),
  );
  await expectAllowed(
    '早產週數與天數寫得進去',
    alice.patch('children/c1', { gestationalAgeWeeks: 32, gestationalAgeDays: 3 }),
  );
  await expectAllowed(
    '清掉早產週數是寫 null，不會被 validate 擋（updateChild 的寫法）',
    alice.patch('children/c1', {
      name: '小豆',
      birthday: '2026-02-01',
      gestationalAgeWeeks: null,
      gestationalAgeDays: null,
    }),
  );
  await expectDenied('gender 不是 male／female 就不給寫', alice.put('children/c1/gender', 'other'));
  await expectDenied('isPregnancy 不是布林值就不給寫', alice.put('children/c1/isPregnancy', 'yes'));
  await expectDenied(
    '出生週數低於 20 就不給寫（與 correctedAge 的範圍一致）',
    alice.put('children/c1/gestationalAgeWeeks', 19),
  );
  await expectDenied('出生週數高於 42 就不給寫', alice.put('children/c1/gestationalAgeWeeks', 43));
  await expectDenied('出生週數是字串就不給寫', alice.put('children/c1/gestationalAgeWeeks', '32'));
  await expectDenied('出生天數超過 6 就不給寫', alice.put('children/c1/gestationalAgeDays', 7));
  await expectDenied(
    'pregnancyData.status 不是 active／archived 就不給寫',
    alice.put('children/c4/pregnancyData/status', 'done'),
  );
  await expectDenied(
    'pregnancyData 裡塞不認識的欄位會被擋',
    alice.put('children/c4/pregnancyData/hospital', 'x'.repeat(50)),
  );
  await expectDenied('createdAt 超過 40 字就不給寫', alice.put('children/c1/createdAt', 'x'.repeat(41)));
  await expectDenied('id 超過 64 字就不給寫', alice.put('children/c1/id', 'x'.repeat(65)));
  await expectDenied(
    '孩子節點塞不認識的欄位會被擋',
    alice.put('children/c1/payload', 'x'.repeat(50)),
  );
  await expectDenied(
    '紀錄搬到 childRecords 之後，舊路徑 children/$childId/dailyLogs 不再收寫入',
    alice.put('children/c1/dailyLogs/log1', dailyLog()),
  );

  console.log('\n孩子節點：每個子樹的形狀');
  await expectAllowed(
    '里程碑：達成時連日期一起寫（updateMilestoneProgress 的寫法）',
    alice.put('children/c1/milestoneProgress/m2', { achieved: true, achievedDate: DATE }),
  );
  await expectAllowed(
    '里程碑：取消達成時只剩 achieved=false',
    alice.put('children/c1/milestoneProgress/m2', { achieved: false }),
  );
  await expectDenied(
    '里程碑：achieved 不是布林值就不給寫',
    alice.put('children/c1/milestoneProgress/m-bad', { achieved: 'yes' }),
  );
  await expectDenied(
    '里程碑：日期不是 YYYY-MM-DD 的長度就不給寫',
    alice.put('children/c1/milestoneProgress/m-bad', { achieved: true, achievedDate: ISO }),
  );
  await expectDenied(
    '里程碑：少了 achieved 就不給寫',
    alice.put('children/c1/milestoneProgress/m-bad', { achievedDate: DATE }),
  );
  await expectDenied(
    '里程碑：塞不認識的欄位會被擋',
    alice.put('children/c1/milestoneProgress/m-bad', { achieved: true, payload: 'x'.repeat(50) }),
  );

  await expectAllowed(
    '疫苗：一劑一筆（updateVaccineProgress 的寫法）',
    alice.put('children/c1/vaccineProgress/v1/doses/1', { administered: true, administeredDate: DATE }),
  );
  await expectDenied(
    '疫苗：administered 不是布林值就不給寫',
    alice.put('children/c1/vaccineProgress/v1/doses/2', { administered: 1 }),
  );
  await expectDenied(
    '疫苗：劑次裡塞不認識的欄位會被擋',
    alice.put('children/c1/vaccineProgress/v1/doses/2', { administered: true, lot: 'x'.repeat(50) }),
  );
  await expectDenied(
    '疫苗：疫苗底下只有 doses',
    alice.put('children/c1/vaccineProgress/v1/notes', 'x'.repeat(50)),
  );

  await expectAllowed(
    '發展檢核：達成時連日期一起寫（updateDevelopmentProgress 的寫法）',
    alice.put('children/c1/developmentProgress/d1', { achieved: true, achievedDate: DATE }),
  );
  await expectDenied(
    '發展檢核：塞不認識的欄位會被擋',
    alice.put('children/c1/developmentProgress/d-bad', { achieved: true, payload: 'x'.repeat(50) }),
  );

  await expectAllowed(
    '乳牙：萌出時連日期一起寫（updateToothProgress 的寫法）',
    alice.put('children/c1/toothProgress/t1', { erupted: true, eruptedDate: DATE }),
  );
  await expectDenied(
    '乳牙：erupted 不是布林值就不給寫',
    alice.put('children/c1/toothProgress/t-bad', { erupted: 'yes' }),
  );

  await expectAllowed(
    '產檢：完成日期、院所、備註（upsertPrenatalRecord 的寫法）',
    alice.put('children/c4/prenatalProgress/p1', { completedDate: DATE, clinicName: '某婦產科', notes: '一切正常' }),
  );
  await expectDenied(
    '產檢：少了 completedDate 就不給寫',
    alice.put('children/c4/prenatalProgress/p-bad', { clinicName: '某婦產科' }),
  );
  await expectDenied(
    '產檢：備註超過 2000 字就不給寫',
    alice.put('children/c4/prenatalProgress/p-bad', { completedDate: DATE, notes: 'x'.repeat(2001) }),
  );
  await expectDenied(
    '產檢：塞不認識的欄位會被擋',
    alice.put('children/c4/prenatalProgress/p-bad', { completedDate: DATE, payload: 'x'.repeat(50) }),
  );

  await expectAllowed(
    '照護任務：整筆寫入（upsertCareTaskRecord 的寫法）',
    alice.put('children/c1/careTaskProgress/task1', {
      taskId: 'task1',
      completedDate: DATE,
      location: '某小兒科',
      notes: '順利',
    }),
  );
  await expectDenied(
    '照護任務：taskId 超過 64 字就不給寫',
    alice.put('children/c1/careTaskProgress/t-bad', { taskId: 'x'.repeat(65), completedDate: DATE }),
  );
  await expectDenied(
    '照護任務：塞不認識的欄位會被擋',
    alice.put('children/c1/careTaskProgress/t-bad', { taskId: 't-bad', completedDate: DATE, payload: 'x'.repeat(50) }),
  );

  // 陣列會被 SDK 寫成 0、1、… 為鍵的物件，所以 trialDates 與 allergyReactions
  // 各是一層萬用字元。
  await expectAllowed(
    '副食品：完整一筆，含嘗試日期清單與過敏反應清單（addFoodTrial 的寫法）',
    alice.put('children/c1/foodTrackingProgress/f1', foodTrial()),
  );
  await expectAllowed(
    '副食品：多記一次嘗試是部分更新（handleAddTrialDate 的寫法）',
    alice.patch('children/c1/foodTrackingProgress/f1', {
      trialDates: [DATE, '2026-09-02', '2026-09-03'],
      updatedAt: ISO,
    }),
  );
  await expectDenied(
    '副食品：過敏反應裡塞不認識的欄位會被擋',
    alice.put(
      'children/c1/foodTrackingProgress/f-bad',
      foodTrial({ id: 'f-bad', allergyReactions: [{ type: 'rash', severity: 'mild', date: DATE, photo: 'x'.repeat(50) }] }),
    ),
  );
  await expectDenied(
    '副食品：過敏嚴重度不在清單裡就不給寫',
    alice.put(
      'children/c1/foodTrackingProgress/f-bad',
      foodTrial({ id: 'f-bad', allergyReactions: [{ type: 'rash', severity: 'fatal', date: DATE }] }),
    ),
  );
  await expectDenied(
    '副食品：喜好度不在五個值裡就不給寫',
    alice.put('children/c1/foodTrackingProgress/f-bad', foodTrial({ id: 'f-bad', preference: 'meh' })),
  );
  await expectDenied(
    '副食品：hasAllergy 不是布林值就不給寫',
    alice.put('children/c1/foodTrackingProgress/f-bad', foodTrial({ id: 'f-bad', hasAllergy: 'no' })),
  );
  await expectDenied(
    '副食品：嘗試日期不是字串就不給寫',
    alice.put('children/c1/foodTrackingProgress/f-bad', foodTrial({ id: 'f-bad', trialDates: [20260901] })),
  );
  await expectDenied(
    '副食品：食物名稱超過 100 字就不給寫',
    alice.put('children/c1/foodTrackingProgress/f-bad', foodTrial({ id: 'f-bad', foodName: 'x'.repeat(101) })),
  );
  await expectDenied(
    '副食品：塞不認識的欄位會被擋',
    alice.put('children/c1/foodTrackingProgress/f-bad', foodTrial({ id: 'f-bad', payload: 'x'.repeat(50) })),
  );

  console.log('\n刪除：一次原子寫入');
  // 順序是關鍵：childRecords 的授權讀的是 children 底下的 members，所以先刪
  // 孩子再刪紀錄一定失敗。同一筆 multi-path 更新裡，所有路徑都對照寫入前的
  // 狀態判斷，於是四個節點一起消失。deleteChild 還會在同一筆裡把 currentChildId
  // 換成剩下的孩子或 null；root 更新是逐條路徑授權的，所以這裡照它的形狀寫。
  await expectAllowed(
    '建立者用一筆 multi-path 更新刪掉孩子、紀錄、索引與選取狀態（deleteChild 的寫法）',
    alice.patch('', {
      'children/c1': null,
      'childRecords/c1': null,
      'childIndex/c1': null,
      'users/alice/childrenIds/c1': null,
      'users/alice/currentChildId': null,
    }),
  );
  await expectDenied(
    '先刪孩子再刪紀錄會失敗，所以客戶端必須用上面那一筆',
    (async () => {
      await alice.put('children/c3', childProfile({ id: 'c3' }));
      await alice.put('childRecords/c3/dailyLogs/log1', dailyLog({ childId: 'c3' }));
      await alice.del('children/c3');
      return alice.del('childRecords/c3');
    })(),
  );

  console.log('\n別人的帳號');
  await expectDenied('讀不到別人的使用者節點', mallory.get('users/alice'));
  await expectDenied(
    '寫不進別人的使用者節點',
    mallory.put('users/alice/childrenIds/c1', true),
  );
  // 單獨一筆 PUT。混在回饋裡驗的話，就算 users/$uid 對所有人開放，這一筆也
  // 會因為 mallory 自己的戳記不是 now 而被擋——守衛不見了，測試還是綠的。
  await expectDenied(
    '寫不進別人的 lastFeedbackAt',
    mallory.put('users/alice/lastFeedbackAt', SERVER_NOW),
  );
  await expectDenied(
    '用別人的戳記交自己的回饋也不行',
    mallory.patch('', {
      'feedbacks/f8': feedback('f8', { userId: 'mallory' }),
      'users/alice/lastFeedbackAt': SERVER_NOW,
    }),
  );

  console.log(`\n${passed} 項通過，${failures.length} 項失敗`);
  if (failures.length > 0) {
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
