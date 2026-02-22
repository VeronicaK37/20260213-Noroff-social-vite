import { registerUser } from "../api/auth.js";
import { navigate } from "../router.js";

export function RegisterView() {
  const el = document.createElement("section");
  el.className = "container";
  el.innerHTML = `
    <h1>Register</h1>
    <form id="register-form">
      <label>
        Name
        <input name="name" required />
      </label>
      <label>
        Email
        <input name="email" type="email" required />
      </label>
      <label>
        Password
        <input name="password" type="password" required />
      </label>
      <button type="submit">Create account</button>
      <p id="register-msg"></p>
    </form>
  `;

  const form = el.querySelector("#register-form");
  const msg = el.querySelector("#register-msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "Registering...";

    const formData = new FormData(form);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await registerUser({ name, email, password });
      msg.textContent = "Registered! Go login.";
      navigate("/login");
    } catch (err) {
      msg.textContent = err.message;
    }
  });

  return el;
}
