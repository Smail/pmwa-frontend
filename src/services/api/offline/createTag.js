import { parseLocalStorageOrDefault } from "@/util/parseLocalStorageOrDefault";

export function createTag(context, { taskId, tag }) {
  if (taskId == null) throw new Error("taskId is null");
  if (tag == null) throw new Error("tag is null");
  const tasks = parseLocalStorageOrDefault("tasks", []);
  const task = tasks.find(task => task.id === taskId);

  task.tags.push(tag);

  localStorage["tasks"] = JSON.stringify(tasks);
  context.commit("createTag", { taskId, tag });
}
