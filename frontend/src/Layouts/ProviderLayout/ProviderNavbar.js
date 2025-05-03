import { useNavigate, Link } from "react-router-dom"; import { useState, useEffect } from "react"; import './ProviderNavbar.css'; import Modal from 'react-bootstrap/Modal'; import Button from 'react-bootstrap/Button'; import Form from 'react-bootstrap/Form'; import axios from 'axios';

const ProviderNavbar = ({ username }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false); const [showProfileModal, setShowProfileModal] = useState(false); const [profileExists, setProfileExists] = useState(false); const [profileData, setProfileData] = useState({ business_name: '', email: '', phone: '', address: '', description: '', user_id: '' }); const [isSubmitting, setIsSubmitting] = useState(false); const [error, setError] = useState(null); const navigate = useNavigate();

    // Fetch user data from localStorage
    const fetchUserData = () => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            setProfileData(prev => ({
                ...prev,
                user_id: userData.id || ''
            }));
        }
    };

    // Check profile when user_id is available
    const checkProfileExists = async () => {
        if (!profileData.user_id) return;

        try {
            const response = await axios.get(`http://localhost:5000/api/providerprofile/${profileData.user_id}`);
            if (response.data.success) {
                setProfileExists(true);
                setProfileData(prev => ({
                    ...prev,
                    ...response.data.profile
                }));
            }
        } catch (error) {
            console.error("Error checking profile:", error);
            setError('Failed to check profile. Please try again.');
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (profileData.user_id) {
            checkProfileExists();
        }
    }, [profileData.user_id]);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const payload = {
                ...profileData
            };

            const response = await axios.post(
                'http://localhost:5000/api/providerprofile',
                payload
            );

            if (response.data.success) {
                setProfileExists(true);
                setShowProfileModal(false);
                alert(response.data.message);
            } else {
                setError(response.data.message || "Failed to save profile");
            }
        } catch (error) {
            console.error("Error:", error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to save profile. Please try again.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const onLogout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-green">
            <span className="navbar-brand mb-0 h1 bg-warning">Service Provider Panel</span>
            <div className="container-fluid">
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav mx-auto">
                        <Link className="nav-link" to="/provider/dashboard">
                            Provider Dashboard
                        </Link>
                        <Link className="nav-link" to="/provider/receivedbookings">
                            Received Bookings
                        </Link>
                        <Link className="nav-link" to="/provider/confirmbookings">
                            Confirm Bookings
                        </Link>
                        <Link className="nav-link" to="/provider/cancelbookings">
                            Cancel Bookings
                        </Link>
                    </div>
                    <div className="navbar-buttons d-flex">
                        <div className="dropdown">
                            <button
                                className="btn btn-outline-light dropdown-toggle dropdownbutton"
                                type="button"
                                onClick={toggleDropdown}
                            >
                                Hi Welcome, {username}
                            </button>
                            {dropdownOpen && (
                                <div className="dropdown-menu dropdown-menu-end show">
                                    {!profileExists ? (
                                        <button
                                            className="dropdown-item"
                                            onClick={() => setShowProfileModal(true)}
                                        >
                                            Add Profile Info
                                        </button>
                                    ) : (
                                        <button
                                            className="dropdown-item"
                                            onClick={() => setShowProfileModal(true)}
                                        >
                                            Edit Profile Info
                                        </button>
                                    )}
                                    <button className="dropdown-item" onClick={onLogout}>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Modal */}
            <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{profileExists ? 'Edit Profile' : 'Add Profile'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <Form onSubmit={handleSaveProfile}>
                        <input type="hidden" name="user_id" value={profileData.user_id} />

                        <Form.Group className="mb-3">
                            <Form.Label>Business Name *</Form.Label>
                            <Form.Control
                                type="text"
                                name="business_name"
                                value={profileData.business_name}
                                onChange={(e) => setProfileData({ ...profileData, business_name: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email *</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone *</Form.Label>
                            <Form.Control
                                type="tel"
                                name="phone"
                                value={profileData.phone}
                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Address *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="address"
                                value={profileData.address}
                                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={profileData.description}
                                onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                            />
                        </Form.Group>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save Profile'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </nav>
    );
};

export default ProviderNavbar;