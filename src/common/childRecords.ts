import type { DailyLog, DiaryEntry } from '../types';

/** One collection of a child's records, as its listener last reported it. */
export interface RecordsSlice<T> {
  /** The child the listener is attached for; `null` when none is attached. */
  childId: string | null;
  data: T[];
  loading: boolean;
  error: boolean;
}

/** What `ChildRecordsBridge` reports to the app shell. */
export interface ChildRecords {
  dailyLogs: RecordsSlice<DailyLog>;
  diaryEntries: RecordsSlice<DiaryEntry>;
}

// One shared array, so "nothing" is the same value on every render.
const NONE: never[] = [];

export const NO_CHILD_RECORDS: ChildRecords = {
  dailyLogs: { childId: null, data: NONE, loading: false, error: false },
  diaryEntries: { childId: null, data: NONE, loading: false, error: false },
};

/**
 * What the shell should believe about one collection for the child it wants.
 *
 * The report arrives a moment after the want: the bridge is lazy, and even
 * once loaded it reports from an effect. A report for a different child, or
 * none yet, is therefore not "this child has no records" - it is "not known
 * yet", which is loading. Reading the slice without this check would hand a
 * page an empty array marked as settled.
 */
export function sliceFor<T>(slice: RecordsSlice<T>, wanted: string | null): RecordsSlice<T> {
  if (wanted === null) return { childId: null, data: NONE, loading: false, error: false };
  if (slice.childId === wanted) return slice;
  return { childId: wanted, data: NONE, loading: true, error: false };
}
