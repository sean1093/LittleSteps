# Component Patterns for LittleSteps

## File Organization

```
src/
├── components/          # Reusable UI components
├── pages/              # Page-level components (one per route)
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── contexts/           # React contexts
├── lib/                # Third-party library configurations
├── data/               # Static data (milestones, vaccines, etc.)
└── types/              # TypeScript type definitions
```

### Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (e.g., `DashboardCard.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useDailyLogs.ts`)
- Utils: `camelCase.ts` (e.g., `logHelpers.ts`)
- Types: `index.ts` (single file for all types)

**Exports:**
- Always use `export default` for components
- Named exports for utils/hooks

---

## Component Structure

### Standard Component Template

```tsx
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ComponentNameProps {
  // Required props first
  title: string;
  value: number;
  // Optional props with ?
  onAction?: () => void;
  className?: string;
  // ReactNode for children
  children?: ReactNode;
}

export default function ComponentName({
  title,
  value,
  onAction,
  className = '', // Default values
  children,
}: ComponentNameProps) {
  // State hooks
  const [isOpen, setIsOpen] = useState(false);

  // Custom hooks
  const { data, loading } = useCustomHook();

  // Derived values (useMemo if expensive)
  const formattedValue = useMemo(() =>
    value.toFixed(2),
    [value]
  );

  // Event handlers
  const handleClick = () => {
    onAction?.();
  };

  // Early return for loading/error states
  if (loading) return <LoadingSpinner />;
  if (!data) return null;

  // Main render
  return (
    <motion.div className={`base-classes ${className}`}>
      <h3>{title}</h3>
      <p>{formattedValue}</p>
      {children}
    </motion.div>
  );
}
```

### Component Categories

#### 1. Reusable Components (src/components/)

**Characteristics:**
- No business logic
- Accept props for customization
- Highly reusable across pages

**Examples:**
- `DashboardCard` - Generic card wrapper
- `AddChildModal` - Reusable modal for adding/editing
- `MilestoneCard` - Display milestone info

#### 2. Page Components (src/pages/)

**Characteristics:**
- One per route
- Contain page-specific logic
- Compose reusable components
- Named `*Page.tsx`

**Examples:**
- `DashboardPage` - Dashboard view
- `MilestonesPage` - Milestones tracking
- `LandingPage` - Landing/home page

#### 3. Layout Components

**Characteristics:**
- Wrapper components for layout
- Handle navigation, headers, sidebars

**Examples:**
- `Sidebar` - Navigation sidebar
- Header (inline in App.tsx)

---

## Props Patterns

### Props Interface

```tsx
interface CardProps {
  // Primitives
  title: string;
  count: number;
  isActive: boolean;

  // Objects
  data: DataType;
  config?: ConfigType;

  // Arrays
  items: ItemType[];

  // Functions
  onClick: () => void;
  onSave: (value: string) => void;
  onDelete?: (id: string) => void;

  // Icons (from lucide-react)
  icon: LucideIcon;

  // Children
  children?: ReactNode;

  // Styling
  className?: string;
  bgColor?: string;
}
```

### Destructuring Props

```tsx
export default function Component({
  title,
  count,
  onClick,
  className = '', // Default value
  children,
}: CardProps) {
  // Component logic
}
```

**Rules:**
- Always destructure props in function signature
- Provide defaults for optional props when sensible
- Order: required props first, optional props second

### Props Validation

- Use TypeScript interfaces (no PropTypes)
- Mark optional props with `?`
- Provide type for event handlers

---

## State Management

### Local State (useState)

```tsx
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState<FormData>({ name: '', birthday: '' });
```

**Use for:**
- UI state (modals, dropdowns, tabs)
- Form inputs
- Component-specific data

### Context State (useContext)

```tsx
// contexts/AuthContext.tsx
const { user, loading, signIn, signOut } = useAuth();
```

**Use for:**
- Authentication state
- Global user data
- Theme (if implemented)

### Persistent State

#### LocalStorage (useLocalStorage hook)

```tsx
const [profiles, setProfiles] = useLocalStorage<ChildProfile[]>('child-profiles', []);
```

**Use for:**
- Guest mode data
- User preferences
- Cache

#### Firebase (useFirebaseChildren, useFirebaseFamily hooks)

```tsx
const { addChild, updateChild, deleteChild } = useFirebaseChildren(familyId);
```

**Use for:**
- Authenticated user data
- Multi-device sync
- Real-time updates

---

## Event Handlers

### Naming Convention

```tsx
const handleClick = () => { /* ... */ };
const handleSubmit = (e: FormEvent) => { /* ... */ };
const handleChange = (value: string) => { /* ... */ };
```

**Pattern:** `handle + Action`

### Event Propagation

```tsx
<button onClick={(e) => {
  e.stopPropagation(); // Prevent parent onClick
  handleAction();
}}>
```

**Use `stopPropagation` when:**
- Button inside clickable card
- Checkbox in list item
- Delete button in editable row

### Async Handlers

```tsx
const handleSave = async () => {
  try {
    await saveData();
    setSuccess(true);
  } catch (error: any) {
    console.error('Save failed:', error);
    alert(error.message || 'Operation failed');
  }
};
```

---

## Conditional Rendering

### Early Return Pattern

```tsx
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;
if (!data) return null;

return <MainContent data={data} />;
```

### Inline Conditionals

```tsx
{isVisible && <Component />}

{count > 0 ? (
  <Display count={count} />
) : (
  <EmptyState />
)}
```

### Ternary for Classes

```tsx
className={`base-class ${isActive ? 'active-class' : 'inactive-class'}`}
```

---

## Custom Hooks

### Hook Naming

- Always start with `use`
- Descriptive name: `useDailyLogs`, `useChildSummary`

### Hook Pattern

```tsx
export function useCustomHook(param: string) {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch or subscribe to data
    const unsubscribe = fetchData(param, (newData) => {
      setData(newData);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup
  }, [param]);

  // Derived values
  const processedData = useMemo(() => {
    if (!data) return null;
    return processData(data);
  }, [data]);

  // Actions
  const updateData = useCallback(async (newValue: string) => {
    await apiUpdate(newValue);
  }, []);

  return {
    data: processedData,
    loading,
    error,
    updateData
  };
}
```

**Rules:**
- Return object (not array) for multiple values
- Include loading/error states if async
- Use `useCallback` for returned functions
- Use `useMemo` for expensive computations

---

## Styling in Components

### Class Composition

```tsx
const baseClasses = 'bg-white rounded-2xl p-6';
const stateClasses = isActive ? 'border-primary' : 'border-gray-200';
const hoverClasses = 'hover:shadow-soft-lg transition-all';

<div className={`${baseClasses} ${stateClasses} ${hoverClasses} ${className}`}>
```

### Conditional Classes

```tsx
className={`
  flex items-center gap-3 p-4 rounded-xl transition-all
  ${isSelected
    ? 'bg-primary text-white shadow-soft'
    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
  }
`}
```

### Dynamic Inline Styles

**Only use for dynamic values:**

```tsx
<div
  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
  style={{ width: `${percentage}%` }}
/>
```

---

## Modal/Overlay Pattern

```tsx
import { AnimatePresence, motion } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

---

## Form Patterns

### Controlled Components

```tsx
const [formData, setFormData] = useState({ name: '', birthday: '' });

const handleChange = (field: string, value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};

<input
  value={formData.name}
  onChange={(e) => handleChange('name', e.target.value)}
  className="..."
/>
```

### Form Submission

```tsx
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  // Validation
  if (!formData.name.trim()) {
    alert('Name is required');
    return;
  }

  try {
    await onSave(formData);
    onClose();
  } catch (error: any) {
    alert(error.message || 'Save failed');
  }
};

<form onSubmit={handleSubmit}>
  {/* inputs */}
  <button type="submit">Save</button>
</form>
```

---

## List Rendering

### Keys

```tsx
{items.map((item) => (
  <ItemCard key={item.id} item={item} />
))}
```

**Rules:**
- Always use unique, stable `key`
- Prefer `item.id` over `index`
- Only use `index` if list never reorders

### Empty States

```tsx
{items.length === 0 ? (
  <EmptyState message="No items yet" />
) : (
  <div className="grid gap-4">
    {items.map(item => <Item key={item.id} {...item} />)}
  </div>
)}
```

---

## Common Patterns

### Loading State

```tsx
if (loading) {
  return (
    <div className="flex items-center justify-center p-8">
      <Baby className="w-12 h-12 text-primary animate-pulse" />
      <p className="text-gray-600 ml-4">Loading...</p>
    </div>
  );
}
```

### Error State

```tsx
if (error) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
      <p className="text-red-600">{error.message}</p>
    </div>
  );
}
```

### Empty State

```tsx
if (items.length === 0) {
  return (
    <div className="text-center py-12">
      <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-600">No items yet</p>
      <button onClick={onAdd} className="mt-4">Add First Item</button>
    </div>
  );
}
```

---

## Performance Optimization

### useMemo

```tsx
const expensiveValue = useMemo(() => {
  return items.filter(/* complex logic */).map(/* transform */);
}, [items]);
```

**Use for:**
- Expensive calculations
- Large list filtering/mapping
- Derived statistics

### useCallback

```tsx
const handleClick = useCallback(() => {
  doSomething(param);
}, [param]);
```

**Use for:**
- Functions passed as props
- Dependencies in other hooks

### React.memo

```tsx
export default React.memo(Component);
```

**Use sparingly for:**
- Pure components that render often
- Components with expensive renders

---

## Accessibility

### Semantic HTML

```tsx
<button>Click</button>          // Not <div onClick>
<input type="text" />           // Not <div contentEditable>
<label htmlFor="name">Name</label>
```

### ARIA Attributes

```tsx
<button
  aria-label="Close modal"
  title="Close"
>
  <X />
</button>

<div role="dialog" aria-modal="true">
  <h2 id="dialog-title">Title</h2>
  <div aria-describedby="dialog-title">...</div>
</div>
```

---

## Common Mistakes

❌ **Don't:**
- Forget keys in lists
- Use index as key for dynamic lists
- Directly mutate state
- Put business logic in render
- Over-optimize with memo/useMemo

✅ **Do:**
- Use TypeScript interfaces for props
- Handle loading/error states
- Use early returns for clarity
- Keep components focused (single responsibility)
- Extract reusable logic to hooks
