import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthValid, setIsAuthValid] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    const isTokenExpired = (token) => {
      try {
        const decoded = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        return decoded.exp < now;
      } catch (err) {
        return true; // token is invalid or corrupted
      }
    };

    if (!token || !user || isTokenExpired(token)) {
      localStorage.clear();
      navigate("/admin/login");
    } else {
      setIsAuthValid(true);
    }
  }, [navigate]); // ✅ Removed token/user from dependency array to ensure it runs properly on mount

  return isAuthValid ? children : null;
};

export default AdminProtectedRoute;