import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { ChildStoreValueProvider } from '../common/contexts/ChildStoreContext';
import { useChildStore } from '../common/hooks/useChildStore';

const TEST_USER = { uid: 'u1' } as User;

/**
 * Provides whatever `useChildStore` returns to the tree below, on every
 * render.
 *
 * For tests that replace `useChildStore` with a fake (`vi.mock` of the hook
 * module reaches this import too) and need its value in context. The real
 * `ChildStoreProvider` loads the store lazily and republishes only when a data
 * member changes identity, which is right for the real hook and wrong for a
 * fake that returns fresh literals or is edited in place between renders.
 */
export function TestChildStoreProvider({ children }: { children: ReactNode }) {
  const store = useChildStore(TEST_USER);
  return <ChildStoreValueProvider store={store}>{children}</ChildStoreValueProvider>;
}
