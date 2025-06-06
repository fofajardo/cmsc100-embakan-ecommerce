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
import Checkout from "./pages/checkout/page.js";

import Root from "./pages/Root.js";

import Account from "./pages/account/page.js";
import AccountChangePassword from "./pages/account/change-password/page.js";

import CustomerOrders from "./pages/account/orders/page.js";
import CustomerProductsList from "./pages/products/page.js";
import CustomerProductDetailView from "./pages/products/slug/page.js";

import ManageProductsList from "./pages/manage/products/page.js";
import ManageProductsCreate from "./pages/manage/products/create/page.js";
import ManageProductsEdit from "./pages/manage/products/edit/page.js";
import ManageAccounts from "./pages/manage/accounts/page.js";
import ManageOrders from "./pages/manage/orders/page.js";
import ManageSales from "./pages/manage/sales/page.js";
import ManageDashboard from "./pages/manage/page.js";

const router = createHashRouter([
    {
        path: "/",
        element:  <Root />,
        children: [
            {
                path: "/",
                element: <CustomerProductsList filterType={-1} />
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
                children: [
                    {
                        path: "",
                        element: <Account />
                    },
                    {
                        path: "orders",
                        element: <CustomerOrders />
                    },
                    {
                        path: "change-password",
                        element: <AccountChangePassword />
                    }
                ]
            },
            {
                path: "cart",
                element: <Cart />
            },
            {
                path: "checkout",
                element: <Checkout />
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
                        path: "",
                        element: <ManageDashboard />
                    },
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
