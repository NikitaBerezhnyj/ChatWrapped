import type { NormalizedMessage } from "../../../normalization";
import type { ConversationStats } from "../../types";
import type { AnalysisOptions } from "../../types";

interface Conversation {
  messages: NormalizedMessage[];
  startTimestamp: number;
  endTimestamp: number;
}

function splitConversations(messages: NormalizedMessage[], thresholdMs: number): Conversation[] {
  if (messages.length === 0) {
    return [];
  }

  const sortedMessages = [...messages].sort((a, b) => a.timestamp - b.timestamp);

  const conversations: Conversation[] = [];
  let currentMessages: NormalizedMessage[] = [sortedMessages[0]];

  for (let index = 1; index < sortedMessages.length; index += 1) {
    const message = sortedMessages[index];
    const previousMessage = sortedMessages[index - 1];

    const gap = message.timestamp - previousMessage.timestamp;

    if (gap > thresholdMs) {
      conversations.push({
        messages: currentMessages,
        startTimestamp: currentMessages[0].timestamp,
        endTimestamp: currentMessages[currentMessages.length - 1].timestamp
      });

      currentMessages = [message];
      continue;
    }

    currentMessages.push(message);
  }

  conversations.push({
    messages: currentMessages,
    startTimestamp: currentMessages[0].timestamp,
    endTimestamp: currentMessages[currentMessages.length - 1].timestamp
  });

  return conversations;
}

function getResponseTimes(conversations: Conversation[]): number[] {
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

function getMaxConsecutiveMessages(conversations: Conversation[]): number {
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
      averageResponseTimeMs: 0,
      fastestResponseTimeMs: 0,
      longestResponseTimeMs: 0,
      maxConsecutiveMessages: 0
    };
  }

  const durations = conversations.map(
    conversation => conversation.endTimestamp - conversation.startTimestamp
  );

  const responseTimes = getResponseTimes(conversations);

  const totalDuration = durations.reduce((total, duration) => total + duration, 0);

  const totalResponseTime = responseTimes.reduce((total, responseTime) => total + responseTime, 0);

  return {
    totalConversations: conversations.length,
    averageDurationMs: totalDuration / conversations.length,
    longestDurationMs: Math.max(...durations),
    averageResponseTimeMs: responseTimes.length > 0 ? totalResponseTime / responseTimes.length : 0,
    fastestResponseTimeMs: responseTimes.length > 0 ? Math.min(...responseTimes) : 0,
    longestResponseTimeMs: responseTimes.length > 0 ? Math.max(...responseTimes) : 0,
    maxConsecutiveMessages: getMaxConsecutiveMessages(conversations)
  };
}
