import { describe, expect, it } from "vitest";
import type { NormalizedMessage } from "../../../normalization";
import { DEFAULT_ANALYSIS_OPTIONS } from "../../types";
import { analyzeText } from "./text-analytics";

function createMessage(
  text: string | null,
  overrides: Partial<NormalizedMessage> = {}
): NormalizedMessage {
  const tokens = text?.toLowerCase().match(/[\p{L}\p{M}\p{N}]+/gu) ?? [];

  return {
    id: "1",
    senderId: "user-1",
    timestamp: 0,
    type: "text",
    originalText: text,
    normalizedText: text?.toLowerCase() ?? "",
    tokens,
    emojis: [],
    wordCount: tokens.length,
    characterCount: text?.length ?? 0,
    ...overrides
  };
}

function analyze(messages: NormalizedMessage[]) {
  return analyzeText(messages, DEFAULT_ANALYSIS_OPTIONS);
}

describe("analyzeText", () => {
  it("returns empty statistics when there are no messages", () => {
    expect(analyze([])).toEqual({
      mostFrequentWords: [],
      mostFrequentPhrases: [],
      mostFrequentEmojis: [],
      longestMessage: null,
      shortestMessage: null,
      mostRepeatedMessage: null
    });
  });

  it("counts the most frequent words", () => {
    const messages = [
      createMessage("hello world"),
      createMessage("hello there"),
      createMessage("world hello")
    ];

    const result = analyze(messages);

    expect(result.mostFrequentWords).toEqual([
      { word: "hello", count: 3 },
      { word: "world", count: 2 },
      { word: "there", count: 1 }
    ]);
  });

  it("respects the minimum word length option", () => {
    const messages = [createMessage("I am a developer"), createMessage("I like code")];

    const result = analyzeText(messages, {
      ...DEFAULT_ANALYSIS_OPTIONS,
      minimumWordLength: 3
    });

    expect(result.mostFrequentWords).toEqual([
      { word: "code", count: 1 },
      { word: "developer", count: 1 },
      { word: "like", count: 1 }
    ]);
  });

  it("respects the top words limit", () => {
    const messages = [createMessage("apple banana cherry date")];

    const result = analyzeText(messages, {
      ...DEFAULT_ANALYSIS_OPTIONS,
      minimumWordLength: 1,
      topWordsLimit: 2
    });

    expect(result.mostFrequentWords).toHaveLength(2);
  });

  it("sorts words by frequency and then alphabetically", () => {
    const messages = [createMessage("banana apple cherry")];

    const result = analyzeText(messages, {
      ...DEFAULT_ANALYSIS_OPTIONS,
      minimumWordLength: 1
    });

    expect(result.mostFrequentWords).toEqual([
      { word: "apple", count: 1 },
      { word: "banana", count: 1 },
      { word: "cherry", count: 1 }
    ]);
  });

  it("counts frequent phrases", () => {
    const messages = [
      createMessage("one two three"),
      createMessage("one two four"),
      createMessage("one two three")
    ];

    const result = analyze(messages);

    expect(result.mostFrequentPhrases).toContainEqual({
      phrase: "one two",
      count: 3
    });
  });

  it("keeps phrases with different n-gram sizes when they meet the minimum count", () => {
    const messages = [
      createMessage("one two three"),
      createMessage("one two three"),
      createMessage("one two"),
      createMessage("two three")
    ];

    const result = analyze(messages);

    expect(result.mostFrequentPhrases).toEqual([
      { phrase: "one two", count: 3 },
      { phrase: "two three", count: 3 },
      { phrase: "one two three", count: 2 }
    ]);
  });

  it("counts frequent emojis", () => {
    const messages = [
      createMessage("hello", { emojis: ["😀", "❤️"] }),
      createMessage("world", { emojis: ["😀"] }),
      createMessage("test", { emojis: ["🔥"] })
    ];

    expect(analyze(messages).mostFrequentEmojis).toEqual([
      { emoji: "😀", count: 2 },
      { emoji: "❤️", count: 1 },
      { emoji: "🔥", count: 1 }
    ]);
  });

  it("respects the top emojis limit", () => {
    const messages = [createMessage("one", { emojis: ["😀", "❤️", "🔥"] })];

    const result = analyzeText(messages, {
      ...DEFAULT_ANALYSIS_OPTIONS,
      topEmojisLimit: 2
    });

    expect(result.mostFrequentEmojis).toHaveLength(2);
  });

  it("finds the longest message", () => {
    const messages = [
      createMessage("Short", { id: "1" }),
      createMessage("A much longer message", { id: "2" }),
      createMessage("Medium", { id: "3" })
    ];

    expect(analyze(messages).longestMessage).toEqual({
      messageId: "2",
      text: "A much longer message",
      characterCount: 21
    });
  });

  it("finds the shortest message", () => {
    const messages = [
      createMessage("Short", { id: "1" }),
      createMessage("A much longer message", { id: "2" }),
      createMessage("Hi", { id: "3" })
    ];

    expect(analyze(messages).shortestMessage).toEqual({
      messageId: "3",
      text: "Hi",
      characterCount: 2
    });
  });

  it("ignores messages without text when finding longest and shortest messages", () => {
    const messages = [
      createMessage(null, { id: "1", type: "photo" }),
      createMessage("Hello", { id: "2" }),
      createMessage(null, { id: "3", type: "video" })
    ];

    const result = analyze(messages);

    expect(result.longestMessage).toEqual({
      messageId: "2",
      text: "Hello",
      characterCount: 5
    });

    expect(result.shortestMessage).toEqual({
      messageId: "2",
      text: "Hello",
      characterCount: 5
    });
  });

  it("returns null for longest and shortest messages when no messages contain text", () => {
    const messages = [
      createMessage(null, { type: "photo" }),
      createMessage(null, { type: "video" })
    ];

    const result = analyze(messages);

    expect(result.longestMessage).toBeNull();
    expect(result.shortestMessage).toBeNull();
  });

  it("finds the most repeated message", () => {
    const messages = [
      createMessage("Hello", { id: "1", normalizedText: "hello" }),
      createMessage("HELLO", { id: "2", normalizedText: "hello" }),
      createMessage("World", { id: "3", normalizedText: "world" })
    ];

    expect(analyze(messages).mostRepeatedMessage).toEqual({
      text: "Hello",
      count: 2
    });
  });

  it("returns null when no message is repeated", () => {
    const messages = [createMessage("Hello"), createMessage("World", { id: "2" })];

    expect(analyze(messages).mostRepeatedMessage).toBeNull();
  });

  it("ignores empty messages when finding repeated messages", () => {
    const messages = [
      createMessage(null, { id: "1" }),
      createMessage("", { id: "2" }),
      createMessage("Hello", { id: "3" }),
      createMessage("Hello", { id: "4" })
    ];

    expect(analyze(messages).mostRepeatedMessage).toEqual({
      text: "Hello",
      count: 2
    });
  });

  it("respects the top phrases limit", () => {
    const messages = [
      createMessage("one two three four five"),
      createMessage("one two three four five")
    ];

    const result = analyzeText(messages, {
      ...DEFAULT_ANALYSIS_OPTIONS,
      topPhrasesLimit: 1
    });

    expect(result.mostFrequentPhrases).toHaveLength(1);
  });

  it("ignores phrases that appear only once", () => {
    const messages = [createMessage("one two three")];

    expect(analyze(messages).mostFrequentPhrases).toEqual([]);
  });

  it("keeps only the longest phrase when shorter ones never appear on their own", () => {
    const messages = [createMessage("one two three four"), createMessage("one two three four")];

    expect(analyze(messages).mostFrequentPhrases).toEqual([
      { phrase: "one two three four", count: 2 }
    ]);
  });

  it("keeps a shorter phrase that also appears on its own", () => {
    const messages = [
      createMessage("one two three"),
      createMessage("one two three"),
      createMessage("one two")
    ];

    expect(analyze(messages).mostFrequentPhrases).toEqual([
      { phrase: "one two", count: 3 },
      { phrase: "one two three", count: 2 }
    ]);
  });

  it("counts a phrase once per message", () => {
    const messages = [createMessage("ha ha ha ha"), createMessage("ha ha")];

    expect(analyze(messages).mostFrequentPhrases).toEqual([{ phrase: "ha ha", count: 2 }]);
  });

  it("respects the minimum phrase count option", () => {
    const messages = [createMessage("one two")];

    const result = analyzeText(messages, {
      ...DEFAULT_ANALYSIS_OPTIONS,
      minimumPhraseCount: 1
    });

    expect(result.mostFrequentPhrases).toEqual([{ phrase: "one two", count: 1 }]);
  });

  it("ignores short words by default but keeps meaningful ones", () => {
    const messages = [
      createMessage("я не знаю що це"),
      createMessage("люблю тебе"),
      createMessage("люблю дуже"),
      createMessage("to be or not to be, love")
    ];

    const words = analyze(messages).mostFrequentWords.map(entry => entry.word);

    expect(words).toContain("люблю");
    expect(words).toContain("love");
    expect(words).not.toContain("не");
    expect(words).not.toContain("що");
    expect(words).not.toContain("to");
  });
});
