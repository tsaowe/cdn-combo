import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";

import { Home } from "./pages/home.jsx";
import { Tree } from "./pages/tree.jsx";
const router = createHashRouter([
  { path: "/", element: <Home /> },
  { path: "/tree/:packageName", element: <Tree /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
