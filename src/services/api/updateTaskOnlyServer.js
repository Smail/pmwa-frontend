import { updateTaskOnlyServer as offline } from "./offline/updateTaskOnlyServer";
import { updateTaskOnlyServer as online } from "./online/updateTaskOnlyServer";

export const updateTaskOnlyServer = process.env.VUE_APP_IS_DEMO ? offline : online;
