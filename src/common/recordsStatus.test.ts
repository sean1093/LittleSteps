import { describe, expect, it } from 'vitest';
import { recordsStatusOf } from './recordsStatus';

describe('recordsStatusOf', () => {
  it('is ready only when nothing is pending and nothing failed', () => {
    expect(recordsStatusOf({ loading: false, error: false, stalled: false })).toBe('ready');
  });

  it('is loading while the first snapshot is in flight', () => {
    expect(recordsStatusOf({ loading: true, error: false, stalled: false })).toBe('loading');
  });

  it('is stalled once a wait has gone on too long', () => {
    expect(recordsStatusOf({ loading: true, error: false, stalled: true })).toBe('stalled');
  });

  it('never calls a finished read stalled, whatever the flag says', () => {
    expect(recordsStatusOf({ loading: false, error: false, stalled: true })).toBe('ready');
  });

  it('reports a failed read over anything else', () => {
    // Every combination: a refused read is final for its listener, so neither
    // "still loading" nor "stalled" may talk over it.
    for (const loading of [true, false]) {
      for (const stalled of [true, false]) {
        expect(recordsStatusOf({ loading, error: true, stalled })).toBe('error');
      }
    }
  });
});
