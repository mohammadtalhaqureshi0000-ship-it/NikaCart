import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import Navbar from "../componants/Navbar";
import Footer from "../componants/Footer";
import ProductCard from "../componants/ProductCard";

import {
  setProducts,
  setProductsLoading,
  setProductsError,
} from "../features/Product/productSlice";

import { getProducts } from "../supabase/productService";

const Home = () => {
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      dispatch(setProductsLoading(true));

      try {
        const data = await getProducts();

        if (!active) {
          return;
        }

        dispatch(setProducts(data));
      } catch (error) {
        console.error("Unable to load products:", error);

        if (!active) {
          return;
        }

        dispatch(setProductsError(error.message || "Unable to load products."));
      }
    };

    loadProducts();

    return () => {
      active = false;
    };
  }, [dispatch]);

  const featuredProducts = products.slice(0, 6);

  const firstHeading = "Discover Your ";

  const secondHeading = "Nika Style";

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-slate-200 via-sky-100 to-gray-300">
        <section className="relative overflow-hidden px-4 py-20 sm:py-24 lg:py-28">
          <div className="pointer-events-none absolute -left-16 top-10 h-64 w-64 rounded-full bg-sky-300/30 blur-3xl" />

          <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-slate-400/20 blur-3xl" />

          <div className="relative mx-auto max-w-6xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-sky-700">
              ☀️ THE NEW ADVENTURE BEGINS
            </p>

            <h1 className="mb-6 text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              {firstHeading.split("").map((letter, index) => (
                <span
                  key={`first-${index}`}
                  className="letter-jump inline-block"
                  style={{
                    animationDelay: `${index * 0.08}s`,
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </span>
              ))}

              <span className="text-sky-600">
                {secondHeading.split("").map((letter, index) => (
                  <span
                    key={`second-${index}`}
                    className="letter-jump inline-block"
                    style={{
                      animationDelay: `${
                        (index + firstHeading.length) * 0.08
                      }s`,
                    }}
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </span>
                ))}
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Discover anime-inspired fashion, accessories, and everyday
              essentials designed for people who love adventure. Find your style
              and begin your journey with NikaCart.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <NavLink
                to="/products"
                className="sun-bounce inline-flex items-center justify-center rounded-xl bg-slate-800 px-8 py-3.5 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-sky-500 hover:text-slate-950 hover:shadow-xl active:scale-95"
              >
                Shop Now →
              </NavLink>

              <NavLink
                to="/cart"
                className="inline-flex items-center justify-center rounded-xl border border-sky-300 bg-white/80 px-8 py-3.5 font-semibold text-sky-800 shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md active:scale-95"
              >
                View Cart 🛒
              </NavLink>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-sky-700">
              OUR COLLECTION
            </p>

            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Featured Products
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              Explore our anime-inspired collection and discover styles selected
              for your next adventure.
            </p>

            <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-sky-500" />
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-sky-200 border-t-sky-500" />

              <p className="mt-4 font-semibold text-slate-600">
                Loading products...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-white p-10 text-center shadow-sm">
              <div className="mb-4 text-5xl">⚠️</div>

              <h3 className="mb-2 text-xl font-bold text-slate-900">
                Unable to Load Products
              </h3>

              <p className="mx-auto max-w-md text-slate-600">{error}</p>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-6 rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white transition hover:bg-sky-600 active:scale-95"
              >
                Try Again
              </button>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-sky-200 bg-white p-10 text-center shadow-sm">
              <div className="mb-4 text-5xl">📦</div>

              <h3 className="mb-2 text-xl font-bold text-slate-900">
                No Products Available
              </h3>

              <p className="text-slate-600">
                Our collection is currently being updated. Please check back
                soon.
              </p>
            </div>
          )}

          {!loading && !error && featuredProducts.length > 0 && (
            <div className="mt-12 text-center">
              <NavLink
                to="/products"
                className="inline-flex items-center justify-center rounded-xl border border-sky-400 bg-white px-8 py-3 font-semibold text-sky-700 shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-sky-100 hover:shadow-md active:scale-95"
              >
                View All Products →
              </NavLink>
            </div>
          )}
        </section>

        <section className="border-t border-sky-200 bg-white/50 px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Why Shop With NikaCart?
              </h2>

              <p className="mt-3 text-slate-600">
                A simple and enjoyable anime-inspired shopping experience.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-sky-200 bg-white p-7 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 text-4xl">☀️</div>

                <h3 className="mb-2 text-xl font-bold text-slate-900">
                  Anime-Inspired Style
                </h3>

                <p className="text-sm leading-relaxed text-slate-600">
                  Discover clothing and accessories inspired by your favorite
                  adventures.
                </p>
              </div>

              <div className="rounded-2xl border border-sky-200 bg-white p-7 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 text-4xl">🛒</div>

                <h3 className="mb-2 text-xl font-bold text-slate-900">
                  Easy Shopping
                </h3>

                <p className="text-sm leading-relaxed text-slate-600">
                  Browse products, manage your cart, and place orders through a
                  simple checkout experience.
                </p>
              </div>

              <div className="rounded-2xl border border-sky-200 bg-white p-7 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 text-4xl">📦</div>

                <h3 className="mb-2 text-xl font-bold text-slate-900">
                  Your Order History
                </h3>

                <p className="text-sm leading-relaxed text-slate-600">
                  Access your account to review your purchases and check your
                  order status.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;
