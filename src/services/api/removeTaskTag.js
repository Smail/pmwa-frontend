import { removeTaskTag as offline } from "./offline/removeTaskTag";
import { removeTaskTag as online } from "./online/removeTaskTag";

/**
 * Removes a tag from a specific task
 *
 * @param context
 * @param { taskId, tagId }
 */
export const removeTaskTag = process.env.VUE_APP_IS_DEMO ? offline : online;
