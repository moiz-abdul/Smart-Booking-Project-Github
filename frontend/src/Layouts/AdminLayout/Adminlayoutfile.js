import React from 'react';
import { useState } from 'react';
import AdminNavbar from './AdminNavbar';
import './Adminlayoutfile.css'
import { useLocation } from 'react-router-dom';
import { Outlet, useNavigate } from 'react-router-dom';
const AdminLayout = ({ children }) => {
    const location = useLocation();
    const username = location.state?.username || 'Guest';
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const onLogout = () => {
        // Implement logout logic

    };
    const navigate = useNavigate();
    return (

        <div>
            <AdminNavbar />
            <div className="admin-dashboard-container d-flex">
                {/* Sidebar */}
                <div className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>

                    <div className="sidebar-content">

                        <div className="sidebar">
                            <nav className="sidebar-nav">
                                <button className="nav-item" onClick={() => navigate('/registeradmin/usermanagement')}>User Management</button>
                                <button className="nav-item" onClick={() => navigate('/registeradmin/reservationmanagement')}>Reservation Management</button>
                                <button className="nav-item" onClick={() => navigate('/registeradmin/reservedperiods')}>Reserved Periods</button>
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="admin-main-content">
                    <div className='admin-middle-content'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;