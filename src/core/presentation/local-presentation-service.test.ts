import { describe, expect, it, vi } from "vitest";
import type { ChatData } from "../models";
import type { ChatAnalysisPipeline, ChatAnalysisResult } from "../pipeline";
import type { PresentationFormatterFactory, PresentationFormatters } from "./formatting";
import { DEFAULT_PRESENTATION_FORMATTING_OPTIONS } from "./formatting";
import { LocalPresentationService } from "./local-presentation-service";
import type { PresentationDataBuilder } from "./presentation-data-builder";
import type { PresentationData } from "./types";

function createChat(): ChatData {
  return {
    id: "chat-1",
    title: "Test Chat",
    type: "private",
    participants: [],
    messages: []
  };
}

function createAnalysisResult(): ChatAnalysisResult {
  return {
    analytics: {
      overview: {
        totalMessages: 0,
        totalWords: 0,
        totalCharacters: 0,
        messagesWithText: 0,
        durationMs: 0,
        activeDays: 0,
        averageMessagesPerActiveDay: 0,
        averageWordsPerMessage: 0,
        averageCharactersPerMessage: 0,
        mediaCounts: []
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
        medianResponseTimeMs: 0,
        fastestResponseTimeMs: 0,
        longestResponseTimeMs: 0,
        maxConsecutiveMessages: 0
      }
    },
    achievements: []
  };
}

function createPresentationData(): PresentationData {
  return {
    chatTitle: "Test Chat",
    slides: []
  };
}

describe("LocalPresentationService", () => {
  it("prepares presentation using all dependencies", async () => {
    const chat = createChat();
    const analysis = createAnalysisResult();
    const data = createPresentationData();
    const formatters = {} as PresentationFormatters;

    const analyze = vi.fn().mockResolvedValue(analysis);
    const build = vi.fn().mockReturnValue(data);
    const create = vi.fn().mockReturnValue(formatters);

    const pipeline = { analyze } as unknown as ChatAnalysisPipeline;
    const dataBuilder = { build } as PresentationDataBuilder;
    const formatterFactory = { create } as PresentationFormatterFactory;

    const service = new LocalPresentationService(pipeline, dataBuilder, formatterFactory);

    const result = await service.prepare(chat);

    expect(analyze).toHaveBeenCalledWith(chat, {
      timezone: DEFAULT_PRESENTATION_FORMATTING_OPTIONS.timezone
    });
    expect(build).toHaveBeenCalledWith(chat, analysis);
    expect(create).toHaveBeenCalledWith({
      timezone: DEFAULT_PRESENTATION_FORMATTING_OPTIONS.timezone
    });
    expect(result).toEqual({
      data,
      formatters
    });
  });

  it("passes analysis options and a custom timezone", async () => {
    const chat = createChat();
    const analysis = createAnalysisResult();

    const analyze = vi.fn().mockResolvedValue(analysis);
    const build = vi.fn().mockReturnValue(createPresentationData());
    const create = vi.fn().mockReturnValue({});

    const service = new LocalPresentationService(
      { analyze } as unknown as ChatAnalysisPipeline,
      { build } as PresentationDataBuilder,
      { create } as PresentationFormatterFactory
    );

    await service.prepare(chat, {
      timezone: "America/New_York",
      analysis: {
        topWordsLimit: 5,
        nightStartHour: 22
      }
    });

    expect(analyze).toHaveBeenCalledWith(chat, {
      topWordsLimit: 5,
      nightStartHour: 22,
      timezone: "America/New_York"
    });

    expect(create).toHaveBeenCalledWith({
      timezone: "America/New_York"
    });
  });

  it("uses the default timezone when no options are provided", async () => {
    const analyze = vi.fn().mockResolvedValue(createAnalysisResult());
    const create = vi.fn().mockReturnValue({});

    const service = new LocalPresentationService(
      { analyze } as unknown as ChatAnalysisPipeline,
      {
        build: vi.fn().mockReturnValue(createPresentationData())
      } as unknown as PresentationDataBuilder,
      { create } as unknown as PresentationFormatterFactory
    );

    await service.prepare(createChat());

    expect(analyze).toHaveBeenCalledWith(expect.any(Object), {
      timezone: DEFAULT_PRESENTATION_FORMATTING_OPTIONS.timezone
    });

    expect(create).toHaveBeenCalledWith({
      timezone: DEFAULT_PRESENTATION_FORMATTING_OPTIONS.timezone
    });
  });

  it("propagates analysis errors", async () => {
    const error = new Error("Analysis failed");
    const analyze = vi.fn().mockRejectedValue(error);

    const service = new LocalPresentationService(
      { analyze } as unknown as ChatAnalysisPipeline,
      { build: vi.fn() } as unknown as PresentationDataBuilder,
      { create: vi.fn() } as unknown as PresentationFormatterFactory
    );

    await expect(service.prepare(createChat())).rejects.toBe(error);
  });

  it("does not build presentation when analysis fails", async () => {
    const build = vi.fn();
    const create = vi.fn();

    const service = new LocalPresentationService(
      {
        analyze: vi.fn().mockRejectedValue(new Error("Analysis failed"))
      } as unknown as ChatAnalysisPipeline,
      { build } as PresentationDataBuilder,
      { create } as PresentationFormatterFactory
    );

    await expect(service.prepare(createChat())).rejects.toThrow("Analysis failed");

    expect(build).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });
});
