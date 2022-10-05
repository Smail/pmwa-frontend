import { removeTokens } from "@/services/removeTokens";

export function logOut(context) {
  // Delete tokens
  removeTokens();
}
