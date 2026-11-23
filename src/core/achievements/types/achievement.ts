import type { AnalyticsResult } from "../../analytics";

export type AchievementCategory = "general" | "activity" | "text" | "participants";

export interface Achievement {
  id: string;
  category: AchievementCategory;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface AchievementDefinition {
  id: string;
  category: AchievementCategory;
  title: string;
  description: string;
  icon: string;
  condition: (analytics: AnalyticsResult) => boolean;
}
