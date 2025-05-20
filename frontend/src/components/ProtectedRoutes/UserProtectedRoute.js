import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode } from "jwt-decode";

const CustomerProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  const userData = localStorage.getItem("userData");

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000); // current time in seconds
      return decoded.exp < now;
    } catch (err) {
      return true; // consider invalid token as expired
    }
  };

  useEffect(() => {
    if (!token || !userData || isTokenExpired(token)) {
      localStorage.clear();  // also clears "userData", "booking_service_id", etc.
      navigate("/login");
    }
  }, [token, userData, navigate]);

  return token && userData && !isTokenExpired(token) ? children : null;
};

export default CustomerProtectedRoute;