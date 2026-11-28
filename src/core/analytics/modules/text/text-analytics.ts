import type { NormalizedMessage } from "../../../normalization";
import type { AnalysisOptions, TextStats } from "../../types";

const PHRASE_SIZES = [2, 3, 4];

interface CountEntry {
  key: string;
  count: number;
}

function incrementCount(map: Map<string, number>, key: string): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function getTopEntries(map: Map<string, number>, limit: number): CountEntry[] {
  return [...map.entries()]
    .map(([key, count]) => ({
      key,
      count
    }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }

      return a.key.localeCompare(b.key);
    })
    .slice(0, limit);
}

function getNGrams(tokens: string[], size: number): string[] {
  const nGrams: string[] = [];

  for (let index = 0; index <= tokens.length - size; index += 1) {
    nGrams.push(tokens.slice(index, index + size).join(" "));
  }

  return nGrams;
}

function getLongestMessage(messages: NormalizedMessage[]): TextStats["longestMessage"] {
  const textMessages = messages.filter(message => message.originalText !== null);

  if (textMessages.length === 0) {
    return null;
  }

  const message = textMessages.reduce((longest, current) => {
    if (current.characterCount > longest.characterCount) {
      return current;
    }

    return longest;
  });

  return {
    messageId: message.id,
    text: message.originalText ?? "",
    characterCount: message.characterCount
  };
}

function getShortestMessage(messages: NormalizedMessage[]): TextStats["shortestMessage"] {
  const textMessages = messages.filter(message => message.originalText !== null);

  if (textMessages.length === 0) {
    return null;
  }

  const message = textMessages.reduce((shortest, current) => {
    if (current.characterCount < shortest.characterCount) {
      return current;
    }

    return shortest;
  });

  return {
    messageId: message.id,
    text: message.originalText ?? "",
    characterCount: message.characterCount
  };
}

function getClosedPhrases(
  phraseCounts: Map<string, number>,
  minimumCount: number
): Map<string, number> {
  const covered = new Set<string>();

  for (const [phrase, count] of phraseCounts) {
    if (count < minimumCount) {
      continue;
    }

    const tokens = phrase.split(" ");

    if (tokens.length < 3) {
      continue;
    }

    const prefix = tokens.slice(0, -1).join(" ");
    const suffix = tokens.slice(1).join(" ");

    if (phraseCounts.get(prefix) === count) {
      covered.add(prefix);
    }

    if (phraseCounts.get(suffix) === count) {
      covered.add(suffix);
    }
  }

  const result = new Map<string, number>();

  for (const [phrase, count] of phraseCounts) {
    if (count >= minimumCount && !covered.has(phrase)) {
      result.set(phrase, count);
    }
  }

  return result;
}

function countMessagePhrases(tokens: string[], phraseCounts: Map<string, number>): void {
  const messagePhrases = new Set<string>();

  for (const size of PHRASE_SIZES) {
    for (const phrase of getNGrams(tokens, size)) {
      messagePhrases.add(phrase);
    }
  }

  for (const phrase of messagePhrases) {
    incrementCount(phraseCounts, phrase);
  }
}

function getMostRepeatedMessage(messages: NormalizedMessage[]): TextStats["mostRepeatedMessage"] {
  const textMessages = messages.filter(
    message => message.tokens.length > 0 || message.emojis.length > 0
  );

  if (textMessages.length === 0) {
    return null;
  }

  const counts = new Map<
    string,
    {
      text: string;
      count: number;
    }
  >();

  for (const message of textMessages) {
    const existing = counts.get(message.normalizedText);

    if (existing) {
      existing.count += 1;
      continue;
    }

    counts.set(message.normalizedText, {
      text: message.originalText ?? "",
      count: 1
    });
  }

  let mostRepeated: {
    text: string;
    count: number;
  } | null = null;

  for (const entry of counts.values()) {
    if (mostRepeated === null || entry.count > mostRepeated.count) {
      mostRepeated = entry;
    }
  }

  return mostRepeated && mostRepeated.count > 1 ? mostRepeated : null;
}

export function analyzeText(messages: NormalizedMessage[], options: AnalysisOptions): TextStats {
  if (messages.length === 0) {
    return {
      mostFrequentWords: [],
      mostFrequentPhrases: [],
      mostFrequentEmojis: [],
      longestMessage: null,
      shortestMessage: null,
      mostRepeatedMessage: null
    };
  }

  const wordCounts = new Map<string, number>();
  const phraseCounts = new Map<string, number>();
  const emojiCounts = new Map<string, number>();

  for (const message of messages) {
    for (const token of message.tokens) {
      if (token.length >= options.minimumWordLength) {
        incrementCount(wordCounts, token);
      }
    }

    countMessagePhrases(message.tokens, phraseCounts);

    for (const emoji of message.emojis) {
      incrementCount(emojiCounts, emoji);
    }
  }

  return {
    mostFrequentWords: getTopEntries(wordCounts, options.topWordsLimit).map(({ key, count }) => ({
      word: key,
      count
    })),

    mostFrequentPhrases: getTopEntries(
      getClosedPhrases(phraseCounts, options.minimumPhraseCount),
      options.topPhrasesLimit
    ).map(({ key, count }) => ({
      phrase: key,
      count
    })),

    mostFrequentEmojis: getTopEntries(emojiCounts, options.topEmojisLimit).map(
      ({ key, count }) => ({
        emoji: key,
        count
      })
    ),

    longestMessage: getLongestMessage(messages),
    shortestMessage: getShortestMessage(messages),
    mostRepeatedMessage: getMostRepeatedMessage(messages)
  };
}
