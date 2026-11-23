import { describe, expect, it } from "vitest";
import { TelegramParser } from "./telegram-parser";

const parser = new TelegramParser();

describe("TelegramParser", () => {
  it("parses Saved Messages", () => {
    const result = parser.parse({
      type: "saved_messages",
      id: 123,
      messages: [
        {
          id: 1,
          type: "message",
          date_unixtime: "1601907252",
          from: "Nikita",
          from_id: "user123",
          text: "Hello!"
        }
      ]
    });

    expect(result.type).toBe("saved_messages");
    expect(result.participants).toHaveLength(1);
    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].text).toBe("Hello!");
  });

  it("parses a private chat with two participants", () => {
    const result = parser.parse({
      type: "personal_chat",
      id: 456,
      name: "Chat",
      messages: [
        {
          id: 1,
          type: "message",
          date_unixtime: "1601907252",
          from: "Nikita",
          from_id: "user1",
          text: "Hello!"
        },
        {
          id: 2,
          type: "message",
          date_unixtime: "1601907352",
          from: "Alex",
          from_id: "user2",
          text: "Hi!"
        }
      ]
    });

    expect(result.type).toBe("private");
    expect(result.participants).toHaveLength(2);
  });

  it("supports group chats with multiple participants", () => {
    const result = parser.parse({
      type: "private_group",
      id: 789,
      name: "Group",
      messages: [
        {
          id: 1,
          type: "message",
          date_unixtime: "1601907252",
          from: "Nikita",
          from_id: "user1",
          text: "Hello!"
        },
        {
          id: 2,
          type: "message",
          date_unixtime: "1601907352",
          from: "Alex",
          from_id: "user2",
          text: "Hi!"
        },
        {
          id: 3,
          type: "message",
          date_unixtime: "1601907452",
          from: "Sam",
          from_id: "user3",
          text: "Hey!"
        }
      ]
    });

    expect(result.type).toBe("group");
    expect(result.participants).toHaveLength(3);
  });

  it("ignores service messages", () => {
    const result = parser.parse({
      type: "personal_chat",
      id: 456,
      messages: [
        {
          id: 1,
          type: "service",
          date_unixtime: "1601907252",
          text: ""
        },
        {
          id: 2,
          type: "message",
          date_unixtime: "1601907352",
          text: "Hello!"
        }
      ]
    });

    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].id).toBe("2");
  });

  it("parses formatted text entities", () => {
    const result = parser.parse({
      type: "personal_chat",
      id: 456,
      messages: [
        {
          id: 1,
          type: "message",
          date_unixtime: "1601907252",
          text: [
            { type: "plain", text: "Hello, " },
            { type: "bold", text: "world!" }
          ]
        }
      ]
    });

    expect(result.messages[0].text).toBe("Hello, world!");
  });

  it("parses media-only messages", () => {
    const result = parser.parse({
      type: "saved_messages",
      id: 123,
      messages: [
        {
          id: 1,
          type: "message",
          date_unixtime: "1601907252",
          media_type: "audio_file",
          file: "audio.mp3"
        }
      ]
    });

    expect(result.messages[0].type).toBe("audio");
    expect(result.messages[0].text).toBeNull();
  });

  it("converts Unix timestamps to milliseconds", () => {
    const result = parser.parse({
      type: "personal_chat",
      id: 456,
      messages: [
        {
          id: 1,
          type: "message",
          date_unixtime: "1601907252",
          text: "Hello!"
        }
      ]
    });

    expect(result.messages[0].timestamp).toBe(1601907252000);
  });

  it("sorts messages chronologically", () => {
    const result = parser.parse({
      type: "personal_chat",
      id: 456,
      messages: [
        {
          id: 2,
          type: "message",
          date_unixtime: "1601907352",
          text: "Second"
        },
        {
          id: 1,
          type: "message",
          date_unixtime: "1601907252",
          text: "First"
        }
      ]
    });

    expect(result.messages[0].text).toBe("First");
    expect(result.messages[1].text).toBe("Second");
  });

  it("throws when the export structure is invalid", () => {
    expect(() => parser.parse(null)).toThrow();
    expect(() => parser.parse({ type: "personal_chat" })).toThrow();
  });

  it("throws when a message has no valid timestamp", () => {
    expect(() =>
      parser.parse({
        type: "personal_chat",
        id: 456,
        messages: [
          {
            id: 1,
            type: "message",
            text: "Hello!"
          }
        ]
      })
    ).toThrow(/timestamp/);
  });
});
