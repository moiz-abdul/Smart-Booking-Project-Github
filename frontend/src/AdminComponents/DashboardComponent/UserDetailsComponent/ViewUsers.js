import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewUsers.css';


axios.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Clear localStorage and redirect to login on token expiration or unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

const UsersPerPage = 10;

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Setup axios token header on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('http://localhost:5000/api/adminside/adminusermanagement')
      .then(res => {
        if (res.data.success) {
          setUsers(res.data.users);
        } else {
          setError("Failed to load users.");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("API Error:", err);
        setError("Something went wrong.");
        setLoading(false);
      });
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await axios.put('http://localhost:5000/api/update/update-role', {
        user_id: userId,
        role: newRole
      });

      if (response.data.success) {
        alert("Role updated successfully.");
        fetchUsers();
      } else {
        alert("Failed to update role.");
      }
    } catch (err) {
      console.error("Role update error:", err);
      alert("Error updating role.");
    }
  };

  const indexOfLastUser = currentPage * UsersPerPage;
  const indexOfFirstUser = indexOfLastUser - UsersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / UsersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const maskEmail = (email) => {
    if (!email) return '';
    const [name, domain] = email.split('@');
    const masked = name[0] + '*'.repeat(name.length - 2) + name.slice(-1);
    return `${masked}@${domain}`;
  };

  const maskPhone = (phone) => {
    if (!phone) return '';
    return phone.slice(0, 2) + '*****' + phone.slice(-2);
  };

  return (
    <div className="admin-user-management">
      <div className="header-section">
        <div className="title-container">
        <span className="header-icon admin-icon">👨‍💼</span>
          <h2 className="page-title">Admin User Management</h2>
        </div>
      </div>

      {loading && <div className="loading-spinner"><div className="spinner"></div></div>}
      {error && <div className="error-message">
        <span className="error-icon">⚠️</span>
        <span className="error-text">{error}</span>
      </div>}

      {!loading && !error && (
        <>
          <div className="table-card">
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Email (Masked)</th>
                    <th>Phone (Masked)</th>
                    <th>Current Role</th>
                    <th>Assign Permission</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="no-users text-center">
                        <div className="empty-state">
                          <div className="empty-icon">👤</div>
                          <h3 className="empty-title">No users found</h3>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentUsers.map((user, index) => (
                      <tr key={user.id}>
                        <td>{indexOfFirstUser + index + 1}</td>
                        <td>
                          <div className="user-info">
                            <div className="avatar">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="user-details">
                              <span className="user-name">{user.username}</span>
                            </div>
                          </div>
                        </td>
                        <td className="user-email">{maskEmail(user.email)}</td>
                        <td>{maskPhone(user.phone)}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            <span className="role-icon">
                              {user.role === 'admin' ? '👑' : 
                               user.role === 'provider' ? '🛠️' : '👤'}
                            </span>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="form-select"
                          >
                            <option value="customer">Select Option</option>
                            <option value="customer">Customer</option>
                            <option value="provider">Provider</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="pagination-container">
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminUserManagement;