/**
 * Route types for the application
 *
 * Main landing page and three sub-apps:
 * - Home: Main entry point for all apps
 * - LittleSteps: Baby tracking app (existing features)
 * - LittleBloom: Pregnancy companion app (WIP)
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
  | 'littlebloom'
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
  | 'littlesteps/sleep-analysis';
