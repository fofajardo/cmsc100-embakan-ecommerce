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
    id: 1,
    Name: "Bitter Melon (Ampalaya)",
    Type: "Crop",
    Description: "Harvested from Benguet.",
    Price: 96,
    Stock: 50,
    Variant: "KG (4-5 pcs)",
    Quantity: 1,
};

// poultry product test case for product detail view.
const poultry_product = {
    id: 2,
    Name: " Whole Chicken",
    Type: "Poultry",
    Description: "Born and raised from Bacolod.", 
    Price: 175,
    Stock: 50,
    Variant: "Whole",
    Quantity: 1,
};

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
                element:  <ProductsPublic />,
                children: [
                    {
                        path:"view/:id",
                        element: <ProductDetailView data = {crop_product} />    // test for crop
                        // element: <ProductDetailView data = {poultry_view} />    // test for poultry
                    }
                ]
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
