import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, createHashRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import Root from "./pages/Root.js";
import Home from "./pages/Home.js";
// import Subjects from "./pages/Subjects.js";
// import SubjectDetail from "./pages/SubjectDetail.js";

import ProductsPublic from "./pages/ProductsPublic.js";
import ManageProductsList from "./pages/manage/products/page.js"
import ManageProductsCreate from "./pages/manage/products/create/page.js"
import ManageProductsEdit from "./pages/manage/products/edit/page.js"
import ProductDetailView from "./pages/ProductDetailView.js";  

// crop product test case for product detail view.
const crop_product = {
    name: "Kangkong (Water Spinach)",
    description: "Harvested from the province of Laguna, this is great for soup dishes like sinigang.",
    type: "Crop",
    price: 25,
    stock: 50,
    quantity: 1,
    variant: "tali",
    image:"./components/products/crops/kangkong.png"
}

// poultry product test case for product detail view.
const poultry_product = {
    name: " Whole Chicken",
    description: "Raised in the stress-free environment of Bacolod, this poultry is great for dishes such as tinola, inasal, and more.",
    type: "poultry",
    price: 175,
    stock: 50,
    quantity: 1,
    variant: "chicken",
    image:"./components/products/poultry/chicken.png"
}

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
                element:  <ProductsPublic />
            }, {
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
