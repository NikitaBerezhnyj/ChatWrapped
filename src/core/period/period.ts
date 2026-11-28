import { format } from "date-fns";
import { getZonedDate } from "../analytics/time";
import type { ChatData } from "../models";

export type Period = string | null;

export interface AvailablePeriods {
  years: string[];
  months: string[];
}

function getMonth(timestamp: number, timezone: string): string {
  return format(getZonedDate(timestamp, timezone), "yyyy-MM");
}

export function getAvailablePeriods(chat: ChatData, timezone: string): AvailablePeriods {
  const uniqueMonths = new Set(chat.messages.map(message => getMonth(message.timestamp, timezone)));
  const months = [...uniqueMonths].sort().reverse();
  const years = [...new Set(months.map(month => month.slice(0, 4)))];

  return { years, months };
}

export function filterChatByPeriod(chat: ChatData, period: Period, timezone: string): ChatData {
  if (period === null) {
    return chat;
  }

  const messages = chat.messages.filter(message =>
    getMonth(message.timestamp, timezone).startsWith(period)
  );
  const senderIds = new Set(messages.map(message => message.senderId));

  return {
    ...chat,
    messages,
    participants: chat.participants.filter(participant => senderIds.has(participant.id))
  };
}
