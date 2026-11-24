import { describe, expect, it } from "vitest";
import type { NormalizedMessage } from "../../../normalization";
import { analyzeOverview } from "./overview-analytics";
import { DEFAULT_ANALYSIS_OPTIONS } from "../../types";

function analyze(messages: NormalizedMessage[], timezone = DEFAULT_ANALYSIS_OPTIONS.timezone) {
  return analyzeOverview(messages, { timezone });
}

function createMessage(overrides: Partial<NormalizedMessage> = {}): NormalizedMessage {
  return {
    id: "1",
    senderId: "user1",
    timestamp: Date.UTC(2024, 0, 1, 12),
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

describe("analyzeOverview", () => {
  it("returns zero values for an empty chat", () => {
    expect(analyze([])).toEqual({
      totalMessages: 0,
      totalWords: 0,
      totalCharacters: 0,
      messagesWithText: 0,
      durationMs: 0,
      activeDays: 0,
      averageMessagesPerActiveDay: 0,
      averageWordsPerMessage: 0,
      averageCharactersPerMessage: 0
    });
  });

  it("calculates total messages, words and characters", () => {
    const messages = [
      createMessage({
        id: "1",
        originalText: "Hello world",
        wordCount: 2,
        characterCount: 11
      }),
      createMessage({
        id: "2",
        originalText: "How are you?",
        wordCount: 3,
        characterCount: 13
      })
    ];

    const result = analyze(messages);

    expect(result.totalMessages).toBe(2);
    expect(result.totalWords).toBe(5);
    expect(result.totalCharacters).toBe(24);
    expect(result.messagesWithText).toBe(2);
  });

  it("calculates chat duration", () => {
    const messages = [
      createMessage({
        timestamp: Date.UTC(2024, 0, 1)
      }),
      createMessage({
        timestamp: Date.UTC(2024, 0, 3)
      })
    ];

    const result = analyze(messages);

    expect(result.durationMs).toBe(2 * 24 * 60 * 60 * 1000);
  });

  it("counts unique active days", () => {
    const messages = [
      createMessage({
        timestamp: Date.UTC(2024, 0, 1, 10)
      }),
      createMessage({
        timestamp: Date.UTC(2024, 0, 1, 15)
      }),
      createMessage({
        timestamp: Date.UTC(2024, 0, 2, 10)
      })
    ];

    const result = analyze(messages);

    expect(result.activeDays).toBe(2);
  });

  it("calculates average messages per active day", () => {
    const messages = [
      createMessage({ id: "1" }),
      createMessage({ id: "2" }),
      createMessage({
        id: "3",
        timestamp: Date.UTC(2024, 0, 2)
      })
    ];

    const result = analyze(messages);

    expect(result.averageMessagesPerActiveDay).toBe(1.5);
  });

  it("excludes media-only messages from text averages", () => {
    const messages = [
      createMessage(),
      createMessage({
        id: "2",
        type: "photo",
        originalText: null,
        normalizedText: "",
        tokens: [],
        emojis: [],
        wordCount: 0,
        characterCount: 0
      })
    ];

    const result = analyze(messages);

    expect(result.totalMessages).toBe(2);
    expect(result.messagesWithText).toBe(1);
    expect(result.averageWordsPerMessage).toBe(2);
    expect(result.averageCharactersPerMessage).toBe(11);
  });

  it("handles a chat with one message", () => {
    const result = analyze([createMessage()]);

    expect(result.totalMessages).toBe(1);
    expect(result.durationMs).toBe(0);
    expect(result.activeDays).toBe(1);
  });

  it("does not depend on message ordering", () => {
    const first = createMessage({
      id: "1",
      timestamp: Date.UTC(2024, 0, 1)
    });

    const second = createMessage({
      id: "2",
      timestamp: Date.UTC(2024, 0, 3)
    });

    expect(analyze([first, second])).toEqual(analyze([second, first]));
  });
});
