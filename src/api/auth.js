import { apiRequest } from "./client.js";

/**
 * Register a new user.
 * POST /auth/register :contentReference[oaicite:3]{index=3}
 */
export async function registerUser({ name, email, password }) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

/**
 * Login a user.
 * POST /auth/login :contentReference[oaicite:4]{index=4}
 */
export async function loginUser({ email, password }) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Create an API Key for v2 (authenticated).（（version 2））
 * POST /auth/create-api-key :contentReference[oaicite:5]{index=5}
 */
export async function createApiKey(name = "Noroff Social SPA") {
  return apiRequest("/auth/create-api-key", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

