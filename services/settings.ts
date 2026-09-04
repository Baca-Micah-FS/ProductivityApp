import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import type { AppSettings, ThemePreference } from "../types/settings";

const USER_NAME_KEY = "productivity.userName";
const THEME_KEY = "productivity.theme";

async function getSetting(key: string) {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function setSetting(key: string, value: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export async function loadSettings(): Promise<AppSettings> {
  const [userName, storedTheme] = await Promise.all([
    getSetting(USER_NAME_KEY),
    getSetting(THEME_KEY),
  ]);
  const theme: ThemePreference = storedTheme === "dark" ? "dark" : "light";
  return { userName: userName ?? "", theme };
}

export async function saveSettings(settings: AppSettings) {
  await Promise.all([
    setSetting(USER_NAME_KEY, settings.userName.trim()),
    setSetting(THEME_KEY, settings.theme),
  ]);
}
