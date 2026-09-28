import React from "react";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import "./App.css";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";

import ProtectedRoute from "./componants/ProtectedRoute";
import AdminRoute from "./componants/AdminRoute";

import AdminLayout from "./componants/AdminLayout";
import Dashboard from "./pages/Dashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminCustomers from "./pages/AdminCustomers";

const router = createBrowserRouter([
  {
    path: "/welcome",
    element: <Welcome />,
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/register",
    element: <Register />,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Home />,
      },

      {
        path: "/products",
        element: <Products />,
      },

      {
        path: "/products/:id",
        element: <ProductDetails />,
      },

      {
        path: "/cart",
        element: <Cart />,
      },

      {
        path: "/wishlist",
        element: <Wishlist />,
      },

      {
        path: "/checkout",
        element: <Checkout />,
      },

      {
        path: "/order-confirmation/:id",
        element: <OrderConfirmation />,
      },

      {
        path: "/orders",
        element: <Orders />,
      },

      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },

  {
    element: <AdminRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },

          {
            path: "products",
            element: <AdminProducts />,
          },

          {
            path: "orders",
            element: <AdminOrders />,
          },

          {
            path: "customers",
            element: <AdminCustomers />,
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/welcome" replace />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
