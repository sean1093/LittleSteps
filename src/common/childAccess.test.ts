import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const rules = JSON.parse(readFileSync(join(ROOT, 'database.rules.json'), 'utf8')).rules;
const source = (path: string) => readFileSync(join(ROOT, 'src', path), 'utf8');

/**
 * 孩子資料的可讀範圍。
 *
 * children/$childId 的 .read 原本是 auth != null——任何登入者只要有 UUID 就讀得到
 * 別人孩子的完整健康紀錄，而這個 app 的共享機制正是把 UUID 傳給對方（見
 * ShareChildUuidModal）。隔離靠的是 UUID 猜不到，而 UUID 會流過聊天軟體和截圖。
 *
 * 那條鬆規則原本是有作用的：joinChild 要在成員資格建立之前確認代碼存在，所以
 * 一定得先讀得到某個東西。解法不是把 .read 改成比照 .write，而是把「這個代碼
 * 存不存在」拆成一個只放布林值的公開節點 childIndex。
 *
 * 這組測試能證明什麼、不能證明什麼要說清楚：它讀的是 database.rules.json 的
 * 文字與客戶端的呼叫路徑，證明「我們打算要的規則沒有被改掉」。它沒有跑
 * Firebase 模擬器，所以不能證明 Firebase 真的照這樣執行——那需要 emulator。
 */

const MEMBERSHIP_CHECK =
  "root.child('users').child(auth.uid).child('childrenIds').child($childId).val() === true";

describe('孩子資料只有成員讀得到', () => {
  it('children 的 .read 要求成員身分，不是「有登入就好」', () => {
    expect(rules.children.$childId['.read']).toBe(MEMBERSHIP_CHECK);
  });

  it('children 的 .write 仍然只有成員或建立當下', () => {
    // 建立時還沒有成員資格，所以保留 !data.exists() 那一段。
    expect(rules.children.$childId['.write']).toContain(MEMBERSHIP_CHECK);
    expect(rules.children.$childId['.write']).toContain('!data.exists()');
  });

  it('childIndex 公開可讀，但只有成員能寫', () => {
    expect(rules.childIndex.$childId['.read']).toBe('auth != null');
    expect(rules.childIndex.$childId['.write']).toBe(MEMBERSHIP_CHECK);
  });

  it('users 仍然只有本人讀寫', () => {
    expect(rules.users.$userId['.read']).toBe('$userId === auth.uid');
    expect(rules.users.$userId['.write']).toBe('$userId === auth.uid');
  });
});

describe('加入流程不讀孩子本體', () => {
  const hook = source('common/hooks/useFirebaseChildren.ts');
  const joinChild = hook.slice(hook.indexOf('const joinChild'), hook.indexOf('const updateChild'));

  it('joinChild 讀的是 childIndex', () => {
    expect(joinChild).toContain('childIndex/${childUuid}');
  });

  it('joinChild 完全不碰 children/ 路徑', () => {
    // 碰了就等於又需要對非成員開放 .read，繞回原本的問題。
    expect(joinChild).not.toContain('children/${childUuid}');
  });

  it('代碼不存在時仍然給出可讀的錯誤，不是靜靜成功', () => {
    expect(joinChild).toContain('找不到此寶寶代碼');
  });
});

describe('索引與孩子本體同生共死', () => {
  const hook = source('common/hooks/useFirebaseChildren.ts');

  it('新增孩子時寫入索引，且排在授權之後', () => {
    const addChild = hook.slice(hook.indexOf('const addChild'), hook.indexOf('const joinChild'));
    const grant = addChild.indexOf('childrenIds/${childId}');
    const index = addChild.indexOf('childIndex/${childId}');

    expect(index).toBeGreaterThan(-1);
    // 規則要求寫索引的人已經是成員；順序反了就會被擋下來。
    expect(index).toBeGreaterThan(grant);
  });

  it('建立者刪除孩子時一併刪索引', () => {
    const deleteChild = hook.slice(
      hook.indexOf('const deleteChild'),
      hook.indexOf('const setCurrentChild'),
    );

    expect(deleteChild).toContain('childIndex/${childId}');
  });

  it('刪除時先處理孩子本體，最後才退掉成員資格', () => {
    // .read/.write 都要求成員身分，先退資格會讓建立者的刪除靜靜失敗，
    // 留下一份沒有人能再讀到的健康紀錄。
    const deleteChild = hook.slice(
      hook.indexOf('const deleteChild'),
      hook.indexOf('const setCurrentChild'),
    );
    const readsChild = deleteChild.indexOf('children/${childId}');
    const revokes = deleteChild.indexOf('childrenIds/${childId}');

    expect(readsChild).toBeGreaterThan(-1);
    expect(revokes).toBeGreaterThan(readsChild);
  });

  it('既有的孩子會被補上索引，否則舊代碼加入不了', () => {
    // childIndex 是後來才有的，既有孩子沒有條目。只有成員寫得進去，
    // 而 useUserChildren 的 listener 正好對每個有權限的孩子各跑一次。
    expect(source('common/hooks/useUserChildren.ts')).toContain('childIndex/${childId}');
  });
});
