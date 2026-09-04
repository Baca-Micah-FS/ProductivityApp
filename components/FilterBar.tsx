import { Pressable, Text, View } from "react-native";

import { useTheme } from "../contexts/ThemeContext";
import type { TaskFilter } from "../types/task";

const filters: TaskFilter[] = ["All", "Active", "Completed"];

export default function FilterBar({
  value,
  onChange,
}: {
  value: TaskFilter;
  onChange: (filter: TaskFilter) => void;
}) {
  const { colors } = useTheme();

  return (
    <View className="mb-4 flex-row gap-2">
      {filters.map((filter) => {
        const selected = filter === value;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected }}
            className="flex-1 items-center rounded-xl border px-3 py-3"
            key={filter}
            onPress={() => onChange(filter)}
            style={{
              backgroundColor: selected ? colors.primary : colors.card,
              borderColor: selected ? colors.primary : colors.border,
            }}
          >
            <Text
              className="font-semibold"
              style={{ color: selected ? colors.primaryText : colors.text }}
            >
              {filter}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
