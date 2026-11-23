import type { Message } from "./message";
import type { Participant } from "./participant";

export type ChatType = "saved_messages" | "private" | "group" | "unknown";

export interface ChatData {
  id: string;
  title: string;
  type: ChatType;
  participants: Participant[];
  messages: Message[];
}
