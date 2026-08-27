import { motion } from 'framer-motion';
import type { ChildProfile, ToddlerWikiCategory } from '../../types';
import { calculateAgeDisplay } from '../../common/utils/summaryCalculator';
import WikiBrowser from '../../common/components/wiki/WikiBrowser';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { fadeInUp } from '../../common/ui/motion';
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
 */
export default function ToddlerWikiPage({ currentChild, reminderBadge }: ToddlerWikiPageProps) {
  return (
    <ExplorerShell
      active="wiki"
      childName={currentChild?.name}
      ageLabel={currentChild ? calculateAgeDisplay(currentChild.birthday) : undefined}
      reminderBadge={reminderBadge}
    >
      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <WikiBrowser
          articles={toddlerWikiArticles}
          categoryLabels={toddlerWikiCategoryLabels}
          categoryColors={toddlerWikiCategoryColors}
          categoryOrder={CATEGORY_ORDER}
          categoryIcons={CATEGORY_ICONS}
          searchPlaceholder="搜尋幼兒照顧問題"
          theme={SERVICE_THEME.littleexplorer}
        />
      </motion.div>
    </ExplorerShell>
  );
}
