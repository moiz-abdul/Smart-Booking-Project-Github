import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import "./ProviderNavbar.css";
import axios from "axios";

const ProviderNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [profileData, setProfileData] = useState({
    business_name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    user_id: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("Guest");
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigate = useNavigate();
  const notificationRef = useRef(null);

  // Fetch provider data and username
useEffect(() => {
  const storedUserData = localStorage.getItem("userData");
  if (storedUserData) {
    const user = JSON.parse(storedUserData);
    setUsername(user.username || "Guest");
    setProfileData((prev) => ({ ...prev, user_id: user.id || "" }));

    // Initial fetch + start polling
    getProviderNotifications(user.id); // Uses existing function
    const interval = setInterval(() => getProviderNotifications(user.id), 10000); // Poll every 10s
    
    return () => clearInterval(interval); // Cleanup
  }
}, []);

  // Check if profile exists
  useEffect(() => {
    if (profileData.user_id) {
      checkProfileExists();
    }
  }, [profileData.user_id]);

  const checkProfileExists = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/providerprofile/${profileData.user_id}`
      );
      if (response.data.success) {
        setProfileExists(true);
        setProfileData((prev) => ({
          ...prev,
          ...response.data.profile,
        }));
      }
    } catch (error) {
      console.error("Error checking profile:", error);
      setError("Failed to check profile. Please try again.");
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = { ...profileData };
      const response = await axios.post(
        "http://localhost:5000/api/providerprofile",
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
      setError("Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    navigate("/");
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    setShowProfileModal(true);
    setDropdownOpen(false);
  };

// Toggle notifications dropdown (updated)
const toggleNotifications = (e) => {
  e.stopPropagation();
  const willShow = !showNotifications;
  setShowNotifications(willShow);

  if (willShow) {
    // When dropdown opens:
    // 1. Reset badge count
    setNotificationCount(0);
    // 2. Store current time as last read moment
    localStorage.setItem('lastProviderNotificationsRead', new Date().toISOString());
  }
};

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (dropdownOpen) setDropdownOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Close notifications if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  // Get Notifications from API
const getProviderNotifications = async (userId) => {
  try {
    // Get last read time from storage
    const lastRead = localStorage.getItem('lastProviderNotificationsRead') || '1970-01-01T00:00:00Z';

    const response = await axios.get(
      "http://localhost:5000/api/providerbookingdetails/providernotification",
      {
        params: { 
          user_id: userId,
          since: lastRead // Send last read timestamp to backend
        }
      }
    );

    if (response.data?.success) {
      setNotifications(response.data.data);
      // Only count unread notifications
      const unreadCount = response.data.data.filter(notif => 
        new Date(notif.created_at) > new Date(lastRead)
      ).length;
      setNotificationCount(unreadCount);
    }
  } catch (err) {
    console.error("Provider Notification Error:", err);
  }
};

  const formatNotificationText = (item) => {
    const status = item.is_status.toLowerCase();
    const name = item.customer_name;
    const service = item.service_name;

    if (status === "cancel") {
      return `Customer ${name},Booking ${service} cancelled`;
    } else if (status === "pending") {
      return `Customer ${name} has sent you a request to accept Booking ${service}, Check Received Bookings Page`;
    }

    return "";
  };

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
                  <div className="notification-header">Notifications</div>
                  {notifications.length > 0 ? (
                    notifications.map((item, index) => (
                      <div className="notification-item" key={index}>
                        <p>{formatNotificationText(item)}</p>
                      </div>
                    ))
                  ) : (
                    <div className="notification-item">
                      <p>No new notifications</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/*  Welcome Dropdown */}
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
                  {profileExists ? "Edit Profile" : "Add Profile"}
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
                  <input
                    type="hidden"
                    name="user_id"
                    value={profileData.user_id}
                  />

                  <div className="form-group">
                    <label className="form-label">Business Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profileData.business_name}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          business_name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Address *</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          address: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={profileData.description}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          description: e.target.value,
                        })
                      }
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
                      {isSubmitting ? "Saving..." : "Save Profile"}
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