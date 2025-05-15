import { useNavigate } from 'react-router-dom';  // Correct import for the hook
import './AdminNavbar.css';

const AdminNavbar = () => {
    const navigate = useNavigate();  // This must be inside the component

    const handleLogout = () => {
        // Your logout logic here, e.g., clear tokens, redirect, etc.
        console.log("User logged out");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate('/admin/login');  // This will now work as navigate is defined
    };

    return (
        <>
            <header className="navbar1">
                <div className="logo">
                    <h1>Admin Panel</h1>
                </div>
                <div className="logout-container">
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>
        </>
    );
};

export default AdminNavbar;