import type { Message, MessageType } from "../../models";
import type { TelegramMessage, TelegramText } from "./telegram-types";

function extractText(value: TelegramText | undefined): string | null {
  if (typeof value === "string") {
    const text = value.trim();
    return text.length > 0 ? text : null;
  }

  if (!Array.isArray(value)) {
    return null;
  }

  const text = value
    .map(part => {
      return typeof part === "string" ? part : part.text;
    })
    .join("")
    .trim();

  return text.length > 0 ? text : null;
}

function parseTimestamp(message: TelegramMessage): number {
  if (message.date_unixtime) {
    const seconds = Number(message.date_unixtime);

    if (Number.isFinite(seconds)) {
      return seconds * 1000;
    }
  }

  if (message.date) {
    const timestamp = Date.parse(message.date);

    if (Number.isFinite(timestamp)) {
      return timestamp;
    }
  }

  throw new Error(`Message ${message.id} has no valid timestamp.`);
}

function parseMessageType(message: TelegramMessage): MessageType {
  if (message.media_type === "voice_message") {
    return "voice";
  }

  if (message.media_type === "audio_file") {
    return "audio";
  }

  if (message.media_type === "sticker") {
    return "sticker";
  }

  if (message.media_type === "video_file") {
    return "video";
  }

  if (message.media_type === "photo") {
    return "photo";
  }

  if (message.media_type === "location") {
    return "location";
  }

  if (message.photo) {
    return "photo";
  }

  if (message.sticker_emoji) {
    return "sticker";
  }

  if (message.file) {
    return "file";
  }

  if (message.text) {
    return "text";
  }

  return "other";
}

export function parseTelegramMessage(message: TelegramMessage): Message {
  return {
    id: String(message.id),
    senderId: message.from_id ?? null,
    timestamp: parseTimestamp(message),
    text: extractText(message.text),
    type: parseMessageType(message),
    ...(message.reply_to_message_id !== undefined && {
      replyToId: String(message.reply_to_message_id)
    })
  };
}
