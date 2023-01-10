import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";

import { Home } from "./pages/home.jsx";
import { Tree } from "./pages/tree.jsx";
import { Versions } from "./pages/versions.jsx";
const router = createHashRouter([
  { path: "/", element: <Home /> },
  { path: "/versions/:packageName", element: <Versions /> },
  { path: "/tree/:packageName/:version", element: <Tree /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
