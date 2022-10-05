import { updateUser as offline } from "./offline/updateUser";
import { updateUser as online } from "./online/updateUser";

export const updateUser = process.env.VUE_APP_IS_DEMO ? offline : online;
