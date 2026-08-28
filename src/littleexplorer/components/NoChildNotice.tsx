import { useState } from 'react';
import type { Gender } from '../../types';
import AddChildModal from '../../common/components/AddChildModal';
import EmptyState from '../../common/ui/EmptyState';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';

interface NoChildNoticeProps {
  /** 這一頁在沒有寶寶資料時該說什麼，語氣各頁不同。 */
  description: string;
  onAddChild: (name: string, birthday: string, gender?: Gender) => Promise<void>;
  onJoinChild?: (uuid: string) => Promise<void>;
}

/**
 * LittleExplorer 三個頁面共用的「還沒有寶寶資料」狀態，附自己的新增入口。
 *
 * 這三頁原本都寫「請先到 LittleSteps 新增寶寶」並把家長送走。孩子資料是跨
 * 服務共通的，但要求先進另一個服務才能開始用這一個，是把畫面也綁在一起了。
 * 表單仍然是共用的 AddChildModal，只是換成 LittleExplorer 的配色。
 */
export default function NoChildNotice({
  description,
  onAddChild,
  onJoinChild,
}: NoChildNoticeProps) {
  const theme = SERVICE_THEME.littleexplorer;
  const [open, setOpen] = useState(false);

  return (
    <>
      <EmptyState
        theme={theme}
        title="還沒有寶寶資料"
        description={description}
        action={{ label: '新增寶寶', onClick: () => setOpen(true) }}
      />
      <AddChildModal
        isOpen={open}
        onClose={() => setOpen(false)}
        modes={['create', 'join']}
        accent={theme.fill}
        accentText={theme.fillText}
        onJoin={onJoinChild ? (uuid) => void onJoinChild(uuid).then(() => setOpen(false)) : undefined}
        onSave={(name, birthday, gender) => {
          void onAddChild(name, birthday, gender).then(() => setOpen(false));
        }}
      />
    </>
  );
}
