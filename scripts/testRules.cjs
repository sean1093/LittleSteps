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
 * 需要 Java。模擬器的 REST 介面用 auth_variable_override 假冒不同使用者，
 * 不帶這個參數的請求一律是 admin，正好用來鋪測試資料。
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

const url = (path, uid) => {
  const query = `ns=${NS}&auth=${tokenFor(uid)}`;
  return `http://${host}/${path}.json?${query}`;
};

async function req(method, path, uid, body) {
  const res = await fetch(url(path, uid), {
    method,
    headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
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

async function main() {
  // emulators:exec 每次都起一台乾淨的模擬器，所以不需要（也沒有辦法）先清空：
  // 模擬器上不帶憑證的請求同樣受規則管，沒有 admin 後門。

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
    mallory.put('childRecords/c1/dailyLogs/log1', { type: 'feeding', timestamp: 1 }),
  );
  await expectDenied('非成員讀不到 childRecords', as('stranger').get('childRecords/c1'));
  await expectDenied(
    '非成員寫不進 childRecords',
    as('stranger').put('childRecords/c1/dailyLogs/log2', { type: 'sleep' }),
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
  await expectAllowed(
    '寫自己的回饋',
    alice.put('feedbacks/f1', {
      id: 'f1',
      title: '很好用',
      content: '謝謝',
      userId: 'alice',
      userEmail: 'a@example.com',
      userName: '小豆媽',
      timestamp: '2026-09-01T00:00:00.000Z',
      createdAt: '2026-09-01T00:00:00.000Z',
    }),
  );
  await expectDenied(
    '不能冒用別人的 userId',
    alice.put('feedbacks/f2', { title: 'x', content: 'y', userId: 'mallory' }),
  );
  await expectDenied(
    '塞不認識的欄位進來會被擋（回饋節點是任何登入者都寫得進去的）',
    alice.put('feedbacks/f3', { title: 'x', content: 'y', userId: 'alice', payload: 'x'.repeat(50) }),
  );
  await expectDenied('回饋沒有人讀得到', alice.get('feedbacks/f1'));

  console.log('\n刪除：一次原子寫入');
  // 順序是關鍵：childRecords 的授權讀的是 children 底下的 members，所以先刪
  // 孩子再刪紀錄一定失敗。同一筆 multi-path 更新裡，所有路徑都對照寫入前的
  // 狀態判斷，於是四個節點一起消失。
  await expectAllowed(
    '建立者用一筆 multi-path 更新刪掉孩子、紀錄與索引',
    alice.patch('', {
      'children/c1': null,
      'childRecords/c1': null,
      'childIndex/c1': null,
      'users/alice/childrenIds/c1': null,
    }),
  );
  await expectDenied(
    '先刪孩子再刪紀錄會失敗，所以客戶端必須用上面那一筆',
    (async () => {
      await alice.put('children/c3', childProfile({ id: 'c3' }));
      await alice.put('childRecords/c3/dailyLogs/log1', { type: 'feeding' });
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
