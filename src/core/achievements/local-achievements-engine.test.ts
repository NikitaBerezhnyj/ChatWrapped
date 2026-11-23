import { describe, expect, it } from "vitest";
import type { AnalyticsResult } from "../analytics";
import { achievementDefinitions } from "./definitions";
import { LocalAchievementsEngine } from "./local-achievements-engine";

function createAnalytics(overrides: Partial<AnalyticsResult> = {}): AnalyticsResult {
  return {
    overview: {
      totalMessages: 0,
      totalWords: 0,
      totalCharacters: 0,
      messagesWithText: 0,
      durationMs: 0,
      activeDays: 0,
      averageMessagesPerActiveDay: 0,
      averageWordsPerMessage: 0,
      averageCharactersPerMessage: 0
    },
    activity: {
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
    },
    text: {
      mostFrequentWords: [],
      mostFrequentPhrases: [],
      mostFrequentEmojis: [],
      longestMessage: null,
      shortestMessage: null,
      mostRepeatedMessage: null
    },
    participants: [],
    conversations: {
      totalConversations: 0,
      averageDurationMs: 0,
      longestDurationMs: 0,
      averageResponseTimeMs: 0,
      fastestResponseTimeMs: 0,
      longestResponseTimeMs: 0,
      maxConsecutiveMessages: 0
    },
    ...overrides
  };
}

describe("LocalAchievementsEngine", () => {
  const engine = new LocalAchievementsEngine();

  it("returns all defined achievements", () => {
    const result = engine.evaluate(createAnalytics());

    expect(result).toHaveLength(achievementDefinitions.length);
  });

  it("returns achievement metadata", () => {
    const result = engine.evaluate(createAnalytics());

    expect(result[0]).toEqual({
      id: "first_contact",
      category: "general",
      title: "First Contact",
      description: "Sent your first message.",
      icon: "message-circle",
      unlocked: false
    });
  });

  it("unlocks achievements when their conditions are met", () => {
    const analytics = createAnalytics({
      overview: {
        ...createAnalytics().overview,
        totalMessages: 1
      }
    });

    const result = engine.evaluate(analytics);

    const firstContact = result.find(achievement => achievement.id === "first_contact");

    expect(firstContact?.unlocked).toBe(true);
  });

  it("keeps achievements locked when their conditions are not met", () => {
    const result = engine.evaluate(createAnalytics());

    expect(result.every(achievement => !achievement.unlocked)).toBe(true);
  });

  it("does not mutate analytics data", () => {
    const analytics = createAnalytics();
    const originalAnalytics = structuredClone(analytics);

    engine.evaluate(analytics);

    expect(analytics).toEqual(originalAnalytics);
  });

  it("returns a new result on every evaluation", () => {
    const analytics = createAnalytics();

    const firstResult = engine.evaluate(analytics);
    const secondResult = engine.evaluate(analytics);

    expect(firstResult).not.toBe(secondResult);
    expect(firstResult).not.toBe(secondResult);
  });
});
