import { navigate } from "../router.js";

export function renderPosts(posts) {
  const container = document.createElement("div");

  posts.forEach((post) => {
    const card = document.createElement("article");

    card.innerHTML = `
      <h3>${post.title ?? "No title"}</h3>
      <p>${post.body ?? ""}</p>
      <small>
        Author:
        <a class="author-link" href="#/user?name=${encodeURIComponent(post.author?.name ?? "")}">
          ${post.author?.name ?? "Unknown"}
        </a>
      </small>
      <hr/>
    `;

    card.style.cursor = "pointer";

    card.addEventListener("click", () => {
      navigate(`/post?id=${post.id}`);
    });

    //为了防止点击作者链接也触发整张卡片的 click（跳 post），给 link 加 stopPropagation：
    const authorLink = card.querySelector(".author-link");
    if (authorLink) {
      authorLink.addEventListener("click", (e) => e.stopPropagation());
    }


    container.append(card);
  });

  return container;
}
