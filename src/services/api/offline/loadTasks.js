import { parseLocalStorageOrDefault } from "@/util/parseLocalStorageOrDefault";

export async function loadTasks(context) {
  const tasks = parseLocalStorageOrDefault("tasks", []);
  return context.commit("setTasks", tasks);
}
