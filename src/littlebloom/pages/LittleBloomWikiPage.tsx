import { motion } from 'framer-motion';
import type { PregnancyWikiCategory } from '../../types';
import {
  pregnancyWikiArticles,
  pregnancyWikiCategoryLabels,
  pregnancyWikiCategoryColors,
} from '../data/wiki';
import WikiBrowser from '../../common/components/wiki/WikiBrowser';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { fadeInUp } from '../../common/ui/motion';
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

export default function LittleBloomWikiPage() {
  return (
    <BloomShell title="孕期知識庫" subtitle="常見孕期疑問與處理方式" backTo="littlebloom">
      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <WikiBrowser
          articles={pregnancyWikiArticles}
          categoryLabels={pregnancyWikiCategoryLabels}
          categoryColors={pregnancyWikiCategoryColors}
          categoryOrder={CATEGORY_ORDER}
          categoryIcons={CATEGORY_ICONS}
          searchPlaceholder="搜尋孕期症狀、關鍵字..."
          theme={SERVICE_THEME.littlebloom}
          crossSearchService="littlebloom"
        />
      </motion.div>
    </BloomShell>
  );
}
