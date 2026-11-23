import type { AchievementDefinition } from "../types";

export const activityAchievements: AchievementDefinition[] = [
  {
    id: "night_owl",
    category: "activity",
    title: "Night Owl",
    description: "Sent at least 100 messages between midnight and 6 AM.",
    icon: "moon",
    condition: analytics =>
      analytics.participants.reduce((total, participant) => total + participant.nightMessages, 0) >=
      100
  },
  {
    id: "never_silent",
    category: "activity",
    title: "Never Silent",
    description: "Sent at least 10 consecutive messages.",
    icon: "messages-square",
    condition: analytics => analytics.conversations.maxConsecutiveMessages >= 10
  },
  {
    id: "speed_demon",
    category: "activity",
    title: "Speed Demon",
    description: "Replied in less than one minute.",
    icon: "zap",
    condition: analytics =>
      analytics.conversations.fastestResponseTimeMs > 0 &&
      analytics.conversations.fastestResponseTimeMs < 60_000
  },
  {
    id: "streak_master",
    category: "activity",
    title: "Streak Master",
    description: "Were active for at least 30 consecutive days.",
    icon: "flame",
    condition: analytics => analytics.activity.longestActiveStreak >= 30
  }
];
