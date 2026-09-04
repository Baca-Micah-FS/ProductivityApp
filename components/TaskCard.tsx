import { Pressable, Text, View } from "react-native";

import { priorityColors } from "../constants/theme";
import { useTheme } from "../contexts/ThemeContext";
import type { Task } from "../types/task";

type Props = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
};

export default function TaskCard({ task, onToggle, onDelete }: Props) {
  const { colors } = useTheme();

  return (
    <View
      className="mb-3 rounded-2xl border p-4 shadow-sm"
      style={{ backgroundColor: colors.card, borderColor: colors.border }}
    >
      <View className="flex-row items-start gap-3">
        <Pressable
          accessibilityLabel={`Mark ${task.title} ${task.completed ? "incomplete" : "complete"}`}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: task.completed }}
          className="mt-1 h-7 w-7 items-center justify-center rounded-full border-2"
          onPress={onToggle}
          style={{
            backgroundColor: task.completed ? colors.primary : "transparent",
            borderColor: colors.primary,
          }}
        >
          {task.completed ? (
            <Text style={{ color: colors.primaryText }}>✓</Text>
          ) : null}
        </Pressable>

        <View className="flex-1">
          <View className="flex-row items-start justify-between gap-3">
            <Text
              className={`flex-1 text-lg font-semibold ${task.completed ? "line-through opacity-60" : ""}`}
              style={{ color: colors.text }}
            >
              {task.title}
            </Text>
            <View
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: priorityColors[task.priority] }}
            >
              <Text className="text-xs font-bold text-white">{task.priority}</Text>
            </View>
          </View>

          {task.description ? (
            <Text
              className={`mt-2 leading-5 ${task.completed ? "opacity-60" : ""}`}
              style={{ color: colors.muted }}
            >
              {task.description}
            </Text>
          ) : null}
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        className="mt-3 self-end rounded-lg px-3 py-2"
        onPress={onDelete}
      >
        <Text className="font-semibold" style={{ color: colors.danger }}>
          Delete
        </Text>
      </Pressable>
    </View>
  );
}
