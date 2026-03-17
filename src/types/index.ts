export interface Milestone {
  id: string;
  monthRange: "0-2" | "3-4" | "5-6" | "7-9" | "10-12" | "12+";
  category: "physical" | "motor" | "cognitive" | "feeding";
  title: string;
  summary: string;
  details: string;
  tips: string[];
}

export interface MilestoneProgress {
  [milestoneId: string]: boolean;
}

export type MonthRange = "0-2" | "3-4" | "5-6" | "7-9" | "10-12" | "12+";
export type Category = "physical" | "motor" | "cognitive" | "feeding" | "all";

// Care Guidelines Types
export interface GeneralSafetyItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface MonthlyCareGuide {
  month: number;
  title: string;
  category: "physiological" | "feeding" | "safety";
  highlights: string[];
}
