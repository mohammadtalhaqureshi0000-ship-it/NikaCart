import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { NavLink, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import Navbar from "../componants/Navbar";
import Footer from "../componants/Footer";

import { placeOrder } from "../features/Orders/ordersSlice";

import { clearCart } from "../features/Cart/cartSlice";

import { createOrder } from "../supabase/orderService";

const Checkout = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems);

  const currentUser = useSelector((state) => state.auth.currentUser);

  const [formData, setFormData] = useState({
    fullName: currentUser?.name || "",

    email: currentUser?.email || "",

    phone: "",

    address: "",

    city: "",

    postalCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 1),
    0,
  );

  const shipping = 0;

  const total = subtotal + shipping;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,

      [name]: value,
    }));
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!currentUser || currentUser.role === "admin") {
      toast.error("Please log in with a customer account.");

      return;
    }

    if (currentUser.isBlocked) {
      toast.error("Your account cannot place orders.");

      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");

      return;
    }

    const hasEmptyFields = Object.values(formData).some(
      (value) => String(value).trim() === "",
    );

    if (hasEmptyFields) {
      toast.error("Please fill in all required fields.");

      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email.trim())) {
      toast.error("Please enter a valid email address.");

      return;
    }

    setIsSubmitting(true);

    try {
      const order = await createOrder({
        customer: {
          fullName: formData.fullName.trim(),

          email: formData.email.trim(),

          phone: formData.phone.trim(),

          address: formData.address.trim(),

          city: formData.city.trim(),

          postalCode: formData.postalCode.trim(),
        },

        items: cartItems,

        subtotal,

        shipping,

        total,

        paymentMethod,
      });

      dispatch(placeOrder(order));

      dispatch(clearCart());

      toast.success("Order placed successfully! 🎉", {
        duration: 3500,
      });

      navigate(`/order-confirmation/${order.id}`, {
        replace: true,
      });
    } catch (error) {
      console.error("Order placement failed:", error);

      toast.error(
        error.message || "Unable to place your order. Please try again.",
      );

      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-sky-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100";

  const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-slate-200 via-sky-100 to-gray-300 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <NavLink
            to="/cart"
            className="mb-8 inline-flex items-center gap-2 rounded-lg border border-sky-300 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 shadow-sm transition duration-300 hover:-translate-x-1 hover:bg-sky-100"
          >
            ← Back to Cart
          </NavLink>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Checkout
            </h1>

            <p className="mt-2 text-slate-600">
              Complete your details to place your order.
            </p>
          </div>

          {cartItems.length === 0 ? (
            <div className="rounded-2xl border border-sky-200 bg-white p-10 text-center shadow-md">
              <div className="mb-4 text-6xl">🛒</div>

              <h2 className="mb-3 text-2xl font-bold text-slate-900">
                Your cart is empty
              </h2>

              <p className="mb-6 text-slate-600">
                Add some products before proceeding to checkout.
              </p>

              <NavLink
                to="/products"
                className="inline-block rounded-lg bg-sky-500 px-6 py-3 font-semibold text-white transition hover:bg-sky-600"
              >
                Continue Shopping
              </NavLink>
            </div>
          ) : (
            <form
              onSubmit={handlePlaceOrder}
              noValidate
              className="grid gap-8 lg:grid-cols-3"
            >
              <div className="space-y-6 lg:col-span-2">
                <section className="rounded-2xl border border-sky-200 bg-white p-6 shadow-md sm:p-8">
                  <h2 className="mb-6 text-2xl font-bold text-slate-900">
                    Shipping Information
                  </h2>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="fullName" className={labelClass}>
                        Full Name
                      </label>

                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        required
                        disabled={isSubmitting}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className={labelClass}>
                        Email Address
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        autoComplete="email"
                        required
                        disabled={isSubmitting}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className={labelClass}>
                        Phone Number
                      </label>

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        autoComplete="tel"
                        required
                        disabled={isSubmitting}
                        className={inputClass}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="address" className={labelClass}>
                        Shipping Address
                      </label>

                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter your complete address"
                        autoComplete="street-address"
                        rows={3}
                        required
                        disabled={isSubmitting}
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className={labelClass}>
                        City
                      </label>

                      <input
                        id="city"
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter your city"
                        autoComplete="address-level2"
                        required
                        disabled={isSubmitting}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="postalCode" className={labelClass}>
                        Postal Code
                      </label>

                      <input
                        id="postalCode"
                        name="postalCode"
                        type="text"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="Enter postal code"
                        autoComplete="postal-code"
                        required
                        disabled={isSubmitting}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-sky-200 bg-white p-6 shadow-md sm:p-8">
                  <h2 className="mb-5 text-2xl font-bold text-slate-900">
                    Payment Method
                  </h2>

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-sky-300 bg-sky-50 p-4 transition hover:bg-sky-100">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                      disabled={isSubmitting}
                      className="h-4 w-4 accent-sky-500"
                    />

                    <span className="font-semibold text-slate-800">
                      Cash on Delivery
                    </span>
                  </label>
                </section>
              </div>

              <aside className="h-fit rounded-2xl border border-sky-200 bg-white p-6 shadow-md sm:p-8">
                <h2 className="mb-6 text-2xl font-bold text-slate-900">
                  Order Summary
                </h2>

                <div className="space-y-5">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 border-b border-slate-100 pb-4"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-16 w-16 rounded-lg bg-slate-100 object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <span className="font-bold text-slate-900">
                        $
                        {(Number(item.price) * Number(item.quantity)).toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>

                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>

                    <span className="font-semibold text-sky-700">Free</span>
                  </div>

                  <div className="flex justify-between border-t border-slate-200 pt-4 text-xl font-extrabold text-slate-900">
                    <span>Total</span>

                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-8 w-full rounded-lg bg-sky-500 px-6 py-3 font-bold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Placing Order..."
                    : `Place Order — $${total.toFixed(2)}`}
                </button>

                <NavLink
                  to="/cart"
                  className="mt-4 block text-center text-sm font-semibold text-sky-700 transition hover:text-sky-900"
                >
                  ← Back to Cart
                </NavLink>
              </aside>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Checkout;
