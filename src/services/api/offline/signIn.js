import { areCredentialsValid } from "@/services/areCredentialsValid";

/**
 * Sign the user in using either user-supplied credentials or previously requested tokens.
 *
 * @param context
 * @param credentials And object containing a `username` and `password` field.
 *  This is a required argument IF no tokens are stored in storage, otherwise it can be omitted.
 */
export async function signIn(context, credentials) {
  if (context.state.isLoggedIn) return;

  if (localStorage["user"] == null) {
    localStorage["isLoggedIn"] = false;
    alert("Please sign up first. There is currently no user saved.");
    return;
  }

  // Note: Ignore password check in demo/local mode
  if (localStorage["isLoggedIn"] !== "true") {
    if (credentials != null && !areCredentialsValid(credentials)) throw new Error("Invalid credentials");
  }

  const user = JSON.parse(localStorage["user"]);
  if (user.username == null) {
    throw new Error("User saved in local storage has no username key.");
  }

  if (localStorage["isLoggedIn"] !== "true" && user.username !== credentials.username) {
    throw new Error(`Invalid username '${ credentials.username }'.`);
  }

  context.commit("setUser", user);
  context.commit("setIsLoggedIn", true);
  localStorage["isLoggedIn"] = true;
  console.debug("Successful sign in");
}
