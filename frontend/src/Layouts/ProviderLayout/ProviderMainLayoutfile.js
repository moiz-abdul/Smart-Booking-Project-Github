import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProviderNavbar from './ProviderNavbar';
import { useState } from 'react';
import './mainlayout.css'
import { useNavigate } from 'react-router-dom';

const ServiceProviderLayout = ({ children }) => {
    const location = useLocation();
    const username = location.state?.username || 'Guest';

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);



    const navigate = useNavigate();
    return (
        <div>
            <ProviderNavbar username={username} />
            <div className="Provider-dashboard-container  d-flex">
            <div className="main-container">
        
            <div className="dashboard-container">
                <div className="sidebar">
                    <nav className="sidebar-nav">
                        <button className="nav-item" onClick={() => navigate('/provider/dashboard')}>Dashboard</button>
                        <button className="nav-item" onClick={() => navigate('/provider/receivedbookings')}>Recieved Bookings</button>
                        <button className="nav-item" onClick={() => navigate('/provider/cancelbookings')}>Canceled bookings</button>
                        <button className="nav-item" onClick={() => navigate('/provider/confirmedbookings')}>Confirmed bookings</button>
                        <button className="nav-item" onClick={() => navigate('/provider/completedbookings')}>Completed bookings</button>
                        <button className="nav-item" onClick={() => navigate('/provider/revenuereport')}>Revenue Report</button>
                    </nav>
                </div>
               
            </div>
        </div>
                {/* Main Content */}
                <div className="provider-main-content">
                    <div className="admin-middle-content">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceProviderLayout;