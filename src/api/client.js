import { getToken, getApiKey } from "../utils/storage.js";

export const BASE_URL = "https://v2.api.noroff.dev"; // v2 base url :contentReference[oaicite:1]{index=1}

/**
 * Generic request helper for Noroff API v2.
 * Adds JSON headers + Bearer token + X-Noroff-API-Key when available.
 * @param {string} path
 * @param {RequestInit} [options]
 * @returns {Promise<any>}
 */
export async function apiRequest(path, options = {}) {

    //核心 apiRequest token apiKey
    const token = getToken();
    const apiKey = getApiKey();

    // 替换掉： const headers = new Headers(options.headers || {});
    // headers.set("Content-Type", "application/json");
    // 这段设计让：headers 的“来源不唯一”

    //替换为：merge caller headers first【先建空 headers，再“合并调用者 headers”】
    const headers = new Headers();

    if (options.headers) {
      const incoming =
        options.headers instanceof Headers ? options.headers : new Headers(options.headers);

      incoming.forEach((value, key) => headers.set(key, value));
    }

    // ensure defaults are always present
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    //替换结束

    //2. 自动加headers
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (apiKey) headers.set("X-Noroff-API-Key", apiKey); // ？？？required for social endpoints

    //1. 发送请求
    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = data?.errors?.[0]?.message || data?.message || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    return data;

}
