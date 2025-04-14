import { Navigate } from "react-router-dom";
import { useAuth } from "./context/authContext";

const ProtectedRoute = ({ element, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/ebook" replace />;
  }

  return element;
};

export default ProtectedRoute;
