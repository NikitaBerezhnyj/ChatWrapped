import { describe, expect, it } from "vitest";
import { THEMES } from "./themes";

const sources = import.meta.glob("./*.css", {
  query: "?raw",
  import: "default",
  eager: true
}) as Record<string, string>;

function readVariables(id: string): string[] {
  const css = sources[`./${id}.css`];

  expect(css, `${id}.css is missing`).toBeDefined();

  return css
    .split(";")
    .map(declaration => declaration.trim().split(":")[0]?.trim())
    .filter((name): name is string => name?.startsWith("--"))
    .sort();
}

describe("themes", () => {
  const expected = readVariables("default");

  it.each(THEMES.map(theme => theme.id))("%s defines the same variables as default", id => {
    expect(readVariables(id)).toEqual(expected);
  });
});
