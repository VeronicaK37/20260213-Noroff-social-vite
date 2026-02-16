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
  const name = params.get("name");
  const me = getUser();

  if (!name) {
    el.innerHTML = `<h1>User</h1><p>Missing name. Use #/user?name=USERNAME</p>`;
    return el;
  }

  el.innerHTML = `<h1>User</h1><p>Loading...</p>`;

  try {
    const [profileRes, postsRes] = await Promise.all([
      getProfile(name),
      getPostsByUser(name),
    ]);

    const profile = profileRes.data;
    const posts = postsRes.data || [];

    // 是否是自己
    const isMe = me?.name === profile.name;

    // 粗略判断是否已关注：看 profile.followers 里有没有我
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
        <span id="follow-msg"></span>
      `}

      <hr/>
      <h2>${profile.name}'s Posts</h2>
    `;

    el.append(renderPosts(posts));

    // 绑定 follow/unfollow
    if (!isMe) {
      const btn = el.querySelector("#follow-btn");
      const msg = el.querySelector("#follow-msg");

      btn.addEventListener("click", async () => {
        msg.textContent = "Working...";

        try {
          if (btn.textContent === "Follow") {
            await followUser(profile.name);
            btn.textContent = "Unfollow";
            msg.textContent = "Followed";
          } else {
            await unfollowUser(profile.name);
            btn.textContent = "Follow";
            msg.textContent = "Unfollowed";
          }
        } catch (err) {
          msg.textContent = err.message;
        }
      });
    }
  } catch (err) {
    el.innerHTML = `<h1>User</h1><p>${err.message}</p>`;
  }

  return el;
}
