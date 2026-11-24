import type { AnalyticsResult, ParticipantStats } from "../../analytics";

export type AchievementCategory = "general" | "activity" | "text";

export interface Achievement {
  id: string;
  category: AchievementCategory;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  holderIds: string[];
}

interface AchievementDefinitionBase {
  id: string;
  category: AchievementCategory;
  title: string;
  description: string;
  icon: string;
}

export interface ChatAchievementDefinition extends AchievementDefinitionBase {
  scope: "chat";
  condition: (analytics: AnalyticsResult) => boolean;
}

export interface ParticipantAchievementDefinition extends AchievementDefinitionBase {
  scope: "participant";
  condition: (participant: ParticipantStats, participants: ParticipantStats[]) => boolean;
}

export type AchievementDefinition = ChatAchievementDefinition | ParticipantAchievementDefinition;
