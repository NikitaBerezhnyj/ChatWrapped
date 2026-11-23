import type { NormalizedMessage } from "../../../normalization";
import type { AnalysisOptions, TextStats } from "../../types";

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

function getMostRepeatedMessage(messages: NormalizedMessage[]): TextStats["mostRepeatedMessage"] {
  const textMessages = messages.filter(message => message.normalizedText.length > 0);

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

    for (const size of [2, 3, 4]) {
      for (const phrase of getNGrams(message.tokens, size)) {
        incrementCount(phraseCounts, phrase);
      }
    }

    for (const emoji of message.emojis) {
      incrementCount(emojiCounts, emoji);
    }
  }

  return {
    mostFrequentWords: getTopEntries(wordCounts, options.topWordsLimit).map(({ key, count }) => ({
      word: key,
      count
    })),

    mostFrequentPhrases: getTopEntries(phraseCounts, options.topPhrasesLimit).map(
      ({ key, count }) => ({
        phrase: key,
        count
      })
    ),

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
