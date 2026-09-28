import React from "react";
import { useSelector } from "react-redux";
import { NavLink, Navigate } from "react-router-dom";

const Welcome = () => {
  const { currentUser, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-slate-300 via-sky-100 to-gray-400 px-4">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-sky-200 border-t-sky-500" />

          <p className="mt-5 font-semibold text-slate-700">
            Loading NikaCart...
          </p>
        </div>
      </main>
    );
  }

  if (currentUser && !currentUser.isBlocked) {
    return (
      <Navigate to={currentUser.role === "admin" ? "/admin" : "/"} replace />
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes sunDingDong {
            0%, 100% {
              transform: rotate(-12deg) scale(1);
            }

            50% {
              transform: rotate(12deg) scale(1.12);
            }
          }

          @keyframes floatShape {
            0%, 100% {
              translate: 0 0;
            }

            50% {
              translate: 0 -18px;
            }
          }

          @keyframes welcomeEntrance {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.95);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes titleGlow {
            0%, 100% {
              text-shadow: 0 0 5px rgba(56, 189, 248, 0.2);
            }

            50% {
              text-shadow: 0 0 22px rgba(56, 189, 248, 0.65);
            }
          }

          @keyframes lineGlow {
            0%, 100% {
              box-shadow: 0 0 5px rgba(56, 189, 248, 0.3);
              transform: scaleX(1);
            }

            50% {
              box-shadow: 0 0 20px rgba(56, 189, 248, 0.9);
              transform: scaleX(1.3);
            }
          }

          @keyframes buttonGlow {
            0%, 100% {
              box-shadow: 0 0 10px rgba(56, 189, 248, 0.2);
            }

            50% {
              box-shadow: 0 0 25px rgba(56, 189, 248, 0.55);
            }
          }

          .welcome-sun {
            display: inline-block;
            transform-origin: center bottom;
            animation: sunDingDong 2.5s ease-in-out infinite;
            transition: filter 0.3s ease;
          }

          .welcome-sun:hover {
            animation-duration: 0.6s;
            filter: drop-shadow(
              0 0 18px rgba(56, 189, 248, 0.9)
            );
          }

          .welcome-shape {
            animation: floatShape 5s ease-in-out infinite;
          }

          .welcome-shape:nth-child(even) {
            animation-delay: -2s;
          }

          .welcome-content {
            animation: welcomeEntrance 0.9s ease-out both;
          }

          .welcome-title {
            animation: titleGlow 3s ease-in-out infinite;
          }

          .welcome-line {
            animation: lineGlow 2.5s ease-in-out infinite;
          }

          .welcome-login {
            animation: buttonGlow 2.5s ease-in-out infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .welcome-sun,
            .welcome-shape,
            .welcome-content,
            .welcome-title,
            .welcome-line,
            .welcome-login {
              animation: none;
            }
          }
        `}
      </style>

      <main className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-slate-300 via-sky-100 to-gray-400 px-4 py-8">
        <div className="relative flex min-h-[550px] w-full max-w-5xl flex-col items-center justify-center overflow-hidden rounded-[30px] border border-sky-200 bg-gradient-to-br from-slate-800 via-slate-700 to-gray-700 px-6 py-12 text-center shadow-2xl sm:py-16">
          <div className="welcome-shape pointer-events-none absolute -left-16 top-10 h-56 w-28 rotate-[-20deg] rounded-full bg-sky-400" />

          <div className="welcome-shape pointer-events-none absolute -left-10 bottom-10 h-32 w-20 rotate-45 rounded-full bg-slate-400" />

          <div className="welcome-shape pointer-events-none absolute -right-16 top-16 h-44 w-28 rotate-[-25deg] rounded-full bg-sky-300" />

          <div className="welcome-shape pointer-events-none absolute -right-14 bottom-4 h-56 w-28 rotate-[-20deg] rounded-full bg-slate-400" />

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/10 blur-3xl" />

          <div className="welcome-content relative z-10 flex w-full max-w-md flex-col items-center">
            <div className="mb-5 text-7xl drop-shadow-lg">
              <span className="welcome-sun cursor-default">☀️</span>
            </div>

            <h1 className="welcome-title text-4xl font-black tracking-[0.15em] text-white sm:text-5xl">
              NIKA
              <span className="text-sky-400">CART</span>
            </h1>

            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 sm:text-sm">
              Your Adventure Starts Here
            </p>

            <div className="welcome-line my-9 h-px w-24 bg-sky-400" />

            <h2 className="mb-3 text-2xl font-bold text-white">
              Welcome to NikaCart
            </h2>

            <p className="mb-9 max-w-sm text-sm leading-6 text-slate-300">
              Discover anime-inspired fashion, accessories, and products made
              for your next adventure.
            </p>

            <div className="flex w-full flex-col gap-4">
              <NavLink
                to="/login"
                className="welcome-login rounded-xl bg-sky-400 px-6 py-3.5 text-base font-bold text-slate-950 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-sky-300 active:scale-95"
              >
                Login →
              </NavLink>

              <NavLink
                to="/register"
                className="rounded-xl border-2 border-sky-400 px-6 py-3.5 text-base font-bold text-sky-300 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-sky-400 hover:text-slate-950 hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] active:scale-95"
              >
                Create Account
              </NavLink>
            </div>

            <p className="mt-9 text-xs text-slate-300">
              ☀️ Set sail on your shopping adventure
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Welcome;
