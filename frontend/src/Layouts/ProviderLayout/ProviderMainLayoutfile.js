import React from 'react';
import { useLocation } from 'react-router-dom';
import ProviderNavbar from './ProviderNavbar';
import { useState } from 'react';
import './mainlayout.css';
import { useNavigate } from 'react-router-dom';

const ServiceProviderLayout = ({ children }) => {
    const location = useLocation();
    const username = location.state?.username || 'Guest';
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();

    return (
        <div className="provider-layout">
            <ProviderNavbar username={username} />
            <div className="provider-dashboard-wrapper">
                <div className="provider-sidebar-container">
                    <div className="provider-sidebar">
                        <nav className="provider-sidebar-nav">
                            <button className="provider-nav-item" onClick={() => navigate('/provider/dashboard')}>Dashboard</button>
                            <button className="provider-nav-item" onClick={() => navigate('/provider/receivedbookings')}>Received Bookings</button>
                            <button className="provider-nav-item" onClick={() => navigate('/provider/cancelbookings')}>Canceled bookings</button>
                            <button className="provider-nav-item" onClick={() => navigate('/provider/confirmedbookings')}>Confirmed bookings</button>
                            <button className="provider-nav-item" onClick={() => navigate('/provider/completedbookings')}>Completed bookings</button>
                            <button className="provider-nav-item" onClick={() => navigate('/provider/revenuereport')}>Revenue Report</button>
                        </nav>
                    </div>
                </div>
                <div className="provider-content-area">
                    <div className="provider-main-content">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceProviderLayout;