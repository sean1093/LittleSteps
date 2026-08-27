import { WikiCategory } from '../../types';
import { babyWikiArticles, wikiCategoryLabels, babyWikiCategoryColors } from '../data/babyWiki';
import WikiBrowser from '../../common/components/wiki/WikiBrowser';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';

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

export default function BabyWikiPage() {
  return (
    <div className="screen">
      <div className="screen-body">
        <p className="text-sm text-ink-muted mb-4">
          常見嬰幼兒照顧問題與處理方式，參考台灣兒科醫學指引
        </p>

        <WikiBrowser
          articles={babyWikiArticles}
          categoryLabels={wikiCategoryLabels}
          categoryColors={babyWikiCategoryColors}
          categoryOrder={CATEGORY_ORDER}
          categoryIcons={CATEGORY_ICONS}
          searchPlaceholder="搜尋症狀、關鍵字..."
          theme={SERVICE_THEME.littlesteps}
        />
      </div>
    </div>
  );
}
