import axios from "axios";

/**
 * @throws {Error}
 */
export async function deleteTask(context, taskId) {
  try {
    await axios.delete(`tasks/${ taskId }`);
    console.debug(`%c[SUCCESS] %s`, "color: lime", "Task server deletion");
    context.commit("removeTask", taskId);
  } catch (e) {
    console.error("Failed to delete task: %s", e.message);
    throw new Error("Failed to delete task", { cause: e });
  }
}
