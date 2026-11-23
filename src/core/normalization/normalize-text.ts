import emojiRegex from "emoji-regex";

export function normalizeText(text: string): string {
  const emojis: string[] = [];

  const protectedText = text
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(emojiRegex(), emoji => {
      const placeholder = `EMOJIPROTECTED${emojis.length}TOKEN`;
      emojis.push(emoji);
      return placeholder;
    });

  const normalized = protectedText
    .replace(/[^\p{L}\p{M}\p{N}\s'’ʼ-]/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();

  return normalized.replace(
    /EMOJIPROTECTED(\d+)TOKEN/gu,
    (_, index: string) => emojis[Number(index)] ?? ""
  );
}
