import { beforeAll, describe, expect, it } from "vitest";
import type { ChatData } from "../models";
import { LocalChatAnalysisPipeline } from "../pipeline";
import { LocalPresentationDataBuilder } from "./local-presentation-data-builder";
import {
  applyNames,
  getAnonymousNames,
  getDefaultNames,
  MAX_NAME_LENGTH
} from "./presentation-names";
import type { PresentationData } from "./types";

async function createData(): Promise<PresentationData> {
  const aliceMessages = Array.from({ length: 1_000 }, (_, index) => ({
    id: String(index),
    senderId: "user-1",
    timestamp: 1_000 + index * 1_000,
    type: "text" as const,
    text: "Hello"
  }));

  const bobMessage = {
    id: "bob",
    senderId: "user-2",
    timestamp: 2_000_000,
    type: "text" as const,
    text: "Hi"
  };

  const chat: ChatData = {
    id: "chat-1",
    title: "Alice and Bob",
    type: "private",
    participants: [
      { id: "user-1", name: "Alice" },
      { id: "user-2", name: "Bob" }
    ],
    messages: [...aliceMessages, bobMessage]
  };

  const analysis = await new LocalChatAnalysisPipeline().analyze(chat);

  return new LocalPresentationDataBuilder().build(chat, analysis);
}

function createDataWithParticipants(
  data: PresentationData,
  participants: Array<{ id: string; name: string }>
): PresentationData {
  const result = structuredClone(data);

  for (const slide of result.slides) {
    if (slide.kind === "cover" || slide.kind === "participants_balance") {
      slide.participants = participants;
    }
  }

  return result;
}

describe("presentation names", () => {
  let data: PresentationData;

  beforeAll(async () => {
    data = await createData();
  });

  it("has every kind of slide that carries names", () => {
    const kinds = data.slides.map(slide => slide.kind);

    expect(kinds).toEqual(
      expect.arrayContaining(["cover", "participants_balance", "participant_profile", "finale"])
    );

    expect(
      data.slides.some(slide => slide.kind === "achievement" && slide.holders.length > 0)
    ).toBe(true);
  });

  describe("getDefaultNames", () => {
    it("returns participant names and builds a title for two participants", () => {
      expect(getDefaultNames(data)).toEqual({
        chatTitle: "Alice & Bob",
        participants: { "user-1": "Alice", "user-2": "Bob" }
      });
    });
  });

  describe("applyNames", () => {
    it("replaces the original names everywhere", () => {
      const result = applyNames(data, {
        chatTitle: "Our chat",
        participants: { "user-1": "Anna", "user-2": "Ben" }
      });

      const serialized = JSON.stringify(result);

      expect(serialized).not.toContain("Alice");
      expect(serialized).not.toContain("Bob");
      expect(serialized).toContain("Anna");
      expect(serialized).toContain("Ben");
      expect(serialized).toContain("Our chat");
      expect(result.chatTitle).toBe("Our chat");
    });

    it("keeps the original name when the new one is empty", () => {
      const result = applyNames(data, {
        chatTitle: "",
        participants: { "user-1": "   " }
      });

      expect(result).toEqual(data);
    });

    it("renames only the participants that were given a name", () => {
      const result = applyNames(data, {
        chatTitle: "",
        participants: { "user-1": "Anna" }
      });

      expect(getDefaultNames(result).participants).toEqual({ "user-1": "Anna", "user-2": "Bob" });
    });

    it("trims names and limits their length", () => {
      const result = applyNames(data, {
        chatTitle: "",
        participants: { "user-1": `  ${"A".repeat(100)}  ` }
      });

      expect(getDefaultNames(result).participants["user-1"]).toBe("A".repeat(MAX_NAME_LENGTH));
    });

    it("keeps slide order and IDs", () => {
      const result = applyNames(data, {
        chatTitle: "Our chat",
        participants: { "user-1": "Anna" }
      });

      expect(result.slides.map(slide => slide.id)).toEqual(data.slides.map(slide => slide.id));
    });

    it("does not mutate the original data", () => {
      const original = structuredClone(data);

      applyNames(data, {
        chatTitle: "Our chat",
        participants: { "user-1": "Anna", "user-2": "Ben" }
      });

      expect(data).toEqual(original);
    });
  });

  describe("getAnonymousNames", () => {
    it("numbers participants by activity and builds an anonymous title", () => {
      expect(getAnonymousNames(data)).toEqual({
        chatTitle: "Person 1 & Person 2",
        participants: { "user-1": "Person 1", "user-2": "Person 2" }
      });
    });

    it("hides the original names once applied", () => {
      const serialized = JSON.stringify(applyNames(data, getAnonymousNames(data)));

      expect(serialized).not.toContain("Alice");
      expect(serialized).not.toContain("Bob");
      expect(serialized).toContain("Person 1");
    });
  });

  describe("chat title", () => {
    it("keeps the original title for one participant", () => {
      const oneParticipant = createDataWithParticipants(data, [{ id: "user-1", name: "Alice" }]);

      expect(getDefaultNames(oneParticipant).chatTitle).toBe("Alice and Bob");
    });

    it("keeps the original title for more than two participants", () => {
      const threeParticipants = createDataWithParticipants(data, [
        { id: "user-1", name: "Alice" },
        { id: "user-2", name: "Bob" },
        { id: "user-3", name: "Charlie" }
      ]);

      expect(getDefaultNames(threeParticipants).chatTitle).toBe("Alice and Bob");
    });

    it("uses participant names for a two-person chat", () => {
      expect(getDefaultNames(data).chatTitle).toBe("Alice & Bob");
    });

    it("uses anonymous participant names for a two-person chat", () => {
      expect(getAnonymousNames(data).chatTitle).toBe("Person 1 & Person 2");
    });
  });
});
