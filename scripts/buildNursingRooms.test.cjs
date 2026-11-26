'use strict';

/**
 * 地圖上同一處哺集乳室常登記兩次：一筆地址含村里、一筆不含，或台/臺寫法
 * 不同。dedupeRooms 只合併「同名且正規化地址相同」的兩筆；地址不同就是不同的
 * 哺集乳室，即使名稱一樣也要留兩筆。
 *
 * CommonJS，理由同 diffDiseaseRadar.test.cjs：`scripts/` 不進 tsc，
 * describe / it / expect 取自 vitest 的 globals。
 */

const path = require('node:path');
const fs = require('node:fs');

const { dedupeRooms } = require('./buildNursingRooms.cjs');

const COMMITTED = path.join(__dirname, '..', 'public/data/nursingRooms.json');

function room(id, name, address) {
  return { id, name, address, city: address.slice(0, 3), latitude: 25, longitude: 121.5 };
}

describe('dedupeRooms', () => {
  it('同名、地址只差村里的兩筆合成一筆，留 id 較小的那筆', () => {
    const rooms = [
      room('hpa-876', '板橋大觀國中公共托育中心', '新北市板橋區浮洲里僑中一街1號'),
      room('hpa-913', '板橋大觀國中公共托育中心', '新北市板橋區僑中一街1號'),
    ];
    expect(dedupeRooms(rooms).map((r) => r.id)).toEqual(['hpa-876']);
  });

  it('id 較小的那筆排在後面也一樣留它', () => {
    const rooms = [
      room('hpa-1086', '新莊興化公共托育中心', '新北市新莊區福興里五工路68巷2號'),
      room('hpa-1046', '新莊興化公共托育中心', '新北市新莊區五工路68巷2號'),
    ];
    expect(dedupeRooms(rooms).map((r) => r.id)).toEqual(['hpa-1046']);
  });

  it('台與臺視為同一字', () => {
    const rooms = [
      room('hpa-1', '台北車站哺乳室', '臺北市中正區北平西路3號'),
      room('hpa-2', '臺北車站哺乳室', '台北市中正區北平西路3號'),
    ];
    expect(dedupeRooms(rooms)).toHaveLength(1);
  });

  it('同名但門牌不同是兩間，不合併', () => {
    const rooms = [
      room('hpa-1', '板橋大觀國中公共托育中心', '新北市板橋區僑中一街1號'),
      room('hpa-2', '板橋大觀國中公共托育中心', '新北市板橋區僑中一街3號'),
    ];
    expect(dedupeRooms(rooms)).toHaveLength(2);
  });

  it('同址但名稱不同是兩間，不合併', () => {
    const rooms = [
      room('hpa-1', '某百貨 3 樓哺乳室', '臺北市信義區松高路11號'),
      room('hpa-2', '某百貨 B1 哺乳室', '臺北市信義區松高路11號'),
    ];
    expect(dedupeRooms(rooms)).toHaveLength(2);
  });

  it('已提交的 nursingRooms.json 沒有同名同址的重複', () => {
    const rooms = JSON.parse(fs.readFileSync(COMMITTED, 'utf8'));
    expect(dedupeRooms(rooms)).toHaveLength(rooms.length);
  });
});
