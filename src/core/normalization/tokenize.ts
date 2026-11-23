import { normalizeText } from "./normalize-text";

const WORD_REGEX = /[\p{L}\p{M}\p{N}]+(?:['’ʼ-][\p{L}\p{M}\p{N}]+)*/gu;

export function tokenize(text: string): string[] {
  const normalized = normalizeText(text);
  return normalized.match(WORD_REGEX) ?? [];
}
