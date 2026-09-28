import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { NavLink, useParams } from "react-router-dom";

import { getOrderById } from "../supabase/orderService";

import ProductImage from "../componants/ProductImage";

const OrderConfirmation = () => {
  const { id } = useParams();

  const currentUser = useSelector((state) => state.auth.currentUser);

  const reduxOrder = useSelector((state) =>
    state.orders.orders.find((item) => String(item.id) === String(id)),
  );

  const [order, setOrder] = useState(reduxOrder || null);

  const [loading, setLoading] = useState(!reduxOrder);

  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const loadOrder = async () => {
      if (!id) {
        if (active) {
          setOrder(null);
          setError("Invalid order ID.");
          setLoading(false);
        }

        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getOrderById(id);

        if (!active) {
          return;
        }

        if (data.userId !== currentUser?.id) {
          setOrder(null);

          setError(
            "This order could not be found or does not belong to your account.",
          );

          return;
        }

        setOrder(data);
      } catch (error) {
        console.error("Unable to load order:", error);

        if (!active) {
          return;
        }

        setOrder(null);

        setError(
          "This order could not be found or does not belong to your account.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      active = false;
    };
  }, [id, currentUser?.id]);

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

  const formatDate = (value) => {
    if (!value) {
      return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-200 via-sky-100 to-gray-300 px-4">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-sky-200 border-t-sky-500" />

          <p className="mt-5 font-semibold text-slate-700">
            Loading order details...
          </p>
        </div>
      </main>
    );
  }

  if (!order || error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-200 via-sky-100 to-gray-300 px-4">
        <div className="w-full max-w-md rounded-2xl border border-sky-200 bg-white p-8 text-center shadow-lg">
          <div className="mb-4 text-5xl">📦</div>

          <h1 className="mb-4 text-2xl font-bold text-slate-900">
            Order Not Found
          </h1>

          <p className="mb-6 text-slate-600">
            {error ||
              "This order could not be found or does not belong to your account."}
          </p>

          <div className="flex flex-col gap-3">
            <NavLink
              to="/orders"
              className="rounded-lg bg-sky-500 px-6 py-3 font-semibold text-white transition hover:bg-sky-600"
            >
              View My Orders
            </NavLink>

            <NavLink
              to="/products"
              className="rounded-lg border border-sky-300 px-6 py-3 font-semibold text-sky-700 transition hover:bg-sky-50"
            >
              Continue Shopping
            </NavLink>
          </div>
        </div>
      </main>
    );
  }

  const orderDate = order.createdAt || order.date;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-200 via-sky-100 to-gray-300 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <NavLink
          to="/orders"
          className="mb-8 inline-flex items-center gap-2 rounded-lg border border-sky-300 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 shadow-sm transition duration-300 hover:-translate-x-1 hover:bg-sky-100"
        >
          ← Back to Orders
        </NavLink>

        <div className="rounded-2xl border border-sky-200 bg-white p-6 shadow-lg sm:p-10">
          <div className="mb-8 text-center">
            <div className="mb-4 text-6xl">🎉</div>

            <h1 className="mb-3 text-3xl font-extrabold text-slate-900">
              Order Details
            </h1>

            <p className="text-slate-600">
              Thank you,{" "}
              {order.customer?.fullName || currentUser?.name || "Customer"}!
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Your order has been received.
            </p>
          </div>

          <div className="mb-8 rounded-xl border border-sky-200 bg-sky-50 p-5">
            <p className="mb-2 text-sm text-slate-600">Order ID</p>

            <p className="break-all font-semibold text-slate-900">{order.id}</p>

            <p className="mt-4 text-sm text-slate-600">Order Date</p>

            <p className="mt-1 font-semibold text-slate-900">
              {formatDate(orderDate)}
            </p>

            <p className="mt-4 text-sm text-slate-600">Order Status</p>

            <span
              className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-semibold ${getStatusClass(
                order.status,
              )}`}
            >
              {order.status || "Pending"}
            </span>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              Shipping Information
            </h2>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="space-y-2 text-sm">
                <p className="text-slate-700">
                  <span className="font-semibold text-slate-900">Name: </span>

                  {order.customer?.fullName || "—"}
                </p>

                <p className="break-words text-slate-700">
                  <span className="font-semibold text-slate-900">Email: </span>

                  {order.customer?.email || "—"}
                </p>

                <p className="text-slate-700">
                  <span className="font-semibold text-slate-900">Phone: </span>

                  {order.customer?.phone || "—"}
                </p>

                <p className="text-slate-700">
                  <span className="font-semibold text-slate-900">
                    Address:{" "}
                  </span>

                  {order.customer?.address || "—"}
                </p>

                <p className="text-slate-700">
                  <span className="font-semibold text-slate-900">City: </span>

                  {order.customer?.city || "—"}
                </p>

                <p className="text-slate-700">
                  <span className="font-semibold text-slate-900">
                    Postal Code:{" "}
                  </span>

                  {order.customer?.postalCode || "—"}
                </p>
              </div>
            </div>
          </div>

          <h2 className="mb-5 text-xl font-bold text-slate-900">
            Order Summary
          </h2>

          <div className="space-y-4">
            {(order.items || []).map((item, index) => {
              const price = Number(item.price || 0);

              const quantity = Number(item.quantity || 1);

              const itemTotal = price * quantity;

              return (
                <div
                  key={item.orderItemId || `${item.id}-${index}`}
                  className="flex items-center gap-4 border-b border-slate-100 pb-4"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <ProductImage
                      src={item.image}
                      alt={item.title || "Product"}
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 font-semibold text-slate-900">
                      {item.title || "Product"}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Quantity: {quantity}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      ${price.toFixed(2)} each
                    </p>
                  </div>

                  <span className="shrink-0 font-semibold text-slate-900">
                    ${itemTotal.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>

              <span>${Number(order.subtotal || 0).toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>

              <span>
                {Number(order.shipping || 0) === 0
                  ? "Free"
                  : `$${Number(order.shipping).toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Payment</span>

              <span className="font-semibold text-slate-900">
                {order.paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : order.paymentMethod || "—"}
              </span>
            </div>

            <div className="flex justify-between border-t border-slate-200 pt-4 text-xl font-extrabold text-slate-900">
              <span>Total</span>

              <span>${Number(order.total || 0).toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <NavLink
              to="/orders"
              className="rounded-lg border border-sky-300 px-6 py-3 text-center font-semibold text-sky-700 transition hover:bg-sky-50"
            >
              View My Orders
            </NavLink>

            <NavLink
              to="/products"
              className="rounded-lg bg-sky-500 px-6 py-3 text-center font-semibold text-white transition hover:bg-sky-600 active:scale-95"
            >
              Continue Shopping
            </NavLink>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderConfirmation;
