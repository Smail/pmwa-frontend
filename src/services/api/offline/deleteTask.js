import { parseLocalStorageOrDefault } from "@/util/parseLocalStorageOrDefault";

export async function deleteTask(context, taskId) {
  const tasks = parseLocalStorageOrDefault("tasks", []);
  const idx = tasks.findIndex(task => task.id = taskId);

  if (idx === -1) throw new Error(`ID not found: '${taskId}'`);

  tasks.splice(idx, 1);
  localStorage["tasks"] = JSON.stringify(tasks);

  context.commit("removeTask", taskId);
}
