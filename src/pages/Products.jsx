import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../componants/Navbar";
import Footer from "../componants/Footer";
import ProductCard from "../componants/ProductCard";
import ProductFilter from "../componants/ProductFilter";

import {
  setProducts,
  setProductsLoading,
  setProductsError,
  setSearchQuery,
  setSortBy,
  clearFilters,
} from "../features/Product/productSlice";

import { getProducts } from "../supabase/productService";

const Products = () => {
  const dispatch = useDispatch();

  const {
    products,
    filteredProducts,
    category,
    price,
    searchQuery,
    sortBy,
    loading,
    error,
  } = useSelector((state) => state.products);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      dispatch(setProductsLoading(true));

      try {
        const data = await getProducts();

        if (!active) return;

        dispatch(setProducts(data));
      } catch (error) {
        if (!active) return;

        const message = error.message || "Unable to load products.";

        dispatch(setProductsError(message));

        toast.error(message);
      }
    };

    loadProducts();

    return () => {
      active = false;
    };
  }, [dispatch]);

  const hasActiveFilters =
    category !== "all" ||
    price !== "all" ||
    searchQuery.trim() !== "" ||
    sortBy !== "default";

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleRetry = async () => {
    dispatch(setProductsLoading(true));

    try {
      const data = await getProducts();

      dispatch(setProducts(data));
    } catch (error) {
      const message = error.message || "Unable to load products.";

      dispatch(setProductsError(message));

      toast.error(message);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-slate-200 via-sky-100 to-gray-300 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <NavLink
            to="/"
            className="mb-8 inline-flex items-center gap-2 rounded-lg border border-sky-300 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 shadow-sm transition duration-300 hover:-translate-x-1 hover:bg-sky-100"
          >
            ← Back to Home
          </NavLink>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              All Products
            </h1>

            <p className="mt-2 text-slate-600">
              Discover your favorite anime-inspired products.
            </p>
          </div>

          <div className="mb-8 rounded-2xl border border-sky-200 bg-white p-4 shadow-sm sm:p-5">
            <label
              htmlFor="product-search"
              className="mb-3 block text-sm font-semibold text-slate-700"
            >
              Search Products
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-lg text-slate-400">
                🔍
              </span>

              <input
                id="product-search"
                type="search"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                placeholder="Search Luffy, Zoro, hoodies..."
                disabled={loading}
                className="w-full rounded-xl border border-sky-300 bg-sky-50 py-3 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-slate-500">
                {loading ? (
                  "Loading products..."
                ) : (
                  <>
                    Showing {filteredProducts.length} of {products.length}{" "}
                    products
                  </>
                )}
              </p>

              {hasActiveFilters && !loading && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-sm font-semibold text-sky-700 transition hover:text-sky-900 hover:underline"
                >
                  Reset All Filters ✕
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-96 flex-col items-center justify-center rounded-2xl border border-sky-200 bg-white p-8 text-center shadow-sm">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-100 border-t-sky-500" />

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                Loading Products...
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Getting the latest products from NikaCart.
              </p>
            </div>
          ) : error ? (
            <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
              <div className="mb-4 text-5xl">⚠️</div>

              <h2 className="text-2xl font-bold text-slate-900">
                Unable to Load Products
              </h2>

              <p className="mt-2 max-w-md text-slate-600">{error}</p>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-6 rounded-lg bg-sky-500 px-6 py-3 font-semibold text-white transition hover:bg-sky-600 active:scale-95"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              <aside className="lg:col-span-1">
                <ProductFilter />
              </aside>

              <section className="lg:col-span-3">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-slate-900">
                    Product Collection
                  </h2>

                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="product-sort"
                      className="text-sm font-semibold text-slate-600"
                    >
                      Sort By
                    </label>

                    <select
                      id="product-sort"
                      value={sortBy}
                      onChange={(e) => dispatch(setSortBy(e.target.value))}
                      className="rounded-lg border border-sky-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    >
                      <option value="default">Default</option>

                      <option value="price-low">Price: Low to High</option>

                      <option value="price-high">Price: High to Low</option>

                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>

                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-sky-200 bg-white p-8 text-center shadow-sm">
                    <div className="mb-4 text-5xl">🔍</div>

                    <h2 className="mb-2 text-2xl font-bold text-slate-900">
                      No Products Found
                    </h2>

                    <p className="mb-6 max-w-md text-slate-600">
                      {products.length === 0
                        ? "There are currently no products in NikaCart."
                        : "Try another search or change your category and price filters."}
                    </p>

                    {products.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearFilters}
                        className="rounded-lg bg-sky-500 px-6 py-3 font-semibold text-white transition duration-300 hover:bg-sky-600 active:scale-95"
                      >
                        Reset All Filters
                      </button>
                    )}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Products;
