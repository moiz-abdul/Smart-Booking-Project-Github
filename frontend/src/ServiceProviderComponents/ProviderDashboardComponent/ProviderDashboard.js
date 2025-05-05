import { useState, useEffect, useCallback } from 'react';
import { Button, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import AddServiceModal from '../AddServiceModal/addservicemodal';
import UpdateServiceModal from '../UpdateServiceModal/updateservicemodal';
import './ProviderDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ServiceDashboard = () => {
    const [services, setServices] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    // Get user ID with validation
    const getUserId = useCallback(() => {
        try {
            const userData = localStorage.getItem('userData');
            if (!userData) {
                throw new Error('User not logged in');
            }

            const parsedData = JSON.parse(userData);
            if (!parsedData.id) {
                throw new Error('User ID not found');
            }

            return parsedData.id;
        } catch (err) {
            console.error('User data error:', err);
            setError(err.message);
            return null;
        }
    }, []);

    // Fetch services with useCallback
    const fetchServices = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const userId = getUserId();
            if (!userId) return;

            const response = await axios.get(`http://localhost:5000/api/services`, {
                params: { user_id: userId },
                timeout: 10000 // 10 seconds timeout
            });

            if (!response.data.success) {
                throw new Error(response.data.message || 'Invalid response from server');
            }

            setServices(response.data.data);
        } catch (err) {
            console.error('Fetch services error:', err);
            setError(err.response?.data?.message ||
                err.message ||
                'Failed to load services. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [getUserId]);

    // Effect for fetching services
    useEffect(() => {
        fetchServices();
    }, [fetchServices, retryCount]);

    const handleAddService = () => {
        setCurrentService(null);
        setShowAddModal(true);
    };

    // Update the handleEdit function
    const handleEdit = (service) => {
        console.log('Original Service Object:', service); // Add this for debugging
      
        setCurrentService({
          id: service.id,
          serviceTitle: service.serviceTitle || service.service_title,
          categoryId: service.categoryId || service.category_id,
          description: service.serviceDescription || service.description,
          duration: service.serviceDuration || service.duration_minutes,
          regular_price: service.regular_price,
          memberPrice: service.discountedFee || service.member_price,
          availableDays: Array.isArray(service.availableDays) 
            ? service.availableDays 
            : (service.available_days 
                ? service.available_days.split(',').map(day => day.trim())
                : []),
          timeSlots: [
            service.slot_1_time || service.timeSlots?.[0] || '',
            service.slot_2_time || service.timeSlots?.[1] || '',
            service.slot_3_time || service.timeSlots?.[2] || ''
          ].filter(slot => slot),
          location: service.location || service.serviceLocation || ''
        });
        
        setShowEditModal(true);
      };

      
    const handleDelete = async (serviceId) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;

        try {
            const userId = getUserId();
            if (!userId) return;

            await axios.delete(`http://localhost:5000/api/services/${serviceId}`, {
                params: { user_id: userId }
            });

            setServices(prev => prev.filter(s => s.id !== serviceId));
        } catch (err) {
            console.error('Delete error:', err);
            alert(err.response?.data?.message || 'Failed to delete service');
        }
    };

    const handleSaveSuccess = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setRetryCount(prev => prev + 1); // Trigger refetch
    };

    // Loading state
    if (loading) {
        return (
            <div className="container py-4 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading services...</span>
                </Spinner>
                <p>Loading your services...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="container py-4">
                <Alert variant="danger">
                    <Alert.Heading>Error Loading Services</Alert.Heading>
                    <p>{error}</p>
                    <div className="d-flex justify-content-end">
                        <Button
                            variant="outline-danger"
                            onClick={() => setRetryCount(prev => prev + 1)}
                        >
                            Retry
                        </Button>
                    </div>
                </Alert>
            </div>
        );
    }

    // Time formatting utility
    const formatTimeString = (timeString) => {
        if (!timeString) return '';

        try {
            // Extract hours, minutes, seconds
            const [hours, minutes] = timeString.split(':');

            // Convert to 12-hour format
            const period = hours >= 12 ? 'PM' : 'AM';
            const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM

            return `${hours12}:${minutes} ${period}`;
        } catch (e) {
            console.error('Error formatting time:', e);
            return timeString; // Return original if formatting fails
        }
    };

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>My Services</h1>
                <Button variant="success" onClick={handleAddService}>
                    + Add New Service
                </Button>
            </div>

            <p className="mb-4">
                <strong>Total Services:</strong> {services.length}
            </p>

            <div className="services-list">
                {services.length > 0 ? (
                    services.map(service => (
                        <Card key={service.id} className="mb-4 shadow-sm">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <Card.Title>{service.serviceTitle}</Card.Title>
                                        <Badge bg="info" className="mb-2">
                                            {service.serviceCategory}
                                        </Badge>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => handleEdit(service)}
                                        >
                                            Modify
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDelete(service.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>

                                <Card.Text className="mt-2">
                                    {service.serviceDescription}
                                </Card.Text>

                                <div className="row mt-3">
                                    <div className="col-md-6">
                                        <p>
                                            <strong>Duration:</strong> {service.serviceDuration} mins<br />
                                            <strong>Price:</strong> ${service.serviceFee}
                                            {service.discountedFee && (
                                                <span>, <span className="text-success">${service.discountedFee} (member)</span></span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <p>
                                            <strong>Available:</strong> {service.availableDays.join(', ')}<br />
                                            <strong>Times:</strong> {service.timeSlots.map(slot => formatTimeString(slot)).join(', ')}<br />
                                            {service.location && <span><strong>Location:</strong> {service.location}</span>}
                                        </p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-5 text-muted">
                        <h4>No services found</h4>
                        <p>Click "Add New Service" to get started</p>
                    </div>
                )}
            </div>

            {/* Add Service Modal */}
            <AddServiceModal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSaveSuccess={handleSaveSuccess}
            />

            {/* Update Service Modal */}
            <UpdateServiceModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                service={currentService}
                onUpdateSuccess={handleSaveSuccess}
            />
        </div>
    );
};

export default ServiceDashboard;