import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { addToCart } from "../features/Cart/cartSlice";
import { getProducts } from "../supabase/productService";
import { setProducts } from "../features/Product/productSlice";
import ProductImage from "../componants/ProductImage";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.currentUser);

  const products = useSelector((state) => state.products.products);

  const cachedProduct = products.find((item) => String(item.id) === String(id));

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      setProduct(null);

      try {
        const data = await getProducts();

        if (!active) return;

        dispatch(setProducts(data));

        const foundProduct = data.find(
          (item) => String(item.id) === String(id),
        );

        setProduct(foundProduct || null);
      } catch (err) {
        if (!active) return;

        console.error("Unable to load product:", err);

        setError(err.message || "Unable to load product details.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      active = false;
    };
  }, [id, retryCount, dispatch]);

  const displayedProduct = product || (loading ? cachedProduct : null);

  const handleAddToCart = () => {
    if (!displayedProduct) return;

    if (!currentUser) {
      toast.error("Please login to add products to your cart.");

      navigate("/login", {
        state: {
          from: `/products/${id}`,
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

    dispatch(addToCart(displayedProduct));

    toast.success(`${displayedProduct.title} added to cart!`, {
      icon: "🛒",
    });

    navigate("/cart");
  };

  if (loading && !displayedProduct) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-200 via-sky-100 to-gray-300 px-4">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-sky-200 border-t-sky-500" />

          <p className="mt-5 font-semibold text-slate-700">
            Loading product details...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-200 via-sky-100 to-gray-300 px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-lg">
          <div className="mb-4 text-5xl">⚠️</div>

          <h1 className="mb-4 text-2xl font-bold text-slate-900">
            Unable to Load Product
          </h1>

          <p className="mb-6 text-slate-600">{error}</p>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="rounded-lg bg-sky-500 px-6 py-3 font-semibold text-white transition hover:bg-sky-600"
            >
              Try Again
            </button>

            <NavLink
              to="/products"
              className="rounded-lg border border-sky-300 px-6 py-3 font-semibold text-sky-700 transition hover:bg-sky-50"
            >
              Back to Products
            </NavLink>
          </div>
        </div>
      </main>
    );
  }

  if (!displayedProduct) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-200 via-sky-100 to-gray-300 px-4">
        <div className="w-full max-w-md rounded-2xl border border-sky-200 bg-white p-8 text-center shadow-lg">
          <div className="mb-4 text-5xl">📦</div>

          <h1 className="mb-4 text-2xl font-bold text-slate-900">
            Product Not Found
          </h1>

          <p className="mb-6 text-slate-600">
            The product you are looking for is unavailable.
          </p>

          <NavLink
            to="/products"
            className="inline-block rounded-lg bg-sky-500 px-6 py-3 font-semibold text-white transition hover:bg-sky-600"
          >
            ← Back to Products
          </NavLink>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-200 via-sky-100 to-gray-300 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <NavLink
          to="/products"
          className="mb-8 inline-flex items-center gap-2 rounded-lg border border-sky-300 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 shadow-sm transition duration-300 hover:-translate-x-1 hover:bg-sky-100"
        >
          ← Back to Products
        </NavLink>

        <div className="grid overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-lg md:grid-cols-2">
          <div className="bg-gradient-to-br from-sky-50 to-slate-100 p-4 sm:p-6 md:p-8">
            <div className="h-64 overflow-hidden rounded-xl border border-sky-100 bg-white sm:h-80 md:h-[450px]">
              <ProductImage
                src={displayedProduct.image}
                alt={displayedProduct.title}
                className="transition duration-500 hover:scale-105"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center p-5 sm:p-8 md:p-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-sky-700 sm:text-sm">
              {displayedProduct.category}
            </p>

            <h1 className="mb-4 text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl md:text-4xl">
              {displayedProduct.title}
            </h1>

            <p className="mb-6 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              {displayedProduct.description}
            </p>

            <p className="mb-4 text-3xl font-extrabold text-sky-700">
              ${Number(displayedProduct.price || 0).toFixed(2)}
            </p>

            <p className="mb-8 text-base font-semibold text-slate-700 sm:text-lg">
              ⭐ {Number(displayedProduct.rating || 0).toFixed(1)}
            </p>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={loading}
              className="w-full rounded-xl bg-slate-800 px-6 py-3.5 font-semibold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:bg-sky-500 hover:text-slate-950 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
            >
              {loading ? "Loading..." : "🛒 Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
