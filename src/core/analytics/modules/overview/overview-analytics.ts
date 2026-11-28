import { format } from "date-fns";
import type { NormalizedMessage } from "../../../normalization";
import { getZonedDate } from "../../time";
import type { AnalysisOptions, OverviewStats } from "../../types";

function getActiveDays(messages: NormalizedMessage[], timezone: string): Set<string> {
  return new Set(
    messages.map(message => format(getZonedDate(message.timestamp, timezone), "yyyy-MM-dd"))
  );
}

function getMediaCounts(messages: NormalizedMessage[]): OverviewStats["mediaCounts"] {
  const counts = new Map<OverviewStats["mediaCounts"][number]["type"], number>();

  for (const { type } of messages) {
    if (type !== "text" && type !== "other") {
      counts.set(type, (counts.get(type) ?? 0) + 1);
    }
  }

  return [...counts]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count || a.type.localeCompare(b.type));
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
      averageCharactersPerMessage: 0,
      mediaCounts: []
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

    averageCharactersPerMessage: totalCharacters / (messagesWithText.length || 1),

    mediaCounts: getMediaCounts(messages)
  };
}
