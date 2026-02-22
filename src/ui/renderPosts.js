import { navigate } from "../router.js";

export function renderPosts(posts) {
  const container = document.createElement("div");

  posts.forEach((post) => {
    const card = document.createElement("article");
    card.className = "card p-3 mb-3 shadow-sm post-card";

    card.innerHTML = `
    <div class="card-body">
    
      <h5 class="card-title mb-1">
        ${post.title ?? "No title"}
      </h5>

      <h6 class="card-subtitle mb-2 text-muted">
        Author:
        <a class="author-link text-decoration-none"
          href="#/user?name=${encodeURIComponent(post.author?.name ?? "")}">
          ${post.author?.name ?? "Unknown"}
        </a>
      </h6>

      <p class="card-text mt-3">
        ${post.body ?? ""}
      </p>

    </div>
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
