# Styling Guide for LittleSteps

## Color Palette

### Primary Colors (defined in tailwind.config.js)

```javascript
primary: {
  DEFAULT: '#F472B6', // pink - primary brand colour
  light: '#FBCFE8',   // light pink
  dark: '#EC4899',    // dark pink
}

secondary: {
  DEFAULT: '#60A5FA', // blue - secondary brand colour
  light: '#DBEAFE',   // light blue
  dark: '#3B82F6',    // dark blue
}

warm: {
  white: '#FAFAF9',   // warm white - background colour
  cream: '#FEF3C7',   // cream
}
```

### Usage Guidelines

**Background colours:**
```tsx
bg-warm-white           // page background
bg-white                // card background
bg-pink-50/50           // light pink background (50% opacity)
bg-blue-50/50           // light blue background
bg-gray-50              // neutral light grey background
```

**Text colours:**
```tsx
text-gray-800           // primary text (headings, important content)
text-gray-700           // secondary text
text-gray-600           // supporting text
text-gray-500           // hint text (placeholder, descriptions)
text-gray-400           // disabled-state text
```

**Brand colour usage:**
```tsx
text-primary            // emphasised text, links
text-secondary          // secondary emphasis
bg-primary              // buttons, labels
border-primary          // border emphasis
```

**Status colours:**
```tsx
text-red-500            // error, delete
text-green-600          // success, complete
text-yellow-600         // warning
text-blue-600           // information
```

---

## Gradients

### Background Gradients

**Page background gradient:**
```tsx
bg-gradient-to-br from-warm-white via-pink-50/30 to-blue-50/30
```

**Card/section background gradient:**
```tsx
bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/5
```

**Button gradients:**
```tsx
bg-gradient-to-r from-primary to-secondary       // primary button
bg-gradient-to-br from-pink-400 to-pink-600      // pink button
bg-gradient-to-br from-green-400 to-green-600    // green button (vaccines)
bg-gradient-to-br from-blue-400 to-blue-600      // blue button (care)
bg-gradient-to-br from-orange-400 to-orange-600  // orange button (weaning)
```

**Text gradient:**
```tsx
bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent
```

### Icon Container Gradients

```tsx
className="bg-gradient-to-br from-primary to-secondary"  // primary
className="bg-gradient-to-br from-pink-400 to-pink-600"  // milestones
className="bg-gradient-to-br from-green-400 to-green-600" // vaccines
className="bg-gradient-to-br from-blue-400 to-blue-600"   // care
className="bg-gradient-to-br from-orange-400 to-orange-600" // weaning
```

**Rules:**
- Always use `bg-gradient-to-br` or `bg-gradient-to-r`
- Do not mix in other directions (to-tl, to-bl)
- Colour depth difference: 400 → 600 (two steps)

---

## Shadows

### Custom Shadows (defined in tailwind.config.js)

```javascript
boxShadow: {
  'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
  'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
}
```

### Usage

```tsx
shadow-soft           // default card shadow
shadow-soft-lg        // on hover or for emphasis
hover:shadow-soft-lg  // raise the shadow on interaction
shadow-sm             // small elements (badge, tag)
```

**Rules:**
- Cards and buttons: `shadow-soft`
- Hover state: `hover:shadow-soft-lg`
- Modal backdrop: no shadow, use `bg-black/40`
- Avoid Tailwind's default shadow-md/lg/xl (does not match the design style)

---

## Border Radius

### Custom Radius (defined in tailwind.config.js)

```javascript
borderRadius: {
  '2xl': '1rem',   // 16px
  '3xl': '1.5rem', // 24px
}
```

### Usage

```tsx
rounded-2xl       // cards, buttons, input fields (16px throughout)
rounded-xl        // small elements, icon container (12px)
rounded-full      // circular buttons, avatar, badge
```

**Rules:**
- **Use `rounded-2xl` as the main corner radius throughout**
- Avoid `rounded-lg` and `rounded-md` (they do not match the design style)
- Use `rounded-full` for circular elements

---

## Spacing System

### Padding & Margin

**Card padding:**
```tsx
p-6              // standard card (24px)
p-4              // small card (16px)
px-4 py-3        // input fields, small buttons
px-8 py-4        // large buttons
px-10 py-5       // extra-large button (CTA)
```

**Container spacing:**
```tsx
space-y-3        // between elements inside a card
space-y-6        // between page sections
gap-3            // Grid/Flex small gap
gap-4            // Grid/Flex medium gap
gap-6            // Grid/Flex large gap
```

**Page whitespace:**
```tsx
px-4 py-8        // mobile page
px-4 py-16       // desktop page
max-w-6xl mx-auto px-4  // centred content
```

**Rules:**
- Use Tailwind's spacing scale (multiples of 4px)
- Avoid custom pixel values (unless necessary)
- Stay consistent: the same spacing for the same kind of element

---

## Typography

### Font Family (defined in tailwind.config.js)

```javascript
fontFamily: {
  sans: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'PingFang TC',          // macOS Chinese
    'Microsoft JhengHei',   // Windows Chinese
    'Helvetica Neue',
    'sans-serif',
  ],
}
```

### Font Sizes

```tsx
text-xs          // 10-12px - description text, badge
text-sm          // 14px - secondary text
text-base        // 16px - body copy (mobile default)
text-lg          // 18px - emphasised text, subheading
text-xl          // 20px - small heading
text-2xl         // 24px - heading
text-3xl         // 30px - large heading
text-4xl         // 36px - page title
text-5xl         // 48px - Landing page title
```

### Font Weights

```tsx
font-medium      // 500 - secondary emphasis
font-semibold    // 600 - buttons, labels
font-bold        // 700 - headings
```

**Rules:**
- Body copy uses the default font-normal (400)
- Headings and buttons use `font-semibold` or `font-bold`
- Avoid `font-light` and `font-thin` (poor readability)

### Responsive Typography

```tsx
text-base md:text-lg           // 16px on mobile, 18px on desktop
text-xl md:text-2xl            // 20px on mobile, 24px on desktop
text-5xl md:text-6xl           // Landing page title
```

---

## Borders

### Border Widths

```tsx
border           // 1px
border-2         // 2px - emphasised border
```

### Border Colors

```tsx
border-gray-200               // default divider
border-gray-100               // light divider
border-transparent            // no border (used for hover effects)
hover:border-primary          // show the brand-colour border on hover
hover:border-primary/20       // show a light brand-colour border on hover
```

**Common patterns:**
```tsx
border-2 border-transparent hover:border-primary/20  // card hover
border-2 border-gray-200 hover:border-primary        // input field focus
```

---

## Opacity & Transparency

### Background Opacity

```tsx
bg-black/40          // Modal backdrop (40% black)
bg-white/80          // semi-transparent white background
bg-pink-50/50        // 50% opacity pink background
```

### Text Opacity

```tsx
text-white/80        // 80% opacity white text
text-white/90        // 90% opacity (secondary white text)
opacity-60           // completed state (overall opacity)
```

**Rules:**
- Backdrop: `/40` or `/50`
- Text on a dark background: `/80` or `/90`
- Disabled state: `opacity-50` or `opacity-60`

---

## Transitions

### Transition Classes

```tsx
transition-all           // transition every property (most common)
transition-colors        // colour only
transition-transform     // transform only
transition-shadow        // shadow only
```

### Duration

```tsx
duration-300       // default (quick interactions)
duration-500       // progress bars, smooth animations
duration-1000      // long animations (shimmer effect)
```

**Rules:**
- Interactive elements (buttons, cards): `transition-all`
- Leaving duration unspecified uses the default 150ms
- Long animations must state `duration-X` explicitly

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

**Prefer Tailwind classes**, and use inline styles only where necessary:

❌ **Do not:**
```tsx
<div style={{ backgroundColor: '#F472B6', padding: '24px' }}>
```

✅ **Do:**
```tsx
<div className="bg-primary p-6">
```

**Cases where inline styles are allowed:**
- Dynamically computed values (such as a progress bar's width)
- Animations that need precise control

```tsx
<div style={{ width: `${percentage}%` }} className="...">
```

---

## Dark Mode (not implemented)

Dark mode is not supported at present; every design is based on the light theme.

To add it in future you would need to:
1. Enable `darkMode: 'class'` in tailwind.config.js
2. Add `dark:` variants to every element
3. Define a dark mode palette

---

## Common Mistakes

❌ **Do not:**
- Mix different corner radii (rounded-lg + rounded-2xl)
- Use Tailwind's default shadows (shadow-md, shadow-lg)
- Use custom pixel values instead of the spacing scale
- Overuse transparency (hard to read)
- Use inconsistent gradient directions

✅ **Do:**
- Use `rounded-2xl` throughout
- Use `shadow-soft` / `shadow-soft-lg` throughout
- Use Tailwind spacing (p-4, gap-6)
- Keep text contrast (WCAG AA standard)
- Keep gradients on `to-br` or `to-r`
