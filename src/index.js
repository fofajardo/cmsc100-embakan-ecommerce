import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, createHashRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import Root from "./pages/Root.js";
import Home from "./pages/Home.js";
// import Subjects from "./pages/Subjects.js";
// import SubjectDetail from "./pages/SubjectDetail.js";

import CustomerProductsList from "./pages/products/page.js";
import ManageProductsList from "./pages/manage/products/page.js"
import ManageProductsCreate from "./pages/manage/products/create/page.js"
import ManageProductsEdit from "./pages/manage/products/edit/page.js"
import ProductDetailView from "./pages/ProductDetailView.js"

const router = createHashRouter([
    // { path: "/",         element: <Root /> },
    // { path: "/subjects", element: <Subjects /> }
    {
        path: "/",
        element:  <Root />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            // { path: "subjects", element: <Subjects /> },
            // { path: "subjects/:code", element: <SubjectDetail /> },
            {
                path: "products",
                element:  <CustomerProductsList filterType={-1} />
                // children: [
                //     {
                //         path: "view/:id",  
                //         element: <ProductDetailView />
                //     }  
                // ]
            },
            {
                path: "crops",
                element:  <CustomerProductsList filterType={1} />,
                // children: [
                //     {
                //         path: "view/:id",  
                //         element: <ProductDetailView />
                //     }  
                // ]
            },
            {
                path: "poultry",
                element:  <CustomerProductsList filterType={2} />,
                // children: [
                //     {
                //         path: "view/:id",  
                //         element: <ProductDetailView />
                //     }  
                // ] 
            },
            {
                path: "view",
                element: <ProductDetailView />      // for testing purposes, no API integration.
            },
            {
                path: "manage",
                children: [
                    {
                        path: "products",
                        children: [
                            {
                                path: "",
                                element: <ManageProductsList />
                            },
                            {
                                path: "create",
                                element: <ManageProductsCreate />
                            },
                            {
                                path: "edit/:id",
                                element: <ManageProductsEdit />
                            },
                        ],
                    },
                ]
            },
        ]
    }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
