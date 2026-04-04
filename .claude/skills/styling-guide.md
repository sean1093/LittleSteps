# Styling Guide for LittleSteps

## Color Palette

### Primary Colors (定義於 tailwind.config.js)

```javascript
primary: {
  DEFAULT: '#F472B6', // 粉紅色 - 主要品牌色
  light: '#FBCFE8',   // 淺粉紅
  dark: '#EC4899',    // 深粉紅
}

secondary: {
  DEFAULT: '#60A5FA', // 藍色 - 次要品牌色
  light: '#DBEAFE',   // 淺藍
  dark: '#3B82F6',    // 深藍
}

warm: {
  white: '#FAFAF9',   // 溫暖白 - 背景色
  cream: '#FEF3C7',   // 奶油色
}
```

### Usage Guidelines

**背景色：**
```tsx
bg-warm-white           // 頁面背景
bg-white                // 卡片背景
bg-pink-50/50           // 淺粉紅背景（50% 透明度）
bg-blue-50/50           // 淺藍背景
bg-gray-50              // 中性淺灰背景
```

**文字色：**
```tsx
text-gray-800           // 主要文字（標題、重要內容）
text-gray-700           // 次要文字
text-gray-600           // 輔助文字
text-gray-500           // 提示文字（placeholder、說明）
text-gray-400           // 禁用狀態文字
```

**品牌色使用：**
```tsx
text-primary            // 強調文字、連結
text-secondary          // 次要強調
bg-primary              // 按鈕、標籤
border-primary          // 邊框強調
```

**狀態色：**
```tsx
text-red-500            // 錯誤、刪除
text-green-600          // 成功、完成
text-yellow-600         // 警告
text-blue-600           // 資訊
```

---

## Gradients

### Background Gradients

**頁面背景漸層：**
```tsx
bg-gradient-to-br from-warm-white via-pink-50/30 to-blue-50/30
```

**卡片/區塊背景漸層：**
```tsx
bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/5
```

**按鈕漸層：**
```tsx
bg-gradient-to-r from-primary to-secondary       // 主要按鈕
bg-gradient-to-br from-pink-400 to-pink-600      // 粉紅按鈕
bg-gradient-to-br from-green-400 to-green-600    // 綠色按鈕（疫苗）
bg-gradient-to-br from-blue-400 to-blue-600      // 藍色按鈕（照顧）
bg-gradient-to-br from-orange-400 to-orange-600  // 橘色按鈕（副食品）
```

**文字漸層：**
```tsx
bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent
```

### Icon Container Gradients

```tsx
className="bg-gradient-to-br from-primary to-secondary"  // 主要
className="bg-gradient-to-br from-pink-400 to-pink-600"  // 里程碑
className="bg-gradient-to-br from-green-400 to-green-600" // 疫苗
className="bg-gradient-to-br from-blue-400 to-blue-600"   // 照顧
className="bg-gradient-to-br from-orange-400 to-orange-600" // 副食品
```

**規則：**
- 統一使用 `bg-gradient-to-br` 或 `bg-gradient-to-r`
- 不要混用其他方向（to-tl, to-bl）
- 顏色深度差異：400 → 600（兩級）

---

## Shadows

### Custom Shadows (定義於 tailwind.config.js)

```javascript
boxShadow: {
  'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
  'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
}
```

### Usage

```tsx
shadow-soft           // 卡片預設陰影
shadow-soft-lg        // hover 或強調時
hover:shadow-soft-lg  // 互動時提升陰影
shadow-sm             // 小元素（badge, tag）
```

**規則：**
- 卡片、按鈕：`shadow-soft`
- Hover 狀態：`hover:shadow-soft-lg`
- Modal backdrop：無陰影，使用 `bg-black/40`
- 避免使用 Tailwind 預設 shadow-md/lg/xl（與設計風格不符）

---

## Border Radius

### Custom Radius (定義於 tailwind.config.js)

```javascript
borderRadius: {
  '2xl': '1rem',   // 16px
  '3xl': '1.5rem', // 24px
}
```

### Usage

```tsx
rounded-2xl       // 卡片、按鈕、輸入框（統一 16px）
rounded-xl        // 小元素、icon container（12px）
rounded-full      // 圓形按鈕、avatar、badge
```

**規則：**
- **主要圓角統一使用 `rounded-2xl`**
- 避免使用 `rounded-lg` 或 `rounded-md`（與設計風格不符）
- 圓形元素用 `rounded-full`

---

## Spacing System

### Padding & Margin

**卡片內距：**
```tsx
p-6              // 標準卡片（24px）
p-4              // 小卡片（16px）
px-4 py-3        // 輸入框、小按鈕
px-8 py-4        // 大按鈕
px-10 py-5       // 超大按鈕（CTA）
```

**容器間距：**
```tsx
space-y-3        // 卡片內元素間距
space-y-6        // 頁面區塊間距
gap-3            // Grid/Flex 小間距
gap-4            // Grid/Flex 中間距
gap-6            // Grid/Flex 大間距
```

**頁面留白：**
```tsx
px-4 py-8        // 手機版頁面
px-4 py-16       // 桌面版頁面
max-w-6xl mx-auto px-4  // 內容置中
```

**規則：**
- 使用 Tailwind 的 spacing scale（4px 倍數）
- 避免自訂 pixel 值（除非必要）
- 保持一致性：同類元素用相同間距

---

## Typography

### Font Family (定義於 tailwind.config.js)

```javascript
fontFamily: {
  sans: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'PingFang TC',          // macOS 中文
    'Microsoft JhengHei',   // Windows 中文
    'Helvetica Neue',
    'sans-serif',
  ],
}
```

### Font Sizes

```tsx
text-xs          // 10-12px - 說明文字、badge
text-sm          // 14px - 次要文字
text-base        // 16px - 正文（手機預設）
text-lg          // 18px - 強調文字、副標題
text-xl          // 20px - 小標題
text-2xl         // 24px - 標題
text-3xl         // 30px - 大標題
text-4xl         // 36px - 頁面主標題
text-5xl         // 48px - Landing page 主標題
```

### Font Weights

```tsx
font-medium      // 500 - 次要強調
font-semibold    // 600 - 按鈕、標籤
font-bold        // 700 - 標題
```

**規則：**
- 正文使用預設 font-normal (400)
- 標題、按鈕使用 `font-semibold` 或 `font-bold`
- 避免使用 `font-light` 或 `font-thin`（可讀性差）

### Responsive Typography

```tsx
text-base md:text-lg           // 手機 16px，桌面 18px
text-xl md:text-2xl            // 手機 20px，桌面 24px
text-5xl md:text-6xl           // Landing page 主標題
```

---

## Borders

### Border Widths

```tsx
border           // 1px
border-2         // 2px - 強調邊框
```

### Border Colors

```tsx
border-gray-200               // 預設分隔線
border-gray-100               // 淺分隔線
border-transparent            // 無邊框（用於 hover 效果）
hover:border-primary          // hover 時顯示品牌色邊框
hover:border-primary/20       // hover 時淺品牌色邊框
```

**常見模式：**
```tsx
border-2 border-transparent hover:border-primary/20  // 卡片 hover
border-2 border-gray-200 hover:border-primary        // 輸入框 focus
```

---

## Opacity & Transparency

### Background Opacity

```tsx
bg-black/40          // Modal backdrop（40% 黑色）
bg-white/80          // 半透明白色背景
bg-pink-50/50        // 50% 透明度粉紅背景
```

### Text Opacity

```tsx
text-white/80        // 80% 透明度白色文字
text-white/90        // 90% 透明度（次要白色文字）
opacity-60           // 完成狀態（整體透明度）
```

**規則：**
- Backdrop: `/40` 或 `/50`
- 文字在深色背景上: `/80` 或 `/90`
- 禁用狀態: `opacity-50` 或 `opacity-60`

---

## Transitions

### Transition Classes

```tsx
transition-all           // 全部屬性轉場（最常用）
transition-colors        // 僅顏色轉場
transition-transform     // 僅變形轉場
transition-shadow        // 僅陰影轉場
```

### Duration

```tsx
duration-300       // 預設（快速互動）
duration-500       // 進度條、平滑動畫
duration-1000      // 長動畫（shimmer effect）
```

**規則：**
- 互動元素（按鈕、卡片）: `transition-all`
- 不指定 duration 使用預設 150ms
- 長動畫需要明確指定 `duration-X`

---

## Common Class Combinations

### Standard Card

```tsx
className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all"
```

### Clickable Card

```tsx
className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all cursor-pointer border-2 border-transparent hover:border-primary/20"
```

### Primary Button

```tsx
className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-soft-lg hover:shadow-xl transition-all"
```

### Icon Container

```tsx
className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-soft"
```

### Input Field

```tsx
className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
```

---

## CSS-in-JS vs Tailwind

**優先使用 Tailwind classes**，僅在必要時使用 inline styles：

❌ **不要：**
```tsx
<div style={{ backgroundColor: '#F472B6', padding: '24px' }}>
```

✅ **要：**
```tsx
<div className="bg-primary p-6">
```

**允許使用 inline styles 的場景：**
- 動態計算的值（如進度條寬度）
- 需要精確控制的動畫

```tsx
<div style={{ width: `${percentage}%` }} className="...">
```

---

## Dark Mode (未實作)

目前不支援 dark mode，所有設計基於淺色主題。

未來若要加入，需要：
1. 在 tailwind.config.js 啟用 `darkMode: 'class'`
2. 為所有元素加入 `dark:` variants
3. 定義 dark mode 色板

---

## Common Mistakes

❌ **不要：**
- 混用不同的圓角大小（rounded-lg + rounded-2xl）
- 使用 Tailwind 預設 shadow（shadow-md, shadow-lg）
- 自訂 pixel 值而不用 spacing scale
- 過度使用透明度（難以閱讀）
- 漸層方向不一致

✅ **要：**
- 統一使用 `rounded-2xl`
- 統一使用 `shadow-soft` / `shadow-soft-lg`
- 使用 Tailwind spacing（p-4, gap-6）
- 保持文字對比度（WCAG AA 標準）
- 漸層統一 `to-br` 或 `to-r`
