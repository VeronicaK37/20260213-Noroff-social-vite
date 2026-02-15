import { apiRequest } from "./client.js";

export async function getProfile(name) {
  return apiRequest(`/social/profiles/${name}?_followers=true&_following=true`);
}

export async function getPostsByUser(name) {
  return apiRequest(`/social/profiles/${name}/posts?_author=true`);
}
