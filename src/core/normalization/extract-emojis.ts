import emojiRegex from "emoji-regex";

export function extractEmojis(text: string): string[] {
  return text.match(emojiRegex()) ?? [];
}
