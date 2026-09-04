import { Text, View } from "react-native";

import { useTheme } from "../contexts/ThemeContext";

export default function TaskStats({ total, completed }: { total: number; completed: number }) {
  const { colors } = useTheme();

  return (
    <View className="mb-4 flex-row gap-3">
      <View className="flex-1 rounded-2xl bg-blue-600 p-4">
        <Text className="text-sm font-medium text-blue-100">Total tasks</Text>
        <Text className="mt-1 text-3xl font-bold text-white">{total}</Text>
      </View>
      <View className="flex-1 rounded-2xl bg-emerald-600 p-4">
        <Text className="text-sm font-medium text-emerald-100">Completed</Text>
        <Text className="mt-1 text-3xl font-bold text-white">{completed}</Text>
      </View>
      <View
        className="flex-1 rounded-2xl border p-4"
        style={{ backgroundColor: colors.card, borderColor: colors.border }}
      >
        <Text className="text-sm font-medium" style={{ color: colors.muted }}>
          Remaining
        </Text>
        <Text className="mt-1 text-3xl font-bold" style={{ color: colors.text }}>
          {total - completed}
        </Text>
      </View>
    </View>
  );
}
