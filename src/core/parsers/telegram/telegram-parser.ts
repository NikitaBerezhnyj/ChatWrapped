import type { ChatData, ChatType, Participant } from "../../models";
import { parseTelegramMessage } from "./telegram-message-parser";
import type { TelegramExport } from "./telegram-types";
import { validateTelegramExport } from "./telegram-validator";

function parseChatType(type: string): ChatType {
  switch (type) {
    case "saved_messages":
      return "saved_messages";

    case "personal_chat":
    case "bot_chat":
      return "private";

    case "private_group":
    case "public_group":
      return "group";

    default:
      return "unknown";
  }
}

function parseParticipants(exportData: TelegramExport): Participant[] {
  const participants = new Map<string, Participant>();

  for (const message of exportData.messages) {
    if (!message.from_id) {
      continue;
    }

    participants.set(message.from_id, {
      id: message.from_id,
      name: message.from ?? message.from_id
    });
  }

  if (exportData.type === "saved_messages" && participants.size === 0) {
    const id = `user${exportData.id}`;

    participants.set(id, {
      id,
      name: exportData.name ?? "Me"
    });
  }

  return [...participants.values()];
}

export class TelegramParser {
  parse(input: unknown): ChatData {
    const exportData = validateTelegramExport(input);

    const type = parseChatType(exportData.type);

    const messages = exportData.messages
      .filter(message => message.type === "message")
      .map(parseTelegramMessage)
      .sort((a, b) => a.timestamp - b.timestamp);

    return {
      id: String(exportData.id),
      title: exportData.name ?? (type === "saved_messages" ? "Saved Messages" : "Untitled chat"),
      type,
      participants: parseParticipants(exportData),
      messages
    };
  }
}
