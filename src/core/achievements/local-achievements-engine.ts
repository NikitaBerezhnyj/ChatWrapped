import type { AnalyticsResult } from "../analytics";
import type { AchievementsEngine } from "./achievements-engine";
import { achievementDefinitions } from "./definitions";
import type { Achievement, AchievementDefinition } from "./types";

function evaluateDefinition(
  definition: AchievementDefinition,
  analytics: AnalyticsResult
): Achievement {
  const { id, category, title, description, icon } = definition;

  if (definition.scope === "chat") {
    return {
      id,
      category,
      title,
      description,
      icon,
      unlocked: definition.condition(analytics),
      holderIds: []
    };
  }

  const { condition } = definition;

  const holderIds = analytics.participants
    .filter(participant => condition(participant, analytics.participants))
    .map(participant => participant.participantId);

  return {
    id,
    category,
    title,
    description,
    icon,
    unlocked: holderIds.length > 0,
    holderIds
  };
}

export class LocalAchievementsEngine implements AchievementsEngine {
  evaluate(analytics: AnalyticsResult): Achievement[] {
    return achievementDefinitions.map(definition => evaluateDefinition(definition, analytics));
  }
}
