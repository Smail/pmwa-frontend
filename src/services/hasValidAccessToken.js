import { getAccessToken } from "@/services/getAccessToken";
import { hasTokenExpired } from "@/util/hasTokenExpired";

export function hasValidAccessToken() {
  const token = getAccessToken();
  return token != null && !hasTokenExpired(token);
}
