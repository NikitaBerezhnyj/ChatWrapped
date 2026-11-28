import type { Message, MessageType } from "../models";
import { extractEmojis } from "./extract-emojis";
import { normalizeText } from "./normalize-text";
import { removeLinks } from "./remove-links";
import { tokenize } from "./tokenize";

export interface NormalizedMessage {
  id: string;
  senderId: string | null;
  timestamp: number;
  type: MessageType;

  originalText: string | null;
  normalizedText: string;

  tokens: string[];
  emojis: string[];

  wordCount: number;
  characterCount: number;
}

export function normalizeMessage(message: Message): NormalizedMessage {
  const originalText = message.text;
  const normalizedText = originalText ? normalizeText(originalText) : "";

  const tokens = originalText ? tokenize(removeLinks(originalText)) : [];

  const emojis = originalText ? extractEmojis(originalText) : [];

  return {
    id: message.id,
    senderId: message.senderId,
    timestamp: message.timestamp,
    type: message.type,

    originalText,
    normalizedText,

    tokens,
    emojis,

    wordCount: tokens.length,
    characterCount: originalText?.length ?? 0
  };
}
