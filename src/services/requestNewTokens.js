import axios from "axios";
import { parseJwt } from "@/util/parseJwt";
import { hasTokenExpired } from "@/util/hasTokenExpired";

export async function requestNewTokens({ refreshToken, username, password }) {
  console.debug("Requesting new token pair");

  // Check if more than one request method is used.
  if (refreshToken && (username || password)) {
    throw new Error("Too many possible routes. Either request tokens via credentials or a refresh token");
  }

  if (refreshToken) {
    return requestTokensViaRefreshToken(refreshToken);
  } else if (username && password) {
    return requestTokensViaCredentials(username, password);
  } else {
    throw new Error("No credential methods applied. Please pass a refresh token or user credentials.");
  }
}

export async function requestTokensViaRefreshToken(refreshToken) {
  if (refreshToken == null) throw new Error("No refresh token found in local storage");
  if (hasTokenExpired(refreshToken)) throw new Error("Refresh token has expired");
  const refreshTokenPayload = parseJwt(refreshToken);
  const response = await axios.post("auth/refresh-token", {
    username: refreshTokenPayload.username,
    refreshToken: refreshToken,
  });

  return { accessToken: response.data.accessToken, refreshToken: response.data.refreshToken };
}

export async function requestTokensViaCredentials(username, password) {
  if (!username) throw new Error("Invalid argument. Username is falsy.");
  if (!password) throw new Error("Invalid arguments. Password is falsy.");

  const response = await axios.post(`${ process.env.VUE_APP_API_ENDPOINT }/auth/sign-in`, { username, password });
  return { accessToken: response.data.accessToken, refreshToken: response.data.refreshToken };
}
