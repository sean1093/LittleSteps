/**
 * Route types for the application
 *
 * Main landing page and two sub-apps:
 * - Home: Main entry point for both apps
 * - LittleSteps: Baby tracking app (existing features)
 * - LittleBloom: Pregnancy companion app (WIP)
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
