import { useCallback, useState } from "react";
import { DEFAULT_THEME, isThemeId, type ThemeId } from "../themes/themes";

const STORAGE_KEY = "chat-wrapped:theme";

function readStoredTheme(): ThemeId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    return isThemeId(stored) ? stored : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function useTheme(): [ThemeId, (theme: ThemeId) => void] {
  const [theme, setThemeState] = useState(readStoredTheme);

  const setTheme = useCallback((next: ThemeId) => {
    setThemeState(next);

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage may be blocked; the choice is then just not remembered.
    }
  }, []);

  return [theme, setTheme];
}
