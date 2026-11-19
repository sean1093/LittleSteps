import { Component, type ReactNode } from 'react';

interface QuietBoundaryProps {
  /** Names the thing that failed in the console line. */
  scope: string;
  children: ReactNode;
}

/**
 * An error boundary for a part of the tree that draws nothing of its own.
 *
 * The lazy bridges that carry a signed-in parent's data sit beside the page,
 * not inside it, so the page's own `ErrorBoundary` cannot catch them: a bridge
 * whose chunk failed to load (a deploy replaced the hashed file while the tab
 * was open, or the connection dropped) would reach the root boundary and
 * replace the whole app, public pages included, with the error screen.
 *
 * Nothing needs drawing in their place. What they would have reported simply
 * never arrives, the app goes on saying "loading", and the existing stall
 * notice ("cannot reach the server", with a reload button) takes over after
 * its usual wait. Reloading is the cure in both cases, and that notice
 * already offers it.
 */
export default class QuietBoundary extends Component<QuietBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error(`${this.props.scope} failed to load:`, error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
