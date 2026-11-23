import { describe, expect, it } from "vitest";
import type { NormalizedMessage } from "../../../normalization";
import { DEFAULT_ANALYSIS_OPTIONS } from "../../types";
import { analyzeActivity } from "./activity-analytics";

function createMessage(
  timestamp: number,
  overrides: Partial<NormalizedMessage> = {}
): NormalizedMessage {
  return {
    id: String(timestamp),
    senderId: "user-1",
    timestamp,
    type: "text",
    originalText: "Hello",
    normalizedText: "hello",
    tokens: ["hello"],
    emojis: [],
    wordCount: 1,
    characterCount: 5,
    ...overrides
  };
}

function analyze(messages: NormalizedMessage[]) {
  return analyzeActivity(messages, DEFAULT_ANALYSIS_OPTIONS);
}

describe("analyzeActivity", () => {
  it("returns empty statistics when there are no messages", () => {
    expect(analyze([])).toEqual({
      byDay: [],
      byMonth: [],
      byHour: [],
      byWeekday: [],
      mostActiveDay: null,
      mostActiveMonth: null,
      mostActiveHour: null,
      mostActiveWeekday: null,
      longestActiveStreak: 0,
      longestGapMs: 0
    });
  });

  it("counts messages by day", () => {
    const messages = [
      createMessage(Date.UTC(2025, 0, 1, 10)),
      createMessage(Date.UTC(2025, 0, 1, 12)),
      createMessage(Date.UTC(2025, 0, 2, 10))
    ];

    const result = analyze(messages);

    expect(result.byDay).toEqual([
      { date: "2025-01-01", count: 2 },
      { date: "2025-01-02", count: 1 }
    ]);
  });

  it("counts messages by month", () => {
    const messages = [
      createMessage(Date.UTC(2025, 0, 1)),
      createMessage(Date.UTC(2025, 0, 15)),
      createMessage(Date.UTC(2025, 1, 1))
    ];

    const result = analyze(messages);

    expect(result.byMonth).toEqual([
      { month: "2025-01", count: 2 },
      { month: "2025-02", count: 1 }
    ]);
  });

  it("counts messages by hour", () => {
    const messages = [
      createMessage(Date.UTC(2025, 0, 1, 10)),
      createMessage(Date.UTC(2025, 0, 1, 10, 30)),
      createMessage(Date.UTC(2025, 0, 1, 22))
    ];

    const result = analyze(messages);

    expect(result.byHour).toEqual([
      { hour: 10, count: 2 },
      { hour: 22, count: 1 }
    ]);
  });

  it("counts messages by weekday", () => {
    // 2025-01-06 is Monday, 2025-01-07 is Tuesday.
    const messages = [
      createMessage(Date.UTC(2025, 0, 6, 10)),
      createMessage(Date.UTC(2025, 0, 6, 12)),
      createMessage(Date.UTC(2025, 0, 7, 10))
    ];

    const result = analyze(messages);

    expect(result.byWeekday).toEqual([
      { weekday: 1, count: 2 },
      { weekday: 2, count: 1 }
    ]);
  });

  it("identifies the most active day", () => {
    const messages = [
      createMessage(Date.UTC(2025, 0, 1, 10)),
      createMessage(Date.UTC(2025, 0, 1, 12)),
      createMessage(Date.UTC(2025, 0, 2, 10))
    ];

    expect(analyze(messages).mostActiveDay).toEqual({
      date: "2025-01-01",
      count: 2
    });
  });

  it("identifies the most active month", () => {
    const messages = [
      createMessage(Date.UTC(2025, 0, 1)),
      createMessage(Date.UTC(2025, 0, 15)),
      createMessage(Date.UTC(2025, 1, 1))
    ];

    expect(analyze(messages).mostActiveMonth).toEqual({
      month: "2025-01",
      count: 2
    });
  });

  it("identifies the most active hour", () => {
    const messages = [
      createMessage(Date.UTC(2025, 0, 1, 10)),
      createMessage(Date.UTC(2025, 0, 1, 10, 30)),
      createMessage(Date.UTC(2025, 0, 1, 22))
    ];

    expect(analyze(messages).mostActiveHour).toEqual({
      hour: 10,
      count: 2
    });
  });

  it("identifies the most active weekday", () => {
    const messages = [
      createMessage(Date.UTC(2025, 0, 6, 10)),
      createMessage(Date.UTC(2025, 0, 6, 12)),
      createMessage(Date.UTC(2025, 0, 7, 10))
    ];

    expect(analyze(messages).mostActiveWeekday).toEqual({
      weekday: 1,
      count: 2
    });
  });

  it("resolves ties deterministically", () => {
    const messages = [
      createMessage(Date.UTC(2025, 0, 2, 10)),
      createMessage(Date.UTC(2025, 0, 1, 10))
    ];

    const result = analyze(messages);

    expect(result.mostActiveDay).toEqual({
      date: "2025-01-01",
      count: 1
    });
  });

  it("calculates the longest active streak", () => {
    const messages = [
      createMessage(Date.UTC(2025, 0, 1)),
      createMessage(Date.UTC(2025, 0, 2)),
      createMessage(Date.UTC(2025, 0, 3)),
      createMessage(Date.UTC(2025, 0, 5)),
      createMessage(Date.UTC(2025, 0, 6))
    ];

    expect(analyze(messages).longestActiveStreak).toBe(3);
  });

  it("does not count multiple messages on the same day as separate streak days", () => {
    const messages = [
      createMessage(Date.UTC(2025, 0, 1, 8)),
      createMessage(Date.UTC(2025, 0, 1, 12)),
      createMessage(Date.UTC(2025, 0, 1, 18))
    ];

    expect(analyze(messages).longestActiveStreak).toBe(1);
  });

  it("calculates the longest gap between messages", () => {
    const messages = [
      createMessage(0),
      createMessage(60_000),
      createMessage(180_000),
      createMessage(600_000)
    ];

    expect(analyze(messages).longestGapMs).toBe(420_000);
  });

  it("returns zero as the longest gap when there is fewer than two messages", () => {
    expect(analyze([createMessage(0)]).longestGapMs).toBe(0);
  });

  it("calculates the longest gap regardless of input order", () => {
    const messages = [createMessage(600_000), createMessage(0), createMessage(60_000)];

    expect(analyze(messages).longestGapMs).toBe(540_000);
  });

  it("uses the configured timezone when grouping activity", () => {
    const messages = [
      createMessage(Date.UTC(2025, 0, 1, 22)),
      createMessage(Date.UTC(2025, 0, 2, 1))
    ];

    const result = analyzeActivity(messages, {
      ...DEFAULT_ANALYSIS_OPTIONS,
      timezone: "Europe/Kyiv"
    });

    expect(result.byDay).toEqual([{ date: "2025-01-02", count: 2 }]);
  });
});
