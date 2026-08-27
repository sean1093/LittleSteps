import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { ChildProfile, ToddlerWikiArticle, ToddlerWikiCategory } from '../../types';
import { calculateAge } from '../../common/utils/dateHelpers';
import { calculateAgeDisplay } from '../../common/utils/summaryCalculator';
import WikiBrowser from '../../common/components/wiki/WikiBrowser';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { fadeInUp } from '../../common/ui/motion';
import { relevanceTag, sortByRelevance } from '../utils/wikiRelevance';
import {
  toddlerWikiArticles,
  toddlerWikiCategoryColors,
  toddlerWikiCategoryLabels,
} from '../data/toddlerWiki';
import ExplorerShell from '../components/ExplorerShell';

const CATEGORY_ORDER: ToddlerWikiCategory[] = [
  'toilet',
  'language',
  'emotion',
  'eating',
  'sleep',
  'safety',
  'health',
  'preschool',
];

const CATEGORY_ICONS: Record<ToddlerWikiCategory, string> = {
  toilet: 'Bath',
  language: 'MessageCircle',
  emotion: 'Sparkles',
  eating: 'Soup',
  sleep: 'Moon',
  safety: 'ShieldCheck',
  health: 'Thermometer',
  preschool: 'Backpack',
};

interface ToddlerWikiPageProps {
  currentChild?: ChildProfile | null;
  reminderBadge?: number;
}

/**
 * 幼兒百科：疑難雜症查詢。
 *
 * 不做年齡守門：查資料不需要先有孩子。
 *
 * 有孩子時依月齡重排順序——44 篇依分類排列時，「孩子現在 1 歲 2 個月該先看
 * 什麼」沒有答案：如廁訓練排在最前面但那是 18 個月後的事，而這個年紀真正該
 * 看的戒奶瓶、學步期安全散在中段。只重排、不篩選，搜尋仍然找得到每一篇。
 */
export default function ToddlerWikiPage({ currentChild, reminderBadge }: ToddlerWikiPageProps) {
  const ageMonths = currentChild ? calculateAge(currentChild.birthday) : null;

  const articles = useMemo(
    () =>
      ageMonths === null
        ? toddlerWikiArticles
        : sortByRelevance(toddlerWikiArticles, ageMonths),
    [ageMonths],
  );

  const tagFor = useMemo(
    () =>
      ageMonths === null
        ? undefined
        : (article: ToddlerWikiArticle) => relevanceTag(article, ageMonths),
    [ageMonths],
  );

  return (
    <ExplorerShell
      active="wiki"
      childName={currentChild?.name}
      ageLabel={currentChild ? calculateAgeDisplay(currentChild.birthday) : undefined}
      reminderBadge={reminderBadge}
    >
      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        {/* 順序變了就要說明為什麼，否則家長會以為清單是亂的。
            孩子的名字與月齡 header 已經顯示，這裡不重複。 */}
        {ageMonths !== null && (
          <p className="text-sm text-explorer-bark/70 mb-4">
            這個年紀最用得上的排在前面。
          </p>
        )}
        <WikiBrowser
          articles={articles}
          categoryLabels={toddlerWikiCategoryLabels}
          categoryColors={toddlerWikiCategoryColors}
          categoryOrder={CATEGORY_ORDER}
          categoryIcons={CATEGORY_ICONS}
          searchPlaceholder="搜尋幼兒照顧問題"
          articleTag={tagFor}
          theme={SERVICE_THEME.littleexplorer}
        />
      </motion.div>
    </ExplorerShell>
  );
}
