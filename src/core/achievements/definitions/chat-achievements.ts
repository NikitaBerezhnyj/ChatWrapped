import type { ChatAchievementDefinition } from "../types";

export const chatAchievements: ChatAchievementDefinition[] = [
  {
    id: "marathon",
    scope: "chat",
    category: "general",
    title: "Marathon",
    description: "Exchanged 50,000 or more messages.",
    icon: "trophy",
    condition: analytics => analytics.overview.totalMessages >= 50_000
  },
  {
    id: "long_distance",
    scope: "chat",
    category: "general",
    title: "Long Distance",
    description: "Kept the conversation going for more than 3 years.",
    icon: "calendar-range",
    condition: analytics => analytics.overview.durationMs >= 3 * 365 * 24 * 60 * 60 * 1_000
  },
  {
    id: "streak_master",
    scope: "chat",
    category: "activity",
    title: "Streak Master",
    description: "Messaged on 100 days in a row.",
    icon: "flame",
    condition: analytics => analytics.activity.longestActiveStreak >= 100
  },
  {
    id: "the_novelist",
    scope: "chat",
    category: "text",
    title: "The Novelist",
    description: "A single message of 2,000 characters or more.",
    icon: "book-open",
    condition: analytics => (analytics.text.longestMessage?.characterCount ?? 0) >= 2_000
  }
];
