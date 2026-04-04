# UX Design Guidelines for LittleSteps

## Design Philosophy

LittleSteps 的設計理念強調**溫暖、親切、易用**，目標用戶是新手父母，需要在疲憊時也能快速操作。

### Core Principles

1. **3 秒原則** - 關鍵操作（如快速日誌）必須在 3 秒內完成
2. **單手操作** - 按鈕最少 80x80px，間距充足（gap-4），方便單手點擊
3. **視覺層次** - 重要資訊優先，使用大小、顏色、對比度建立層次
4. **減少認知負擔** - 少用文字，多用圖示、顏色、進度條等視覺元素
5. **溫暖色調** - 粉紅、藍色漸層，營造溫馨感

---

## Animation Patterns

### Framer Motion 使用規範

**所有互動元素都應有動畫回饋**，使用 Framer Motion 提供流暢體驗。

#### Button Animations

```tsx
<motion.button
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.98 }}
  className="..."
>
  Click me
</motion.button>
```

**規則：**
- `whileHover`: scale 1.02-1.05，輕微上浮 y: -2 到 -4
- `whileTap`: scale 0.95-0.98，提供按下回饋
- 避免過度動畫（scale > 1.1 或複雜動畫鏈）

#### Card Animations

```tsx
<motion.div
  whileHover={{ y: -4 }}
  whileTap={{ scale: 0.98 }}
  className="card cursor-pointer"
>
  Content
</motion.div>
```

**適用場景：**
- 可點擊的卡片（drill-down）
- 不可點擊的卡片僅用 `transition-all` CSS

#### List/Grid Stagger Animations

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

**規則：**
- staggerChildren: 0.05-0.15s（過長會感覺遲緩）
- 初始 y: 10-30px（不要太大）
- duration: 0.3-0.6s

#### Page Transitions

```tsx
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Page content
</motion.div>
```

**規則：**
- 頁面進入：opacity 0→1 + y: -20→0
- 避免使用 exit 動畫（頁面切換時會造成延遲）

#### Modal/Sidebar Animations

使用 `AnimatePresence` 處理條件渲染：

```tsx
<AnimatePresence>
  {isOpen && (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40"
      />

      {/* Modal/Sidebar */}
      <motion.div
        initial={{ x: '-100%' }} // or scale: 0.95 for modals
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        Content
      </motion.div>
    </>
  )}
</AnimatePresence>
```

**規則：**
- Sidebar: x 平移動畫
- Modal: scale 0.9→1 + opacity 0→1
- Backdrop: 總是淡入淡出
- 使用 spring 動畫讓感覺更自然

---

## Component Design Patterns

### Cards

**所有卡片使用統一樣式：**

```tsx
className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all"
```

**變體：**
- 可點擊卡片：加 `cursor-pointer border-2 border-transparent hover:border-primary/20`
- 淺色背景：`bg-pink-50/50` 或 `bg-blue-50/50`
- 圓角：統一使用 `rounded-2xl` (16px)

### Buttons

#### Primary Button (CTA)

```tsx
className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white shadow-soft-lg hover:shadow-xl transition-all font-semibold"
```

**適用：**
- 登入按鈕
- 主要行動呼籲
- 新增寶寶等重要操作

#### Secondary Button

```tsx
className="px-6 py-3 rounded-xl bg-white border-2 border-gray-200 hover:border-primary hover:bg-pink-50 transition-all text-gray-700 font-medium"
```

**適用：**
- 取消按鈕
- 次要操作

#### Icon Button

```tsx
className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
```

**適用：**
- Header 的選單、返回按鈕
- 編輯、刪除等工具按鈕

#### Quick Action Button (80x80px+)

```tsx
className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 text-white shadow-soft hover:shadow-soft-lg transition-all flex flex-col items-center justify-center gap-2"
```

**適用：**
- 快速日誌按鈕（餵奶、睡眠、尿布）
- 單手操作場景

### Icons

**使用 lucide-react，統一尺寸：**
- 小圖示：`w-4 h-4`
- 中圖示：`w-5 h-5` 或 `w-6 h-6`
- 大圖示：`w-8 h-8` 或 `w-9 h-9`

**圖示容器（圓形或方形）：**

```tsx
<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-soft">
  <Icon className="w-6 h-6 text-white" />
</div>
```

### Progress Bars

```tsx
<div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
  <div
    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
    style={{ width: `${percentage}%` }}
  />
</div>
```

**規則：**
- 高度：`h-2` 或 `h-3`
- 背景：`bg-gray-200`
- 進度條：使用漸層
- 轉場：`transition-all duration-500`

---

## Layout & Spacing

### Container Width

```tsx
className="max-w-6xl mx-auto px-4 py-8"
```

**規則：**
- 內容區：`max-w-4xl` 或 `max-w-6xl`
- 左右留白：`px-4`
- 上下間距：`py-8` 或 `py-16`

### Grid Layouts

```tsx
className="grid md:grid-cols-2 gap-6"
```

**規則：**
- 卡片網格：2 或 3 欄
- 間距：`gap-4` 到 `gap-6`
- 響應式：`grid-cols-1 md:grid-cols-2`

### Spacing System

- 極小間距：`gap-2` (8px)
- 小間距：`gap-3` 或 `gap-4` (12-16px)
- 中間距：`gap-6` (24px)
- 大間距：`mb-8` 或 `py-16` (32-64px)

---

## Responsive Design

### Mobile-First Approach

**所有設計都先考慮手機版，再適配桌面版。**

```tsx
className="text-base md:text-lg" // 手機 16px，桌面 18px
className="px-4 md:px-8" // 手機 16px，桌面 32px
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" // 手機 1欄，平板 2欄，桌面 3欄
```

### Breakpoints

- Mobile: < 768px (預設)
- Tablet: `md:` 768px+
- Desktop: `lg:` 1024px+

---

## Accessibility

### Color Contrast

- 主文字：`text-gray-800` 或更深
- 次要文字：`text-gray-600`
- 提示文字：`text-gray-500`
- 禁用狀態：`text-gray-400`

### Interactive Elements

- 所有按鈕必須有 hover 狀態
- 所有可點擊元素必須有 `cursor-pointer`
- 使用 `title` 屬性提供工具提示

### Focus States

```tsx
className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
```

---

## Common Mistakes to Avoid

❌ **不要：**
- 按鈕太小（< 44x44px）
- 動畫過度（scale > 1.1 或時間 > 1s）
- 漸層方向不一致（統一使用 `from-X to-Y`）
- 文字顏色對比度不足
- 忘記加 `transition-all`
- 手動計算間距（使用 Tailwind spacing system）

✅ **要：**
- 統一使用 `rounded-2xl` 圓角
- 統一使用 `shadow-soft` 陰影
- 所有互動元素加動畫
- 優先使用圖示而非純文字
- 保持一致的間距系統
