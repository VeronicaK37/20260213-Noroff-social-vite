

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
 * Create a new post
 * @param {{title: string, body?: string}} data - Post payload
 * @returns {Promise<any>} API response
 * @throws {Error} If the request fails, throws an error with message from API or status code
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

export function reactToPost(postId, symbol) {
  return apiRequest(`/social/posts/${postId}/react/${encodeURIComponent(symbol)}`, {
    method: "PUT", 
  });
}
export function unreactToPost(postId, symbol) {
  return apiRequest(`/social/posts/${postId}/react/${encodeURIComponent(symbol)}`, {
    method: "DELETE",
  });
}