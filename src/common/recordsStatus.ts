/**
 * What a page that reads a child's records can honestly say about them.
 *
 * `[]` on its own is three different things: nothing has arrived yet, nothing
 * could be read, or the child really has no records. Only the last one is a
 * fact about the child, and a clinic summary that reports "no feeds this week"
 * for either of the other two is wrong in a way a parent cannot see. A page
 * renders from the data only when the status is `ready`.
 *
 * - `loading`: the first snapshot is in flight.
 * - `stalled`: it has been in flight too long, or the device says it is
 *   offline. Realtime Database calls neither callback while disconnected, so
 *   without this the loading bar would turn forever with no explanation.
 * - `error`: the read was refused or failed.
 */
export type RecordsStatus = 'ready' | 'loading' | 'stalled' | 'error';

export function recordsStatusOf(state: {
  loading: boolean;
  error: boolean;
  stalled: boolean;
}): RecordsStatus {
  // An error is final for this listener and says more than "still waiting".
  if (state.error) return 'error';
  if (state.loading) return state.stalled ? 'stalled' : 'loading';
  return 'ready';
}
