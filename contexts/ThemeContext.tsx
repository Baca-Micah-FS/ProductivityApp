import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { themeColors } from "../constants/theme";
import { loadSettings, saveSettings } from "../services/settings";
import type { ThemePreference } from "../types/settings";

type ThemeContextValue = {
  theme: ThemePreference;
  colors: (typeof themeColors)[ThemePreference];
  setTheme: (theme: ThemePreference) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>("light");

  useEffect(() => {
    loadSettings()
      .then((settings) => setThemeState(settings.theme))
      .catch(() => setThemeState("light"));
  }, []);

  const setTheme = async (nextTheme: ThemePreference) => {
    const settings = await loadSettings();
    await saveSettings({ ...settings, theme: nextTheme });
    setThemeState(nextTheme);
  };

  const value = useMemo(
    () => ({ theme, colors: themeColors[theme], setTheme }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
