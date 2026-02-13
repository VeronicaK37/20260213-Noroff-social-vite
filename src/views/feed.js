import { getAllPosts, createPost } from "../api/posts.js";
import { renderPosts } from "../ui/renderPosts.js";

export async function FeedView() {
  const el = document.createElement("section");
  el.innerHTML = `
    <h1>Feed</h1>

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

  async function load() {
    feedContent.innerHTML = "<p>Loading...</p>";
    const res = await getAllPosts();
    const posts = res.data || [];
    feedContent.innerHTML = "";
    feedContent.append(renderPosts(posts));
  }

  // first load
  try {
    await load();
  } catch (err) {
    feedContent.innerHTML = `<p>${err.message}</p>`;
  }

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
