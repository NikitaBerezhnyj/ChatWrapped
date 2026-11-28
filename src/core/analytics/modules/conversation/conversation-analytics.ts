import type { NormalizedMessage } from "../../../normalization";
import { splitConversations, type Conversation } from "../../conversations";
import { getMedian } from "../../statistics";
import type { AnalysisOptions, ConversationStats } from "../../types";

const MINUTE_MS = 60_000;

function getResponseTimes(conversations: Conversation<NormalizedMessage>[]): number[] {
  const responseTimes: number[] = [];

  for (const conversation of conversations) {
    const messagesWithSender = conversation.messages.filter(message => message.senderId !== null);

    for (let index = 1; index < messagesWithSender.length; index += 1) {
      const previousMessage = messagesWithSender[index - 1];
      const currentMessage = messagesWithSender[index];

      if (currentMessage.senderId === previousMessage.senderId) {
        continue;
      }

      responseTimes.push(currentMessage.timestamp - previousMessage.timestamp);
    }
  }

  return responseTimes;
}

function getResponseTimeShares(responseTimes: number[]): ConversationStats["responseTimeShares"] {
  function getShare(fromMs: number, toMs: number): number {
    if (responseTimes.length === 0) {
      return 0;
    }

    const matching = responseTimes.filter(time => time >= fromMs && time < toMs);

    return matching.length / responseTimes.length;
  }

  return {
    underOneMinute: getShare(0, MINUTE_MS),
    oneToFiveMinutes: getShare(MINUTE_MS, 5 * MINUTE_MS),
    fiveToSixtyMinutes: getShare(5 * MINUTE_MS, 60 * MINUTE_MS),
    overOneHour: getShare(60 * MINUTE_MS, Infinity)
  };
}

function getMaxConsecutiveMessages(conversations: Conversation<NormalizedMessage>[]): number {
  let maximum = 0;

  for (const conversation of conversations) {
    let currentSenderId: string | null = null;
    let currentCount = 0;

    for (const message of conversation.messages) {
      if (message.senderId === null) {
        currentSenderId = null;
        currentCount = 0;
        continue;
      }

      if (message.senderId === currentSenderId) {
        currentCount += 1;
      } else {
        currentSenderId = message.senderId;
        currentCount = 1;
      }

      maximum = Math.max(maximum, currentCount);
    }
  }

  return maximum;
}

export function analyzeConversations(
  messages: NormalizedMessage[],
  options: AnalysisOptions
): ConversationStats {
  const conversations = splitConversations(messages, options.conversationGapThresholdMs);

  if (conversations.length === 0) {
    return {
      totalConversations: 0,
      averageDurationMs: 0,
      longestDurationMs: 0,
      medianResponseTimeMs: 0,
      fastestResponseTimeMs: 0,
      longestResponseTimeMs: 0,
      responseTimeShares: getResponseTimeShares([]),
      maxConsecutiveMessages: 0
    };
  }

  const durations = conversations.map(
    conversation => conversation.endTimestamp - conversation.startTimestamp
  );

  const responseTimes = getResponseTimes(conversations);

  const totalDuration = durations.reduce((total, duration) => total + duration, 0);

  return {
    totalConversations: conversations.length,
    averageDurationMs: totalDuration / conversations.length,
    longestDurationMs: durations.reduce((longest, duration) => Math.max(longest, duration)),
    medianResponseTimeMs: getMedian(responseTimes),
    fastestResponseTimeMs:
      responseTimes.length > 0
        ? responseTimes.reduce((fastest, time) => Math.min(fastest, time))
        : 0,
    longestResponseTimeMs:
      responseTimes.length > 0
        ? responseTimes.reduce((longest, time) => Math.max(longest, time))
        : 0,
    responseTimeShares: getResponseTimeShares(responseTimes),
    maxConsecutiveMessages: getMaxConsecutiveMessages(conversations)
  };
}
