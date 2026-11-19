/**
 * What a parent is told when a feedback or venue report could not be sent.
 *
 * These live apart from `feedbackSubmit.ts` because the form imports them, and
 * the form is on public pages: importing them from the module that writes to
 * the database would put the database SDK on every signed-out visit.
 */

/** The rules refused the write: one feedback a minute per account. */
export const FEEDBACK_THROTTLED_MESSAGE = '剛剛才送出過一次，請稍後再試';
/** Any other failure (offline, an SDK exception); the SDK's text means nothing to a parent. */
export const FEEDBACK_FAILED_MESSAGE = '提交失敗，請稍後再試';
