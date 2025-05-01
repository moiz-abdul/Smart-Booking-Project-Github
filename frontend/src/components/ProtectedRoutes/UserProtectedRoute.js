import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CustomerProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("userToken");
    const userData = localStorage.getItem("userData");

    useEffect(() => {
        if (!token || !userData) {
            navigate("/login");
        }
    }, [token, userData, navigate]);

    return token && userData ? children : null;
};

export default CustomerProtectedRoute;