import { navigate } from "../router.js";

export function renderPosts(posts) {
  const container = document.createElement("div");

  posts.forEach((post) => {
    const card = document.createElement("article");

    card.innerHTML = `
      <h3>${post.title ?? "No title"}</h3>
      <p>${post.body ?? ""}</p>
      <small>Author: ${post.author?.name}</small>
      <hr/>
    `;

    card.style.cursor = "pointer";

    card.addEventListener("click", () => {
      navigate(`/post?id=${post.id}`);
    });

    container.append(card);
  });

  return container;
}
