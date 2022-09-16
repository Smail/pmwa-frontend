import { parseJwt } from "@/util/parseJwt";

export function setTokens({ accessToken, refreshToken }) {
  if (accessToken == null) throw new Error("setTokens: Access token is null");
  if (refreshToken == null) throw new Error("setTokens: Refresh token is null");
  //  TODO jwt verify; Check if valid tokens
  parseJwt(accessToken);
  parseJwt(refreshToken)

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}
