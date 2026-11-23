import type { Achievement } from "../../achievements";

export type PresentationSlideType =
  "cover" | "overview" | "activity" | "participants" | "text" | "conversations" | "achievements";

export interface PresentationParticipant {
  id: string;
  name: string;
}

export interface PresentationSlideBase {
  id: string;
  type: PresentationSlideType;
}

export interface CoverSlide extends PresentationSlideBase {
  type: "cover";
  chatTitle: string;
  participants: PresentationParticipant[];
  totalMessages: number;
  period: {
    start: number | null;
    end: number | null;
  };
}

export interface OverviewSlide extends PresentationSlideBase {
  type: "overview";
  totalMessages: number;
  totalWords: number;
  totalCharacters: number;
  messagesWithText: number;
  durationMs: number;
  activeDays: number;
  averageMessagesPerActiveDay: number;
  averageWordsPerMessage: number;
  averageCharactersPerMessage: number;
}

export interface ActivitySlide extends PresentationSlideBase {
  type: "activity";
  byDay: Array<{
    date: string;
    count: number;
  }>;
  byMonth: Array<{
    month: string;
    count: number;
  }>;
  byHour: Array<{
    hour: number;
    count: number;
  }>;
  byWeekday: Array<{
    weekday: number;
    count: number;
  }>;
  mostActiveDay: {
    date: string;
    count: number;
  } | null;
  mostActiveMonth: {
    month: string;
    count: number;
  } | null;
  mostActiveHour: {
    hour: number;
    count: number;
  } | null;
  mostActiveWeekday: {
    weekday: number;
    count: number;
  } | null;
  longestActiveStreak: number;
  longestGapMs: number;
}

export interface ParticipantsSlide extends PresentationSlideBase {
  type: "participants";
  participants: Array<{
    id: string;
    name: string;
    messageCount: number;
    messageShare: number;
    wordCount: number;
    wordShare: number;
    characterCount: number;
    averageMessageLength: number;
    nightMessages: number;
    emojiCount: number;
    startedConversations: number;
  }>;
}

export interface TextSlide extends PresentationSlideBase {
  type: "text";
  mostFrequentWords: Array<{
    word: string;
    count: number;
  }>;
  mostFrequentPhrases: Array<{
    phrase: string;
    count: number;
  }>;
  mostFrequentEmojis: Array<{
    emoji: string;
    count: number;
  }>;
  longestMessage: {
    text: string;
    characterCount: number;
  } | null;
  shortestMessage: {
    text: string;
    characterCount: number;
  } | null;
  mostRepeatedMessage: {
    text: string;
    count: number;
  } | null;
}

export interface ConversationsSlide extends PresentationSlideBase {
  type: "conversations";
  totalConversations: number;
  averageDurationMs: number;
  longestDurationMs: number;
  averageResponseTimeMs: number;
  fastestResponseTimeMs: number;
  longestResponseTimeMs: number;
  maxConsecutiveMessages: number;
}

export interface AchievementsSlide extends PresentationSlideBase {
  type: "achievements";
  achievements: Achievement[];
}

export type PresentationSlide =
  | CoverSlide
  | OverviewSlide
  | ActivitySlide
  | ParticipantsSlide
  | TextSlide
  | ConversationsSlide
  | AchievementsSlide;

export interface PresentationData {
  chatTitle: string;
  slides: PresentationSlide[];
}
