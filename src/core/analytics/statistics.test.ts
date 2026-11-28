import { describe, expect, it } from "vitest";
import { getMedian } from "./statistics";

describe("getMedian", () => {
  it("returns 0 for no values", () => {
    expect(getMedian([])).toBe(0);
  });

  it("returns the middle value for an odd count", () => {
    expect(getMedian([5, 1, 3])).toBe(3);
  });

  it("returns the mean of the two middle values for an even count", () => {
    expect(getMedian([4, 1, 3, 2])).toBe(2.5);
  });

  it("is not affected by one very large value", () => {
    expect(getMedian([1, 1, 1_000])).toBe(1);
  });

  it("does not mutate the input", () => {
    const values = [3, 1, 2];

    getMedian(values);

    expect(values).toEqual([3, 1, 2]);
  });
});
