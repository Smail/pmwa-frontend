import { createTag as offline } from "./offline/createTag";
import { createTag as online } from "./online/createTag";

export const createTag = process.env.VUE_APP_IS_DEMO ? offline : online;
