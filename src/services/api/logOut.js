import { logOut as offline } from "./offline/logOut";
import { logOut as online } from "./online/logOut";
import router from "@/router";

export function logOut(context) {
  process.env.VUE_APP_IS_DEMO ? offline() : online();

  context.commit("resetUser");
  context.commit("setIsLoggedIn", false);
  router.push("/logout");
  console.debug(`%c[SUCCESS] %s`, "color: lime", "Log out the user");
}
