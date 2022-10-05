import { loadTasks as offline } from "./offline/loadTasks";
import { loadTasks as online } from "./online/loadTasks";

export const loadTasks = process.env.VUE_APP_IS_DEMO ? offline : online;
