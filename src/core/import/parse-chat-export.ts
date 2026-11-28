import type { ChatData } from "../models";
import { TelegramParser } from "../parsers/telegram";

const parser = new TelegramParser();

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      "This file isn't valid JSON. When exporting from Telegram Desktop, choose Machine-readable JSON, not HTML."
    );
  }
}

export function parseChatExport(text: string): ChatData {
  const chat = parser.parse(parseJson(text));

  if (chat.messages.length === 0) {
    throw new Error("This chat has no messages to analyze.");
  }

  return chat;
}
