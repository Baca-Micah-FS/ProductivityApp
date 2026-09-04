import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link, useFocusEffect } from "expo-router";

import FilterBar from "../components/FilterBar";
import TaskCard from "../components/TaskCard";
import TaskStats from "../components/TaskStats";
import { useTheme } from "../contexts/ThemeContext";
import {
  deleteTask,
  getTasks,
  initializeDatabase,
  setTaskCompleted,
} from "../services/database";
import { loadSettings } from "../services/settings";
import type { Task, TaskFilter } from "../types/task";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("All");
  const [search, setSearch] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      setError("");
      await initializeDatabase();
      const [storedTasks, settings] = await Promise.all([getTasks(), loadSettings()]);
      setTasks(storedTasks);
      setUserName(settings.userName);
    } catch (caughtError) {
      setError(`Unable to load tasks: ${getErrorMessage(caughtError)}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "Completed" ? task.completed : !task.completed);
      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [filter, search, tasks]);

  const handleToggle = async (task: Task) => {
    try {
      await setTaskCompleted(task.id, !task.completed);
      await refresh();
    } catch (caughtError) {
      setError(`Unable to update task: ${getErrorMessage(caughtError)}`);
    }
  };

  const removeTask = async (task: Task) => {
    try {
      await deleteTask(task.id);
      await refresh();
    } catch (caughtError) {
      setError(`Unable to delete task: ${getErrorMessage(caughtError)}`);
    }
  };

  const confirmDelete = (task: Task) => {
    if (Platform.OS === "web") {
      if (window.confirm(`Delete “${task.title}”?`)) {
        void removeTask(task);
      }
      return;
    }
    Alert.alert("Delete task?", `Delete “${task.title}”?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => void removeTask(task) },
    ]);
  };

  const completed = tasks.filter((task) => task.completed).length;

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: colors.background }}
    >
      <View className="mx-auto w-full max-w-3xl px-4 pt-16 md:px-8">
        <View className="mb-6 flex-row items-center justify-between gap-4">
          <View className="flex-1">
            <Text className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Productivity App
            </Text>
            <Text className="mt-1 text-3xl font-bold" style={{ color: colors.text }}>
              {userName ? `${userName}’s Tasks` : "My Tasks"}
            </Text>
          </View>
          <Link asChild href="/settings">
            <Pressable
              accessibilityLabel="Open settings"
              className="rounded-xl border px-4 py-3"
              style={{ backgroundColor: colors.card, borderColor: colors.border }}
            >
              <Text className="font-semibold" style={{ color: colors.text }}>
                Settings
              </Text>
            </Pressable>
          </Link>
        </View>

        <TaskStats completed={completed} total={tasks.length} />

        <TextInput
          accessibilityLabel="Search tasks"
          className="mb-3 rounded-xl border px-4 py-3 text-base"
          onChangeText={setSearch}
          placeholder="Search tasks"
          placeholderTextColor={colors.muted}
          style={{ backgroundColor: colors.card, borderColor: colors.border, color: colors.text }}
          value={search}
        />
        <FilterBar onChange={setFilter} value={filter} />

        {error ? (
          <View className="mb-4 rounded-xl bg-red-100 p-3">
            <Text className="text-red-700">{error}</Text>
          </View>
        ) : null}

        {loading ? (
          <ActivityIndicator className="my-12" color={colors.primary} size="large" />
        ) : visibleTasks.length ? (
          visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              onDelete={() => confirmDelete(task)}
              onToggle={() => void handleToggle(task)}
              task={task}
            />
          ))
        ) : (
          <View
            className="items-center rounded-2xl border p-8"
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
          >
            <Text className="text-xl font-semibold" style={{ color: colors.text }}>
              No tasks found
            </Text>
            <Text className="mt-2 text-center" style={{ color: colors.muted }}>
              Add a task or change your search and filter.
            </Text>
          </View>
        )}

        <Link asChild href="/add-task">
          <Pressable
            accessibilityRole="button"
            className="mt-5 items-center rounded-xl px-5 py-4"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-lg font-bold" style={{ color: colors.primaryText }}>
              + Add Task
            </Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}
