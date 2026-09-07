import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Edit, LogOut, Share2, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useOptionalChildStore } from '../contexts/ChildStoreContext';
import { isPregnancyProfile } from '../pregnancy';
import type { GestationalAge } from '../correctedAge';
import type { ChildProfile, Gender } from '../../types';
import { backdrop, sheet } from '../ui/motion';
import { useDialogA11y } from '../ui/useDialogA11y';
import { goTo } from '../navigate';
import { SERVICE_THEME, type ServiceId } from '../ui/serviceTheme';
import { CHILD_LIMIT_MESSAGE, MAX_CHILDREN } from '../childLimits';
import AddChildModal from './AddChildModal';
import ShareChildUuidModal from './ShareChildUuidModal';
import { confirmDelete } from '../ui/confirmDelete';
import { useToast } from '../ui/toast';
import { CHILD_EXPORT_MIME, buildChildExport, childExportFilename } from '../utils/childExport';
import { downloadFile } from '../utils/download';

/**
 * 讀不讀某個孩子的資料，決定這個服務該不該顯示切換器。
 *
 * 親子館名冊、哺乳室地圖與疫情雷達不看孩子，在那裡放一個切換器等於暗示它會
 * 改變畫面上的東西——不會。帳號本身則到處都要能碰到，登出不該只在某一個服務裡有。
 */
const SERVICE_USES_CHILD: Record<ServiceId, boolean> = {
  littlesteps: true,
  littlebloom: true,
  littleexplorer: true,
  littleouting: false,
  babyoasis: false,
  littleguard: false,
};

interface AccountSheetProps {
  service: ServiceId;
  onClose: () => void;
}

export default function AccountSheet({ service, onClose }: AccountSheetProps) {
  const { user, signInWithGoogle, signOut, deleteAccount } = useAuth();
  const store = useOptionalChildStore();
  const toast = useToast();
  // 只在開著的時候才掛載（AccountButton 用 AnimatePresence 包住），所以固定傳 true。
  const dialogRef = useDialogA11y(true, onClose);
  const childProfiles = store?.childProfiles ?? [];
  const currentChildId = store?.currentChildId ?? null;

  const [showChildModal, setShowChildModal] = useState(false);
  const [editingChild, setEditingChild] = useState<ChildProfile | null>(null);
  // 正在讀哪個孩子的資料。四筆讀取要一點時間，而按鍵在那段時間裡看起來
  // 跟沒按過一樣——再按一次就會下載出第二個一模一樣的檔案。
  const [exportingChildId, setExportingChildId] = useState<string | null>(null);
  // 存 id 而不是 child 物件：切換「開放用代碼加入」之後 store 會送新的 profile
  // 進來，抓著開窗當下那份快照的話，開關會停在資料庫沒有的狀態。
  const [sharingChildId, setSharingChildId] = useState<string | null>(null);
  // 刪除帳號要走網路，而且不能來第二次：沒有這個狀態，連按兩下的第二下會對一個
  // 已經刪掉的使用者再刪一次，只換到一則講不出原因的錯誤。
  const [deleting, setDeleting] = useState(false);

  const theme = SERVICE_THEME[service];
  const showChildren = SERVICE_USES_CHILD[service] && store !== null;
  const canAddChild = childProfiles.length < MAX_CHILDREN;
  const sharingChild = childProfiles.find((profile) => profile.id === sharingChildId) ?? null;

  // 回傳 promise，讓 AddChildModal 等寫入成功才關窗；失敗時它會留著輸入
  // 並顯示原因，而不是安靜地關掉、把打好的名字與生日一起丟掉。
  const handleSaveChild = async (
    name: string,
    birthday: string,
    gender?: Gender,
    _isPregnancy?: boolean,
    dueDate?: string,
    gestationalAge?: GestationalAge,
  ) => {
    if (editingChild) {
      await store?.updateChild(editingChild.id, name, birthday, gender, gestationalAge);
    } else {
      await store?.addChild(name, birthday, gender, dueDate, gestationalAge);
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

  /**
   * 匯出整份紀錄：孩子本體與三份紀錄讀回來，組成一個 JSON 檔下載。
   *
   * 讀完之後就不再 await。iOS Safari 只認得同一個手勢裡發生的 <a download>
   * 點擊，四筆讀取已經花掉一輪；後面再插一個 await，等於把那個點擊推到更遠的
   * 地方，家長按了匯出卻什麼都沒下載。
   *
   * 這個抽屜本來沒有任何出錯的地方可以講話，所以失敗走 toast——不出訊息的話，
   * 按下去毫無反應與「檔案正在準備」在畫面上長得一模一樣。
   */
  const handleExportChild = async (childId: string) => {
    if (!store || exportingChildId) return;
    setExportingChildId(childId);
    try {
      const source = await store.readChildExport(childId);
      downloadFile(
        JSON.stringify(buildChildExport(source), null, 2),
        childExportFilename(source.child.name),
        CHILD_EXPORT_MIME,
      );
    } catch (error) {
      console.error('匯出寶寶資料失敗:', error);
      toast.show('匯出失敗，請稍後再試');
    } finally {
      setExportingChildId(null);
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

  const handleDeleteAccount = async () => {
    if (!store || deleting) return;
    if (!confirmDelete('這個帳號', '你獨有的寶寶資料與所有紀錄')) return;

    setDeleting(true);
    try {
      // 資料先刪、Auth 使用者後刪。反過來的話，使用者一消失就沒有任何身分回得去
      // 清那些節點——孩子的紀錄會留在資料庫裡，誰都讀不到也刪不掉。
      await store.deleteAccountData();
      // 重新驗證、登出與回到入口頁都在 deleteAccount 裡，失敗也由它出訊息。
      // 沒刪成功就把這張表留著：刪除的入口在這裡，而 WebView 那條路要家長
      // 重新登入——登入按鈕也在這張表上。
      if (await deleteAccount()) onClose();
    } catch {
      // 資料那一步沒過，所以 Auth 使用者還在，家長可以再試一次。store 記過 log。
      toast.show('帳號還沒刪掉，請稍後再試');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <motion.div {...backdrop} onClick={onClose} className="fixed inset-0 bg-ink/40 z-40" />
      <motion.div
        {...sheet}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="帳號與寶寶"
        tabIndex={-1}
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

          {/* 已登入的家長想確認資料怎麼被保護時，會來這裡找；未登入的人也
              該在交出帳號之前就看得到。 */}
          <button
            type="button"
            onClick={() => {
              goTo('about');
              onClose();
            }}
            className="btn-ghost w-full justify-between px-4"
          >
            <span className="text-ink">關於資料</span>
            <span className="text-sm text-ink-faint">存在哪裡、誰看得到</span>
          </button>

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
                      onClick={() => setSharingChildId(child.id)}
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
                    <button
                      type="button"
                      onClick={() => handleExportChild(child.id)}
                      disabled={exportingChildId === child.id}
                      className="btn-icon disabled:opacity-50"
                      title="匯出寶寶的完整紀錄"
                      aria-label={`匯出 ${child.name} 的資料`}
                    >
                      <Download className="w-5 h-5" />
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

          {/* 放在整張表的最後，離右上角的登出最遠：兩個動作的後果差得太多，
              擠在一起就會有人誤按。整句文字而不是圖示——這裡沒有任何圖示
              說得比字清楚，而且它不該看起來像一個順手的動作。 */}
          {user && store && (
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="btn-ghost w-full text-primary-dark hover:bg-primary-light disabled:opacity-60"
            >
              {deleting ? '刪除中…' : '刪除帳號'}
            </button>
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

      {store && (
        <ShareChildUuidModal
          isOpen={sharingChild !== null}
          onClose={() => setSharingChildId(null)}
          child={sharingChild}
          revokeOtherMembers={store.revokeOtherMembers}
          setJoinOpen={store.setJoinOpen}
        />
      )}
    </>
  );
}
