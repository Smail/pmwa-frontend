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

// TODO rename to refreshTokens
export async function requestTokensViaRefreshToken(refreshToken) {
  if (refreshToken == null) throw new Error("Invalid argument: refreshToken is null");
  if (hasTokenExpired(refreshToken)) throw new Error("Refresh token has expired");
  // Request new tokens with new axios instance to circumvent interceptors and no auth header
  const axios2 = axios.create();
  delete axios2.defaults.headers.common.Authorization;
  const response = await axios2.post("auth/refresh-token", {
    username: parseJwt(refreshToken).username,
    refreshToken: refreshToken,
  });
  const accessToken = response.data.accessToken;
  const newRefreshToken = response.data.refreshToken;

  if (accessToken == null) throw new Error("Refresh token request was successful, but no access token was returned");
  if (newRefreshToken == null) throw new Error("Refresh token request was successful, but no refresh token was returned");
  console.debug("Successfully refreshed tokens");

  return { accessToken: accessToken, refreshToken: newRefreshToken };
}

export async function requestTokensViaCredentials(username, password) {
  if (!username) throw new Error("Invalid argument. Username is falsy.");
  if (!password) throw new Error("Invalid arguments. Password is falsy.");

  const response = await axios.post(`${ process.env.VUE_APP_API_ENDPOINT }/auth/sign-in`, { username, password });
  return { accessToken: response.data.accessToken, refreshToken: response.data.refreshToken };
}
