// NotificationDropdown.js
import React, { useState, useEffect } from 'react';
import './notificationdropdown.css';

const NotificationDropdown = ({ userId }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch latest 3 notifications from backend using userId
    fetch(`/api/notifications/latest/${userId}`)
      .then(res => res.json())
      .then(data => setNotifications(data));
  }, [userId]);

  return (
    <div className="notification-container">
      <button onClick={() => setShowDropdown(!showDropdown)}>🔔</button>
      {showDropdown && (
        <div className="notification-dropdown">
          {notifications.length > 0 ? (
            notifications.map((n, i) => (
              <div key={i} className="notification-item">
                {n.message}
              </div>
            ))
          ) : (
            <div>No notifications</div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
