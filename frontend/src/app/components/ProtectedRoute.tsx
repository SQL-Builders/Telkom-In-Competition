import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { isLoggedIn, isAdmin } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect ke login dengan menyimpan location sebelumnya
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (requireAdmin && !isAdmin) {
    // Jika memerlukan admin tapi user bukan admin
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}