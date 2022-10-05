import { signIn as offline } from "./offline/signIn";
import { signIn as online } from "./online/signIn";

export const signIn = process.env.VUE_APP_IS_DEMO ? offline : online;
