export function UserView(params) {
  const el = document.createElement("section");
  el.innerHTML = `<h1>User</h1><p>name: ${params.get("name") ?? "none"}</p>`;
  return el;
}