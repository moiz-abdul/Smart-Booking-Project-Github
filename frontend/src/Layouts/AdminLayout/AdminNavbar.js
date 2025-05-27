import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState('Admin');

  // Get admin username from localStorage
  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("user"));
    if (admin?.username) {
      setUsername(admin.username);
    }
  }, []);

  const handleLogout = () => {
    console.log("Admin logged out");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate('/admin/login');
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (dropdownOpen) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="navbar1">
      <div className="logo">
        <h1>Admin Panel</h1>
      </div>

      <div className="actions-container">
        {/* 👋 Welcome Dropdown */}
        <div className="dropdownadmin">
          <button
            className="dropdownbuttonadmin"
            type="button"
            onClick={toggleDropdown}
          >
            Hi Welcome, {username}
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;