import { useOptionalAuth } from '../../contexts/AuthContext';
import { goTo } from '../navigate';

/**
 * One line at the foot of a public page saying what it is part of.
 *
 * The wikis, the guides and the public tools are the pages search engines
 * index, so they are where most first visits start — and none of them said
 * that a product exists around them. A parent who came for one article on
 * nappy rash left without learning that the same site keeps a vaccine
 * schedule or maps every nursing room in Taiwan.
 *
 * Signed-in parents do not see it: they already know, and every page they use
 * has a way back to the landing page in its header.
 *
 * It reads auth through the optional hook and never touches the child store,
 * so it is safe on a public page's static import path (see BUNDLE-01/02).
 */
export default function SuiteNote() {
  const user = useOptionalAuth()?.user ?? null;
  if (user) return null;

  return (
    <aside aria-label="關於 LittleSteps" className="mt-8">
      <a
        href="/"
        onClick={(event) => {
          event.preventDefault();
          goTo('home');
        }}
        className="card-tap block"
      >
        <span className="block font-semibold text-ink">這一頁是 LittleSteps 的一部分</span>
        <span className="block text-sm text-ink-muted leading-relaxed mt-0.5">
          從懷孕到三歲的產檢、疫苗與成長記錄，加上哺乳室地圖與親子館。
        </span>
        {/* Ink, not the coral brand shade: this sits on the disease radar too,
            whose first rule is that nothing on it reads as an alarm. */}
        <span className="block text-sm font-medium text-ink underline underline-offset-2 mt-1">
          看所有服務
        </span>
      </a>
    </aside>
  );
}
