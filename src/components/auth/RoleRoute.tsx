import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import ProtectedRoute from "./ProtectedRoute";

const RoleRoute = ({ role, children }: { role: string; children: ReactNode }) => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  return (
    <ProtectedRoute>
      {user?.roles.includes(role) ? children : <Navigate to="/dashboard" replace state={{ deniedFrom: location.pathname }} />}
    </ProtectedRoute>
  );
};

export default RoleRoute;
