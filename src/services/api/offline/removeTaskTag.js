import { parseLocalStorageOrDefault } from "@/util/parseLocalStorageOrDefault";

export function removeTaskTag(context, { taskId, tagId }) {
  if (taskId == null) throw new Error(`Invalid argument: taskId is null`);
  if (tagId == null) throw new Error(`Invalid argument: tagId is null`);

  const tasks = parseLocalStorageOrDefault("tasks", []);
  const task = tasks.find(task => task.id === taskId);

  if (task == null) {
    throw new Error(`No task with ID ${ taskId } found.`);
  }

  task.tags = task.tags.filter(tag => tag.id !== tagId);
  localStorage["tasks"] = JSON.stringify(tasks);
  context.commit("removeTaskTag", { taskId, tagId });
}
