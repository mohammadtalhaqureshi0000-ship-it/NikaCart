import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { NavLink } from "react-router-dom";

import {
  setOrders,
  setOrdersLoading,
  setOrdersError,
} from "../features/Orders/ordersSlice";

import { getMyOrders } from "../supabase/orderService";

import ProductImage from "../componants/ProductImage";

const Orders = () => {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.currentUser);

  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      if (!currentUser || currentUser.role === "admin") {
        if (active) {
          dispatch(setOrders([]));
        }

        return;
      }

      dispatch(setOrdersLoading(true));

      try {
        const data = await getMyOrders();

        if (!active) {
          return;
        }

        dispatch(setOrders(data));
      } catch (error) {
        console.error("Unable to load orders:", error);

        if (!active) {
          return;
        }

        dispatch(
          setOrdersError(error.message || "Unable to load your orders."),
        );
      }
    };

    loadOrders();

    return () => {
      active = false;
    };
  }, [dispatch, currentUser?.id, currentUser?.role]);

  const handleRetry = () => {
    window.location.reload();
  };

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

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-200 via-sky-100 to-gray-300 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <NavLink
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-sky-300 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 shadow-sm transition duration-300 hover:-translate-x-1 hover:bg-sky-100"
          >
            ← Back to Home
          </NavLink>

          <div className="flex min-h-[65vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-sky-200 border-t-sky-500" />

              <p className="mt-5 font-semibold text-slate-700">
                Loading your orders...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-200 via-sky-100 to-gray-300 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <NavLink
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-sky-300 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 shadow-sm transition duration-300 hover:-translate-x-1 hover:bg-sky-100"
          >
            ← Back to Home
          </NavLink>

          <div className="flex min-h-[65vh] items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-lg">
              <div className="mb-4 text-6xl">⚠️</div>

              <h1 className="mb-3 text-2xl font-bold text-slate-900">
                Unable to Load Orders
              </h1>

              <p className="mb-6 text-slate-600">{error}</p>

              <button
                type="button"
                onClick={handleRetry}
                className="rounded-lg bg-sky-500 px-6 py-3 font-semibold text-white transition hover:bg-sky-600 active:scale-95"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-200 via-sky-100 to-gray-300 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <NavLink
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-sky-300 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 shadow-sm transition duration-300 hover:-translate-x-1 hover:bg-sky-100"
          >
            ← Back to Home
          </NavLink>

          <div className="flex min-h-[65vh] items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border border-sky-200 bg-white p-8 text-center shadow-lg">
              <div className="mb-4 text-6xl">📦</div>

              <h1 className="mb-3 text-3xl font-bold text-slate-900">
                No Orders Yet
              </h1>

              <p className="mb-6 text-slate-600">
                Your order history will appear here once you place an order.
              </p>

              <NavLink
                to="/products"
                className="inline-block rounded-lg bg-sky-500 px-6 py-3 font-semibold text-white transition hover:bg-sky-600 active:scale-95"
              >
                Start Shopping
              </NavLink>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-200 via-sky-100 to-gray-300 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <NavLink
          to="/"
          className="mb-8 inline-flex items-center gap-2 rounded-lg border border-sky-300 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 shadow-sm transition duration-300 hover:-translate-x-1 hover:bg-sky-100"
        >
          ← Back to Home
        </NavLink>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            My Orders 📦
          </h1>

          <p className="mt-2 text-slate-600">
            You have placed {orders.length}{" "}
            {orders.length === 1 ? "order" : "orders"}.
          </p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => {
            const orderDate = order.createdAt || order.date;

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sky-200 bg-sky-50 p-5">
                  <div className="min-w-0">
                    <p className="text-sm text-slate-500">Order ID</p>

                    <p className="break-all text-sm font-semibold text-slate-900">
                      {order.id}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      {formatDate(orderDate)}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(
                      order.status,
                    )}`}
                  >
                    {order.status || "Pending"}
                  </span>
                </div>

                <div className="space-y-4 p-5">
                  {(order.items || []).map((item, index) => {
                    const price = Number(item.price || 0);

                    const quantity = Number(item.quantity || 1);

                    const itemTotal = price * quantity;

                    return (
                      <div
                        key={item.orderItemId || `${item.id}-${index}`}
                        className="flex items-center gap-4 border-b border-slate-100 pb-4 last:border-b-0"
                      >
                        {item.id ? (
                          <NavLink
                            to={`/products/${item.id}`}
                            className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100"
                          >
                            <ProductImage
                              src={item.image}
                              alt={item.title || "Product"}
                              className="object-cover"
                            />
                          </NavLink>
                        ) : (
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            <ProductImage
                              src={item.image}
                              alt={item.title || "Product"}
                              className="object-cover"
                            />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          {item.id ? (
                            <NavLink
                              to={`/products/${item.id}`}
                              className="line-clamp-2 font-semibold text-slate-900 transition hover:text-sky-600"
                            >
                              {item.title || "Product"}
                            </NavLink>
                          ) : (
                            <p className="line-clamp-2 font-semibold text-slate-900">
                              {item.title || "Product"}
                            </p>
                          )}

                          <p className="mt-1 text-sm text-slate-500">
                            Quantity: {quantity}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            ${price.toFixed(2)} each
                          </p>
                        </div>

                        <p className="shrink-0 font-bold text-sky-700">
                          ${itemTotal.toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 p-5">
                  <div>
                    <p className="text-sm text-slate-500">Order Total</p>

                    <p className="text-2xl font-extrabold text-sky-700">
                      ${Number(order.total || 0).toFixed(2)}
                    </p>
                  </div>

                  <NavLink
                    to={`/order-confirmation/${order.id}`}
                    className="rounded-lg bg-sky-500 px-5 py-2.5 font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-md active:scale-95"
                  >
                    View Order Details
                  </NavLink>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Orders;
