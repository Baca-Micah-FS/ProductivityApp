import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";

import { priorityColors } from "../constants/theme";
import { useTheme } from "../contexts/ThemeContext";
import { createTask, initializeDatabase } from "../services/database";
import type { Priority } from "../types/task";

const priorities: Priority[] = ["High", "Medium", "Low"];

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export default function AddTaskScreen() {
  const { colors } = useTheme();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await initializeDatabase();
      await createTask({ title, description, priority });
      router.back();
    } catch (caughtError) {
      setError(`Unable to create task: ${getErrorMessage(caughtError)}`);
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className="mx-auto w-full max-w-2xl gap-5 p-5 md:p-8">
          <View>
            <Text className="mb-2 font-semibold" style={{ color: colors.text }}>
              Title
            </Text>
            <TextInput
              accessibilityLabel="Task title"
              autoFocus
              className="rounded-xl border px-4 py-3 text-base"
              maxLength={100}
              onChangeText={setTitle}
              placeholder="What needs to be done?"
              placeholderTextColor={colors.muted}
              returnKeyType="next"
              style={{ backgroundColor: colors.card, borderColor: colors.border, color: colors.text }}
              value={title}
            />
          </View>

          <View>
            <Text className="mb-2 font-semibold" style={{ color: colors.text }}>
              Description
            </Text>
            <TextInput
              accessibilityLabel="Task description"
              className="min-h-28 rounded-xl border px-4 py-3 text-base"
              multiline
              onChangeText={setDescription}
              placeholder="Add helpful details (optional)"
              placeholderTextColor={colors.muted}
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.text,
                textAlignVertical: "top",
              }}
              value={description}
            />
          </View>

          <View>
            <Text className="mb-2 font-semibold" style={{ color: colors.text }}>
              Priority
            </Text>
            <View className="flex-row gap-2">
              {priorities.map((option) => {
                const selected = option === priority;
                return (
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    className="flex-1 items-center rounded-xl border-2 px-3 py-3"
                    key={option}
                    onPress={() => setPriority(option)}
                    style={{
                      backgroundColor: selected ? priorityColors[option] : colors.card,
                      borderColor: priorityColors[option],
                    }}
                  >
                    <Text
                      className="font-bold"
                      style={{ color: selected ? "#ffffff" : priorityColors[option] }}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {error ? <Text className="rounded-xl bg-red-100 p-3 text-red-700">{error}</Text> : null}

          <Pressable
            accessibilityRole="button"
            className="items-center rounded-xl px-5 py-4"
            disabled={submitting}
            onPress={() => void handleSubmit()}
            style={{ backgroundColor: colors.primary, opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? (
              <ActivityIndicator color={colors.primaryText} />
            ) : (
              <Text className="text-lg font-bold" style={{ color: colors.primaryText }}>
                Save Task
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
