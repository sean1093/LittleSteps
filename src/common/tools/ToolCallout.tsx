import { useOptionalAuth } from '../../contexts/AuthContext';
import { goTo } from '../navigate';
import { ROUTE_PATH, type Page } from '../../types/routes';

/**
 * The line under a calculator's result that says what signing in adds.
 *
 * A calculator answers one question with nothing stored. The tracker behind
 * sign-in answers the same question and then remembers the answer — which
 * doses are done, which checkups are booked — so this is the one place where
 * "sign in" follows from what the parent just did rather than interrupting it.
 *
 * A signed-in parent already has the tracker; they get a plain link to it.
 * Reads auth through the optional hook only, so it is safe on a public page.
 */
export default function ToolCallout({
  title,
  body,
  cta,
  signedInCta,
  page,
}: {
  title: string;
  body: string;
  cta: string;
  /** What the link says to a parent who is already signed in. */
  signedInCta: string;
  page: Page;
}) {
  const user = useOptionalAuth()?.user ?? null;

  return (
    <a
      href={ROUTE_PATH[page]}
      onClick={(event) => {
        event.preventDefault();
        goTo(page);
      }}
      className="card-tap block"
    >
      <span className="block font-semibold text-ink">{title}</span>
      {!user && (
        <span className="block text-sm text-ink-muted leading-relaxed mt-0.5">{body}</span>
      )}
      <span className="block text-sm font-medium text-ink underline underline-offset-2 mt-1">
        {user ? signedInCta : cta}
      </span>
    </a>
  );
}
