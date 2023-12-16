import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, createHashRouter, RouterProvider } from "react-router-dom";
import "./index.css";


/*@author rfpramos
@date-time 09-12-2023 10:19

TODO: Implement SignUp Page and SignIn page
*/
import SignIn from "./pages/SignIn.js";
import SignUp from "./pages/SignUp.js";

//TODO (rfpramos): This is to implement the current Forms for checkout
import Checkout from "./pages/checkout/Checkout.js";


//TODO (cart): This is to implement the current Forms for checkout
import Cart from "./pages/Cart.js";



import Root from "./pages/Root.js";
import Home from "./pages/Home.js";
// import Subjects from "./pages/Subjects.js";
// import SubjectDetail from "./pages/SubjectDetail.js";

import ProductsPublic from "./pages/ProductsPublic.js";
import ManageProductsList from "./pages/manage/products/page.js"
import ManageProductsCreate from "./pages/manage/products/create/page.js"


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
            {
                path: "sign-in",
                element:  <SignIn />
            }, {
                path: "sign-up",
                element:  <SignUp />
            },
            // { path: "subjects", element: <Subjects /> },
            // { path: "subjects/:code", element: <SubjectDetail /> },
            {
                path: "products",
                element:  <ProductsPublic />
            }, 
            {
                //Checkout
                path: "checkout",
                element:  <Checkout />

            }, {
                //Checkout
                path: "cart",
                element:  <Cart />

            },{
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
