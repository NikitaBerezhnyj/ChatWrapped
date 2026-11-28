import type { NormalizedMessage } from "../../../normalization";
import type { AnalysisOptions } from "../../types";

const MINIMUM_USES = 5;
const DISTINCTIVE_RATIO = 2;

export interface DistinctiveWord {
  word: string;
  count: number;
}

interface WordStatistics {
  countsBySender: Map<string, Map<string, number>>;
  totalsBySender: Map<string, number>;
  totalCounts: Map<string, number>;
  totalWords: number;
}

function collectWordStatistics(
  messages: NormalizedMessage[],
  minimumWordLength: number
): WordStatistics {
  const countsBySender = new Map<string, Map<string, number>>();
  const totalsBySender = new Map<string, number>();
  const totalCounts = new Map<string, number>();
  let totalWords = 0;

  for (const message of messages) {
    if (!message.senderId) {
      continue;
    }

    const counts = countsBySender.get(message.senderId) ?? new Map<string, number>();
    countsBySender.set(message.senderId, counts);

    for (const token of message.tokens) {
      if (token.length < minimumWordLength) {
        continue;
      }

      counts.set(token, (counts.get(token) ?? 0) + 1);
      totalCounts.set(token, (totalCounts.get(token) ?? 0) + 1);
      totalsBySender.set(message.senderId, (totalsBySender.get(message.senderId) ?? 0) + 1);
      totalWords += 1;
    }
  }

  return {
    countsBySender,
    totalsBySender,
    totalCounts,
    totalWords
  };
}

function isDistinctiveWord(
  count: number,
  othersCount: number,
  ownWords: number,
  othersWords: number
): boolean {
  return count >= MINIMUM_USES && count * othersWords >= DISTINCTIVE_RATIO * othersCount * ownWords;
}

export function getDistinctiveWords(
  messages: NormalizedMessage[],
  options: Pick<AnalysisOptions, "minimumWordLength">,
  limit: number
): Map<string, DistinctiveWord[]> {
  const { countsBySender, totalsBySender, totalCounts, totalWords } = collectWordStatistics(
    messages,
    options.minimumWordLength
  );

  const result = new Map<string, DistinctiveWord[]>();

  for (const [senderId, counts] of countsBySender) {
    const ownWords = totalsBySender.get(senderId) ?? 0;
    const othersWords = totalWords - ownWords;
    const words: DistinctiveWord[] = [];

    if (othersWords > 0) {
      for (const [word, count] of counts) {
        const othersCount = (totalCounts.get(word) ?? 0) - count;

        if (isDistinctiveWord(count, othersCount, ownWords, othersWords)) {
          words.push({ word, count });
        }
      }
    }

    words.sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
    result.set(senderId, words.slice(0, limit));
  }

  return result;
}
