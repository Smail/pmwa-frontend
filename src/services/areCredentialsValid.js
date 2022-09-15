export function areCredentialsValid(credentials) {
  return credentials != null && credentials.username != null && credentials.password != null;
}
