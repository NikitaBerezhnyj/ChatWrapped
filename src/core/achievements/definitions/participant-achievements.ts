import type { ParticipantStats } from "../../analytics";
import type { ParticipantAchievementDefinition } from "../types";

const LEAD_RATIO = 1.5;

function leadsBy(
  selectValue: (participant: ParticipantStats) => number,
  minimumTotal: number
): ParticipantAchievementDefinition["condition"] {
  return (participant, participants) => {
    if (participants.length < 2) {
      return false;
    }

    const total = participants.reduce((sum, item) => sum + selectValue(item), 0);

    if (total < minimumTotal) {
      return false;
    }

    const runnerUp = Math.max(
      ...participants.filter(item => item !== participant).map(selectValue)
    );

    return selectValue(participant) > 0 && selectValue(participant) >= runnerUp * LEAD_RATIO;
  };
}

export const participantAchievements: ParticipantAchievementDefinition[] = [
  {
    id: "chatterbox",
    scope: "participant",
    category: "activity",
    title: "Chatterbox",
    description: "Sent 50% more messages than any other participant.",
    icon: "messages-square",
    condition: leadsBy(participant => participant.messageCount, 1_000)
  },
  {
    id: "conversation_starter",
    scope: "participant",
    category: "activity",
    title: "Conversation Starter",
    description: "Started 50% more conversations than any other participant.",
    icon: "message-square",
    condition: leadsBy(participant => participant.startedConversations, 50)
  },
  {
    id: "night_owl",
    scope: "participant",
    category: "activity",
    title: "Night Owl",
    description: "Sent 50% more night messages than any other participant.",
    icon: "moon",
    condition: leadsBy(participant => participant.nightMessages, 100)
  },
  {
    id: "the_typist",
    scope: "participant",
    category: "text",
    title: "The Typist",
    description: "Wrote 50% more words than any other participant.",
    icon: "keyboard",
    condition: leadsBy(participant => participant.wordCount, 10_000)
  },
  {
    id: "emoji_master",
    scope: "participant",
    category: "text",
    title: "Emoji Master",
    description: "Used 50% more emojis than any other participant.",
    icon: "smile",
    condition: leadsBy(participant => participant.emojiCount, 200)
  }
];
