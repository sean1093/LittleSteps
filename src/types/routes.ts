/**
 * Route types for the application
 *
 * Two sub-apps:
 * - LittleSteps: Baby tracking app (existing features)
 * - LittleBloom: Pregnancy companion app (WIP)
 */

export type Page =
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
  | 'littlebloom';

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
