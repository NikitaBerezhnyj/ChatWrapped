import { TelegramParser } from "../parsers/telegram";
import { LocalPresentationService, type PresentationData } from "../presentation";

const parser = new TelegramParser();
const presentationService = new LocalPresentationService();

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      "This file isn't valid JSON. When exporting from Telegram Desktop, choose Machine-readable JSON, not HTML."
    );
  }
}

export async function processChatExport(text: string): Promise<PresentationData> {
  const chat = parser.parse(parseJson(text));

  if (chat.messages.length === 0) {
    throw new Error("This chat has no messages to analyze.");
  }

  const { data } = await presentationService.prepare(chat);

  return data;
}
