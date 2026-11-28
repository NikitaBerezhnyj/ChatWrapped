import { describe, expect, it } from "vitest";
import type { NormalizedMessage } from "../../../normalization";
import { DEFAULT_ANALYSIS_OPTIONS } from "../../types";
import { getDistinctiveWords } from "./distinctive-words";

function createMessages(senderId: string, text: string, times: number): NormalizedMessage[] {
  const tokens = text.toLowerCase().match(/[\p{L}\p{M}\p{N}]+/gu) ?? [];

  return Array.from({ length: times }, (_, index) => ({
    id: `${senderId}-${text}-${index}`,
    senderId,
    timestamp: 0,
    type: "text",
    originalText: text,
    normalizedText: text.toLowerCase(),
    tokens,
    emojis: [],
    wordCount: tokens.length,
    characterCount: text.length
  }));
}

function getWords(messages: NormalizedMessage[], senderId: string): string[] {
  const result = getDistinctiveWords(messages, DEFAULT_ANALYSIS_OPTIONS, 5);

  return (result.get(senderId) ?? []).map(entry => entry.word);
}

describe("getDistinctiveWords", () => {
  it("returns words that one person uses much more than the others", () => {
    const messages = [...createMessages("a", "pizza", 6), ...createMessages("b", "tacos", 6)];

    expect(getWords(messages, "a")).toEqual(["pizza"]);
    expect(getWords(messages, "b")).toEqual(["tacos"]);
  });

  it("ignores words that everyone uses equally", () => {
    const messages = [
      ...createMessages("a", "люблю", 6),
      ...createMessages("a", "pizza", 6),
      ...createMessages("b", "люблю", 6),
      ...createMessages("b", "tacos", 6)
    ];

    expect(getWords(messages, "a")).toEqual(["pizza"]);
    expect(getWords(messages, "b")).toEqual(["tacos"]);
  });

  it("ignores words used fewer times than the minimum", () => {
    const messages = [...createMessages("a", "pizza", 4), ...createMessages("b", "tacos", 6)];

    expect(getWords(messages, "a")).toEqual([]);
  });

  it("returns nothing when there is no one to compare with", () => {
    expect(getWords(createMessages("a", "pizza", 6), "a")).toEqual([]);
  });

  it("respects the limit", () => {
    const messages = [
      ...createMessages("a", "pizza", 6),
      ...createMessages("a", "pasta", 6),
      ...createMessages("b", "tacos", 6)
    ];

    const result = getDistinctiveWords(messages, DEFAULT_ANALYSIS_OPTIONS, 1);

    expect(result.get("a")).toHaveLength(1);
  });
});
