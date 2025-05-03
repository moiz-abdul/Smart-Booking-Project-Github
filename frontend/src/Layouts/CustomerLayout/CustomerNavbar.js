import { useNavigate } from 'react-router-dom';  // Correct import for the hook
import './CustomerNavbar.css';

const Header = () => {
    const navigate = useNavigate();  // This must be inside the component

    const handleLogout = () => {
        // Your logout logic here, e.g., clear tokens, redirect, etc.
        console.log("User logged out");
        navigate('/');  // This will now work as navigate is defined
    };

    return (
        <>
            <header className="navbar1">
                <div className="logo">
                    <h1>Customer Dashboard</h1>
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

export default Header;