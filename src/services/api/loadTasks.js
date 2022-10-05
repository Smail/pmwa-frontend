import axios from "axios";

/**
 * @throws {Error}
 */
export async function loadTasks(context) {
  try {
    const response = await axios.get("tasks");
    const data = response.data;

    return await context.commit("setTasks", data);
  } catch (e) {
    console.error("Could not load tasks: %s", e.message);
    throw new Error("Could not load tasks", { cause: e });
  }
}
