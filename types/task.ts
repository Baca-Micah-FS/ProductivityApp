export type Priority = "High" | "Medium" | "Low";

export type Task = {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
};

export type TaskFilter = "All" | "Active" | "Completed";
