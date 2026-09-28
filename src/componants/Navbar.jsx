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

  const currentUser = useSelector((state) => state.auth.currentUser);

  const cartItems = useSelector((state) => state.cart.cartItems || []);

  const wishlistItems = useSelector(
    (state) => state.wishlist.wishlistItems || [],
  );

  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );

  const wishlistCount = wishlistItems.length;

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

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      // Sign out from Supabase.
      // This removes the persistent Supabase session.
      await supabaseLogoutUser();

      // Clear the Redux copy of the authenticated user.
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

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition duration-300 ${
      isActive
        ? "bg-sky-400 text-slate-950 shadow-sm"
        : "text-slate-800 hover:bg-sky-200"
    }`;

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b border-sky-200 bg-gradient-to-r from-slate-200 via-sky-100 to-gray-300 shadow-md transition-transform duration-300 ease-in-out ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className="group flex shrink-0 items-center text-2xl font-extrabold text-slate-900 sm:text-3xl"
          >
            <span className="mr-1 inline-block origin-bottom transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125">
              ☀️
            </span>
            Nika
            <span className="text-sky-600">Cart</span>
          </NavLink>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="navbar-menu"
            className="rounded-lg border border-sky-300 px-3 py-2 text-xl text-slate-800 transition hover:bg-sky-200 lg:hidden"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          <div
            id="navbar-menu"
            className={`w-full flex-col gap-2 lg:flex lg:w-auto lg:flex-row lg:items-center ${
              menuOpen ? "flex" : "hidden"
            }`}
          >
            <NavLink
              to="/"
              end
              onClick={() => setMenuOpen(false)}
              className={linkClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              onClick={() => setMenuOpen(false)}
              className={linkClass}
            >
              Products
            </NavLink>

            <NavLink
              to="/wishlist"
              onClick={() => setMenuOpen(false)}
              className={linkClass}
            >
              Wishlist ❤️
              {wishlistCount > 0 && (
                <span className="ml-1 rounded-full bg-sky-400 px-1.5 py-0.5 text-xs font-bold text-slate-950">
                  {wishlistCount}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className={linkClass}
            >
              Cart 🛒
              {cartCount > 0 && (
                <span className="ml-1 rounded-full bg-sky-400 px-1.5 py-0.5 text-xs font-bold text-slate-950">
                  {cartCount}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/orders"
              onClick={() => setMenuOpen(false)}
              className={linkClass}
            >
              Orders
            </NavLink>

            {currentUser && (
              <>
                <NavLink
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className={linkClass}
                >
                  👤 Profile
                </NavLink>

                <div className="flex flex-wrap items-center gap-2 lg:ml-2">
                  <NavLink
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    title="View your profile"
                    className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-sky-200"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-sm font-black text-white shadow-sm">
                      {(currentUser.name ||
                        currentUser.email ||
                        "U")[0].toUpperCase()}
                    </span>

                    <span className="max-w-28 truncate text-sm font-semibold text-slate-700">
                      Hi, {currentUser.name || "User"}
                    </span>
                  </NavLink>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="rounded-lg bg-sky-400 px-4 py-2 text-sm font-bold text-slate-950 transition duration-300 hover:-translate-y-1 hover:bg-sky-300 active:scale-95 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                  >
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
