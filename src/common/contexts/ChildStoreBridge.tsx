import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import type { User } from 'firebase/auth';
import { useChildStore, type ChildStore } from '../hooks/useChildStore';

interface ChildStoreBridgeProps {
  user: User;
  /** Hands the store for `uid` to the provider; `null` when this bridge goes away. */
  onStore: (uid: string, store: ChildStore | null) => void;
}

type Action = (...args: unknown[]) => unknown;

/**
 * Runs the real child store and hands it to `ChildStoreProvider`.
 *
 * This component exists to be loaded lazily. `useChildStore` imports the data
 * hooks and they import the database SDK; calling it from the provider put all
 * of that on the entry's import path, where every signed-out visit to a public
 * page paid for it. The provider now mounts this only once there is a user,
 * as a sibling of the app rather than a wrapper around it, so that the store
 * arriving does not remount everything underneath.
 *
 * `useChildStore` returns a new object with new functions on every render.
 * Publishing that as it is would loop: the provider re-renders on each
 * publish, this re-renders with it, and a fresh object is published again. So
 * what is published is stable: the functions are fixed wrappers that call
 * whatever the latest render produced, and a new object is published only
 * when one of the data members actually changed. A side effect worth having:
 * the context value no longer changes on renders where nothing did.
 */
export default function ChildStoreBridge({ user, onStore }: ChildStoreBridgeProps) {
  const store = useChildStore(user);

  const latest = useRef(store);
  latest.current = store;

  // The key set of a ChildStore is fixed, so reading it once is enough.
  const actions = useMemo(() => {
    const wrapped: Record<string, Action> = {};
    const first = latest.current as unknown as Record<string, unknown>;
    for (const key of Object.keys(first)) {
      if (typeof first[key] !== 'function') continue;
      wrapped[key] = (...args) =>
        (latest.current as unknown as Record<string, Action>)[key](...args);
    }
    return wrapped;
  }, []);

  const data = Object.values(store).filter((member) => typeof member !== 'function');
  const published = useRef<{ data: unknown[]; store: ChildStore } | null>(null);
  if (
    published.current === null ||
    published.current.data.length !== data.length ||
    data.some((member, index) => member !== published.current?.data[index])
  ) {
    published.current = { data, store: { ...store, ...actions } as ChildStore };
  }
  const stable = published.current.store;

  // Before paint: a page must not be drawn once from the placeholder store and
  // then again from the real one.
  useLayoutEffect(() => {
    onStore(user.uid, stable);
  }, [onStore, stable, user.uid]);

  useEffect(() => () => onStore(user.uid, null), [onStore, user.uid]);

  return null;
}
