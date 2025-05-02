import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
// Import your CSS file
import "./userlogin.css"; // Make sure this path is correct

export default function RoleBasedLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const submitForm = async () => {
        if (!role) {
            setErrorMessage("Please select a role");
            return;
        }

        try {
            const loginResponse = await axios.post("http://localhost:5000/api/auth/login", {
                username,
                password,
                role
            });

            if (loginResponse.data.success) {
                // Store token and user data
                localStorage.setItem("userToken", loginResponse.data.token);
                localStorage.setItem("userData", JSON.stringify(loginResponse.data.user));

                // Set default axios headers
                axios.defaults.headers.common['Authorization'] = `Bearer ${loginResponse.data.token}`;

                // Check if there's a pending booking
                const bookingServiceId = localStorage.getItem('booking_service_id');

                // Redirect based on role and booking status
                const userRole = loginResponse.data.user.role;
                if (userRole === "customer") {
                    if (bookingServiceId) {
                        navigate(`/booking-form`);
                    } else {
                        navigate("/CustomerDashboard/Dashboard");
                    }
                } else if (userRole === "provider") {
                    navigate("/provider/dashboard");
                }
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setErrorMessage("Invalid Username and Password !");
            } else {
                console.error("Error During Login:", err.response || err);
                setErrorMessage("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="signupwrapper">
            <div className="login-form">
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <h4>Secure Login</h4>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        onChange={(e) => setUsername(e.target.value)}
                        id="username"
                        placeholder="Enter your Username"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        onChange={(e) => setPassword(e.target.value)}
                        id="password"
                        placeholder="Enter your password"
                    />
                </div>
                {/* Role Selection */}
                <div className="mb-3">
                    <label className="form-label">Role</label>
                    <div className="role-toggle">
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="role"
                                id="customer"
                                value="customer"
                                onChange={(e) => setRole(e.target.value)}
                            />
                            <label className="form-check-label" htmlFor="customer">Customer</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="role"
                                id="provider"
                                value="provider"
                                onChange={(e) => setRole(e.target.value)}
                            />
                            <label className="form-check-label" htmlFor="provider">Service Provider</label>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={submitForm}
                    className="btn btn-success btn-md me-3 mb-4"
                >
                    Login
                </button>
                <p className="mt-2">
                    Don't Have an Account? <a href="/register">Register</a>
                </p>

                <button className="btn btn-outline-secondary w-100">Forgot Password</button>
            </div>
        </div>
    );
}