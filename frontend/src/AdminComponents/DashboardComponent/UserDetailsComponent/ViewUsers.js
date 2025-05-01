import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import axios from 'axios';
import './ViewUsers.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-toggle/css/bootstrap-toggle.min.css";
import "bootstrap-toggle/js/bootstrap-toggle.min";
import CreateUserModal from "../../CreateUserModal/createuser";

// Set up axios interceptor for global error handling
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [IsCreateUserOpenModal, SetIsCreateUserOpenModal] = useState(false);
  const navigate = useNavigate();

  const OpenCreateUserModal = () => SetIsCreateUserOpenModal(true);
  const CloseCreateUserModal = () => SetIsCreateUserOpenModal(false);

  const HandleSaveCrateUser = () => {
    console.log('Create User Data Saved');
    CloseCreateUserModal();
  }

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    if (!token || !user) {
      navigate("/admin/login");
      return;
    }
    
    // Set authorization header for all subsequent requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Fetch users data
    const FetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        console.log("Api response is: ", response.data);
        setUsers(response.data.data);
      } catch (err) {
        console.error('Error Fetching Data of Users:', err);
      }
    };

    FetchUsers();
  }, [navigate]);

  // Toggle user status
  const handleToggle = (userId, currentStatus) => {
    const newStatus = currentStatus === 'on' ? 'off' : 'on';

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );

    axios.put(`http://localhost:5000/api/update/${userId}`, { status: newStatus })
      .then(response => console.log("Status updated in backend"))
      .catch(err => console.error("Error updating user status in backend", err));
  };

  return (
    <div className="container">
      <div className="row align-items-center" style={{ marginTop: "20px" }}>
        <div className="col-md-6">
          <h1 style={{ textAlign: "left" }}>Administrators</h1>
        </div>
        <div className="col-md-6 text-end">
          <Link style={{ textDecoration: "none", marginRight: "10px" }} to="#">
            <button className="btn btn-success" type="button" onClick={OpenCreateUserModal}>
              Add User
            </button>
          </Link>
        </div>
      </div>
      <p className="container" style={{ textAlign: "left", marginTop: "10px", fontSize: "18px" }}>
        <b>Total Admin Users:</b> {users.length}
      </p>

      <table className="table table-bordered container" style={{ marginBottom: '80px', marginTop: '40px' }}>
        {/* Table content remains the same */}
      </table>

      <CreateUserModal
        show={IsCreateUserOpenModal}
        onClose={CloseCreateUserModal}
        onSave={HandleSaveCrateUser}
        title='Create User'
      />
    </div>
  );
};

export default AdminDashboard;