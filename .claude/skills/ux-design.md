# UX Design Guidelines for LittleSteps

## Design Philosophy

The design philosophy of LittleSteps stresses **warmth, friendliness and ease of use**. The target users are new parents, who need to be able to operate the app quickly even when exhausted.

### Core Principles

1. **The 3-second rule** - a key action (such as Quick log) must be completable within 3 seconds
2. **One-handed operation** - buttons at least 80x80px with generous spacing (gap-4), easy to tap with one hand
3. **Visual hierarchy** - important information first; build the hierarchy with size, colour and contrast
4. **Less cognitive load** - use less text and more icons, colour, progress bars and other visual elements
5. **Warm palette** - pink and blue gradients create a cosy feel

---

## Animation Patterns

### Framer Motion conventions

**Every interactive element should give animated feedback**, using Framer Motion for a smooth experience.

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

**Rules:**
- `whileHover`: scale 1.02-1.05, a slight lift of y: -2 to -4
- `whileTap`: scale 0.95-0.98, giving press feedback
- Avoid over-animating (scale > 1.1 or complex animation chains)

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

**Where this applies:**
- Clickable cards (drill-down)
- Non-clickable cards use CSS `transition-all` only

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

**Rules:**
- staggerChildren: 0.05-0.15s (any longer feels sluggish)
- initial y: 10-30px (do not go too far)
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

**Rules:**
- Page entrance: opacity 0→1 + y: -20→0
- Avoid exit animations (they add a delay when switching pages)

#### Modal/Sidebar Animations

Use `AnimatePresence` to handle conditional rendering:

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

**Rules:**
- Sidebar: x translation animation
- Modal: scale 0.9→1 + opacity 0→1
- Backdrop: always fades in and out
- Use spring animations so it feels more natural

---

## Component Design Patterns

### Cards

**Every card uses the same style:**

```tsx
className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all"
```

**Variants:**
- Clickable card: add `cursor-pointer border-2 border-transparent hover:border-primary/20`
- Light background: `bg-pink-50/50` or `bg-blue-50/50`
- Corner radius: always `rounded-2xl` (16px)

### Buttons

#### Primary Button (CTA)

```tsx
className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white shadow-soft-lg hover:shadow-xl transition-all font-semibold"
```

**Use for:**
- The sign-in button
- Primary calls to action
- Important actions such as adding a baby

#### Secondary Button

```tsx
className="px-6 py-3 rounded-xl bg-white border-2 border-gray-200 hover:border-primary hover:bg-pink-50 transition-all text-gray-700 font-medium"
```

**Use for:**
- The cancel button
- Secondary actions

#### Icon Button

```tsx
className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
```

**Use for:**
- The menu and back buttons in the header
- Tool buttons such as edit and delete

#### Quick Action Button (80x80px+)

```tsx
className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 text-white shadow-soft hover:shadow-soft-lg transition-all flex flex-col items-center justify-center gap-2"
```

**Use for:**
- Quick log buttons (feeding, sleep, diaper)
- One-handed scenarios

### Icons

**Use lucide-react, with consistent sizes:**
- Small icon: `w-4 h-4`
- Medium icon: `w-5 h-5` or `w-6 h-6`
- Large icon: `w-8 h-8` or `w-9 h-9`

**Icon container (circular or square):**

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

**Rules:**
- Height: `h-2` or `h-3`
- Background: `bg-gray-200`
- Progress bar: use a gradient
- Transition: `transition-all duration-500`

---

## Layout & Spacing

### Container Width

```tsx
className="max-w-6xl mx-auto px-4 py-8"
```

**Rules:**
- Content area: `max-w-4xl` or `max-w-6xl`
- Left and right whitespace: `px-4`
- Vertical spacing: `py-8` or `py-16`

### Grid Layouts

```tsx
className="grid md:grid-cols-2 gap-6"
```

**Rules:**
- Card grid: 2 or 3 columns
- Gap: `gap-4` to `gap-6`
- Responsive: `grid-cols-1 md:grid-cols-2`

### Spacing System

- Extra-small gap: `gap-2` (8px)
- Small gap: `gap-3` or `gap-4` (12-16px)
- Medium gap: `gap-6` (24px)
- Large gap: `mb-8` or `py-16` (32-64px)

---

## Responsive Design

### Mobile-First Approach

**Design every screen for mobile first, then adapt it to desktop.**

```tsx
className="text-base md:text-lg" // 16px on mobile, 18px on desktop
className="px-4 md:px-8" // 16px on mobile, 32px on desktop
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" // 1 column on mobile, 2 on tablet, 3 on desktop
```

### Breakpoints

- Mobile: < 768px (default)
- Tablet: `md:` 768px+
- Desktop: `lg:` 1024px+

---

## Accessibility

### Color Contrast

- Primary text: `text-gray-800` or darker
- Secondary text: `text-gray-600`
- Hint text: `text-gray-500`
- Disabled state: `text-gray-400`

### Interactive Elements

- Every button must have a hover state
- Every clickable element must have `cursor-pointer`
- Use the `title` attribute to provide a tooltip

### Focus States

```tsx
className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
```

---

## Common Mistakes to Avoid

❌ **Do not:**
- Make buttons too small (< 44x44px)
- Over-animate (scale > 1.1 or longer than 1s)
- Use inconsistent gradient directions (always use `from-X to-Y`)
- Leave text contrast too low
- Forget to add `transition-all`
- Work out spacing by hand (use the Tailwind spacing system)

✅ **Do:**
- Use `rounded-2xl` corners throughout
- Use the `shadow-soft` shadow throughout
- Add animation to every interactive element
- Prefer icons over plain text
- Keep a consistent spacing system
