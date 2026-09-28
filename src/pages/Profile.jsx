import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { setCurrentUser, logoutUser } from "../features/auth/authSlice";

import {
  setOrders,
  setOrdersLoading,
  setOrdersError,
} from "../features/Orders/ordersSlice";

import {
  updateUserProfile,
  updateUserPassword,
  verifyCurrentPassword,
  logoutUser as supabaseLogout,
} from "../supabase/authService";

import { getMyOrders } from "../supabase/orderService";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth.currentUser);

  const {
    orders = [],
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.orders);

  const [activeTab, setActiveTab] = useState("overview");

  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setProfileForm({
      name: currentUser?.name || "",
    });
  }, [currentUser?.name]);

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      if (!currentUser || currentUser.role !== "customer") {
        return;
      }

      dispatch(setOrdersLoading(true));

      dispatch(setOrdersError(null));

      try {
        const data = await getMyOrders();

        if (!active) {
          return;
        }

        dispatch(setOrders(data));
      } catch (error) {
        console.error("Unable to load profile orders:", error);

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

  const myOrders = orders.filter(
    (order) => String(order.userId) === String(currentUser?.id),
  );

  const totalSpent = myOrders
    .filter((order) => order.status !== "Cancelled")
    .reduce(
      (total, order) => total + Number(order.total || order.totalAmount || 0),
      0,
    );

  const recentOrders = [...myOrders]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.date || 0) -
        new Date(a.createdAt || a.date || 0),
    )
    .slice(0, 3);

  const handleRetryOrders = async () => {
    if (!currentUser || currentUser.role !== "customer") {
      return;
    }

    dispatch(setOrdersLoading(true));

    dispatch(setOrdersError(null));

    try {
      const data = await getMyOrders();

      dispatch(setOrders(data));

      toast.success("Orders refreshed.");
    } catch (error) {
      dispatch(setOrdersError(error.message || "Unable to load your orders."));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const name = profileForm.name.trim();

    if (name.length < 2) {
      toast.error("Name must contain at least 2 characters.");

      return;
    }

    if (isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const updatedProfile = await updateUserProfile(name);

      dispatch(
        setCurrentUser({
          ...currentUser,
          name: updatedProfile.name,
        }),
      );

      toast.success("Profile updated successfully!");

      setActiveTab("overview");
    } catch (error) {
      toast.error(error.message || "Unable to update your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (isChangingPassword) {
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");

      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must contain at least 8 characters.");

      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");

      return;
    }

    if (currentPassword === newPassword) {
      toast.error(
        "Your new password must be different from the current password.",
      );

      return;
    }

    setIsChangingPassword(true);

    try {
      await verifyCurrentPassword(currentUser.email, currentPassword);

      await updateUserPassword(newPassword);

      toast.success("Password updated successfully!");

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPassword(false);
    } catch (error) {
      toast.error(error.message || "Unable to change your password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await supabaseLogout();

      dispatch(logoutUser());

      dispatch(setOrders([]));

      toast.success("Logged out successfully!");

      navigate("/welcome", {
        replace: true,
      });
    } catch (error) {
      toast.error(error.message || "Unable to log out.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const tabs = [
    {
      id: "overview",
      label: "👤 Overview",
    },
    {
      id: "edit",
      label: "✏️ Edit Profile",
    },
    {
      id: "security",
      label: "🔒 Security",
    },
  ];

  return (
    <main className="min-h-dvh bg-gradient-to-br from-slate-100 via-sky-50 to-slate-200 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <NavLink
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-500"
          >
            ← Back to Home
          </NavLink>

          <h1 className="mt-5 text-3xl font-black text-slate-900 sm:text-4xl">
            My <span className="text-sky-500">Profile</span>
          </h1>

          <p className="mt-2 text-slate-600">
            Manage your NikaCart account and preferences.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <aside className="h-fit overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
            <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-gray-700 p-7 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-sky-400 bg-sky-400/20 text-5xl shadow-lg">
                👤
              </div>

              <h2 className="mt-4 text-xl font-extrabold text-white">
                {currentUser?.name || "NikaCart User"}
              </h2>

              <p className="mt-1 break-all text-sm text-slate-300">
                {currentUser?.email}
              </p>

              <span className="mt-4 inline-flex rounded-full bg-sky-400/20 px-4 py-1 text-xs font-bold uppercase tracking-wider text-sky-300">
                {currentUser?.role || "customer"}
              </span>
            </div>

            <div className="space-y-2 p-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? "bg-sky-500 text-white shadow-md"
                      : "text-slate-600 hover:bg-sky-50 hover:text-sky-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              <NavLink
                to="/orders"
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-sky-50 hover:text-sky-700"
              >
                📦 My Orders
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full rounded-xl bg-red-50 px-4 py-3 text-left text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
              >
                {isLoggingOut ? "Logging out..." : "🚪 Logout"}
              </button>
            </div>
          </aside>

          <section className="min-w-0">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    Welcome back, {currentUser?.name}! ☀️
                  </h2>

                  <p className="mt-2 text-slate-600">
                    Here's an overview of your NikaCart account.
                  </p>

                  <div className="mt-7 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl bg-sky-50 p-5">
                      <div className="text-3xl">📦</div>

                      <p className="mt-3 text-3xl font-black text-slate-900">
                        {ordersLoading ? "..." : myOrders.length}
                      </p>

                      <p className="text-sm font-medium text-slate-600">
                        Total Orders
                      </p>
                    </div>

                    <div className="rounded-2xl bg-emerald-50 p-5">
                      <div className="text-3xl">💰</div>

                      <p className="mt-3 text-3xl font-black text-slate-900">
                        {ordersLoading ? "..." : `$${totalSpent.toFixed(2)}`}
                      </p>

                      <p className="text-sm font-medium text-slate-600">
                        Total Spent
                      </p>
                    </div>

                    <div className="rounded-2xl bg-purple-50 p-5">
                      <div className="text-3xl">
                        {currentUser?.isBlocked ? "⛔" : "✅"}
                      </div>

                      <p
                        className={`mt-3 text-xl font-black ${
                          currentUser?.isBlocked
                            ? "text-red-600"
                            : "text-slate-900"
                        }`}
                      >
                        {currentUser?.isBlocked ? "Blocked" : "Active"}
                      </p>

                      <p className="text-sm font-medium text-slate-600">
                        Account Status
                      </p>
                    </div>
                  </div>

                  {ordersError && (
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                      <p className="text-sm font-semibold text-red-600">
                        {ordersError}
                      </p>

                      <button
                        type="button"
                        onClick={handleRetryOrders}
                        disabled={ordersLoading}
                        className="rounded-lg bg-red-100 px-4 py-2 text-xs font-bold text-red-700 transition hover:bg-red-200 disabled:opacity-50"
                      >
                        Retry
                      </button>
                    </div>
                  )}
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-xl font-extrabold text-slate-900">
                      Personal Information
                    </h2>

                    <button
                      type="button"
                      onClick={() => setActiveTab("edit")}
                      className="rounded-xl bg-sky-100 px-4 py-2 text-sm font-bold text-sky-700 transition hover:bg-sky-200"
                    >
                      Edit Profile
                    </button>
                  </div>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-slate-500">Full Name</p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {currentUser?.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Email Address</p>

                      <p className="mt-1 break-all font-semibold text-slate-900">
                        {currentUser?.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Account Type</p>

                      <p className="mt-1 font-semibold capitalize text-slate-900">
                        {currentUser?.role}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Account Status</p>

                      <p
                        className={`mt-1 font-semibold ${
                          currentUser?.isBlocked
                            ? "text-red-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {currentUser?.isBlocked ? "Blocked" : "Active"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-extrabold text-slate-900">
                      Recent Orders
                    </h2>

                    <NavLink
                      to="/orders"
                      className="text-sm font-bold text-sky-600 hover:text-sky-500"
                    >
                      View All →
                    </NavLink>
                  </div>

                  {ordersLoading ? (
                    <div className="py-12 text-center">
                      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-sky-100 border-t-sky-500" />

                      <p className="mt-4 text-sm font-semibold text-slate-600">
                        Loading orders...
                      </p>
                    </div>
                  ) : ordersError ? (
                    <div className="py-12 text-center">
                      <div className="text-4xl">⚠️</div>

                      <p className="mt-4 text-sm font-semibold text-red-600">
                        Unable to load recent orders.
                      </p>

                      <button
                        type="button"
                        onClick={handleRetryOrders}
                        className="mt-4 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-600"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : recentOrders.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="text-5xl">🛍️</div>

                      <p className="mt-4 font-semibold text-slate-700">
                        No orders yet
                      </p>

                      <NavLink
                        to="/products"
                        className="mt-4 inline-flex rounded-xl bg-sky-500 px-5 py-3 font-bold text-white transition hover:bg-sky-400"
                      >
                        Start Shopping
                      </NavLink>
                    </div>
                  ) : (
                    <div className="mt-5 space-y-3">
                      {recentOrders.map((order) => (
                        <NavLink
                          key={order.id}
                          to={`/order-confirmation/${order.id}`}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-sky-300 hover:bg-sky-50"
                        >
                          <div>
                            <p className="font-bold text-slate-900">
                              Order #{String(order.id).slice(0, 8)}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {order.status || "Pending"}
                            </p>
                          </div>

                          <p className="font-extrabold text-sky-600">
                            $
                            {Number(
                              order.total || order.totalAmount || 0,
                            ).toFixed(2)}
                          </p>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "edit" && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Edit Profile
                </h2>

                <p className="mt-2 text-slate-600">
                  Update your personal information.
                </p>

                <form onSubmit={handleProfileUpdate} className="mt-7 space-y-5">
                  <div>
                    <label
                      htmlFor="profile-name"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Full Name
                    </label>

                    <input
                      id="profile-name"
                      type="text"
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({
                          name: e.target.value,
                        })
                      }
                      required
                      minLength={2}
                      disabled={isSaving}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profile-email"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Email Address
                    </label>

                    <input
                      id="profile-email"
                      type="email"
                      value={currentUser?.email || ""}
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500"
                    />

                    <p className="mt-2 text-xs text-slate-500">
                      Email changes will be available after we implement
                      Supabase email verification.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-3">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="rounded-xl bg-sky-500 px-6 py-3 font-bold text-white transition hover:bg-sky-400 disabled:opacity-60"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("overview")}
                      className="rounded-xl bg-slate-100 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "security" && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Account Security
                </h2>

                <p className="mt-2 text-slate-600">
                  Change your NikaCart account password.
                </p>

                <form
                  onSubmit={handlePasswordChange}
                  className="mt-7 space-y-5"
                >
                  {[
                    {
                      name: "currentPassword",
                      label: "Current Password",
                      placeholder: "Enter current password",
                    },
                    {
                      name: "newPassword",
                      label: "New Password",
                      placeholder: "At least 8 characters",
                    },
                    {
                      name: "confirmPassword",
                      label: "Confirm New Password",
                      placeholder: "Confirm new password",
                    },
                  ].map((field) => (
                    <div key={field.name}>
                      <label
                        htmlFor={field.name}
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        {field.label}
                      </label>

                      <input
                        id={field.name}
                        type={showPassword ? "text" : "password"}
                        value={passwordForm[field.name]}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            [field.name]: e.target.value,
                          }))
                        }
                        placeholder={field.placeholder}
                        autoComplete={
                          field.name === "currentPassword"
                            ? "current-password"
                            : "new-password"
                        }
                        required
                        disabled={isChangingPassword}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                      />
                    </div>
                  ))}

                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                      className="accent-sky-500"
                    />
                    Show passwords
                  </label>

                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="rounded-xl bg-sky-500 px-6 py-3 font-bold text-white transition hover:bg-sky-400 disabled:opacity-60"
                  >
                    {isChangingPassword
                      ? "Updating Password..."
                      : "Change Password"}
                  </button>
                </form>

                <div className="mt-8 rounded-2xl border border-sky-200 bg-sky-50 p-4">
                  <p className="text-sm font-semibold text-sky-900">
                    🔐 Your password is managed by Supabase Authentication.
                  </p>

                  <p className="mt-2 text-sm text-sky-700">
                    Your password is no longer stored in the NikaCart Redux
                    state or LocalStorage authentication records.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Profile;
