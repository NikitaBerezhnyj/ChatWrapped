import type { AchievementDefinition } from "../types";

export const textAchievements: AchievementDefinition[] = [
  {
    id: "the_novelist",
    category: "text",
    title: "The Novelist",
    description: "Wrote a message containing at least 1,000 characters.",
    icon: "book-open",
    condition: analytics => (analytics.text.longestMessage?.characterCount ?? 0) >= 1_000
  },
  {
    id: "emoji_addict",
    category: "text",
    title: "Emoji Addict",
    description: "Used at least 100 emojis.",
    icon: "smile",
    condition: analytics =>
      analytics.participants.reduce((total, participant) => total + participant.emojiCount, 0) >=
      100
  },
  {
    id: "wordsmith",
    category: "text",
    title: "Wordsmith",
    description: "Exchanged at least 10,000 words.",
    icon: "book-text",
    condition: analytics => analytics.overview.totalWords >= 10_000
  }
];
