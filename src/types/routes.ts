/**
 * Route types for the application
 *
 * Main landing page and four sub-apps:
 * - Home: Main entry point for all apps
 * - LittleSteps: Baby tracking app (0-1y)
 * - LittleBloom: Pregnancy companion app (WIP)
 * - LittleExplorer: Toddler companion app (1-3y)
 * - BabyOasis: Nursing room map (standalone)
 */

export type Page =
  | 'home'
  | 'littlesteps'
  | 'littlesteps/dashboard'
  | 'littlesteps/milestones'
  | 'littlesteps/care-guide'
  | 'littlesteps/vaccine-tracking'
  | 'littlesteps/complementary-food'
  | 'littlesteps/daily-log'
  | 'littlesteps/growth-charts'
  | 'littlesteps/sleep-training'
  | 'littlesteps/sleep-analysis'
  | 'littlesteps/baby-wiki'
  | 'littlesteps/clinic-summary'
  | 'littlesteps/report'
  | 'littlebloom'
  | 'littlebloom/prenatal'
  | 'littlebloom/wiki'
  | 'littleexplorer'
  | 'littleexplorer/reminders'
  | 'littleexplorer/diary'
  | 'littleexplorer/wiki'
  | 'babyoasis';

/**
 * Type for LittleSteps sub-routes only (used by Sidebar)
 */
export type LittleStepsPage =
  | 'littlesteps'
  | 'littlesteps/dashboard'
  | 'littlesteps/milestones'
  | 'littlesteps/care-guide'
  | 'littlesteps/vaccine-tracking'
  | 'littlesteps/complementary-food'
  | 'littlesteps/daily-log'
  | 'littlesteps/growth-charts'
  | 'littlesteps/sleep-training'
  | 'littlesteps/sleep-analysis'
  | 'littlesteps/baby-wiki'
  | 'littlesteps/clinic-summary'
  | 'littlesteps/report';
