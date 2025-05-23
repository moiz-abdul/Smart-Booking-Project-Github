import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import "./superAdminlogin.css";
// Make sure this path is correct relative to your component file
import loginBackground from '../../Assets/images/loginbackground.png';

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Add console log to verify the image path is correct
    console.log("Background image path:", loginBackground);
    
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        const status = error.response?.status;

        if ((status === 401 || status === 403) && window.location.pathname.startsWith("/admin")) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/admin/login";
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor); 
    };
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const adminloginResponse = await axios.post("http://localhost:5000/api/admin/auth/superadmin/login", {
        username,
        password,
      });

      if (adminloginResponse.data.success) {
        localStorage.setItem("token", adminloginResponse.data.token);
        localStorage.setItem("user", JSON.stringify(adminloginResponse.data.user));

        // Set up axios default headers for subsequent requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${adminloginResponse.data.token}`;

        navigate("/registeradmin/usermanagement");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setErrorMessage("Invalid Username or Password!");
      } else {
        console.error("Error During Login:", err.response || err);
        setErrorMessage("An error occurred! Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="register-containeradmin">
      <div
        className="register-background"
        style={{
          backgroundImage: `url(${loginBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 1 // Increased from 0.7 to make it more visible
        }}
      ></div>

      {/* Go Back Button */}
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
            <h4 className="text-center mb-4 admintext animate__animated animate__fadeIn">Admin Secure Login</h4>

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

            <button
              type="submit"
              className="btn btn-primary w-100 mt-3 login-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}