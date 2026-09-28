import React, { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { NavLink } from "react-router-dom";

import toast from "react-hot-toast";

import {
  setProducts,
  setProductsLoading,
  setProductsError,
} from "../features/Product/productSlice";

import {
  setOrders,
  setOrdersLoading,
  setOrdersError,
} from "../features/Orders/ordersSlice";

import { getProducts } from "../supabase/productService";

import { getAdminOrders } from "../supabase/orderService";

import { listCustomers } from "../supabase/adminCustomersService";

const Dashboard = () => {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.products.products || []);

  const orders = useSelector((state) => state.orders.orders || []);

  const currentUser = useSelector((state) => state.auth.currentUser);

  const productsLoading = useSelector((state) => state.products.loading);

  const ordersLoading = useSelector((state) => state.orders.loading);

  const [customers, setCustomers] = useState([]);

  const [customersLoading, setCustomersLoading] = useState(true);

  const [dashboardError, setDashboardError] = useState(null);

  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async (showToast = false) => {
    setDashboardError(null);

    dispatch(setProductsLoading(true));

    dispatch(setOrdersLoading(true));

    setCustomersLoading(true);

    try {
      const [productData, orderData, customerData] = await Promise.all([
        getProducts(),
        getAdminOrders(),
        listCustomers(),
      ]);

      dispatch(setProducts(productData));

      dispatch(setOrders(orderData));

      setCustomers(Array.isArray(customerData) ? customerData : []);

      if (showToast) {
        toast.success("Dashboard refreshed.");
      }
    } catch (error) {
      console.error("Unable to load dashboard:", error);

      const message = error.message || "Unable to load dashboard data.";

      setDashboardError(message);

      dispatch(setProductsError(message));

      dispatch(setOrdersError(message));

      if (showToast) {
        toast.error(message);
      }
    } finally {
      setCustomersLoading(false);

      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const validOrders = useMemo(
    () => orders.filter((order) => order.status !== "Cancelled"),
    [orders],
  );

  const totalRevenue = useMemo(
    () =>
      validOrders.reduce((total, order) => total + Number(order.total || 0), 0),
    [validOrders],
  );

  const pendingOrders = useMemo(
    () =>
      orders.filter((order) => !order.status || order.status === "Pending")
        .length,
    [orders],
  );

  const deliveredOrders = useMemo(
    () => orders.filter((order) => order.status === "Delivered").length,
    [orders],
  );

  const processingOrders = useMemo(
    () => orders.filter((order) => order.status === "Processing").length,
    [orders],
  );

  const shippedOrders = useMemo(
    () => orders.filter((order) => order.status === "Shipped").length,
    [orders],
  );

  const cancelledOrders = useMemo(
    () => orders.filter((order) => order.status === "Cancelled").length,
    [orders],
  );

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(b.createdAt || b.date || 0) -
            new Date(a.createdAt || a.date || 0),
        )
        .slice(0, 5),
    [orders],
  );

  const stats = [
    {
      title: "Total Products",

      value: products.length,

      icon: "📦",

      subtitle: "Products in your catalog",

      background: "from-sky-500 to-cyan-500",

      link: "/admin/products",
    },

    {
      title: "Total Orders",

      value: orders.length,

      icon: "🛒",

      subtitle: "Orders received",

      background: "from-indigo-500 to-violet-500",

      link: "/admin/orders",
    },

    {
      title: "Order Value",

      value: `$${totalRevenue.toFixed(2)}`,

      icon: "💰",

      subtitle: "Excluding cancelled orders",

      background: "from-emerald-500 to-teal-500",

      link: "/admin/orders",
    },

    {
      title: "Customers",

      value: customers.length,

      icon: "👥",

      subtitle: "Registered customer accounts",

      background: "from-orange-400 to-amber-500",

      link: "/admin/customers",
    },
  ];

  const orderStatuses = [
    {
      label: "Pending",

      count: pendingOrders,

      color: "bg-amber-400",

      text: "text-amber-700",
    },

    {
      label: "Processing",

      count: processingOrders,

      color: "bg-sky-500",

      text: "text-sky-700",
    },

    {
      label: "Shipped",

      count: shippedOrders,

      color: "bg-violet-500",

      text: "text-violet-700",
    },

    {
      label: "Delivered",

      count: deliveredOrders,

      color: "bg-emerald-500",

      text: "text-emerald-700",
    },

    {
      label: "Cancelled",

      count: cancelledOrders,

      color: "bg-red-500",

      text: "text-red-700",
    },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "Processing":
        return "bg-sky-100 text-sky-700";

      case "Shipped":
        return "bg-violet-100 text-violet-700";

      case "Delivered":
        return "bg-emerald-100 text-emerald-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const quickActions = [
    {
      title: "Manage Products",

      description: "View and organize your product catalog.",

      icon: "📦",

      path: "/admin/products",
    },

    {
      title: "Manage Orders",

      description: "Review purchases and update order statuses.",

      icon: "🛒",

      path: "/admin/orders",
    },

    {
      title: "View Customers",

      description: "Explore registered customer accounts.",

      icon: "👥",

      path: "/admin/customers",
    },
  ];

  const isLoading = productsLoading || ordersLoading || customersLoading;

  const handleRefresh = async () => {
    if (refreshing) {
      return;
    }

    setRefreshing(true);

    await loadDashboard(true);
  };

  return (
    <div className="w-full min-w-0 space-y-7">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-5">
          <div className="min-w-0">
            <span className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-bold text-sky-300">
              ☀️ NIKACART ADMIN
            </span>

            <h2 className="mt-4 text-2xl font-black sm:text-3xl">
              Welcome back,{" "}
              <span className="text-sky-400">
                {currentUser?.name?.split(" ")[0] || "Admin"}
              </span>
              !
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              Here's an overview of your store, customer activity, and recent
              orders.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center justify-center rounded-xl border border-sky-400/30 bg-sky-400/10 px-5 py-3 text-sm font-bold text-sky-200 transition hover:bg-sky-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {refreshing ? "Refreshing..." : "↻ Refresh"}
            </button>

            <NavLink
              to="/admin/products"
              className="inline-flex items-center justify-center rounded-xl bg-sky-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-sky-300 active:scale-95"
            >
              Manage Products →
            </NavLink>
          </div>
        </div>
      </section>

      {dashboardError && (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-red-700">
              ⚠️ {dashboardError}
            </p>

            <button
              type="button"
              onClick={handleRefresh}
              className="rounded-lg bg-red-100 px-4 py-2 text-xs font-bold text-red-700 transition hover:bg-red-200"
            >
              Try Again
            </button>
          </div>
        </section>
      )}

      <section className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <NavLink
            key={stat.title}
            to={stat.link}
            className="group min-w-0 overflow-hidden rounded-2xl border border-sky-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.background} text-2xl shadow-lg`}
              >
                {stat.icon}
              </div>

              <span className="text-lg text-slate-400 transition group-hover:translate-x-1 group-hover:text-sky-600">
                ↗
              </span>
            </div>

            <p className="mt-5 text-sm font-semibold text-slate-500">
              {stat.title}
            </p>

            <h3 className="mt-2 break-words text-2xl font-black text-slate-900 sm:text-3xl">
              {isLoading ? "..." : stat.value}
            </h3>

            <p className="mt-2 text-xs text-slate-500">{stat.subtitle}</p>
          </NavLink>
        ))}
      </section>

      <section className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="min-w-0 rounded-2xl border border-sky-100 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Revenue Overview
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Total value of non-cancelled orders
              </p>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
              Store Summary
            </span>
          </div>

          <div className="mt-7 rounded-2xl bg-gradient-to-br from-sky-50 to-slate-100 p-5 sm:p-6">
            <p className="text-sm font-semibold text-slate-500">
              Total Order Value
            </p>

            <h4 className="mt-2 break-words text-3xl font-black text-slate-900 sm:text-4xl">
              ${totalRevenue.toFixed(2)}
            </h4>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-500"
                style={{
                  width:
                    orders.length > 0
                      ? `${(validOrders.length / orders.length) * 100}%`
                      : "0%",
                }}
              />
            </div>

            <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs font-semibold text-slate-500">
              <span>{validOrders.length} non-cancelled orders</span>

              <span>{orders.length} total orders</span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-700">
                ⏳ Pending Orders
              </p>

              <p className="mt-2 text-2xl font-black text-slate-900">
                {pendingOrders}
              </p>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-700">
                ✅ Delivered Orders
              </p>

              <p className="mt-2 text-2xl font-black text-slate-900">
                {deliveredOrders}
              </p>
            </div>
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-sky-100 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-lg font-black text-slate-900">Order Status</h3>

          <p className="mt-1 text-xs text-slate-500">
            Current order distribution
          </p>

          <div className="mt-7 space-y-5">
            {orderStatuses.map((status) => {
              const percentage =
                orders.length > 0 ? (status.count / orders.length) * 100 : 0;

              return (
                <div key={status.label}>
                  <div className="mb-2 flex items-center justify-between gap-2 text-sm">
                    <span className={`font-bold ${status.text}`}>
                      {status.label}
                    </span>

                    <span className="font-bold text-slate-700">
                      {status.count}
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${status.color} transition-all duration-500`}
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <NavLink
            to="/admin/orders"
            className="mt-7 inline-flex text-sm font-bold text-sky-700 transition hover:text-sky-900"
          >
            Manage All Orders →
          </NavLink>
        </div>
      </section>

      <section className="min-w-0 rounded-2xl border border-sky-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900">Recent Orders</h3>

            <p className="mt-1 text-xs text-slate-500">
              Latest customer purchases
            </p>
          </div>

          <NavLink
            to="/admin/orders"
            className="rounded-lg bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 transition hover:bg-sky-100"
          >
            View All →
          </NavLink>
        </div>

        {ordersLoading ? (
          <div className="rounded-xl bg-slate-50 px-4 py-12 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-sky-100 border-t-sky-500" />

            <p className="mt-4 font-semibold text-slate-600">
              Loading recent orders...
            </p>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="rounded-xl bg-slate-50 px-4 py-12 text-center">
            <p className="text-5xl">📭</p>

            <p className="mt-3 font-semibold text-slate-600">
              No orders have been placed yet.
            </p>
          </div>
        ) : (
          <div className="w-full min-w-0 overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-4">Order ID</th>

                  <th className="px-4 py-4">Customer</th>

                  <th className="px-4 py-4">Date</th>

                  <th className="px-4 py-4">Total</th>

                  <th className="px-4 py-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => {
                  const orderDate = order.createdAt || order.date;

                  const formattedDate =
                    orderDate && !Number.isNaN(new Date(orderDate).getTime())
                      ? new Date(orderDate).toLocaleDateString()
                      : "—";

                  return (
                    <tr
                      key={order.id}
                      className="border-t border-slate-100 transition hover:bg-sky-50/60"
                    >
                      <td className="max-w-[170px] break-all px-4 py-4 font-bold text-slate-900">
                        {order.id}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {order.customer?.fullName ||
                          order.customer?.name ||
                          "Customer"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                        {formattedDate}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 font-bold text-slate-900">
                        ${Number(order.total || 0).toFixed(2)}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            order.status,
                          )}`}
                        >
                          {order.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <div className="mb-4">
          <h3 className="text-lg font-black text-slate-900">Quick Actions</h3>

          <p className="mt-1 text-sm text-slate-500">
            Jump directly to your management pages.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quickActions.map((action) => (
            <NavLink
              key={action.path}
              to={action.path}
              className="group flex min-w-0 items-center gap-4 rounded-2xl border border-sky-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-2xl">
                {action.icon}
              </span>

              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-slate-900">{action.title}</h4>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {action.description}
                </p>
              </div>

              <span className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-sky-600">
                →
              </span>
            </NavLink>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
