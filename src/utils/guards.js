import { getToken } from "./storage.js";
import { navigate } from "../router.js";

export function requireAuth() {
  const token = getToken();
  if (!token) {
    navigate("/login");
    return false;
  }
  return true;
}

export function redirectIfAuth() {
  const token = getToken();
  if (token) {
    navigate("/feed");
    return true;
  }
  return false;
}
