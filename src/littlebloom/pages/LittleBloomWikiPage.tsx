import type { PregnancyWikiCategory } from '../../types';
import {
  pregnancyWikiArticles,
  pregnancyWikiCategoryLabels,
  pregnancyWikiCategoryColors,
} from '../data/wiki';
import WikiBrowser, { WikiTheme } from '../../common/components/wiki/WikiBrowser';
import BloomShell from '../components/BloomShell';

const CATEGORY_ORDER: PregnancyWikiCategory[] = [
  'checkup',
  'symptoms',
  'nutrition',
  'health',
  'lifestyle',
];

const CATEGORY_ICONS: Record<PregnancyWikiCategory, string> = {
  checkup: 'Stethoscope',
  symptoms: 'Activity',
  nutrition: 'Apple',
  health: 'Heart',
  lifestyle: 'Sun',
};

const THEME: WikiTheme = {
  focusRing: 'focus:ring-bloom-dusty-rose/40',
  chipActive: 'bg-bloom-dusty-rose text-white shadow-soft',
  chipInactive: 'bg-white text-gray-600 hover:bg-bloom-blush/40',
  mutedText: 'text-gray-500',
};

export default function LittleBloomWikiPage() {
  return (
    <BloomShell title="孕期知識庫" subtitle="常見孕期疑問與處理方式" backTo="#/littlebloom">
      <WikiBrowser
        articles={pregnancyWikiArticles}
        categoryLabels={pregnancyWikiCategoryLabels}
        categoryColors={pregnancyWikiCategoryColors}
        categoryOrder={CATEGORY_ORDER}
        categoryIcons={CATEGORY_ICONS}
        searchPlaceholder="搜尋孕期症狀、關鍵字..."
        theme={THEME}
      />
    </BloomShell>
  );
}
