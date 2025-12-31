import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";     // FIXED: using relative path
import "./index.css";            // FIXED: using relative path

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
