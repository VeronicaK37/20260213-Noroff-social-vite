import { loginUser, createApiKey } from "../api/auth.js";
import { setToken, setUser, getApiKey, setApiKey } from "../utils/storage.js";
import { navigate } from "../router.js";

export function LoginView() {
  const el = document.createElement("section");
  el.className = "container";
  el.innerHTML = `
    <h1>Login</h1>
    <form id="login-form">
      <label>
        Email
        <input name="email" type="email" required />
      </label>
      <label>
        Password
        <input name="password" type="password" required />
      </label>
      <button type="submit">Login</button>
      <p id="login-msg"></p>
    </form>
  `;

  const form = el.querySelector("#login-form");
  const msg = el.querySelector("#login-msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "Logging in...";

    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await loginUser({ email, password });

      // v2 通常返回 user + accessToken（如果字段名不一致，我们下一步再对齐）
      const token = res.data?.accessToken || res.accessToken;
      const user = res.data || res;

      setToken(token);
      setUser({ name: user.name, email: user.email });

    //   // 第一次登录：创建 API Key（只需要一次）
    //   if (!getApiKey()) {
    //     const keyRes = await createApiKey("Noroff Social SPA");
    //     const key = keyRes.data?.key || keyRes.key;
    //     setApiKey(key);
    //   }
    //更安全版本
if (!getApiKey()) {
  const keyRes = await createApiKey("Noroff Social SPA");

  console.log("API KEY RESPONSE:", keyRes);

  const key = keyRes?.data?.key || keyRes?.key;

  if (!key) {
    throw new Error("API key creation failed");
  }

  setApiKey(key);
}

    //更安全版本/

      msg.textContent = "Success!";
      navigate("/feed");
    } catch (err) {
      msg.textContent = err.message;
    }
  });

  return el;
}
