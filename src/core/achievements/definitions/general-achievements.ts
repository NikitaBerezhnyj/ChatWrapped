import type { AchievementDefinition } from "../types";

export const generalAchievements: AchievementDefinition[] = [
  {
    id: "first_contact",
    category: "general",
    title: "First Contact",
    description: "Sent your first message.",
    icon: "message-circle",
    condition: analytics => analytics.overview.totalMessages >= 1
  },
  {
    id: "marathon",
    category: "general",
    title: "Marathon",
    description: "Sent more than 1,000 messages.",
    icon: "messages-square",
    condition: analytics => analytics.overview.totalMessages >= 1_000
  },
  {
    id: "century",
    category: "general",
    title: "Century",
    description: "Were active on at least 100 different days.",
    icon: "calendar-days",
    condition: analytics => analytics.overview.activeDays >= 100
  },
  {
    id: "long_distance",
    category: "general",
    title: "Long Distance",
    description: "Kept the conversation going for more than a year.",
    icon: "calendar-range",
    condition: analytics => analytics.overview.durationMs >= 365 * 24 * 60 * 60 * 1_000
  }
];
