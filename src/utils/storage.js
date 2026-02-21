const TOKEN_KEY = "token";
const USER_KEY = "user";

const API_KEY_KEY = "apiKey";

/**
 * Save access token to localStorage.
 * @param {string} token
 */
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Save user object to localStorage.
 * @param {{ name: string, email?: string }} user - Logged-in user info
 */
export function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("apiKey");
}


export function setApiKey(key) {
  localStorage.setItem(API_KEY_KEY, key);
}

export function getApiKey() {
  return localStorage.getItem(API_KEY_KEY);
}

export function clearApiKey() {
  localStorage.removeItem(API_KEY_KEY);
}
