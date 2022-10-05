export async function updateTask(context, task) {
  const stateTasks = context.state.tasks.filter(t => t.id === task.id);
  if (stateTasks.length === 0) {
    throw new Error(`Invalid argument: No task with ID '${ task.id }'`);
  }
  if (stateTasks.length > 1) {
    throw new Error(`Internal state error: Too many tasks with ID ${ task.id }.\n`
      + `Expected 1, but is ${ stateTasks.length }`);
  }

  try {
    context.commit("updateTask", task);
    await context.dispatch("updateTaskOnlyServer", task);
  } catch (e) {
    console.error("Could not update task: %s", e.message);
    throw new Error("Could not update task", { cause: e });
  }
}
