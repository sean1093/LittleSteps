import { Home } from 'lucide-react';

interface HomeButtonProps {
  /** Tailwind classes for the button surface; defaults suit a white header. */
  className?: string;
}

/**
 * Returns to the main landing page, where every sub-app has a card.
 *
 * Each sub-app that renders its own chrome (LittleBloom, LittleExplorer,
 * BabyOasis) must place one of these, otherwise entering the sub-app is a
 * one-way trip: the shared header is suppressed for them, and no sub-app links
 * to any other. Navigates by writing location.hash, so it needs no callback
 * prop — App.tsx already listens for hashchange.
 */
export default function HomeButton({
  className = 'bg-gray-100 hover:bg-gray-200 text-gray-700',
}: HomeButtonProps) {
  return (
    <button
      type="button"
      onClick={() => {
        window.location.hash = '#/';
      }}
      title="回主頁"
      aria-label="回主頁"
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${className}`}
    >
      <Home className="w-5 h-5" />
    </button>
  );
}
