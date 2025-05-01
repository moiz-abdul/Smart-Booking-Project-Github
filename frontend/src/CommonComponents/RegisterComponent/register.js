import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function RoleBaseRegister() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [role, setRole] = useState("customer");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setErrorMessage("Passwords do not match!");
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

    return (
        <div className="login-container admin-background-color">
            <div className="row justify-content-center">
                <img src="/assets/images/logo.png" alt="Organization Logo" className="logo" />
            </div>
            <div className="row justify-content-center">
                <h2 className="cms-heading">Content Management System</h2>
            </div>
            <div className="row justify-content-center">
                <h3 className="nac-heading">Smart Booking System</h3>
            </div>
            <div className="row justify-content-center">
                <div className="login-form">
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    <form onSubmit={handleSubmit}>
                        <h4>Register Account</h4>

                        <div className="mb-3">
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

                        <div className="mb-3">
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

                        <div className="mb-3">
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

                        <div className="mb-3">
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
                        </div>

                        <div className="mb-3">
                            <label htmlFor="confirmpassword" className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                value={confirmPassword}
                                id="confirmpassword"
                                placeholder="Confirm password"
                                required
                            />
                        </div>

                        <div className="mb-3">
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

                        <button type="submit" className="btn btn-primary w-100">Register</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
