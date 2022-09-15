import { getRefreshToken } from "@/services/getRefreshToken";
import { hasTokenExpired } from "@/util/hasTokenExpired";

export function hasValidRefreshToken() {
  const token = getRefreshToken();
  return token != null && !hasTokenExpired(token);
}
