import { loadTaskTags as offline } from "./offline/loadTaskTags";
import { loadTaskTags as online } from "./online/loadTaskTags";

export const loadTaskTags = process.env.VUE_APP_IS_DEMO ? offline : online;
