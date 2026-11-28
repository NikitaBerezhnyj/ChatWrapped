import type { NormalizedMessage } from "../../../normalization";
import { splitConversations } from "../../conversations";
import { getMedian } from "../../statistics";
import { getZonedDate } from "../../time";
import type { ParticipantStats } from "../../types";
import { getDistinctiveWords } from "../text/distinctive-words";

const DISTINCTIVE_WORDS_LIMIT = 5;

type SenderMessage = NormalizedMessage & { senderId: string };

interface ParticipantAccumulator {
  messageCount: number;
  wordCount: number;
  characterCount: number;
  nightMessages: number;
  emojiCount: number;
  startedConversations: number;
  endedConversations: number;
  maxConsecutiveMessages: number;
  responseTimes: number[];
}

function hasSender(message: NormalizedMessage): message is SenderMessage {
  return message.senderId !== null;
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
    startedConversations: 0,
    endedConversations: 0,
    maxConsecutiveMessages: 0,
    responseTimes: []
  };
}

function updateConversationStats(
  messages: SenderMessage[],
  participants: Map<string, ParticipantAccumulator>
): void {
  const first = messages[0];
  const last = messages[messages.length - 1];

  participants.get(first.senderId)!.startedConversations += 1;

  if (messages.length >= 2) {
    participants.get(last.senderId)!.endedConversations += 1;
  }

  let previous: SenderMessage | null = null;
  let streak = 0;

  for (const message of messages) {
    const accumulator = participants.get(message.senderId)!;

    if (previous && previous.senderId !== message.senderId) {
      accumulator.responseTimes.push(message.timestamp - previous.timestamp);
    }

    streak = previous?.senderId === message.senderId ? streak + 1 : 1;
    accumulator.maxConsecutiveMessages = Math.max(accumulator.maxConsecutiveMessages, streak);

    previous = message;
  }
}

export function analyzeParticipants(
  messages: NormalizedMessage[],
  options: {
    conversationGapThresholdMs: number;
    nightStartHour: number;
    nightEndHour: number;
    timezone: string;
    minimumWordLength: number;
  }
): ParticipantStats[] {
  const senderMessages = messages.filter(hasSender);

  if (senderMessages.length === 0) {
    return [];
  }

  const participants = new Map<string, ParticipantAccumulator>();

  for (const message of senderMessages) {
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

  for (const conversation of splitConversations(
    senderMessages,
    options.conversationGapThresholdMs
  )) {
    updateConversationStats(conversation.messages, participants);
  }

  const totalMessages = [...participants.values()].reduce(
    (total, participant) => total + participant.messageCount,
    0
  );

  const totalWords = [...participants.values()].reduce(
    (total, participant) => total + participant.wordCount,
    0
  );

  const distinctiveWords = getDistinctiveWords(senderMessages, options, DISTINCTIVE_WORDS_LIMIT);

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
      startedConversations: participant.startedConversations,
      endedConversations: participant.endedConversations,
      medianResponseTimeMs: getMedian(participant.responseTimes),
      responseCount: participant.responseTimes.length,
      maxConsecutiveMessages: participant.maxConsecutiveMessages,
      distinctiveWords: distinctiveWords.get(participantId) ?? []
    }))
    .sort((a, b) => {
      if (b.messageCount !== a.messageCount) {
        return b.messageCount - a.messageCount;
      }

      return a.participantId.localeCompare(b.participantId);
    });
}
