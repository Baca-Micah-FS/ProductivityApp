import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";

import { useTheme } from "../contexts/ThemeContext";
import { loadSettings, saveSettings } from "../services/settings";
import type { ThemePreference } from "../types/settings";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export default function SettingsScreen() {
  const { colors, setTheme, theme } = useTheme();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useFocusEffect(
    useCallback(() => {
      loadSettings()
        .then((settings) => setUserName(settings.userName))
        .catch((error) => setMessage(`Unable to load settings: ${getErrorMessage(error)}`))
        .finally(() => setLoading(false));
    }, [])
  );

  const updateTheme = async (nextTheme: ThemePreference) => {
    try {
      setMessage("");
      await setTheme(nextTheme);
    } catch (error) {
      setMessage(`Unable to save theme: ${getErrorMessage(error)}`);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      await saveSettings({ userName, theme });
      setMessage("Settings saved ✅");
    } catch (error) {
      setMessage(`Unable to save settings: ${getErrorMessage(error)}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="mx-auto w-full max-w-2xl gap-5 p-5 md:p-8">
        <View>
          <Text className="mb-2 font-semibold" style={{ color: colors.text }}>
            Your name
          </Text>
          <TextInput
            accessibilityLabel="Your name"
            autoCapitalize="words"
            className="rounded-xl border px-4 py-3 text-base"
            onChangeText={setUserName}
            placeholder="Enter your name"
            placeholderTextColor={colors.muted}
            style={{ backgroundColor: colors.card, borderColor: colors.border, color: colors.text }}
            value={userName}
          />
        </View>

        <View
          className="flex-row items-center justify-between rounded-2xl border p-4"
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
        >
          <View className="mr-4 flex-1">
            <Text className="text-lg font-semibold" style={{ color: colors.text }}>
              Dark mode
            </Text>
            <Text className="mt-1" style={{ color: colors.muted }}>
              Use a darker theme across every screen.
            </Text>
          </View>
          <Switch
            accessibilityLabel="Dark mode"
            onValueChange={(enabled) => void updateTheme(enabled ? "dark" : "light")}
            trackColor={{ false: colors.border, true: colors.primary }}
            value={theme === "dark"}
          />
        </View>

        {message ? <Text style={{ color: colors.text }}>{message}</Text> : null}

        <Pressable
          accessibilityRole="button"
          className="items-center rounded-xl px-5 py-4"
          disabled={saving}
          onPress={() => void handleSave()}
          style={{ backgroundColor: colors.primary, opacity: saving ? 0.7 : 1 }}
        >
          {saving ? (
            <ActivityIndicator color={colors.primaryText} />
          ) : (
            <Text className="text-lg font-bold" style={{ color: colors.primaryText }}>
              Save Settings
            </Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}
