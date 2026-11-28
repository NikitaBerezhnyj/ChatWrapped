import { describe, expect, it } from "vitest";
import type { ChatData } from "../models";
import { filterChatByPeriod, getAvailablePeriods } from "./period";

const chat: ChatData = {
  id: "chat-1",
  title: "Test chat",
  type: "private",
  participants: [
    { id: "user-1", name: "Alice" },
    { id: "user-2", name: "Bob" }
  ],
  messages: [
    { id: "1", senderId: "user-1", timestamp: Date.UTC(2025, 0, 15), type: "text", text: "a" },
    { id: "2", senderId: "user-2", timestamp: Date.UTC(2025, 2, 15), type: "text", text: "b" },
    { id: "3", senderId: "user-1", timestamp: Date.UTC(2025, 11, 31, 23), type: "text", text: "c" }
  ]
};

describe("getAvailablePeriods", () => {
  it("returns years and months with messages, newest first", () => {
    expect(getAvailablePeriods(chat, "UTC")).toEqual({
      years: ["2025"],
      months: ["2025-12", "2025-03", "2025-01"]
    });
  });

  it("uses the given timezone", () => {
    expect(getAvailablePeriods(chat, "Europe/Kyiv").years).toEqual(["2026", "2025"]);
  });
});

describe("filterChatByPeriod", () => {
  it("returns the whole chat for all time", () => {
    expect(filterChatByPeriod(chat, null, "UTC")).toBe(chat);
  });

  it("keeps messages of the selected year", () => {
    expect(filterChatByPeriod(chat, "2025", "Europe/Kyiv").messages).toHaveLength(2);
  });

  it("keeps only participants who wrote in the selected month", () => {
    const result = filterChatByPeriod(chat, "2025-03", "UTC");

    expect(result.messages.map(message => message.id)).toEqual(["2"]);
    expect(result.participants).toEqual([{ id: "user-2", name: "Bob" }]);
  });
});
