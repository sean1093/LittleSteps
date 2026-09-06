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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Flatten a patch into the leaf paths that Realtime Database's `update()`
 * merges on.
 *
 * `update()` only merges the keys it is handed: a nested object replaces that
 * child node whole, so `{ data: { nightWakings: 2 } }` wipes every other key of
 * `data`. Two caregivers editing the same record then overwrite each other,
 * and whoever saved last wins the entire node. `{ 'data/nightWakings': 2 }`
 * touches the one leaf and leaves a concurrent write to a sibling standing.
 *
 * `undefined` is dropped — the field is left alone. `null` is kept, because
 * that is how Realtime Database clears one.
 */
export function toUpdatePaths(patch: object, prefix = ''): Record<string, unknown> {
  const paths: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) continue;
    const path = prefix ? `${prefix}/${key}` : key;
    if (isPlainObject(value)) {
      Object.assign(paths, toUpdatePaths(value, path));
    } else {
      paths[path] = value;
    }
  }
  return paths;
}

/**
 * The fields that actually differ between two versions of one record.
 *
 * A field nobody touched is absent from the result, so it is never written and
 * a concurrent caregiver's change to it survives. A field that is gone in
 * `next` becomes `null`, which is what clears it — omitting it would leave the
 * old value in the database and quietly undo the parent who deleted it.
 */
export function changedFields(before: object, next: object): Record<string, unknown> {
  const changes: Record<string, unknown> = {};
  const keys = new Set([...Object.keys(before), ...Object.keys(next)]);
  for (const key of keys) {
    const was = (before as Record<string, unknown>)[key];
    const now = (next as Record<string, unknown>)[key];
    if (isPlainObject(was) && isPlainObject(now)) {
      const nested = changedFields(was, now);
      if (Object.keys(nested).length > 0) changes[key] = nested;
    } else if (now === undefined || now === null) {
      if (was !== undefined && was !== null) changes[key] = null;
    } else if (!Object.is(was, now)) {
      changes[key] = now;
    }
  }
  return changes;
}
