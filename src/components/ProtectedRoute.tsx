// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
