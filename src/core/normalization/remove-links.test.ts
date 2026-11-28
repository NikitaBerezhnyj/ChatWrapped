import { describe, expect, it } from "vitest";
import { removeLinks } from "./remove-links";

describe("removeLinks", () => {
  it("removes links and keeps the surrounding words", () => {
    const text = "дивись https://instagram.com/reel/abc і www.example.com тут instagram.com/p/1";

    expect(removeLinks(text).split(/\s+/).filter(Boolean)).toEqual(["дивись", "і", "тут"]);
  });

  it("keeps ordinary text with dots", () => {
    expect(removeLinks("ок.так instagram")).toBe("ок.так instagram");
  });
});
