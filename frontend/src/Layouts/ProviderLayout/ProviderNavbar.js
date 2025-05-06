import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Bell } from 'lucide-react'; // Import Bell icon
import './ProviderNavbar.css';
import axios from 'axios';

const ProviderNavbar = ({ username }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileExists, setProfileExists] = useState(false);
    const [profileData, setProfileData] = useState({
        business_name: '',
        email: '',
        phone: '',
        address: '',
        description: '',
        user_id: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    // Notification state
    const [notificationCount, setNotificationCount] = useState(2); // Example count
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null); // Reference for notification area

    // Fetch user data from localStorage
    const fetchUserData = () => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            setProfileData(prev => ({
                ...prev,
                user_id: userData.id || ''
            }));
        }
    };

    // Check profile when user_id is available
    const checkProfileExists = async () => {
        if (!profileData.user_id) return;

        try {
            const response = await axios.get(`http://localhost:5000/api/providerprofile/${profileData.user_id}`);
            if (response.data.success) {
                setProfileExists(true);
                setProfileData(prev => ({
                    ...prev,
                    ...response.data.profile
                }));
            }
        } catch (error) {
            console.error("Error checking profile:", error);
            setError('Failed to check profile. Please try again.');
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (profileData.user_id) {
            checkProfileExists();
        }
    }, [profileData.user_id]);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const payload = {
                ...profileData
            };

            const response = await axios.post(
                'http://localhost:5000/api/providerprofile',
                payload
            );

            if (response.data.success) {
                setProfileExists(true);
                setShowProfileModal(false);
                alert(response.data.message);
            } else {
                setError(response.data.message || "Failed to save profile");
            }
        } catch (error) {
            console.error("Error:", error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to save profile. Please try again.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleDropdown = (e) => {
        e.stopPropagation(); // Prevent event bubbling
        setDropdownOpen(!dropdownOpen);
    };

    const handleProfileClick = (e) => {
        e.stopPropagation(); // Prevent event bubbling
        setShowProfileModal(true);
        setDropdownOpen(false); // Close dropdown after selection
    };

    const onLogout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
        navigate("/login");
    };
    
    // Toggle notifications
    const toggleNotifications = (e) => {
        e.stopPropagation(); // Prevent event bubbling
        setShowNotifications(!showNotifications);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (dropdownOpen) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [dropdownOpen]);
    
    // Close notifications when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        // Add event listener when dropdown is open
        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Clean up the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications]);

    return (
        <nav className="navbar-green1">
            <span className="navbar-brand">Service Provider Panel</span>
            <div className="container-fluid">

                <div className="navbar-collapse">
                    
                    <div className="navbar-buttons">
                        {/* Notification Bell */}
                        <div ref={notificationRef} className="notification-container">
                            <div className="notification-button" onClick={toggleNotifications}>
                            <Bell size={20} color="black" />
                                {notificationCount > 0 && (
                                    <span className="notification-badge">{notificationCount}</span>
                                )}
                            </div>
                            {showNotifications && (
                                <div className="notifications-dropdown">
                                    <div className="notification-header">
                                        <span>Notifications</span>
                                    </div>
                                    <div className="notification-item">
                                        <p>New booking request received</p>
                                    </div>
                                    <div className="notification-item">
                                        <p>Customer left a review for your service</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="dropdownprovider">
                            <button
                                className="dropdownbuttonprovider"
                                type="button"
                                onClick={toggleDropdown}
                            >
                                Hi Welcome, {username}
                            </button>
                            {dropdownOpen && (
                                <div className="dropdown-menu">
                                    {!profileExists ? (
                                        <button
                                            className="dropdown-item"
                                            onClick={handleProfileClick}
                                        >
                                            Add Profile Info
                                        </button>
                                    ) : (
                                        <button
                                            className="dropdown-item"
                                            onClick={handleProfileClick}
                                        >
                                            Edit Profile Info
                                        </button>
                                    )}
                                    <button className="dropdown-item" onClick={onLogout}>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Modal */}
            {showProfileModal && (
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {profileExists ? 'Edit Profile' : 'Add Profile'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowProfileModal(false)}
                                    aria-label="Close"
                                >
                                    &times;
                                </button>
                            </div>
                            <div className="modal-body">
                                {error && <div className="alert alert-danger">{error}</div>}
                                <form onSubmit={handleSaveProfile}>
                                    <input type="hidden" name="user_id" value={profileData.user_id} />

                                    <div className="form-group">
                                        <label className="form-label">Business Name *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="business_name"
                                            value={profileData.business_name}
                                            onChange={(e) => setProfileData({ ...profileData, business_name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email *</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Phone *</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Address *</label>
                                        <textarea
                                            className="form-control"
                                            name="address"
                                            rows={2}
                                            value={profileData.address}
                                            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            name="description"
                                            rows={3}
                                            value={profileData.description}
                                            onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setShowProfileModal(false)}
                                        >
                                            Close
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Saving...' : 'Save Profile'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default ProviderNavbar;