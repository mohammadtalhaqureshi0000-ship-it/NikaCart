
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { currentUser, loading } = useSelector(
    (state) => state.auth
  );

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-sky-200 border-t-sky-500" />

          <p className="font-semibold text-slate-700">
            Loading NikaCart...
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser || currentUser.isBlocked) {
    return <Navigate to="/welcome" replace />;
  }

  if (currentUser.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;