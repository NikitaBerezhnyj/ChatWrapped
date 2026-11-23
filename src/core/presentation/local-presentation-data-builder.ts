import type { ChatData } from "../models";
import type { ChatAnalysisResult } from "../pipeline";
import type { PresentationDataBuilder } from "./presentation-data-builder";
import type { PresentationData, PresentationSlide } from "./types";

export class LocalPresentationDataBuilder implements PresentationDataBuilder {
  build(chat: ChatData, analysis: ChatAnalysisResult): PresentationData {
    const participants = chat.participants.map(participant => ({
      id: participant.id,
      name: participant.name
    }));

    const participantNames = new Map(
      participants.map(participant => [participant.id, participant.name])
    );

    const timestamps = chat.messages.map(message => message.timestamp);

    const period =
      timestamps.length > 0
        ? {
            start: timestamps.reduce(
              (minimum, timestamp) => Math.min(minimum, timestamp),
              Infinity
            ),
            end: timestamps.reduce((maximum, timestamp) => Math.max(maximum, timestamp), -Infinity)
          }
        : {
            start: null,
            end: null
          };

    const {
      overview,
      activity,
      text,
      participants: participantStats,
      conversations
    } = analysis.analytics;

    const slides: PresentationSlide[] = [
      {
        id: "cover",
        type: "cover",
        chatTitle: chat.title,
        participants: participants.map(participant => ({ ...participant })),
        totalMessages: overview.totalMessages,
        period
      },
      {
        id: "overview",
        type: "overview",
        totalMessages: overview.totalMessages,
        totalWords: overview.totalWords,
        totalCharacters: overview.totalCharacters,
        messagesWithText: overview.messagesWithText,
        durationMs: overview.durationMs,
        activeDays: overview.activeDays,
        averageMessagesPerActiveDay: overview.averageMessagesPerActiveDay,
        averageWordsPerMessage: overview.averageWordsPerMessage,
        averageCharactersPerMessage: overview.averageCharactersPerMessage
      },
      {
        id: "activity",
        type: "activity",
        byDay: activity.byDay.map(item => ({ ...item })),
        byMonth: activity.byMonth.map(item => ({ ...item })),
        byHour: activity.byHour.map(item => ({ ...item })),
        byWeekday: activity.byWeekday.map(item => ({ ...item })),
        mostActiveDay: activity.mostActiveDay ? { ...activity.mostActiveDay } : null,
        mostActiveMonth: activity.mostActiveMonth ? { ...activity.mostActiveMonth } : null,
        mostActiveHour: activity.mostActiveHour ? { ...activity.mostActiveHour } : null,
        mostActiveWeekday: activity.mostActiveWeekday ? { ...activity.mostActiveWeekday } : null,
        longestActiveStreak: activity.longestActiveStreak,
        longestGapMs: activity.longestGapMs
      },
      {
        id: "participants",
        type: "participants",
        participants: participantStats.map(participant => ({
          id: participant.participantId,
          name: participantNames.get(participant.participantId) ?? participant.participantId,
          messageCount: participant.messageCount,
          messageShare: participant.messageShare,
          wordCount: participant.wordCount,
          wordShare: participant.wordShare,
          characterCount: participant.characterCount,
          averageMessageLength: participant.averageMessageLength,
          nightMessages: participant.nightMessages,
          emojiCount: participant.emojiCount,
          startedConversations: participant.startedConversations
        }))
      },
      {
        id: "text",
        type: "text",
        mostFrequentWords: text.mostFrequentWords.map(item => ({ ...item })),
        mostFrequentPhrases: text.mostFrequentPhrases.map(item => ({ ...item })),
        mostFrequentEmojis: text.mostFrequentEmojis.map(item => ({ ...item })),
        longestMessage: text.longestMessage ? { ...text.longestMessage } : null,
        shortestMessage: text.shortestMessage ? { ...text.shortestMessage } : null,
        mostRepeatedMessage: text.mostRepeatedMessage ? { ...text.mostRepeatedMessage } : null
      },
      {
        id: "conversations",
        type: "conversations",
        totalConversations: conversations.totalConversations,
        averageDurationMs: conversations.averageDurationMs,
        longestDurationMs: conversations.longestDurationMs,
        averageResponseTimeMs: conversations.averageResponseTimeMs,
        fastestResponseTimeMs: conversations.fastestResponseTimeMs,
        longestResponseTimeMs: conversations.longestResponseTimeMs,
        maxConsecutiveMessages: conversations.maxConsecutiveMessages
      },
      {
        id: "achievements",
        type: "achievements",
        achievements: analysis.achievements.map(achievement => ({
          ...achievement
        }))
      }
    ];

    return {
      chatTitle: chat.title,
      slides
    };
  }
}
