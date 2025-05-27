import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import "./userlogin.css";
import loginBackground from '../../Assets/images/loginbackground.png';

// Create a separate axios instance for user login to avoid global interceptors
const userLoginAxios = axios.create();

export default function RoleBasedLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmittinguserlogin, setIsSubmittinguserlogin] = useState(false);
    const navigate = useNavigate();
 
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const submitForm = async (e) => {
        e.preventDefault();
        setIsSubmittinguserlogin(true);
        
        if (!role) {
            setErrorMessage("Please select a role");
            setIsSubmittinguserlogin(false);
            return;
        }
        try {
            const loginResponse = await userLoginAxios.post("http://localhost:5000/api/auth/login", {
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
        
                // Set a timeout before redirecting to ensure any UI updates are visible
                setTimeout(() => {
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
                    
                    // Reset the submission state after redirect
                    setIsSubmittinguserlogin(false);
                }, 1000); // Small delay before redirect on success
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                // Show error message
                setErrorMessage("Invalid Username and Password!");
                // Reset submission state immediately
                setIsSubmittinguserlogin(false);
                
                // Clear error message after 3.5 seconds
                setTimeout(() => {
                    setErrorMessage("");
                }, 3500);
            } else {
                console.error("Error During Login:", err.response || err);
                setErrorMessage("An unexpected error occurred. Please try again.");
                // Reset submission state immediately
                setIsSubmittinguserlogin(false);
                
                // Clear error message after 3.5 seconds
                setTimeout(() => {
                    setErrorMessage("");
                }, 3500);
            }
        }
    }; 

    const handleGoBack = () => {
        localStorage.removeItem('booking_service_id');  
                if (window.history.length > 2) {
                navigate(-2);
                } else {
                navigate('/');
                }
            };

    return (
        <div className="register-containerlogin">
            <div
                className="register-background"
                style={{
                    backgroundImage: `url(${loginBackground})`,
                }}
            ></div>

            <button
                type="button"
                className="btn btn-outline-secondary position-absolute top-0 start-0 m-3 back-button"
                onClick={handleGoBack}
                style={{ zIndex: 1000 }}
            >
                <i className="bi bi-arrow-left me-2"></i>Go Back
            </button>

            <div className="register-wrapper">
                <div className="register-form-container">
                    <form onSubmit={submitForm} className="register-form">
                        <h4 className="text-center mb-4 animate__animated animate__fadeIn">Secure Login</h4>

                        {errorMessage && (
                            <div className="alert alert-danger animate__animated animate__shakeX">
                                {errorMessage}
                            </div>
                        )}

                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-control animate__animated animate__fadeIn"
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
                                <div className="password-input-container">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-control animate__animated animate__fadeIn"
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        id="password"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={togglePasswordVisibility}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash className="eye-icon animate__animated animate__fadeIn" />
                                        ) : (
                                            <FaEye className="eye-icon animate__animated animate__fadeIn" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <label className="form-label">Role</label>
                                <div className="d-flex gap-3">
                                    <div className="form-check animate__animated animate__fadeIn">
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
                                    <div className="form-check animate__animated animate__fadeIn">
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

                        <button 
                            type="submit" 
                            className="btn btn-primary w-100 mt-3 login-button"
                            disabled={isSubmittinguserlogin}
                        >
                            {isSubmittinguserlogin ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Logging in...
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>

                        <div className="text-center mt-3 register-link-container animate__animated animate__fadeIn">
                            <p className="mb-2">Don't Have an Account?</p>
                            <a 
                                href="/register" 
                                className="btn btn-outline-primary w-100 register-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/register');
                                }}
                            >
                                Register
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}