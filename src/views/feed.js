import { getAllPosts, createPost } from "../api/posts.js";
import { renderPosts } from "../ui/renderPosts.js";

export async function FeedView() {
  const el = document.createElement("section");
  el.className = "container";
  el.innerHTML = `
    <div class="d-flex align-items-center justify-content-between mb-3">
    <h1 class="h3 m-0">Feed</h1>
    </div>

    <div class="mb-3">
    <input id="search-input" class="form-control" placeholder="Search posts..." />
    </div>

    <form id="create-post" class="card p-3 mb-4">
      <div class="mb-2">
      <input class="form-control" name="title" placeholder="Title" required />
      </div>
      <div class="mb-2">
      <textarea class="form-control" name="body" placeholder="Body" rows="3"></textarea>
      </div>
      <div class="d-flex gap-2 align-items-center">
      <button class="btn btn-primary" type="submit">Create post</button>
      <p id="create-msg" class="m-0 text-muted"></p>
      </div>
    </form>

    <div id="feed-content"><p class="text-muted">Loading...</p></div>
  `;

  const feedContent = el.querySelector("#feed-content");
  const form = el.querySelector("#create-post");
  const msg = el.querySelector("#create-msg");
  let allPosts = [];

  async function load() {
    feedContent.innerHTML = "<p>Loading...</p>";
    const res = await getAllPosts();
    // const posts = res.data || [];
    // feedContent.innerHTML = "";
    // feedContent.append(renderPosts(posts));
    allPosts = res.data || []; //把 API 返回的数据保存起来。
    feedContent.innerHTML = "";
    feedContent.append(renderPosts(allPosts)); //渲染页面
  }

  // first load
  try {
    await load();
  } catch (err) {
    feedContent.innerHTML = `<p>${err.message}</p>`;
  }

  const searchInput = el.querySelector("#search-input");

  searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();

    const filtered = allPosts.filter((post) =>
      (post.title ?? "").toLowerCase().includes(q) ||
      (post.body ?? "").toLowerCase().includes(q)
    );

    feedContent.innerHTML = "";
    feedContent.append(renderPosts(filtered));
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "Creating...";

    const fd = new FormData(form);
    const title = fd.get("title");
    const body = fd.get("body");

    try {
      await createPost({ title, body });
      msg.textContent = "Created!";
      form.reset();
      await load();
    } catch (err) {
      msg.textContent = err.message;
    }
  });

  return el;
}
