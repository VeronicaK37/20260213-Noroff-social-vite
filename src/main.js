import { navigate, router } from "./router.js";
import { clearAuth } from "./utils/storage.js";

document.addEventListener("click", (e) => {
  if (e.target?.id === "logout-btn") {
    clearAuth();
    location.hash = "#/login";
    navigate.reload();
  }
});

if (!location.hash) {
  navigate("/login");
}

router();

// import { apiRequest } from "./api/client.js";
// console.log(apiRequest);