// export function UserView(params) {
//   const el = document.createElement("section");
//   el.innerHTML = `<h1>User</h1><p>name: ${params.get("name") ?? "none"}</p>`;
//   return el;
// }

import { getUser } from "../utils/storage.js";
import { getProfile, getPostsByUser, followUser, unfollowUser } from "../api/profiles.js";
import { renderPosts } from "../ui/renderPosts.js";

export async function UserView(params) {
  const el = document.createElement("section");
  el.className = "container";
  const name = params.get("name");
  const me = getUser();

  if (!name) {
    el.innerHTML = `<h1>User</h1><p>Missing name. Use #/user?name=USERNAME</p>`;
    return el;
  }

  el.innerHTML = `<h1>User</h1><p>Loading...</p>`;

  async function load() {
    const [profileRes, postsRes] = await Promise.all([
      getProfile(name),
      getPostsByUser(name),
    ]);

    const profile = profileRes.data;
    const posts = postsRes.data || [];

    const isMe = me?.name === profile.name;

    const followers = profile.followers || [];
    const isFollowing = !!me?.name && followers.some((p) => p.name === me.name);

    const bioText = profile.bio?.trim() ? profile.bio : "No bio yet.";

    el.innerHTML = `
      <h1>User: ${profile.name}</h1>
      <p><strong>Bio:</strong> ${bioText}</p>
      <p>
        <strong>Followers:</strong> ${profile._count?.followers ?? 0}
        &nbsp;|&nbsp;
        <strong>Following:</strong> ${profile._count?.following ?? 0}
      </p>

      ${isMe ? "" : `
        <button id="follow-btn" type="button">
          ${isFollowing ? "Unfollow" : "Follow"}
        </button>
        <span id="follow-msg">
          ${isFollowing ? "You are following this profile" : "You are not following this profile"}
        </span>
      `}

      <hr/>
      <h2>${profile.name}'s Posts</h2>
    `;

    el.append(renderPosts(posts));

    if (!isMe) {
      const btn = el.querySelector("#follow-btn");
      const msg = el.querySelector("#follow-msg");

      btn.addEventListener("click", async () => {
        btn.disabled = true;
        msg.textContent = "Working...";

        try {
          if (btn.textContent.trim() === "Follow") {
            await followUser(profile.name);
          } else {
            await unfollowUser(profile.name);
          }
          await load(); // ✅ 关键：重新拉 profile，刷新状态/计数/按钮
        } catch (err) {
          msg.textContent = err.message;
        } finally {
          btn.disabled = false;
        }
      });
    }
  }

  try {
    await load();
  } catch (err) {
    el.innerHTML = `<h1>User</h1><p>${err.message}</p>`;
  }

  return el;
}

