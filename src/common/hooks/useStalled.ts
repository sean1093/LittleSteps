import { useEffect, useState } from 'react';

/** How long something may stay pending before we say so. */
export const STALL_AFTER_MS = 10000;

/**
 * True once `pending` has lasted long enough that a loading bar alone is no
 * longer an honest answer.
 *
 * Realtime Database has no disk cache and calls neither callback while
 * disconnected, so a listener attached without a connection is pending for as
 * long as the connection is gone. This turns that into something a page can
 * say: at once when the device already knows it is offline or goes offline
 * while waiting, otherwise after `STALL_AFTER_MS`. Coming back online takes it
 * back and starts the allowance again.
 *
 * It resets as soon as `pending` ends, so a snapshot that does arrive replaces
 * the message without a reload.
 */
export function useStalled(pending: boolean): boolean {
  const [stalled, setStalled] = useState(false);

  useEffect(() => {
    if (!pending) {
      setStalled(false);
      return;
    }
    if (navigator.onLine === false) {
      setStalled(true);
      return;
    }
    let timer = window.setTimeout(() => setStalled(true), STALL_AFTER_MS);
    const wentOffline = () => setStalled(true);
    // Coming back online withdraws the message and gives the wait a fresh
    // allowance: a handoff between wifi and mobile data is a blip, not an
    // outage, and without this the notice would stay until the data arrived.
    const cameOnline = () => {
      setStalled(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setStalled(true), STALL_AFTER_MS);
    };
    window.addEventListener('offline', wentOffline);
    window.addEventListener('online', cameOnline);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('offline', wentOffline);
      window.removeEventListener('online', cameOnline);
    };
  }, [pending]);

  // `pending` is checked here as well: the effect clears the flag one render
  // late, and a stale `true` must not outlive the wait it described.
  return pending && stalled;
}
