import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../src/lib/auth-context";

export default function ProtectedRoute({ children }) {
  const auth = useAuth();
  if (!auth?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
