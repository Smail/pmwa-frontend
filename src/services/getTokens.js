import { hasTokenExpired } from "@/util/hasTokenExpired";
import { requestNewTokens } from "@/services/requestNewTokens";
import { getStoredTokens } from "@/services/getStoredTokens";

export function getTokensViaCredentials(credentials) {
  // Try signing in via user provided credentials
  return requestNewTokens(credentials);
}

export async function getTokensViaStoredTokens() {
  let { accessToken, refreshToken } = getStoredTokens();
  const isAccessTokenValid = (accessToken != null && !hasTokenExpired(accessToken));
  const isRefreshTokenValid = (refreshToken != null && !hasTokenExpired(refreshToken));
  const errorMsg = 'Weird state. There IS an access token, but no refresh token. ' +
    'The user will be logged out when the access token expires.'

  if (isAccessTokenValid && isRefreshTokenValid) return { accessToken, refreshToken };
  if (!isAccessTokenValid && !isRefreshTokenValid) throw new Error('No valid stored tokens are available');
  if (isAccessTokenValid && !isRefreshTokenValid) {
    console.warn(errorMsg);
    return { accessToken, refreshToken };
  }
  if (!isAccessTokenValid && isRefreshTokenValid) {
    // Remove old refresh token in case the request fails, because the token got used by the server.
    localStorage.removeItem('refreshToken');
    // Request new token when no access token is available and the refresh token is valid.
    return await requestNewTokens({ refreshToken });
  }

  throw new Error('Unknown Error. All cases should have been checked. Weird.');
}
