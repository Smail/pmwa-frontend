import { hasValidAccessToken } from "@/services/hasValidAccessToken";
import { hasValidRefreshToken } from "@/services/hasValidRefreshToken";

export function hasValidTokens() {
  return hasValidAccessToken() && hasValidRefreshToken();
}
