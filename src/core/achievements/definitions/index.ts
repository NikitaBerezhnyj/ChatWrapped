import type { AchievementDefinition } from "../types";
import { chatAchievements } from "./chat-achievements";
import { participantAchievements } from "./participant-achievements";

export const achievementDefinitions: AchievementDefinition[] = [
  ...chatAchievements,
  ...participantAchievements
];
