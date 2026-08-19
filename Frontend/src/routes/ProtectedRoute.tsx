import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const { accessToken, loading } = useAuth();

  if (loading) return null;

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;