export const TASK_STATUSES = [
  { value: 'todo', label: 'Todo' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number]['value'];

export type Task = {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
};

export type TaskInput = {
  title: string;
  description?: string;
};

export function createTask(projectId: string, input: TaskInput): Task {
  return {
    id: crypto.randomUUID(),
    projectId,
    status: 'todo',
    ...normalizeTaskInput(input),
  };
}

export function updateTask(task: Task, input: TaskInput): Task {
  return {
    ...task,
    ...normalizeTaskInput(input),
  };
}

export function deleteTask(tasks: Task[], taskId: string): Task[] {
  return tasks.filter((task) => task.id !== taskId);
}

export function changeTaskStatus(task: Task, status: TaskStatus): Task {
  return { ...task, status };
}

function normalizeTaskInput(input: TaskInput): TaskInput {
  const title = input.title.trim();

  if (!title) {
    throw new Error('Task title is required.');
  }

  const description = input.description?.trim() ?? '';

  return { title, description };
}
