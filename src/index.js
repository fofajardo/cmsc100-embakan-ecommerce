import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import "./index.css";


/*@author rfpramos
@date-time 09-12-2023 10:19

TODO: Implement SignUp Page and SignIn page
*/
import SignOut from "./pages/sign-out/page.js";
import SignIn from "./pages/sign-in/page.js";
import SignUp from "./pages/sign-up/page.js";

//TODO (cart): This is to implement the current Forms for checkout
import Cart from "./pages/cart/page.js";
import Details from "./pages/checkout/Details.js";
import ReviewOrder from "./pages/checkout/ReviewOrder.js";
import Checkout from "./pages/checkout/Checkout.js";

import Root from "./pages/Root.js";

import Account from "./pages/account/page.js";

import CustomerProductsList from "./pages/products/page.js";
import CustomerProductDetailView from "./pages/products/slug/page.js";

import ManageProductsList from "./pages/manage/products/page.js";
import ManageProductsCreate from "./pages/manage/products/create/page.js";
import ManageProductsEdit from "./pages/manage/products/edit/page.js";
import ManageAccounts from "./pages/manage/accounts/page.js";
import ManageOrders from "./pages/manage/orders/page.js";
import ManageSales from "./pages/manage/sales/page.js";

const router = createHashRouter([
    {
        path: "/",
        element:  <Root />,
        children: [
            {
                path: "/",
                element: <CustomerProductsList />
            },
            {
                path: "sign-in",
                element:  <SignIn />
            },
            {
                path: "sign-out",
                element:  <SignOut />
            },
            {
                path: "sign-up",
                element:  <SignUp />
            },
            {
                path: "account",
                element:  <Account />
            },
            {
                //Checkout
                path: "cart",
                children: [
                    {
                        path: "",
                        element:  <Cart />
                    },
                    {
                        path: "checkout",
                        element:  <Checkout />
                    },
                    {
                        path: "review",
                        element:  <ReviewOrder />
                    },
                    {
                        path: "details",
                        element:  <Details />
                    }
                ]
            },
            {
                path: "products",
                children: [
                    {
                        path: "",
                        element:  <CustomerProductsList filterType={-1} />
                    },
                    {
                        path: ":slug",
                        children: [
                            {
                                path: "",
                                element: <CustomerProductDetailView />                                
                            },
                            {
                                path: ":variantIndex",
                                element: <CustomerProductDetailView />                                
                            }
                        ]
                    },
                ]
            },
            {
                path: "crops",
                element:  <CustomerProductsList filterType={1} />,
            },
            {
                path: "poultry",
                element:  <CustomerProductsList filterType={2} />,
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
                    {
                        path : "accounts",
                        element:  <ManageAccounts />
                    },
                    {
                        path : "orders",
                        element:  <ManageOrders />
                    },  {
                        path : "sales",
                        element:  <ManageSales />
                    }
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
