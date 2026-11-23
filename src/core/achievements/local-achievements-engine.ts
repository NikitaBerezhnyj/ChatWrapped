import type { AnalyticsResult } from "../analytics";
import type { AchievementsEngine } from "./achievements-engine";
import type { Achievement } from "./types";
import { achievementDefinitions } from "./definitions";

export class LocalAchievementsEngine implements AchievementsEngine {
  evaluate(analytics: AnalyticsResult): Achievement[] {
    return achievementDefinitions.map(definition => ({
      id: definition.id,
      category: definition.category,
      title: definition.title,
      description: definition.description,
      icon: definition.icon,
      unlocked: definition.condition(analytics)
    }));
  }
}
