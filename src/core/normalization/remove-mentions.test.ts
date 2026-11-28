import { describe, expect, it } from "vitest";
import { removeMentions } from "./remove-mentions";

describe("removeMentions", () => {
  it("removes mentions and keeps the surrounding words", () => {
    const text = "привіт @some_user, глянь (@Олег2) тут";

    expect(removeMentions(text).match(/[\p{L}\p{N}_]+/gu)).toEqual(["привіт", "глянь", "тут"]);
  });

  it("keeps email addresses and a standalone @", () => {
    expect(removeMentions("name@example.com @ 5")).toBe("name@example.com @ 5");
  });
});
