// CustomerDashboard.js (acts as layout now)
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './CustomerNavbar';
import './CustomerMainLayoutfile.css';

const CustomerDashboard = () => {
    const [hasProfile, setHasProfile] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="main-container">
            <Header username="Tahir" hasProfile={hasProfile} setHasProfile={setHasProfile} />
            <div className="dashboard-container">
                <div className="sidebar">
                    <nav className="sidebar-nav">
                        <button className="nav-item" onClick={() => navigate('/CustomerDashboard/Dashboard')}>Dashboard</button>
                        <button className="nav-item" onClick={() => navigate('/CustomerDashboard/ConfirmedBookings')}>Confirm Bookings</button>
                        <button className="nav-item" onClick={() => navigate('/CustomerDashboard/CancelBookings')}>Cancel Bookings</button>
                    </nav>
                </div>
                <div className="content-area">
                    {/* Outlet shows the active nested page here */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
