import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import './register.css';
import loginBackground from '../../Assets/images/loginbackground.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
            color = "#ff4757"; // Red
        } else if (score <= 4) {
            label = "Moderate";
            color = "#ffa502"; // Orange
        } else {
            label = "Strong";
            color = "#2ed573"; // Green
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
        setIsSubmitting(true);

        // Password matching check
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match!");
            setIsSubmitting(false);
            return;
        }

        // Password strength check
        if (passwordStrength.score <= 2) {
            setErrorMessage("Password is too weak. Please choose a stronger password.");
            setIsSubmitting(false);
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
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoBack = () => {
        if (window.history.length > 2) {
            navigate(-2);
        } else {
            navigate('/'); // Fallback to home page
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    useEffect(() => {
        const createParticles = () => {
            const container = document.querySelector('.register-container');
            if (!container) return;
            
            const particleCount = 20;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                // Random properties
                const size = Math.random() * 10 + 5;
                const posX = Math.random() * 100;
                const duration = Math.random() * 20 + 10;
                const delay = Math.random() * 10;
                
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${posX}%`;
                particle.style.animationDuration = `${duration}s`;
                particle.style.animationDelay = `${delay}s`;
                
                container.appendChild(particle);
            }
        };
        
        createParticles();
    }, []);

    return (
        <div className="register-containerregister">
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
                    <form onSubmit={handleSubmit} className="register-form">
                        <h4 className="text-center mb-4">Register Account</h4>

                        {errorMessage && (
                            <div className="alert alert-danger animate__animated animate__shakeX">
                                {errorMessage}
                            </div>
                        )}

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
                                <div className="password-input-container">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-control"
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        id="password"
                                        placeholder="Enter password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={togglePasswordVisibility}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash className="eye-icon" />
                                        ) : (
                                            <FaEye className="eye-icon" />
                                        )}
                                    </button>
                                </div>
                                {password && (
                                    <div className="password-strength-container mt-2">
                                        <div className="progress" style={{ height: '5px' }}>
                                            <div 
                                                className="progress-bar" 
                                                role="progressbar" 
                                                style={{ 
                                                    width: `${passwordStrength.score * 25}%`,
                                                    backgroundColor: passwordStrength.color,
                                                    transition: 'width 0.5s ease, background-color 0.5s ease'
                                                }}
                                            ></div>
                                        </div>
                                        <small style={{ color: passwordStrength.color }}>
                                            {passwordStrength.label} Password
                                        </small>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="confirmpassword" className="form-label">Confirm Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className={`form-control ${confirmPassword && password !== confirmPassword
                                            ? 'is-invalid'
                                            : confirmPassword && password === confirmPassword
                                                ? 'is-valid'
                                                : ''
                                            }`}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        value={confirmPassword}
                                        id="confirmpassword"
                                        placeholder="Confirm password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={toggleConfirmPasswordVisibility}
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmPassword ? (
                                            <FaEyeSlash className="eye-icon" />
                                        ) : (
                                            <FaEye className="eye-icon" />
                                        )}
                                    </button>
                                </div>
                                {confirmPassword && password !== confirmPassword && (
                                    <div className="invalid-feedback d-block">
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

                        <button 
                            type="submit" 
                            className="btn btn-primary w-100 mt-3 register-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Registering...
                                </>
                            ) : (
                                'Register'
                            )}
                        </button>

                        <div className="text-center mt-3 login-link-container">
                            <p className="mb-0">
                                Already have an account?{' '}
                                <a 
                                    href="/login" 
                                    className="login-link"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/login');
                                    }}
                                >
                                    Login here
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}