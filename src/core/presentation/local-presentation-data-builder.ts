import type { ChatData } from "../models";
import type { ChatAnalysisResult } from "../pipeline";
import type { PresentationDataBuilder } from "./presentation-data-builder";
import type { ParticipantStatistics, PresentationData, PresentationSlide } from "./types";

const MIN_EMOJI_OCCURRENCES = 3;
const MIN_MONTHS_FOR_MONTHLY_HISTORY = 3;
const MAX_PHRASES_ON_SLIDE = 5;

type ChatPeriod = {
  start: number | null;
  end: number | null;
};

export class LocalPresentationDataBuilder implements PresentationDataBuilder {
  build(chat: ChatData, analysis: ChatAnalysisResult): PresentationData {
    const period = this.getPeriod(chat);
    const participants = this.buildParticipantStatistics(chat, analysis.analytics.participants);
    const unlockedAchievements = analysis.achievements.filter(achievement => achievement.unlocked);

    const slides: PresentationSlide[] = [
      this.buildCoverSlide(chat, analysis, period),
      ...this.buildOverviewSlides(analysis, period),
      ...this.buildActivitySlides(analysis),
      ...this.buildParticipantSlides(participants),
      ...this.buildTextSlides(analysis),
      ...this.buildConversationSlides(analysis),
      ...this.buildAchievementSlides(unlockedAchievements),
      this.buildFinaleSlide(chat, analysis, participants.length)
    ];

    return {
      chatTitle: chat.title,
      slides
    };
  }

  private buildCoverSlide(
    chat: ChatData,
    analysis: ChatAnalysisResult,
    period: ChatPeriod
  ): PresentationSlide {
    return {
      id: "cover",
      type: "cover",
      kind: "cover",
      chatTitle: chat.title,
      participants: chat.participants.map(participant => ({
        id: participant.id,
        name: participant.name
      })),
      totalMessages: analysis.analytics.overview.totalMessages,
      period
    };
  }

  private buildOverviewSlides(
    analysis: ChatAnalysisResult,
    period: ChatPeriod
  ): PresentationSlide[] {
    const { overview } = analysis.analytics;
    const slides: PresentationSlide[] = [];

    if (overview.totalMessages > 0) {
      slides.push({
        id: "overview-volume",
        type: "overview",
        kind: "overview_volume",
        totalMessages: overview.totalMessages,
        totalWords: overview.totalWords,
        totalCharacters: overview.totalCharacters,
        messagesWithText: overview.messagesWithText
      });
    }

    if (period.start !== null && period.end !== null && overview.activeDays > 0) {
      slides.push({
        id: "overview-duration",
        type: "overview",
        kind: "overview_duration",
        durationMs: overview.durationMs,
        activeDays: overview.activeDays,
        period: { ...period }
      });
    }

    if (overview.totalMessages > 0 && overview.activeDays > 0) {
      slides.push({
        id: "overview-pace",
        type: "overview",
        kind: "overview_pace",
        averageMessagesPerActiveDay: overview.averageMessagesPerActiveDay,
        averageWordsPerMessage: overview.averageWordsPerMessage,
        averageCharactersPerMessage: overview.averageCharactersPerMessage
      });
    }

    return slides;
  }

  private buildActivitySlides(analysis: ChatAnalysisResult): PresentationSlide[] {
    const { overview, activity } = analysis.analytics;
    const slides: PresentationSlide[] = [];

    const { mostActiveDay, mostActiveMonth, mostActiveHour, mostActiveWeekday } = activity;

    if (mostActiveDay && mostActiveMonth && mostActiveHour && mostActiveWeekday) {
      slides.push({
        id: "activity-peak",
        type: "activity",
        kind: "activity_peak",
        mostActiveDay: { ...mostActiveDay },
        mostActiveMonth: { ...mostActiveMonth },
        mostActiveHour: { ...mostActiveHour },
        mostActiveWeekday: { ...mostActiveWeekday }
      });
    }

    if (activity.byHour.length > 0 && activity.byWeekday.length > 0) {
      slides.push({
        id: "activity-rhythm",
        type: "activity",
        kind: "activity_rhythm",
        byHour: activity.byHour.map(item => ({ ...item })),
        byWeekday: activity.byWeekday.map(item => ({ ...item }))
      });
    }

    if (activity.longestActiveStreak > 1) {
      slides.push({
        id: "activity-streak",
        type: "activity",
        kind: "activity_streak",
        longestActiveStreak: activity.longestActiveStreak
      });
    }

    if (activity.longestGapMs > 0 && overview.totalMessages > 1) {
      slides.push({
        id: "activity-silence",
        type: "activity",
        kind: "activity_silence",
        longestGapMs: activity.longestGapMs
      });
    }

    if (activity.byMonth.length >= MIN_MONTHS_FOR_MONTHLY_HISTORY) {
      slides.push({
        id: "activity-monthly",
        type: "activity",
        kind: "activity_monthly",
        byMonth: activity.byMonth.map(item => ({ ...item }))
      });
    }

    return slides;
  }

  private buildParticipantSlides(participants: ParticipantStatistics[]): PresentationSlide[] {
    if (participants.length === 0) {
      return [];
    }

    const balanceSlide: PresentationSlide = {
      id: "participants-balance",
      type: "participants",
      kind: "participants_balance",
      participants: participants.map(participant => ({ ...participant }))
    };

    const profileSlides: PresentationSlide[] = participants.map(participant => ({
      id: `participant-${participant.id}`,
      type: "participants",
      kind: "participant_profile",
      participant: { ...participant },
      totalParticipants: participants.length
    }));

    return [balanceSlide, ...profileSlides];
  }

  private buildTextSlides(analysis: ChatAnalysisResult): PresentationSlide[] {
    const { text } = analysis.analytics;
    const slides: PresentationSlide[] = [];

    if (text.mostFrequentWords.length > 0) {
      slides.push({
        id: "text-words",
        type: "text",
        kind: "text_words",
        words: text.mostFrequentWords.map(item => ({ ...item }))
      });
    }

    if (text.mostFrequentPhrases.length > 0) {
      slides.push({
        id: "text-phrases",
        type: "text",
        kind: "text_phrases",
        phrases: text.mostFrequentPhrases.slice(0, MAX_PHRASES_ON_SLIDE).map(item => ({ ...item }))
      });
    }

    const frequentEmojis = text.mostFrequentEmojis.filter(
      item => item.count >= MIN_EMOJI_OCCURRENCES
    );
    if (frequentEmojis.length > 0) {
      slides.push({
        id: "text-emojis",
        type: "text",
        kind: "text_emojis",
        emojis: frequentEmojis.map(item => ({ ...item }))
      });
    }

    if (text.mostRepeatedMessage && text.mostRepeatedMessage.count > 1) {
      slides.push({
        id: "text-repeated",
        type: "text",
        kind: "text_repeated",
        repetitionCount: text.mostRepeatedMessage.count
      });
    }

    return slides;
  }

  private buildConversationSlides(analysis: ChatAnalysisResult): PresentationSlide[] {
    const { conversations } = analysis.analytics;
    const slides: PresentationSlide[] = [];

    if (conversations.totalConversations > 0) {
      slides.push({
        id: "conversations-overview",
        type: "conversations",
        kind: "conversations_overview",
        totalConversations: conversations.totalConversations
      });
    }

    if (conversations.longestDurationMs > 0) {
      slides.push({
        id: "conversations-duration",
        type: "conversations",
        kind: "conversations_duration",
        averageDurationMs: conversations.averageDurationMs,
        longestDurationMs: conversations.longestDurationMs
      });
    }

    if (conversations.averageResponseTimeMs > 0) {
      slides.push({
        id: "conversations-responses",
        type: "conversations",
        kind: "conversations_responses",
        averageResponseTimeMs: conversations.averageResponseTimeMs,
        fastestResponseTimeMs: conversations.fastestResponseTimeMs,
        longestResponseTimeMs: conversations.longestResponseTimeMs
      });
    }

    if (conversations.maxConsecutiveMessages > 1) {
      slides.push({
        id: "conversations-monologue",
        type: "conversations",
        kind: "conversations_monologue",
        maxConsecutiveMessages: conversations.maxConsecutiveMessages
      });
    }

    return slides;
  }

  private buildAchievementSlides(
    unlockedAchievements: ChatAnalysisResult["achievements"]
  ): PresentationSlide[] {
    if (unlockedAchievements.length === 0) {
      return [];
    }

    const singleSlides: PresentationSlide[] = unlockedAchievements.map(achievement => ({
      id: `achievement-${achievement.id}`,
      type: "achievements",
      kind: "achievement",
      achievement: { ...achievement }
    }));

    const recapSlide: PresentationSlide = {
      id: "achievements-recap",
      type: "achievements",
      kind: "achievements_recap",
      achievements: unlockedAchievements.map(achievement => ({ ...achievement }))
    };

    return [...singleSlides, recapSlide];
  }

  private buildFinaleSlide(
    chat: ChatData,
    analysis: ChatAnalysisResult,
    totalParticipants: number
  ): PresentationSlide {
    const { overview } = analysis.analytics;

    return {
      id: "finale",
      type: "finale",
      kind: "finale",
      chatTitle: chat.title,
      totalMessages: overview.totalMessages,
      totalWords: overview.totalWords,
      totalParticipants,
      activeDays: overview.activeDays
    };
  }

  private getPeriod(chat: ChatData): ChatPeriod {
    if (chat.messages.length === 0) {
      return { start: null, end: null };
    }

    let start = Infinity;
    let end = -Infinity;

    for (const message of chat.messages) {
      start = Math.min(start, message.timestamp);
      end = Math.max(end, message.timestamp);
    }

    return { start, end };
  }

  private buildParticipantStatistics(
    chat: ChatData,
    participantStats: ChatAnalysisResult["analytics"]["participants"]
  ): ParticipantStatistics[] {
    const statsById = new Map(participantStats.map(stat => [stat.participantId, stat]));

    return chat.participants
      .map(participant => {
        const stats = statsById.get(participant.id);

        return {
          id: participant.id,
          name: participant.name,
          messageCount: stats?.messageCount ?? 0,
          messageShare: stats?.messageShare ?? 0,
          wordCount: stats?.wordCount ?? 0,
          wordShare: stats?.wordShare ?? 0,
          characterCount: stats?.characterCount ?? 0,
          averageMessageLength: stats?.averageMessageLength ?? 0,
          nightMessages: stats?.nightMessages ?? 0,
          emojiCount: stats?.emojiCount ?? 0,
          startedConversations: stats?.startedConversations ?? 0
        };
      })
      .sort((a, b) => b.messageCount - a.messageCount);
  }
}
