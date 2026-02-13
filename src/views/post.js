import { getPost, deletePost, updatePost } from "../api/posts.js";
import { getUser } from "../utils/storage.js";
import { navigate } from "../router.js";

export async function PostView(params) {
  const el = document.createElement("section");
  const id = params.get("id");

  if (!id) {
    el.innerHTML = `<h1>Post</h1><p>Missing id</p><p><a href="#/feed">← Back</a></p>`;
    return el;
  }

  el.innerHTML = `<h1>Post</h1><p>Loading...</p>`;

  try {
    const res = await getPost(id);
    const post = res.data;

    const me = getUser();
    const isOwner = me?.name && post.author?.name === me.name;

    el.innerHTML = `
      <h1>${post.title ?? "No title"}</h1>
      <p>${post.body ?? ""}</p>
      <p><small>Author: ${post.author?.name ?? "Unknown"}</small></p>

      ${isOwner ? `
        <hr/>
        <h2>Edit</h2>
        <form id="edit-form">
          <input name="title" value="${escapeHtml(post.title ?? "")}" required />
          <textarea name="body">${escapeHtml(post.body ?? "")}</textarea>
          <button type="submit">Save changes</button>
          <button type="button" id="delete-btn">Delete post</button>
          <p id="owner-msg"></p>
        </form>
      ` : ""}

      <p><a href="#/feed">← Back to feed</a></p>
    `;

    if (isOwner) {
      const form = el.querySelector("#edit-form");
      const delBtn = el.querySelector("#delete-btn");
      const msg = el.querySelector("#owner-msg");

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        msg.textContent = "Saving...";

        const fd = new FormData(form);
        const title = fd.get("title");
        const body = fd.get("body");

        try {
          await updatePost(id, { title, body });
          msg.textContent = "Saved!";
        } catch (err) {
          msg.textContent = err.message;
        }
      });

      delBtn.addEventListener("click", async () => {
        const ok = confirm("Delete this post?");
        if (!ok) return;

        msg.textContent = "Deleting...";
        try {
          await deletePost(id);
          navigate("/feed");
        } catch (err) {
          msg.textContent = err.message;
        }
      });
    }
  } catch (err) {
    el.innerHTML = `<h1>Post</h1><p>${err.message}</p><p><a href="#/feed">← Back</a></p>`;
  }

  return el;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
