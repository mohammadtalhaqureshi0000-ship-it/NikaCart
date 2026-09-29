import React, { useEffect, useRef, useState } from "react";

import { NavLink, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import toast from "react-hot-toast";

import { logoutUser as reduxLogoutUser } from "../features/auth/authSlice";

import { logoutUser as supabaseLogoutUser } from "../supabase/authService";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const [showNavbar, setShowNavbar] = useState(true);

  const [loggingOut, setLoggingOut] = useState(false);

  const lastScrollY = useRef(0);
  const navbarRef = useRef(null);

  const currentUser = useSelector((state) => state.auth.currentUser);

  const cartItems = useSelector((state) => state.cart.cartItems || []);

  const wishlistItems = useSelector(
    (state) => state.wishlist.wishlistItems || [],
  );

  // =========================
  // COUNTS
  // =========================

  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 1),
    0,
  );

  const wishlistCount = wishlistItems.length;

  // =========================
  // USER INFORMATION
  // =========================

  const userName =
    currentUser?.name?.trim() ||
    currentUser?.email?.split("@")[0]?.trim() ||
    "User";

  const userInitial = userName.charAt(0).toUpperCase();

  // =========================
  // NAVBAR SCROLL
  // =========================

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      const scrollDifference = currentScrollY - lastScrollY.current;

      if (currentScrollY < 80) {
        setShowNavbar(true);
      } else if (scrollDifference > 3) {
        setShowNavbar(false);
        setMenuOpen(false);
      } else if (scrollDifference < -3) {
        setShowNavbar(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // =========================
  // CLICK OUTSIDE
  // =========================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // =========================
  // ESC KEY
  // =========================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // =========================
  // CLOSE MOBILE MENU
  // =========================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await supabaseLogoutUser();

      dispatch(reduxLogoutUser());

      setMenuOpen(false);

      toast.success("Logged out successfully!");

      navigate("/welcome", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout error:", error);

      toast.error(error.message || "Unable to log out.");
    } finally {
      setLoggingOut(false);
    }
  };

  // =========================
  // DESKTOP LINK STYLE
  // =========================

  const desktopLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition duration-300 ${
      isActive
        ? "bg-sky-400 text-slate-950 shadow-sm"
        : "text-slate-800 hover:bg-sky-200"
    }`;

  // =========================
  // MOBILE LINK STYLE
  // =========================

  const mobileLinkClass = ({ isActive }) =>
    `flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition duration-200 ${
      isActive
        ? "bg-sky-400 text-slate-950 shadow-sm"
        : "text-slate-700 hover:bg-sky-100"
    }`;

  return (
    <nav
      ref={navbarRef}
      className={`sticky top-0 z-50 w-full border-b border-sky-200 bg-gradient-to-r from-slate-200 via-sky-100 to-gray-300 shadow-md transition-transform duration-300 ease-in-out ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* =========================
            MAIN NAVBAR
        ========================= */}

        <div className="flex h-16 items-center justify-between gap-3">
          {/* LOGO */}

          <NavLink
            to="/"
            onClick={closeMenu}
            className="group flex shrink-0 items-center text-2xl font-extrabold text-slate-900 sm:text-3xl"
          >
            <span className="mr-1 inline-block origin-bottom transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125">
              ☀️
            </span>
            Nika
            <span className="text-sky-600">Cart</span>
          </NavLink>

          {/* =========================
              DESKTOP NAVIGATION
          ========================= */}

          <div className="hidden items-center gap-1 lg:flex">
            <NavLink to="/" end className={desktopLinkClass}>
              Home
            </NavLink>

            <NavLink to="/products" className={desktopLinkClass}>
              Products
            </NavLink>

            <NavLink to="/wishlist" className={desktopLinkClass}>
              Wishlist ❤️
              {wishlistCount > 0 && (
                <span className="ml-1 rounded-full bg-sky-400 px-1.5 py-0.5 text-xs font-bold text-slate-950">
                  {wishlistCount}
                </span>
              )}
            </NavLink>

            <NavLink to="/cart" className={desktopLinkClass}>
              Cart 🛒
              {cartCount > 0 && (
                <span className="ml-1 rounded-full bg-sky-400 px-1.5 py-0.5 text-xs font-bold text-slate-950">
                  {cartCount}
                </span>
              )}
            </NavLink>

            <NavLink to="/orders" className={desktopLinkClass}>
              Orders
            </NavLink>

            {/* USER */}

            {currentUser && (
              <>
                <NavLink to="/profile" className={desktopLinkClass}>
                  👤 Profile
                </NavLink>

                <NavLink
                  to="/profile"
                  title="View your profile"
                  className="ml-1 flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-sky-200"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-sm font-black text-white shadow-sm">
                    {userInitial}
                  </span>

                  <span className="max-w-28 truncate text-sm font-semibold text-slate-700">
                    Hi, {userName}
                  </span>
                </NavLink>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="ml-1 rounded-lg bg-sky-400 px-4 py-2 text-sm font-bold text-slate-950 transition duration-300 hover:bg-sky-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            )}
          </div>

          {/* =========================
              MOBILE BUTTONS
          ========================= */}

          <div className="flex items-center gap-2 lg:hidden">
            {/* USER AVATAR */}

            {currentUser && (
              <NavLink
                to="/profile"
                onClick={closeMenu}
                title="Profile"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-sm font-black text-white shadow-sm"
              >
                {userInitial}
              </NavLink>
            )}

            {/* HAMBURGER */}

            <button
              type="button"
              onClick={() => setMenuOpen((previous) => !previous)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navbar-menu"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-300 bg-white/60 text-xl text-slate-800 shadow-sm transition hover:bg-sky-200 active:scale-95"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* =========================
            MOBILE DROPDOWN
        ========================= */}

        {menuOpen && (
          <div
            id="mobile-navbar-menu"
            className="
              absolute
              left-4
              right-4
              top-[calc(100%+8px)]
              max-h-[calc(100vh-90px)]
              overflow-y-auto
              rounded-2xl
              border
              border-sky-200
              bg-white/95
              p-3
              shadow-2xl
              backdrop-blur-xl
              sm:left-auto
              sm:right-6
              sm:w-80
              lg:hidden
            "
          >
            {/* =========================
                USER CARD
            ========================= */}

            {currentUser && (
              <NavLink
                to="/profile"
                onClick={closeMenu}
                className="mb-3 flex items-center gap-3 rounded-xl bg-gradient-to-r from-sky-50 to-blue-50 p-3 transition hover:bg-sky-100"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 font-black text-white shadow-md">
                  {userInitial}
                </span>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800">
                    Hi, {userName}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {currentUser.email}
                  </p>
                </div>
              </NavLink>
            )}

            {/* =========================
                MOBILE LINKS
            ========================= */}

            <div className="space-y-1">
              <NavLink
                to="/"
                end
                onClick={closeMenu}
                className={mobileLinkClass}
              >
                <span>🏠 Home</span>
              </NavLink>

              <NavLink
                to="/products"
                onClick={closeMenu}
                className={mobileLinkClass}
              >
                <span>🛍️ Products</span>
              </NavLink>

              <NavLink
                to="/wishlist"
                onClick={closeMenu}
                className={mobileLinkClass}
              >
                <span>❤️ Wishlist</span>

                {wishlistCount > 0 && (
                  <span className="rounded-full bg-sky-400 px-2 py-0.5 text-xs font-bold text-slate-950">
                    {wishlistCount}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/cart"
                onClick={closeMenu}
                className={mobileLinkClass}
              >
                <span>🛒 Cart</span>

                {cartCount > 0 && (
                  <span className="rounded-full bg-sky-400 px-2 py-0.5 text-xs font-bold text-slate-950">
                    {cartCount}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/orders"
                onClick={closeMenu}
                className={mobileLinkClass}
              >
                <span>📦 Orders</span>
              </NavLink>

              {currentUser && (
                <NavLink
                  to="/profile"
                  onClick={closeMenu}
                  className={mobileLinkClass}
                >
                  <span>👤 Profile</span>
                </NavLink>
              )}
            </div>

            {/* =========================
                LOGOUT
            ========================= */}

            {currentUser && (
              <div className="mt-3 border-t border-slate-200 pt-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full rounded-xl bg-sky-400 px-4 py-3 text-sm font-bold text-slate-950 transition duration-300 hover:bg-sky-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loggingOut ? "Logging out..." : "🚪 Logout"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
