import { removeTokens } from "@/services/removeTokens";
import router from "@/router";

export function logOut(context) {
  // Delete tokens
  removeTokens();

  context.commit("resetUser");
  context.commit("setIsLoggedIn", false);
  router.push("/logout");
  console.debug(`%c[SUCCESS] %s`, "color: lime", "Log out the user");
}
