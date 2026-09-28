import React, { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import toast from "react-hot-toast";

import {
  setOrders,
  updateOrderStatus,
  setOrdersLoading,
  setOrdersError,
} from "../features/Orders/ordersSlice";

import {
  getAdminOrders,
  updateAdminOrderStatus,
} from "../supabase/orderService";

const STATUS_OPTIONS = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const statusStyles = {
  Pending: "bg-amber-100 text-amber-700",

  Processing: "bg-sky-100 text-sky-700",

  Shipped: "bg-violet-100 text-violet-700",

  Delivered: "bg-emerald-100 text-emerald-700",

  Cancelled: "bg-red-100 text-red-700",
};

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
};

const AdminOrders = () => {
  const dispatch = useDispatch();

  const { orders = [], loading, error } = useSelector((state) => state.orders);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const loadOrders = async () => {
    dispatch(setOrdersLoading(true));
    dispatch(setOrdersError(null));

    try {
      const data = await getAdminOrders();

      dispatch(setOrders(data));
    } catch (error) {
      console.error("Unable to load admin orders:", error);

      dispatch(setOrdersError(error.message || "Unable to load orders."));
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const selectedOrder = orders.find(
    (order) => String(order.id) === String(selectedOrderId),
  );

  const getCustomerName = (order) =>
    order.customer?.fullName || order.customer?.name || "Customer";

  const getCustomerEmail = (order) => order.customer?.email || "—";

  const filteredOrders = useMemo(() => {
    return [...orders]
      .filter((order) => {
        const query = search.trim().toLowerCase();

        const matchesSearch =
          String(order.id).toLowerCase().includes(query) ||
          getCustomerName(order).toLowerCase().includes(query) ||
          getCustomerEmail(order).toLowerCase().includes(query);

        const matchesStatus =
          statusFilter === "all" ||
          (order.status || "Pending") === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.date || 0) -
          new Date(a.createdAt || a.date || 0),
      );
  }, [orders, search, statusFilter]);

  const pendingOrders = orders.filter(
    (order) => !order.status || order.status === "Pending",
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered",
  ).length;

  const totalOrderValue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((total, order) => total + Number(order.total || 0), 0);

  const handleStatusChange = async (order, nextStatus) => {
    const currentStatus = order.status || "Pending";

    if (currentStatus === nextStatus) {
      return;
    }

    if (
      nextStatus === "Cancelled" &&
      !window.confirm(`Cancel order ${order.id}?`)
    ) {
      return;
    }

    setUpdatingOrderId(order.id);

    try {
      const updatedOrder = await updateAdminOrderStatus(order.id, nextStatus);

      dispatch(
        updateOrderStatus({
          orderId: updatedOrder.id,
          status: updatedOrder.status,
        }),
      );

      toast.success(`Order status updated to ${nextStatus}.`);
    } catch (error) {
      console.error("Unable to update order:", error);

      toast.error(error.message || "Unable to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: "🛒",
      gradient: "from-sky-500 to-cyan-500",
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      icon: "⏳",
      gradient: "from-amber-400 to-orange-500",
    },
    {
      label: "Delivered",
      value: deliveredOrders,
      icon: "✅",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      label: "Order Value",
      value: formatMoney(totalOrderValue),
      icon: "💰",
      gradient: "from-indigo-500 to-violet-500",
    },
  ];

  return (
    <div className="w-full min-w-0 space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-sky-400/20 blur-3xl" />

        <div className="relative">
          <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-bold text-sky-300">
            NIKACART ADMIN
          </span>

          <h2 className="mt-4 text-2xl font-black sm:text-3xl">
            Order Management 🛒
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
            Review customer purchases, track orders, and manage delivery
            statuses from one workspace.
          </p>

          <button
            type="button"
            onClick={loadOrders}
            disabled={loading}
            className="mt-5 rounded-xl border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm font-bold text-sky-200 transition hover:bg-sky-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Loading..." : "↻ Refresh Orders"}
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="min-w-0 rounded-2xl border border-sky-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.gradient} text-2xl shadow-md`}
            >
              {stat.icon}
            </div>

            <p className="mt-5 text-sm font-semibold text-slate-500">
              {stat.label}
            </p>

            <p className="mt-2 break-words text-2xl font-black text-slate-900 sm:text-3xl">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <section className="min-w-0 overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900">All Orders</h3>

              <p className="mt-1 text-xs text-slate-500">
                {filteredOrders.length} matching orders
              </p>
            </div>

            <span className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700">
              📋 Order Records
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_200px]">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search order ID, name, or email..."
              className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-400"
            >
              <option value="all">All Statuses</option>

              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="px-4 py-16 text-center">
            <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-sky-100 border-t-sky-500" />

            <p className="mt-4 font-semibold text-slate-600">
              Loading orders...
            </p>
          </div>
        ) : error ? (
          <div className="px-4 py-16 text-center">
            <p className="text-4xl">⚠️</p>

            <p className="mt-4 font-bold text-red-600">{error}</p>

            <button
              type="button"
              onClick={loadOrders}
              className="mt-5 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-600"
            >
              Try Again
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <p className="text-5xl">📭</p>

            <p className="mt-3 font-semibold text-slate-600">
              No matching orders found.
            </p>
          </div>
        ) : (
          <div className="w-full min-w-0 overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Order ID</th>

                  <th className="px-5 py-4">Customer</th>

                  <th className="px-5 py-4">Date</th>

                  <th className="px-5 py-4">Total</th>

                  <th className="px-5 py-4">Status</th>

                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-slate-100 transition hover:bg-sky-50/50"
                  >
                    <td className="max-w-[170px] break-all px-5 py-4 font-bold text-slate-900">
                      {order.id}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {getCustomerName(order)}
                      </p>

                      <p className="mt-1 max-w-[180px] truncate text-xs text-slate-500">
                        {getCustomerEmail(order)}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {formatDate(order.createdAt || order.date)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 font-black text-slate-900">
                      {formatMoney(order.total)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          statusStyles[order.status || "Pending"] ||
                          statusStyles.Pending
                        }`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedOrderId(order.id)}
                        className="rounded-lg bg-sky-50 px-4 py-2 text-xs font-bold text-sky-700 transition hover:bg-sky-100"
                      >
                        View Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedOrder && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-5"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedOrderId(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-details-title"
            className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest text-sky-600">
                  Order Details
                </p>

                <h3
                  id="order-details-title"
                  className="mt-1 break-all text-xl font-black text-slate-900"
                >
                  #{selectedOrder.id}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrderId(null)}
                aria-label="Close order details"
                className="rounded-lg p-2 text-xl text-slate-500 transition hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="min-h-0 space-y-6 overflow-y-auto p-5 sm:p-6">
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Customer
                  </p>

                  <p className="mt-2 font-bold text-slate-900">
                    {getCustomerName(selectedOrder)}
                  </p>

                  <p className="mt-1 break-all text-sm text-slate-600">
                    {getCustomerEmail(selectedOrder)}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {selectedOrder.customer?.phone || "No phone provided"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Order Information
                  </p>

                  <p className="mt-2 text-sm text-slate-700">
                    Date:{" "}
                    <strong>
                      {formatDate(
                        selectedOrder.createdAt || selectedOrder.date,
                      )}
                    </strong>
                  </p>

                  <p className="mt-2 text-sm text-slate-700">
                    Payment:{" "}
                    <strong>
                      {selectedOrder.paymentMethod || "Cash on Delivery"}
                    </strong>
                  </p>
                </div>
              </section>

              <section>
                <h4 className="mb-3 font-black text-slate-900">
                  📍 Shipping Address
                </h4>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  {selectedOrder.customer?.address ? (
                    <>
                      <p>{selectedOrder.customer.address}</p>

                      <p>
                        {[
                          selectedOrder.customer.city,

                          selectedOrder.customer.state,

                          selectedOrder.customer.postalCode,

                          selectedOrder.customer.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </>
                  ) : (
                    <p>No shipping address available.</p>
                  )}
                </div>
              </section>

              <section>
                <h4 className="mb-3 font-black text-slate-900">
                  📦 Purchased Products
                </h4>

                <div className="space-y-3">
                  {(selectedOrder.items || []).map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-sky-50">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title || "Product"}
                            className="h-full w-full object-contain p-1"
                          />
                        ) : (
                          <span className="text-2xl">📦</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900">
                          {item.title || item.name || "Product"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Quantity: {item.quantity || 1}
                        </p>
                      </div>

                      <p className="font-black text-slate-900">
                        {formatMoney(
                          Number(item.price || 0) * Number(item.quantity || 1),
                        )}
                      </p>
                    </div>
                  ))}

                  {(!selectedOrder.items ||
                    selectedOrder.items.length === 0) && (
                    <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                      No item details available.
                    </p>
                  )}
                </div>
              </section>

              <section className="rounded-xl bg-sky-50 p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-3 text-slate-600">
                    <span>Subtotal</span>

                    <span>{formatMoney(selectedOrder.subtotal)}</span>
                  </div>

                  <div className="flex justify-between gap-3 text-slate-600">
                    <span>Shipping</span>

                    <span>{formatMoney(selectedOrder.shipping)}</span>
                  </div>

                  <div className="flex justify-between gap-3 border-t border-sky-200 pt-3 text-lg font-black text-slate-900">
                    <span>Total</span>

                    <span>{formatMoney(selectedOrder.total)}</span>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-sky-200 p-4">
                <label
                  htmlFor="admin-order-status"
                  className="mb-2 block text-sm font-black text-slate-900"
                >
                  Update Order Status
                </label>

                <select
                  id="admin-order-status"
                  value={selectedOrder.status || "Pending"}
                  disabled={updatingOrderId === selectedOrder.id}
                  onChange={(event) =>
                    handleStatusChange(selectedOrder, event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs text-slate-500">
                  {updatingOrderId === selectedOrder.id
                    ? "Saving status to Supabase..."
                    : "Order status changes are saved to Supabase."}
                </p>
              </section>
            </div>

            <div className="border-t border-slate-100 p-4 sm:px-6">
              <button
                type="button"
                onClick={() => setSelectedOrderId(null)}
                className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-500 hover:text-slate-950"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
