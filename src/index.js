import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import Root from "./pages/Root.js";
import Home from "./pages/Home.js";
import Subjects from "./pages/Subjects.js";
import SubjectDetail from "./pages/SubjectDetail.js";

const router = createBrowserRouter([
    // { path: "/",         element: <Root /> },
    // { path: "/subjects", element: <Subjects /> }
    {
        path: "/",
        element:  <Root />,
        children: [
            { path: "/",        element: <Home />     },
            { path: "subjects", element: <Subjects /> },
            { path: "subjects/:code", element: <SubjectDetail /> }
        ]
    }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
