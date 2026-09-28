import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  loginUser,
  getUserProfile,
  logoutUser as supabaseLogout,
} from "../supabase/authService";

import { setCurrentUser, clearAuthError } from "../features/auth/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const email = form.email.trim().toLowerCase();

    const password = form.password;

    if (!email || !password) {
      toast.error("Please enter your email and password.");

      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address.");

      return;
    }

    setIsSubmitting(true);

    dispatch(clearAuthError());

    try {
      const authData = await loginUser(email, password);

      const user = authData?.user;

      if (!user) {
        throw new Error("Unable to sign in.");
      }

      let profile;

      try {
        profile = await getUserProfile(user.id);
      } catch (profileError) {
        await supabaseLogout().catch(() => {});

        console.error("Profile loading error:", profileError);

        throw new Error("Your account profile could not be loaded.");
      }

      if (!profile) {
        await supabaseLogout().catch(() => {});

        throw new Error("Your account profile was not found.");
      }

      if (profile.isBlocked) {
        await supabaseLogout();

        toast.error(
          "Your account has been blocked. Please contact the store administrator.",
        );

        return;
      }

      if (profile.role !== "customer" && profile.role !== "admin") {
        await supabaseLogout();

        toast.error("Your account role is not valid.");

        return;
      }

      dispatch(setCurrentUser(profile));

      toast.success(`Welcome back, ${profile.name || "User"}!`);

      if (profile.role === "admin") {
        navigate("/admin", {
          replace: true,
        });

        return;
      }

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      await supabaseLogout().catch(() => {});

      console.error("Login error:", error);

      const message = String(error?.message || "").toLowerCase();

      if (message.includes("email not confirmed")) {
        toast.error("Please confirm your email before logging in.");
      } else if (message.includes("invalid login credentials")) {
        toast.error("Incorrect email or password.");
      } else {
        toast.error(error?.message || "Unable to login. Please try again.");
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

        <div className="mb-8 text-center">
          <NavLink
            to="/welcome"
            className="inline-block text-6xl transition duration-300 hover:rotate-12 hover:scale-110"
          >
            ☀️
          </NavLink>

          <h1 className="mt-4 text-3xl font-black text-white">
            Welcome <span className="text-sky-400">Back!</span>
          </h1>

          <p className="mt-2 text-sm text-slate-300">
            Login to continue your NikaCart adventure.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
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

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-500 bg-slate-800/70 px-4 py-3 pr-14 text-white placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                disabled={isSubmitting}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-lg text-slate-300 transition hover:bg-slate-700 hover:text-sky-300 disabled:opacity-50"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(event) => setShowPassword(event.target.checked)}
              disabled={isSubmitting}
              className="accent-sky-400"
            />
            Show password
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-sky-400 px-5 py-3 font-bold text-slate-950 shadow-lg transition duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-sky-300 hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] active:scale-95 disabled:cursor-not-allowed disabled:translate-y-0 disabled:scale-100 disabled:opacity-60"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-300">
          Don't have an account?{" "}
          <NavLink
            to="/register"
            className="font-semibold text-sky-400 transition hover:text-sky-300 hover:underline"
          >
            Create Account
          </NavLink>
        </p>
      </div>
    </main>
  );
};

export default Login;
