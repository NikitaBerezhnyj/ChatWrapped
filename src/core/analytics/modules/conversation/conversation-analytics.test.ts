import { describe, expect, it } from "vitest";
import type { NormalizedMessage } from "../../../normalization";
import type { AnalysisOptions } from "../../types";
import { analyzeConversations } from "./conversation-analytics";

function createMessage(overrides: Partial<NormalizedMessage> = {}): NormalizedMessage {
  return {
    id: "1",
    senderId: "user-1",
    timestamp: 0,
    type: "text",
    originalText: "Hello",
    normalizedText: "hello",
    tokens: ["hello"],
    emojis: [],
    wordCount: 1,
    characterCount: 5,
    ...overrides
  };
}

const defaultOptions: AnalysisOptions = {
  conversationGapThresholdMs: 8 * 60 * 60 * 1000,
  nightStartHour: 0,
  nightEndHour: 6,
  topWordsLimit: 10,
  topPhrasesLimit: 10,
  topEmojisLimit: 10,
  minimumWordLength: 2,
  timezone: "Europe/Kyiv"
};

describe("analyzeConversations", () => {
  it("returns empty statistics for empty messages", () => {
    expect(analyzeConversations([], defaultOptions)).toEqual({
      totalConversations: 0,
      averageDurationMs: 0,
      longestDurationMs: 0,
      averageResponseTimeMs: 0,
      fastestResponseTimeMs: 0,
      longestResponseTimeMs: 0,
      maxConsecutiveMessages: 0
    });
  });

  it("counts messages as one conversation when they are within the threshold", () => {
    const messages = [
      createMessage({
        id: "1",
        senderId: "user-1",
        timestamp: 0
      }),
      createMessage({
        id: "2",
        senderId: "user-2",
        timestamp: 60_000
      }),
      createMessage({
        id: "3",
        senderId: "user-1",
        timestamp: 120_000
      })
    ];

    const result = analyzeConversations(messages, defaultOptions);

    expect(result.totalConversations).toBe(1);
    expect(result.averageDurationMs).toBe(120_000);
  });

  it("starts a new conversation when the gap exceeds the threshold", () => {
    const threshold = defaultOptions.conversationGapThresholdMs;

    const messages = [
      createMessage({
        id: "1",
        timestamp: 0
      }),
      createMessage({
        id: "2",
        timestamp: threshold + 1
      })
    ];

    const result = analyzeConversations(messages, defaultOptions);

    expect(result.totalConversations).toBe(2);
    expect(result.averageDurationMs).toBe(0);
    expect(result.longestDurationMs).toBe(0);
  });

  it("does not start a new conversation when the gap equals the threshold", () => {
    const threshold = defaultOptions.conversationGapThresholdMs;

    const messages = [
      createMessage({
        id: "1",
        timestamp: 0
      }),
      createMessage({
        id: "2",
        timestamp: threshold
      })
    ];

    const result = analyzeConversations(messages, defaultOptions);

    expect(result.totalConversations).toBe(1);
    expect(result.averageDurationMs).toBe(threshold);
  });

  it("calculates average and longest conversation duration", () => {
    const threshold = defaultOptions.conversationGapThresholdMs;

    const messages = [
      createMessage({ id: "1", timestamp: 0 }),
      createMessage({ id: "2", timestamp: 60_000 }),
      createMessage({
        id: "3",
        timestamp: threshold + 60_001
      }),
      createMessage({
        id: "4",
        timestamp: threshold + 240_001
      })
    ];

    const result = analyzeConversations(messages, defaultOptions);

    expect(result.totalConversations).toBe(2);
    expect(result.averageDurationMs).toBe(120_000);
    expect(result.longestDurationMs).toBe(180_000);
  });

  it("calculates response times between different participants", () => {
    const messages = [
      createMessage({
        id: "1",
        senderId: "user-1",
        timestamp: 0
      }),
      createMessage({
        id: "2",
        senderId: "user-1",
        timestamp: 60_000
      }),
      createMessage({
        id: "3",
        senderId: "user-2",
        timestamp: 180_000
      }),
      createMessage({
        id: "4",
        senderId: "user-2",
        timestamp: 240_000
      }),
      createMessage({
        id: "5",
        senderId: "user-1",
        timestamp: 300_000
      })
    ];

    const result = analyzeConversations(messages, defaultOptions);

    expect(result.averageResponseTimeMs).toBe(90_000);
    expect(result.fastestResponseTimeMs).toBe(60_000);
    expect(result.longestResponseTimeMs).toBe(120_000);
  });

  it("does not calculate response times across conversations", () => {
    const threshold = defaultOptions.conversationGapThresholdMs;

    const messages = [
      createMessage({
        id: "1",
        senderId: "user-1",
        timestamp: 0
      }),
      createMessage({
        id: "2",
        senderId: "user-2",
        timestamp: threshold + 1
      })
    ];

    const result = analyzeConversations(messages, defaultOptions);

    expect(result.totalConversations).toBe(2);
    expect(result.averageResponseTimeMs).toBe(0);
    expect(result.fastestResponseTimeMs).toBe(0);
    expect(result.longestResponseTimeMs).toBe(0);
  });

  it("ignores messages without a sender when calculating response times", () => {
    const messages = [
      createMessage({
        id: "1",
        senderId: "user-1",
        timestamp: 0
      }),
      createMessage({
        id: "2",
        senderId: null,
        timestamp: 30_000
      }),
      createMessage({
        id: "3",
        senderId: "user-2",
        timestamp: 60_000
      })
    ];

    const result = analyzeConversations(messages, defaultOptions);

    expect(result.averageResponseTimeMs).toBe(60_000);
  });

  it("calculates maximum consecutive messages from one participant", () => {
    const messages = [
      createMessage({
        id: "1",
        senderId: "user-1",
        timestamp: 0
      }),
      createMessage({
        id: "2",
        senderId: "user-1",
        timestamp: 10_000
      }),
      createMessage({
        id: "3",
        senderId: "user-1",
        timestamp: 20_000
      }),
      createMessage({
        id: "4",
        senderId: "user-2",
        timestamp: 30_000
      }),
      createMessage({
        id: "5",
        senderId: "user-2",
        timestamp: 40_000
      })
    ];

    const result = analyzeConversations(messages, defaultOptions);

    expect(result.maxConsecutiveMessages).toBe(3);
  });

  it("resets consecutive message count after a conversation gap", () => {
    const threshold = defaultOptions.conversationGapThresholdMs;

    const messages = [
      createMessage({
        id: "1",
        senderId: "user-1",
        timestamp: 0
      }),
      createMessage({
        id: "2",
        senderId: "user-1",
        timestamp: 10_000
      }),
      createMessage({
        id: "3",
        senderId: "user-1",
        timestamp: threshold + 20_000
      })
    ];

    const result = analyzeConversations(messages, defaultOptions);

    expect(result.maxConsecutiveMessages).toBe(2);
  });

  it("resets consecutive message count after a message without a sender", () => {
    const messages = [
      createMessage({
        id: "1",
        senderId: "user-1",
        timestamp: 0
      }),
      createMessage({
        id: "2",
        senderId: null,
        timestamp: 10_000
      }),
      createMessage({
        id: "3",
        senderId: "user-1",
        timestamp: 20_000
      })
    ];

    const result = analyzeConversations(messages, defaultOptions);

    expect(result.maxConsecutiveMessages).toBe(1);
  });

  it("sorts messages by timestamp before analysis", () => {
    const messages = [
      createMessage({
        id: "2",
        senderId: "user-2",
        timestamp: 60_000
      }),
      createMessage({
        id: "1",
        senderId: "user-1",
        timestamp: 0
      })
    ];

    const result = analyzeConversations(messages, defaultOptions);

    expect(result.averageDurationMs).toBe(60_000);
    expect(result.averageResponseTimeMs).toBe(60_000);
  });
});
