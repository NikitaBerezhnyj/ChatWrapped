import { describe, expect, it } from "vitest";
import { parseChatExport } from "./parse-chat-export";

function createExport(messages: unknown[]): string {
  return JSON.stringify({ type: "personal_chat", id: 1, name: "Test chat", messages });
}

describe("parseChatExport", () => {
  it("reads a chat from a Telegram export", () => {
    const text = createExport([
      {
        id: 1,
        type: "message",
        date_unixtime: "1601907252",
        from: "Alice",
        from_id: "user1",
        text: "Hello!"
      }
    ]);

    const chat = parseChatExport(text);

    expect(chat.title).toBe("Test chat");
    expect(chat.messages).toHaveLength(1);
  });

  it("rejects text that is not JSON", () => {
    expect(() => parseChatExport("<html></html>")).toThrow(/valid JSON/);
  });

  it("explains how to export a single chat", () => {
    const text = JSON.stringify({ chats: { list: [] } });

    expect(() => parseChatExport(text)).toThrow(/single chat/i);
  });

  it("rejects a chat without messages", () => {
    expect(() => parseChatExport(createExport([]))).toThrow(/no messages/i);
  });
});
