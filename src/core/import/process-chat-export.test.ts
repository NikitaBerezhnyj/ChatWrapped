import { describe, expect, it } from "vitest";
import { processChatExport } from "./process-chat-export";

function createExport(messages: unknown[]): string {
  return JSON.stringify({ type: "personal_chat", id: 1, name: "Test chat", messages });
}

describe("processChatExport", () => {
  it("builds presentation data from a Telegram export", async () => {
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

    const data = await processChatExport(text);

    expect(data.chatTitle).toBe("Test chat");
    expect(data.slides[0].kind).toBe("cover");
  });

  it("rejects text that is not JSON", async () => {
    await expect(processChatExport("<html></html>")).rejects.toThrow(/valid JSON/);
  });

  it("explains how to export a single chat", async () => {
    const text = JSON.stringify({ chats: { list: [] } });

    await expect(processChatExport(text)).rejects.toThrow(/single chat/i);
  });

  it("rejects a chat without messages", async () => {
    await expect(processChatExport(createExport([]))).rejects.toThrow(/no messages/i);
  });
});
