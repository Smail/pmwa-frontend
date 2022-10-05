import { requestUserData as offline } from "./offline/requestUserData";
import { requestUserData as online } from "./online/requestUserData";

export const requestUserData = process.env.VUE_APP_IS_DEMO ? offline : online;
