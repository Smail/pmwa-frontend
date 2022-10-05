import axios from "axios";

/**
 * @throws {Error}
 */
export async function updateTaskOnlyServer(context, task) {
  try {
    await axios.patch(`tasks/${ task.id }`, task);
    console.debug(`%c[SUCCESS] %s`, "color: lime", "Task server update");
  } catch (e) {
    console.error("Failed to update task on server: %s", e.message);
    throw new Error("Failed to update task on server", { cause: e });
  }
}
