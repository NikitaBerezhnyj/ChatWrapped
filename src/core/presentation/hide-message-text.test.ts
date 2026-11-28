import { beforeAll, describe, expect, it } from "vitest";
import type { ChatData } from "../models";
import { LocalChatAnalysisPipeline } from "../pipeline";
import { hideMessageTextSlides } from "./hide-message-text";
import { LocalPresentationDataBuilder } from "./local-presentation-data-builder";
import type { PresentationData } from "./types";

async function createData(): Promise<PresentationData> {
  const chat: ChatData = {
    id: "chat-1",
    title: "Test chat",
    type: "private",
    participants: [
      { id: "user-1", name: "Alice" },
      { id: "user-2", name: "Bob" }
    ],
    messages: [1, 2, 3].map(number => ({
      id: String(number),
      senderId: number % 2 === 0 ? "user-2" : "user-1",
      timestamp: number * 1_000,
      type: "text" as const,
      text: "hello secretword"
    }))
  };

  const analysis = await new LocalChatAnalysisPipeline().analyze(chat);

  return new LocalPresentationDataBuilder().build(chat, analysis);
}

describe("hideMessageTextSlides", () => {
  let data: PresentationData;

  beforeAll(async () => {
    data = await createData();
  });

  it("starts from data that contains words and phrases", () => {
    const kinds = data.slides.map(slide => slide.kind);

    expect(kinds).toContain("text_words");
    expect(kinds).toContain("text_phrases");
    expect(kinds).toContain("text_repeated");
    expect(JSON.stringify(data)).toContain("secretword");
  });

  it("removes the slides that show message text", () => {
    const result = hideMessageTextSlides(data);
    const kinds = result.slides.map(slide => slide.kind);

    expect(kinds).not.toContain("text_words");
    expect(kinds).not.toContain("text_phrases");
    expect(kinds).not.toContain("text_repeated");
    expect(JSON.stringify(result)).not.toContain("secretword");
  });

  it("keeps all other slides in their original order", () => {
    const result = hideMessageTextSlides(data);

    const hiddenKinds = ["text_words", "text_phrases", "text_repeated"];
    const expectedIds = data.slides
      .filter(slide => !hiddenKinds.includes(slide.kind))
      .map(slide => slide.id);

    expect(result.slides.map(slide => slide.id)).toEqual(expectedIds);
  });

  it("does not mutate the original data", () => {
    const original = structuredClone(data);

    hideMessageTextSlides(data);

    expect(data).toEqual(original);
  });
});
