import { apiRequest } from "./client.js";

/**
 * Get all posts
 */
export async function getAllPosts() {
  return apiRequest("/social/posts?_author=true&_comments=true&_reactions=true");
}

/**
 * Get single post
 */
export async function getPost(id) {
  return apiRequest(`/social/posts/${id}?_author=true&_comments=true&_reactions=true`);
}

/**
 * Create post
 */
export async function createPost(data) {
  return apiRequest("/social/posts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Delete post
 */
export async function deletePost(id) {
  return apiRequest(`/social/posts/${id}`, {
    method: "DELETE",
  });
}

/**
 * Update post
 */
export async function updatePost(id, data) {
  return apiRequest(`/social/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
