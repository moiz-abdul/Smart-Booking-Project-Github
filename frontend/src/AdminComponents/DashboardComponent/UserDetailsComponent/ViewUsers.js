import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const UsersPerPage = 10;

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
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
    <div className="container mt-5">
      <h2 className="mb-4">Admin User Management</h2>

      {loading && <div>Loading users...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
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
                    <td colSpan="6" className="text-center">No users found.</td>
                  </tr>
                ) : (
                  currentUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td>{indexOfFirstUser + index + 1}</td>
                      <td>{user.username}</td>
                      <td>{maskEmail(user.email)}</td>
                      <td>{maskPhone(user.phone)}</td>
                      <td>{user.role}</td>
                      <td>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="form-select"
                        > <option value="customer">Select Option</option>
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

          {totalPages > 1 && (
            <div className="pagination justify-content-center">
              <ul className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminUserManagement;