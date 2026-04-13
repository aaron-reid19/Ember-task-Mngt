export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  hpCost: number;
  completed: boolean;
  priority: TaskPriority;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}


export type NewTask = Omit<Task, "id" | "createdAt" | "updatedAt">;