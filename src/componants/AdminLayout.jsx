import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const currentUser = useSelector((state) => state.auth.currentUser);

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-100 via-sky-50 to-slate-200">
      <AdminSidebar menuOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />

      <div className="min-w-0 lg:ml-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b border-sky-100 bg-white/90 px-4 shadow-sm backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open admin menu"
              aria-controls="admin-sidebar"
              aria-expanded={menuOpen}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-200 bg-sky-50 text-xl text-slate-800 transition hover:bg-sky-100 lg:hidden"
            >
              ☰
            </button>

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-sky-600">
                NikaCart
              </p>

              <h1 className="truncate text-lg font-black text-slate-900 sm:text-xl">
                Admin Workspace
              </h1>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-3">
            <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 sm:inline-flex">
              ● Admin
            </span>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 font-black text-sky-300">
              {(currentUser?.name || currentUser?.email || "A")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="hidden min-w-0 md:block">
              <p className="max-w-40 truncate text-sm font-bold text-slate-900">
                {currentUser?.name || "Administrator"}
              </p>

              <p className="max-w-40 truncate text-xs text-slate-500">
                {currentUser?.email || "Admin Account"}
              </p>
            </div>
          </div>
        </header>

        <main className="min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full min-w-0 max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
