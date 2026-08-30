import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, LogOut, Share2, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useOptionalChildStore } from '../contexts/ChildStoreContext';
import { isPregnancyProfile } from '../pregnancy';
import type { ChildProfile, Gender } from '../../types';
import { backdrop, sheet } from '../ui/motion';
import { goTo } from '../navigate';
import { SERVICE_THEME, type ServiceId } from '../ui/serviceTheme';
import { CHILD_LIMIT_MESSAGE, MAX_CHILDREN } from '../childLimits';
import AddChildModal from './AddChildModal';
import ShareChildUuidModal from './ShareChildUuidModal';
import { confirmDelete } from '../ui/confirmDelete';

/**
 * 讀不讀某個孩子的資料，決定這個服務該不該顯示切換器。
 *
 * 親子館名冊與哺乳室地圖不看孩子，在那裡放一個切換器等於暗示它會改變畫面
 * 上的東西——不會。帳號本身則到處都要能碰到，登出不該只在某一個服務裡有。
 */
const SERVICE_USES_CHILD: Record<ServiceId, boolean> = {
  littlesteps: true,
  littlebloom: true,
  littleexplorer: true,
  littleouting: false,
  babyoasis: false,
};

interface AccountSheetProps {
  service: ServiceId;
  onClose: () => void;
}

export default function AccountSheet({ service, onClose }: AccountSheetProps) {
  const { user, signInWithGoogle, signOut } = useAuth();
  const store = useOptionalChildStore();
  const childProfiles = store?.childProfiles ?? [];
  const currentChildId = store?.currentChildId ?? null;

  const [showChildModal, setShowChildModal] = useState(false);
  const [editingChild, setEditingChild] = useState<ChildProfile | null>(null);
  const [sharingChild, setSharingChild] = useState<ChildProfile | null>(null);

  const theme = SERVICE_THEME[service];
  const showChildren = SERVICE_USES_CHILD[service] && store !== null;
  const canAddChild = childProfiles.length < MAX_CHILDREN;

  const handleSaveChild = (
    name: string,
    birthday: string,
    gender?: Gender,
    _isPregnancy?: boolean,
    dueDate?: string,
  ) => {
    if (editingChild) {
      store?.updateChild(editingChild.id, name, birthday, gender);
    } else {
      store?.addChild(name, birthday, gender, dueDate);
    }
    setEditingChild(null);
  };

  const handleDeleteChild = (id: string) => {
    if (confirmDelete('這位寶寶的資料', '所有里程碑進度')) {
      store?.deleteChild(id);
      setShowChildModal(false);
      setEditingChild(null);
    }
  };

  // 登出後網址會留在原本的路由上。若那是需要登入的頁面，畫面會換成該服務的
  // 介紹頁——看起來像是「登出後被丟進某個服務」，而不是回到五個服務的入口。
  // 所以登出一併把路由帶回服務集合首頁。
  const handleSignOut = async () => {
    await signOut();
    goTo('home');
    onClose();
  };

  return (
    <>
      <motion.div {...backdrop} onClick={onClose} className="fixed inset-0 bg-ink/40 z-40" />
      <motion.div
        {...sheet}
        className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-ink/10 px-4 py-3 flex items-center justify-between gap-3">
          <h2>帳號與寶寶</h2>
          <button onClick={onClose} aria-label="關閉" className="btn-icon bg-ink/5 hover:bg-ink/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {user ? (
            <div className="card flex items-center gap-3">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt=""
                  className="w-12 h-12 rounded-full shrink-0"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink truncate">{user.displayName || '家長'}</p>
                <p className="text-sm text-ink-muted truncate">{user.email}</p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="btn-icon"
                title="登出"
                aria-label="登出"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="card">
              <p className="font-medium text-ink mb-1">登入後才能跨裝置同步</p>
              <p className="text-sm text-ink-muted mb-4">
                知識內容不需登入就能看；記錄下來的成長、疫苗與日誌需要帳號才存得住。
              </p>
              <button type="button" onClick={signInWithGoogle} className="btn-primary w-full">
                使用 Google 登入
              </button>
            </div>
          )}

          {showChildren && user && (
            <div>
              <h3 className="mb-2">我的寶寶</h3>
              <div className="space-y-2">
                {childProfiles.length === 0 && (
                  <p className="text-sm text-ink-muted px-1">還沒有寶寶資料</p>
                )}

                {childProfiles.map((child) => (
                  <div
                    key={child.id}
                    className={`flex items-center gap-1 p-2 pl-3 rounded-2xl transition-colors ${
                      child.id === currentChildId ? theme.tint : 'bg-ink/5 hover:bg-ink/10'
                    }`}
                  >
                    <button
                      type="button"
                      className="flex-1 min-w-0 flex items-center gap-2 min-h-tap text-left"
                      onClick={() => store?.setCurrentChild(child.id)}
                      aria-current={child.id === currentChildId ? 'true' : undefined}
                    >
                      <span className="font-medium text-ink truncate">{child.name}</span>
                      {/* 孕期檔案的 birthday 是預產期，外觀上與寶寶檔案無異；
                          沒有這個標記，切換器裡兩者分不出來。 */}
                      {isPregnancyProfile(child) && (
                        <span className="tag bg-bloom-dusty-rose/15 text-bloom-dusty-rose-ink shrink-0">
                          孕期
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSharingChild(child)}
                      className="btn-icon"
                      title="分享寶寶資料給家人"
                      aria-label={`分享 ${child.name} 的資料給家人`}
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingChild(child);
                        setShowChildModal(true);
                      }}
                      className="btn-icon"
                      title="編輯寶寶資料"
                      aria-label={`編輯 ${child.name} 的資料`}
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setEditingChild(null);
                    setShowChildModal(true);
                  }}
                  disabled={!canAddChild}
                  className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  title={canAddChild ? '新增寶寶' : CHILD_LIMIT_MESSAGE}
                >
                  新增寶寶
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <AddChildModal
        isOpen={showChildModal}
        onClose={() => {
          setShowChildModal(false);
          setEditingChild(null);
        }}
        onSave={handleSaveChild}
        onJoin={store?.joinChild}
        editingChild={editingChild}
        onDelete={editingChild ? () => handleDeleteChild(editingChild.id) : undefined}
        modes={['create', 'join']}
        accent={theme.fill}
      />

      <ShareChildUuidModal
        isOpen={sharingChild !== null}
        onClose={() => setSharingChild(null)}
        child={sharingChild}
      />
    </>
  );
}
