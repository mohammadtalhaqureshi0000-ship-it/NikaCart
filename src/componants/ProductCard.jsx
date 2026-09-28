
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { addToCart } from "../features/Cart/cartSlice";

import {
  addToWishlist,
  removeFromWishlist,
} from "../features/Wishlist/wishlistSlice";

const FALLBACK_IMAGE =
  "https://placehold.co/600x600/e0f2fe/334155?text=NikaCart";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const [failedImage, setFailedImage] = useState(null);

  const wishlistItems = useSelector(
    (state) => state.wishlist.wishlistItems
  );

  const isWishlisted = wishlistItems.some(
    (item) => item.id === product.id
  );

  const imageSrc =
    !product.image || failedImage === product.image
      ? FALLBACK_IMAGE
      : product.image;

  const handleImageError = () => {
    setFailedImage(product.image);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(addToCart(product));

    toast.success(`${product.title} added to cart!`, {
      icon: "🛒",
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));

      toast.success(`${product.title} removed from wishlist!`, {
        icon: "💔",
      });
    } else {
      dispatch(addToWishlist(product));

      toast.success(`${product.title} added to wishlist!`, {
        icon: "❤️",
      });
    }
  };

  return (
    <div className="card-3d-container h-full min-w-0">
      <div className="card-3d-depth h-full">
        <article className="wave-card group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-sky-200 bg-gradient-to-br from-white via-sky-50 to-slate-100 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-sky-400 hover:shadow-xl">

          <div className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-slate-100">
            <NavLink
              to={`/products/${product.id}`}
              className="card-3d-link block"
            >
              <div className="flex h-44 w-full items-center justify-center overflow-hidden p-3 sm:h-48">
                <img
                  key={product.image}
                  src={imageSrc}
                  alt={product.title}
                  loading="lazy"
                  decoding="async"
                  onError={handleImageError}
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </NavLink>

            <span className="pointer-events-none absolute left-3 top-3 max-w-[65%] truncate rounded-full border border-sky-200 bg-white/95 px-2.5 py-1 text-[10px] font-bold text-sky-700 shadow-sm">
              {product.category}
            </span>

            <button
              type="button"
              onClick={handleWishlist}
              aria-label={
                isWishlisted
                  ? `Remove ${product.title} from wishlist`
                  : `Add ${product.title} to wishlist`
              }
              aria-pressed={isWishlisted}
              className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border text-lg shadow-sm transition-all duration-300 hover:scale-110 active:scale-95 ${
                isWishlisted
                  ? "border-red-200 bg-red-50 text-red-500"
                  : "border-sky-200 bg-white/95 text-slate-600 hover:bg-red-50"
              }`}
            >
              {isWishlisted ? "❤️" : "🤍"}
            </button>
          </div>

          <div className="flex flex-1 flex-col p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-700">
                NIKACART
              </span>

              <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
                ⭐ {product.rating ?? "New"}
              </span>
            </div>

            <NavLink to={`/products/${product.id}`}>
              <h3 className="line-clamp-2 min-h-12 text-base font-extrabold leading-6 text-slate-900 transition-colors duration-300 hover:text-sky-600">
                {product.title}
              </h3>
            </NavLink>

            <p className="mt-1 line-clamp-2 min-h-9 text-xs leading-[18px] text-slate-500">
              {product.description}
            </p>

            <div className="mt-auto pt-3">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-xl font-black text-slate-900">
                  ${Number(product.price || 0).toFixed(2)}
                </span>

                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                  Available
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <NavLink
                  to={`/products/${product.id}`}
                  className="flex items-center justify-center rounded-lg border border-sky-300 bg-sky-50 px-2 py-2.5 text-center text-xs font-bold text-sky-700 transition hover:bg-sky-100 active:scale-95"
                >
                  View Details
                </NavLink>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="rounded-lg bg-slate-800 px-2 py-2.5 text-xs font-bold text-white transition duration-300 hover:bg-sky-500 hover:text-slate-950 active:scale-95"
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          </div>

        </article>
      </div>
    </div>
  );
};

export default ProductCard;