import axios from "axios";
import { areCredentialsValid } from "@/services/areCredentialsValid";
import { hasValidRefreshToken } from "@/services/hasValidRefreshToken";
import { setTokens } from "@/services/setTokens";
import { requestTokensViaCredentials, requestTokensViaRefreshToken } from "@/services/requestNewTokens";
import { hasValidAccessToken } from "@/services/hasValidAccessToken";
import { getRefreshToken } from "@/services/getRefreshToken";
import { parseJwt } from "@/util/parseJwt";
import { getAccessToken } from "@/services/getAccessToken";
import { logErrorAndAlert } from "@/util/logErrorAndAlert";

/**
 * Sign the user in using either user-supplied credentials or previously requested tokens.
 *
 * @param context
 * @param credentials And object containing a `username` and `password` field.
 *  This is a required argument IF no tokens are stored in storage, otherwise it can be omitted.
 * @returns {Promise<void>}
 * @throws {Error}
 */
export async function signIn(context, credentials) {
  if (context.state.isLoggedIn) return;
  if (credentials != null && !areCredentialsValid(credentials)) throw new Error("Invalid credentials");
  if (credentials == null && !hasValidRefreshToken()) throw new Error("No valid sign in methods found");

  try {
    if (areCredentialsValid(credentials)) {
      setTokens(await requestTokensViaCredentials(credentials.username, credentials.password));
    } else if (!hasValidAccessToken() && hasValidRefreshToken()) {
      setTokens(await requestTokensViaRefreshToken(getRefreshToken()));
    }

    const { username } = parseJwt(getAccessToken());
    if (username == null) throw new Error("Missing username in access token");
    axios.defaults.headers.common.Authorization = `Bearer ${ getAccessToken() }`;

    const user = await context.dispatch("requestUserData", username);
    if (!user.isPrivate) throw new Error(`Received public user data instead of private: user = ${ user }`);
    context.commit("setUser", user);
    context.commit("setIsLoggedIn", true);
    console.debug("Successful sign in");
  } catch (e) {
    context.dispatch("logOut").catch(e => logErrorAndAlert("Could not log out"));
    throw new Error("Sign in failed", { cause: e });
  }
}
