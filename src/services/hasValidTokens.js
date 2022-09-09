import { hasStoredTokens } from "@/services/hasStoredTokens";
import { getStoredTokens } from "@/services/getStoredTokens";
import { hasTokenExpired } from "@/util/hasTokenExpired";

export function hasValidAccessToken() {
  const { accessToken } = getStoredTokens();
  return accessToken != null && !hasTokenExpired(accessToken);
}

export function hasValidRefreshToken() {
  const { refreshToken } = getStoredTokens();
  return refreshToken != null && !hasTokenExpired(refreshToken);
}

export function hasValidTokens() {
  return hasStoredTokens() && hasValidAccessToken() && hasValidRefreshToken();
}
