export function hasStoredTokens() {
  return localStorage["accessToken"] || localStorage["refreshToken"];
}
