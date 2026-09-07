import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ModalFrame from './ModalFrame';
import { tap } from '../ui/motion';
import { SERVICE_THEME } from '../ui/serviceTheme';
import { FEEDBACK_FAILED_MESSAGE } from '../hooks/useFirebaseChildren';
import { FEEDBACK_CONTENT_LIMIT } from '../feedbackLimits';
import {
  CLAIM_NOT_PUBLISHED,
  VENUE_REPORT_NOTE_LIMIT,
  VENUE_REPORT_REASONS,
  VENUE_REPORT_REASON_LABEL,
  venueReportContent,
  venueReportTitle,
  type VenueReportReason,
  type VenueReportTarget,
} from '../venueReport';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  /**
   * `shareContact` 是家長在這張表單上勾的那一格：勾了才把 Google 帳號名稱與
   * email 一起送出去。它跟著送出走，而不是由外面的元件自己決定。
   */
  onSubmit: (title: string, content: string, shareContact: boolean) => Promise<void>;
  userName: string;
  /**
   * 有值時這張表單是「場館資料回報」：家長勾一個原因就送得出去，名稱、編號、
   * 地址與畫面上的說法由這裡自己附上，不必再從剛剛看的那一頁抄一次。
   *
   * `signIn` 有值本身就代表現在沒有人登入。回報要寫進資料庫，而規則要求
   * auth != null，所以那時給的是「登入是為了什麼」加一顆登入鍵——而不是把
   * 入口整個藏起來，那正是家長站在鎖著的哺乳室門口卻無話可說的原因。
   */
  venue?: {
    target: VenueReportTarget;
    signIn: (() => void) | null;
  };
}

const FIELD =
  'w-full min-h-tap px-4 py-3 rounded-2xl border border-ink/15 text-ink placeholder-ink-faint transition-colors';

const LABEL = 'block text-sm font-medium text-ink mb-1';

/**
 * 一併送出的脈絡，先讓家長看過。
 *
 * 回報自動附資料和「背著家長送資料」只差在有沒有攤開來給他看，而這一段就是
 * 攤開來的那一份。
 */
function ReportContext({ target }: { target: VenueReportTarget }) {
  return (
    <div className={`mb-4 p-4 rounded-2xl ${SERVICE_THEME[target.service].tint}`}>
      <p className="text-sm font-semibold text-ink">{target.name}</p>
      <p className="text-xs text-ink-muted mt-0.5">{target.address}</p>
      <dl className="mt-2 space-y-1">
        {target.claims.map((claim) => (
          <div key={claim.label} className="flex gap-2 text-xs">
            <dt className="text-ink-faint shrink-0">{claim.label}</dt>
            <dd className="text-ink-muted">{claim.value ?? CLAIM_NOT_PUBLISHED}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs text-ink-faint mt-2 leading-relaxed">
        以上會跟著回報一起送出，你不用再打一次。
      </p>
    </div>
  );
}

/**
 * 要不要留下聯絡方式，家長自己決定。
 *
 * 場館回報早就把「一併送出的資料」攤在 ReportContext 裡給家長看過了，家長自己
 * 的身分卻沒有——名稱與 email 一直是每一則回報自動附上的。在別的頁面寫一段
 * 公告不等於在這一頁問過，所以問就問在送出鍵的上面。
 *
 * 預設不勾是刻意的：這樣一來有些回報就回不了信，但想要回信的家長會勾，而沒勾
 * 的那些人本來也不預期一個副業專案會寄 email 給他。
 *
 * 整列都是這個 checkbox 的標籤：label 包著 input 又指名它的 id，所以在手機上
 * 點到那一句話也算點到框，而不是只有那顆 20px 的方塊按得到。
 */
function ContactOptIn({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled: boolean;
}) {
  return (
    <label
      htmlFor="feedbackShareContact"
      className="card flex items-center gap-3 min-h-tap cursor-pointer"
    >
      <input
        id="feedbackShareContact"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="w-5 h-5 shrink-0 accent-primary-dark"
      />
      <span className="text-sm text-ink leading-relaxed">
        讓我們可以回覆你（會附上你的 Google 帳號名稱與 email）
      </span>
    </label>
  );
}

/**
 * 未登入時講清楚登入是為了什麼。
 *
 * 和被擋下的私人頁面同一個作法：留在原地把理由講出來，而不是讓入口消失或把
 * 家長帶去別的網址。
 *
 * 第二句要跟著 ContactOptIn 一起讀：那一格預設不勾，所以「登入」與「回報會
 * 帶上你的名字」是兩件事。這裡原本寫「登入只會用到你的 Google 名稱與信箱」，
 * 在還沒問過的時候聽起來就像回報一定會附上它們——而站在鎖著的哺乳室門口的
 * 家長，看到的最後一句話就是這一句。
 */
function SignInNotice({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div>
      <p className="text-sm text-ink leading-relaxed">
        回報會連同這一處的名稱與編號存進我們的收件匣，所以要先登入：我們才知道同一筆資料有幾個人回報過，也才擋得掉大量灌水的假回報。
      </p>
      <p className="text-sm text-ink-muted leading-relaxed mt-2">
        登入只是用來認得這個帳號，不會建立寶寶檔案，也不會碰到任何孩子的資料。要不要一起送出你的 Google 帳號名稱與 email，登入後在送出前自己勾。
      </p>
      <button type="button" onClick={onSignIn} className="btn-primary w-full mt-4">
        用 Google 登入
      </button>
    </div>
  );
}

/**
 * 五個原因，單選。
 *
 * 選項的顏色跟著這份資料所屬的服務走：`.chip-on` 的珊瑚紅是 LittleSteps 的
 * 品牌色，而這張表單是從哺乳室地圖或親子好去處的畫面上開出來的。做法比照
 * RoomSearch 的篩選籤。
 */
function ReasonChips({
  service,
  value,
  onPick,
  disabled,
}: {
  service: VenueReportTarget['service'];
  value: VenueReportReason | null;
  onPick: (reason: VenueReportReason | null) => void;
  disabled: boolean;
}) {
  const theme = SERVICE_THEME[service];

  return (
    <fieldset disabled={disabled}>
      <legend className={LABEL}>
        哪裡不對？ <span className="text-primary-dark">*</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {VENUE_REPORT_REASONS.map((id) => {
          const isOn = value === id;
          return (
            <motion.button
              key={id}
              type="button"
              whileTap={tap}
              // 再按一次同一顆就是取消，和篩選籤一致。
              onClick={() => onPick(isOn ? null : id)}
              aria-pressed={isOn}
              className={`chip ${
                isOn ? `chip-on ${theme.fill} ${theme.fillText} border-transparent` : ''
              }`}
            >
              {VENUE_REPORT_REASON_LABEL[id]}
            </motion.button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function FeedbackModal({
  isOpen,
  onClose,
  onSubmit,
  userName,
  venue,
}: FeedbackModalProps) {
  const [title, setTitle] = useState('');
  // 家長打的那段自由文字：一般回報的必填內容，場館回報的選填補充。
  const [content, setContent] = useState('');
  const [reason, setReason] = useState<VenueReportReason | null>(null);
  // 每次開表單都從「不勾」重新問一次，和其他欄位一樣。
  const [shareContact, setShareContact] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setContent('');
      setReason(null);
      setShareContact(false);
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const validateForm = (): string | null => {
    if (venue) {
      // 補充說明是選填的：勾一個原因就是一份完整的回報。
      return reason === null ? '請選一個原因' : null;
    }
    if (!title.trim()) {
      return '請輸入標題';
    }
    if (!content.trim()) {
      return '請輸入回報內容';
    }
    if (content.trim().length < 10) {
      return '回報內容至少需要 10 個字';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 場館回報的標題與內容一律由畫面組出來，家長只出原因與（選填的）那一句話。
      const payload =
        venue && reason !== null
          ? {
              title: venueReportTitle(venue.target, reason),
              content: venueReportContent(venue.target, reason, content),
            }
          : { title: title.trim(), content: content.trim() };
      await onSubmit(payload.title, payload.content, shareContact);
      onClose();
    } catch (err: unknown) {
      console.error('提交回報失敗:', err);
      setError(err instanceof Error ? err.message : FEEDBACK_FAILED_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contentLength = content.trim().length;
  const isContentValid = contentLength >= 10;

  const errorBox = error && (
    <div className="bg-primary-light border border-primary/40 rounded-2xl p-3">
      <p className="text-sm text-primary-dark">{error}</p>
    </div>
  );

  return (
    <ModalFrame
      isOpen={isOpen}
      onClose={onClose}
      title={venue ? '這裡的資訊不對？' : '問題回報'}
      closeDisabled={isSubmitting}
    >
      {venue ? (
        <>
          <ReportContext target={venue.target} />

          {venue.signIn ? (
            <SignInNotice onSignIn={venue.signIn} />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <ReasonChips
                service={venue.target.service}
                value={reason}
                onPick={(picked) => {
                  setReason(picked);
                  setError(null);
                }}
                disabled={isSubmitting}
              />

              <div>
                <label htmlFor="venueReportNote" className={LABEL}>
                  還想補一句？（選填）
                </label>
                <textarea
                  id="venueReportNote"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={`${FIELD} resize-none`}
                  rows={3}
                  placeholder="例如：門鎖著、已經改成儲藏室、搬到三樓了"
                  maxLength={VENUE_REPORT_NOTE_LIMIT}
                  disabled={isSubmitting}
                />
              </div>

              {errorBox}

              <ContactOptIn
                checked={shareContact}
                onChange={setShareContact}
                disabled={isSubmitting}
              />

              <button
                type="submit"
                disabled={isSubmitting || reason === null}
                className="btn-primary w-full"
              >
                {isSubmitting ? '送出中...' : '送出回報'}
              </button>
            </form>
          )}

          <p className="text-xs text-ink-muted text-center mt-4 leading-relaxed">
            回報會進到我們的收件匣，由人確認後才會改資料，地圖上的內容不會立刻變動。
          </p>
        </>
      ) : (
        <>
          <div className="mb-4 p-4 bg-secondary-soft rounded-2xl">
            <p className="text-sm text-ink">
              感謝 <span className="font-semibold">{userName}</span> 的回報！
            </p>
            <p className="text-xs text-ink-muted mt-1">
              您的意見將幫助我們改善 LittleSteps
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="feedbackTitle" className={LABEL}>
                標題 <span className="text-primary-dark">*</span>
              </label>
              <input
                id="feedbackTitle"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setError(null);
                }}
                className={FIELD}
                placeholder="簡短描述您的問題或建議"
                maxLength={100}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="feedbackContent" className={LABEL}>
                詳細內容 <span className="text-primary-dark">*</span>
              </label>
              <textarea
                id="feedbackContent"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setError(null);
                }}
                className={`${FIELD} resize-none`}
                rows={6}
                placeholder="請詳細描述您遇到的問題或想要的功能（至少 10 個字）"
                // 上限就是規則的上限。超過規則的長度回來的是和一分鐘限制同一個
                // PERMISSION_DENIED，表單擋在這裡，那個拒絕才只剩一個意思。
                maxLength={FEEDBACK_CONTENT_LIMIT}
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center mt-1">
                <p className={`text-xs ${
                  contentLength === 0 ? 'text-ink-faint' :
                  isContentValid ? 'text-mint-dark' : 'text-butter-dark'
                }`}>
                  {contentLength === 0 ? '請輸入至少 10 個字' :
                   isContentValid ? `已輸入 ${contentLength} 個字` :
                   `還需要 ${10 - contentLength} 個字`}
                </p>
                <p className="text-xs text-ink-faint">
                  {contentLength}/{FEEDBACK_CONTENT_LIMIT}
                </p>
              </div>
            </div>

            {errorBox}

            <ContactOptIn
              checked={shareContact}
              onChange={setShareContact}
              disabled={isSubmitting}
            />

            <button
              type="submit"
              disabled={isSubmitting || !isContentValid || !title.trim()}
              className="btn-primary w-full"
            >
              {isSubmitting ? '送出中...' : '送出回報'}
            </button>
          </form>

          <p className="text-xs text-ink-muted text-center mt-4">
            我們會仔細閱讀每一則回報，謝謝您的支持
          </p>
        </>
      )}
    </ModalFrame>
  );
}
