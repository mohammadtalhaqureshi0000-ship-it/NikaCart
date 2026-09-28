
import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const footerLink =
    "block text-slate-300 transition duration-300 hover:translate-x-1 hover:text-sky-300";

  return (
    <footer className="border-t border-sky-400/20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">

        <div>
          <NavLink
            to="/"
            className="group inline-flex items-center text-2xl font-extrabold"
          >
            <span className="mr-1 inline-block origin-bottom transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125">
              ☀️
            </span>

            Nika<span className="text-sky-400">Cart</span>
          </NavLink>

          <p className="mt-4 max-w-xs text-sm leading-7 text-slate-300">
            Bringing anime-inspired style to your everyday shopping.
            Discover your favorite products and express your Nika style.
          </p>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-bold text-white">
            Quick Links
          </h3>

          <div className="space-y-3">
            <NavLink to="/" className={footerLink}>
              Home
            </NavLink>

            <NavLink to="/products" className={footerLink}>
              Products
            </NavLink>

            <NavLink to="/wishlist" className={footerLink}>
              Wishlist
            </NavLink>

            <NavLink to="/cart" className={footerLink}>
              Cart
            </NavLink>

            <NavLink to="/orders" className={footerLink}>
              My Orders
            </NavLink>
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-bold text-white">
            Customer Support
          </h3>

          <div className="space-y-3">
            <NavLink to="/contact" className={footerLink}>
              Contact Us
            </NavLink>

            <NavLink to="/faq" className={footerLink}>
              FAQs
            </NavLink>

            <NavLink to="/shipping" className={footerLink}>
              Shipping Information
            </NavLink>

            <NavLink to="/returns" className={footerLink}>
              Returns & Refunds
            </NavLink>
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-bold text-white">
            Follow Us
          </h3>

          <div className="flex flex-wrap gap-4">
            <a
              href="#"
              aria-label="Instagram"
              className="text-slate-300 transition duration-300 hover:text-sky-300"
            >
              Instagram
            </a>

            <a
              href="#"
              aria-label="GitHub"
              className="text-slate-300 transition duration-300 hover:text-sky-300"
            >
              GitHub
            </a>

            <a
              href="#"
              aria-label="Email"
              className="text-slate-300 transition duration-300 hover:text-sky-300"
            >
              Email
            </a>
          </div>

          <div className="mt-6 rounded-xl border border-sky-400/20 bg-slate-700/40 p-4">
            <p className="text-sm font-semibold text-sky-300">
              ☀️ Discover Your Nika Style
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-300">
              Anime-inspired fashion for every adventure.
            </p>
          </div>
        </div>

      </div>

      <div className="border-t border-slate-700/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center text-sm text-slate-400 sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 NikaCart. All rights reserved.</p>

          <p>
            Built with{" "}
            <span className="font-semibold text-sky-300">
              React & Redux Toolkit
            </span>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;