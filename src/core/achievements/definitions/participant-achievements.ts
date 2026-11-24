import type { ParticipantAchievementDefinition } from "../types";

export const participantAchievements: ParticipantAchievementDefinition[] = [
  {
    id: "conversation_starter",
    scope: "participant",
    category: "activity",
    title: "Conversation Starter",
    description: "Started at least 50 conversations.",
    icon: "message-square",
    condition: participant => participant.startedConversations >= 50
  },
  {
    id: "chatterbox",
    scope: "participant",
    category: "activity",
    title: "Chatterbox",
    description: "Sent at least 1,000 messages.",
    icon: "messages-square",
    condition: participant => participant.messageCount >= 1_000
  },
  {
    id: "night_owl",
    scope: "participant",
    category: "activity",
    title: "Night Owl",
    description: "Sent at least 100 messages at night.",
    icon: "moon",
    condition: participant => participant.nightMessages >= 100
  },
  {
    id: "the_typist",
    scope: "participant",
    category: "text",
    title: "The Typist",
    description: "Wrote at least 10,000 words.",
    icon: "keyboard",
    condition: participant => participant.wordCount >= 10_000
  },
  {
    id: "emoji_master",
    scope: "participant",
    category: "text",
    title: "Emoji Master",
    description: "Used at least 500 emojis.",
    icon: "smile",
    condition: participant => participant.emojiCount >= 500
  }
];
