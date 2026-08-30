import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { confirmDelete } from './confirmDelete';

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

function tsFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...tsFiles(full));
    else if (/\.tsx?$/.test(entry) && !entry.includes('.test.')) out.push(full);
  }
  return out;
}

describe('confirmDelete', () => {
  // happy-dom 沒有實作 window.confirm，所以是指派而不是 spyOn。
  beforeEach(() => {
    window.confirm = vi.fn(() => true);
  });

  it('每次都說刪的是什麼，以及回不來', () => {
    confirmDelete('這筆成長記錄');

    expect(window.confirm).toHaveBeenCalledWith('確定要刪除這筆成長記錄嗎？刪除後無法復原。');
  });

  it('會連帶刪掉別的東西時要先講', () => {
    confirmDelete('這位寶寶的資料', '所有里程碑進度');

    expect(window.confirm).toHaveBeenCalledWith(
      '確定要刪除這位寶寶的資料嗎？所有里程碑進度也會一併刪除。刪除後無法復原。',
    );
  });

  it('回傳使用者的選擇，沒有自己決定', () => {
    window.confirm = vi.fn(() => false);

    expect(confirmDelete('這則日記')).toBe(false);
  });
});

describe('刪除確認只有一種寫法', () => {
  /**
   * 原本五個刪除點各寫一句，量詞和用字都不同，其中三句沒講「不可復原」。
   * 這條規則讓下一個刪除點沒辦法再長出第六種說法。
   */
  it('window.confirm 只出現在 confirmDelete 裡', () => {
    const offenders = tsFiles(SRC)
      .filter((file) => !file.endsWith(join('common', 'ui', 'confirmDelete.ts')))
      .filter((file) => /window\.confirm\s*\(/.test(readFileSync(file, 'utf8')))
      .map((file) => file.slice(SRC.length + 1));

    expect(offenders).toEqual([]);
  });

  it('掃描範圍不是空的', () => {
    // 檔案列舉壞掉時，上面那條規則會安靜地永遠通過。
    expect(tsFiles(SRC).length).toBeGreaterThan(100);
  });
});
