export interface Conversation<T extends { timestamp: number }> {
  messages: T[];
  startTimestamp: number;
  endTimestamp: number;
}

export function splitConversations<T extends { timestamp: number }>(
  messages: T[],
  thresholdMs: number
): Conversation<T>[] {
  if (messages.length === 0) {
    return [];
  }

  const sortedMessages = [...messages].sort((a, b) => a.timestamp - b.timestamp);

  const conversations: Conversation<T>[] = [];
  let currentMessages: T[] = [sortedMessages[0]];

  for (let index = 1; index < sortedMessages.length; index += 1) {
    const message = sortedMessages[index];
    const previousMessage = sortedMessages[index - 1];

    if (message.timestamp - previousMessage.timestamp > thresholdMs) {
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
