import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  removeFromWishlist,
  clearWishlist,
} from "../features/Wishlist/wishlistSlice";

import { addToCart } from "../features/Cart/cartSlice";

import ProductImage from "../componants/ProductImage";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wishlistItems = useSelector(
    (state) => state.wishlist.wishlistItems || [],
  );

  const currentUser = useSelector((state) => state.auth.currentUser);

  const handleAddToCart = (item) => {
    if (!currentUser) {
      toast.error("Please login to add products to your cart.");

      navigate("/login", {
        state: {
          from: "/wishlist",
        },
      });

      return;
    }

    if (currentUser.isBlocked) {
      toast.error("Your account is blocked.");
      return;
    }

    if (currentUser.role !== "customer") {
      toast.error("Please use a customer account to shop.");
      return;
    }

    dispatch(addToCart(item));

    toast.success(`${item.title} added to cart!`, {
      icon: "🛒",
    });
  };

  const handleRemove = (item) => {
    dispatch(removeFromWishlist(item.id));

    toast.success(`${item.title} removed from wishlist!`, {
      icon: "💔",
    });
  };

  const handleClearWishlist = () => {
    if (wishlistItems.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to clear your entire wishlist?",
    );

    if (!confirmed) {
      return;
    }

    dispatch(clearWishlist());

    toast.success("Wishlist cleared!");
  };

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-slate-200 via-sky-100 to-gray-300">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="mb-8 inline-flex w-fit items-center gap-2 rounded-lg border border-sky-300 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 shadow-sm transition duration-300 hover:-translate-x-1 hover:bg-sky-100"
        >
          ← Back to Home
        </NavLink>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-12">
            <div className="w-full max-w-md rounded-2xl border border-sky-200 bg-white p-8 text-center shadow-lg">
              <div className="mb-4 text-6xl text-red-500">♡</div>

              <h1 className="mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                Your Wishlist is Empty
              </h1>

              <p className="mb-6 text-sm text-slate-600 sm:text-base">
                Save your favorite anime-inspired products here.
              </p>

              <NavLink
                to="/products"
                className="inline-block rounded-lg bg-sky-500 px-6 py-3 font-semibold text-white transition hover:bg-sky-600 active:scale-95"
              >
                Explore Products
              </NavLink>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                  My Wishlist ❤️
                </h1>

                <p className="mt-2 text-sm text-slate-600">
                  {wishlistItems.length} saved{" "}
                  {wishlistItems.length === 1 ? "product" : "products"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleClearWishlist}
                className="rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50 active:scale-95"
              >
                Clear Wishlist
              </button>
            </div>

            <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-sky-200 bg-gradient-to-br from-sky-100 via-slate-100 to-gray-200 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <NavLink to={`/products/${item.id}`} className="block">
                    <div className="h-60 w-full overflow-hidden bg-white p-3">
                      <ProductImage
                        src={item.image}
                        alt={item.title}
                        className="transition duration-500 hover:scale-105"
                      />
                    </div>
                  </NavLink>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-sky-700">
                      {item.category || "Product"}
                    </p>

                    <NavLink to={`/products/${item.id}`}>
                      <h2 className="mb-2 line-clamp-1 text-xl font-bold text-slate-900 transition hover:text-sky-600">
                        {item.title || "NikaCart Product"}
                      </h2>
                    </NavLink>

                    <p className="mb-4 line-clamp-2 text-sm text-slate-600">
                      {item.description || "No description available."}
                    </p>

                    <div className="mb-4 flex items-center justify-between gap-3">
                      <strong className="text-2xl font-extrabold text-slate-900">
                        ${Number(item.price || 0).toFixed(2)}
                      </strong>

                      <span className="text-sm font-semibold text-amber-600">
                        ⭐ {Number(item.rating || 0).toFixed(1)}
                      </span>
                    </div>

                    <div className="mt-auto flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        className="min-w-0 flex-1 rounded-lg bg-slate-800 px-3 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-sky-500 hover:text-slate-950 active:scale-95"
                      >
                        🛒 Add to Cart
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemove(item)}
                        className="rounded-lg border border-red-300 bg-white px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50 active:scale-95"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Wishlist;
