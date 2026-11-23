import type { AchievementDefinition } from "../types";

export const participantAchievements: AchievementDefinition[] = [
  {
    id: "conversation_starter",
    category: "participants",
    title: "Conversation Starter",
    description: "Started at least 50 conversations.",
    icon: "message-square",
    condition: analytics =>
      analytics.participants.some(participant => participant.startedConversations >= 50)
  },
  {
    id: "chatterbox",
    category: "participants",
    title: "Chatterbox",
    description: "Sent at least 1,000 messages.",
    icon: "messages-square",
    condition: analytics =>
      analytics.participants.some(participant => participant.messageCount >= 1_000)
  },
  {
    id: "the_typist",
    category: "participants",
    title: "The Typist",
    description: "Wrote at least 10,000 words.",
    icon: "keyboard",
    condition: analytics =>
      analytics.participants.some(participant => participant.wordCount >= 10_000)
  },
  {
    id: "emoji_master",
    category: "participants",
    title: "Emoji Master",
    description: "Used at least 500 emojis.",
    icon: "smile",
    condition: analytics =>
      analytics.participants.some(participant => participant.emojiCount >= 500)
  },
  {
    id: "night_person",
    category: "participants",
    title: "Night Person",
    description: "Sent at least 100 messages at night.",
    icon: "moon-star",
    condition: analytics =>
      analytics.participants.some(participant => participant.nightMessages >= 100)
  }
];
