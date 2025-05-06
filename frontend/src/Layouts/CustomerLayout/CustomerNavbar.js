import { useNavigate } from 'react-router-dom';  // Correct import for the hook
import { Bell } from 'lucide-react'; // Import Bell icon from lucide-react
import { useState, useEffect, useRef } from 'react'; // Import additional hooks
import './CustomerNavbar.css';

const Header = () => {
    const navigate = useNavigate();  // This must be inside the component
    const [notificationCount, setNotificationCount] = useState(3); // Example notification count
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null); // Reference for the notification area

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

    const handleLogout = () => {
        // Your logout logic here, e.g., clear tokens, redirect, etc.
        console.log("User logged out");
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
        navigate('/');  // This will now work as navigate is defined
    };

    const toggleNotifications = (e) => {
        e.stopPropagation(); // Prevent event from bubbling up
        setShowNotifications(!showNotifications);
    };

    return (
        <>
            <header className="navbar1">
                <div className="logo">
                    <h1>Customer Dashboard</h1>
                </div>
                <div className="actions-container">
                    <div ref={notificationRef} className="notification-container">
                        <div className="notification-button" onClick={toggleNotifications}>
                            <Bell size={20} />
                            {notificationCount > 0 && (
                                <span className="notification-badge">{notificationCount}</span>
                            )}
                        </div>
                        {showNotifications && (
                            <div className="notifications-dropdown">
                                <div className="notification-item">
                                    <p>Your order #1234 has been shipped</p>
                                </div>
                                <div className="notification-item">
                                    <p>New product available in your area</p>
                                </div>
                                <div className="notification-item">
                                    <p>Payment received successfully</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>
        </>
    );
};

export default Header;