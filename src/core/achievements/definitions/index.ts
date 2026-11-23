import { activityAchievements } from "./activity-achievements";
import { generalAchievements } from "./general-achievements";
import { participantAchievements } from "./participant-achievements";
import { textAchievements } from "./text-achievements";

export const achievementDefinitions = [
  ...generalAchievements,
  ...activityAchievements,
  ...textAchievements,
  ...participantAchievements
];
