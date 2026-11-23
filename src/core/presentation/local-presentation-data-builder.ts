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
            start: timestamps.reduce((min, timestamp) => Math.min(min, timestamp), Infinity),
            end: timestamps.reduce((max, timestamp) => Math.max(max, timestamp), -Infinity)
          }
        : {
            start: null,
            end: null
          };

    const slides: PresentationSlide[] = [
      {
        id: "cover",
        type: "cover",
        title: "Your conversation",
        subtitle: "A story told through messages",
        chatTitle: chat.title,
        participants,
        totalMessages: analysis.analytics.overview.totalMessages,
        period
      },
      {
        id: "overview",
        type: "overview",
        title: "The big picture",
        subtitle: "Your conversation in numbers",
        totalMessages: analysis.analytics.overview.totalMessages,
        totalWords: analysis.analytics.overview.totalWords,
        totalCharacters: analysis.analytics.overview.totalCharacters,
        activeDays: analysis.analytics.overview.activeDays,
        durationMs: analysis.analytics.overview.durationMs
      },
      {
        id: "activity",
        type: "activity",
        title: "When you talked",
        subtitle: "A look at your conversation habits",
        mostActiveDay: analysis.analytics.activity.mostActiveDay,
        mostActiveHour: analysis.analytics.activity.mostActiveHour,
        longestActiveStreak: analysis.analytics.activity.longestActiveStreak,
        byHour: analysis.analytics.activity.byHour,
        byWeekday: analysis.analytics.activity.byWeekday
      },
      {
        id: "participants",
        type: "participants",
        title: "Who's behind the messages?",
        subtitle: "A comparison of conversation participants",
        participants: analysis.analytics.participants.map(participant => ({
          id: participant.participantId,
          name: participantNames.get(participant.participantId) ?? participant.participantId,
          messageCount: participant.messageCount,
          messageShare: participant.messageShare,
          wordCount: participant.wordCount,
          wordShare: participant.wordShare,
          averageMessageLength: participant.averageMessageLength
        }))
      },
      {
        id: "text",
        type: "text",
        title: "The language of your conversation",
        subtitle: "Words, phrases and emojis that stood out",
        mostFrequentWords: analysis.analytics.text.mostFrequentWords,
        mostFrequentPhrases: analysis.analytics.text.mostFrequentPhrases,
        mostFrequentEmojis: analysis.analytics.text.mostFrequentEmojis,
        longestMessage: analysis.analytics.text.longestMessage
          ? {
              text: analysis.analytics.text.longestMessage.text,
              characterCount: analysis.analytics.text.longestMessage.characterCount
            }
          : null
      },
      {
        id: "conversations",
        type: "conversations",
        title: "Every conversation counts",
        subtitle: "How your conversations unfolded",
        totalConversations: analysis.analytics.conversations.totalConversations,
        averageDurationMs: analysis.analytics.conversations.averageDurationMs,
        longestDurationMs: analysis.analytics.conversations.longestDurationMs,
        averageResponseTimeMs: analysis.analytics.conversations.averageResponseTimeMs,
        fastestResponseTimeMs: analysis.analytics.conversations.fastestResponseTimeMs,
        longestResponseTimeMs: analysis.analytics.conversations.longestResponseTimeMs,
        maxConsecutiveMessages: analysis.analytics.conversations.maxConsecutiveMessages
      },
      {
        id: "achievements",
        type: "achievements",
        title: "Your achievements",
        subtitle: "Milestones from your conversation",
        achievements: analysis.achievements
      }
    ];

    return {
      chatTitle: chat.title,
      slides
    };
  }
}
