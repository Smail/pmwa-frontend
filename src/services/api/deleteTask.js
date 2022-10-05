import { deleteTask as offline } from "./offline/deleteTask";
import { deleteTask as online } from "./online/deleteTask";

export const deleteTask = process.env.VUE_APP_IS_DEMO ? offline : online;
