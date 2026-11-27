export const THEMES = [
  { id: "default", name: "Classic" },
  { id: "sunset", name: "Sunset" },
  { id: "ocean", name: "Ocean" },
  { id: "noir", name: "Noir" },
  { id: "burgundy", name: "Burgundy" },
  { id: "retro-pop", name: "Retro Pop" }
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const DEFAULT_THEME: ThemeId = "default";

export function isThemeId(value: unknown): value is ThemeId {
  return THEMES.some(theme => theme.id === value);
}
