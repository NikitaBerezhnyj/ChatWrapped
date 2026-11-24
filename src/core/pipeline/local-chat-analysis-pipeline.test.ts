import { describe, expect, it } from "vitest";
import type { ChatData } from "../models";
import { LocalChatAnalysisPipeline } from "./local-chat-analysis-pipeline";

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

describe("LocalChatAnalysisPipeline", () => {
  const pipeline = new LocalChatAnalysisPipeline();

  it("returns analytics and achievements", async () => {
    const result = await pipeline.analyze(createChat());

    expect(result).toHaveProperty("analytics");
    expect(result).toHaveProperty("achievements");
  });

  it("returns correct overview statistics", async () => {
    const result = await pipeline.analyze(createChat());

    expect(result.analytics.overview.totalMessages).toBe(3);
    expect(result.analytics.overview.totalWords).toBe(7);
  });

  it("evaluates achievements using analytics results", async () => {
    const result = await pipeline.analyze(createChat());

    const speedDemon = result.achievements.find(achievement => achievement.id === "speed_demon");

    expect(speedDemon?.unlocked).toBe(true);
  });

  it("passes analysis options to the analytics engine", async () => {
    const result = await pipeline.analyze(createChat(), {
      topWordsLimit: 1
    });

    expect(result.analytics.text.mostFrequentWords).toHaveLength(1);
  });

  it("returns empty statistics and locked achievements for an empty chat", async () => {
    const result = await pipeline.analyze(createChat({ messages: [] }));

    expect(result.analytics.overview.totalMessages).toBe(0);
    expect(result.analytics.participants).toEqual([]);
    expect(result.analytics.conversations.totalConversations).toBe(0);

    expect(result.achievements.every(achievement => !achievement.unlocked)).toBe(true);
  });

  it("supports saved messages", async () => {
    const result = await pipeline.analyze(
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

    expect(result.analytics.overview.totalMessages).toBe(1);
    expect(result.analytics.participants).toHaveLength(1);
    expect(result.achievements.every(achievement => !achievement.unlocked)).toBe(true);
  });

  it("does not mutate the original chat", async () => {
    const chat = createChat();
    const originalChat = structuredClone(chat);

    await pipeline.analyze(chat);

    expect(chat).toEqual(originalChat);
  });

  it("returns a new result on every analysis", async () => {
    const chat = createChat();

    const firstResult = await pipeline.analyze(chat);
    const secondResult = await pipeline.analyze(chat);

    expect(firstResult).not.toBe(secondResult);
    expect(firstResult.analytics).not.toBe(secondResult.analytics);
    expect(firstResult.achievements).not.toBe(secondResult.achievements);
  });
});
