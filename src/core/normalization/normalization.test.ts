import { describe, expect, it } from "vitest";
import type { Message } from "../models";
import { extractEmojis } from "./extract-emojis";
import { normalizeMessage } from "./normalize-message";
import { normalizeText } from "./normalize-text";
import { tokenize } from "./tokenize";

describe("normalizeText", () => {
  it("converts text to lowercase", () => {
    expect(normalizeText("HELLO World")).toBe("hello world");
  });

  it("removes punctuation", () => {
    expect(normalizeText("Hello!!! How are you???")).toBe("hello how are you");
  });

  it("normalizes whitespace", () => {
    expect(normalizeText("  Hello   world \n\t")).toBe("hello world");
  });

  it("preserves emojis", () => {
    expect(normalizeText("Hello 😂!!!")).toBe("hello 😂");
  });

  it("preserves apostrophes inside words", () => {
    expect(normalizeText("I'm here")).toBe("i'm here");
  });

  it("normalizes Unicode characters", () => {
    expect(normalizeText("Ｃａｆé")).toBe("café");
  });
});

describe("tokenize", () => {
  it("extracts words from text", () => {
    expect(tokenize("Hello, world!")).toEqual(["hello", "world"]);
  });

  it("supports Ukrainian text", () => {
    expect(tokenize("Привіт, світе!")).toEqual(["привіт", "світе"]);
  });

  it("preserves apostrophes and hyphens inside words", () => {
    expect(tokenize("I'm using a well-known tool")).toEqual([
      "i'm",
      "using",
      "a",
      "well-known",
      "tool"
    ]);
  });

  it("ignores emojis and punctuation", () => {
    expect(tokenize("Hello 😂!!! World")).toEqual(["hello", "world"]);
  });

  it("returns an empty array for empty text", () => {
    expect(tokenize("")).toEqual([]);
  });
});

describe("extractEmojis", () => {
  it("extracts multiple emojis", () => {
    expect(extractEmojis("Hello 😂❤️🔥")).toEqual(["😂", "❤️", "🔥"]);
  });

  it("preserves repeated emojis", () => {
    expect(extractEmojis("😂😂😂")).toEqual(["😂", "😂", "😂"]);
  });

  it("returns an empty array when there are no emojis", () => {
    expect(extractEmojis("Hello world")).toEqual([]);
  });
});

describe("normalizeMessage", () => {
  const message: Message = {
    id: "1",
    senderId: "user1",
    timestamp: 1601907252000,
    text: "HELLO, World! 😂😂",
    type: "text"
  };

  it("creates a normalized message", () => {
    const result = normalizeMessage(message);

    expect(result.normalizedText).toBe("hello world 😂😂");
    expect(result.tokens).toEqual(["hello", "world"]);
    expect(result.emojis).toEqual(["😂", "😂"]);
    expect(result.wordCount).toBe(2);
  });

  it("preserves original message information", () => {
    const result = normalizeMessage(message);

    expect(result.id).toBe(message.id);
    expect(result.senderId).toBe(message.senderId);
    expect(result.timestamp).toBe(message.timestamp);
    expect(result.originalText).toBe(message.text);
    expect(result.characterCount).toBe(message.text?.length);
  });

  it("handles messages without text", () => {
    const result = normalizeMessage({
      ...message,
      text: null,
      type: "photo"
    });

    expect(result.normalizedText).toBe("");
    expect(result.tokens).toEqual([]);
    expect(result.emojis).toEqual([]);
    expect(result.wordCount).toBe(0);
    expect(result.characterCount).toBe(0);
  });
});
