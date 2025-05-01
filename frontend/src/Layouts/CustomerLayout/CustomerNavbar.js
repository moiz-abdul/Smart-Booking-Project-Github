import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import './CustomerNavbar.css';

const CustomerNavbar = ({ username }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleNotifDropdown = () => {
        setNotifOpen(!notifOpen);
    };

    const onLogout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
        navigate("/login");
    };

    // Dummy notifications — replace this with API call later
    useEffect(() => {
        const dummyNotifications = [
            "Your booking has been confirmed.",
            "Provider declined your last booking.",
            "Reminder: Your service is scheduled today."
        ];
        setNotifications(dummyNotifications);
    }, []);

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-green">
                <span className="navbar-brand mb-0 h1 bg-warning">Customer Panel</span>
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
                            {/* Empty center links */}
                        </div>

                        <div className="navbar-buttons d-flex align-items-center gap-3">
                            {/* 🔔 Notification Bell */}
                            <div className="dropdown">
                                <button
                                    className="btn btn-outline-light position-relative"
                                    onClick={toggleNotifDropdown}
                                >
                                    🔔
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {notifications.length}
                                    </span>
                                </button>
                                {notifOpen && (
                                    <div className="dropdown-menu dropdown-menu-end show">
                                        {notifications.slice(0, 3).map((note, index) => (
                                            <span key={index} className="dropdown-item text-wrap">
                                                {note}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 👤 User Dropdown */}
                            <div className="dropdown">
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

            {/* Sidebar */}
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse">
                        <div className="position-sticky pt-3">
                            <ul className="nav flex-column">
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/customer/dashboard">
                                        Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/customer/confirm-bookings">
                                        Confirm Bookings
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/customer/cancel-bookings">
                                        Cancel Bookings
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/customer/complete-bookings">
                                        Complete Bookings
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Main content area */}
                    <div className="col-md-9 col-lg-10 ms-sm-auto px-md-4">
                        {/* Your existing dashboard content will go here */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomerNavbar;