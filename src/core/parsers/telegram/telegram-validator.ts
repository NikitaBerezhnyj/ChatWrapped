import type { TelegramExport, TelegramMessage } from "./telegram-types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTelegramMessage(value: unknown): value is TelegramMessage {
  if (!isRecord(value)) {
    return false;
  }

  return typeof value.id === "number" && typeof value.type === "string";
}

export function validateTelegramExport(input: unknown): TelegramExport {
  if (!isRecord(input)) {
    throw new Error("Invalid Telegram export: expected an object.");
  }

  if (isRecord(input.chats)) {
    throw new Error(
      "This is a full Telegram account export. Export a single chat instead: open it in Telegram Desktop, choose ⋮ → Export chat history, and select Machine-readable JSON."
    );
  }

  if (typeof input.type !== "string") {
    throw new Error("Invalid Telegram export: missing chat type.");
  }

  if (typeof input.id !== "number") {
    throw new Error("Invalid Telegram export: missing chat ID.");
  }

  if (!Array.isArray(input.messages)) {
    throw new Error("Invalid Telegram export: messages must be an array.");
  }

  if (!input.messages.every(isTelegramMessage)) {
    throw new Error("Invalid Telegram export: invalid message structure.");
  }

  return input as unknown as TelegramExport;
}
