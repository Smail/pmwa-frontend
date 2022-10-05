import { signUp as offline } from "./offline/signUp";
import { signUp as online } from "./online/signUp";

export const signUp = process.env.VUE_APP_IS_DEMO ? offline : online;

