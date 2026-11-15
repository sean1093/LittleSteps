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

  if (status === 'stalled') {
    return (
      <EmptyState
        theme={theme}
        title="連不上伺服器"
        description="目前似乎沒有網路連線。寶寶的紀錄存在雲端，連上網路後就會出現。"
        action={{ label: '重新載入', onClick: reload }}
      />
    );
  }

  return (
    <EmptyState
      theme={theme}
      title="讀不到紀錄"
      description="這不代表沒有紀錄，只是這次沒有讀到。請確認網路後重新載入。"
      action={{ label: '重新載入', onClick: reload }}
    />
  );
}
