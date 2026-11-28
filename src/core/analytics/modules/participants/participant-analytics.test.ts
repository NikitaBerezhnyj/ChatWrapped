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
  nightEndHour: 6,
  timezone: "UTC",
  minimumWordLength: 4
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
        timestamp: Date.parse("2026-01-01T02:00:00Z")
      }),
      createMessage({
        id: "day",
        senderId: "user-1",
        timestamp: Date.parse("2026-01-01T12:00:00Z")
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
        timestamp: Date.parse("2026-01-01T23:00:00Z")
      }),
      createMessage({
        id: "early",
        senderId: "user-1",
        timestamp: Date.parse("2026-01-02T03:00:00Z")
      }),
      createMessage({
        id: "day",
        senderId: "user-1",
        timestamp: Date.parse("2026-01-02T12:00:00Z")
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

  it("counts night messages in the configured timezone", () => {
    const messages = [
      createMessage({ senderId: "user-1", timestamp: Date.parse("2026-01-01T22:30:00Z") })
    ];

    const utc = analyzeParticipants(messages, defaultOptions);
    const kyiv = analyzeParticipants(messages, { ...defaultOptions, timezone: "Europe/Kyiv" });

    expect(utc[0].nightMessages).toBe(0);
    expect(kyiv[0].nightMessages).toBe(1);
  });
});

describe("replies, streaks and endings", () => {
  const minute = 60_000;
  const hour = 60 * minute;

  it("calculates the median response time per participant", () => {
    const messages = [
      createMessage({ id: "1", senderId: "user-1", timestamp: 0 }),
      createMessage({ id: "2", senderId: "user-2", timestamp: 1 * minute }),
      createMessage({ id: "3", senderId: "user-1", timestamp: 3 * minute }),
      createMessage({ id: "4", senderId: "user-2", timestamp: 4 * minute }),
      createMessage({ id: "5", senderId: "user-1", timestamp: 14 * minute }),
      createMessage({ id: "6", senderId: "user-2", timestamp: 24 * minute })
    ];

    const result = analyzeParticipants(messages, defaultOptions);

    const user1 = result.find(item => item.participantId === "user-1");
    const user2 = result.find(item => item.participantId === "user-2");

    expect(user1?.medianResponseTimeMs).toBe(6 * minute);
    expect(user1?.responseCount).toBe(2);
    expect(user2?.medianResponseTimeMs).toBe(1 * minute);
    expect(user2?.responseCount).toBe(3);
  });

  it("measures a reply from the last message of the other participant", () => {
    const messages = [
      createMessage({ id: "1", senderId: "user-1", timestamp: 0 }),
      createMessage({ id: "2", senderId: "user-1", timestamp: 1 * minute }),
      createMessage({ id: "3", senderId: "user-2", timestamp: 2 * minute })
    ];

    const result = analyzeParticipants(messages, defaultOptions);

    expect(result.find(item => item.participantId === "user-2")?.medianResponseTimeMs).toBe(
      1 * minute
    );
    expect(result.find(item => item.participantId === "user-1")?.responseCount).toBe(0);
    expect(result.find(item => item.participantId === "user-1")?.medianResponseTimeMs).toBe(0);
  });

  it("does not count a reply across conversations", () => {
    const messages = [
      createMessage({ id: "1", senderId: "user-1", timestamp: 0 }),
      createMessage({
        id: "2",
        senderId: "user-2",
        timestamp: defaultOptions.conversationGapThresholdMs + 1
      })
    ];

    const result = analyzeParticipants(messages, defaultOptions);

    expect(result.every(item => item.responseCount === 0)).toBe(true);
  });

  it("finds the longest streak of messages in a row", () => {
    const messages = [
      createMessage({ id: "1", senderId: "user-1", timestamp: 0 }),
      createMessage({ id: "2", senderId: "user-1", timestamp: 1 * minute }),
      createMessage({ id: "3", senderId: "user-1", timestamp: 2 * minute }),
      createMessage({ id: "4", senderId: "user-2", timestamp: 3 * minute }),
      createMessage({ id: "5", senderId: "user-1", timestamp: 4 * minute }),
      createMessage({ id: "6", senderId: "user-1", timestamp: 5 * minute })
    ];

    const result = analyzeParticipants(messages, defaultOptions);

    expect(result.find(item => item.participantId === "user-1")?.maxConsecutiveMessages).toBe(3);
    expect(result.find(item => item.participantId === "user-2")?.maxConsecutiveMessages).toBe(1);
  });

  it("does not continue a streak across conversations", () => {
    const gap = defaultOptions.conversationGapThresholdMs;

    const messages = [
      createMessage({ id: "1", senderId: "user-1", timestamp: 0 }),
      createMessage({ id: "2", senderId: "user-1", timestamp: 1 * minute }),
      createMessage({ id: "3", senderId: "user-1", timestamp: gap + 2 * minute }),
      createMessage({ id: "4", senderId: "user-1", timestamp: gap + 3 * minute })
    ];

    const result = analyzeParticipants(messages, defaultOptions);

    expect(result[0].maxConsecutiveMessages).toBe(2);
  });

  it("counts conversations ended by each participant", () => {
    const first = 0;
    const second = 10 * hour;
    const third = 20 * hour;

    const messages = [
      createMessage({ id: "1", senderId: "user-1", timestamp: first }),
      createMessage({ id: "2", senderId: "user-2", timestamp: first + minute }),
      createMessage({ id: "3", senderId: "user-1", timestamp: first + 2 * minute }),
      createMessage({ id: "4", senderId: "user-2", timestamp: second }),
      createMessage({ id: "5", senderId: "user-1", timestamp: second + minute }),
      createMessage({ id: "6", senderId: "user-2", timestamp: second + 2 * minute }),
      createMessage({ id: "7", senderId: "user-1", timestamp: third })
    ];

    const result = analyzeParticipants(messages, defaultOptions);

    expect(result.find(item => item.participantId === "user-1")?.endedConversations).toBe(1);
    expect(result.find(item => item.participantId === "user-2")?.endedConversations).toBe(1);
  });
});
