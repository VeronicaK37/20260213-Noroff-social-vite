import { LoginView } from "./views/login.js";
import { RegisterView } from "./views/register.js";
import { FeedView } from "./views/feed.js";
import { PostView } from "./views/post.js";
import { ProfileView } from "./views/profile.js";
import { UserView } from "./views/user.js";
import { requireAuth, redirectIfAuth } from "./utils/guards.js";

const routes = {
  "/login": { view: LoginView, guard: "guest" },
  "/register": { view: RegisterView, guard: "guest" },
  "/feed": { view: FeedView, guard: "auth" },
  "/post": { view: PostView, guard: "auth" },
  "/profile": { view: ProfileView, guard: "auth" },
  "/user": { view: UserView, guard: "auth" },
};

function getPath() {
  const hash = location.hash.replace("#", "");
  return hash.split("?")[0] || "/login";
}

function getQuery() {
  const hash = location.hash.replace("#", "");
  const qs = hash.includes("?") ? hash.split("?")[1] : "";
  return new URLSearchParams(qs);
}

export function navigate(path) {
  location.hash = path;
}

export async function router() {
  const app = document.querySelector("#app");
  const path = getPath();
  const route = routes[path] || routes["/login"];

  // guards
  if (route.guard === "auth") {
    const ok = requireAuth();
    if (!ok) return;
  }
  if (route.guard === "guest") {
    redirectIfAuth();
  }

  app.innerHTML = "";
  const params = getQuery();
  const el = await route.view(params);
  app.append(el);
}

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", router);
