import { updateTask as offline } from "./offline/updateTask";
import { updateTask as online } from "./online/updateTask";

export const updateTask = process.env.VUE_APP_IS_DEMO ? offline : online;
