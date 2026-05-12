import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router";
import { ReactNode } from "react";
import { appPaths } from "../data/paths";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
  redirectTo,
}: ProtectedRouteProps) {
  const { isLoggedIn, isAdmin } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect ke login dengan menyimpan location sebelumnya
    return (
      <Navigate
        to={redirectTo ?? (requireAdmin ? appPaths.adminLogin : appPaths.login)}
        state={{ from: location }}
        replace
      />
    );
  }

  if (requireAdmin && !isAdmin) {
    // Jika memerlukan admin tapi user bukan admin
    return <Navigate to={appPaths.dashboard} replace />;
  }

  return <>{children}</>;
}
