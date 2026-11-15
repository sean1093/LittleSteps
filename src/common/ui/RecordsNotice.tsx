import EmptyState from './EmptyState';
import LoadingBar from './LoadingBar';
import type { ServiceTheme } from './serviceTheme';
import type { RecordsStatus } from '../recordsStatus';

interface RecordsNoticeProps {
  /** Any status but `ready`; a page renders its own content for that one. */
  status: Exclude<RecordsStatus, 'ready'>;
  theme: ServiceTheme;
}

const reload = () => window.location.reload();

/**
 * What a page shows in place of content computed from a child's records while
 * those records are not there to compute from. One component, so the four
 * pages that read App's copy say the same thing in the same words.
 */
export default function RecordsNotice({ status, theme }: RecordsNoticeProps) {
  if (status === 'loading') {
    return (
      <div className="flex justify-center py-16">
        <LoadingBar />
      </div>
    );
  }

  // Both notices replace a `role="status"` bar that announced "loading". With
  // no live region of their own, a screen-reader user would hear that and then
  // nothing at all.
  if (status === 'stalled') {
    return (
      <div role="alert">
        <EmptyState
          theme={theme}
          title="連不上伺服器"
          description="目前似乎沒有網路連線。寶寶的紀錄存在雲端，連上網路後就會出現。"
          action={{ label: '重新載入', onClick: reload }}
        />
      </div>
    );
  }

  // The copy does not mention the network: Realtime Database only cancels a
  // listener when the read is refused, never on a disconnect, so the usual
  // cause is a membership that was taken back.
  return (
    <div role="alert">
      <EmptyState
        theme={theme}
        title="讀不到紀錄"
        description="這不代表沒有紀錄，只是這次沒有讀到。請重新載入；如果還是讀不到，可能是這位寶寶的共享已經被取消。"
        action={{ label: '重新載入', onClick: reload }}
      />
    </div>
  );
}
