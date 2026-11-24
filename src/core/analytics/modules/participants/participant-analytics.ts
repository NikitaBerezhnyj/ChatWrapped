import type { NormalizedMessage } from "../../../normalization";
import { getZonedDate } from "../../time";
import type { ParticipantStats } from "../../types";

interface ParticipantAccumulator {
  messageCount: number;
  wordCount: number;
  characterCount: number;
  nightMessages: number;
  emojiCount: number;
  startedConversations: number;
}

function isNightHour(hour: number, nightStartHour: number, nightEndHour: number): boolean {
  if (nightStartHour < nightEndHour) {
    return hour >= nightStartHour && hour < nightEndHour;
  }

  return hour >= nightStartHour || hour < nightEndHour;
}

function createAccumulator(): ParticipantAccumulator {
  return {
    messageCount: 0,
    wordCount: 0,
    characterCount: 0,
    nightMessages: 0,
    emojiCount: 0,
    startedConversations: 0
  };
}

export function analyzeParticipants(
  messages: NormalizedMessage[],
  options: {
    conversationGapThresholdMs: number;
    nightStartHour: number;
    nightEndHour: number;
    timezone: string;
  }
): ParticipantStats[] {
  if (messages.length === 0) {
    return [];
  }

  const participants = new Map<string, ParticipantAccumulator>();

  for (const message of messages) {
    if (message.senderId === null) {
      continue;
    }

    const accumulator = participants.get(message.senderId) ?? createAccumulator();

    accumulator.messageCount += 1;
    accumulator.wordCount += message.wordCount;
    accumulator.characterCount += message.characterCount;
    accumulator.emojiCount += message.emojis.length;

    const hour = getZonedDate(message.timestamp, options.timezone).getHours();

    if (isNightHour(hour, options.nightStartHour, options.nightEndHour)) {
      accumulator.nightMessages += 1;
    }

    participants.set(message.senderId, accumulator);
  }

  const sortedMessages = [...messages]
    .filter(message => message.senderId !== null)
    .sort((a, b) => a.timestamp - b.timestamp);

  for (let index = 0; index < sortedMessages.length; index += 1) {
    const message = sortedMessages[index];

    const previousMessage = sortedMessages[index - 1];

    const startsConversation =
      index === 0 ||
      message.timestamp - previousMessage.timestamp > options.conversationGapThresholdMs;

    if (startsConversation && message.senderId !== null) {
      const accumulator = participants.get(message.senderId);

      if (accumulator) {
        accumulator.startedConversations += 1;
      }
    }
  }

  const totalMessages = [...participants.values()].reduce(
    (total, participant) => total + participant.messageCount,
    0
  );

  const totalWords = [...participants.values()].reduce(
    (total, participant) => total + participant.wordCount,
    0
  );

  return [...participants.entries()]
    .map(([participantId, participant]) => ({
      participantId,
      messageCount: participant.messageCount,
      messageShare: totalMessages > 0 ? participant.messageCount / totalMessages : 0,
      wordCount: participant.wordCount,
      wordShare: totalWords > 0 ? participant.wordCount / totalWords : 0,
      characterCount: participant.characterCount,
      averageMessageLength:
        participant.messageCount > 0 ? participant.characterCount / participant.messageCount : 0,
      nightMessages: participant.nightMessages,
      emojiCount: participant.emojiCount,
      startedConversations: participant.startedConversations
    }))
    .sort((a, b) => {
      if (b.messageCount !== a.messageCount) {
        return b.messageCount - a.messageCount;
      }

      return a.participantId.localeCompare(b.participantId);
    });
}
