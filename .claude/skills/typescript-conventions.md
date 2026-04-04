# TypeScript Conventions for LittleSteps

## Type Definitions

### Centralized Types (src/types/index.ts)

**All types are defined in a single file** for easy maintenance and import.

```typescript
// Import types
import { ChildProfile, MilestoneProgress, DailyLog } from '../types';
```

### Naming Conventions

- **Interfaces**: PascalCase (e.g., `ChildProfile`, `MilestoneProgress`)
- **Type Aliases**: PascalCase (e.g., `MonthRange`, `Category`)
- **Enums**: PascalCase with UPPER_CASE values (avoid enums, use union types instead)

---

## Interface vs Type

### Prefer Interfaces for Objects

```typescript
export interface ChildProfile {
  id: string;
  name: string;
  birthday: string;
  milestoneProgress: MilestoneProgress;
  vaccineProgress: VaccineProgress;
  createdAt: string;
}
```

### Use Type for Unions/Primitives

```typescript
export type MonthRange = "0-2" | "3-4" | "5-6" | "7-9" | "10-12" | "12+";
export type Category = "physical" | "motor" | "cognitive" | "feeding" | "all";
export type Page = 'home' | 'dashboard' | 'milestones' | 'care-guide' | 'vaccine-tracking' | 'complementary-food' | 'daily-log';
```

---

## Null Safety

### Optional Fields

```typescript
export interface MilestoneProgress {
  [milestoneId: string]: {
    achieved: boolean;
    achievedDate?: string; // Optional with ?
  };
}
```

### Nullable Types

```typescript
const currentChild: ChildProfile | null = ...;
const currentChildId: string | null = ...;
```

### Handling Undefined/Null

#### Fallback Values

```typescript
const milestoneProgress = currentChild?.milestoneProgress || {};
const vaccineProgress = currentChild?.vaccineProgress || {};
const logs = dailyLogs ?? [];
```

#### Optional Chaining

```typescript
const name = currentChild?.name;
const progress = currentChild?.milestoneProgress?.[milestoneId];
```

#### Nullish Coalescing

```typescript
const value = data ?? 'default'; // Use ?? not ||
```

**Difference:**
- `||`: falsy values (0, '', false) trigger fallback
- `??`: only null/undefined trigger fallback

---

## Function Types

### Event Handlers

```typescript
onClick: () => void;
onChange: (value: string) => void;
onSave: (name: string, birthday: string) => void;
onToggle?: (id: string) => void; // Optional
```

### Async Functions

```typescript
signInWithGoogle: () => Promise<void>;
addChild: (name: string, birthday: string) => Promise<string>; // Returns child ID
```

### Generic Functions

```typescript
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // ...
}
```

---

## Component Props

### Props Interface

```typescript
interface ComponentProps {
  // Required props
  title: string;
  count: number;
  onAction: () => void;

  // Optional props with ?
  subtitle?: string;
  className?: string;
  children?: ReactNode;

  // Icons from lucide-react
  icon: LucideIcon;

  // Complex objects
  data: DataType;
  config?: Partial<ConfigType>; // Partial makes all fields optional
}
```

### Extending Props

```typescript
interface BaseCardProps {
  title: string;
  icon: LucideIcon;
}

interface ClickableCardProps extends BaseCardProps {
  onClick: () => void;
}
```

---

## Generic Types

### React Types

```typescript
import { ReactNode, FormEvent, ChangeEvent } from 'react';

children: ReactNode;
handleSubmit: (e: FormEvent) => void;
handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
```

### Lucide Icons

```typescript
import { LucideIcon } from 'lucide-react';

icon: LucideIcon;
```

### Firebase Types

```typescript
import { User } from 'firebase/auth';

user: User | null;
```

---

## Type Guards

### Type Narrowing

```typescript
if (currentChild) {
  // TypeScript knows currentChild is not null here
  console.log(currentChild.name);
}

if (!data) return null; // Early return narrows type
// TypeScript knows data is not null below
```

### Type Assertions (Use Sparingly)

```typescript
const value = (input as DataType).field;

// Better: type guard
if (isDataType(input)) {
  const value = input.field;
}
```

---

## Generic Hooks

### useState with Type

```typescript
const [data, setData] = useState<DataType | null>(null);
const [items, setItems] = useState<Item[]>([]);
const [isOpen, setIsOpen] = useState(false); // Inferred as boolean
```

### useRef with Type

```typescript
const inputRef = useRef<HTMLInputElement>(null);
const divRef = useRef<HTMLDivElement>(null);
```

### Custom Hook Return Type

```typescript
export function useCustomHook(): {
  data: DataType | null;
  loading: boolean;
  error: Error | null;
  updateData: (value: string) => Promise<void>;
} {
  // ...
}

// Or use interface
interface UseCustomHookReturn {
  data: DataType | null;
  loading: boolean;
  error: Error | null;
  updateData: (value: string) => Promise<void>;
}

export function useCustomHook(): UseCustomHookReturn {
  // ...
}
```

---

## Record Types

### Index Signatures

```typescript
export interface MilestoneProgress {
  [milestoneId: string]: {
    achieved: boolean;
    achievedDate?: string;
  };
}

export interface VaccineProgress {
  [vaccineId: string]: {
    doses: {
      [doseNumber: number]: {
        administered: boolean;
        administeredDate?: string;
      };
    };
  };
}
```

### Record Utility Type

```typescript
type StringMap = Record<string, string>;
type NumberMap = Record<string, number>;

// Same as:
interface StringMap {
  [key: string]: string;
}
```

---

## Utility Types

### Partial (Make All Fields Optional)

```typescript
type PartialChild = Partial<ChildProfile>;
// All fields become optional

function updateChild(id: string, updates: Partial<ChildProfile>) {
  // Can update any field without providing all
}
```

### Omit (Remove Fields)

```typescript
type NewChild = Omit<ChildProfile, 'id' | 'createdAt'>;
// Used for create functions (ID generated later)

function createChild(data: Omit<ChildProfile, 'id'>) {
  const id = generateId();
  return { ...data, id };
}
```

### Pick (Select Fields)

```typescript
type ChildBasicInfo = Pick<ChildProfile, 'name' | 'birthday'>;
```

---

## Error Handling Types

### Try-Catch with Unknown Error

```typescript
try {
  await operation();
} catch (error: any) {
  console.error('Operation failed:', error);
  alert(error.message || 'Operation failed');
}
```

**Why `any`?**
- TypeScript 4.4+ uses `unknown` by default for caught errors
- `any` allows accessing `.message` without type assertion
- Alternative: type guard

```typescript
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error('Unknown error');
  }
}
```

---

## Enum Alternatives (Union Types)

### ❌ Don't Use Enums

```typescript
enum Status {
  PENDING = 'pending',
  COMPLETED = 'completed',
}
```

### ✅ Use Union Types

```typescript
type Status = 'pending' | 'completed';
type LogType = 'feeding' | 'sleep' | 'diaper';
```

**Why?**
- Simpler, no runtime overhead
- Better tree-shaking
- More TypeScript-idiomatic

---

## Type Imports

### Import Types

```typescript
import { ChildProfile, MilestoneProgress } from '../types';
import { User } from 'firebase/auth';
import { LucideIcon } from 'lucide-react';
```

### Type-Only Imports (Optional)

```typescript
import type { ChildProfile } from '../types';
```

**Use when:**
- Only importing for type annotations (not runtime)
- Improves build performance (minor)

---

## Const Assertions

### Readonly Arrays

```typescript
const features = [
  { id: 'milestones', title: '里程碑追蹤' },
  { id: 'vaccines', title: '疫苗追蹤' },
] as const;

type FeatureId = typeof features[number]['id']; // 'milestones' | 'vaccines'
```

### Readonly Objects

```typescript
const config = {
  maxChildren: 2,
  version: '1.0.0',
} as const;

// config.maxChildren is type 2, not number
```

---

## Best Practices

### ✅ Do:

- Always define interfaces for component props
- Use union types instead of enums
- Provide types for useState, useRef
- Use optional chaining (`?.`) for nullable objects
- Use nullish coalescing (`??`) for fallbacks
- Handle null/undefined explicitly
- Use `any` sparingly (only for error catching)
- Keep types in centralized `types/index.ts`

### ❌ Don't:

- Use `any` everywhere (defeats purpose of TypeScript)
- Forget to handle null/undefined
- Use enums (use union types instead)
- Type assertions without good reason
- Ignore TypeScript errors (fix them!)
- Mix `||` and `??` without understanding difference

---

## Common Type Patterns

### API Response

```typescript
interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

const { data, loading, error } = useApi<ChildProfile[]>('/children');
```

### Form State

```typescript
interface FormData {
  name: string;
  birthday: string;
}

const [formData, setFormData] = useState<FormData>({
  name: '',
  birthday: '',
});
```

### Conditional Types (Advanced)

```typescript
type LogData<T extends LogType> = T extends 'feeding'
  ? FeedingData
  : T extends 'sleep'
  ? SleepData
  : DiaperData;
```

---

## TypeScript Config (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Key settings:**
- `strict: true` - Enables all strict type checking
- `noUnusedLocals: true` - Error on unused variables
- `noUnusedParameters: true` - Error on unused function parameters

---

## Fixing Common TypeScript Errors

### TS2322: Type not assignable

```typescript
// Error: Type 'string | undefined' is not assignable to type 'string'
const name: string = currentChild?.name;

// Fix: Add null check or use fallback
const name: string = currentChild?.name || '';
```

### TS2339: Property does not exist

```typescript
// Error: Property 'name' does not exist on type '{}'
const data = {};
console.log(data.name);

// Fix: Define proper type
interface Data {
  name: string;
}
const data: Data = { name: 'test' };
```

### TS6133: Variable declared but never used

```typescript
// Error: 'ageInMonths' is declared but its value is never read
const ageInMonths = calculateAge();

// Fix: Remove unused variable or use it
const ageInMonths = calculateAge();
console.log(ageInMonths);
```

---

## Testing Types

TypeScript types are compile-time only. No runtime testing needed.

**But you should:**
- Run `npm run build` before commit
- Fix all TypeScript errors
- Don't use `@ts-ignore` (except rare cases)
- Don't disable strict mode
