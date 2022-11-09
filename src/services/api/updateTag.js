import { updateTag as offline } from "./offline/updateTag";
import { updateTag as online } from "./online/updateTag";

export const updateTag = process.env.VUE_APP_IS_DEMO ? offline : online;
