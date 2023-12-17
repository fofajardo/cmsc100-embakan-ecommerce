import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, createHashRouter, RouterProvider } from "react-router-dom";
import "./index.css";


/*@author rfpramos
@date-time 09-12-2023 10:19

TODO: Implement SignUp Page and SignIn page
*/
import SignOut from "./pages/sign-out/page.js";
import SignIn from "./pages/sign-in/page.js";
import SignUp from "./pages/sign-up/page.js";

//TODO (cart): This is to implement the current Forms for checkout
import Cart from "./pages/Cart.js";
import Details from "./pages/checkout/Details.js";
import ReviewOrder from "./pages/checkout/ReviewOrder.js";
import Checkout from "./pages/checkout/Checkout.js";

//TODO (cart): This is to implement merchant dashboards and its view
import MerchantDashboard from "./pages/manage/merchant-dashboard/Dashboard.js"
import MerchantAccounts from "./pages/manage/merchant-dashboard/Accounts.js"
import MerchantOrders from "./pages/manage/merchant-dashboard/Orders.js"
import MerchantSales from "./pages/manage/merchant-dashboard/Sales.js"

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
            // { path: "subjects", element: <Subjects /> },
            // { path: "subjects/:code", element: <SubjectDetail /> },
            {
                //Checkout
                path: "cart",
                children:[{
                    path: "shopping-cart",
                    element:  <Cart />
                }, {
                    path: "checkout",
                    element:  <Checkout />
                }, {
                    path: "review",
                    element:  <ReviewOrder />
                }, {
                    path: "details",
                    element:  <Details />
                }
                ]
          

            },
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
                        
                        path: "dashboard",
                            children:[
                                {
                                path : "merchant-view",
                                element:  <MerchantDashboard />
                                }, 
                                {
                                    path : "accounts",
                                    element:  <MerchantAccounts />
                                },
                                {
                                    path : "orders",
                                    element:  <MerchantOrders />
                                },  {
                                    path : "sales",
                                    element:  <MerchantSales />
                                }
                            ]
                            
                        
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
