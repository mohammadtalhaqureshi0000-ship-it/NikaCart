
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  listCustomers,
  setCustomerBlocked,
} from "../supabase/adminCustomersService";

const formatMoney = (value) =>
  `$${Number(value || 0).toFixed(2)}`;

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString();
};

const statusStyles = {
  Pending: "bg-amber-100 text-amber-700",
  Processing: "bg-sky-100 text-sky-700",
  Shipped: "bg-violet-100 text-violet-700",
  Delivered: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
};

const AdminCustomers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedCustomerId, setSelectedCustomerId] =
    useState(null);

  const orders = useSelector(
    (state) => state.orders.orders || []
  );

  useEffect(() => {
    let active = true;

    const loadCustomers = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const data = await listCustomers();

        if (active) {
          setUsers(data);
        }
      } catch (error) {
        if (active) {
          setLoadError(
            error.message || "Unable to load customers."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadCustomers();

    return () => {
      active = false;
    };
  }, []);

  const refreshCustomers = async () => {
    setLoading(true);
    setLoadError("");

    try {
      const data = await listCustomers();
      setUsers(data);
    } catch (error) {
      setLoadError(
        error.message || "Unable to refresh customers."
      );
    } finally {
      setLoading(false);
    }
  };

  const customers = useMemo(
    () => users.filter((user) => user.role === "customer"),
    [users]
  );

  const customerOrdersMap = useMemo(() => {
    const map = new Map();

    orders.forEach((order) => {
      const userId = String(order.userId);

      if (!map.has(userId)) {
        map.set(userId, []);
      }

      map.get(userId).push(order);
    });

    return map;
  }, [orders]);

  const getCustomerOrders = (customerId) =>
    customerOrdersMap.get(String(customerId)) || [];

  const getCustomerSpending = (customerId) =>
    getCustomerOrders(customerId)
      .filter((order) => order.status !== "Cancelled")
      .reduce(
        (total, order) =>
          total + Number(order.total || 0),
        0
      );

  const filteredCustomers = customers.filter((customer) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      String(customer.id).toLowerCase().includes(query) ||
      String(customer.name || "")
        .toLowerCase()
        .includes(query) ||
      String(customer.email || "")
        .toLowerCase()
        .includes(query);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !customer.isBlocked) ||
      (statusFilter === "blocked" && customer.isBlocked);

    return matchesSearch && matchesStatus;
  });

  const selectedCustomer = customers.find(
    (customer) =>
      String(customer.id) === String(selectedCustomerId)
  );

  const selectedCustomerOrders = selectedCustomer
    ? getCustomerOrders(selectedCustomer.id)
    : [];

  const totalOrderValue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce(
      (total, order) =>
        total + Number(order.total || 0),
      0
    );

  const activeCustomers = customers.filter(
    (customer) => !customer.isBlocked
  ).length;

  const blockedCustomers = customers.filter(
    (customer) => customer.isBlocked
  ).length;

  const customersWithOrders = customers.filter(
    (customer) =>
      getCustomerOrders(customer.id).length > 0
  ).length;

  const handleCustomerStatus = async (customer) => {
    if (customer.role === "admin" || updatingId) return;

    const nextBlocked = !customer.isBlocked;

    const confirmed = window.confirm(
      `${nextBlocked ? "Block" : "Unblock"} ${
        customer.name || customer.email
      }?`
    );

    if (!confirmed) return;

    setUpdatingId(customer.id);

    try {
      const updated = await setCustomerBlocked(
        customer.id,
        nextBlocked
      );

      setUsers((previous) =>
        previous.map((item) =>
          item.id === updated.id ? updated : item
        )
      );

      toast.success(
        nextBlocked
          ? "Customer blocked successfully."
          : "Customer unblocked successfully."
      );
    } catch (error) {
      toast.error(
        error.message || "Unable to update customer."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = [
    {
      title: "Total Customers",
      value: customers.length,
      icon: "👥",
      color: "from-sky-500 to-cyan-500",
    },
    {
      title: "Active Customers",
      value: activeCustomers,
      icon: "✅",
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "Blocked Customers",
      value: blockedCustomers,
      icon: "🚫",
      color: "from-rose-500 to-red-500",
    },
    {
      title: "Customers With Orders",
      value: customersWithOrders,
      icon: "🛍️",
      color: "from-violet-500 to-indigo-500",
    },
  ];

  return (
    <div className="w-full min-w-0 space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full bg-sky-400/20 blur-3xl" />

        <div className="relative">
          <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-bold text-sky-300">
            NIKACART ADMIN
          </span>

          <h1 className="mt-4 text-2xl font-black sm:text-3xl">
            Customer Management 👥
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
            Explore registered customers, review purchases,
            and manage customer account access.
          </p>

          <div className="mt-5 inline-flex rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-slate-200">
            📦 Total Order Value: {formatMoney(totalOrderValue)}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} text-2xl shadow-md`}
            >
              {stat.icon}
            </div>

            <p className="mt-5 text-sm font-semibold text-slate-500">
              {stat.title}
            </p>

            <p className="mt-2 text-3xl font-black text-slate-900">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <section className="min-w-0 overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Registered Customers
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {filteredCustomers.length} customers found
              </p>
            </div>

            <button
              type="button"
              onClick={refreshCustomers}
              disabled={loading}
              className="rounded-xl bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 transition hover:bg-sky-100 disabled:opacity-50"
            >
              {loading ? "Loading..." : "↻ Refresh"}
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by name, email, or customer ID..."
              className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-400"
            >
              <option value="all">All Customers</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="px-4 py-16 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-sky-100 border-t-sky-500" />

            <p className="mt-4 font-semibold text-slate-600">
              Loading customers...
            </p>
          </div>
        ) : loadError ? (
          <div className="px-4 py-12 text-center">
            <p className="font-semibold text-red-600">
              {loadError}
            </p>

            <button
              type="button"
              onClick={refreshCustomers}
              className="mt-4 rounded-xl bg-sky-500 px-5 py-2 font-bold text-white"
            >
              Try Again
            </button>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <p className="text-5xl">🔎</p>

            <p className="mt-3 font-semibold text-slate-600">
              No customers found.
            </p>
          </div>
        ) : (
          <div className="w-full min-w-0 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Customer ID</th>
                  <th className="px-5 py-4">Orders</th>
                  <th className="px-5 py-4">Total Spending</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((customer) => {
                  const customerOrders =
                    getCustomerOrders(customer.id);

                  return (
                    <tr
                      key={customer.id}
                      className="border-t border-slate-100 transition hover:bg-sky-50/50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-lg font-black text-white">
                            {(customer.name ||
                              customer.email ||
                              "C")[0].toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="font-bold text-slate-900">
                              {customer.name || "Customer"}
                            </p>

                            <p className="mt-1 max-w-[200px] truncate text-xs text-slate-500">
                              {customer.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="max-w-[160px] break-all px-5 py-4 text-xs text-slate-500">
                        {customer.id}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                          {customerOrders.length} orders
                        </span>
                      </td>

                      <td className="px-5 py-4 font-black text-slate-900">
                        {formatMoney(
                          getCustomerSpending(customer.id)
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            customer.isBlocked
                              ? "bg-red-100 text-red-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {customer.isBlocked
                            ? "🚫 Blocked"
                            : "● Active"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedCustomerId(customer.id)
                          }
                          className="rounded-lg bg-sky-50 px-4 py-2 text-xs font-bold text-sky-700 transition hover:bg-sky-100"
                        >
                          View Details →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedCustomer && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedCustomerId(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-details-title"
            className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest text-sky-600">
                  Customer Profile
                </p>

                <h3
                  id="customer-details-title"
                  className="mt-1 break-words text-xl font-black text-slate-900"
                >
                  {selectedCustomer.name || "Customer"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedCustomerId(null)
                }
                aria-label="Close customer details"
                className="rounded-lg p-2 text-xl text-slate-500 transition hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="min-h-0 space-y-6 overflow-y-auto p-5 sm:p-6">
              <section className="rounded-xl bg-slate-50 p-4">
                <h4 className="font-black text-slate-900">
                  👤 Account Information
                </h4>

                <div className="mt-4 space-y-3 text-sm">
                  <p className="break-all text-slate-600">
                    <strong className="text-slate-900">
                      ID:
                    </strong>{" "}
                    {selectedCustomer.id}
                  </p>

                  <p className="break-all text-slate-600">
                    <strong className="text-slate-900">
                      Email:
                    </strong>{" "}
                    {selectedCustomer.email || "—"}
                  </p>

                  <p className="text-slate-600">
                    <strong className="text-slate-900">
                      Role:
                    </strong>{" "}
                    {selectedCustomer.role || "customer"}
                  </p>

                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900">
                      Status:
                    </strong>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        selectedCustomer.isBlocked
                          ? "bg-red-100 text-red-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {selectedCustomer.isBlocked
                        ? "Blocked"
                        : "Active"}
                    </span>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-sky-50 p-4">
                  <p className="text-xs font-bold text-sky-700">
                    Total Orders
                  </p>

                  <p className="mt-2 text-2xl font-black text-slate-900">
                    {selectedCustomerOrders.length}
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-xs font-bold text-emerald-700">
                    Total Spending
                  </p>

                  <p className="mt-2 break-words text-xl font-black text-slate-900 sm:text-2xl">
                    {formatMoney(
                      getCustomerSpending(selectedCustomer.id)
                    )}
                  </p>
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-black text-slate-900">
                      🔐 Account Access
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {selectedCustomer.isBlocked
                        ? "This customer is blocked from NikaCart access after the app checks their profile."
                        : "This customer currently has access to their account."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleCustomerStatus(selectedCustomer)
                    }
                    disabled={Boolean(updatingId)}
                    className={`rounded-xl px-5 py-3 text-sm font-bold transition disabled:opacity-50 ${
                      selectedCustomer.isBlocked
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-red-50 text-red-700 hover:bg-red-100"
                    }`}
                  >
                    {updatingId === selectedCustomer.id
                      ? "Saving..."
                      : selectedCustomer.isBlocked
                        ? "✓ Unblock Customer"
                        : "🚫 Block Customer"}
                  </button>
                </div>
              </section>

              <section>
                <h4 className="mb-3 font-black text-slate-900">
                  🛒 Order History
                </h4>

                {selectedCustomerOrders.length === 0 ? (
                  <div className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                    This customer has not placed any orders.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedCustomerOrders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-xl border border-slate-100 p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="break-all text-sm font-bold text-slate-900">
                              Order #{order.id}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {formatDate(
                                order.date || order.createdAt
                              )}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              statusStyles[
                                order.status || "Pending"
                              ] || statusStyles.Pending
                            }`}
                          >
                            {order.status || "Pending"}
                          </span>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                          <span className="text-xs text-slate-500">
                            Order Total
                          </span>

                          <span className="font-black text-slate-900">
                            {formatMoney(order.total)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <div className="border-t border-slate-100 p-4 sm:px-6">
              <button
                type="button"
                onClick={() =>
                  setSelectedCustomerId(null)
                }
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

export default AdminCustomers;