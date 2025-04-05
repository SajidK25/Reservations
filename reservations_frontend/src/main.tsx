import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";


import App from "./App";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container not found!");
}

ReactDOM.createRoot(container).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
