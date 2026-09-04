import * as SQLite from "expo-sqlite";

import type { Priority, Task } from "../types/task";

const databasePromise = SQLite.openDatabaseAsync("productivity.db");

type TaskRow = {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  completed: number;
  created_at: string;
};

function mapTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    priority: row.priority,
    completed: row.completed === 1,
    createdAt: row.created_at,
  };
}

export async function initializeDatabase() {
  const database = await databasePromise;
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      priority TEXT NOT NULL CHECK(priority IN ('High', 'Medium', 'Low')),
      completed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);
}

export async function getTasks(): Promise<Task[]> {
  const database = await databasePromise;
  const rows = await database.getAllAsync<TaskRow>(
    `SELECT id, title, description, priority, completed, created_at
     FROM tasks
     ORDER BY completed ASC,
       CASE priority WHEN 'High' THEN 1 WHEN 'Medium' THEN 2 ELSE 3 END,
       id DESC`
  );
  return rows.map(mapTask);
}

export async function createTask(input: {
  title: string;
  description: string;
  priority: Priority;
}) {
  const database = await databasePromise;
  await database.runAsync(
    `INSERT INTO tasks (title, description, priority, created_at)
     VALUES (?, ?, ?, ?)`,
    input.title.trim(),
    input.description.trim(),
    input.priority,
    new Date().toISOString()
  );
}

export async function setTaskCompleted(id: number, completed: boolean) {
  const database = await databasePromise;
  await database.runAsync(
    "UPDATE tasks SET completed = ? WHERE id = ?",
    completed ? 1 : 0,
    id
  );
}

export async function deleteTask(id: number) {
  const database = await databasePromise;
  await database.runAsync("DELETE FROM tasks WHERE id = ?", id);
}
