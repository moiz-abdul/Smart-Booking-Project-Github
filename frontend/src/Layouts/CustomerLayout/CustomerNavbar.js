import { Bell } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CustomerNavbar.css';

const Header = () => {
  
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0); // track visible notification badge count
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('Guest');
  const [dropdownOpen, setDropdownOpen] = useState(false);


 // Fetch latest notifications
// Fetch latest notifications (updated version)
const fetchNotifications = async (id) => {
  try {
    // Get last read time from storage (default to ancient date if not set)
    const lastRead = localStorage.getItem('lastNotificationsRead') || '1970-01-01T00:00:00Z';

    const { data } = await axios.get(
      `http://localhost:5000/api/customerbookingdetails/notifications`,
      {
        params: { 
          user_id: id,
          since: lastRead // Send last read timestamp to backend
        }
      }
    );

    if (data?.success) {
      setNotifications(data.data);
      // Only count unread notifications (those newer than lastRead)
      const unreadCount = data.data.filter(notif => 
        new Date(notif.created_at) > new Date(lastRead)
      ).length;
      setNotificationCount(unreadCount);
    }
  } catch (err) {
    console.error("Error fetching notifications:", err);
  }
};

// REPLACE the entire useEffect with this:
useEffect(() => {
  const user = JSON.parse(localStorage.getItem("userData"));
  if (user?.id) {
    setUserId(user.id);
    setUsername(user.username || 'Guest');
    
    // Initial fetch + start polling
    fetchNotifications(user.id); // Uses the existing function
    const interval = setInterval(() => fetchNotifications(user.id), 10000); // Poll every 10s
    
    return () => clearInterval(interval); // Cleanup
  }
}, []);

 
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

  // Close dropdown if clicked outside for Navbar 
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(false);
    };
    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Toggle dropdown and mark notifications as seen
// Toggle notifications dropdown (updated)
const toggleNotifications = () => {
  const willShow = !showNotifications;
  setShowNotifications(willShow);

  if (willShow) {
    // When dropdown opens:
    // 1. Reset badge count
    setNotificationCount(0);
    // 2. Store current time as last read moment
    localStorage.setItem('lastNotificationsRead', new Date().toISOString());
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
            {/* Show count badge only if > 0 */}
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

        {/* Welcome Dropdown */}
<div className="dropdowncontainer">
  <button
    className="dropdownbutton"
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      setDropdownOpen(!dropdownOpen);
    }}
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

export default Header;