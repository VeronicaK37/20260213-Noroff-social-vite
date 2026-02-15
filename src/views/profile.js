import { getUser } from "../utils/storage.js";
import { getProfile, getPostsByUser } from "../api/profiles.js";
import { renderPosts } from "../ui/renderPosts.js";

export async function ProfileView() {
  const el = document.createElement("section");
  const me = getUser();

  el.innerHTML = `<h1>My Profile</h1><p>Loading...</p>`;

  if (!me?.name) {
    el.innerHTML = `<h1>My Profile</h1><p>Missing user. Please login again.</p>`;
    return el;
  }

  try {
    const [profileRes, postsRes] = await Promise.all([
      getProfile(me.name),
      getPostsByUser(me.name),
    ]);

    const profile = profileRes.data;
    const posts = postsRes.data || [];

    el.innerHTML = `
      <h1>My Profile</h1>
      <p><strong>Name:</strong> ${profile.name}</p>
      <p><strong>Email:</strong> ${profile.email ?? ""}</p>
      <p><strong>Bio:</strong> ${profile.bio ?? ""}</p>
      <p>
        <strong>Followers:</strong> ${profile._count?.followers ?? 0}
        &nbsp;|&nbsp;
        <strong>Following:</strong> ${profile._count?.following ?? 0}
      </p>
      <hr/>
      <h2>My Posts</h2>
    `;

    el.append(renderPosts(posts));
  } catch (err) {
    el.innerHTML = `<h1>My Profile</h1><p>${err.message}</p>`;
  }

  return el;
}
