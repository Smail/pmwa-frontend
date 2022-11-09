import { parseLocalStorageOrDefault } from "@/util/parseLocalStorageOrDefault";

export function updateTag(context, { tagId, name, color }) {
  if (tagId == null) throw new Error(`Invalid argument: id is '${ tagId }'`);
  const tasks = parseLocalStorageOrDefault("tasks", []);

  for (const task of tasks) {
    for (const tag of task.tags) {
      if (tag.id === tagId) {
        if (name !== undefined) tag.name = name.replaceAll("\n", "");
        if (color !== undefined) tag.color = color;
      }
    }
  }

  localStorage["tasks"] = JSON.stringify(tasks);
  context.commit("updateTag", { tagId, name, color });
}
