import type { User } from 'firebase/auth';
import AccountButton from '../components/AccountButton';

interface HubHeaderProps {
  user: User | null;
  onSignIn: () => Promise<void>;
}

/**
 * The landing page's brand bar.
 *
 * `App.tsx` renders it outside the shell's `<main>`: a `<header>` nested in
 * `<main>` is not a banner landmark, and the landing page was the one public
 * route with no banner at all.
 *
 * The wordmark is a `<p>`, not a heading and not a link. The page's only `h1`
 * is the hero, and a link to the page you are already on is a tab stop that
 * goes nowhere.
 *
 * Sign-in sits here as well as in the hero so a returning parent does not
 * have to read the pitch again to find it.
 */
export default function HubHeader({ user, onSignIn }: HubHeaderProps) {
  return (
    <header className="max-w-4xl mx-auto px-4 pt-3 flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-lg font-bold text-primary-dark">LittleSteps</p>
        <p className="text-xs text-ink-muted">台灣爸媽的育兒工具</p>
      </div>
      {user ? (
        <AccountButton service="littlesteps" />
      ) : (
        <button type="button" onClick={onSignIn} className="btn-ghost -mr-4">
          登入
        </button>
      )}
    </header>
  );
}
