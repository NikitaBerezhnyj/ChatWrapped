import { describe, expect, it } from "vitest";
import type { ChatData } from "../models";
import { LocalAnalyticsEngine } from "./local-analytics-engine";

function createChat(overrides: Partial<ChatData> = {}): ChatData {
  return {
    id: "chat-1",
    title: "Test chat",
    type: "private",
    participants: [
      { id: "user-1", name: "Alice" },
      { id: "user-2", name: "Bob" }
    ],
    messages: [
      {
        id: "1",
        senderId: "user-1",
        timestamp: 1_000,
        type: "text",
        text: "Hello there!"
      },
      {
        id: "2",
        senderId: "user-2",
        timestamp: 2_000,
        type: "text",
        text: "Hi Alice!"
      },
      {
        id: "3",
        senderId: "user-1",
        timestamp: 3_000,
        type: "text",
        text: "How are you?"
      }
    ],
    ...overrides
  };
}

describe("LocalAnalyticsEngine", () => {
  const engine = new LocalAnalyticsEngine();

  it("returns all analytics modules", async () => {
    const result = await engine.analyze(createChat());

    expect(result).toHaveProperty("overview");
    expect(result).toHaveProperty("activity");
    expect(result).toHaveProperty("text");
    expect(result).toHaveProperty("participants");
    expect(result).toHaveProperty("conversations");
  });

  it("calculates overview statistics", async () => {
    const result = await engine.analyze(createChat());

    expect(result.overview.totalMessages).toBe(3);
    expect(result.overview.totalWords).toBe(7);
    expect(result.overview.messagesWithText).toBe(3);
  });

  it("calculates participant statistics", async () => {
    const result = await engine.analyze(createChat());

    expect(result.participants).toHaveLength(2);
    expect(result.participants[0].participantId).toBe("user-1");
    expect(result.participants[0].messageCount).toBe(2);
  });

  it("calculates conversation statistics", async () => {
    const result = await engine.analyze(createChat());

    expect(result.conversations.totalConversations).toBe(1);
    expect(result.conversations.medianResponseTimeMs).toBe(1_000);
  });

  it("uses default options when none are provided", async () => {
    const result = await engine.analyze(createChat());

    expect(result.text.mostFrequentWords.length).toBeLessThanOrEqual(10);
  });

  it("allows overriding analysis options", async () => {
    const result = await engine.analyze(createChat(), {
      topWordsLimit: 1
    });

    expect(result.text.mostFrequentWords).toHaveLength(1);
  });

  it("returns valid empty statistics for a chat without messages", async () => {
    const result = await engine.analyze(createChat({ messages: [] }));

    expect(result.overview.totalMessages).toBe(0);
    expect(result.activity.byDay).toEqual([]);
    expect(result.text.mostFrequentWords).toEqual([]);
    expect(result.participants).toEqual([]);
    expect(result.conversations.totalConversations).toBe(0);
  });

  it("supports saved messages", async () => {
    const result = await engine.analyze(
      createChat({
        type: "saved_messages",
        participants: [{ id: "user-1", name: "Alice" }],
        messages: [
          {
            id: "1",
            senderId: "user-1",
            timestamp: 1_000,
            type: "text",
            text: "A personal note"
          }
        ]
      })
    );

    expect(result.overview.totalMessages).toBe(1);
    expect(result.participants).toHaveLength(1);
    expect(result.participants[0].messageCount).toBe(1);
  });

  it("supports messages without a sender", async () => {
    const result = await engine.analyze(
      createChat({
        messages: [
          {
            id: "1",
            senderId: null,
            timestamp: 1_000,
            type: "text",
            text: "Unknown sender"
          }
        ]
      })
    );

    expect(result.overview.totalMessages).toBe(1);
    expect(result.participants).toEqual([]);
    expect(result.conversations.totalConversations).toBe(1);
  });
});
