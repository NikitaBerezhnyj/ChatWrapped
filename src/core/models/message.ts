export type MessageType =
  "text" | "photo" | "video" | "voice" | "audio" | "file" | "sticker" | "location" | "other";

export interface Message {
  id: string;
  senderId: string | null;
  timestamp: number;
  text: string | null;
  type: MessageType;
  replyToId?: string;
}
