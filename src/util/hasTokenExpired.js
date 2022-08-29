export function hasTokenExpired(token) {
  return Date.now() < token.exp * 1000;
}
