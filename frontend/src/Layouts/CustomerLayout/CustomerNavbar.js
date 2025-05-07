import { Bell } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CustomerNavbar.css';

const Header = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0); // ✅ track visible notification badge count
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [userId, setUserId] = useState(null);

  // Get user and fetch notifications on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (user?.id) {
      setUserId(user.id);
      fetchNotifications(user.id);
    }
  }, []);

  // Fetch latest notifications
  const fetchNotifications = async (id) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/customerbookingdetails/notifications`, {
        params: { user_id: id }
      });

      if (data?.success) {
        setNotifications(data.data);
        setNotificationCount(data.data.length); // ✅ set initial count
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // Hide dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  // ✅ Toggle dropdown and mark notifications as seen
  const toggleNotifications = () => {
    const willShow = !showNotifications;
    setShowNotifications(willShow);

    // ✅ Mark as read = reset counter
    if (willShow) {
      setNotificationCount(0);
    }
  };

  // Format notification message
  const formattedMessage = (item) => {
    const status = item.is_status.toLowerCase();
  
    let message = `Service Provider ${item.provider_name} has ${status} your Booking ${item.service_title}`;
  
    if (status === 'cancel') {
      message += ', Your payment has Refunded';
    }

    if (status === 'completed') {
      message += ', Add reviews from Complete Bookings Page';
    }
  
  
    return message;
  };
  // Logout logic
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    navigate('/');
  };

  return (
    <header className="navbar1">
      <div className="logo">
        <h1>Customer Dashboard</h1>
      </div>
      <div className="actions-container">
        <div className="notification-container" ref={notificationRef}>
          <div className="notification-button" onClick={toggleNotifications}>
            <Bell size={20} />
            {/* ✅ Show count badge only if > 0 */}
            {notificationCount > 0 && (
              <span className="notification-badge">{notificationCount}</span>
            )}
          </div>

          {showNotifications && (
            <div className="notifications-dropdown">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <div className="notification-item" key={index}>
                    <p>{formattedMessage(notification)}</p>
                  </div>
                ))
              ) : (
                <div className="notification-item">
                  <p>No notifications</p>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;