import { useLayoutEffect, useMemo } from 'react';
import type { User } from 'firebase/auth';
import { useDailyLogs } from '../littlesteps/hooks/useDailyLogs';
import { useDiary } from '../littleexplorer/hooks/useDiary';
import type { ChildRecords } from './childRecords';

interface ChildRecordsBridgeProps {
  user: User;
  /** The child whose daily logs to listen to, or `null` for none. */
  logsChildId: string | null;
  /** The child whose diary to listen to, or `null` for none. */
  diaryChildId: string | null;
  onRecords: (records: ChildRecords) => void;
}

/**
 * Holds the two record listeners the app shell needs and reports what they
 * say.
 *
 * `App` used to call `useDailyLogs` and `useDiary` itself. Both reach the
 * database SDK, so that one import put it on the path of every signed-out
 * visit. This component is loaded lazily, once there is a user, and renders
 * nothing: it is a place for the hooks to run.
 *
 * Which child each listener is for is still the shell's decision
 * (`wantsDailyLogs` / `wantsDiaryEntries`); this only carries it out.
 */
export default function ChildRecordsBridge({
  user,
  logsChildId,
  diaryChildId,
  onRecords,
}: ChildRecordsBridgeProps) {
  const logs = useDailyLogs(logsChildId, user);
  const diary = useDiary(diaryChildId, user);

  const records = useMemo<ChildRecords>(
    () => ({
      dailyLogs: {
        childId: logsChildId,
        data: logs.logs,
        loading: logs.loading,
        error: logs.error,
      },
      diaryEntries: {
        childId: diaryChildId,
        data: diary.entries,
        loading: diary.loading,
        error: diary.error,
      },
    }),
    [
      logsChildId,
      logs.logs,
      logs.loading,
      logs.error,
      diaryChildId,
      diary.entries,
      diary.loading,
      diary.error,
    ],
  );

  // Before paint, so a page is not drawn from the previous report first.
  useLayoutEffect(() => {
    onRecords(records);
  }, [onRecords, records]);

  return null;
}
