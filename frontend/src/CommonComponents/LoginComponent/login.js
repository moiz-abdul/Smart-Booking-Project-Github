import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./userlogin.css"; // Use the same CSS as register page

export default function RoleBasedLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const submitForm = async (e) => {
        e.preventDefault(); // Add preventDefault
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

    // New function to handle going back two pages
    const handleGoBack = () => {
        if (window.history.length > 2) {
            navigate(-2);
        } else {
            navigate('/'); // Fallback to home page
        }
    };


    return (
        <div className="register-container">
            {/* Go Back Button - Positioned Absolutely */}
            <button
                type="button"
                className="btn btn-outline-secondary position-absolute top-0 start-0 m-3"
                onClick={handleGoBack}
                style={{ zIndex: 1000 }} // Ensure it's above other elements
            >
                <i className="bi bi-arrow-left me-2"></i>Go Back
            </button>
            <div className="register-background"></div>
            <div className="register-wrapper">


                <div className="register-form-container">
                    <form onSubmit={submitForm} className="register-form">
                        <h4 className="text-center mb-4">Secure Login</h4>

                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    onChange={(e) => setUsername(e.target.value)}
                                    value={username}
                                    id="username"
                                    placeholder="Enter your Username"
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    id="password"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <label className="form-label">Role</label>
                                <div className="d-flex gap-3">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="role"
                                            id="customer"
                                            value="customer"
                                            checked={role === "customer"}
                                            onChange={(e) => setRole(e.target.value)}
                                            required
                                        />
                                        <label className="form-check-label" htmlFor="customer">Customer</label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="role"
                                            id="provider"
                                            value="provider"
                                            checked={role === "provider"}
                                            onChange={(e) => setRole(e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="provider">Service Provider</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-100 mt-3">Login</button>

                        <div className="text-center mt-3">
                            <p className="mb-2">Don't Have an Account?</p>
                            <a href="/register" className="btn btn-outline-primary w-100">Register</a>
                        </div>


                    </form>
                </div>
            </div>
        </div>
    );
}