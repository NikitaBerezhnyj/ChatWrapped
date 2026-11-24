import type { ChatAchievementDefinition } from "../types";

export const chatAchievements: ChatAchievementDefinition[] = [
  {
    id: "marathon",
    scope: "chat",
    category: "general",
    title: "Marathon",
    description: "Exchanged 1,000 or more messages.",
    icon: "trophy",
    condition: analytics => analytics.overview.totalMessages >= 1_000
  },
  {
    id: "century",
    scope: "chat",
    category: "general",
    title: "Century",
    description: "Active on at least 100 different days.",
    icon: "calendar-days",
    condition: analytics => analytics.overview.activeDays >= 100
  },
  {
    id: "long_distance",
    scope: "chat",
    category: "general",
    title: "Long Distance",
    description: "Kept the conversation going for more than a year.",
    icon: "calendar-range",
    condition: analytics => analytics.overview.durationMs >= 365 * 24 * 60 * 60 * 1_000
  },
  {
    id: "streak_master",
    scope: "chat",
    category: "activity",
    title: "Streak Master",
    description: "Active for at least 30 days in a row.",
    icon: "flame",
    condition: analytics => analytics.activity.longestActiveStreak >= 30
  },
  {
    id: "never_silent",
    scope: "chat",
    category: "activity",
    title: "Never Silent",
    description: "Someone sent at least 10 messages in a row.",
    icon: "message-circle",
    condition: analytics => analytics.conversations.maxConsecutiveMessages >= 10
  },
  {
    id: "speed_demon",
    scope: "chat",
    category: "activity",
    title: "Speed Demon",
    description: "A reply came in less than a minute.",
    icon: "zap",
    condition: analytics =>
      analytics.conversations.fastestResponseTimeMs > 0 &&
      analytics.conversations.fastestResponseTimeMs < 60_000
  },
  {
    id: "wordsmith",
    scope: "chat",
    category: "text",
    title: "Wordsmith",
    description: "Exchanged at least 10,000 words.",
    icon: "book-text",
    condition: analytics => analytics.overview.totalWords >= 10_000
  },
  {
    id: "the_novelist",
    scope: "chat",
    category: "text",
    title: "The Novelist",
    description: "A single message of 1,000 characters or more.",
    icon: "book-open",
    condition: analytics => (analytics.text.longestMessage?.characterCount ?? 0) >= 1_000
  }
];
