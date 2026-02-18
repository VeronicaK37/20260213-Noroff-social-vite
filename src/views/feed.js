import { getAllPosts, createPost } from "../api/posts.js";
import { renderPosts } from "../ui/renderPosts.js";

export async function FeedView() {
  const el = document.createElement("section");
  el.innerHTML = `
    <h1>Feed</h1>

    <input id="search-input" placeholder="Search posts..." />

    <form id="create-post">
      <input name="title" placeholder="Title" required />
      <textarea name="body" placeholder="Body"></textarea>
      <button type="submit">Create post</button>
      <p id="create-msg"></p>
    </form>

    <div id="feed-content"><p>Loading...</p></div>
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
