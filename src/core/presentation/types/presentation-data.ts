import type { Achievement } from "../../achievements";
import type { ConversationStats, OverviewStats } from "../../analytics";

export type PresentationSlideType =
  | "cover"
  | "overview"
  | "activity"
  | "participants"
  | "text"
  | "conversations"
  | "achievements"
  | "finale";

export type PresentationSlideKind =
  | "cover"
  | "overview_volume"
  | "overview_duration"
  | "overview_pace"
  | "overview_media"
  | "activity_peak"
  | "activity_rhythm"
  | "activity_streak"
  | "activity_silence"
  | "activity_monthly"
  | "participants_balance"
  | "participant_profile"
  | "text_words"
  | "text_phrases"
  | "text_emojis"
  | "text_repeated"
  | "text_length"
  | "conversations_overview"
  | "conversations_participants"
  | "conversations_responses"
  | "achievement"
  | "achievements_recap"
  | "finale";

export interface PresentationParticipant {
  id: string;
  name: string;
}

export interface PresentationSlideBase {
  id: string;
  type: PresentationSlideType;
  kind: PresentationSlideKind;
}

export interface CoverSlide extends PresentationSlideBase {
  type: "cover";
  kind: "cover";
  chatTitle: string;
  participants: PresentationParticipant[];
  totalMessages: number;
  period: {
    start: number | null;
    end: number | null;
  };
}

export interface OverviewVolumeSlide extends PresentationSlideBase {
  type: "overview";
  kind: "overview_volume";
  totalMessages: number;
  totalWords: number;
  totalCharacters: number;
  messagesWithText: number;
}

export interface OverviewDurationSlide extends PresentationSlideBase {
  type: "overview";
  kind: "overview_duration";
  durationMs: number;
  activeDays: number;
  period: {
    start: number | null;
    end: number | null;
  };
}

export interface OverviewPaceSlide extends PresentationSlideBase {
  type: "overview";
  kind: "overview_pace";
  averageMessagesPerActiveDay: number;
  averageWordsPerMessage: number;
  averageCharactersPerMessage: number;
}

export interface OverviewMediaSlide extends PresentationSlideBase {
  type: "overview";
  kind: "overview_media";
  totalMedia: number;
  mediaCounts: OverviewStats["mediaCounts"];
}

export interface ActivityPeakSlide extends PresentationSlideBase {
  type: "activity";
  kind: "activity_peak";
  mostActiveDay: { date: string; count: number };
  mostActiveMonth: { month: string; count: number };
  mostActiveHour: { hour: number; count: number };
  mostActiveWeekday: { weekday: number; count: number };
}

export interface ActivityRhythmSlide extends PresentationSlideBase {
  type: "activity";
  kind: "activity_rhythm";
  byHour: Array<{ hour: number; count: number }>;
  byWeekday: Array<{ weekday: number; count: number }>;
}

export interface ActivityStreakSlide extends PresentationSlideBase {
  type: "activity";
  kind: "activity_streak";
  longestActiveStreak: number;
}

export interface ActivitySilenceSlide extends PresentationSlideBase {
  type: "activity";
  kind: "activity_silence";
  longestGapMs: number;
}

export interface ActivityMonthlySlide extends PresentationSlideBase {
  type: "activity";
  kind: "activity_monthly";
  byMonth: Array<{ month: string; count: number }>;
}

export interface ParticipantsBalanceSlide extends PresentationSlideBase {
  type: "participants";
  kind: "participants_balance";
  participants: ParticipantStatistics[];
}

export interface ParticipantStatistics {
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
  endedConversations: number;
  medianResponseTimeMs: number;
  responseCount: number;
  maxConsecutiveMessages: number;
  distinctiveWords: Array<{ word: string; count: number }>;
}

export interface ParticipantProfileSlide extends PresentationSlideBase {
  type: "participants";
  kind: "participant_profile";
  participant: ParticipantStatistics;
  totalParticipants: number;
}

export interface TextWordsSlide extends PresentationSlideBase {
  type: "text";
  kind: "text_words";
  words: Array<{ word: string; count: number }>;
}

export interface TextPhrasesSlide extends PresentationSlideBase {
  type: "text";
  kind: "text_phrases";
  phrases: Array<{ phrase: string; count: number }>;
}

export interface TextEmojisSlide extends PresentationSlideBase {
  type: "text";
  kind: "text_emojis";
  emojis: Array<{ emoji: string; count: number }>;
}

export interface TextRepeatedSlide extends PresentationSlideBase {
  type: "text";
  kind: "text_repeated";
  text: string;
  repetitionCount: number;
}

export interface TextLengthSlide extends PresentationSlideBase {
  type: "text";
  kind: "text_length";
  longestCharacterCount: number;
  shortestCharacterCount: number;
}

export interface ConversationsOverviewSlide extends PresentationSlideBase {
  type: "conversations";
  kind: "conversations_overview";
  totalConversations: number;
  averageDurationMs: number;
  longestDurationMs: number;
}

export interface ConversationsParticipantsSlide extends PresentationSlideBase {
  type: "conversations";
  kind: "conversations_participants";
  participants: Array<
    Pick<
      ParticipantStatistics,
      | "id"
      | "name"
      | "startedConversations"
      | "endedConversations"
      | "medianResponseTimeMs"
      | "responseCount"
    >
  >;
}

export interface ConversationsResponsesSlide extends PresentationSlideBase {
  type: "conversations";
  kind: "conversations_responses";
  medianResponseTimeMs: number;
  responseTimeShares: ConversationStats["responseTimeShares"];
}

export interface AchievementSlide extends PresentationSlideBase {
  type: "achievements";
  kind: "achievement";
  achievement: Achievement;
  holders: PresentationParticipant[];
}

export interface AchievementsRecapSlide extends PresentationSlideBase {
  type: "achievements";
  kind: "achievements_recap";
  achievements: Achievement[];
}

export interface FinaleSlide extends PresentationSlideBase {
  type: "finale";
  kind: "finale";
  chatTitle: string;
  totalMessages: number;
  totalWords: number;
  totalParticipants: number;
  activeDays: number;
}

export type PresentationSlide =
  | CoverSlide
  | OverviewVolumeSlide
  | OverviewDurationSlide
  | OverviewPaceSlide
  | OverviewMediaSlide
  | ActivityPeakSlide
  | ActivityRhythmSlide
  | ActivityStreakSlide
  | ActivitySilenceSlide
  | ActivityMonthlySlide
  | ParticipantsBalanceSlide
  | ParticipantProfileSlide
  | TextWordsSlide
  | TextPhrasesSlide
  | TextEmojisSlide
  | TextRepeatedSlide
  | TextLengthSlide
  | ConversationsOverviewSlide
  | ConversationsParticipantsSlide
  | ConversationsResponsesSlide
  | AchievementSlide
  | AchievementsRecapSlide
  | FinaleSlide;

export interface PresentationData {
  chatTitle: string;
  slides: PresentationSlide[];
}
