import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import App from "./App";
import { useAuthStore } from "./store/authStore";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container not found!");
}

// Preload user profile if token exists
const token = sessionStorage.getItem("access_token");
if (token) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  useAuthStore.getState().fetchUser();
}

ReactDOM.createRoot(container).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
