import { requestNewTokens } from "@/services/requestNewTokens";
import { getStoredTokens } from "@/services/getStoredTokens";
import { hasValidAccessToken, hasValidRefreshToken } from "@/services/hasValidTokens";

export function getTokensViaCredentials(credentials) {
  // Try signing in via user provided credentials
  return requestNewTokens(credentials);
}

export async function getTokensViaStoredTokens() {
  const isAccessTokenValid = hasValidAccessToken();
  const isRefreshTokenValid = hasValidRefreshToken();

  const tokens = getStoredTokens();
  if (isAccessTokenValid && isRefreshTokenValid) return tokens;
  if (!isAccessTokenValid && !isRefreshTokenValid) throw new Error("No valid stored tokens are available");
  if (isAccessTokenValid && !isRefreshTokenValid) {
    console.warn("Weird state. There IS an access token, but no refresh token. " +
      "The user will be logged out when the access token expires.");
    return tokens;
  }
  if (!isAccessTokenValid && isRefreshTokenValid) {
    // Remove old refresh token in case the request fails, because the token got used by the server.
    localStorage.removeItem("refreshToken");
    // Request new token when no access token is available and the refresh token is valid.
    return await requestNewTokens({ refreshToken });
  }

  throw new Error('Unknown Error. All cases should have been checked. Weird.');
}
