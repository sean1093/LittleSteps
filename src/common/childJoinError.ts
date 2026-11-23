/**
 * A join that failed for a reason the parent can act on.
 *
 * The join path knows exactly why it failed — the code does not exist, the
 * family has not opened it, the parent is already a member — and used to say
 * so in the error's message. The form then threw the message away and showed
 * "check your network" for all of them, so a grandmother whose daughter had
 * switched sharing off was sent to look at her Wi-Fi.
 *
 * A class of its own, rather than reading `error.message` off any `Error`:
 * the same path can also reject with a raw SDK error, whose message is not
 * written for a parent. Only these are shown as they are.
 *
 * It lives outside the hooks so the form can import it without pulling the
 * database SDK onto a public page (see `lib/database.ts`).
 */
export class ChildJoinError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChildJoinError';
  }
}
