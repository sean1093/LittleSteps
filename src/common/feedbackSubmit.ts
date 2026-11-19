import { push, ref, serverTimestamp, update } from 'firebase/database';
import { database } from '../lib/database';
import { FEEDBACK_FAILED_MESSAGE, FEEDBACK_THROTTLED_MESSAGE } from './feedbackMessages';

export interface FeedbackInput {
  title: string;
  content: string;
  userId: string;
  /**
   * Contact details are optional: sent only when the parent ticked "let us
   * reply to you" on the form. Left out entirely otherwise. The rules treat
   * both fields as optional, and an empty string is a string they accept and
   * store, which would be sending without having asked.
   */
  userEmail?: string;
  userName?: string;
}

/**
 * The SDK wraps a rules refusal in an Error whose message starts with
 * PERMISSION_DENIED and whose code is the same. Both are checked: the fake SDK
 * in the tests only sets the message.
 */
const isPermissionDenied = (error: unknown): boolean =>
  error instanceof Error &&
  ((error as { code?: unknown }).code === 'PERMISSION_DENIED' ||
    /permission_denied/i.test(error.message));

/**
 * Write one feedback row for `userId`.
 *
 * The row and `users/$uid/lastFeedbackAt` are one multi-path update and must
 * not be split. `feedbacks` is the only node any signed-in account can write
 * to, and signing in is open to every Google account: without a cap a loop
 * could fill the Spark plan's storage, and since nobody can read feedback,
 * nobody would notice. The rules cap each account at one a minute: the
 * `.write` on `feedbacks` reads its own `lastFeedbackAt` out of the same write
 * (`newData.parent()`), requires it to equal the server's `now`, and
 * `lastFeedbackAt`'s own validate requires it to be 60 s after the last one.
 * The stamp is `serverTimestamp()`; a number the client fills in never equals
 * `now`. Written separately, the feedback row cannot see the stamp and is
 * always refused.
 *
 * A standalone function rather than part of `useFirebaseChildren` so that the
 * report button on the public pages can import it at the moment of sending.
 */
export async function submitFeedbackAs(userId: string, feedback: FeedbackInput): Promise<string> {
  const id = push(ref(database, 'feedbacks')).key;
  if (!id) throw new Error('無法產生紀錄編號');

  const now = new Date().toISOString();
  try {
    await update(ref(database), {
      [`feedbacks/${id}`]: { id, ...feedback, timestamp: now, createdAt: now },
      [`users/${userId}/lastFeedbackAt`]: serverTimestamp(),
    });
  } catch (error) {
    // The form can only cause one kind of refusal: sent within the last
    // minute. `userId` is the caller's own uid and field lengths are capped in
    // the form. Two server-side causes are outside the form's hands (the
    // account disabled while the app is open, or App Check enforcing while
    // reCAPTCHA cannot load); they are PERMISSION_DENIED too, and this says the
    // wrong thing for them.
    throw new Error(
      isPermissionDenied(error) ? FEEDBACK_THROTTLED_MESSAGE : FEEDBACK_FAILED_MESSAGE,
    );
  }

  return id;
}
