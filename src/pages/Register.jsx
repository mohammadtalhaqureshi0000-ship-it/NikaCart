import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { registerUser } from "../supabase/authService";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (name.length < 2) {
      toast.error("Name must contain at least 2 characters.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await registerUser(name, email, password);

      if (!data?.user) {
        throw new Error("Unable to create your account.");
      }

      if (!data.session) {
        toast.success(
          "Account created! Please check your email to verify your account.",
          {
            duration: 6000,
          },
        );
      } else {
        toast.success("Account created successfully!");
      }

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Registration error:", error);

      const message = String(error?.message || "").toLowerCase();

      if (
        message.includes("already registered") ||
        message.includes("already exists") ||
        message.includes("user already")
      ) {
        toast.error("An account with this email already exists.");
      } else if (message.includes("password")) {
        toast.error(error.message || "Please use a stronger password.");
      } else if (message.includes("email") && message.includes("invalid")) {
        toast.error("Please enter a valid email address.");
      } else {
        toast.error(error?.message || "Unable to create your account.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-slate-300 via-sky-100 to-gray-400 px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border border-sky-200 bg-gradient-to-br from-slate-800 via-slate-700 to-gray-700 p-6 shadow-2xl sm:p-9">
        <NavLink
          to="/welcome"
          className="mb-5 inline-flex items-center gap-2 rounded-lg border border-sky-400/40 px-3 py-2 text-sm font-semibold text-sky-300 transition duration-300 hover:-translate-x-1 hover:bg-sky-400/10 hover:text-sky-200"
        >
          <span aria-hidden="true">←</span>
          Back to Welcome
        </NavLink>

        <div className="mb-6 text-center">
          <NavLink
            to="/welcome"
            className="inline-block text-5xl transition duration-300 hover:rotate-12 hover:scale-110"
          >
            ☀️
          </NavLink>

          <h1 className="mt-3 text-3xl font-black text-white">
            Create <span className="text-sky-400">Account</span>
          </h1>

          <p className="mt-2 text-sm text-slate-300">
            Join NikaCart and start your adventure.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Full Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              autoComplete="name"
              required
              minLength={2}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-500 bg-slate-800/70 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-500 bg-slate-800/70 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Password
            </label>

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              required
              minLength={8}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-500 bg-slate-800/70 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
              minLength={8}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-500 bg-slate-800/70 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              disabled={isSubmitting}
              className="accent-sky-400"
            />
            Show passwords
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-sky-400 px-5 py-3 font-bold text-slate-950 shadow-lg transition duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-sky-300 hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-300">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="font-semibold text-sky-400 transition hover:text-sky-300 hover:underline"
          >
            Login
          </NavLink>
        </p>
      </div>
    </main>
  );
};

export default Register;
