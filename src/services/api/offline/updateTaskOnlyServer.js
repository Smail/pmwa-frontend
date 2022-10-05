export async function updateTaskOnlyServer(context, task) {
  const tasks = JSON.parse(localStorage["tasks"]);
  const idx = tasks.findIndex(t => t.id === task.id);
  if (idx === -1) throw new Error(`No task with ID '${ task.id }' was found.`);

  tasks[idx] = { ...tasks[idx], ...task };
  localStorage["tasks"] = JSON.stringify(tasks);
  console.debug(`%c[SUCCESS] %s`, "color: lime", "Task server update");
}
