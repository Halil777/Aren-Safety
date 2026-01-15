let authToken: string | null = null;

export function setSyncAuthToken(token: string | null) {
  authToken = token;
}

export function getSyncAuthToken() {
  return authToken;
}
