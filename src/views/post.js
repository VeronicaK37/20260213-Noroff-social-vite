import { getPost, deletePost, updatePost, addComment } from "../api/posts.js";
import { getUser } from "../utils/storage.js";
import { navigate } from "../router.js";

export async function PostView(params) {
  const el = document.createElement("section");
  el.className = "container";
  const id = params.get("id");

  if (!id) {
    el.innerHTML = `<h1>Post</h1><p>Missing id</p><p><a href="#/feed">← Back</a></p>`;
    return el;
  }

  el.innerHTML = `<h1>Post</h1><p>Loading...</p>`;

  try {
    const res = await getPost(id);
    const post = res.data;
    console.log("comments from API:", post.comments);

    const me = getUser();
    const isOwner = me?.name && post.author?.name === me.name;
    console.log("owner check:", { me, author: post.author?.name, isOwner });

   el.innerHTML = `
      <div class="card shadow-sm">

        <div class="card-body">

          <h2 class="card-title">
            ${post.title ?? "No title"}
          </h2>

          <h6 class="text-muted mb-3">
            Author:
            <a class="author-link"
              href="#/user?name=${encodeURIComponent(post.author?.name ?? "")}">
              ${post.author?.name ?? "Unknown"}
            </a>
          </h6>

          <p class="card-text">
            ${post.body ?? ""}
          </p> 
           ${isOwner ? `
        <hr/>
        <h5>Edit Post</h5>

        <form id="edit-form" class="mb-3">

          <div class="mb-2">
            <input
              class="form-control"
              name="title"
              value="${escapeHtml(post.title ?? "")}"
              required
            />
          </div>

          <div class="mb-2">
            <textarea
              class="form-control"
              name="body"
              rows="4"
            >${escapeHtml(post.body ?? "")}</textarea>
          </div>

          <div class="d-flex gap-2 align-items-center">

            <button class="btn btn-primary btn-sm" type="submit">
              Save
            </button>

            <button id="delete-btn"
              class="btn btn-outline-danger btn-sm"
              type="button">
              Delete
            </button>

            <span id="owner-msg" class="text-muted small"></span>

          </div>

        </form>
      ` : ""}
          <hr/>

          <h5>Comments</h5>

          <div id="comments"></div>

          <form id="comment-form" class="mt-3">

            <textarea
              name="body"
              class="form-control mb-2"
              placeholder="Write a comment..."
              required
            ></textarea>

            <button class="btn btn-primary btn-sm">
              Add Comment
            </button>

            <p id="comment-msg"></p>

          </form>

          <hr/>

          <div id="reactions" class="mt-3">

            <button data-emoji="👍" class="btn btn-outline-secondary btn-sm">
              👍
            </button>

            <button data-emoji="❤️" class="btn btn-outline-secondary btn-sm">
              ❤️
            </button>

            <button data-emoji="😂" class="btn btn-outline-secondary btn-sm">
              😂
            </button>

            <span id="react-msg"></span>

          </div>

        </div>

      </div>
    `;
    //render comments
    const commentsBox = el.querySelector("#comments");
    const comments = post.comments || [];

    commentsBox.innerHTML = comments.length
      ? comments.map(c => `
          <div class="border rounded p-2 mb-2">
            <div class="small text-secondary">${escapeHtml(c.author?.name ?? "Unknown")}</div>
            <div>${escapeHtml(c.body ?? "")}</div>
          </div>
        `).join("")
      : `<p class="text-muted">No comments yet.</p>`;

    // --- comment submit ---
    const commentForm = el.querySelector("#comment-form");
    const commentMsg = el.querySelector("#comment-msg");

    commentForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      commentMsg.textContent = "Posting...";

      const body = new FormData(commentForm).get("body");

      try {
        await addComment(id, body);
        commentMsg.textContent = "Comment added!";
        commentForm.reset();
        location.hash = `#/post?id=${id}&t=${Date.now()}`; // reload
      } catch (err) {
        commentMsg.textContent = err.message;
      }
    });

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
