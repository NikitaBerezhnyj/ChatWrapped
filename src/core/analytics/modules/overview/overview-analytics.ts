import { format } from "date-fns";
import type { NormalizedMessage } from "../../../normalization";
import type { AnalysisOptions, OverviewStats } from "../../types";
import { getZonedDate } from "../../time";

function getActiveDays(messages: NormalizedMessage[], timezone: string): Set<string> {
  return new Set(
    messages.map(message => format(getZonedDate(message.timestamp, timezone), "yyyy-MM-dd"))
  );
}

export function analyzeOverview(
  messages: NormalizedMessage[],
  options: Pick<AnalysisOptions, "timezone">
): OverviewStats {
  if (messages.length === 0) {
    return {
      totalMessages: 0,
      totalWords: 0,
      totalCharacters: 0,
      messagesWithText: 0,
      durationMs: 0,
      activeDays: 0,
      averageMessagesPerActiveDay: 0,
      averageWordsPerMessage: 0,
      averageCharactersPerMessage: 0
    };
  }

  const totalMessages = messages.length;

  const messagesWithText = messages.filter(message => message.originalText !== null);

  const totalWords = messages.reduce((total, message) => total + message.wordCount, 0);

  const totalCharacters = messages.reduce((total, message) => total + message.characterCount, 0);

  const activeDays = getActiveDays(messages, options.timezone).size;

  const { first, last } = messages.reduce(
    (range, message) => ({
      first: Math.min(range.first, message.timestamp),
      last: Math.max(range.last, message.timestamp)
    }),
    {
      first: Number.POSITIVE_INFINITY,
      last: Number.NEGATIVE_INFINITY
    }
  );

  const firstMessageTimestamp = first;
  const lastMessageTimestamp = last;

  return {
    totalMessages,
    totalWords,
    totalCharacters,
    messagesWithText: messagesWithText.length,

    durationMs: lastMessageTimestamp - firstMessageTimestamp,
    activeDays,

    averageMessagesPerActiveDay: totalMessages / activeDays,

    averageWordsPerMessage: totalWords / (messagesWithText.length || 1),

    averageCharactersPerMessage: totalCharacters / (messagesWithText.length || 1)
  };
}
