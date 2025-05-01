import React from "react";
import './UserNavbar.css';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const UserNavbar = ({ activeTab, setActiveTab }) =>
{
    const navigate = useNavigate();
    return(

        <header className="navbar">
      <div className="logo">
        <h1>SmartBook</h1>
      </div>
      <div className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === 'customer' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('customer')}
        >
          Customer
        </button>
        <button
          className={`nav-tab ${activeTab === 'provider' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('provider')}
        >
          Service Provider
        </button>
      </div>
      <div className="nav-buttons">
      <Link style={{ textDecoration: "none", marginRight: "10px" }} to="/login">
        <button className="login-btn" onClick={() => navigate('/customerlogin')}>
          <FaSignInAlt /> Login
        </button>
        </Link>
        <Link style={{ textDecoration: "none", marginRight: "10px" }} to="/register">
        <button className="signup-btn" onClick={() => navigate('/customersignup')}>
          <FaUserPlus /> Signup
        </button>
        </Link>
      </div>
    </header>
    );
};
export default UserNavbar;