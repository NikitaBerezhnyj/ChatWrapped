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
    endedConversations: 0,
    medianResponseTimeMs: 0,
    responseCount: 0,
    maxConsecutiveMessages: 0,
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

function evaluateChatterbox(engine: LocalAchievementsEngine, participants: ParticipantStats[]) {
  return createEngineResult(engine, participants).find(
    achievement => achievement.id === "chatterbox"
  );
}

function createEngineResult(engine: LocalAchievementsEngine, participants: ParticipantStats[]) {
  return engine.evaluate(createAnalytics({ participants }));
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
      description: "Exchanged 50,000 or more messages.",
      icon: "trophy",
      unlocked: false,
      holderIds: []
    });
  });

  it("unlocks achievements when their conditions are met", () => {
    const analytics = createAnalytics({
      overview: {
        ...createAnalytics().overview,
        totalMessages: 50_000
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

  it("awards a participant achievement to the one who leads by 50%", () => {
    const chatterbox = evaluateChatterbox(engine, [
      createParticipant({ participantId: "user-1", messageCount: 3_000 }),
      createParticipant({ participantId: "user-2", messageCount: 1_000 })
    ]);

    expect(chatterbox?.unlocked).toBe(true);
    expect(chatterbox?.holderIds).toEqual(["user-1"]);
  });

  it("does not award it when nobody leads by enough", () => {
    const chatterbox = evaluateChatterbox(engine, [
      createParticipant({ participantId: "user-1", messageCount: 1_200 }),
      createParticipant({ participantId: "user-2", messageCount: 1_000 })
    ]);

    expect(chatterbox?.unlocked).toBe(false);
    expect(chatterbox?.holderIds).toEqual([]);
  });

  it("does not award it in a chat with one participant", () => {
    const chatterbox = evaluateChatterbox(engine, [
      createParticipant({ participantId: "user-1", messageCount: 5_000 })
    ]);

    expect(chatterbox?.unlocked).toBe(false);
  });

  it("does not award it below the minimum volume", () => {
    const chatterbox = evaluateChatterbox(engine, [
      createParticipant({ participantId: "user-1", messageCount: 600 }),
      createParticipant({ participantId: "user-2", messageCount: 100 })
    ]);

    expect(chatterbox?.unlocked).toBe(false);
  });

  describe("reply, streak and ending achievements", () => {
    function findAchievement(id: string, participants: ParticipantStats[]) {
      return engine
        .evaluate(createAnalytics({ participants }))
        .find(achievement => achievement.id === id);
    }

    it("awards Quick Draw to a clearly faster replier", () => {
      const quickDraw = findAchievement("quick_draw", [
        createParticipant({
          participantId: "user-1",
          medianResponseTimeMs: 60_000,
          responseCount: 100
        }),
        createParticipant({
          participantId: "user-2",
          medianResponseTimeMs: 120_000,
          responseCount: 100
        })
      ]);

      expect(quickDraw?.holderIds).toEqual(["user-1"]);
    });

    it("does not award Quick Draw when the difference is small", () => {
      const quickDraw = findAchievement("quick_draw", [
        createParticipant({
          participantId: "user-1",
          medianResponseTimeMs: 60_000,
          responseCount: 100
        }),
        createParticipant({
          participantId: "user-2",
          medianResponseTimeMs: 80_000,
          responseCount: 100
        })
      ]);

      expect(quickDraw?.unlocked).toBe(false);
    });

    it("does not compare reply speed with too few replies", () => {
      const quickDraw = findAchievement("quick_draw", [
        createParticipant({
          participantId: "user-1",
          medianResponseTimeMs: 1_000,
          responseCount: 5
        }),
        createParticipant({
          participantId: "user-2",
          medianResponseTimeMs: 120_000,
          responseCount: 100
        })
      ]);

      expect(quickDraw?.unlocked).toBe(false);
    });

    it("awards Monologist to the longest streak", () => {
      const monologist = findAchievement("monologist", [
        createParticipant({ participantId: "user-1", maxConsecutiveMessages: 30 }),
        createParticipant({ participantId: "user-2", maxConsecutiveMessages: 10 })
      ]);

      expect(monologist?.holderIds).toEqual(["user-1"]);
    });

    it("awards Last Word to who ends more conversations", () => {
      const lastWord = findAchievement("last_word", [
        createParticipant({ participantId: "user-1", endedConversations: 30 }),
        createParticipant({ participantId: "user-2", endedConversations: 90 })
      ]);

      expect(lastWord?.holderIds).toEqual(["user-2"]);
    });
  });
});
