export function areCredentialsValid(credentials) {
  return credentials != null && credentials.username != null && credentials.password != null
    && credentials.username.length > 0 && credentials.password.length > 0;
}
