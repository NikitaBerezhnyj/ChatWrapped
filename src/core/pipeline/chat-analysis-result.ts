import type { AnalyticsResult } from "../analytics";
import type { Achievement } from "../achievements";

export interface ChatAnalysisResult {
  analytics: AnalyticsResult;
  achievements: Achievement[];
}
