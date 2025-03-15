import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    alert("로그인이 필요합니다.");
    return <Navigate to="/register" />;
  }

  return children;
};

export default ProtectedRoute;