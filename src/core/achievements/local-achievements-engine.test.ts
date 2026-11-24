import { describe, expect, it } from "vitest";
import type { AnalyticsResult, ParticipantStats } from "../analytics";
import { achievementDefinitions } from "./definitions";
import { LocalAchievementsEngine } from "./local-achievements-engine";

function createParticipant(overrides: Partial<ParticipantStats> = {}): ParticipantStats {
  return {
    participantId: "user-1",
    messageCount: 0,
    messageShare: 0,
    wordCount: 0,
    wordShare: 0,
    characterCount: 0,
    averageMessageLength: 0,
    nightMessages: 0,
    emojiCount: 0,
    startedConversations: 0,
    ...overrides
  };
}

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

    expect(result.find(achievement => achievement.id === "marathon")).toEqual({
      id: "marathon",
      category: "general",
      title: "Marathon",
      description: "Exchanged 1,000 or more messages.",
      icon: "trophy",
      unlocked: false,
      holderIds: []
    });
  });

  it("unlocks achievements when their conditions are met", () => {
    const analytics = createAnalytics({
      overview: {
        ...createAnalytics().overview,
        totalMessages: 1_000
      }
    });

    const marathon = engine.evaluate(analytics).find(achievement => achievement.id === "marathon");

    expect(marathon?.unlocked).toBe(true);
    expect(marathon?.holderIds).toEqual([]);
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

  it("lists every participant who earned a participant achievement", () => {
    const analytics = createAnalytics({
      participants: [
        createParticipant({ participantId: "user-1", messageCount: 1_500 }),
        createParticipant({ participantId: "user-2", messageCount: 1_000 }),
        createParticipant({ participantId: "user-3", messageCount: 10 })
      ]
    });

    const chatterbox = engine
      .evaluate(analytics)
      .find(achievement => achievement.id === "chatterbox");

    expect(chatterbox?.unlocked).toBe(true);
    expect(chatterbox?.holderIds).toEqual(["user-1", "user-2"]);
  });

  it("keeps a participant achievement locked when nobody earned it", () => {
    const analytics = createAnalytics({
      participants: [createParticipant({ messageCount: 10 })]
    });

    const chatterbox = engine
      .evaluate(analytics)
      .find(achievement => achievement.id === "chatterbox");

    expect(chatterbox?.unlocked).toBe(false);
    expect(chatterbox?.holderIds).toEqual([]);
  });

  it("counts night messages per participant", () => {
    const analytics = createAnalytics({
      participants: [
        createParticipant({ participantId: "user-1", nightMessages: 60 }),
        createParticipant({ participantId: "user-2", nightMessages: 60 })
      ]
    });

    const nightOwl = engine.evaluate(analytics).find(achievement => achievement.id === "night_owl");

    expect(nightOwl?.unlocked).toBe(false);
  });
});
