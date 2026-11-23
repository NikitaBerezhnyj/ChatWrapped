import { describe, expect, it } from "vitest";
import type { NormalizedMessage } from "../../../normalization";
import { analyzeParticipants } from "./participant-analytics";

function createMessage(overrides: Partial<NormalizedMessage> = {}): NormalizedMessage {
  return {
    id: "1",
    senderId: "user-1",
    timestamp: Date.parse("2026-01-01T12:00:00Z"),
    type: "text",
    originalText: "Hello world",
    normalizedText: "hello world",
    tokens: ["hello", "world"],
    emojis: [],
    wordCount: 2,
    characterCount: 11,
    ...overrides
  };
}

const defaultOptions = {
  conversationGapThresholdMs: 8 * 60 * 60 * 1000,
  nightStartHour: 0,
  nightEndHour: 6
};

describe("analyzeParticipants", () => {
  it("returns empty statistics for empty messages", () => {
    expect(analyzeParticipants([], defaultOptions)).toEqual([]);
  });

  it("calculates message counts", () => {
    const messages = [
      createMessage({
        id: "1",
        senderId: "user-1"
      }),
      createMessage({
        id: "2",
        senderId: "user-1"
      }),
      createMessage({
        id: "3",
        senderId: "user-2"
      })
    ];

    const result = analyzeParticipants(messages, defaultOptions);

    expect(result).toEqual([
      expect.objectContaining({
        participantId: "user-1",
        messageCount: 2
      }),
      expect.objectContaining({
        participantId: "user-2",
        messageCount: 1
      })
    ]);
  });

  it("calculates message shares", () => {
    const messages = [
      createMessage({ id: "1", senderId: "user-1" }),
      createMessage({ id: "2", senderId: "user-1" }),
      createMessage({ id: "3", senderId: "user-2" }),
      createMessage({ id: "4", senderId: "user-2" })
    ];

    const result = analyzeParticipants(messages, defaultOptions);

    expect(result[0].messageShare).toBe(0.5);
    expect(result[1].messageShare).toBe(0.5);
  });

  it("calculates word and character statistics", () => {
    const messages = [
      createMessage({
        id: "1",
        senderId: "user-1",
        wordCount: 4,
        characterCount: 20
      }),
      createMessage({
        id: "2",
        senderId: "user-1",
        wordCount: 2,
        characterCount: 10
      }),
      createMessage({
        id: "3",
        senderId: "user-2",
        wordCount: 3,
        characterCount: 15
      })
    ];

    const result = analyzeParticipants(messages, defaultOptions);

    expect(result[0]).toEqual(
      expect.objectContaining({
        participantId: "user-1",
        wordCount: 6,
        wordShare: 6 / 9,
        characterCount: 30,
        averageMessageLength: 15
      })
    );

    expect(result[1]).toEqual(
      expect.objectContaining({
        participantId: "user-2",
        wordCount: 3,
        wordShare: 3 / 9,
        characterCount: 15,
        averageMessageLength: 15
      })
    );
  });

  it("counts emojis", () => {
    const messages = [
      createMessage({
        id: "1",
        senderId: "user-1",
        emojis: ["😂", "❤️"]
      }),
      createMessage({
        id: "2",
        senderId: "user-1",
        emojis: ["😂"]
      }),
      createMessage({
        id: "3",
        senderId: "user-2",
        emojis: ["🔥"]
      })
    ];

    const result = analyzeParticipants(messages, defaultOptions);

    expect(result[0].emojiCount).toBe(3);
    expect(result[1].emojiCount).toBe(1);
  });

  it("counts night messages", () => {
    const messages = [
      createMessage({
        id: "night",
        senderId: "user-1",
        timestamp: Date.parse("2026-01-01T02:00:00")
      }),
      createMessage({
        id: "day",
        senderId: "user-1",
        timestamp: Date.parse("2026-01-01T12:00:00")
      })
    ];

    const result = analyzeParticipants(messages, defaultOptions);

    expect(result[0].nightMessages).toBe(1);
  });

  it("supports a night range crossing midnight", () => {
    const options = {
      ...defaultOptions,
      nightStartHour: 22,
      nightEndHour: 6
    };

    const messages = [
      createMessage({
        id: "late",
        senderId: "user-1",
        timestamp: Date.parse("2026-01-01T23:00:00")
      }),
      createMessage({
        id: "early",
        senderId: "user-1",
        timestamp: Date.parse("2026-01-02T03:00:00")
      }),
      createMessage({
        id: "day",
        senderId: "user-1",
        timestamp: Date.parse("2026-01-02T12:00:00")
      })
    ];

    const result = analyzeParticipants(messages, options);

    expect(result[0].nightMessages).toBe(2);
  });

  it("counts conversation starters", () => {
    const messages = [
      createMessage({
        id: "1",
        senderId: "user-1",
        timestamp: Date.parse("2026-01-01T10:00:00")
      }),
      createMessage({
        id: "2",
        senderId: "user-2",
        timestamp: Date.parse("2026-01-01T10:05:00")
      }),
      createMessage({
        id: "3",
        senderId: "user-1",
        timestamp: Date.parse("2026-01-02T10:00:00")
      }),
      createMessage({
        id: "4",
        senderId: "user-2",
        timestamp: Date.parse("2026-01-02T10:10:00")
      })
    ];

    const result = analyzeParticipants(messages, defaultOptions);

    expect(result[0]).toEqual(
      expect.objectContaining({
        participantId: "user-1",
        startedConversations: 2
      })
    );

    expect(result[1]).toEqual(
      expect.objectContaining({
        participantId: "user-2",
        startedConversations: 0
      })
    );
  });

  it("does not count a conversation as started after exactly the threshold", () => {
    const messages = [
      createMessage({
        id: "1",
        senderId: "user-1",
        timestamp: 0
      }),
      createMessage({
        id: "2",
        senderId: "user-2",
        timestamp: defaultOptions.conversationGapThresholdMs
      })
    ];

    const result = analyzeParticipants(messages, defaultOptions);

    expect(result[0].startedConversations).toBe(1);
    expect(result[1].startedConversations).toBe(0);
  });

  it("counts a new conversation after the threshold", () => {
    const messages = [
      createMessage({
        id: "1",
        senderId: "user-1",
        timestamp: 0
      }),
      createMessage({
        id: "2",
        senderId: "user-2",
        timestamp: defaultOptions.conversationGapThresholdMs + 1
      })
    ];

    const result = analyzeParticipants(messages, defaultOptions);

    expect(result[0].startedConversations).toBe(1);
    expect(result[1].startedConversations).toBe(1);
  });

  it("ignores messages without a sender", () => {
    const messages = [
      createMessage({
        id: "1",
        senderId: null
      }),
      createMessage({
        id: "2",
        senderId: "user-1"
      })
    ];

    const result = analyzeParticipants(messages, defaultOptions);

    expect(result).toHaveLength(1);
    expect(result[0].participantId).toBe("user-1");
    expect(result[0].messageCount).toBe(1);
  });
});
