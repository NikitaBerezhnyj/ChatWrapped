export interface OverviewStats {
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

export interface ActivityStats {
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

export interface TextStats {
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
    messageId: string;
    text: string;
    characterCount: number;
  } | null;

  shortestMessage: {
    messageId: string;
    text: string;
    characterCount: number;
  } | null;

  mostRepeatedMessage: {
    text: string;
    count: number;
  } | null;
}

export interface ParticipantStats {
  participantId: string;
  messageCount: number;
  messageShare: number;

  wordCount: number;
  wordShare: number;

  characterCount: number;
  averageMessageLength: number;

  nightMessages: number;
  emojiCount: number;

  startedConversations: number;
}

export interface ConversationStats {
  totalConversations: number;
  averageDurationMs: number;
  longestDurationMs: number;

  averageResponseTimeMs: number;
  fastestResponseTimeMs: number;
  longestResponseTimeMs: number;

  maxConsecutiveMessages: number;
}

export interface AnalyticsResult {
  overview: OverviewStats;
  activity: ActivityStats;
  text: TextStats;
  participants: ParticipantStats[];
  conversations: ConversationStats;
}
