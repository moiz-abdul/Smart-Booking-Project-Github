import { useNavigate , Link} from "react-router-dom";
import { useState } from "react";
import './AdminNavbar.css';

const AdminNavbar = ({ username }) => {
    const [dropdownOpen, SetdropdownOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        SetdropdownOpen(!dropdownOpen);
    };

    // Logout Function
    const onLogout = () => {
        navigate("/admin/login"); // Redirect to Admin login page
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-green">
            <span className="navbar-brand mb-0 h1 bg-warning">Admin Panel</span>
            <div className="container-fluid">
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav mx-auto">
                        <Link className="nav-link" to="/registeradmins/users">
                        Users
                        </Link>
                        <Link className="nav-link" to="/registeradmins/documentspage">
                        Documents
                        </Link>
                        <Link className="nav-link" to="/registeradmins/careerspage">
                        Careers
                        </Link>
                        
                    </div>
                    <div className="navbar-buttons d-flex">
                        <div className="dropdown">
                            {/* Display username */}
                            <button
                                className="btn btn-outline-light dropdown-toggle dropdownbutton"
                                type="button"
                                onClick={toggleDropdown}
                            >
                                Hi Welcome, {username}
                            </button>
                            {dropdownOpen && (
                                <div className="dropdown-menu dropdown-menu-end show">
                                    <button className="dropdown-item" onClick={onLogout}>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;





    {/*
    return(
            <nav className="navbar navbar-expand-lg navbar-green">
            <span class="navbar-brand mb-0 h1">Admin Panel</span>
    <div className='container-fluid' >
        <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
        >
        <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav mx-auto">
            <Link className="nav-link" to="/admin/dashboard">
            Users
            </Link>
            <button className='btn btn-link nav-link' onClick={OnCreateUserOpenModal}>
                Create User
            </button>



     This is a pages of Admin side Create users and Upload Documents 
            <Link className='nav-link' to="/admin/createuser">
            Create User
            </Link> 

            <Link className="nav-link" to="admin/uploaddocuments">
            Upload Documents
            </Link>




            <button className='btn btn-link nav-link' onClick={OnUploadDocumentOpenModal}>
                Upload Document
            </button>

        </div>
        <div className="navbar-buttons d-flex">
            <Link style={{ textDecoration: "none", marginRight: "10px" }} to="/admin/login">
            <button className="btn btn-outline-light" type="button">
                Login
            </button>
            </Link>
        </div>
        </div>
    </div>
    </nav>
    );

     */}


