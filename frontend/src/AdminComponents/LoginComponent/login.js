import { useNavigate} from "react-router-dom";
import { useState } from "react";
import axios from 'axios';
import "./superAdminlogin.css";

export default function AdminLogin()
{
    const [username, setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();


    const submitForm = async () => {
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
          
          navigate("/registeradmins/users");
        }
      }
          catch(err)
          {
            if( err.response && err.response.status === 401)
            {
              setErrorMessage("Invalid Username and Password !");
            }
            else{
            console.error("Error During Login:", err.response || err);
            setErrorMessage("An error Occured! Please try again Later.");
          }
        }
      };

  return (
    <div className="login-container">
     
      <div className="row justify-content-center">
        <img
          src="/assets/images/logo.png"
          alt="Organization Logo"
          className="logo"
        />
      </div>

     
      <div className="row justify-content-center">
        <h2 className="cms-heading">Content Management System</h2>
      </div>

    
      <div className="row justify-content-center">
        <h3 className="nac-heading">PMD IT Unit</h3>
      </div>

      <div className="row justify-content-center">
        <div className="login-form">
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          <form>
          <h4> Admin Secure Login</h4>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setUsername(e.target.value)}
                id="username"
                placeholder="Enter your Username"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                placeholder="Enter your password"
              />
            </div>
            <div className="d-flex align-items-center">
              <button
                type="button"
                onClick={submitForm}
                className="btn btn-success btn-md me-3 mb-4 "
              >
                Login
              </button>
            </div>
            <button className="btn btn-outline-secondary w-100">
                Forgot Password
              </button>
          </form>
        </div>
      </div>
    </div>
  );
}




