/**
 * Recursively strip `undefined` values from an object before writing to
 * Firebase Realtime Database, which rejects `undefined` (values must be
 * omitted or `null`). Nested plain objects are cleaned too; arrays and
 * primitives pass through unchanged.
 */
export function removeUndefined<T extends object>(obj: T): Partial<T> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    cleaned[key] =
      value !== null && typeof value === 'object' && !Array.isArray(value)
        ? removeUndefined(value as Record<string, unknown>)
        : value;
  }
  // Keys/values are preserved 1:1 minus `undefined`, so the result is a Partial<T>.
  return cleaned as Partial<T>;
}
