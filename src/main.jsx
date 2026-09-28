
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.jsx";
import store from "./app/store.js";

import { initializeAuth } from "./supabase/authListener.js";

// Initialize Supabase authentication once at application startup.
initializeAuth();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            background: "#1f2937",
            color: "#ffffff",
            borderRadius: "12px",
            padding: "12px 16px",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </Provider>
  </StrictMode>
);