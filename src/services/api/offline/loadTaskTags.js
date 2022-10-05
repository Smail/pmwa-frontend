import { parseLocalStorageOrDefault } from "@/util/parseLocalStorageOrDefault";

export async function loadTaskTags(taskId) {
  const tasks = parseLocalStorageOrDefault("tasks", []);
  const idx = tasks.findIndex(t => t.id === taskId);
  if (idx === -1) throw new Error(`No task with ID '${taskId}' was found`);

  return tasks[idx].tags;
}
