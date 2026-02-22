import { navigate } from "../router.js";

export function renderPosts(posts) {
  const container = document.createElement("div");

  posts.forEach((post) => {
    const card = document.createElement("article");
    card.className = "card mb-3 shadow-sm post-card";

    const title = post.title?.trim() ? post.title : "No title";
    const body = post.body?.trim() ? post.body : "";

    card.innerHTML = `
      <div class="card-body py-3">

        <div class="d-flex justify-content-between align-items-start gap-2">
          <div class="w-100">
            <div class="d-flex align-items-center gap-2 mb-1">
              <a class="author-link fw-semibold text-decoration-none"
                href="#/user?name=${encodeURIComponent(post.author?.name ?? "")}">
                ${post.author?.name ?? "Unknown"}
              </a>
              <span class="text-secondary small">•</span>
              <span class="text-secondary small">${post.created ?? ""}</span>
            </div>

            <div class="fw-semibold">${title}</div>

            <div class="text-muted mt-2 feed-body">
              ${body}
            </div>
          </div>

          <span class="badge text-bg-light border">Post</span>
        </div>

      </div>
    `;

    card.style.cursor = "pointer";

    card.addEventListener("click", () => {
      navigate(`/post?id=${post.id}`);
    });

    const authorLink = card.querySelector(".author-link");
    if (authorLink) {
      authorLink.addEventListener("click", (e) => e.stopPropagation());
    }


    container.append(card);
  });

  return container;
}
