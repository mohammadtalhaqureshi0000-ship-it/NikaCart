import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { logoutUser as reduxLogoutUser } from "../features/auth/authSlice";

import { logoutUser as supabaseLogoutUser } from "../supabase/authService";

const AdminSidebar = ({ menuOpen, closeMenu }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loggingOut, setLoggingOut] = useState(false);

  const currentUser = useSelector((state) => state.auth.currentUser);

  const menuItems = [
    {
      label: "Dashboard",
      icon: "📊",
      path: "/admin",
      end: true,
    },
    {
      label: "Products",
      icon: "📦",
      path: "/admin/products",
    },
    {
      label: "Orders",
      icon: "🛒",
      path: "/admin/orders",
    },
    {
      label: "Customers",
      icon: "👥",
      path: "/admin/customers",
    },
  ];

  const linkClass = ({ isActive }) =>
    `group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
      isActive
        ? "bg-gradient-to-r from-sky-400 to-cyan-300 text-slate-950 shadow-lg shadow-sky-500/20"
        : "text-slate-300 hover:translate-x-1 hover:bg-slate-800 hover:text-white"
    }`;

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await supabaseLogoutUser();

      dispatch(reduxLogoutUser());

      closeMenu?.();

      toast.success("Logged out successfully!");

      navigate("/welcome", {
        replace: true,
      });
    } catch (error) {
      console.error("Admin logout error:", error);

      toast.error(error.message || "Unable to log out.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      {menuOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeMenu}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        id="admin-sidebar"
        aria-label="Admin navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-700/70 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-slate-800 px-5 py-5">
          <div className="flex items-start justify-between gap-3">
            <NavLink
              to="/admin"
              onClick={closeMenu}
              className="group flex items-center gap-3"
            >
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-400/10 text-2xl shadow-inner shadow-sky-400/10 transition duration-300 group-hover:rotate-12 group-hover:scale-110">
                ☀️
              </span>

              <span className="min-w-0">
                <span className="block text-xl font-black tracking-tight text-white">
                  Nika
                  <span className="text-sky-400">Cart</span>
                </span>

                <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Admin Workspace
                </span>
              </span>
            </NavLink>

            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              className="rounded-lg p-2 text-xl text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-4 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Main Menu
          </p>

          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={closeMenu}
                className={linkClass}
              >
                {({ isActive }) => (
                  <>
                    <span className="text-lg">{item.icon}</span>

                    <span className="flex-1">{item.label}</span>

                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-slate-900" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-sky-400/20 bg-gradient-to-br from-sky-400/10 to-slate-800 p-4">
            <div className="mb-2 text-xl">⚡</div>

            <h3 className="text-sm font-bold text-white">Store Management</h3>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Manage your products, customer accounts, and orders from one
              workspace.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 p-3">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-800/70 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-400 text-base font-black text-slate-950">
              {(currentUser?.name || currentUser?.email || "A")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">
                {currentUser?.name || "Administrator"}
              </p>

              <p className="truncate text-[11px] text-slate-400">
                {currentUser?.email || "Admin Account"}
              </p>
            </div>

            <span title="Administrator" className="text-base text-sky-400">
              🛡️
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-300 transition duration-300 hover:bg-red-400 hover:text-slate-950 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>↪</span>

            {loggingOut ? "Logging out..." : "Logout"}
          </button>

          <p className="mt-3 text-center text-[10px] text-slate-500">
            © NikaCart Admin Panel
          </p>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
