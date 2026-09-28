import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../features/Cart/cartSlice";

import ProductImage from "../componants/ProductImage";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems || []);

  const currentUser = useSelector((state) => state.auth.currentUser);

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 1),
    0,
  );

  const totalItems = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0,
  );

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));

    toast.success("Product removed from cart");
  };

  const handleClearCart = () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove all products from your cart?",
    );

    if (!confirmed) {
      return;
    }

    dispatch(clearCart());

    toast.success("Cart cleared successfully");
  };

  const handleCheckout = () => {
    if (!currentUser) {
      toast.error("Please log in before checkout.");

      navigate("/login");

      return;
    }

    if (currentUser.role === "admin") {
      toast.error("Please use a customer account to place an order.");

      return;
    }

    if (currentUser.isBlocked) {
      toast.error("Your account cannot place orders.");

      return;
    }

    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-200 via-sky-100 to-gray-300 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <NavLink
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-sky-300 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 shadow-sm transition duration-300 hover:-translate-x-1 hover:bg-sky-100"
          >
            ← Back to Home
          </NavLink>

          <div className="flex min-h-[65vh] items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border border-sky-200 bg-white p-8 text-center shadow-lg">
              <div className="mb-4 text-6xl">🛒</div>

              <h1 className="mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                Your Cart is Empty
              </h1>

              <p className="mb-6 text-slate-600">
                Add some anime-inspired products to your cart.
              </p>

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="rounded-lg bg-sky-500 px-6 py-3 font-semibold text-white transition hover:bg-sky-600 active:scale-95"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-200 via-sky-100 to-gray-300 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <NavLink
          to="/"
          className="mb-8 inline-flex items-center gap-2 rounded-lg border border-sky-300 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 shadow-sm transition duration-300 hover:-translate-x-1 hover:bg-sky-100"
        >
          ← Back to Home
        </NavLink>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Shopping Cart
          </h1>

          <p className="mt-2 text-slate-600">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cartItems.map((item) => {
              const price = Number(item.price || 0);

              const quantity = Number(item.quantity || 1);

              const itemTotal = price * quantity;

              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-sky-200 bg-white p-4 shadow-md sm:p-6"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="h-40 w-full overflow-hidden rounded-lg bg-slate-100 sm:h-28 sm:w-28">
                      <ProductImage
                        src={item.image}
                        alt={item.title || "NikaCart Product"}
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="mb-1 text-sm font-semibold text-sky-700">
                        {item.category || "Product"}
                      </p>

                      <h2 className="mb-2 break-words text-lg font-bold text-slate-900">
                        {item.title || "NikaCart Product"}
                      </h2>

                      <p className="text-lg font-bold text-sky-700">
                        ${price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:flex-col">
                      <div className="flex items-center overflow-hidden rounded-lg border border-sky-200 bg-slate-50">
                        <button
                          type="button"
                          onClick={() => dispatch(decreaseQuantity(item.id))}
                          disabled={quantity <= 1}
                          aria-label={`Decrease quantity of ${
                            item.title || "product"
                          }`}
                          className="px-3 py-2 text-lg font-bold text-slate-700 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          −
                        </button>

                        <span className="min-w-10 text-center font-semibold text-slate-900">
                          {quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => dispatch(increaseQuantity(item.id))}
                          aria-label={`Increase quantity of ${
                            item.title || "product"
                          }`}
                          className="px-3 py-2 text-lg font-bold text-slate-700 transition hover:bg-sky-100"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="text-sm font-semibold text-red-500 transition hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-slate-200 pt-4 text-right">
                    <span className="text-sm text-slate-500">Item Total: </span>

                    <span className="font-bold text-slate-900">
                      ${itemTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={handleClearCart}
              className="rounded-lg border border-red-300 bg-white px-5 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
            >
              Clear Cart
            </button>
          </div>

          <div className="h-fit rounded-2xl border border-sky-200 bg-white p-6 shadow-lg lg:sticky lg:top-24">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">
              Order Summary
            </h2>

            <div className="space-y-4 border-b border-slate-200 pb-5">
              <div className="flex justify-between text-slate-600">
                <span>Items</span>

                <span>{totalItems}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>

                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>

                <span className="font-semibold text-sky-700">Free</span>
              </div>
            </div>

            <div className="flex justify-between py-5 text-xl font-bold text-slate-900">
              <span>Total</span>

              <span>${subtotal.toFixed(2)}</span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full rounded-lg bg-sky-500 px-6 py-3 font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-md active:scale-95"
            >
              Proceed to Checkout
            </button>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="mt-3 w-full rounded-lg border border-sky-300 px-6 py-3 font-semibold text-sky-700 transition hover:bg-sky-50"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
