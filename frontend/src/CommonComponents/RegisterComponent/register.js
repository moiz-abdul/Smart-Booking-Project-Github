import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import './register.css';

export default function RoleBaseRegister() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [role, setRole] = useState("customer");
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        label: "",
        color: ""
    });
    const navigate = useNavigate();

    // Password strength checker
    const checkPasswordStrength = (password) => {
        let score = 0;

        // Length check
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;

        // Complexity checks
        if (/[A-Z]/.test(password)) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;

        // Determine strength
        let label = "";
        let color = "";

        if (score <= 2) {
            label = "Weak";
            color = "danger";
        } else if (score <= 4) {
            label = "Moderate";
            color = "warning";
        } else {
            label = "Strong";
            color = "success";
        }

        return { score, label, color };
    };

    // Password strength and validation effect
    useEffect(() => {
        if (password) {
            const strength = checkPasswordStrength(password);
            setPasswordStrength(strength);
        }
    }, [password]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Password matching check
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match!");
            return;
        }

        // Password strength check
        if (passwordStrength.score <= 2) {
            setErrorMessage("Password is too weak. Please choose a stronger password.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/users/user/register', {
                username,
                email,
                password,
                phoneNumber,
                role
            });

            alert("Registered Successfully!");
            navigate("/login");
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Registration failed!");
        }
    };

    const handleGoBack = () => {
        if (window.history.length > 2) {
            navigate(-2);
        } else {
            navigate('/'); // Fallback to home page
        }
    };

    return (
        <div className="register-container">
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
                {/* Go Back Button - Positioned Absolutely */}


                <div className="register-form-container">
                    <form onSubmit={handleSubmit} className="register-form">
                        <h4 className="text-center mb-4">Register Account</h4>

                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    id="email"
                                    placeholder="Enter Email"
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    onChange={(e) => setUsername(e.target.value)}
                                    value={username}
                                    id="username"
                                    placeholder="Enter Username"
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    value={phoneNumber}
                                    id="phoneNumber"
                                    placeholder="Enter Phone Number"
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    id="password"
                                    placeholder="Enter password"
                                    required
                                />
                                {password && (
                                    <div className="password-strength-container mt-2">
                                        <div
                                            className={`password-strength-bar bg-${passwordStrength.color}`}
                                            style={{
                                                width: `${passwordStrength.score * 17}%`,
                                                height: '5px',
                                                transition: 'width 0.5s ease-in-out'
                                            }}
                                        ></div>
                                        <small className={`text-${passwordStrength.color}`}>
                                            {passwordStrength.label} Password
                                        </small>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="confirmpassword" className="form-label">Confirm Password</label>
                                <input
                                    type="password"
                                    className={`form-control ${confirmPassword && password !== confirmPassword
                                        ? 'is-invalid'
                                        : confirmPassword
                                            ? 'is-valid'
                                            : ''
                                        }`}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    value={confirmPassword}
                                    id="confirmpassword"
                                    placeholder="Confirm password"
                                    required
                                />
                                {confirmPassword && password !== confirmPassword && (
                                    <div className="invalid-feedback">
                                        Passwords do not match
                                    </div>
                                )}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Register as</label>
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

                        <button type="submit" className="btn btn-primary w-100 mt-3">Register</button>
                    </form>
                </div>
            </div>
        </div>
    );
}