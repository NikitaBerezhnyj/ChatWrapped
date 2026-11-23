import type { AnalyticsResult } from "../analytics";
import type { Achievement } from "./types";

export interface AchievementsEngine {
  evaluate(analytics: AnalyticsResult): Achievement[];
}
