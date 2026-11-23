import { describe, expect, it } from "vitest";
import type { ChatData } from "../models";
import { LocalChatAnalysisPipeline } from "../pipeline";
import { LocalPresentationDataBuilder } from "./local-presentation-data-builder";

function createChat(overrides: Partial<ChatData> = {}): ChatData {
  return {
    id: "chat-1",
    title: "Alice and Bob",
    type: "private",
    participants: [
      { id: "user-1", name: "Alice" },
      { id: "user-2", name: "Bob" }
    ],
    messages: [
      {
        id: "1",
        senderId: "user-1",
        timestamp: 3_000,
        type: "text",
        text: "Hello there!"
      },
      {
        id: "2",
        senderId: "user-2",
        timestamp: 1_000,
        type: "text",
        text: "Hi Alice!"
      },
      {
        id: "3",
        senderId: "user-1",
        timestamp: 2_000,
        type: "text",
        text: "How are you?"
      }
    ],
    ...overrides
  };
}

describe("LocalPresentationDataBuilder", () => {
  const builder = new LocalPresentationDataBuilder();
  const pipeline = new LocalChatAnalysisPipeline();

  it("builds all presentation slides", async () => {
    const chat = createChat();
    const analysis = await pipeline.analyze(chat);

    const result = builder.build(chat, analysis);

    expect(result.slides.map(slide => slide.type)).toEqual([
      "cover",
      "overview",
      "activity",
      "participants",
      "text",
      "conversations",
      "achievements"
    ]);
  });

  it("includes the chat title", async () => {
    const chat = createChat();
    const analysis = await pipeline.analyze(chat);

    const result = builder.build(chat, analysis);

    expect(result.chatTitle).toBe("Alice and Bob");
    expect(result.slides[0]).toMatchObject({
      type: "cover",
      chatTitle: "Alice and Bob"
    });
  });

  it("uses the earliest and latest message timestamps", async () => {
    const chat = createChat();
    const analysis = await pipeline.analyze(chat);

    const result = builder.build(chat, analysis);
    const coverSlide = result.slides[0];

    expect(coverSlide).toMatchObject({
      type: "cover",
      period: {
        start: 1_000,
        end: 3_000
      }
    });
  });

  it("maps participant IDs to their names", async () => {
    const chat = createChat();
    const analysis = await pipeline.analyze(chat);

    const result = builder.build(chat, analysis);
    const participantsSlide = result.slides.find(slide => slide.type === "participants");

    expect(participantsSlide?.type).toBe("participants");

    if (participantsSlide?.type !== "participants") {
      throw new Error("Participants slide was not generated");
    }

    expect(participantsSlide.participants).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "user-1",
          name: "Alice"
        }),
        expect.objectContaining({
          id: "user-2",
          name: "Bob"
        })
      ])
    );
  });

  it("uses participant IDs as fallback names", async () => {
    const chat = createChat({
      participants: []
    });
    const analysis = await pipeline.analyze(chat);

    const result = builder.build(chat, analysis);
    const participantsSlide = result.slides.find(slide => slide.type === "participants");

    expect(participantsSlide?.type).toBe("participants");

    if (participantsSlide?.type !== "participants") {
      throw new Error("Participants slide was not generated");
    }

    const participant = participantsSlide.participants.find(item => item.id === "user-1");

    expect(participant?.name).toBe("user-1");
  });

  it("includes all achievements", async () => {
    const chat = createChat();
    const analysis = await pipeline.analyze(chat);

    const result = builder.build(chat, analysis);
    const achievementsSlide = result.slides.find(slide => slide.type === "achievements");

    expect(achievementsSlide?.type).toBe("achievements");

    if (achievementsSlide?.type !== "achievements") {
      throw new Error("Achievements slide was not generated");
    }

    expect(achievementsSlide.achievements).toEqual(analysis.achievements);
  });

  it("handles an empty chat", async () => {
    const chat = createChat({
      messages: [],
      participants: []
    });
    const analysis = await pipeline.analyze(chat);

    const result = builder.build(chat, analysis);
    const coverSlide = result.slides[0];

    expect(coverSlide).toMatchObject({
      type: "cover",
      totalMessages: 0,
      period: {
        start: null,
        end: null
      },
      participants: []
    });
  });

  it("does not mutate the original chat or analysis", async () => {
    const chat = createChat();
    const analysis = await pipeline.analyze(chat);

    const originalChat = structuredClone(chat);
    const originalAnalysis = structuredClone(analysis);

    builder.build(chat, analysis);

    expect(chat).toEqual(originalChat);
    expect(analysis).toEqual(originalAnalysis);
  });

  it("returns a new presentation object on every build", async () => {
    const chat = createChat();
    const analysis = await pipeline.analyze(chat);

    const firstResult = builder.build(chat, analysis);
    const secondResult = builder.build(chat, analysis);

    expect(firstResult).not.toBe(secondResult);
    expect(firstResult.slides).not.toBe(secondResult.slides);
  });
});
