import { describe, expect, it } from "vitest";
import { fillMissingMonths } from "./fill-missing-months";

describe("fillMissingMonths", () => {
  it("returns an empty list for no months", () => {
    expect(fillMissingMonths([])).toEqual([]);
  });

  it("fills gaps with zero counts", () => {
    expect(
      fillMissingMonths([
        { month: "2025-01", count: 5 },
        { month: "2025-04", count: 2 }
      ])
    ).toEqual([
      { month: "2025-01", count: 5 },
      { month: "2025-02", count: 0 },
      { month: "2025-03", count: 0 },
      { month: "2025-04", count: 2 }
    ]);
  });

  it("continues across a year boundary", () => {
    expect(
      fillMissingMonths([
        { month: "2024-12", count: 1 },
        { month: "2025-02", count: 1 }
      ]).map(item => item.month)
    ).toEqual(["2024-12", "2025-01", "2025-02"]);
  });
});
