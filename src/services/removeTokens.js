import { removeAccessToken } from "@/services/removeAccessToken";
import { removeRefreshToken } from "@/services/removeRefreshToken";

export function removeTokens() {
  removeAccessToken();
  removeRefreshToken();
}
