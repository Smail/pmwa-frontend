export function getStoredTokens() {
  return { accessToken: localStorage["accessToken"], refreshToken: localStorage["refreshToken"] };
}
