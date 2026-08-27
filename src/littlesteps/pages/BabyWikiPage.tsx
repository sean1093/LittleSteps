import { BookOpen } from 'lucide-react';
import { WikiCategory } from '../../types';
import { babyWikiArticles, wikiCategoryLabels, babyWikiCategoryColors } from '../data/babyWiki';
import WikiBrowser, { WikiTheme } from '../../common/components/wiki/WikiBrowser';

const CATEGORY_ORDER: WikiCategory[] = [
  'skin',
  'oral',
  'motor',
  'digestive',
  'fever',
  'sleep',
  'daily',
];

const CATEGORY_ICONS: Record<WikiCategory, string> = {
  skin: 'Droplets',
  oral: 'Smile',
  motor: 'Footprints',
  digestive: 'Soup',
  fever: 'Thermometer',
  sleep: 'Moon',
  daily: 'Sun',
};

const THEME: WikiTheme = {
  focusRing: 'focus:ring-primary/30',
  chipActive: 'bg-secondary text-white shadow-soft',
  chipInactive: 'bg-white text-gray-600 hover:bg-gray-50',
  mutedText: 'text-gray-500',
};

export default function BabyWikiPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-6">
      <div className="bg-[#E8F4F8]/30 px-4 py-6 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#E8F4F8] flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#7EC8E3]" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">寶寶百科</h2>
        </div>
        <p className="text-sm text-gray-600">
          常見嬰幼兒照顧問題與處理方式，參考台灣兒科醫學指引
        </p>
      </div>

      <div className="px-4">
        <WikiBrowser
          articles={babyWikiArticles}
          categoryLabels={wikiCategoryLabels}
          categoryColors={babyWikiCategoryColors}
          categoryOrder={CATEGORY_ORDER}
          categoryIcons={CATEGORY_ICONS}
          searchPlaceholder="搜尋症狀、關鍵字..."
          theme={THEME}
        />
      </div>
    </div>
  );
}
