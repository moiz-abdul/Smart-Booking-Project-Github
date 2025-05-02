import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import ProfileModal from './addprofile';
import './CustomerNavbar.css';

const Header = ({ username, hasProfile, setHasProfile, initialData }) => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    const dropdownRef = useRef();

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOpenProfileModal = () => {
        setShowProfileModal(true);
    };

    const handleCloseProfileModal = () => {
        setShowProfileModal(false);
    };

    const handleSaveProfile = (formData) => {
        console.log("Saved Profile:", formData);
        setHasProfile(true);
        setShowProfileModal(false);
    };

    const handleEditProfile = () => {
        setShowProfileModal(true);
    };

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <>
            <header className="navbar1">
                <div className="logo">
                    <h1>Customer Dashboard</h1>
                </div>
                <div className="dropdown" ref={dropdownRef}>
                    <button className="dropdown-toggle" onClick={toggleDropdown}>
                        <FaUserCircle /> <span>Hi, {username}</span>
                    </button>
                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            {!hasProfile && (
                                <button onClick={handleOpenProfileModal}>Add Profile</button>
                            )}
                            {hasProfile && (
                                <button onClick={handleEditProfile}>Edit Profile</button>
                            )}
                            <button onClick={handleLogout}>Log Out</button>
                        </div>
                    )}
                </div>
            </header>

            <ProfileModal
                isOpen={showProfileModal}
                onClose={handleCloseProfileModal}
                onSave={handleSaveProfile}
                initialData={hasProfile ? initialData : {}}
                title={hasProfile ? "Edit Profile" : "Add Profile"}
            />
        </>
    );
};

export default Header;