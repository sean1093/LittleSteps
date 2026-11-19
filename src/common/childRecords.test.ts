import { describe, expect, it } from 'vitest';
import { NO_CHILD_RECORDS, sliceFor, type RecordsSlice } from './childRecords';

const reported = (childId: string | null, data: string[], loading = false): RecordsSlice<string> => ({
  childId,
  data,
  loading,
  error: false,
});

describe('sliceFor', () => {
  it('passes a report through when it is for the child that is wanted', () => {
    const slice = reported('A', ['feed']);

    expect(sliceFor(slice, 'A')).toBe(slice);
  });

  it('treats a report for another child as not known yet, not as no records', () => {
    // The moment after switching child: the bridge has not reported for the
    // new one, and the old child's rows must not be shown under the new name.
    const result = sliceFor(reported('A', ['feed']), 'B');

    expect(result).toEqual({ childId: 'B', data: [], loading: true, error: false });
  });

  it('treats no report at all as loading when a child is wanted', () => {
    // The bridge is lazy: on first entry its code may still be on the way.
    expect(sliceFor(NO_CHILD_RECORDS.dailyLogs, 'A').loading).toBe(true);
  });

  it('is settled and empty when no child is wanted, whatever was last reported', () => {
    const result = sliceFor(reported('A', ['feed'], true), null);

    expect(result).toEqual({ childId: null, data: [], loading: false, error: false });
  });
});
