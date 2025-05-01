import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  useEffect(() => {
    if (!token || !user) {
      navigate("/admin/login");
    }
  }, [token, user, navigate]);

  return token && user ? children : null;
};

export default AdminProtectedRoute;