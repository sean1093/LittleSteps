import { WikiCategory } from '../../types';
import {
  babyWikiArticles,
  babyWikiVerifiedOn,
  wikiCategoryLabels,
  babyWikiCategoryColors,
} from '../data/babyWiki';
import { SUITE_NOTES } from '../../common/landing/SuiteNote';
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
          常見嬰幼兒照顧問題與處理方式，逐篇對照國民健康署、疾病管制署與美國兒科學會的衛教資料
        </p>

        <WikiBrowser
          articles={babyWikiArticles}
          categoryLabels={wikiCategoryLabels}
          categoryColors={babyWikiCategoryColors}
          categoryOrder={CATEGORY_ORDER}
          categoryIcons={CATEGORY_ICONS}
          searchPlaceholder="搜尋症狀、關鍵字..."
          theme={SERVICE_THEME.littlesteps}
          crossSearchService="littlesteps"
          wikiPage="littlesteps/baby-wiki"
          verifiedNote={`內容查證於 ${babyWikiVerifiedOn}，對照國民健康署、疾病管制署與美國兒科學會的衛教資料。`}
          suiteNote={SUITE_NOTES.babyWiki}
        />
      </div>
    </div>
  );
}
