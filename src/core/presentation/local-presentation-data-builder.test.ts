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

  it("always creates a cover and a finale", async () => {
    const chat = createChat({
      messages: [],
      participants: []
    });
    const analysis = await pipeline.analyze(chat);

    const result = builder.build(chat, analysis);

    expect(result.slides[0]).toMatchObject({
      id: "cover",
      type: "cover",
      kind: "cover",
      chatTitle: chat.title,
      totalMessages: 0,
      period: { start: null, end: null }
    });

    expect(result.slides.at(-1)).toMatchObject({
      id: "finale",
      type: "finale",
      kind: "finale",
      chatTitle: chat.title,
      totalMessages: 0,
      totalParticipants: 0
    });
  });

  it("creates overview slides when the corresponding data is available", async () => {
    const chat = createChat();
    const analysis = await pipeline.analyze(chat);

    const result = builder.build(chat, analysis);
    const kinds = result.slides.map(slide => slide.kind);

    expect(kinds).toContain("overview_volume");
    expect(kinds).toContain("overview_duration");
    expect(kinds).toContain("overview_pace");
  });

  it("includes all known participants, even those without messages", async () => {
    const chat = createChat({
      participants: [
        { id: "user-1", name: "Alice" },
        { id: "user-2", name: "Bob" },
        { id: "user-3", name: "Charlie" }
      ]
    });
    const analysis = await pipeline.analyze(chat);

    const result = builder.build(chat, analysis);
    const balanceSlide = result.slides.find(slide => slide.kind === "participants_balance");

    expect(balanceSlide?.kind).toBe("participants_balance");

    if (balanceSlide?.kind !== "participants_balance") {
      throw new Error("Participants balance slide was not generated");
    }

    expect(balanceSlide.participants).toHaveLength(3);
    expect(balanceSlide.participants).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "user-1", name: "Alice" }),
        expect.objectContaining({ id: "user-2", name: "Bob" }),
        expect.objectContaining({
          id: "user-3",
          name: "Charlie",
          messageCount: 0,
          messageShare: 0,
          wordCount: 0
        })
      ])
    );

    expect(result.slides.filter(slide => slide.kind === "participant_profile")).toHaveLength(3);
  });

  it("uses participant IDs as fallback only when participant names are supplied that way", async () => {
    const chat = createChat({
      participants: [{ id: "user-1", name: "user-1" }]
    });
    const analysis = await pipeline.analyze(chat);

    const result = builder.build(chat, analysis);
    const profile = result.slides.find(slide => slide.kind === "participant_profile");

    expect(profile?.kind).toBe("participant_profile");

    if (profile?.kind !== "participant_profile") {
      throw new Error("Participant profile was not generated");
    }

    expect(profile.participant.name).toBe("user-1");
  });

  it("does not include locked achievements", async () => {
    const chat = createChat();
    const analysis = await pipeline.analyze(chat);

    const result = builder.build(chat, analysis);
    const achievementSlides = result.slides.filter(slide => slide.kind === "achievement");
    const recap = result.slides.find(slide => slide.kind === "achievements_recap");

    expect(
      achievementSlides.every(slide =>
        slide.kind === "achievement" ? slide.achievement.unlocked : false
      )
    ).toBe(true);

    if (recap?.kind === "achievements_recap") {
      expect(recap.achievements.every(achievement => achievement.unlocked)).toBe(true);
    }
  });

  it("does not expose the original repeated message text", async () => {
    const chat = createChat();
    const analysis = await pipeline.analyze(chat);

    const result = builder.build(chat, analysis);
    const serialized = JSON.stringify(result);

    expect(serialized).not.toContain("Hello there!");
    expect(serialized).not.toContain("Hi Alice!");
    expect(serialized).not.toContain("How are you?");
  });

  it("creates independent copies of nested analytics data", async () => {
    const chat = createChat();
    const analysis = await pipeline.analyze(chat);

    const originalAnalysis = structuredClone(analysis);
    const result = builder.build(chat, analysis);

    expect(analysis).toEqual(originalAnalysis);

    const rhythmSlide = result.slides.find(slide => slide.kind === "activity_rhythm");

    if (rhythmSlide?.kind === "activity_rhythm") {
      expect(rhythmSlide.byHour).not.toBe(analysis.analytics.activity.byHour);

      if (rhythmSlide.byHour.length > 0) {
        expect(rhythmSlide.byHour[0]).not.toBe(analysis.analytics.activity.byHour[0]);
      }
    }
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

  it("preserves the order of the presentation", async () => {
    const chat = createChat();
    const analysis = await pipeline.analyze(chat);

    const result = builder.build(chat, analysis);
    const kinds = result.slides.map(slide => slide.kind);

    expect(kinds[0]).toBe("cover");
    expect(kinds.at(-1)).toBe("finale");

    expect(kinds.indexOf("overview_volume")).toBeLessThan(kinds.indexOf("activity_peak"));

    expect(kinds.indexOf("activity_peak")).toBeLessThan(kinds.indexOf("participants_balance"));

    expect(kinds.indexOf("participants_balance")).toBeLessThan(kinds.indexOf("text_words"));
  });

  it("orders participants by message count", async () => {
    const chat = createChat({
      participants: [
        { id: "user-2", name: "Bob" },
        { id: "user-1", name: "Alice" }
      ]
    });
    const analysis = await pipeline.analyze(chat);

    const result = builder.build(chat, analysis);
    const balance = result.slides.find(slide => slide.kind === "participants_balance");

    if (balance?.kind !== "participants_balance") {
      throw new Error("Participants balance slide was not generated");
    }

    expect(balance.participants.map(participant => participant.id)).toEqual(["user-1", "user-2"]);
  });

  it("gives chat-wide achievements no holders", async () => {
    const chat = createChat();
    const analysis = await pipeline.analyze(chat);

    const result = builder.build(chat, analysis);
    const slide = result.slides.find(
      item => item.kind === "achievement" && item.achievement.id === "speed_demon"
    );

    if (slide?.kind !== "achievement") {
      throw new Error("Speed Demon slide was not generated");
    }

    expect(slide.holders).toEqual([]);
  });

  it("lists who earned a participant achievement", async () => {
    const messages = Array.from({ length: 1_000 }, (_, index) => ({
      id: String(index),
      senderId: "user-1",
      timestamp: 1_000 + index * 1_000,
      type: "text" as const,
      text: "Hello"
    }));

    const chat = createChat({ messages });
    const analysis = await pipeline.analyze(chat);

    const result = builder.build(chat, analysis);
    const slide = result.slides.find(
      item => item.kind === "achievement" && item.achievement.id === "chatterbox"
    );

    if (slide?.kind !== "achievement") {
      throw new Error("Chatterbox slide was not generated");
    }

    expect(slide.holders).toEqual([{ id: "user-1", name: "Alice" }]);
  });
});
