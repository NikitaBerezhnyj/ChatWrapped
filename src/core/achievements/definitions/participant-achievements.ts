import type { ParticipantStats } from "../../analytics";
import type { ParticipantAchievementDefinition } from "../types";

const LEAD_RATIO = 1.5;
const MINIMUM_REPLIES = 50;

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

function leadsByLowest(
  selectValue: (participant: ParticipantStats) => number,
  hasEnoughData: (participant: ParticipantStats) => boolean
): ParticipantAchievementDefinition["condition"] {
  return (participant, participants) => {
    const candidates = participants.filter(hasEnoughData);

    if (candidates.length < 2 || !candidates.includes(participant)) {
      return false;
    }

    const runnerUp = Math.min(...candidates.filter(item => item !== participant).map(selectValue));

    return selectValue(participant) > 0 && selectValue(participant) * LEAD_RATIO <= runnerUp;
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
  },
  {
    id: "quick_draw",
    scope: "participant",
    category: "activity",
    title: "Quick Draw",
    description: "Replied 1.5× faster than any other participant.",
    icon: "zap",
    condition: leadsByLowest(
      participant => participant.medianResponseTimeMs,
      participant => participant.responseCount >= MINIMUM_REPLIES
    )
  },
  {
    id: "monologist",
    scope: "participant",
    category: "activity",
    title: "Monologist",
    description: "Sent 50% more messages in a row than any other participant.",
    icon: "mic",
    condition: leadsBy(participant => participant.maxConsecutiveMessages, 20)
  },
  {
    id: "last_word",
    scope: "participant",
    category: "activity",
    title: "Last Word",
    description: "Ended 50% more conversations than any other participant.",
    icon: "flag",
    condition: leadsBy(participant => participant.endedConversations, 50)
  }
];
