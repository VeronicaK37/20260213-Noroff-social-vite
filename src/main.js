import { navigate, router } from "./router.js";

if (!location.hash) {
  navigate("/login");
}

router();

// import { apiRequest } from "./api/client.js";
// console.log(apiRequest);